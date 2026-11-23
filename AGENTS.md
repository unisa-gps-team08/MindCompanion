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

## Segreti

Mai committare `.env*` o token. Usa dati fittizi in esempi e fixture.

## CI e merge

- La CI esegue `.github/scripts/verify-project` (script Bash dalla radice:
  `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, poi i test quando esistono).
  **Lo script non esiste ancora**: il team deve aggiungerlo, finché manca la CI
  fallisce sulle PR dell'agente (`agent/issue-*`).
- Prima del merge servono test eseguiti e revisione umana della PR da parte di
  un code owner diverso dall'autore.
- Lingua: documentazione, commenti di revisione e messaggi di PR in italiano;
  identificatori nel codice in inglese.
