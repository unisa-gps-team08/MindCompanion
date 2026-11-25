import json
import os
import re
from pathlib import Path
from urllib.error import URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


RIFERIMENTO_ISSUE = r"(?<![\w/])#([1-9][0-9]{0,9})\b"
CHIUSURA_ISSUE = r"\b(?:close[sd]?|fix(?:es|ed)?|resolve[sd]?)\s*:?\s*" + RIFERIMENTO_ISSUE
CONTROLLI = {
    "lint_e_build": "Esegui la build Next.js",
    "test_integrazione": "Verifica Next.js e MongoDB",
}
ERRORI_API = (URLError, TimeoutError)


def leggi_api(percorso):
    indirizzo = f"{os.environ['GITHUB_API_URL']}/repos/{os.environ['GITHUB_REPOSITORY']}"
    richiesta = Request(
        indirizzo + percorso,
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {os.environ['GH_TOKEN']}",
            "User-Agent": "mindcompanion-review-context",
        },
    )
    with urlopen(richiesta, timeout=10) as risposta:
        return json.load(risposta)


def issue_citate(commento, descrizione, numero_pr):
    numeri = re.findall(RIFERIMENTO_ISSUE, commento)
    numeri += re.findall(CHIUSURA_ISSUE, descrizione, re.IGNORECASE)
    return [
        numero for numero in dict.fromkeys(map(int, numeri)) if numero != numero_pr
    ][:5]


def leggi_issue(numero):
    try:
        issue = leggi_api(f"/issues/{numero}")
    except ERRORI_API:
        return {"numero": numero, "stato": "indisponibile"}
    if "pull_request" in issue or issue["repository_url"] != (
        f"{os.environ['GITHUB_API_URL']}/repos/{os.environ['GITHUB_REPOSITORY']}"
    ):
        return {"numero": numero, "stato": "non è una issue del repository"}
    testo = issue["body"] or ""
    return {
        "numero": numero,
        "titolo": issue["title"],
        "url": issue["html_url"],
        "testo": testo[:6000],
        "testo_troncato": len(testo) > 6000,
    }


def leggi_ci(numero_pr, sha):
    query = urlencode({"head_sha": sha, "event": "pull_request", "per_page": 50})
    try:
        run = leggi_api(f"/actions/workflows/ci.yml/runs?{query}")["workflow_runs"]
        corrispondenti = [
            risultato
            for risultato in run
            if risultato["head_sha"] == sha
            and risultato["event"] == "pull_request"
            and any(pr["number"] == numero_pr for pr in risultato["pull_requests"])
        ]
        if not corrispondenti:
            return {"stato": "nessun run associato a questa PR e a questo commit"}
        ultimo = max(corrispondenti, key=lambda risultato: (risultato["created_at"], risultato["id"]))
        esito = {
            "url": ultimo["html_url"],
            "tentativo": ultimo["run_attempt"],
            "stato": ultimo["status"],
            "esito": ultimo["conclusion"],
        }
        percorso = f"/actions/runs/{ultimo['id']}/attempts/{ultimo['run_attempt']}/jobs"
        jobs = leggi_api(percorso)["jobs"]
    except ERRORI_API:
        return {"stato": "risultati CI indisponibili"}

    build = next((job for job in jobs if job["name"] == "build"), None)
    passaggi = {step["name"]: step for step in (build["steps"] or [])} if build else {}
    esito["controlli"] = {
        controllo: (
            {"stato": passaggi[nome]["status"], "esito": passaggi[nome]["conclusion"]}
            if nome in passaggi else {"stato": "esito del passaggio indisponibile"}
        )
        for controllo, nome in CONTROLLI.items()
    }
    return esito


def prepara(evento, repository):
    numero_pr = (evento.get("pull_request") or {}).get("number")
    if not numero_pr and (evento.get("issue") or {}).get("pull_request"):
        numero_pr = evento["issue"]["number"]
    if not numero_pr:
        return {"stato": "la menzione non appartiene a una pull request"}

    try:
        pr = leggi_api(f"/pulls/{numero_pr}")
    except ERRORI_API:
        return {"stato": "dati della PR indisponibili"}
    sha = pr["head"]["sha"]
    if (
        (pr["head"]["repo"] or {}).get("full_name") != repository
        or not re.fullmatch(r"[0-9a-f]{40}", sha)
    ):
        return {"stato": "contesto disponibile solo per PR interne"}

    numeri = issue_citate(evento["comment"]["body"], pr["body"] or "", numero_pr)
    return {
        "pull_request": numero_pr,
        "commit": sha,
        "issue": [leggi_issue(numero) for numero in numeri],
        "ci": leggi_ci(numero_pr, sha),
    }


if __name__ == "__main__":
    evento = json.loads(Path(os.environ["GITHUB_EVENT_PATH"]).read_text(encoding="utf-8"))
    riscontro = prepara(evento, os.environ["GITHUB_REPOSITORY"])
    destinazione = Path(os.environ["RUNNER_TEMP"]) / "mindcompanion-review"
    destinazione.mkdir(exist_ok=True)
    (destinazione / "contesto.json").write_text(
        json.dumps(riscontro, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
