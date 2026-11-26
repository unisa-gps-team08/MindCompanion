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
- Node.js 20 o superiore. Usa Node.js 24 e pnpm 10.33.2 per riprodurre la CI.

## Comandi

| Comando         | Scopo                              |
| --------------- | ---------------------------------- |
| `pnpm install --frozen-lockfile` | Installa le dipendenze dal lockfile |
| `pnpm dev`   | Server di sviluppo su `localhost:3000` |
| `pnpm build` | Build di produzione (controlla anche i tipi) |
| `pnpm lint`  | ESLint                             |

Un task è chiuso solo se `pnpm lint`, `pnpm build` e i test previsti passano.
`pnpm test:integration` esegue il test di `/api/health` con `node:test`.
La scelta di un runner per la suite applicativa richiede una decisione del team.

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
  `src/components/`) → Controller (`src/app/api/`) → Model (`src/db/`) →
  MongoDB. Il Model (GestioneDatiPersistenti dell'SDD) comprende le entità in
  `src/db/models/` e i servizi `connect.ts`, `crittografia.ts` e `password.ts`.
  La View non importa nulla da `@/db/`; solo il Model accede al database.
- Il controllo del ruolo avviene sempre lato server, nella route. Nascondere un
  pulsante nella View non basta.
- I dati sanitari si cifrano con AES-256 solo tramite il servizio di
  crittografia, mai con codice scritto altrove. Dati anagrafici e catalogo dei
  centri restano in chiaro.
- All'amministratore si restituiscono solo i dati anagrafici (nome, cognome,
  e-mail, codice fiscale, data di nascita). La password si salva solo come hash
  e l'hash non viene mai restituito dalle API né arriva alla View. Unica
  eccezione: la password temporanea generata in InserisciUtente (RF_AD_1,
  RF_AD_12) viene restituita in chiaro una sola volta all'amministratore, con
  `Cache-Control: no-store`, e non viene mai salvata in chiaro né scritta nei
  log.
- MongoDB non garantisce l'integrità referenziale: le regole di cardinalità
  delle associazioni (RF_AD_8) si verificano nel codice prima di ogni scrittura.
- Ogni input dell'utente si valida lato server, anche se il form lo valida già.

## Convenzioni di codice

- TypeScript `strict`. Vietato `any`: usa `unknown` e restringi il tipo.
- Niente `console.log` né codice commentato nelle PR. `// eslint-disable` solo
  con un commento che spiega il motivo.

Le regole sui nomi valgono solo per funzioni e classi scritte da noi, e per i
componenti, i tipi, le variabili e le costanti che le accompagnano. Non valgono
per:

- **i nomi dei file**, che non devono seguire la nomenclatura della
  documentazione;
- **i componenti e i pacchetti installati tramite libreria**, ad esempio i
  componenti shadcn in `src/components/ui/` (`button.tsx`), che restano come li
  genera la libreria.

| Elemento | Convenzione | Esempio |
| --- | --- | --- |
| Componenti React, classi, tipi | PascalCase, senza prefisso `I` | `ElencoUtentiPage`, `Utente` |
| Funzioni e variabili | camelCase | `salvaAvanzamento`, `pianoAttivo` |
| Costanti globali | UPPER_SNAKE_CASE | `MAX_TENTATIVI_LOGIN` |

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
- Prima di iniziare un task, parti da `main` aggiornato: `git checkout main`,
  `git pull`, poi crea il branch.
- Per portare le novità di `main` nel tuo branch:
  - **branch già pubblicato** (dopo il primo push): `git fetch origin` e
    `git merge origin/main`, poi `git push`. Non serve riscrivere la storia;
  - **branch mai pubblicato**: puoi usare `git pull --rebase origin main`, solo
    prima del primo push.
- Fallo almeno prima di aprire la PR e ogni volta che GitHub segnala conflitti.
  Vietato `git push --force` su branch condivisi.
- PR piccole, indicativamente sotto le 400 righe modificate, con `Closes #N`, il
  caso d'uso di riferimento e le istruzioni per provarla.
- Prima di modificare file condivisi (model, tipi comuni, layout generale)
  avvisa il team, per evitare modifiche in parallelo sullo stesso file.

## Segreti

Mai committare `.env*` o token. Usa dati fittizi in esempi e fixture.

## CI e merge

- Il job `build` delle pull request esegue `pnpm audit --audit-level high`,
  `.github/scripts/verify-project` per installazione, lint e build, e
  `pnpm test:integration` con MongoDB. L'audit giornaliero su `main` è un
  workflow separato. Dettagli nella [guida CI](docs/ci.md).
- Prima del merge servono test eseguiti e revisione umana della PR da parte di
  un code owner diverso dall'autore.
- Lingua: documentazione, commenti di revisione e messaggi di PR in italiano.
  Funzioni e classi scritte da noi in italiano, con i nomi del class diagram e
  del RAD (es. `PianoStimolazione`, `salvaAvanzamento`, `InserisciUtenteForm`).
  Restano in inglese i nomi imposti da framework e librerie (`GET`, `props`,
  `useState`) e i componenti installati tramite libreria. I nomi dei file sono
  liberi (vedi Convenzioni di codice).
