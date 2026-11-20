"""Prepare a bounded Claude task and publish its result from a separate job."""

import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import subprocess
import sys
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


EVENT = json.loads(Path(os.environ["GITHUB_EVENT_PATH"]).read_text(encoding="utf-8"))
REPOSITORY = os.environ["GITHUB_REPOSITORY"]
API = f'{os.environ["GITHUB_API_URL"]}/repos/{REPOSITORY}'
PHASE = os.environ["AGENT_PHASE"]
PR_EVENT = EVENT.get("pull_request")
TASK_BRANCH = re.fullmatch(r"agent/issue-([1-9][0-9]*)", PR_EVENT["head"]["ref"]) if PR_EVENT else None
NUMBER = int(TASK_BRANCH[1]) if TASK_BRANCH else EVENT.get("issue", {}).get("number")
BRANCH = PR_EVENT["head"]["ref"] if PR_EVENT else f"agent/issue-{NUMBER}"
BASE_SHA = PR_EVENT["base"]["sha"] if PR_EVENT else os.environ["GITHUB_SHA"]
DEFAULT_BRANCH = EVENT["repository"]["default_branch"]
ACTOR = os.environ["GITHUB_ACTOR"]
INPUTS = Path(".agent-input")
RESULT = Path(os.environ["RUNNER_TEMP"]) / "agent-result"
MAX_PATCH_BYTES = 350_000
PLAN_MARKER = re.compile(r"<!-- mindcompanion-plan v1 ([0-9a-f]{64}) ([0-9a-f]{40}) -->")
SHA = re.compile(r"[0-9a-f]{40}")
PATH_PATTERN = re.compile(r"[A-Za-z0-9_][A-Za-z0-9_./-]*")
PROTECTED = re.compile(
    r"(^|/)(?:\.[^/]+|AGENTS\.md|CLAUDE\.md|GEMINI\.md|CODEOWNERS|"
    r"package(?:-lock)?\.json|pnpm-lock\.yaml|pnpm-workspace\.yaml|"
    r"yarn\.lock|bun\.lockb?|pom\.xml|(?:build|settings)\.gradle(?:\.kts)?|"
    r"requirements[^/]*\.txt|pyproject\.toml|uv\.lock|poetry\.lock|"
    r"Pipfile(?:\.lock)?|Gemfile(?:\.lock)?|(?:go|Cargo)\.(?:mod|sum|toml|lock)|"
    r"Dockerfile[^/]*|[Mm]akefile|[^/]+\.(?:sh|ps1|cmd|bat|exe|dll|jar))($|/)",
    re.IGNORECASE,
)

INSTRUCTIONS = {
    "piano": (
        "Controlla la coerenza tra le specifiche, i modelli e i test frame disponibili. "
        "Indica eventuali lacune che impediscono il lavoro. Se il task è pronto, "
        "proponi un piano con file, comportamenti, dipendenze e test frame da coprire. "
        "Se mancano decisioni, segnala che il piano richiede correzioni prima dell'approvazione."
    ),
    "implementazione": (
        "Implementa il piano approvato entro i percorsi dell'ambito del codice. "
        "Usa solo le dipendenze presenti. Lascia i test al tester. "
        "Nel report descrivi le modifiche e i controlli da eseguire in CI."
    ),
}
ROLE_FILES = {"test": "tester", "revisione": "revisore"}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def git(*args):
    return subprocess.check_output(
        ["git", *args], text=True, encoding="utf-8", errors="strict"
    )


def api(path, *, body=None, accept="application/vnd.github+json"):
    request = Request(
        API + path,
        headers={
            "Accept": accept,
            "Authorization": f'Bearer {os.environ["GH_TOKEN"]}',
            "User-Agent": "mindcompanion-agent-workflow",
            "Content-Type": "application/json",
        },
        data=None if body is None else json.dumps(body).encode(),
    )
    with urlopen(request, timeout=30) as response:
        data = response.read()
    return json.loads(data) if accept.endswith("+json") else data


def check_write_access(login):
    require(re.fullmatch(r"[A-Za-z0-9-]+", login), "Serve un account GitHub umano.")
    permission = api(f"/collaborators/{login}/permission")["permission"]
    require(permission in {"admin", "write"}, f"Accesso Write richiesto per {login}.")


