# MindCompanion

MindCompanion è un progetto web del team C08. Usa i casi d'uso e i modelli
versionati in `docs/` come specifica per ogni task.

- Rispetta i percorsi concordati nell'issue e le dipendenze correnti.
- Chiedi una decisione al team se requisiti e modelli divergono o se manca un
  comportamento necessario. Indica il punto preciso nel report.
- Deriva gli esiti attesi dei test dalle specifiche e dai test frame. Usa dati fittizi.
- Segui l'architettura approvata dal team. Le modifiche a dipendenze, configurazione
  degli agenti e workflow richiedono una PR separata del team.
- Se una decisione approvata cambia un modello, il team aggiorna il modello
  insieme al codice nella relativa PR.
- La CI esegue i comandi del progetto tramite `.github/scripts/verify-project`
  quando il team ha configurato lo stack.
- Prima del merge servono test eseguiti e revisione umana della PR.
