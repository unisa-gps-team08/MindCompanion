# Workflow agentico di MindCompanion

Il workflow usa Claude Code con un token OAuth di un abbonamento Claude idoneo.
GitHub Actions invia a Claude il contesto in un job con accesso GitHub in lettura.
Un job separato pubblica i commenti o applica le patch dopo averne verificato
l'ambito. GitHub Copilot è facoltativo e può essere usato per chiedere una
seconda revisione della PR.

## Attivazione

1. Un amministratore integra questa configurazione su `main`. Le label sulle
   issue avviano i workflow presenti sul branch predefinito.
2. Il titolare dell'abbonamento esegue `claude setup-token` in locale e completa
   l'accesso ad Anthropic. In
   [Settings → Secrets and variables → Actions](https://github.com/unisa-gps-team08/MindCompanion/settings/secrets/actions)
   salva il valore come repository secret `CLAUDE_CODE_OAUTH_TOKEN`.
   I run usano la quota di quell'abbonamento.
3. In **Settings → Actions → General** verifica che Actions sia attivo, che la
   policy consenta le action fissate nel workflow e che **Allow GitHub Actions
   to create and approve pull requests** sia abilitato per la creazione della
   PR in bozza. I job dichiarano i propri permessi.
4. Crea le label `task-agente`, `fase:piano`, `fase:implementazione`, `fase:test`
   e `fase:revisione` in **Issues → Labels**. Se usi GitHub CLI con accesso Write,
   puoi eseguire dalla repo:

   ```sh
   gh label create task-agente --color 0E8A16
   gh label create fase:piano --color FBCA04
   gh label create fase:implementazione --color 1D76DB
   gh label create fase:test --color 5319E7
   gh label create fase:revisione --color B60205
   ```

La configurazione passa il `GITHUB_TOKEN` in sola lettura alla Claude Code
Action per operare su GitHub. L'autenticazione del modello usa il secret OAuth.
I job di pubblicazione usano permessi GitHub propri. L'action di Anthropic
[supporta il token GitHub esplicito](https://code.claude.com/docs/en/github-actions#action-parameters).

## Primo caso d'uso

1. Integra in `docs/` gli artefatti approvati che il team può pubblicare:
   caso d'uso, modelli rilevanti, firme pubbliche e test frame con esiti attesi.
   Configura `.github/scripts/verify-project` come script Bash da eseguire
   dalla radice, con i comandi effettivi per installare le dipendenze, fare
   la build ed eseguire i test. La CI delle PR dell'agente fallisce finché
   lo script manca.
2. Un membro con accesso Write apre l'issue **Task per agente**. Per l'ambito
   usa percorsi esatti o directory con `/` finale, sotto la radice. I manifest
   delle dipendenze, i workflow e le istruzioni degli agenti vanno gestiti
   in PR del team.
3. Applica `fase:piano` all'issue e aspetta il commento. Verifica il piano e
   applica `fase:implementazione` solo dopo l'approvazione. Se hai modificato
   l'issue o nel frattempo è avanzato `main`, rigenera il piano prima di
   approvarlo. Mantieni `fase:piano` sull'issue.
4. Dopo la creazione della PR in bozza, applica `fase:test` **all'issue**.
   Il tester riceve le specifiche e le firme pubbliche dal commit del piano,
   genera solo nuovi file di test e lavora senza accedere al branch
   dell'implementazione.
5. Quando il commit dei test è visibile, rendi la PR pronta per la revisione e
   applica `fase:revisione` **all'issue**. Leggi il commento di Claude sulla PR,
   verifica il check `build` e chiedi l'approvazione di un altro membro del
   team prima del merge. Autorizza l'esecuzione di Actions se GitHub lo richiede.

Aspetta che un run termini prima di applicare la label successiva. Per ripetere
una fase dopo una correzione, rimuovi e riapplica la sua label. Se il branch
`agent/issue-N` è stato pubblicato ma GitHub ha bloccato la creazione della PR,
verifica il branch e apri manualmente una PR in bozza verso `main` con
`Closes #N`. Poi prosegui con i test.

Il workflow usa le label dell'issue anche per test e revisione, così i job con
OAuth partono dalla configurazione su `main`; il diff della PR è letto durante
la revisione e la CI rimane un workflow separato. Quando la CI applicativa è
attiva, rendi obbligatorio `build` nel ruleset `protect-main`. Aggiungi
`CODEOWNERS` e il relativo requisito dopo aver identificato i responsabili
GitHub del team.