def check_issue():
    check_write_access(ACTOR)
    if NUMBER is None:
        require(PHASE == "revisione" and PR_EVENT, "La PR deve essere collegata a un task agente.")
        return None
    issue = api(f"/issues/{NUMBER}")
    labels = {label["name"] for label in issue["labels"]}
    require(issue["state"] == "open", "L'issue deve essere aperta.")
    issue_phase = "implementazione" if PR_EVENT else PHASE
    require({"task-agente", f"fase:{issue_phase}"} <= labels, "Le label dell'issue sono cambiate.")
    if PR_EVENT is None:
        require(issue_fingerprint(issue) == issue_fingerprint(EVENT["issue"]),
                "L'issue è cambiata dopo l'avvio. Controllala e riapplica la label.")
    if issue["user"]["login"] != ACTOR:
        check_write_access(issue["user"]["login"])
    return issue


def issue_fingerprint(issue):
    title_and_body = [issue["title"], issue["body"] or ""]
    return hashlib.sha256(json.dumps(title_and_body).encode()).hexdigest()


def parse_section(body, label):
    match = re.search(
        rf"(?ms)^### {re.escape(label)}\s*\n(.*?)(?=^### |\Z)", body.replace("\r\n", "\n")
    )
    require(match and match[1].strip() not in {"", "_No response_"},
            f"Compila il campo «{label}».")
    return match[1].strip()


def task_paths(body, label, *, source=False):
    paths = parse_section(body, label).splitlines()
    require(1 <= len(paths) <= 30, f"Indica tra 1 e 30 percorsi in «{label}».")
    result = []
    for line in paths:
        name = line.strip().removeprefix("- ").strip().strip("`")
        normalized = name.rstrip("/")
        require(
            PATH_PATTERN.fullmatch(name)
            and normalized == str(PurePosixPath(normalized))
            and ".." not in PurePosixPath(normalized).parts,
            f"Percorso non valido in «{label}».",
        )
        if source:
            require(name.startswith("docs/") and Path(name).suffix.lower() in {".md", ".puml", ".mmd", ".txt"},
                    f"Usa file testuali già versionati sotto docs/ in «{label}».")
            require(Path(name).is_file() and not Path(name).is_symlink()
                    and git("ls-files", "--error-unmatch", "--", name).strip() == name,
                    f"Artefatto assente nella revisione corrente: {name}")
        else:
            require(
                "/" in name
                and not name.startswith("docs/")
                and not PROTECTED.search(normalized),
                f"Percorso fuori ambito in «{label}»: {name}",
            )
        result.append(name)
    return result


def approved_plan(issue, base):
    # The machine marker must start a comment posted by this repository's GITHUB_TOKEN.
    page = 1
    latest = None
    while True:
        comments = api(f"/issues/{NUMBER}/comments?per_page=100&page={page}")
        for comment in comments:
            if comment["user"]["login"] == "github-actions[bot]":
                marker = PLAN_MARKER.match(comment["body"] or "")
                if marker and (latest is None or comment["id"] > latest[0]["id"]):
                    latest = (comment, marker)
        if len(comments) < 100:
            break
        page += 1
    require(latest is not None, "Esegui prima fase:piano e fai approvare il commento.")
    comment, marker = latest
    require(marker[1] == issue_fingerprint(issue) and marker[2] == base,
            "Il piano non corrisponde all'issue e al commit di riferimento. Rigenera il piano.")
    require(comment["body"][marker.end():].strip(), "Il piano pubblicato è vuoto.")
    link = f'{os.environ["GITHUB_SERVER_URL"]}/{REPOSITORY}/issues/{NUMBER}#issuecomment-{comment["id"]}'
    return comment["body"][marker.end():].strip(), link


def draft_or_review_pr():
    if PHASE == "implementazione":
        filters = urlencode({"state": "open", "head": f"{REPOSITORY.split('/')[0]}:{BRANCH}"})
        pulls = api(f"/pulls?{filters}")
        require(not pulls, "Esiste già una PR per il task. Controllala prima di proseguire.")
        try:
            api(f"/git/ref/heads/{BRANCH}")
        except HTTPError as error:
            if error.code != 404:
                raise
        else:
            raise ValueError(f"Esiste già {BRANCH}. Controlla il branch e apri una PR in bozza.")
        return None
    require(PR_EVENT is not None, "La fase deve partire dalla pull request.")
    pr = api(f'/pulls/{PR_EVENT["number"]}')
    require(pr["state"] == "open"
            and (pr["head"]["repo"] or {}).get("full_name") == REPOSITORY
            and pr["base"]["ref"] == DEFAULT_BRANCH
            and pr["head"]["ref"] == BRANCH, "La PR non corrisponde al task.")
    require(pr["draft"] == (PHASE == "test"),
            "Mantieni la PR in bozza per i test e rendila pronta prima della revisione.")
    require(SHA.fullmatch(pr["head"]["sha"]) and pr["head"]["sha"] == PR_EVENT["head"]["sha"],
            "La PR è cambiata dopo l'avvio. Riavvia la fase dalla PR aggiornata.")
    if PHASE == "test":
        require(TASK_BRANCH and any(label["name"] == "fase:test" for label in pr["labels"]),
                "Aggiungi fase:test alla PR in bozza del task.")
    return pr


