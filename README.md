# MindCompanion

MindCompanion è l'applicazione web del team C08: Next.js 16 con TypeScript,
React 19, Tailwind CSS 4 e MongoDB 8.0 tramite Mongoose.

Questo README elenca le azioni che puoi eseguire oggi sul progetto, con il
comando o il punto in cui cliccare e il risultato atteso. Ogni sezione rimanda
alla guida con i dettagli.

- [Nell'applicazione](#nellapplicazione)
- [Ambiente di sviluppo con Docker](#ambiente-di-sviluppo-con-docker)
- [Comandi fuori da Docker](#comandi-fuori-da-docker)
- [Scrivere codice](#scrivere-codice)
- [Task con il workflow agentico](#task-con-il-workflow-agentico)
- [Controlli automatici della CI](#controlli-automatici-della-ci)
- [Configurazione e manutenzione](#configurazione-e-manutenzione)
- [SonarCloud](#sonarcloud)

## Nell'applicazione

L'app è allo stato iniziale e nessun caso d'uso è ancora implementato.

| Azione | Indirizzo | Risultato |
| --- | --- | --- |
| Aprire la home | [`/`](http://127.0.0.1:3000) | Pagina iniziale di Next.js, da sostituire con il primo caso d'uso. |
| Controllare lo stato dell'ambiente | [`GET /api/health`](http://127.0.0.1:3000/api/health) | HTTP `200` con `{"status":"ok"}` se MongoDB risponde, altrimenti HTTP `503` con `{"status":"unavailable"}`. |

## Ambiente di sviluppo con Docker

Servono Docker Desktop (container Linux) oppure Docker Engine con Compose v2.
Esegui i comandi dalla radice della repository.

| Azione | Comando | Risultato |
| --- | --- | --- |
| Avviare app e database | `docker compose up --build --wait` | Costruisce l'immagine e attende che `web` e `mongodb` siano pronti. App su [127.0.0.1:3000](http://127.0.0.1:3000). |
| Sviluppare con sincronizzazione | `docker compose up --build --watch` | Sincronizza i sorgenti nel container e ricostruisce l'immagine se cambiano `Dockerfile`, `package.json` o `pnpm-lock.yaml`. Richiede Compose v2.22. Esci con `Ctrl+C`. |
| Cambiare la porta | `APP_PORT=3001` nel file `.env` | L'app risponde su [127.0.0.1:3001](http://127.0.0.1:3001). Il file `.env` è escluso da Git. |
| Controllare i servizi | `docker compose ps` | Stato e salute di `web` e `mongodb`. |
| Leggere i log | `docker compose logs --tail 100 web mongodb` | Ultime 100 righe di log di ciascun servizio. |
| Eseguire build e test di integrazione | `docker compose run --build --rm -T web sh -c 'pnpm build && pnpm test:integration'` | Build di produzione e test di `/api/health` con il MongoDB di Compose. |
| Costruire l'immagine come in CI | `docker build --tag mindcompanion-web:ci .` | Verifica il `Dockerfile` e i pattern di `.dockerignore`. |
| Riapplicare schema e seed del database | `docker compose run --rm db-setup` | Aggiorna struttura e dati fittizi condivisi da `src/db/setup/`. Succede anche a ogni `docker compose up`. Dettagli nel [README del setup](src/db/setup/README.md). |
| Ripartire con il database pulito | `docker compose run --rm db-setup node src/db/setup/applica.mjs --reset` | Cancella i dati locali e riapplica schema e seed. |
| Fermare i servizi | `docker compose down` | Ferma i container e conserva il volume `mongodb-data`. |
| Cancellare i dati locali | `docker compose down --volumes` | Ferma i container e **elimina** il volume con i dati di MongoDB. |

Il servizio `web` riceve `MONGODB_URI=mongodb://mongodb:27017/mindcompanion`.
MongoDB resta sulla rete interna di Compose e non è raggiungibile dal computer.
Usa dati fittizi. Dettagli e diagnosi nella
[guida dell'ambiente](docs/environment.md).

## Comandi fuori da Docker

Servono Node.js 24 e pnpm 10.33.2, la versione usata da CI e `Dockerfile`.
Installa pnpm con `npm install --global pnpm@10.33.2`. Dettagli nella
[guida dell'ambiente](docs/environment.md#comandi-fuori-da-docker).

| Azione | Comando | Note |
| --- | --- | --- |
| Installare le dipendenze | `pnpm install --frozen-lockfile` | Installa solo le versioni del lockfile. Nuove dipendenze passano da una PR del team. |
| Avviare il server di sviluppo | `pnpm dev` | Su `localhost:3000`. Imposta in `.env.local` un `MONGODB_URI` verso un MongoDB 8.0 raggiungibile, altrimenti `/api/health` risponde `503`. |
| Eseguire il lint | `pnpm lint` | ESLint. |
| Fare la build di produzione | `pnpm build` | Include il controllo dei tipi TypeScript. |
| Avviare la build di produzione | `pnpm start` | Dopo `pnpm build`, su `localhost:3000`. |
| Eseguire il test di integrazione | `pnpm test:integration` | Richiede `pnpm build` e un `MONGODB_URI` verso un database di test. Avvia Next.js sulla porta `3910`, modificabile con `HEALTH_TEST_PORT`. |
| Verificare come la CI | `bash .github/scripts/verify-project` | Installa le dipendenze, esegue lint e build. |
| Controllare il diff | `git diff --check HEAD` | Per una PR già in commit: `git fetch origin`, poi `git diff --check origin/main...HEAD`. |
| Controllare le vulnerabilità | `pnpm audit --audit-level high` | Fallisce per vulnerabilità alte o critiche. |

Un task è chiuso solo quando `pnpm lint` e `pnpm build` passano. La sequenza
completa è in [Prima di aprire una pull request](docs/ci.md#prima-di-aprire-una-pull-request).

## Scrivere codice

| Azione | Dove | Regola |
| --- | --- | --- |
| Aggiungere una pagina o un layout | `src/app/` | App Router di Next.js. |
| Aggiungere una route API | `src/app/api/<nome>/route.ts` | Chiama i metodi pubblici dei model per accedere ai dati. [`api/health`](src/app/api/health/route.ts) verifica direttamente la connessione a MongoDB. |
| Connettersi a MongoDB | [`src/db/connect.ts`](src/db/connect.ts) | `connectDB()` legge `MONGODB_URI` e riusa la connessione aperta. Lancia un errore se la variabile manca o se MongoDB non risponde entro 3 secondi. |
| Aggiungere un model Mongoose | `src/db/models/`, un file per model | Nome e campi dal class diagram. Segui il [README dei model](src/db/models/README.md). |
| Consultare i test di integrazione | `tests/integration/` | `pnpm test:integration` esegue solo [`health.test.mjs`](tests/integration/health.test.mjs) con `node:test`. Per includere altri file serve modificare lo script in `package.json` con una PR del team. |
| Usare i componenti UI | `src/components/ui/` | Componenti shadcn configurati in [`components.json`](components.json). La utility `cn` è in `src/lib/utils.ts`. |
| Aggiungere asset statici | `public/` | Serviti dalla radice del sito. |
| Importare un modulo | `@/…` | L'alias `@/*` punta a `src/*`. |

Nomi, tipi e firme seguono il class diagram, l'ordine delle chiamate il sequence
diagram. Dipendenze, configurazione del progetto, istruzioni degli agenti e
workflow si cambiano solo con una PR separata del team. Commit in stile
Conventional Commits, in italiano. Regole complete in [AGENTS.md](AGENTS.md),
struttura delle cartelle nella
[guida dell'ambiente](docs/environment.md#struttura-del-codice).

## Task con il workflow agentico

Claude Code pianifica, implementa, testa e rivede un caso d'uso documentato in
`docs/`. Il team autorizza ogni fase applicando una label. Serve accesso
**Write** o superiore. Attendi la fine di ogni run prima di avviare la fase
successiva. Le issue libere sono disattivate: usa uno dei moduli.

| Azione | Dove | Risultato |
| --- | --- | --- |
| Aprire un task | **Issues → New issue → Task per agente** | L'issue riceve `task-agente` ed entra nella board. |
| Generare il piano | Label `fase:piano` sull'issue | **Agente pianificatore** pubblica il piano come commento. |
| Rigenerare il piano | Rimuovi e riapplica `fase:piano` | Nuovo piano sulla versione corrente dell'issue e di `main`. |
| Autorizzare l'implementazione | Label `fase:implementazione` sulla stessa issue, mantenendo `fase:piano` | **Agente implementatore** pubblica il branch `agent/issue-N` e apre la PR in bozza con `Closes #N`. |
| Aprire la PR a mano | Link **Apri la PR in bozza** nel riepilogo del run | Serve se GitHub blocca la PR automatica. Base `main`, confronto `agent/issue-N`, `Closes #N` nella descrizione. |
| Generare i test dei frame | Label `fase:test` sulla PR in bozza `agent/issue-N` | Il tester aggiunge nuovi file di test. Il commento **Test dei frame** riporta l'esito di `verify-project`. Esegui i nuovi test prima del merge. |
| Avviare CI e revisione | **Ready for review** sulla PR | Partono la CI e **Agente revisore**, che commenta il commit esaminato. |
| Ripetere la revisione | Riporta la PR in bozza, poi **Ready for review** | Nuovo commento del revisore sull'ultimo commit. |
| Chiedere a Claude | Commento con `@claude` su un'issue o su una PR interna, anche inline nel diff | `claude[bot]` risponde. Su una PR può spiegare il diff o correggere il branch. |
| Chiedere una revisione a Copilot | **Reviewers → Copilot → Request** sulla PR pronta | Revisione tecnica aggiuntiva, solo per account idonei. |
| Approvare la PR | **Files changed → Review changes → Approve** | Serve un code owner diverso dall'autore. |
| Unire la PR | **Squash and merge** con check `build` verde e approvazione | GitHub chiude l'issue collegata e la board la sposta in **Fatto**. |
| Segnalare un bug | **Issues → New issue → Segnalazione di un bug** | L'issue riceve la label `bug`. |
| Seguire l'avanzamento | [Board MindCompanion Workflow](https://github.com/orgs/unisa-gps-team08/projects/1/views/1) | Viste **Da pianificare**, **Piani da approvare**, **PR in bozza**, **PR in revisione**, **Per agente usato**. |

Per un task reale servono su `main` il caso d'uso, i modelli e i test frame in
`docs/`. Ricerche utili:
[PR in attesa di revisione](https://github.com/unisa-gps-team08/MindCompanion/pulls?q=is%3Apr+is%3Aopen+-is%3Adraft+review%3Arequired) ·
[PR con CI fallita](https://github.com/unisa-gps-team08/MindCompanion/pulls?q=is%3Apr+is%3Aopen+status%3Afailure).

Passo passo con schermate: [guida al workflow](docs/guida-workflow-mindcompanion.md).
Configurazione e protezioni: [workflow agentico](docs/workflow-agentico.md).
Se un run risulta **Skipped**, il branch esiste già, la patch è fuori ambito, il
revisore non produce il report o OAuth è scaduto, consulta
[Diagnosi e ripartenza](docs/guida-workflow-mindcompanion.md#diagnosi-e-ripartenza).

## Controlli automatici della CI

| Quando | Cosa parte |
| --- | --- |
| PR aperta, riaperta, aggiornata o resa pronta per la revisione | Job `build` con Gitleaks, controlli Git e Python, Semgrep, audit delle dipendenze, lint, build, test di integrazione con un MongoDB temporaneo e build dell'immagine web. SonarCloud, se configurato, sulle PR interne verso `main`. |
| Push su `main` | Analisi SonarCloud del ramo principale, se configurato. |
| Ogni giorno alle 07:17, ora di Roma | Workflow [Audit giornaliero delle dipendenze](.github/workflows/dependency-audit.yml) sul ramo predefinito `main`. Gli esiti sono nella scheda **Actions**. |

Come far passare ogni controllo: [guida CI](docs/ci.md).

## Configurazione e manutenzione

Azioni per amministratori e titolari dell'abbonamento Claude.

| Azione | Come | Risultato |
| --- | --- | --- |
| Creare le label del workflow | Comandi `gh label create` qui sotto, con accesso Write | Label `task-agente`, `fase:piano`, `fase:implementazione`, `fase:test`, `prova`. |
| Provare eventi e commenti | Label `prova` su un'issue di collaudo | Il workflow **Saluto** risponde «Ciao!». |
| Verificare OAuth e OIDC | **Actions → Verifica OAuth di Claude → Run workflow** su `main` | Conferma l'installazione della GitHub App e l'accesso all'abbonamento. |
| Rinnovare il token di Claude | `claude setup-token` in locale, poi aggiorna `CLAUDE_CODE_OAUTH_TOKEN` in **Settings → Environments → MindCompanion Workflow** | Le fasi usano il nuovo token. |
| Attivare la revisione automatica di Copilot | **Settings → Rulesets → New ruleset → Import a ruleset** con [`copilot-code-review.json`](.github/rulesets/copilot-code-review.json) | Copilot rivede le PR pronte verso `main`. |
| Segnare un falso positivo SonarCloud | **Issues** del progetto SonarCloud → **False Positive** | Richiede il permesso **Administer Issues**. Poi riesegui il job. |

```sh
gh label create task-agente --color 0E8A16
gh label create fase:piano --color FBCA04
gh label create fase:implementazione --color 1D76DB
gh label create fase:test --color 5319E7
gh label create prova --color B60205
```

Ogni fase di Claude ha un limite di tempo e di turni, definito nel relativo
workflow. Il consumo ricade sull'abbonamento associato al token.

| Fase | Tempo massimo | Turni massimi |
| --- | --- | --- |
| Piano | 15 minuti | 15 |
| Implementazione | 30 minuti | 40 |
| Test | 30 minuti | 30 |
| Revisione | 15 minuti | 20 |

Il ruleset `protect-main` richiede il check `build` e la revisione di un code
owner prima del merge. Dettagli in
[Protezioni e tracciabilità](docs/workflow-agentico.md#protezioni-e-tracciabilità)
e in [Configurazione per chi mantiene il workflow](docs/guida-workflow-mindcompanion.md#configurazione-per-chi-mantiene-il-workflow).

## SonarCloud

Importa la repository in SonarQube Cloud e seleziona **With GitHub Actions**
come metodo di analisi. Nelle impostazioni **Secrets and variables → Actions**
di GitHub configura le variabili `SONAR_ORGANIZATION` e `SONAR_PROJECT_KEY`
con le chiavi del progetto, quindi aggiungi il secret `SONAR_TOKEN`.

Il job si attiva quando è impostata `SONAR_PROJECT_KEY`. Un push su `main`
analizza il ramo principale e inizializza il progetto. Le pull request interne
verso `main` eseguono il controllo sulle proprie segnalazioni di sicurezza
aperte. Il token deve poter eseguire l'analisi e leggere le segnalazioni.
