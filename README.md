# MindCompanion

Per configurare Claude Code su GitHub Actions con un abbonamento, consulta la
[guida al workflow agentico](docs/workflow-agentico.md).

## Ambiente di sviluppo con Docker

Servono Docker Desktop (container Linux) oppure Docker Engine con Compose v2.
Il progetto usa Node.js 24, Next.js con TypeScript e MongoDB 8.0.

Esegui questo comando dalla cartella della repository.

```sh
docker compose up --build --wait
```

- Apri [MindCompanion](http://127.0.0.1:3000).
- [Lo stato dell'ambiente](http://127.0.0.1:3000/api/health) risponde con HTTP 200
  quando Next.js riesce a contattare MongoDB.
- Se la porta 3000 è occupata, crea un file `.env` con `APP_PORT=3001` e usa
  `http://127.0.0.1:3001`.

Per sincronizzare le modifiche del codice durante lo sviluppo, avvia invece
Compose in modalità Watch (Compose v2.22 o successivo).

```sh
docker compose up --build --watch
```

Compose sincronizza i sorgenti nel container e ricostruisce l'immagine quando
cambiano le dipendenze.

MongoDB è sulla rete interna di Compose e usa un volume persistente. Il
container web riceve `MONGODB_URI` con il nome del database `mindcompanion`.
Usa dati fittizi in questo ambiente locale.

Questo comando ferma i servizi e conserva il volume.

```sh
docker compose down
```

## SonarCloud

Importa la repository in SonarQube Cloud e seleziona **With GitHub Actions**
come metodo di analisi. Nelle impostazioni **Secrets and variables → Actions**
di GitHub configura le variabili `SONAR_ORGANIZATION` e `SONAR_PROJECT_KEY`
con le chiavi del progetto, quindi aggiungi il secret `SONAR_TOKEN`.

Il job si attiva quando è impostata `SONAR_PROJECT_KEY`. Un push su `main`
analizza il ramo principale e inizializza il progetto. Le pull request interne
verso `main` eseguono il controllo sulle proprie segnalazioni di sicurezza
aperte. Il token deve poter eseguire l'analisi e leggere le segnalazioni.