def write_state(state):
    (RESULT / "state.json").write_text(json.dumps(state), encoding="utf-8")


def read_state():
    state = json.loads((RESULT / "state.json").read_text(encoding="utf-8"))
    require(state["phase"] == PHASE and state["issue_number"] == NUMBER,
            "Il risultato appartiene a un'altra fase o issue.")
    return state


def prepare():
    require(PHASE in INSTRUCTIONS or PHASE in ROLE_FILES, "Fase sconosciuta.")
    issue = check_issue()
    base = BASE_SHA
    require(git("rev-parse", "HEAD").strip() == base, "Checkout del commit di riferimento fallito.")
    pr = None if PHASE == "piano" else draft_or_review_pr()
    reference = base
    if pr and issue:
        # Implementation is a single commit from the approved base; test commits
        # may follow it. The compare API is queried without fetching PR contents.
        comparison = api(f'/compare/{base}...{pr["head"]["sha"]}')
        reference = comparison["merge_base_commit"]["sha"]
        require(comparison["status"] == "ahead" or comparison["status"] == "diverged",
                "Non ci sono modifiche da verificare nella PR.")
    require(SHA.fullmatch(reference), "Commit di riferimento non valido.")
    plan, plan_link = ("", "")
    if issue and PHASE != "piano":
        plan, plan_link = approved_plan(issue, reference)
    if reference != base:
        # Only fetch the common ancestor, never the implementation branch.
        git("fetch", "--depth=1", "--no-tags", "origin", reference)
        git("checkout", "--detach", reference)
    if PHASE == "test":
        git("sparse-checkout", "set", "docs", ".github/scripts", ".claude/agents")
    specs, contracts, code, tests = [], [], [], []
    if issue:
        body = issue["body"] or ""
        specs = task_paths(body, "Specifiche", source=True)
        contracts = task_paths(body, "Interfacce e test frame", source=True)
        code = task_paths(body, "Ambito del codice")
        tests = task_paths(body, "Ambito dei test")
        acceptance = parse_section(body, "Criteri di accettazione")
        use_case = parse_section(body, "Identificativo del caso d'uso")
    if PHASE == "implementazione":
        require("fase:piano" in {label["name"] for label in issue["labels"]},
                "Mantieni la label fase:piano quando approvi il piano.")

    INPUTS.mkdir()
    RESULT.mkdir()
    if PHASE == "revisione":
        diff = api(f'/compare/{reference}...{pr["head"]["sha"]}', accept="application/vnd.github.diff")
        require(0 < len(diff) <= MAX_PATCH_BYTES, "Diff vuota o troppo grande. Dividi il task.")
        (INPUTS / "review.diff").write_bytes(diff)
    if PHASE == "test":
        # Pass only the explicit test inputs, never the implementation or plan.
        details = "\n".join([
            "Caso d'uso e specifiche", *specs, "Interfacce e test frame", *contracts,
            "Ambito dei test", *tests,
            "Criteri di accettazione", acceptance
        ])
    elif issue:
        details = f'{issue["title"]}\n\n{body}\n\n{plan}'
    else:
        details = f'{pr["title"]}\n\n{pr["body"] or ""}'
    if PHASE in ROLE_FILES:
        role_file = Path(".claude/agents") / f"{ROLE_FILES[PHASE]}.md"
        instructions = role_file.read_text(encoding="utf-8").split("---", 2)[2].strip()
    else:
        instructions = INSTRUCTIONS[PHASE]
    task = f"# Fase {PHASE}\n\n{instructions}\n\n## Contesto\n\n{details}\n"
    (INPUTS / "task.md").write_text(task, encoding="utf-8")
    write_state({
        "phase": PHASE, "issue_number": NUMBER, "fingerprint": issue_fingerprint(issue) if issue else None,
        "base": base, "pr": pr["number"] if pr else None,
        "head": pr["head"]["sha"] if pr else None, "title": (issue or pr)["title"],
        "code": code, "tests": tests,
        "use_case": use_case if issue else "", "artifacts": list(dict.fromkeys([*specs, *contracts])),
        "plan_link": plan_link, "spec_revision": reference,
    })
    tools = "Read,Glob,Grep"
    if PHASE == "implementazione":
        tools += ",Write,Edit"
    elif PHASE == "test":
        tools += ",Write"
    with Path(os.environ["GITHUB_OUTPUT"]).open("a", encoding="utf-8") as output:
        print(f"phase={PHASE}\ntools={tools}", file=output)


