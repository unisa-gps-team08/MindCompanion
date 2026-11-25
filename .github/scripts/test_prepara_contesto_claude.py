import os
import runpy
import unittest
from pathlib import Path
from unittest.mock import patch


SCRIPT = Path(__file__).with_name("prepara-contesto-claude.py")
REPOSITORY = "unisa-gps-team08/MindCompanion"
API = f"https://api.github.com/repos/{REPOSITORY}"
SHA = "1" * 40


def run_ci(numero, pr=35, sha=SHA, stato="completed"):
    return {
        "id": numero,
        "event": "pull_request",
        "head_sha": sha,
        "pull_requests": [{"number": pr}],
        "created_at": f"2026-01-01T10:00:{numero:02}Z",
        "run_attempt": 2,
        "status": stato,
        "conclusion": "success" if stato == "completed" else None,
        "html_url": f"https://github.com/{REPOSITORY}/actions/runs/{numero}",
    }


class TestContestoClaude(unittest.TestCase):
    def setUp(self):
        self.script = runpy.run_path(str(SCRIPT))
        self.prepara = self.script["prepara"]
        self.evento = {
            "issue": {"number": 35, "pull_request": {"url": f"{API}/pulls/35"}},
            "comment": {"body": "@claude verifica #18 e altro/progetto#42"},
        }
        self.pr = {
            "head": {"sha": SHA, "repo": {"full_name": REPOSITORY}},
            "body": "Closes #18",
        }
        self.issue = {
            "repository_url": API,
            "html_url": f"https://github.com/{REPOSITORY}/issues/18",
            "title": "Titolo di prova",
            "body": "Criterio di prova",
        }
        ambiente = patch.dict(
            os.environ,
            GITHUB_API_URL="https://api.github.com",
            GITHUB_REPOSITORY=REPOSITORY,
        )
        ambiente.start()
        self.addCleanup(ambiente.stop)

    def raccogli(self, risposte, evento=None):
        chiamate = []

        def api(percorso):
            chiamate.append(percorso)
            risposta = risposte[percorso]
            if isinstance(risposta, Exception):
                raise risposta
            return risposta

        with patch.dict(self.prepara.__globals__, leggi_api=api):
            contesto = self.prepara(self.evento if evento is None else evento, REPOSITORY)
        self.assertEqual(chiamate, list(risposte))
        return contesto

    def percorso_ci(self):
        return f"/actions/workflows/ci.yml/runs?head_sha={SHA}&event=pull_request&per_page=50"

    def test_risolve_issue_e_ultimo_run_della_pr_sullo_stesso_commit(self):
        passaggi = [
            {"name": nome, "status": "completed", "conclusion": "success"}
            for nome in self.script["CONTROLLI"].values()
        ]
        contesto = self.raccogli({
            "/pulls/35": self.pr,
            "/issues/18": self.issue,
            self.percorso_ci(): {"workflow_runs": [
                run_ci(8, pr=42), run_ci(7, sha="2" * 40), run_ci(3), run_ci(2),
            ]},
            "/actions/runs/3/attempts/2/jobs": {"jobs": [{"name": "build", "steps": passaggi}]},
        })
        self.assertEqual(contesto["issue"][0]["testo"], "Criterio di prova")
        self.assertEqual(contesto["ci"]["tentativo"], 2)
        for controllo in contesto["ci"]["controlli"].values():
            self.assertEqual(controllo["esito"], "success")

    def test_commento_inline_con_issue_collegata_e_ci_in_corso(self):
        contesto = self.raccogli({
            "/pulls/35": self.pr,
            "/issues/18": self.issue,
            self.percorso_ci(): {"workflow_runs": [run_ci(3, stato="in_progress")]},
            "/actions/runs/3/attempts/2/jobs": {"jobs": [{"name": "build", "steps": []}]},
        }, {"pull_request": {"number": 35}, "comment": {"body": "@claude verifica"}})
        self.assertEqual(contesto["issue"][0]["numero"], 18)
        self.assertEqual(contesto["ci"]["stato"], "in_progress")
        self.assertIsNone(contesto["ci"]["esito"])
        self.assertNotIn("esito", contesto["ci"]["controlli"]["lint_e_build"])

    def test_segnala_risposte_api_indisponibili(self):
        contesto = self.raccogli({
            "/pulls/35": self.pr,
            "/issues/18": {"title": "Risposta incompleta"},
            self.percorso_ci(): ConnectionResetError(),
        })
        self.assertEqual(contesto["issue"][0]["stato"], "indisponibile")
        self.assertEqual(contesto["ci"]["stato"], "risultati CI indisponibili")

    def test_identificativi_non_validi_e_fork(self):
        for numero in ("35", 0, -1, True):
            with self.subTest(numero=numero):
                self.raccogli({}, {"pull_request": {"number": numero}})
        self.raccogli({"/pulls/35": {"head": {"repo": None, "sha": SHA}, "body": ""}})

    def test_nomi_dei_passaggi_corrispondono_alla_ci(self):
        ci = (SCRIPT.parents[1] / "workflows" / "ci.yml").read_text(encoding="utf-8")
        for nome in self.script["CONTROLLI"].values():
            self.assertIn(f"      - name: {nome}\n", ci)


if __name__ == "__main__":
    unittest.main()
