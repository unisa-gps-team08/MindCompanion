# CI di MindCompanion

La CI verifica che le modifiche possano essere compilate con Next.js, che l'applicazione riesca a raggiungere MongoDB e che il codice e le dipendenze superino i controlli di sicurezza previsti. Il workflow è definito in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

## Quando parte

| Evento | Controlli eseguiti |
| --- | --- |
| Apertura, riapertura, aggiornamento o passaggio a *Ready for review* di una pull request | Il job `build` esegue i controlli elencati qui sotto. Se SonarCloud è configurato, il suo job si aggiunge per le PR interne verso `main` aperte da utenti diversi da Dependabot. |
| Push su `main` | SonarCloud analizza il ramo principale quando è configurato. Il primo push con il workflow attivo avvia l'analisi iniziale. |
| Ogni giorno alle **07:17, ora di Roma** | GitHub Actions esegue l'audit delle dipendenze sul ramo predefinito `main`. La pianificazione si attiva dal momento in cui il workflow è presente su quel ramo. |

## Controlli della pull request

| Controllo | Come farlo passare |
| --- | --- |
| **Gitleaks** analizza i commit introdotti dalla PR e maschera i valori rilevati nei log. | Conserva password, token e chiavi nei secret di GitHub Actions o nella configurazione locale esclusa da Git. Se una credenziale reale è già in un commit, revocala o ruotala e concorda con il team la rimozione dalla cronologia della PR. Un commit successivo che la cancella lascia visibile il commit che l'ha introdotta. |
| **Controlli Git e Python** verificano il diff e la sintassi dello script di supporto ai workflow. | Correggi gli errori riportati da `git diff --check` e, se hai toccato `agent_workflow.py`, verifica che si compili. |
| **Semgrep** applica le regole OWASP ai sorgenti TypeScript (`.ts`, `.tsx`, `.mts` e `.cts`). Le segnalazioni fanno fallire il job. | Apri la regola, il file e la riga indicati nel log. Correggi il codice o discuti con il revisore perché la segnalazione è un falso positivo. |
| **Audit delle dipendenze** controlla con `pnpm audit` le versioni registrate in `pnpm-lock.yaml` e fallisce per vulnerabilità alte o critiche. | Individua la dipendenza coinvolta, anche se transitiva. Concorda la modifica con il team, aggiorna il lockfile nella PR dedicata e ripeti audit, build e test. |
| **Build Next.js** usa Node.js 24, installa le versioni del lockfile con `pnpm install --frozen-lockfile`, poi esegue `pnpm lint` e `pnpm build`, che include il controllo TypeScript. | Tieni `package.json` e `pnpm-lock.yaml` allineati. Risolvi gli errori di lint, di tipo, di import o di compilazione riportati nel log. |
| **Test di integrazione** avvia la build di produzione di Next.js con un MongoDB 8.0 temporaneo. Verifica che `GET /api/health` restituisca HTTP `200` e `{"status":"ok"}`. | Assicurati che `MONGODB_URI` punti all'istanza di test e che l'endpoint raggiunga MongoDB prima di rispondere. Usa dati fittizi nel database di test. |

## Prima di aprire una pull request

Esegui i comandi dalla radice della repository. Sul computer usa Node.js 24 e pnpm 10.33.2, la versione usata dalla CI. L'installazione è descritta nella [guida dell'ambiente](environment.md#comandi-fuori-da-docker).

```sh
git diff --check HEAD
pnpm audit --audit-level high
pnpm install --frozen-lockfile
pnpm lint
pnpm build
```

Se le modifiche sono già in un commit, aggiorna il riferimento con `git fetch origin` ed esegui `git diff --check origin/main...HEAD` per controllare il diff di una pull request verso `main`.

Lo [script di verifica usato in CI](../.github/scripts/verify-project) esegue `pnpm install --frozen-lockfile`, `pnpm lint` e `pnpm build`. Il [test di integrazione](../tests/integration/health.test.mjs) richiede una build già pronta e un database di test raggiungibile. Consulta la [guida dell'ambiente di sviluppo](environment.md#build-e-test-in-locale) per eseguirlo in locale.

## SonarCloud e falsi positivi

Il job SonarCloud si attiva quando è impostata la variabile `SONAR_PROJECT_KEY`. Servono anche `SONAR_ORGANIZATION`, il secret `SONAR_TOKEN` e un progetto SonarQube Cloud configurato per l'analisi tramite GitHub Actions. Il token deve poter eseguire l'analisi e leggere le segnalazioni. I passaggi di configurazione sono nel [README](../README.md#sonarcloud).

Il job attende il completamento dell'analisi e richiede **zero segnalazioni di sicurezza aperte** per la PR in esame o per `main`, a seconda dell'evento. Se il job fallisce per un problema di credenziali, configurazione o comunicazione con SonarCloud, il log indica il passaggio da controllare.

1. Apri **Issues** nel progetto SonarCloud e seleziona la pull request o il ramo indicato dal job.
2. Leggi il codice e la regola associata. Correggi i problemi reali nella PR.
3. Se la segnalazione è un falso positivo, documenta il motivo e seleziona **False Positive**. Questa operazione richiede **Administer Issues** sul progetto. Per un progetto privato serve anche **Browse Project** per poter vedere le segnalazioni. [Permessi di progetto SonarCloud](https://docs.sonarsource.com/sonarqube-cloud/managing-your-projects/administering-your-projects/setting-permissions)
4. Esegui di nuovo il job e controlla l'esito aggiornato nella pull request.

## Prima del merge

- Nella scheda **Checks** della PR apri il primo passaggio fallito e leggi il log. Dopo la correzione, controlla l'esecuzione associata all'ultimo commit.
- Compila il [template della pull request](../.github/pull_request_template.md) riportando i test frame coperti e l'esito della build e dei test. Usa dati fittizi.
- Segui le [regole del progetto](../AGENTS.md). Le modifiche a dipendenze, configurazione degli agenti o workflow richiedono una PR separata del team. Prima del merge servono i test eseguiti e una revisione umana.