def within(name, paths):
    return any(
        name.startswith(path) if path.endswith("/") else name == path for path in paths
    )


def check_staged(paths, excluded=()):
    # Disable rename detection so both old and new paths must be in scope.
    delta = git("diff", "--cached", "--raw", "--no-renames", "-z").rstrip("\0")
    require(delta, "L'agente non ha prodotto modifiche.")
    fields = iter(delta.split("\0"))
    for metadata, name in zip(fields, fields, strict=True):
        before, after, _, _, status = metadata[1:].split()
        require(PATH_PATTERN.fullmatch(name) and within(name, paths) and not within(name, excluded)
                and not PROTECTED.search(name), f"Modifica fuori ambito: {name}")
        require({before, after} <= {"000000", "100644"} and status in {"A", "M", "D"},
                f"Tipo di modifica non consentito: {name}")
        if PHASE == "test":
            require(status == "A", f"Il tester può solo aggiungere file: {name}")
    for item in git("diff", "--cached", "--numstat", "-z").rstrip("\0").split("\0"):
        require(not item.startswith("-\t-\t"), "Il risultato contiene file binari.")
    git("diff", "--cached", "--check")


def package():
    state = read_state()
    result = json.loads(os.environ.get("CLAUDE_RESULT") or "{}")
    report = result.get("report")
    require(isinstance(report, str) and report.strip(), "Claude non ha restituito un report.")
    (RESULT / "report.md").write_text(report.strip()[:28_000], encoding="utf-8")
    if PHASE in {"implementazione", "test"}:
        git("add", "--sparse", "-A", "--", ".", ":(exclude).agent-input")
        check_patch_scope(state)
        patch = subprocess.check_output(
            ["git", "diff", "--cached", "--no-ext-diff", "--binary", "--full-index", "--no-renames"]
        )
        require(0 < len(patch) <= MAX_PATCH_BYTES, "Patch vuota o troppo grande. Dividi il task.")
        (RESULT / "changes.patch").write_bytes(patch)


def check_patch_scope(state):
    if PHASE == "test":
        check_staged(state["tests"])
    else:
        check_staged(state["code"], excluded=state["tests"])


def comment_report(state, report):
    if PHASE == "piano":
        body = f'<!-- mindcompanion-plan v1 {state["fingerprint"]} {state["base"]} -->\n'
        body += f"## Piano proposto\n\n{report}"
        body += "\n\nDopo la verifica, applica `fase:implementazione` per approvare il piano."
        endpoint = f"/issues/{NUMBER}/comments"
    else:
        pr = draft_or_review_pr()
        require(pr["number"] == state["pr"] and pr["head"]["sha"] == state["head"],
                "La PR è cambiata. Segna di nuovo la PR pronta per revisione.")
        body = f'## Revisione del commit `{state["head"][:12]}`\n\n{report}'
        endpoint = f'/issues/{state["pr"]}/comments'
    api(endpoint, body={"body": body})


def explain_manual_pull_request():
    branch_comparison = f"{DEFAULT_BRANCH}...{BRANCH}"
    action = f"[Apri la PR in bozza]({os.environ['GITHUB_SERVER_URL']}/{REPOSITORY}/compare/{branch_comparison}?expand=1)"
    instructions = (
        f"## Branch pronto per la pull request\n\n{action} e aggiungi "
        f"`Closes #{NUMBER}` alla descrizione. Dopo averla creata, applica "
        "`fase:test` alla PR."
    )
    with Path(os.environ["GITHUB_STEP_SUMMARY"]).open("a", encoding="utf-8") as summary:
        print(instructions, file=summary)


def pull_request_creation_disabled(error):
    if error.code not in {403, 422}:
        return False
    try:
        message = json.loads(error.read()).get("message", "")
    except (ValueError, AttributeError):
        return False
    return (isinstance(message, str)
            and "github actions is not permitted to create or approve pull requests" in message.lower())


