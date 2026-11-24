# Schema e seed condivisi del database

Questa cartella definisce la struttura del database e i dati fittizi comuni a
tutto il team. È versionata su Git: chi la modifica la condivide con tutti.

| Percorso | Contenuto |
| --- | --- |
| `schema/<collezione>.json` | Validatore `$jsonSchema` e indici di una collezione. |
| `seed/<collezione>.json` | Documenti fittizi della collezione, in Extended JSON (`{"$oid": …}`, `{"$date": …}`). |
| `applica.mjs` | Script che applica schema e seed al database di `MONGODB_URI`. |

## Collezioni

Lo schema copre tutte le entity del class diagram ristrutturato (SDD 4.2). Le
composizioni sono incorporate nel documento del contenitore.

| Collezione | Entity | Incorporati | Riferimenti |
| --- | --- | --- | --- |
| `utenti` | Utente, Medico, Paziente (campo `ruolo`) | — | Paziente → `medico`, `nutrizionista`, `tutori` |
| `pianiStimolazione` | PianoStimolazione | — | `paziente` (al massimo un piano) |
| `sessioniStimolazione` | SessioneStimolazione | Esercizio, RispostaEsercizio | `paziente`, `piano` (null se eliminato) |
| `questionari` | Questionario (campo `tipo`) | domande | `autore`, `paziente`, `destinatari` |
| `pianiAlimentari` | PianoAlimentare | Pasto | `paziente` (al massimo un piano) |
| `centri` | Centro | Attivita | `amministratore` |
| `sessioniAccesso` | SessioneAccesso (tecnica, per il login) | — | `utente` |

I campi con dati sanitari (risposte dei questionari, punteggio e risposte delle
sessioni, raccomandazioni e alimenti dei piani alimentari) non hanno un tipo
fisso nello schema: li scrive cifrati il Servizio Crittografia, il cui formato
non è ancora stato deciso. Per lo stesso motivo il seed non contiene ancora
questionari, sessioni e piani alimentari.

## Come si aggiorna il database

Docker Compose esegue `applica.mjs` nel servizio `db-setup` a ogni
`docker compose up`, prima di avviare l'app. Dopo un `git pull` basta quindi
riavviare i servizi.

| Azione | Comando | Risultato |
| --- | --- | --- |
| Riapplicare schema e seed con i servizi accesi | `docker compose run --rm db-setup` | Aggiorna validatori e indici e riporta i documenti del seed alla versione dei file. Gli altri dati locali restano. |
| Ripartire da zero | `docker compose run --rm db-setup node src/db/setup/applica.mjs --reset` | Cancella tutto il database locale, poi applica schema e seed. |
| Fuori da Docker | `pnpm db:setup` oppure `pnpm db:reset` | Come sopra, sul database di `MONGODB_URI` in `.env.local`. |

## Utenti del seed

Tutti hanno la password fittizia `mindcompanion`, valida solo in locale.

| E-mail | Ruolo |
| --- | --- |
| `admin@mindcompanion.test` | AMMINISTRATORE |
| `medico@mindcompanion.test` | MEDICO |
| `nutrizionista@mindcompanion.test` | NUTRIZIONISTA |
| `tutore@mindcompanion.test` | TUTORE |
| `paziente@mindcompanion.test` | PAZIENTE, associato a medico, nutrizionista e tutore |
| `paziente2@mindcompanion.test` | PAZIENTE, senza associazioni |

Il seed contiene anche un piano di stimolazione attivo per il primo paziente e
il centro "Il Girasole" di Nocera Inferiore con due attività.

## Regole

- Una collezione nuova si aggiunge con un file in `schema/` e, se servono dati,
  uno in `seed/` con lo stesso nome.
- Schema e model Mongoose (`src/db/models/`) descrivono la stessa collezione:
  si modificano insieme, nella stessa PR, e seguono il class diagram.
- Gli `_id` del seed sono fissi, così i riferimenti tra documenti (es.
  `medico` del paziente) restano validi per tutti. Non cambiarli.
- I dati sanitari vanno nel seed già nel formato in cui l'app li salva, cioè
  cifrati: concordate il formato con chi implementa il Servizio Crittografia.
- Solo dati fittizi: e-mail su dominio `.test`, codici fiscali inventati.
