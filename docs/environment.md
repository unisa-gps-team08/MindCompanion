# Ambiente di sviluppo di MindCompanion

MindCompanion usa **Node.js 24**, **Next.js con TypeScript** e **MongoDB 8.0**. Il [`Dockerfile`](../Dockerfile) definisce l'immagine web e [`compose.yaml`](../compose.yaml) avvia l'applicazione e il database.

## Requisiti

- Docker Desktop in modalità container Linux, oppure Docker Engine con Compose v2.
- Compose v2.22 o successivo per usare la modalità Watch.

Esegui i comandi dalla radice della repository.

## Avvio e verifica

```sh
docker compose up --build --wait
```

Una volta avviato l'ambiente, apri [MindCompanion](http://127.0.0.1:3000). L'[endpoint di stato](http://127.0.0.1:3000/api/health) restituisce HTTP `200` e `{"status":"ok"}` quando l'applicazione raggiunge MongoDB.

Il servizio `web` riceve `MONGODB_URI=mongodb://mongodb:27017/mindcompanion`. MongoDB è raggiungibile sulla rete interna di Compose e salva i dati nel volume `mongodb-data`. Usa dati fittizi per lo sviluppo.

Se l'avvio fallisce, controlla lo stato dei servizi e i log.

```sh
docker compose ps
docker compose logs --tail 100 web mongodb
```

## Porta locale

Se la porta `3000` è già occupata, aggiungi `APP_PORT=3001` al file `.env` nella radice del progetto. Esegui di nuovo il comando di avvio, poi apri [MindCompanion sulla porta 3001](http://127.0.0.1:3001). Il file `.env` è escluso da Git.

## Sviluppo con Watch

Avvia l'ambiente in modalità Watch per sincronizzare i sorgenti mentre modifichi il codice.

```sh
docker compose up --build --watch
```

Compose aggiorna i sorgenti nel container e ricostruisce l'immagine se cambiano il `Dockerfile`, `package.json` o `pnpm-lock.yaml`. Premi `Ctrl+C` per terminare la sessione Watch.

## Build e test in locale

Usa il servizio `web` per eseguire la build di produzione di Next.js e il test di integrazione. Compose avvia MongoDB e fornisce `MONGODB_URI` al container di test.

```sh
docker compose run --build --rm -T web sh -c 'pnpm build && pnpm test:integration'
```

Per verificare separatamente il `Dockerfile`, esegui lo stesso comando di build dell'immagine usato nella CI.

```sh
docker build --tag mindcompanion-web:ci .
```

Se la build dell'immagine fallisce, controlla che i file richiesti siano nel contesto, verifica i pattern di [`.dockerignore`](../.dockerignore) e leggi l'output di `pnpm install` nel container Linux. La [guida CI](ci.md) descrive i controlli sulle pull request.

## Comandi fuori da Docker

Per eseguire i comandi direttamente sul computer servono Node.js 24 e **pnpm 10.33.2**. È la versione fissata nel [`Dockerfile`](../Dockerfile), nella [CI](../.github/workflows/ci.yml) e in [`verify-project`](../.github/scripts/verify-project). Usa la stessa versione per installare le dipendenze del lockfile come nella CI.

```sh
npm install --global pnpm@10.33.2
pnpm --version
pnpm install --frozen-lockfile
pnpm lint
pnpm build
```

`pnpm dev` avvia il server su `localhost:3000`. L'app legge `MONGODB_URI` per connettersi al database. Il MongoDB di Compose è su una rete interna e non è raggiungibile dal computer: imposta in `.env.local` l'URI di un'istanza MongoDB 8.0 che puoi raggiungere. Il file è escluso da Git. Senza `MONGODB_URI` l'[endpoint di stato](http://127.0.0.1:3000/api/health) risponde con HTTP `503`.

## Arresto

```sh
docker compose down
```

Il comando ferma i servizi e conserva il volume MongoDB.

## Struttura del codice

Il codice applicativo è in `src/`. L'alias di import `@/*` punta a `src/*`.

| Percorso | Contenuto |
| --- | --- |
| `src/app/` | Route e layout dell'App Router. Le route handler sono in `src/app/api/`, per esempio [`api/health/route.ts`](../src/app/api/health/route.ts). |
| `src/components/ui/` | Componenti UI di shadcn, configurati in [`components.json`](../components.json). |
| `src/lib/` | Utility condivise, come `cn` in `utils.ts`. |
| `src/db/connect.ts` | Connessione a MongoDB con Mongoose. |
| `src/db/models/` | Model Mongoose, uno per file. Le regole sono nel [README dei model](../src/db/models/README.md). |
| `public/` | Asset statici. |
| `tests/` | Test di integrazione. |

### Connessione a MongoDB

[`connectDB()`](../src/db/connect.ts) legge `MONGODB_URI` e apre la connessione con Mongoose. Se la variabile manca, lancia un errore. Se MongoDB non risponde entro 3 secondi, la chiamata fallisce.

Mongoose riusa la connessione già aperta, quindi una route può chiamare `connectDB()` a ogni richiesta prima di usare un model. L'[endpoint di stato](../src/app/api/health/route.ts) segue questo schema e risponde con HTTP `503` quando la connessione fallisce.