def apply_patch(state):
    patch = RESULT / "changes.patch"
    require(0 < patch.stat().st_size <= MAX_PATCH_BYTES, "Dimensione della patch non valida.")
    if PHASE == "test":
        require(SHA.fullmatch(state["head"]), "Commit della PR non valido.")
        git("fetch", "--no-tags", "origin", f"refs/heads/{BRANCH}")
        require(git("rev-parse", "FETCH_HEAD").strip() == state["head"],
                "Il commit remoto della PR è cambiato.")
        git("checkout", "--detach", state["head"])
    else:
        require(git("rev-parse", "HEAD").strip() == state["base"],
                "Checkout del commit del piano fallito.")

    git("apply", "--index", "--check", str(patch))
    git("apply", "--index", str(patch))
    check_patch_scope(state)


def verify():
    apply_patch(read_state())
    require(Path(".github/scripts/verify-project").is_file(),
            "Configura .github/scripts/verify-project per eseguire build e test.")


def pull_request_body(state, report):
    template = Path(".github/pull_request_template.md").read_text(encoding="utf-8")
    artifacts = "\n".join(f"- `{path}`" for path in state["artifacts"])
    parts = {
        "caso": f'{state["use_case"]}\n\nCloses #{NUMBER}',
        "artefatti": f'Commit di riferimento `{state["spec_revision"][:12]}`\n\n{artifacts}',
        "modalita": f'- Implementazione Claude Code. [Piano]({state["plan_link"]}) approvato da @{ACTOR}.\n'
                    "- Test in una sessione separata con gli artefatti della specifica.",
        "verifica": (
            "- Build e test preliminari superati.\n"
            "- Applica `fase:test` a questa PR mentre è in bozza.\n"
            "- Per una seconda revisione tecnica puoi richiedere Copilot da **Reviewers**."
        ),
    }
    for key, value in parts.items():
        placeholder = f"<!-- agente:{key} -->"
        require(placeholder in template, f"Campo mancante nel template PR: {key}")
        template = template.replace(placeholder, value)
    return f"{template.rstrip()}\n\n## Implementazione\n\n{report}"


def publish_changes(state, report):
    pr = draft_or_review_pr()
    if PHASE == "test":
        require(pr["number"] == state["pr"] and pr["head"]["sha"] == state["head"],
                "La PR è cambiata durante il lavoro. Riapplica fase:test.")
    git("config", "user.name", "github-actions[bot]")
    git("config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com")
    apply_patch(state)
    git("commit", "-m", f"Agent: {PHASE} per issue #{NUMBER}")
    if PHASE == "implementazione":
        # An empty expected ref creates the branch only if it does not exist.
        lease = f"--force-with-lease=refs/heads/{BRANCH}:"
    else:
        lease = f"--force-with-lease=refs/heads/{BRANCH}:{state['head']}"
    git("-c", "credential.helper=", "-c", "credential.helper=!gh auth git-credential",
        "push", lease, "origin", f"HEAD:refs/heads/{BRANCH}")
    if PHASE == "implementazione":
        try:
            pr = api("/pulls", body={
                "title": state["title"], "head": BRANCH, "base": DEFAULT_BRANCH, "draft": True,
                "body": pull_request_body(state, report),
            })
        except HTTPError as error:
            if pull_request_creation_disabled(error):
                explain_manual_pull_request()
                return
            print(f"Branch pubblicato. Apri una PR in bozza da {BRANCH} verso "
                  f"{DEFAULT_BRANCH} e aggiungi Closes #{NUMBER}.", file=sys.stderr)
            raise
        print(f'PR in bozza #{pr["number"]}.')
    else:
        outcome = os.environ["VERIFY_OUTCOME"]
        run_url = f'{os.environ["GITHUB_SERVER_URL"]}/{REPOSITORY}/actions/runs/{os.environ["GITHUB_RUN_ID"]}'
        status = "superata" if outcome == "success" else "fallita"
        api(f'/issues/{pr["number"]}/comments', body={
            "body": (
                f"## Test dei frame\n\n{report}\n\n"
                f"Verifica applicativa **{status}**. [Log di build e test]({run_url})."
            )
        })


def publish():
    state = read_state()
    issue = check_issue()
    if issue is not None:
        require(issue_fingerprint(issue) == state["fingerprint"], "La specifica è cambiata.")
    report = (RESULT / "report.md").read_text(encoding="utf-8")
    if PHASE in {"piano", "revisione"}:
        comment_report(state, report)
    else:
        publish_changes(state, report)


if __name__ == "__main__":
    commands = {"prepare": prepare, "package": package, "verify": verify, "publish": publish}
    try:
        commands[sys.argv[1]]()
    except (ValueError, HTTPError, subprocess.CalledProcessError) as error:
        print(f"Workflow agentico: {error}", file=sys.stderr)
        raise SystemExit(1) from None
