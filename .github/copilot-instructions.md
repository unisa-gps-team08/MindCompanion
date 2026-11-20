# Revisione delle pull request di MindCompanion

Pubblica commenti in italiano sui problemi concreti introdotti dalla PR. Per ogni
rilievo indica la riga interessata, un flusso che mostra il problema, il
comportamento atteso e una correzione o una verifica utile. Dai priorità ai
difetti che possono causare accessi indebiti, perdita di dati o regressioni.

- Quando cambiano autorizzazioni o accesso ai dati, confronta il controllo lato
  server con il ruolo e la risorsa coinvolti. Verifica che un utente con lo
  stesso ruolo ma privo dell'associazione richiesta non possa leggere o
  modificare i dati altrui quando la specifica prevede un'associazione.
- Esamina la qualità dei test. Segnala asserzioni che passerebbero anche con
  l'implementazione errata, test che ignorano l'esito atteso di un frame e
  regressioni mascherate da test rimossi, saltati o indeboliti.
- Per GitHub Actions e gli script eseguiti in CI, verifica permessi, trigger e
  confini dei job. Segnala percorsi che espongono secret, eseguono input
  controllato dalla PR con credenziali di scrittura o consentono all'agente
  di modificare i propri workflow.
- Se una modifica contraddice i criteri dell'issue o gli artefatti in `docs/`,
  cita il riferimento. Segnala soltanto problemi che puoi ricondurre
  alle modifiche della PR.
