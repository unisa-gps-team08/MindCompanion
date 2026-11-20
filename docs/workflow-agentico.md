# Workflow agentico di MindCompanion

Il workflow usa Claude Code con un token OAuth di un abbonamento Claude idoneo.
GitHub Actions invia a Claude il contesto in un job con accesso GitHub in lettura.
Un job separato pubblica i commenti o applica le patch dopo averne verificato
l'ambito. [GitHub Copilot Code Review](#seconda-revisione-con-copilot) può
aggiungere una verifica tecnica alla revisione delle PR.

## Attivazione

1. Un amministratore integra questa configurazione su `main`. Le label sulle
   issue avviano i workflow presenti sul branch predefinito.
2. Il titolare dell'abbonamento esegue `claude setup-token` in locale e completa
   l'accesso ad Anthropic. In
   [Settings → Environments](https://github.com/unisa-gps-team08/MindCompanion/settings/environments)
   apre **MindCompanion Workflow** e salva il valore come environment secret
   `CLAUDE_CODE_OAUTH_TOKEN`. I job di Claude usano questo environment.
   I run usano la quota di quell'abbonamento.
3. In **Settings → Actions → General** verifica che Actions sia attivo, che la
   policy consenta le action fissate nel workflow. **Allow GitHub Actions
   to create and approve pull requests** abilita la creazione automatica della
   PR in bozza. Con questa opzione disattivata, il workflow pubblica il branch
   e il riepilogo del run fornisce il link per aprire la PR in bozza. I job
   dichiarano i propri permessi.
4. Crea le label `task-agente`, `fase:piano`, `fase:implementazione`, `fase:test`
   e `prova` in **Issues → Labels**. Se usi GitHub CLI con accesso Write,
   puoi eseguire dalla repo:

   ```sh
   gh label create task-agente --color 0E8A16
   gh label create fase:piano --color FBCA04
   gh label create fase:implementazione --color 1D76DB
   gh label create fase:test --color 5319E7
   gh label create prova --color B60205
   ```

La configurazione passa il `GITHUB_TOKEN` in sola lettura alla Claude Code
Action per operare su GitHub. L'autenticazione del modello usa il secret OAuth.
I job di pubblicazione usano permessi GitHub propri. L'action di Anthropic
[supporta il token GitHub esplicito](https://code.claude.com/docs/en/github-actions#action-parameters).

## Prove di configurazione e OAuth

Per verificare evento e pubblicazione del commento, aggiungi `prova` a una
issue di prova. Il workflow **Saluto** deve rispondere «Ciao!».

Dopo il merge e il salvataggio del secret, apri **Actions → Verifica OAuth di
Claude → Run workflow**, seleziona `main` e avvia il run. Il job **Verifica accesso
OAuth** invia a Claude una richiesta minima e controlla il valore restituito.
Per la prova bastano il workflow e il secret. L'esito positivo conferma che
GitHub Actions può autenticarsi con l'abbonamento Claude.

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
4. Dopo la creazione della PR in bozza, applica `fase:test` **alla PR**.
   Il tester riceve le specifiche e le firme pubbliche dal commit del piano,
   genera solo nuovi file di test e lavora senza accedere al branch
   dell'implementazione. Un job separato esegue la verifica sul codice e
   segnala l'esito insieme ai test frame nella PR.
5. Quando il commit dei test è visibile, rendi la PR pronta per la revisione.
   **CI** e **Agente revisore** si avviano da `ready_for_review`. Leggi il
   commento di Claude, verifica il check `build` e ottieni l'approvazione di un
   code owner diverso dall'autore prima del merge. Autorizza l'esecuzione di
   Actions se GitHub lo richiede.

Puoi chiedere chiarimenti con `@claude` in un commento all'issue. Su una PR
interna al repository puoi chiedere a Claude di spiegare o correggere una
modifica. Il workflow accetta le menzioni da membri con accesso Write.

Aspetta che un run termini prima di avviare la fase successiva. Dopo una
correzione, riapplica la label della fase o riporta la PR in bozza e rendila
di nuovo pronta per ripetere la revisione. Se il branch
`agent/issue-N` è stato pubblicato ma GitHub ha bloccato la creazione della PR,
verifica il branch e apri manualmente una PR in bozza verso `main` con
`Closes #N`. Poi prosegui con i test.

I workflow sono `piano.yml`, `implementa.yml`, `test.yml`, `revisione.yml`,
`agente.yml` e `ci.yml`. Le quattro fasi riusano i job di
`esegui-fase.yml`. Il tester e il revisore usano le istruzioni in
`.claude/agents/`. Le fasi dichiarano il timeout e il numero massimo di giri.
Imposta nel piano del task la soglia di tentativi oltre cui passa a una persona.
Con OAuth il consumo ricade sull'abbonamento associato al token.

## Protezioni e tracciabilità

Il ruleset `protect-main` deve richiedere il check `build` e la revisione dei
code owner. `.github/CODEOWNERS` usa gli amministratori della repo come
responsabili iniziali. Il template PR registra issue, piano, approvatore,
versione degli artefatti, frame, tentativi, aggiornamenti ai modelli ed esito.
Per ogni caso d'uso, registra la corrispondenza tra sequence diagram, classi,
test frame, test ed esito. La PR deve essere leggibile e spiegabile dall'autore.

## GitHub Projects

Collega alla repo una board **MindCompanion Workflow** con queste opzioni in
**Status**: Da pianificare, Piano, Implementazione, Test, Revisione e Fatto.
Aggiungi i campi **Caso d'uso** (testo), **Agente usato** (scelta singola),
**Tentativi** (numero) e **Revisore** (testo). In **Workflows**, configura
**Auto-add to project** per questa repo con filtro `label:task-agente`. Configura
**Item closed** e **Pull request merged** per impostare lo stato **Fatto**.

Salva le viste del PM con i filtri `is:issue is:open label:task-agente
-label:fase:piano`, `is:issue is:open label:fase:piano
-label:fase:implementazione`, `is:pr is:open draft:true`,
`is:pr is:open draft:false review:required` e `is:pr is:open status:failure`.

## Seconda revisione con Copilot

Claude confronta il diff con le specifiche e il piano. Copilot valuta anche
controlli di accesso, qualità delle asserzioni e permessi della CI seguendo
[`.github/copilot-instructions.md`](../.github/copilot-instructions.md).
Il revisore del team valuta i rilievi e approva la PR.

- **Su richiesta.** Sulla PR pronta, seleziona **Reviewers → Copilot → Request**
  con un account che ha accesso a Copilot Code Review. Questa funzione usa
  l'accesso Copilot e i relativi crediti, senza aggiungere una chiave al workflow.
- **Automatica.** Un amministratore può importare
  [`copilot-code-review.json`](../.github/rulesets/copilot-code-review.json)
  da **Settings → Rulesets → New ruleset → Import a ruleset**. La regola
  richiede una revisione iniziale per le PR idonee e pronte che puntano al
  branch predefinito. Per le PR aperte da `github-actions[bot]`, l'addebito
  automatico ricade sull'organizzazione. Se GitHub non assegna Copilot,
  un membro con accesso può richiedere la revisione dalla PR.

Per conservare l'approvazione umana nel ruleset `protect-main`, lascia
disattivata l'opzione che fa contare le approvazioni di Copilot per il merge.
Consulta le guide a
[Copilot Code Review](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-code-review)
e alla [configurazione delle revisioni automatiche](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review).
