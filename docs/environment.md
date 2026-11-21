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

Compose aggiorna i sorgenti nel container e ricostruisce l'immagine se cambiano il `Dockerfile`, `package.json` o `package-lock.json`. Premi `Ctrl+C` per terminare la sessione Watch.

## Build e test in locale

Usa il servizio `web` per eseguire la build di produzione di Next.js e il test di integrazione. Compose avvia MongoDB e fornisce `MONGODB_URI` al container di test.

```sh
docker compose run --build --rm -T web sh -c 'npm run build && npm run test:integration'
```

Per verificare separatamente il `Dockerfile`, esegui lo stesso comando di build dell'immagine usato nella CI.

```sh
docker build --tag mindcompanion-web:ci .
```

Se la build dell'immagine fallisce, controlla che i file richiesti siano nel contesto, verifica i pattern di [`.dockerignore`](../.dockerignore) e leggi l'output di `npm ci` nel container Linux. La [guida CI](ci.md) descrive i controlli sulle pull request.

## Arresto

```sh
docker compose down
```

Il comando ferma i servizi e conserva il volume MongoDB.
