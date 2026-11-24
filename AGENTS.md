# MindCompanion

MindCompanion è un progetto web del team C08. Questo file è l'unica fonte di
istruzioni per tutti gli agenti (Claude Code, Copilot, Codex). `CLAUDE.md` lo
importa e non contiene regole proprie.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript, Tailwind CSS 4, ESLint 9.
- Gestore pacchetti: **pnpm**. Usa `pnpm install --frozen-lockfile` per installare, mai `pnpm add`
  senza una PR di dipendenze.
- Codice applicativo in `src/` (`src/app/` per route e layout), asset statici
  in `public/`. Alias import: `@/*` → `src/*`.
- Node.js 20 o superiore.

## Comandi

| Comando         | Scopo                              |
| --------------- | ---------------------------------- |
| `pnpm install --frozen-lockfile` | Installa le dipendenze dal lockfile |
| `pnpm dev`   | Server di sviluppo su `localhost:3000` |
| `pnpm build` | Build di produzione (controlla anche i tipi) |
| `pnpm lint`  | ESLint                             |

Un task è chiuso solo se `pnpm lint` e `pnpm build` passano.
Il test runner non è ancora stato scelto: serve una decisione del team (vedi
sotto). Finché manca, non aggiungerne uno di tua iniziativa.

## Commit

Crea un commit per ogni task completato, dopo che `pnpm lint` e `pnpm build`
passano. Un commit per task: non accorpare task diversi. Messaggi in stile
Conventional Commits (`feat:`, `fix:`, `docs:`, `build:`), scritti in italiano.

## Specifica

- Usa i casi d'uso e i modelli versionati in `docs/` come specifica per ogni
  task. `docs/workflow-agentico.md` descrive il workflow degli agenti.
- Rispetta i percorsi concordati nell'issue e le dipendenze correnti. Modifica
  solo i file nell'ambito dell'issue.
- Chiedi una decisione al team se requisiti e modelli divergono o se manca un
  comportamento necessario. Indica il punto preciso nel report.
- Nomi, tipi e firme seguono il class diagram, l'ordine delle chiamate il
  sequence diagram, i confini dei moduli il component diagram.
- Se una decisione approvata cambia un modello, il team aggiorna il modello
  insieme al codice nella relativa PR.

## Test

- Deriva gli esiti attesi dei test dalle specifiche e dai test frame, non
  dall'implementazione. Almeno un test per frame, con l'identificativo del frame
  nel nome o in un commento.
- Usa dati fittizi. Non indebolire, saltare o rimuovere test esistenti per far
  passare una PR.

## Cosa richiede una PR separata del team

Dipendenze (`package.json`, `pnpm-lock.yaml`), configurazione del progetto
(`next.config.ts`, `tsconfig.json`, `eslint.config.mjs`), configurazione degli
agenti (`AGENTS.md`, `CLAUDE.md`, `.claude/`, `.github/copilot-instructions.md`)
e workflow (`.github/`). Segui l'architettura approvata dal team.

## Architettura

- Architettura stratificata chiusa dell'SDD: View (`src/app/**/page.tsx`,
  `src/components/`) → Controller (`src/app/api/`) → Model (`src/db/models/`)
  → MongoDB. La View non importa model né `@/db/connect`; solo il Model accede
  al database.
- Il controllo del ruolo avviene sempre lato server, nella route. Nascondere un
  pulsante nella View non basta.
- I dati sanitari si cifrano con AES-256 solo tramite il servizio di
  crittografia, mai con codice scritto altrove. Dati anagrafici e catalogo dei
  centri restano in chiaro.
- All'amministratore si restituiscono solo i dati anagrafici (nome, cognome,
  e-mail, codice fiscale, data di nascita). La password si salva solo come hash
  e non esce mai dal Model.
- MongoDB non garantisce l'integrità referenziale: le regole di cardinalità
  delle associazioni (RF_AD_8) si verificano nel codice prima di ogni scrittura.
- Ogni input dell'utente si valida lato server, anche se il form lo valida già.

## Convenzioni di codice

- TypeScript `strict`. Vietato `any`: usa `unknown` e restringi il tipo.
- Niente `console.log` né codice commentato nelle PR. `// eslint-disable` solo
  con un commento che spiega il motivo.

| Elemento | Convenzione | Esempio |
| --- | --- | --- |
| Componenti React, classi, tipi | PascalCase, senza prefisso `I` | `ElencoUtentiPage`, `Utente` |
| Funzioni e variabili | camelCase | `salvaAvanzamento`, `pianoAttivo` |
| Costanti globali | UPPER_SNAKE_CASE | `MAX_TENTATIVI_LOGIN` |
| File di componenti | PascalCase.tsx | `EliminaUtenteButton.tsx` |
| File di model | nome dell'entity | `src/db/models/Utente.ts` |

- Funzioni brevi con una sola responsabilità; i componenti oltre circa 200 righe
  vanno divisi.
- Commenti per spiegare il perché, non il cosa. I metodi pubblici dei model
  hanno un commento JSDoc.
- Gli errori arrivano alla View con messaggi chiari, senza stack trace né
  dettagli delle query.

## Branch e pull request

- Mai push diretti su `main`. Branch: `feature/<RF>-<descrizione>`,
  `fix/<descrizione>`, `refactor/<descrizione>`, `docs/<descrizione>`;
  `agent/issue-N` per il workflow agentico.
- `git pull` di `main` prima di iniziare e prima di aprire la PR. Vietato
  `git push --force` su branch condivisi.
- PR piccole, indicativamente sotto le 400 righe modificate, con `Closes #N`, il
  caso d'uso di riferimento e le istruzioni per provarla.
- Prima di modificare file condivisi (model, tipi comuni, layout generale)
  avvisa il team, per evitare modifiche in parallelo sullo stesso file.

## Segreti

Mai committare `.env*` o token. Usa dati fittizi in esempi e fixture.

## CI e merge

- La CI esegue `.github/scripts/verify-project` (script Bash dalla radice:
  `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, poi i test quando esistono).
  **Lo script non esiste ancora**: il team deve aggiungerlo, finché manca la CI
  fallisce sulle PR dell'agente (`agent/issue-*`).
- Prima del merge servono test eseguiti e revisione umana della PR da parte di
  un code owner diverso dall'autore.
- Lingua: documentazione, commenti di revisione e messaggi di PR in italiano.
  Identificatori nel codice in italiano, con i nomi del class diagram e del RAD
  (es. `PianoStimolazione`, `salvaAvanzamento`, `InserisciUtenteForm`). Restano
  in inglese solo i nomi imposti da framework e librerie (`GET`, `route.ts`,
  `page.tsx`, `props`).
