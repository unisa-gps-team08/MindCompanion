![Logo MindCompanion](images/fig_01.png)

# Requirement Analysis Document

| **Riferimento** | C08_RAD |
| --- | --- |
| **Versione** | 2.0 |
| **Data** | 24/11/2026 |
| **Destinatario** | RSA; Cooperative; Enti Pubblici; |
| **Presentato da** | Gianluca Scisciolo, Gabriele Santoro,  Francesco Rao |
| **Approvato da** |  |

---

## Revision History

| **Data** | **Versione** | **Descrizione** | **Autori** |
| :---: | :---: | :---: | :---: |
| 19/10/2026 | 0.1 | Prima stesura | Tutto il Team |
| 20/10/2026 | 0.2 | Introduzione, Sistema Corrente e Sistema Proposto | Tutto il Team |
| 25/10/2026 | 0.3 | Stesura Requisiti Funzionali | Tutto il Team |
| 27/10/2026 | 0.4 | Stesura Requisiti non Funzionali | Tutto il Team |
| 29/10/2026 | 0.5 | Revisione dei Requisiti non Funzionali | Tutto il Team |
| 30/10/2026 | 0.6 | Scenari e Use Case | Tutto il Team |
| 30/10/2026 | 0.7 | Revisione requisiti funzionali | Tutto il Team |
| 04/11/2026 | 0.8 | Revisione del RAD | Tutto il Team |
| 06/11/2026 | 0.9 | Activity Diagram sistema proposto | Tutto il Team |
| 06/11/2026 | 1.0 | State Chart | Tutto il Team |
| 06/11/2026 | 1.1 | Navigational Path | Tutto il Team |
| 09/11/2026 | 1.2 | Revisione Use Case | Tutto il Team |
| 09/11/2026 | 1.3 | Use Case Diagram | Gaetano Frati,Angelo Rainone |
| 09/11/2026 | 1.4 | Tabella ad Oggetti | Massimo Giudice,Gaetano Frati,David De Pascale,Luigi Alessio Pascarella |
| 10/11/2026 | 1.5 | Class Diagram  | Antonio Bassano,Angelo Rainone,Antonello Laudato |
| 12/11/2026 | 1.6 | Sequence Diagram | Massimo Giudice,David De Pascale,Antonello Laudato |
| 13/11/2026 | 1.7 | Revisione Use Case | Luigi Alessio Pascarella |
| 16/11/2026 | 1.8 | Revisione Rad | Tutto il Team |
| 17/11/2026 | 1.9 | Creazione mock up | Tutto il Team |
| 24/11/2026 | 2.0 | Revisione Rad | Tutto il Team |

| **Nominativo** | **Ruolo** |
| :---: | :---: |
| Gabriele Santoro | Project Manager |
| Francesco Rao | Project Manager |
| Gianluca Scisciolo | Project Manager |
| Gaetano Frati | Team Member  |
| David De Pascale | Team Member |
| Massimo Giudice | Team Member |
| Antonio Bassano | Team Member |
| Luigi Alessio Pascarella | Team Member |
| Angelo Rainone | Team Member |
| Antonello Laudato | Team Member |

## Indice

- [1. Introduzione](#1-introduzione)
  - [1.1 Obiettivo del sistema](#11-obiettivo-del-sistema)
  - [1.2 Ambito del sistema](#12-ambito-del-sistema)
  - [1.3 Obiettivi e criteri di successo del sistema](#13-obiettivi-e-criteri-di-successo-del-sistema)
  - [1.4 Definizioni, acronimi e abbreviazioni](#14-definizioni-acronimi-e-abbreviazioni)
  - [1.5 Riferimenti](#15-riferimenti)
  - [1.6 Organizzazione del documento](#16-organizzazione-del-documento)
- [2. Sistema corrente](#2-sistema-corrente)
  - [2.1 Panoramica](#21-panoramica)
- [3. Sistema proposto](#3-sistema-proposto)
  - [3.1 Panoramica](#31-panoramica)
    - [3.1.1 Activity Diagram Sistema Proposto](#311-activity-diagram-sistema-proposto)
      - [3.1.1.1 Questionario informativo e assegnazione del piano di stimolazione](#3111-questionario-informativo-e-assegnazione-del-piano-di-stimolazione)
      - [3.1.1.2 Svolgimento e monitoraggio piano di stimolazione](#3112-svolgimento-e-monitoraggio-piano-di-stimolazione)
      - [3.1.1.3 Questionario Alimentare e Piano alimentare](#3113-questionario-alimentare-e-piano-alimentare)
      - [3.1.1.4 Consultazione e monitoraggio paziente e tutore](#3114-consultazione-e-monitoraggio-paziente-e-tutore)
      - [3.1.1.5 Gestione amministrativa](#3115-gestione-amministrativa)
  - [3.2 Requisiti funzionali](#32-requisiti-funzionali)
    - [3.2.1 Lato Utente](#321-lato-utente)
    - [3.2.2 Lato Paziente](#322-lato-paziente)
    - [3.2.3 Lato Medico](#323-lato-medico)
    - [3.2.4 Lato Tutore](#324-lato-tutore)
    - [3.2.5 Lato Amministratore](#325-lato-amministratore)
    - [3.2.6 Lato Nutrizionista](#326-lato-nutrizionista)
  - [3.3 Requisiti non funzionali](#33-requisiti-non-funzionali)
    - [3.3.1 Funzionalità](#331-funzionalità)
    - [3.3.2 Usabilità](#332-usabilità)
    - [3.3.3 Affidabilità](#333-affidabilità)
    - [3.3.4 Prestazioni](#334-prestazioni)
    - [3.3.5 Sostenibilità](#335-sostenibilità)
    - [3.3.6 Implementazione](#336-implementazione)
    - [3.3.7 Operazione](#337-operazione)
  - [3.4 Modello di sistema](#34-modello-di-sistema)
    - [3.4.1 Scenari](#341-scenari)
      - [3.4.1.1 Scenari Paziente](#3411-scenari-paziente)
      - [3.4.1.2 Scenari Medico](#3412-scenari-medico)
      - [3.4.1.3 Scenari Tutore](#3413-scenari-tutore)
      - [3.4.1.4 Scenari Amministratore](#3414-scenari-amministratore)
      - [3.4.1.5 Scenari Nutrizionista](#3415-scenari-nutrizionista)
    - [3.4.2 Use Case](#342-use-case)
      - [3.4.2.1 Lato Paziente](#3421-lato-paziente)
      - [3.4.2.2 Lato Medico](#3422-lato-medico)
      - [3.4.2.3 Lato Tutore](#3423-lato-tutore)
      - [3.4.2.4 Lato Amministratore](#3424-lato-amministratore)
      - [3.4.2.5 Lato Nutrizionista](#3425-lato-nutrizionista)
    - [3.4.3 Use Case Diagram](#343-use-case-diagram)
      - [3.4.3.1 Use Case Diagram Paziente](#3431-use-case-diagram-paziente)
      - [3.4.3.2 Use Case Diagram Medico](#3432-use-case-diagram-medico)
      - [3.4.3.3 Use Case Diagram Tutore](#3433-use-case-diagram-tutore)
      - [3.4.3.4 Use Case Diagram Amministratore](#3434-use-case-diagram-amministratore)
      - [3.4.3.5 Use Case Diagram Nutrizionista](#3435-use-case-diagram-nutrizionista)
    - [3.4.4 Modello ad oggetti](#344-modello-ad-oggetti)
      - [3.4.4.1 Tabella oggetti](#3441-tabella-oggetti)
    - [3.4.5 Class Diagram](#345-class-diagram)
    - [3.4.6 Modello dinamico](#346-modello-dinamico)
      - [3.4.6.1 Statechart Diagram](#3461-statechart-diagram)
        - [3.4.6.1.1 Ciclo di vita del piano di stimolazione](#34611-ciclo-di-vita-del-piano-di-stimolazione)
        - [3.4.6.1.2 Ciclo di vita del questionario informativo](#34612-ciclo-di-vita-del-questionario-informativo)
        - [3.4.6.1.3 Ciclo di vita della sessione di stimolazione](#34613-ciclo-di-vita-della-sessione-di-stimolazione)
      - [3.4.6.2 Sequence Diagram](#3462-sequence-diagram)
        - [3.4.6.2.1 RevisionePianoStimolazione SD_UC_MD_1](#34621-revisionepianostimolazione-sd_uc_md_1)
        - [3.4.6.2.2 SvolgiSessioneStimolazione SD_UC_PZ_1](#34622-svolgisessionestimolazione-sd_uc_pz_1)
        - [3.4.6.2.3 CreaPianoAlimentarePaziente SD_UC_NT_1](#34623-creapianoalimentarepaziente-sd_uc_nt_1)
        - [3.4.6.2.4 CompilaQuestionarioInformativoPaziente SD_UC_TT_1](#34624-compilaquestionarioinformativopaziente-sd_uc_tt_1)
    - [3.4.7 Interfaccia Utente - Percorsi di Navigazione e Mock-ups](#347-interfaccia-utente---percorsi-di-navigazione-e-mock-ups)
      - [3.4.7.1 NP_AD](#3471-np_ad)
      - [3.4.7.2 NP_NT](#3472-np_nt)
      - [3.4.7.3 NP_PZ](#3473-np_pz)
      - [3.4.7.4 NP_TT](#3474-np_tt)
      - [3.4.7.5 NP_MD](#3475-np_md)
      - [3.4.7.6 UI_AD_1 AssegnaAssociazioniUtente](#3476-ui_ad_1-assegnaassociazioniutente)
      - [3.4.7.7 UI_TT_1 Compila Questionario Medico](#3477-ui_tt_1-compila-questionario-medico)
      - [3.4.7.8 UI_TT_2 CercaCentriEAttivita](#3478-ui_tt_2-cercacentrieattivita)
      - [3.4.7.9 UI_MD_2 CreazionePianoStimolazione](#3479-ui_md_2-creazionepianostimolazione)
      - [3.4.7.10 UI_PZ_1 SvolgiSessioneStimolazione](#34710-ui_pz_1-svolgisessionestimolazione)
      - [3.4.7.11 UI_NT_1 CreaPianoAlimentarePaziente](#34711-ui_nt_1-creapianoalimentarepaziente)
      - [3.4.7.12 UI_MD_1 VisualizzaAndamentoPaziente](#34712-ui_md_1-visualizzaandamentopaziente)
- [4. Glossario](#4-glossario)

---

# 1. Introduzione

Il presente documento costituisce il *Requirement Analysis Document* per lo sviluppo di **MindCompanion**, una piattaforma software integrata finalizzata al contrasto, al monitoraggio e alla prevenzione del decadimento cognitivo lieve e delle forme di demenza, tra cui la malattia di Alzheimer.

Il sistema è destinato a Residenze Sanitarie Assistenziali (RSA), cooperative sociali e Aziende Sanitarie Locali (ASL) e mira a superare la frammentazione informativa e la discontinuità assistenziale tra la struttura sanitaria, il domicilio del paziente e la rete che assiste il paziente o il singolo paziente se non è ancora assistito da qualcuno.

## 1.1 Obiettivo del sistema

L'obiettivo primario di **MindCompanion** è offrire una soluzione tecnologica integrata in grado di superare i limiti dei sistemi di allenamento cognitivo tradizionali e di accentrare la gestione della salute del paziente.

In particolare, il sistema si propone di:

- **Personalizzare e dinamizzare la stimolazione cognitiva:** consentire al medico di assegnare, calibrare, modificare o sospendere piani di stimolazione cognitiva adattati alle reali necessità e all'andamento clinico del paziente, evitando la ripetitività degli esercizi a catalogo fisso.

- **Integrare la gestione nutrizionale e degli stili di vita:** permettere al nutrizionista di definire e aggiornare piani alimentari personalizzati e consultare le risposte del paziente al questionario alimentare, affrontando l'alimentazione come uno dei fattori chiave di prevenzione del decadimento cognitivo.

- **Garantire la continuità informativa e la trasparenza:** mettere a disposizione del tutore un punto di accesso centralizzato per prendere visione dell’andamento delle sessioni di stimolazione e del piano alimentare assegnato”, riducendo la frammentazione delle informazioni tra struttura sanitaria e tutore.

- **Fornire uno strumento di supporto decisionale e di monitoraggio continuo:** dotare il personale medico e specialistico di storici e andamento delle sessioni per valutare con continuità e precisione l'evoluzione dello stato di salute del paziente anche al di fuori delle singole visite periodiche.

## 1.2 Ambito del sistema

Il progetto nasce come supporto olistico e integrato per le persone a rischio di decadimento cognitivo o affette da demenza, al fine di migliorarne la qualità della vita e favorire la continuità assistenziale tra strutture e domicilio.

Le operazioni e le funzionalità principali offerte dal sistema sono le seguenti:

- Consentire agli attori coinvolti (paziente, tutore, medico, amministratore e nutrizionista) di accedere in modo profilato alla piattaforma.

- Consentire al paziente di svolgere esercizi di stimolazione cognitiva personalizzati tramite un'interfaccia accessibile.

- Consentire al medico di definire, calibrare e monitorare i piani di stimolazione cognitiva dei propri pazienti.

- Consentire al nutrizionista di elaborare, caricare e gestire piani nutrizionali personalizzati.

- Consentire al tutore di **ricercare i centri sanitari specializzati e consultarne la scheda con le relative attività fisiche e sociali disponibili**, nonché di monitorare l'andamento del paziente, prendendo visione delle attività svolte e consultando il piano alimentare assegnato.

- Consentire all'amministratore di gestire gli account degli utenti, le associazioni tra pazienti e figure di supporto (medici, nutrizionisti, tutori) e il catalogo territoriale dei centri e delle attività.

Il sistema non supporta:

- La formulazione automatica di diagnosi cliniche.

- La fornitura diretta e il controllo di dispositivi medicali o di monitoraggio biometrico (es. wearables);

- La gestione di sistemi di tracciamento geografico o di emergenza attiva.

## 1.3 Obiettivi e criteri di successo del sistema

**Obiettivi:**

- Costruire un sistema di facile utilizzo che permetta di prevenire e rallentare il declino cognitivo attraverso attività mirate e la gestione dei fattori di rischio come l'alimentazione;

- Migliorare la qualità della vita del paziente e ridurre il carico di stress delle persone coinvolte nell'assistenza;

- Favorire la continuità assistenziale e la collaborazione tra strutture sanitarie, medici, nutrizionisti e tutori.

**Criteri di successo del sistema:**

- Semplificazione dell'assegnazione, della modifica e del monitoraggio dei piani di stimolazione cognitiva e nutrizionale da parte dei professionisti;

- Semplificazione della condivisione delle informazioni e del monitoraggio dell'andamento del paziente da parte dei tutori.

## 1.4 Definizioni, acronimi e abbreviazioni

- **Definizioni**: vedi Glossario

- **Acronimi**:

  - **SOW**: Statement of work

  - **RAD**: Requirement Analysis Document

  - **RF**: Requisito funzionale

  - **RNF**: Requisito non funzionale

  - **UI**: User Interface (prefisso degli identificativi dei mock-up, es. UI_TT_2)

  - **UML**: Unified Modeling Language

  - **SC**: Scenario

  - **UC**: Use Case

  - **ASL**: Azienda sanitaria locale

  - **RSA**: Residenza sanitaria assistenziale

  - **MCI**: Mild Cognitive Impairment (decadimento cognitivo lieve)

  - **SD**: Sequence diagram

  - **NP**: Navigation Path

- **Abbreviazioni**: ruoli degli utenti e dei dati usati negli identificativi di RF, SC, UC e mock-up

  - **PZ**: Paziente

  - **TT**: Tutore

  - **AD**: Amministratore

  - **MD**: Medico

  - **NT**: Nutrizionista

  - **CF:** Codice Fiscale

  - **UE:** Utente

- **Prefissi delle categorie dei RNF**: usati nella notazione RNF_[categoria]_[numero]

  - **FUN**: Funzionalità

  - **USA**: Usabilità

  - **AFF**: Affidabilità

  - **PRE**: Prestazioni

  - **SO**: Sostenibilità

  - **IMP**: Implementazione

  - **OPE**: Operazione

## 1.5 Riferimenti

- SOW relativo al progetto

- B. Bruegge, A.H. Dutoit, Object Oriented Software Engineering – Using UML, Patterns and Java, Prentice Hall.

## 1.6 Organizzazione del documento

- **Introduzione**: Delinea lo scopo, l'ambito applicativo e gli obiettivi del sistema MindCompanion, definendo le metriche di successo del progetto, la terminologia (1.4), i riferimenti documentali (1.5) e la struttura del RAD (1.6).

- **Sistema corrente**: Descrive lo stato di fatto e le modalità operative attuali adottate nelle RSA, cooperative e ASL.

- **Sistema proposto**: descrive il sistema proposto nelle seguenti sezioni:

  - **Panoramica**: Sintesi ad alto livello dell'architettura funzionale proposta

  - **Requisiti Funzionali** **del sistema:** descrizione delle funzionalità che il sistema deve offrire. Queste sono suddivise in categorie e seguono la notazione:

 RF_[attore]_[numero]

  - **Requisiti Non Funzionali:** descrizione dei criteri di qualità del sistema, espressi con la notazione:

RNF_[categoria]_[numero]

  -  **Modello di Sistema:** descrizione degli scenari e i casi d’uso, nonché i modelli, ad oggetti e dinamico, e le interfacce utente

# 2. Sistema corrente

## 2.1 Panoramica

La demenza è una condizione clinica acquisita e progressiva, caratterizzata dal declino di memoria, linguaggio, attenzione e capacità di giudizio. Il suo effetto è compromettere l’autonomia nelle attività quotidiane. La forma più diffusa è la malattia di Alzheimer. È una patologia grave perché irreversibile e porta il paziente a perdere progressivamente la propria autonomia. In Italia si stimano circa 1,1 milioni di persone con demenza, circa 900 mila con un deficit cognitivo lieve (MCI) e circa 3 milioni di persone coinvolte nell’assistenza.  Intervenire nella fase iniziale è fondamentale: la stimolazione cognitiva regolare può contribuire a rallentare il declino e a preservare più a lungo l’autonomia. Oggi esistono già diverse soluzioni digitali per l’allenamento cognitivo. Tra queste ci sono piattaforme per professionisti come NeuronUP e RehaCom, e applicazioni di brain training rivolte al grande pubblico come CogniFit e Lumosity. Si tratta in genere di cataloghi di esercizi predefiniti e il livello di difficoltà non sempre è calibrato sul singolo paziente. Sono quasi sempre pensate per l’uso in struttura o per il pubblico generico. Alcune offerte sono a pagamento e poco accessibili ai tutori. Gli altri aspetti legati alla malattia, come l’alimentazione e le attività fisiche e sociali, il monitoraggio del paziente, sono gestiti separatamente.

Le problematiche che emergono sono:

- Gli esercizi di stimolazione cognitiva sono spesso a catalogo fisso: si esauriscono, diventano ripetitivi e non sono personalizzabili alle esigenze del paziente;

- Manca un percorso condiviso tra paziente, tutore, medico e nutrizionista; quindi, le informazioni sul paziente sono frammentate;

- Il medico ha poca visibilità sull’andamento del paziente tra una visita e l’altra;

- I tutori faticano a trovare centri e attività adatti vicino casa, con informazioni verificate e aggiornate.

# 3. Sistema proposto

## 3.1 Panoramica

Il sistema proposto, MindCompanion, è una piattaforma web responsive, utilizzabile da PC e tablet, che riunisce paziente, tutore, medico e nutrizionista in un unico percorso condiviso e risponde alle problematiche descritte nel sistema corrente. Gli utenti della piattaforma sono Paziente (PZ), Tutore (TT), Medico (MD), Nutrizionista (NT) e Amministratore (AD). Ognuno accede in modo profilato e visualizza solo le sezioni di propria competenza. Un paziente può essere seguito da zero o più tutori (nessun tutore nel caso in cui il paziente voglia semplicemente prevenire il declino cognitivo), al massimo da un medico e al massimo da un nutrizionista; un paziente appena iscritto, o che ha chiesto di cambiare una di queste figure, può temporaneamente non averne nessuna associata. La gestione della piattaforma e la responsabilità di creare e modificare le associazioni tra il paziente e le figure di supporto sono affidate all'Amministratore (AD).

L'utente potrà:

- Fare login, logout della piattaforma e cambiare password;

Il PZ potrà:

- Fare login, logout della piattaforma e cambiare password;

- Svolgere la sessione di esercizi di stimolazione cognitiva prescritta dal medico, con esercizi sempre nuovi e calibrati sul proprio livello, ricevendo un aiuto progressivo in caso di errore;

- Aumentare in modo immediato la dimensione del testo;

- Visualizzare lo storico delle sessioni svolte, i punteggi ottenuti e l'andamento nel tempo;

- Consultare il piano alimentare assegnato dal nutrizionista, nelle viste giornaliera e settimanale;

- Compilare il questionario alimentare o il questionario informativo quando il nutrizionista o il medico lo inviano direttamente a lui.

Il MD potrà:

- Fare login, logout della piattaforma e cambiare password;

- Visualizzare, cercare e selezionare i pazienti a lui associati dall'amministratore;

- Creare il questionario informativo, inviarlo al tutore del paziente (o al paziente stesso in assenza di tutore) e consultare le risposte definitive inviate;

- Creare, revisionare, sospendere, riattivare ed eliminare il piano di stimolazione cognitiva del paziente;

- Visualizzare l'andamento degli esercizi svolti a casa.

Il TT potrà:

- Fare login, logout della piattaforma e cambiare password;

- Compilare e inviare il questionario informativo ricevuto dal medico per un paziente associato;

- Compilare il questionario alimentare del paziente quando il nutrizionista lo designa come destinatario;

- Visualizzare l'andamento delle attività svolte dal paziente e il piano alimentare;

- Cercare centri specializzati e attività fisiche e sociali e consultarne la scheda, senza gli eventi già conclusi.

Il NT potrà:

- Fare login, logout della piattaforma e cambiare password;

- Visualizzare l'elenco dei pazienti a lui associati;

- Inviare al tutore o al paziente un questionario alimentare per raccogliere le informazioni necessarie a redigere la dieta del paziente;

- Consultare le informazioni nutrizionali del paziente tramite le risposte al questionario alimentare;

- Caricare, revisionare periodicamente ed eliminare il piano alimentare del paziente associato.

- Visualizzare il piano alimentare del paziente

L'AD potrà:

- Fare login, logout della piattaforma e cambiare password;

- Registrare un nuovo utente specificandone il ruolo e i dati anagrafici, esportare le credenziali del nuovo utente, visualizzare l'elenco degli utenti registrati, modificarne i dati o eliminarne l'account;

- Associare medici, nutrizionisti e tutori ai pazienti, modificando o rimuovendo tali associazioni;

- Inserire, visualizzare, modificare e rimuovere i centri specializzati e le relative attività, indicandone fonte e data di verifica.

### 3.1.1 Activity Diagram Sistema Proposto

L'activity diagram del sistema proposto è composta dalle seguenti attività principali:

#### 3.1.1.1 Questionario informativo e assegnazione del piano di stimolazione

![Questionario informativo e assegnazione del piano di stimolazione](images/fig_02.jpg)

#### 3.1.1.2 Svolgimento e monitoraggio piano di stimolazione

![Svolgimento e monitoraggio piano di stimolazione](images/fig_03.jpg)

#### 3.1.1.3 Questionario Alimentare e Piano alimentare

![Questionario Alimentare e Piano alimentare](images/fig_04.jpg)



#### 3.1.1.4 Consultazione e monitoraggio paziente e tutore

![Consultazione e monitoraggio paziente e tutore](images/fig_05.jpg)

![Consultazione e monitoraggio paziente e tutore](images/fig_06.jpg)

#### 3.1.1.5 Gestione amministrativa

![Gestione amministrativa](images/fig_07.jpg)

## 3.2 Requisiti funzionali

### 3.2.1 Lato Utente

| **ID** | **NOME** | **DESCRIZIONE** | **PRIORITA’** |
| :---: | :---: | :---: | :---: |
| RF_UE_1 | LoginUtente | L'utente deve essere in grado di accedere alla piattaforma. | Alta |
| RF_UE_2 | LogoutUtente | L'utente deve essere in grado di fare logout dalla piattaforma.  | Alta |
| RF_UE_3 | CambiaPassword | L'utente dovrebbe essere in grado di cambiare la propria password inserendo quella attuale e la nuova password scelta. Essere lunghe almeno da 8 a un massimo 16 caratteri ed entrambe le password non dovranno coincidere in caratteri per essere considerate valide. | Media |
| RF_UE_4 | CambioPasswordPrimoAccesso | Al primo accesso l'utente è obbligato a impostare una nuova password. | Alta |

### 3.2.2 Lato Paziente

| **ID** | **NOME** | **DESCRIZIONE** | **PRIORITA’** |
| :---: | :---: | :---: | :---: |
| RF_PZ_1 | SvolgiSessioneStimolazione | Il paziente deve essere in grado di eseguire la sessione di esercizi di stimolazione cognitiva prescritta dal medico. | Alta |
| RF_PZ_2 | VisualizzaAndamentoPersonale | Il paziente, nella propria area personale, deve poter visualizzare lo storico delle sessioni svolte, i punteggi ottenuti, l'andamento nel tempo e il dettaglio delle risposte di ciascuna sessione. | Alta |
| RF_PZ_3 | VisualizzaPianoAlimentarePaziente | Il paziente deve essere in grado di visualizzare il piano alimentare creato dal nutrizionista nei formati giornaliero e settimanale. | Alta |
| RF_PZ_4 | CompilaQuestionarioPianoAlimentare | Il paziente dovrebbe essere in grado di compilare e inviare il questionario alimentare che il nutrizionista ha inviato a lui come destinatario. | Media |
| RF_PZ_5 | CompilaQuestionarioInformativo | Il paziente dovrebbe essere in grado di compilare e inviare il questionario informativo che il medico ha inviato a lui come destinatario. | Media |
| RF_PZ_6 | AiutoProgressivo | Nel caso in cui il paziente commetta un errore durante un esercizio, il sistema dovrebbe fornire fino a 2 aiuti progressivi; se la risposta resta errata dopo il secondo aiuto, il sistema passa all'esercizio successivo. | Media |
| RF_PZ_7 | IngrandimentoTesto | Il paziente potrebbe aumentare in modo immediato la dimensione del testo, scegliendo tra 3 livelli disponibili: "normale", "grande", "molto grande". | Bassa |

### 3.2.3 Lato Medico

| **ID** | **NOME** | **DESCRIZIONE** | **PRIORITA’** |
| :---: | :---: | :---: | :---: |
| RF_MD_1 | CreazionePianoStimolazione | Il medico deve essere in grado di creare il piano di stimolazione al proprio paziente associato, definendo il livello di difficoltà iniziale e il numero di esercizi per sessione. | Alta |
| RF_MD_2 | VisualizzaAndamentoPaziente | Il medico deve poter visualizzare i punteggi delle sessioni, numero di sessioni svolte, frequenza delle sessioni e il livello di difficoltà degli esercizi assegnati del proprio paziente per verificare l'andamento degli esercizi svolti e monitorarne i progressi nel tempo. | Alta |
| RF_MD_3 | VisualizzaElencoPazientiAssociati | Il medico deve poter visualizzare, cercare e selezionare esclusivamente i pazienti già registrati e a lui associati dall'amministratore, visualizzando gli eventuali tutori associati. | Alta  |
| RF_MD_4 | RevisionePianoStimolazione | Il medico deve poter revisionare, modificando i parametri, il piano di stimolazione cognitiva, da lui assegnato, in base all’andamento del paziente. | Alta |
| RF_MD_5 | SospensionePianoStimolazione | Il medico deve poter sospendere temporaneamente il piano di stimolazione cognitiva da lui assegnato, in base all’andamento del paziente. | Alta |
| RF_MD_6 | RiattivazionePianoStimolazione | Il medico deve essere in grado di riattivare un piano di stimolazione cognitiva, quando ritiene il paziente idoneo, precedentemente sospeso. | Alta |
| RF_MD_7 | CreaQuestionarioInformativo | Il medico dovrebbe essere in grado di creare un questionario informativo da associare al paziente. | Media |
| RF_MD_8 | VisualizzaRisposteQuestionarioInformativo | Il medico dovrebbe essere in grado di consultare le risposte definitive al questionario informativo inviate dal tutore o dal paziente associato. Le bozze non ancora inviate restano visibili esclusivamente a chi le compila. | Media |
| RF_MD_9 | InviaQuestionarioInformativo | Il medico dovrebbe essere in grado di inviare il questionario a un tutore associato al paziente o, in assenza di tutori, al paziente stesso. | Media |
| RF_MD_10 | EliminazionePianoStimolazione | Il medico deve poter eliminare il piano di stimolazione. | Alta |

### 3.2.4 Lato Tutore

| **ID** | **NOME** | **DESCRIZIONE** | **PRIORITA’** |
| :---: | :---: | :---: | :---: |
| RF_TT_1 | VisualizzaPianoAlimentarePaziente | Il tutore deve essere in grado di visualizzare il piano alimentare del paziente a lui associato. | Alta |
| RF_TT_2 | VisualizzaAndamentoPaziente | Il tutore deve essere in grado di visualizzare l'andamento delle attività svolte dal paziente a lui associato. | Alta |
| RF_TT_3 | RicercaCentri | Il tutore dovrebbe essere in grado di ricercare i centri specializzati e consultarne la scheda con le attività fisiche e sociali disponibili, filtrando per comune, provincia o regione. | Media |
| RF_TT_4 | VisualizzaDettaglioCentro | Il tutore dovrebbe essere in grado di visualizzare la scheda di un centro con i contatti, le attività offerte, la fonte e la data di ultima verifica delle informazioni. | Media |
| RF_TT_5 | CompilaQuestionarioPianoAlimentare | Il tutore dovrebbe poter compilare e inviare il questionario alimentare del paziente associato quando il nutrizionista lo sceglie come destinatario. Il sistema valida i dati prima dell'invio definitivo. | Media |
| RF_TT_6 | EscludiEventiConclusi | Il sistema dovrebbe nascondere automaticamente dalle viste di ricerca e dettaglio gli eventi e le iniziative la cui data di conclusione sia precedente alla data corrente. I centri privi di eventi futuri restano comunque visibili nel catalogo. | Media |
| RF_TT_7 | OrdinaCentriEAttivita | Il sistema potrebbe ordinare i risultati della ricerca dei centri per vicinanza rispetto al filtro geografico selezionato dall'utente (stesso comune, stessa provincia, stessa regione) e, a parità di area, per data di inizio degli eventi futuri più imminenti. | Bassa |
| RF_TT_8 | CompilaQuestionarioInformativoPaziente | Il tutore dovrebbe poter compilare e inviare il questionario informativo del paziente associato quando il medico lo sceglie come destinatario. Il sistema valida i dati prima dell'invio definitivo. | Media |
| RF_TT_9 | VisualizzaElencoPazientiAssociati | Il tutore deve essere in grado di visualizzare l’elenco dei pazienti a lui associati. | Alta |

### 3.2.5 Lato Amministratore

| **ID** | **NOME** | **DESCRIZIONE** | **PRIORITA’** |
| :---: | :---: | :---: | :---: |
| RF_AD_1 | InserisciUtente | L'amministratore deve essere in grado di registrare un nuovo utente nel sistema, specificandone il ruolo (paziente, medico, nutrizionista o tutore) e i dati anagrafici, la password temporanea verrà generata dal sistema. | Alta |
| RF_AD_2 | ModificaUtente | L'amministratore deve essere in grado di aggiornare le informazioni e i dati associati a un account utente esistente all'interno della piattaforma. | Alta |
| RF_AD_3 | EliminaUtente | L'amministratore deve essere in grado di eliminare un utente dal sistema | Alta |
| RF_AD_4 | InserimentoCentro  | L’amministratore dovrebbe essere in grado di inserire un nuovo centro con le relative attività, indicando obbligatoriamente la fonte e la data di verifica. | Media |
| RF_AD_5 | ModificaCentro | L’amministratore dovrebbe essere in grado di modificare le informazioni di un centro esistente e delle relative attività, aggiornandone la data di verifica. | Media |
| RF_AD_6 | RimozioneCentro | L’amministratore potrebbe essere in grado di rimuovere dalla piattaforma un centro non più attivo. | Bassa |
| RF_AD_7 | VisualizzaElencoUtenti | L’amministratore deve essere in grado di visualizzare l’elenco degli utenti registrati alla piattaforma, potendo cercarli per nome, cognome, codice fiscale o e-mail e filtrarli per ruolo. Per ciascun utente devono essere visualizzati esclusivamente i dati anagrafici. | Alta |
| RF_AD_8 | AssegnaAssociazioniUtente | L’amministratore deve essere in grado di associare a un paziente già registrato le figure di supporto previste (medico, nutrizionista, tutore), selezionando il paziente e, per ciascuna figura, un utente già registrato con il ruolo corrispondente. Il sistema deve garantire il rispetto delle regole di cardinalità: a ciascun paziente è possibile associare al massimo un medico, al massimo un nutrizionista e zero o più tutori (l’assenza temporanea di un medico o nutrizionista è ammessa); un tutore può essere associato a zero o più pazienti. | Alta |
| RF_AD_9 | VisualizzaElencoCentri | L’amministratore dovrebbe essere in grado di visualizzare l'elenco dei centri esistenti sulla piattaforma. | Media |
| RF_AD_10 | ModificaAssociazioniUtente | L'amministratore deve essere in grado di sostituire o aggiornare le associazioni esistenti tra il paziente e le sue figure di supporto mantenendo l'integrità dei dati previsti dal sistema. | Alta |
| RF_AD_11 | RimuoviAssociazioniUtente | L'amministratore deve essere in grado di eliminare un'associazione esistente tra utenti (es. rimuovere il legame tra un paziente e il suo medico, nutrizionista o tutore), ripristinando lo stato di assenza di associazione senza cancellare gli account utente coinvolti. | Alta |
| RF_AD_12 | EsportaCredenziali | L'amministratore, al termine della registrazione dell'utente. L'amministratore apre una pagina stampabile con le credenziali del nuovo utente (e-mail e password temporanea), da stampare o salvare come PDF dal browser. Il sistema non conserva copie in chiaro. | Alta |

### 3.2.6 Lato Nutrizionista

| **ID** | **NOME** | **DESCRIZIONE** | **PRIORITA’** |
| :---: | :---: | :---: | :---: |
| RF_NT_1 | CreaPianoAlimentarePaziente | Il nutrizionista deve essere in grado di caricare la dieta per il paziente associato. | Alta |
| RF_NT_2 | VisualizzaRisposteQuestionarioAlimentare | Il nutrizionista dovrebbe essere in grado di consultare le risposte definitive al questionario alimentare inviate dal tutore o dal paziente associato. Le bozze non ancora inviate restano visibili esclusivamente a chi le compila. | Media |
| RF_NT_3 | CreaQuestionarioAlimentare | Il nutrizionista dovrebbe poter creare e inviare il questionario alimentare a un tutore associato al paziente o, in assenza di tutori, al paziente stesso, per raccogliere le informazioni necessarie per redigere un piano alimentare. | Media |
| RF_NT_4 | ModificaPianoAlimentare | Il nutrizionista deve poter modificare periodicamente il piano alimentare assegnato in base ai riscontri periodici del paziente o del tutore. | Alta |
| RF_NT_5 | EliminaPianoAlimentare | Il nutrizionista deve poter eliminare il piano alimentare da lui creato per il paziente associato. | Alta |
| RF_NT_6 | VisualizzaElencoPazientiAssociati | Il nutrizionista deve poter visualizzare, cercare e selezionare esclusivamente i pazienti già registrati e a lui associati dall'amministratore, visualizzando gli eventuali tutori associati. | Alta |
| RF_NT_7 | VisualizzaPianoAlimentarePaziente | Il nutrizionista deve essere in grado di visualizzare il piano alimentare del paziente a lui associato. | Alta |

## 3.3 Requisiti non funzionali

### 3.3.1 Funzionalità

| **ID** | **NOME** | **DESCRIZIONE** | **PRIORITA** |
| :---: | :---: | :---: | :---: |
| RNF_FUN_1 | GestionePrioritàRequisiti | I requisiti funzionali con una priorità alta associata devono essere realizzati al primo rilascio del sistema. | Alta |
| RNF_FUN_2 | ValidazioneUnivocitaQuiz | L'algoritmo di generazione degli esercizi di stimolazione cognitiva deve integrare validatori formali che garantiscano per ogni quesito prodotto la presenza di una e una sola risposta esatta univoca, scartando quesiti ambigui o insolubili. | Alta |
| RNF_FUN_3 | ControlloAccessiPerRuolo | Il sistema deve consentire a ciascun utente di accedere solo alle funzioni e ai dati previsti per il proprio ruolo e deve rifiutare le richieste non autorizzate. Criterio di accettazione: in un test con un account per ciascun ruolo, il 100% delle richieste a risorse di altri ruoli viene rifiutato. | Alta |
| RNF_FUN_4 | CrittografiaDatiSensibili | Il sistema deve cifrare tutti i dati personali sanitari dei pazienti memorizzati nel database con algoritmo AES-256. Criterio di accettazione: nel database nessun campo sanitario è leggibile in chiaro. | Alta |
| RNF_FUN_5 | HashPassword | Le password devono avere almeno 8 caratteri e al massimo 16 caratteri e sono salvate solo come hash, mai in chiaro né cifrate in modo reversibile.Le password temporanee sono generate casualmente (almeno 12 caratteri) e salvate solo come hash. | Alta |

### 3.3.2 Usabilità

| **ID** | **NOME** | **DESCRIZIONE** | **PRIORITA’** |
| :---: | :---: | :---: | :---: |
| RNF_USA_1 | FeedbackGradualeGentile | Nel caso in cui il paziente commetta un errore durante l'esecuzione di un esercizio, il sistema non deve visualizzare messaggi punitivi né riprodurre allarmi sonori invasivi, ma deve mostrare messaggi empatici e rassicuranti. Criterio di accettazione: nessun suono di allarme viene riprodotto e il 100% dei messaggi di errore proviene da un catalogo di messaggi empatici approvato. | Alta |
| RNF_USA_2 | SemplicitaNavigazionePaziente | L’avvio della sessione giornaliera prescritta deve essere accessibile entro un massimo di 2 tocchi dalla schermata principale | Alta |
| RNF_USA_3 | LeggibilitaInterfacciaPaziente | L'interfaccia destinata al paziente dovrebbe utilizzare testi leggibili da una persona anziana: carattere di dimensione non inferiore a 18 px e contrasto con lo sfondo di almeno 4,5:1 (livello AA delle WCAG 2.1). | Media |
| RNF_USA_4 | ProfonditaMenuPaziente | L'area riservata del paziente non deve presentare menu nidificati a più di 3 livelli né elementi a scomparsa complessi.  | Alta |
| RNF_USA_5 | LinguaggioSemplicePaziente | L'interfaccia destinata al paziente dovrebbe usare un linguaggio semplice e istruzioni brevi. Criterio di accettazione: ogni istruzione contiene al massimo 15 parole e richiede una sola azione. | Media |
| RNF_USA_6 | DistinzioneElementiPrincipali | Nelle schermate del paziente gli elementi principali dovrebbero essere facilmente distinguibili da quelli secondari, che vanno ridotti al minimo. Criterio di accettazione: ogni schermata evidenzia una sola azione principale e contiene al massimo 3 elementi secondari. | Media |

### 3.3.3 Affidabilità

| **ID** | **NOME** | **DESCRIZIONE** | **PRIORITA’** |
| :---: | :---: | :---: | :---: |
| RNF_AFF_1 | PersistenzaRisposteSessione | Quando si verifica un'interruzione della connessione durante una sessione di stimolazione cognitiva, il sistema deve salvare lo stato di avanzamento garantendo nessuna perdita degli esercizi già confermati dal paziente. Criterio di accettazione: al ripristino della connessione, il 100% delle risposte già confermate prima dell'interruzione risulta salvato e recuperato. | Alta |
| RNF_AFF_2 | PersistenzaBozzaQuestionari | Quando un utente salva la bozza di un questionario o la connessione si interrompe durante la compilazione, il sistema deve conservare l'ultima bozza salvata e ripristinarla alla riconnessione o al successivo accesso. Criterio di accettazione: la bozza ripristinata contiene il 100% dei campi salvati prima dell'interruzione. | Alta |

### 3.3.4 Prestazioni

| **ID** | **NOME** | **DESCRIZIONE** | **PRIORITA’** |
| :---: | :---: | :---: | :---: |
| RNF_PRE_1 | TempoGenerazioneEsercizi | Quando il paziente richiede l'avvio di una sessione di stimolazione cognitiva, il sistema deve generare e caricare gli esercizi calibrati in un tempo inferiore a 15 secondi nel 90% dei casi. | Alta |

### 3.3.5 Sostenibilità

| **ID** | **NOME** | **DESCRIZIONE** | **PRIORITA’** |
| :---: | :---: | :---: | :---: |
| RNF_SO_1 | Responsive | Il sistema sarà realizzato in modo da poter garantirne l'utilizzo su PC e tablet tramite un'interfaccia responsive. Criterio di accettazione: l'interfaccia risulta correttamente visualizzabile e utilizzabile su almeno il 95% dei dispositivi client degli utenti (schermi da 768 px di larghezza in su). | Alta |

### 3.3.6 Implementazione

| **ID** | **NOME** | **DESCRIZIONE** | **PRIORITA’** |
| :---: | :---: | :---: | :---: |
| RNF_IMP_1 | ArchiviazioneNoSQL | Il sistema deve archiviare i dati persistenti utilizzando il DBMS NoSQL MongoDB tramite documenti strutturati in formato BSON | Alta |
| RNF_IMP_2 | TecnologiaSviluppoWeb | Il sistema deve implementare la piattaforma utilizzando il framework Next.js e la libreria React con linguaggio TypeScript. | Alta |

### 3.3.7 Operazione

| **ID** | **NOME** | **DESCRIZIONE** | **PRIORITA’** |
| :---: | :---: | :---: | :---: |
| RNF_OPE_1 | CompatibilitaBrowserWeb | Il sistema deve essere fruibile sui dispositivi client tramite i browser web Google Chrome, Mozilla Firefox, Apple Safari e Microsoft Edge aggiornati all'ultima versione stabile. | Alta |

## 3.4 Modello di sistema

### 3.4.1 Scenari

#### 3.4.1.1 Scenari Paziente

| **NOME SCENARIO** | SC_PZ_1 SvolgiSessioneStimolazione |  |
| :---: | --- | --- |
| **ATTORI** | MARIO: Paziente |  |
|  **FLUSSO DI EVENTI**       | **ATTORE**  | **SISTEMA** |
|  | Mario vuole svolgere la sessione di stimolazione cognitiva prescritta dal suo medico e accede alla piattaforma *MindCompanion*. |   |
|  |   | Il sistema mostra a Mario la sua schermata personale con l'indicazione della sessione di stimolazione cognitiva prescritta dal suo medico e il pulsante Avvia Sessione. |
|  | Mario seleziona il pulsante Avvia Sessione. |   |
|  |   | Il sistema carica il piano di stimolazione cognitiva personalizzato e presenta a Mario il primo esercizio. |
|  | Mario completa il primo esercizio e clicca sul tasto Conferma |   |
|  |   | Il sistema valuta la risposta, salva l'avanzamento con l'esercizio appena confermato e fornisce a Mario un feedback riguardo la correttezza dell'esercizio, dopodiché presenta a Mario il prossimo esercizio. |
|  | Mario prosegue allo stesso modo fino all'ultimo esercizio e clicca sul pulsante Concludi sessione. |   |
|  |   | Il sistema registra il completamento della sessione, salva i risultati per il monitoraggio del medico, aggiorna lo storico personale dell'andamento e mostra a schermo un messaggio di conferma. |




| **NOME SCENARIO** | SC_PZ_2 VisualizzaPianoAlimentarePaziente |  |
| :---: | --- | --- |
| **ATTORI** | LUCA: Paziente |  |
| **FLUSSO DI EVENTI** | **ATTORE**  | **SISTEMA** |
|  | Luca vuole consultare la dieta assegnata dal suo nutrizionista per verificare i pasti della giornata. Accede alla sezione "Piano Alimentare" della propria area personale sulla piattaforma MindCompanion. |   |
|  |   | Il sistema recupera il piano nutrizionale personalizzato redatto dal nutrizionista e mostra a Luca il piano dettagliato della giornata (colazione, pranzo, cena e spuntini). |
|  | Luca seleziona un altro giorno della settimana per controllare le indicazioni nutrizionali previste per i giorni successivi. |   |
|  |   | Il sistema aggiorna la vista a schermo mostrando in dettaglio il piano alimentare per la giornata selezionata. |


| **NOME SCENARIO** | SC_PZ_3 CompilaQuestionarioPianoAlimentare |  |
| :---: | --- | --- |
| **ATTORI** | VINCENZO: Paziente |  |
| **FLUSSO DI EVENTI** | **ATTORE**  | **SISTEMA** |
|  | Vincenzo accede alla sua area personale per rispondere al questionario alimentare che gli ha inviato la nutrizionista Sara. |   |
|  |   | Il sistema presenta a Vincenzo il questionario alimentare personalizzato con i relativi campi da compilare (es. preferenze sui pasti e allergie/intolleranze). |
|  | Vincenzo inserisce le risposte richieste e seleziona il pulsante per confermare l'invio. |   |
|  |   | Il sistema valida le informazioni inserite, salva il questionario associandolo a Vincenzo per la consultazione della nutrizionista e mostra un messaggio a schermo di conferma dell’avvenuta sottomissione. |

| **NOME SCENARIO** | SC_PZ_4 VisualizzaAndamentoPersonale |  |
| :---: | :---: | --- |
| **ATTORI** | PAOLO: Paziente |  |
| **FLUSSO DI EVENTI** | **ATTORE** | **SISTEMA** |
|  | Paolo vuole visualizzare l’andamento dei suoi esercizi nel tempo, dunque accede alla sua area personale, nella sezione che riporta lo storico delle sessioni svolte, i punteggi ottenuti e l'andamento nel tempo. |  |
|  |  | Il sistema presenta a Paolo la schermata che mostra l'elenco delle sessioni svolte con relativi risultati e l'andamento dei risultati nel tempo. |
|  | Paolo seleziona una sessione in particolare, l'ultima, per controllare nel dettaglio quali risposte abbia dato giuste e quali sbagliate. |  |
|  |  | Il sistema mostra a Paolo la pagina dell'ultima sessione con le relative risposte date da Paolo. |

#### 3.4.1.2 Scenari Medico

| **NOME SCENARIO** | SC_MD_1 RevisionePianoStimolazione |  |
| :---: | --- | --- |
| **ATTORI** | MARCO: Medico |  |
| **FLUSSO DI EVENTI** | **ATTORE** | **SISTEMA** |
|  | Marco, medico che segue il paziente Luca, accede alla piattaforma MindCompanion ed entra nella propria area personale. |  |
|  |  | Il sistema mostra a Marco la propria area personale con i suoi dati personali. |
|  | Marco vuole visionare l'andamento del piano di stimolazione di Luca, già associato a Marco, e preme sulla sezione "I miei pazienti". |  |
|  |  | Il sistema mostra a Marco la lista dei pazienti associati mostrando nome, cognome, età, codice fiscale e relativo piano di stimolazione. |
|  | Marco cerca Luca nella sua lista e clicca sul pulsante "Visualizza andamento paziente" |  |
|  |  | Il sistema mostra l’andamento del paziente: punteggi delle sessioni, numero di sessioni svolte, frequenza e livello di difficoltà. |
|  | Marco nota che il punteggio medio delle ultime sessioni di Luca è sceso dal 78% al 52% e che Luca ha svolto poche sessioni nell’ultima settimana. Decide di ricalibrare il piano e apre la sezione “Modifica piano di stimolazione”. |   |
|  |  | Il sistema mostra il piano corrente con i parametri attuali. |
|  | Marco riduce il livello di difficoltà del piano e conferma le modifiche. |  |
|  |  | Il sistema verifica la validità dei nuovi parametri, li salva e mostra a Marco un messaggio di operazione riuscita. Da quel momento Luca svolgerà le sessioni con il piano aggiornato. |

| **NOME SCENARIO** | SC_MD_2 CreazionePianoStimolazione |  |
| :---: | --- | --- |
| **ATTORI** | MARCO: Medico |  |
| **FLUSSO DI EVENTI** | **ATTORE** | **SISTEMA** |
|  | Marco, dopo che gli è stato assegnato il paziente Luca, da parte dell'amministratore, va all'interno della propria area personale e clicca sulla sezione "I miei pazienti". |  |
|  |  | Il sistema mostra a Marco la lista dei pazienti, a lui associati, con il loro nome, cognome, codice fiscale, età, relativo piano di stimolazione ed eventuali tutori associati. |
|  | Marco cerca Luca nella lista inserendo il suo codice fiscale. |  |
|  |  | Il sistema compie la ricerca e mostra a Marco i dettagli del paziente Luca. |
|  | Marco preme sul pulsante "Aggiungi piano stimolazione". |  |
|  |  | Il sistema mostra a schermo la schermata per creare il piano di stimolazione di Luca. |
|  | Marco aggiunge i parametri necessari per creare il piano di stimolazione e preme sul pulsante "Conferma". |  |
|  |  | Il sistema verifica la validità dei parametri e salva il piano di stimolazione appena aggiunto da Marco. Infine, mostra un messaggio di operazione riuscita. Luca vedrà il piano di stimolazione assegnato da Marco al suo login. |

| **NOME SCENARIO** | SC_MD_3 VisualizzaElencoPazientiAssociati |  |
| :---: | --- | --- |
| **ATTORI** | MARCO: Medico |  |
| **FLUSSO DI EVENTI** | **ATTORE** | **SISTEMA** |
|  | Marco accede alla piattaforma e va nella propria area personale nella sezione "I miei pazienti". |  |
|  |  | Il sistema mostra a Marco la lista dei suoi pazienti, mostrando nome, cognome, età, codice fiscale, piano di stimolazione ed eventuali tutori associati. |
|  | Marco cerca il paziente Luca nella lista tramite codice fiscale. |  |
|  |  | Il sistema mostra a Marco una schermata in cui compaiono tutte le informazioni del paziente nome, cognome, età, tutore associato, piano di stimolazione. |

| **NOME SCENARIO** | SC_MD_4 SospensionePianoStimolazione |  |
| :---: | --- | --- |
| **ATTORI** | MARCO: Medico |  |
| **FLUSSO DI EVENTI** | **ATTORE** | **SISTEMA** |
|  | Marco accede alla piattaforma e va nella propria area personale nella sezione "I miei pazienti". |  |
|  |  | Il sistema mostra a Marco la lista dei suoi pazienti, mostrando nome, cognome, età, codice fiscale e piano di stimolazione. |
|  | Marco seleziona il paziente Luca. |  |
|  |  | Il sistema mostra la scheda di Luca con il piano di stimolazione attuale e l'andamento delle sessioni svolte (punteggi, numero di sessioni, frequenza e livello di difficoltà). |
|  | Marco visualizza il piano di stimolazione del paziente Luca, notando uno storico dei risultati non positivo, Luca ha avuto punteggi molto bassi nelle ultime 5 sessioni, decide quindi di sospendere il piano di stimolazione attuale. Per farlo Marco preme sul pulsante "Sospendi piano". |  |
|  |  | Il sistema mostra a Marco un messaggio che conferma la sospensione del piano di stimolazione e ora Luca non potrà avviare nuove sessioni finché non verrà riattivato. |

#### 3.4.1.3 Scenari Tutore

| **NOME SCENARIO** | SC_TT_1  CompilaQuestionarioInformativoPaziente |  |
| :---: | :---: | --- |
| **ATTORI** | ANTONIO: Tutore |  |
| **FLUSSO DI EVENTI** | **ATTORE** | **SISTEMA** |
|  | Antonio, tutore associato al paziente Giuseppe, ha ricevuto dal medico Marco il questionario informativo da compilare per Giuseppe e accede alla pagina "I miei pazienti". |  |
|  |   | Il sistema mostra ad Antonio la lista dei pazienti a lui associati. |
|  | Antonio nota il questionario da compilare accanto al nome di Giuseppe e clicca sul pulsante 'Compila Questionario Medico'. |  |
|  |  | Il sistema mostra ad Antonio il modulo del questionario informativo inviato dal medico Marco per il paziente Giuseppe. |
|  | Antonio compila le risposte riguardanti le abitudini e lo stato di Giuseppe, poi preme "Invia". |  |
|  |  | Il sistema valida i dati, salva il questionario e mostra ad Antonio un messaggio di conferma dell'avvenuta sottomissione. |

| **NOME SCENARIO** |  SC_TT_2 VisualizzaAndamentoPaziente |  |
| :---: | :---: | --- |
| **ATTORI** | ANTONIO: Tutore |  |
| **FLUSSO DI EVENTI** | **ATTORE** | **SISTEMA** |
|  | Antonio, tutore di Giuseppe, vuole controllare l'andamento degli esercizi a casa del suo paziente. Accede alla piattaforma MindCompanion e va alla lista dei pazienti. |  |
|  |  | Il sistema mostra la lista dei pazienti associati ad Antonio. |
|  | Antonio seleziona il profilo di Giuseppe e clicca sulla scheda "Andamento Paziente".  |  |
|  |  | Il sistema recupera i dati e mostra lo storico delle sessioni cognitive svolte da Giuseppe e i relativi punteggi nel tempo. |

| **NOME SCENARIO** |  SC_TT_3 VisualizzazioneInfoCentri |  |
| :---: | :---: | --- |
| **ATTORI** | ANTONIO: Tutore |  |
| **FLUSSO DI EVENTI** | **ATTORE** | **SISTEMA** |
|  | Antonio, tutore associato al paziente Giuseppe, ha bisogno di trovare un'attività sociale adatta a Giuseppe. Accede alla sezione "Centri e Attività" della piattaforma. |  |
|  |  | Il sistema mostra la pagina di ricerca del catalogo territoriale. |
|  | Antonio imposta il filtro per la provincia di "Salerno" e clicca su "Cerca". |  |
|  |  | Il sistema filtra le strutture attive e mostra l'elenco dei centri presenti nella provincia selezionata. |
|  | Antonio clicca sulla scheda di uno dei centri risultanti per visualizzarne i dettagli. |  |
|  |  | Il sistema mostra la scheda informativa del centro con i relativi contatti, le attività offerte, la fonte ufficiale e la data di ultima verifica delle informazioni. |

| **NOME SCENARIO** |  SC_TT_4 VisualizzaPianoAlimentarePaziente |  |
| :---: | :---: | --- |
| **ATTORI** | ANTONIO: Tutore |  |
| **FLUSSO DI EVENTI** | **ATTORE** | **SISTEMA** |
|  | Antonio, tutore di Giuseppe, vuole controllare il piano alimentare di Giuseppe. Accede alla piattaforma MindCompanion e va alla lista dei pazienti. |  |
|  |  | Il sistema mostra la lista dei pazienti associati ad Antonio. |
|  | Antonio seleziona il profilo di Giuseppe e clicca sulla scheda "Piano Alimentare".  |  |
|  |  | Il sistema recupera i dati e mostra il piano alimentare di Giuseppe con i pasti della giornata (colazione, pranzo, cena e spuntini) e la possibilità di passare alla vista giornaliera o settimanale. |

#### 3.4.1.4 Scenari Amministratore

| **NOME SCENARIO** | SC_AD_1 InserisciUtente |  |
| :---: | :---: | --- |
| **ATTORI** | GIOVANNI: Amministratore |  |
| **FLUSSO DI EVENTI** | **ATTORE** | **SISTEMA** |
|  | Giovanni, amministratore della piattaforma, vuole inserire un nuovo utente all'interno della piattaforma, si reca nella sezione "Elenco utenti" dell'area amministrativa per registrare un nuovo utente. |  |
|  |  | Il sistema mostra la pagina di gestione utenti mostrando l'elenco degli utenti già presenti e il pulsante "Aggiungi Nuovo Utente". |
|  | Giovanni clicca sul pulsante "Aggiungi Nuovo Utente". |  |
|  |  | Il sistema mostra a schermo il modulo contenente i campi da inserire per creare un nuovo utente (es. Nome, cognome, e-mail, ruolo). |
|  | Giovanni compila il modulo con i dati anagrafici, l'e-mail e seleziona il ruolo (es. Medico), poi clicca su "Conferma". |  |
|  |  | Il sistema convalida i dati inseriti, genera una password temporanea per il primo accesso, crea il nuovo account nel database, mostra un messaggio di conferma di avvenuta registrazione e mostra un pulsante "Esporta Credenziali". |
|  | Giovanni clicca sul pulsante "Esporta Credenziali" |  |
|  |  | Il sistema apre una pagina stampabile con le credenziali da far recapitare all'utente. |
|  | Giovanni stampa le credenziali e le consegna all'utente (se le credenziali vanno perse l'amministratore elimina l'account e lo ricrea). |  |

| **NOME SCENARIO** | SC_AD_2 ModificaUtente |  |
| :---: | :---: | --- |
| **ATTORI** | GIOVANNI: Amministratore |  |
| **FLUSSO DI EVENTI** | **ATTORE** | **SISTEMA** |
|  | Giovanni, amministratore della piattaforma, vuole modificare un'informazione anagrafica di un utente (es. indirizzo e-mail), quindi, si reca nella sezione "Elenco utenti" dell'area amministrativa. |  |
|  |  | Il sistema mostra la pagina di gestione utenti mostrando l'elenco degli utenti presenti sulla piattaforma |
|  | Giovanni seleziona l'utente di cui vuole modificare le informazioni e clicca sul pulsante "Modifica Utente". |  |
|  |  | Il sistema mostra la scheda di dettaglio dell'utente selezionato con i campi modificabili. |
|  | Giovanni aggiorna i campi desiderati e clicca sul pulsante "Salva Modifiche". |  |
|  |  | Il sistema verifica la correttezza dei nuovi dati, aggiorna l'account nel database e mostra un messaggio di conferma dell'avvenuta modifica. |

| **NOME SCENARIO** | SC_AD_3 EliminaUtente |  |
| :---: | :---: | --- |
| **ATTORI** | GIOVANNI: Amministratore |  |
| **FLUSSO DI EVENTI** | **ATTORE** | **SISTEMA** |
|  | Giovanni, amministratore della piattaforma, vuole eliminare un utente non più attivo sulla piattaforma, si reca nella sezione "Elenco utenti" dell'area amministrativa. |  |
|  |  | Il sistema mostra la pagina di gestione utenti mostrando l'elenco degli utenti presenti sulla piattaforma |
|  | Giovanni seleziona l'utente che desidera eliminare e preme sul pulsante "Elimina". |  |
|  |  | Il sistema mostra un messaggio pop-up di richiesta conferma per l'eliminazione dell'account. |
|  | Giovanni clicca sul pulsante "Conferma". |  |
|  |  | Il sistema rimuove l'account dal database, aggiorna la lista degli utenti a schermo e mostra l'esito positivo dell'operazione. |

| **NOME SCENARIO** | SC_AD_4 InserimentoCentro |  |
| :---: | :---: | --- |
| **ATTORI** | GIOVANNI: Amministratore |  |
| **FLUSSO DI EVENTI** | **ATTORE** | **SISTEMA** |
|  | Giovanni, amministratore della piattaforma, ha ricevuto dall'ASL di Salerno le informazioni sul nuovo centro diurno "Il Girasole" di Nocera Inferiore. Accede alla sezione "Centri e Attività" dell'area amministrativa. |  |
|  |  | Il sistema mostra l'elenco dei centri presenti nel catalogo e il pulsante "Aggiungi Centro". |
|  | Giovanni clicca su "Aggiungi Centro". |  |
|  |  | Il sistema mostra il modulo con i campi del centro (nome, indirizzo, comune, provincia, regione, contatti), i campi fonte e data di verifica e la sezione, facoltativa, per le attività. |
|  | Giovanni inserisce i dati del centro, indica come fonte "Sito ufficiale ASL Salerno" e come data di verifica la data odierna. Aggiunge l'attività "Laboratorio di memoria", di tipo sociale, con data di inizio 15/12/2026, e clicca su "Salva". |  |
|  |  | Il sistema verifica che tutti i campi obbligatori siano compilati. Salva il centro con la relativa attività e mostra un messaggio di conferma. Da questo momento il centro compare nei risultati di ricerca dei tutori. |

| **NOME SCENARIO** | SC_AD_5 ModificaCentro |  |
| :---: | :---: | --- |
| **ATTORI** | GIOVANNI: Amministratore |  |
| **FLUSSO DI EVENTI** | **ATTORE** | **SISTEMA** |
|  | Giovanni riceve una segnalazione: il centro diurno "Il Girasole" ha cambiato numero di telefono e ha avviato un corso di ginnastica. Accede alla sezione "Centri e Attività" e cerca il centro per nome. |  |
|  |  | Il sistema mostra il centro "Il Girasole" con i pulsanti "Modifica" ed "Elimina". |
|  | Giovanni clicca su "Modifica". |  |
|  |  | Il sistema mostra la scheda del centro con i campi modificabili e l'elenco delle attività associate. |
|  | Giovanni aggiorna il numero di telefono, aggiunge l'attività "Ginnastica", di tipo fisico, dal 01/12/2026 al 19/12/2026, aggiorna la data di verifica alla data odierna e clicca su "Salva Modifiche". |  |
|  |  | Il sistema verifica i dati, aggiorna la scheda del centro e mostra un messaggio di avvenuta modifica. I tutori vedono subito le informazioni aggiornate. |

| **NOME SCENARIO** | SC_AD_6 RimozioneCentro |  |
| :---: | :---: | --- |
| **ATTORI** | GIOVANNI: Amministratore |  |
| **FLUSSO DI EVENTI** | **ATTORE** | **SISTEMA** |
|  | Giovanni viene a sapere che il centro "Villa Serena" di Battipaglia ha chiuso definitivamente. Accede alla sezione "Centri e Attività" e cerca il centro**.** |  |
|  |  | Il sistema mostra il centro "Villa Serena" con i pulsanti "Modifica" ed "Elimina". |
|  | Giovanni clicca su "Elimina**"**. |  |
|  |  | Il sistema mostra un messaggio di richiesta conferma, indicando che verranno rimosse anche le attività del centro. |
|  | Giovanni clicca su "Conferma". |  |
|  |  | Il sistema rimuove il centro e le relative attività dal catalogo, aggiorna l'elenco e mostra l'esito positivo dell'operazione. |

| **NOME SCENARIO** | SC_AD_7 AssegnaAssociazioniUtente |  |
| :---: | :---: | --- |
| **ATTORI** | GIOVANNI: Amministratore |  |
| **FLUSSO DI EVENTI** | **ATTORE** | **SISTEMA** |
|  | Giovanni, amministratore della piattaforma, deve collegare il profilo del nuovo paziente "Mario Rossi" al suo medico di riferimento. Giovanni apre l'Elenco utenti, trova Mario Rossi e clicca "Gestisci Associazioni". |  |
|  |  | Il sistema mostra la pagina Gestione associazioni con i dati anagrafici di Mario Rossi, le sue associazioni attuali (nessun medico, nessun nutrizionista, nessun tutore) e il pulsante "Nuova Associazione". |
|  | Giovanni clicca "Nuova Associazione"; vede le associazioni attuali, sceglie la nuova associazione e il ruolo medico. |  |
|  |  | Il sistema mostra l'elenco dei medici registrati, con una barra di ricerca. |
|  | Giovanni cerca "Giuseppe Verdi", lo seleziona e clicca "Associa". |  |
|  |  | Il sistema verifica che le regole di cardinalità siano rispettate, registra l'associazione nel database e mostra il messaggio di conferma "Associazione completata con successo". |

#### 3.4.1.5 Scenari Nutrizionista

| **NOME SCENARIO** | SC_NT_1 InvioQuestionarioAlimentare |  |
| :---: | :---: | --- |
| **ATTORI** | SARA: Nutrizionista  |  |
| **FLUSSO DI EVENTI** | **ATTORE** | **SISTEMA** |
|  | Sara, nutrizionista che segue il paziente Mario, accede alla piattaforma e si reca nella sezione "I miei pazienti". Seleziona il profilo di Mario per redigere il piano alimentare e rileva la necessità di raccogliere le abitudini e le preferenze del paziente |  |
|  |  | Il sistema mostra la scheda del paziente e rende disponibile il pulsante "Invia Questionario Alimentare". |
|  | Sara seleziona "Invia Questionario Alimentare", sceglie come destinatario il tutore Salvatore, aggiunge una breve nota sulle preferenze del paziente e conferma l'invio. |  |
|  |  | Il sistema invia il questionario al tutore e aggiorna lo stato della **scheda del paziente** mostrando che il modulo è in attesa di compilazione. |

| **NOME SCENARIO** | SC_NT_2 CreaPianoAlimentarePaziente |  |
| :---: | :---: | --- |
| **ATTORI** | SARA: Nutrizionista |  |
| **FLUSSO DI EVENTI** | **ATTORE** | **SISTEMA** |
|  | Sara accede alla scheda di Mario, dove trova il questionario alimentare completato dal tutore Salvatore, consulta le preferenze indicate e preme il pulsante “Crea Piano Alimentare”. |  |
|  |  | Il sistema apre l'interfaccia per la compilazione del piano nutrizionale, suddivisa per pasti giornalieri e con visualizzazione settimanale. |
|  | Sara definisce i pasti della settimana, imposta le indicazioni di idratazione e clicca su "Pubblica Piano Alimentare" |  |
|  |  | Il sistema mostra a Sara un messaggio di conferma e rende la dieta consultabile nella sezione dedicata del paziente. |

| **NOME SCENARIO** | SC_NT_3 ModificaPianoAlimentare |  |
| :---: | :---: | --- |
| **ATTORI** | SARA: Nutrizionista |  |
| **FLUSSO DI EVENTI** | **ATTORE** | **SISTEMA** |
|  | Durante il controllo periodico, Sara accede alla scheda del paziente Mario per verificare l'adeguatezza del piano alimentare. Apre il piano alimentare e clicca su "Modifica Piano Alimentare". |  |
|  |  | Il sistema mostra il piano alimentare attivo in modalità di modifica. |
|  | Sara rimodula le porzioni della cena, aggiunge uno spuntino pomeridiano e preme su "Salva". |  |
|  |  | Il sistema conferma l'avvenuta modifica e rende disponibile l'aggiornamento del piano alimentare al tutore e al paziente. |

| **NOME SCENARIO** | SC_NT_4 VisualizzaPianoAlimentarePaziente |  |
| :---: | :---: | --- |
| **ATTORI** | SARA: Nutrizionista |  |
| **FLUSSO DI EVENTI** | **ATTORE** | **SISTEMA** |
|  | Sara vuole visualizzare il piano alimentare del suo paziente Mario, accede dunque alla sua area personale e apre la sezione relativa ai pazienti. |  |
|  |  | Il sistema mostra l'elenco dei pazienti. |
|  | Sara seleziona il paziente che ha intenzione di visualizzare. |  |
|  |  | Il sistema mostra a Sara la scheda paziente relativa al paziente da lei selezionato |
|  | Sara seleziona il piano alimentare del paziente |  |
|  |  | Il sistema mostra il piano alimentare assegnatogli da Saracon i tasti che ne permettono la modifica e l'eliminazione. |

### 3.4.2 Use Case

#### 3.4.2.1 Lato Paziente

| IDENTIFICATIVO  | UC_PZ_1 | DATA  | 24/11/2026  |
| --- | --- | --- | --- |
| NOME  | SvolgiSessioneStimolazione | VERSIONE  | 0.4 |
|  |  | AUTORE  | David De Pascale |
| DESCRIZIONE  | Lo UC descrive la funzionalità che consente al paziente di eseguire la sessione di esercizi di stimolazione cognitiva prescritta e personalizzata dal medico, garantendo feedback empatici, tempi di caricamento ridotti e salvataggio sicuro dei dati |  |  |
| ATTORE PRINCIPALE  | **Paziente:** ha interesse a svolgere gli esercizi di stimolazione cognitiva per preservare e monitorare la propria salute cognitiva  |  |  |
| ATTORI SECONDARI  | **NA** |  |  |
| ENTRY CONDITION  | Il paziente deve essersi autenticato sulla piattaforma e deve essere presente un piano di stimolazione cognitiva attivo prescrittogli dal medico. |  |  |
| EXIT CONDITION ON SUCCESS | La sessione viene completata correttamente, i risultati e i punteggi vengono salvati e cifrati nel database (RNF_FUN_4) e lo storico dell'andamento viene aggiornato |  |  |
| EXIT CONDITION ON FAILURE  | La sessione non risulta completata (interruzione di rete o uscita volontaria), ma restano salvate tutte le risposte già confermate dal paziente (RNF_AFF_1). |  |  |
| RILEVANZA/USER PRIORITY  | Alta  |  |  |
| FREQUENZA STIMATA  | 1/giorno per paziente |  |  |
| EXTENSION POINT | Risposta errata (passo 6): AiutoProgressivo |  |  |
| GENERALIZATION OF | NA |  |  |
| FLUSSO DI EVENTI PRINCIPALE / MAIN SCENARIO  |  |  |  |
| 1 | Paziente | Il Paziente accede alla propria area riservata. |  |
| 2 | Sistema | Il Sistema mostra la schermata personale con l'indicazione della sessione prescritta e il pulsante di inizio sessione. |  |
| 3 | Paziente | Il Paziente seleziona il pulsante di inizio sessione. |  |
| 4 | Sistema | Il Sistema genera e carica gli esercizi calibrati e presenta al paziente il primo esercizio. |  |
| 5 | Paziente | Il Paziente completa l'esercizio corrente e clicca sul tasto Conferma. |  |
| 6 | Sistema | Il Sistema valuta la risposta, salva l'avanzamento e fornisce un feedback empatico. Se la risposta è errata e il Paziente ha usato meno di 2 aiuti, il flusso prosegue con l'extend AiutoProgressivo (RF_PZ_6) e riprende dal passo 5. Se la risposta è corretta, oppure gli aiuti sono esauriti, e restano esercizi, presenta l'esercizio successivo e il flusso riprende dal passo 5; altrimenti prosegue dal passo 7. |  |
| 7 | Paziente | Terminati tutti gli esercizi della sequenza, il Paziente clicca sul pulsante concludi sessione. |  |
| 8 | Sistema | Il Sistema salva e cifra i risultati nel database, aggiorna lo storico dell'andamento e mostra a schermo un messaggio di conferma. |  |
| SCENARIO / FLUSSO DI EVENTI ALTERNATIVO: Interruzione volontaria della sessione |  |  |  |
| 5.a1 | Paziente | Durante un esercizio il Paziente seleziona il pulsante Esci. |  |
| 5.a2 | Sistema | Il Sistema mostra una finestra di dialogo con due pulsanti: "Conferma uscita" e "Annulla". |  |
| 5.a3 | Paziente | Il Paziente clicca Conferma uscita. Se invece clicca Annulla, il flusso riprende dal passo 5. |  |
| 5.a4 | Sistema | Il Sistema salva le risposte già confermate e reindirizza alla schermata principale. La sessione non risulta completata e non è prevista la ripresa dal punto di interruzione. Il flusso termina. |  |
| SCENARIO / FLUSSO DI EVENTI DI ERRORE: Interruzione di connessione di rete (passi 3-8) |  |  |  |
| E1.1 | Sistema | Se la connessione si interrompe tra i passi 3 e 8, il Sistema mantiene salvate le risposte già confermate e segnala l'interruzione al Paziente. |  |
| E1.2 | Sistema | Al ripristino della connessione il Sistema informa il Paziente. Il flusso riprende dal passo 3 se la sessione non era ancora pronta, dal primo esercizio non confermato (passo 5) se era in corso, dal passo 7 se erano già stati confermati tutti gli esercizi. |  |
| NOTE: L'interfaccia deve ridurre al minimo gli elementi secondari per evitare distrazioni. Il Medico è interessato ai risultati delle sessioni, che consulta in un secondo momento (RF_MD_2). |  |  |  |
| MOCK-UP  | UI_PZ_1  |  |  |
| SPECIAL REQUIREMENT  | - Prestazioni: Tempo di generazione e caricamento esercizi<15s nel 90% dei casi (RNF_PRE_1).- Usabilità e Accessibilità: Avvio della sessione prescritta entro 2 tocchi (RNF_USA_2), menu con al massimo 3 livelli di annidamento (RNF_USA_4), feedback empatico e non punitivo (RNF_USA_1) con aiuto progressivo in caso di errore (RF_PZ_6), testi ad alta leggibilità (RNF_USA_3) e ingrandimento immediato dei caratteri (RF_PZ_7)- Affidabilità e Sicurezza: Persistenza progressiva delle risposte in caso di disconnessione (RNF_AFF_1), cifratura dei dati sanitari salvati (RNF_FUN_4)- Qualità Contenuti: Presenza di un'unica risposta esatta per quesito (RNF_FUN_2) |  |  |

| IDENTIFICATIVO  | UC_PZ_2 | DATA  | 21/11/2026  |
| --- | --- | --- | --- |
| NOME  | CompilaQuestionarioPianoAlimentare | VERSIONE  | 0.2 |
|  |  | AUTORE  | Angelo Rainone |
| DESCRIZIONE  | Lo UC descrive la funzionalità che consente al paziente di compilare il questionario necessario alla creazione di un piano alimentare da parte del nutrizionista, garantendo il salvataggio sicuro dei dati |  |  |
| ATTORE PRINCIPALE  | **Paziente:** ha interesse a compilare il questionario in modo che gli possa essere assegnato un piano alimentare personalizzato  |  |  |
| ATTORI SECONDARI  | **Nutrizionista:** consulta i dati inseriti dal paziente nel questionario per stilare un piano alimentare personalizzato.  |  |  |
| ENTRY CONDITION  | Il paziente deve essersi autenticato sulla piattaforma e deve essere presente un questionario inviato dal nutrizionista e non ancora compilato. |  |  |
| EXIT CONDITION ON SUCCESS | Questionario completato e validato, con risposte salvate e rese consultabili al nutrizionista; i dati inseriti vengono salvati e cifrati nel database (RNF_FUN_4) |  |  |
| EXIT CONDITION ON FAILURE  | Il questionario non risulta completato, ma resta salvata l'ultima bozza dei campi inseriti (RNF_AFF_2). |  |  |
| RILEVANZA/USER PRIORITY  | Media |  |  |
| FREQUENZA STIMATA  | 1 compilazione per ogni questionario inviato dal nutrizionista (RF_NT_3) |  |  |
| EXTENSION POINT | NA |  |  |
| GENERALIZATION OF | NA |  |  |
| FLUSSO DI EVENTI PRINCIPALE / MAIN SCENARIO  |  |  |  |
| 1  | Paziente  | Il Paziente accede alla propria area riservata  |  |
| 2  | Sistema   | Il Sistema mostra la schermata personale contenente il pulsante per avviare la compilazione del questionario |  |
| 3  | Paziente | Il Paziente seleziona il pulsante per avviare la compilazione |  |
| 4  | Sistema  | Il Sistema mostra al paziente il questionario da compilare |  |
| 5  | Paziente  | Il Paziente completa la compilazione e clicca sul tasto di conferma |  |
| 6  | Sistema  | Il Sistema salva e valida i dati inseriti, che vengono cifrati nel database (RNF_FUN_4) e mostra un messaggio di conferma |  |
| SCENARIO / FLUSSO DI EVENTI ALTERNATIVO: Interruzione volontaria della compilazione o nessun questionario ancora inviato dal nutrizionista. |  |  |  |
| 4.a1 | Sistema | Il paziente interrompe volontariamente la compilazione del questionario alimentare premendo il tasto per chiudere la schermata. |  |
| 4.a2 | Sistema | Il sistema mostra al paziente la schermata per confermare l'uscita. |  |
| 4.a3 | Paziente | Il paziente conferma l'uscita. Se l'uscita viene annullata si ritorna al passo 4. |  |
| 4.a4 | Sistema | Il Sistema salva lo stato fino all'ultimo campo inserito (RNF_AFF_2) e reindirizza alla schermata personale, a questo punto il flusso termina |  |
| SCENARIO / FLUSSO DI EVENTI DI ERRORE: Interruzione di connessione di rete |  |  |  |
| E1.1 | Sistema  | Durante la compilazione del questionario, tra i passi 4 e 6, si verifica un'interruzione della connessione. Il Sistema non dichiara l'invio riuscito, salva lo stato di avanzamento per evitare la perdita dei campi già inseriti (RNF_AFF_2) |  |
| E1.2 | Sistema  | Il Sistema informa l'utente del ripristino della connessione, consentendogli di completare o inviare il questionario, recuperando l'ultima bozza salvata e ripartendo dal passo 4 |  |
| SCENARIO/FLUSSO DI EVENTI DI ERRORE: Mancata compilazione campi obbligatori |  |  |  |
| 6.e1 | Sistema | Se al passo 6 il sistema rileva che uno o più campi obbligatori sono vuoti o non validi, interrompe il salvataggio definitivo |  |
| 6.e2 | Sistema | Evidenzia in rosso i campi mancanti e mostra un messaggio di errore a schermo |  |
| 6.e3 | Paziente | Inserisce le informazioni mancanti nei campi segnalati e clicca nuovamente sul tasto di conferma. Il flusso riprende dal passo 6 |  |
| NOTE: L'interfaccia deve ridurre al minimo gli elementi secondari per evitare distrazioni |  |  |  |
| MOCK-UP  | NA |  |  |
| SPECIAL REQUIREMENT  | - Usabilità e Accessibilità: Navigazione semplice entro 2 tocchi, testi ad alta leggibilità e ridimensionamento immediato dei caratteri (RF_PZ_7)- Affidabilità e Sicurezza: Cifratura dei dati sanitari salvati (RNF_FUN_4), accesso ristretto al ruolo Paziente (RNF_FUN_3) |  |  |

#### 3.4.2.2 Lato Medico

| IDENTIFICATIVO | UC_MD_1 | DATA | 23/11/2026 |
| :---: | --- | :---: | :---: |
| NOME | RevisionePianoStimolazione | VERSIONE | 0.4 |
|  |  | AUTORE | Gaetano Frati |
| DESCRIZIONE | Il caso d’uso descrive la revisione, da parte del medico, dei parametri del piano di stimolazione cognitiva da lui assegnato a un paziente, sulla base dell’andamento delle sessioni svolte. |  |  |
| ATTORE PRINCIPALE | Medico: ha interesse ad adattare il piano alle reali condizioni del paziente per mantenerne efficacia e sostenibilità nel tempo. |  |  |
| ATTORI SECONDARI | NA |  |  |
| ENTRY CONDITION | 1. Il Medico è autenticato nel sistema (account creato dall’amministratore).2. Al Medico è stato assegnato un paziente da parte dell’amministratore.3. Al paziente è stato assegnato dal Medico un piano di stimolazione, nello stato "Attivo" o "Sospeso" |  |  |
| EXIT CONDITION ON SUCCESS | Il Sistema ha salvato il piano con i parametri aggiornati e la data di ultima revisione; il paziente svolgerà le sessioni successive con il piano aggiornato |  |  |
| EXIT CONDITION ON FAILURE | Il piano resta invariato e il paziente continua con i parametri precedenti. Se il piano era Sospeso e il Medico non lo riattiva, il piano resta Sospeso. |  |  |
| RILEVANZA/USER PRIORITY | Alta |  |  |
| FREQUENZA STIMATA | 1-2 volte/mese per paziente |  |  |
| EXTENSION POINT | Piano sospeso (passo 4): RiattivazionePianoStimolazione, RF_MD_6. |  |  |
| GENERALIZATION OF | NA |  |  |
| FLUSSO DI EVENTI PRINCIPALE / MAIN SCENARIO |  |  |  |
| 1 | Medico | Il Medico apre nella propria area personale la sezione "I miei pazienti". |  |
| 2 | Sistema  | Il Sistema mostra la lista dei pazienti associati (include VisualizzaElencoPazientiAssociati, RF_MD_3). |  |
| 3 | Medico | Il Medico cerca il paziente, ad esempio tramite nome o codice fiscale, e seleziona il paziente. |  |
| 4 | Sistema | Il Sistema mostra i dettagli anagrafici del paziente e il piano di stimolazione a lui associato. |  |
| 5 | Medico | Il Medico preme sul pulsante "Visualizza            andamento paziente".  |  |
| 6 | Sistema | Il Sistema mostra l’andamento del paziente: punteggi delle sessioni, numero di sessioni svolte, frequenza delle sessioni e livello di difficoltà degli esercizi (include "VisualizzaAndamentoPaziente" RF_MD_2). Se non ci sono sessioni vale il 6.a1. |  |
| 7 | Medico | Il Medico decide di modificare i parametri del piano di stimolazione e preme su "Modifica piano di stimolazione". |  |
| 8 | Sistema | Il Sistema mostra il piano di stimolazione con il numero di esercizi e il livello di difficoltà. |  |
| 9 | Medico | Il Medico modifica i parametri del piano di stimolazione, ad esempio aumenta la difficoltà degli esercizi o aumenta il loro numero, e preme sul pulsante "Salva". |  |
| 10 | Sistema | Il Sistema valida i parametri, salva il piano con i nuovi parametri e la data di ultima revisione e mostra l'esito positivo dell'operazione; da ora in poi il paziente svolgerà le sessioni successive con il nuovo piano. |  |
| SCENARIO / FLUSSO DI EVENTI ALTERNATIVO: Nessun paziente trovato, Piano sospeso, Nessuna sessione svolta, Annullamento della modifica. |  |  |  |
| 3.a1 | Sistema | La ricerca non produce risultati: il Sistema mostra "Nessun paziente trovato" e il flusso riprende dal passo 3. |  |
| 4.a1 | Sistema | Il piano è Sospeso; il Sistema lo segnala e mostra il pulsante "Riattiva Piano", mentre "Modifica piano di stimolazione" non è disponibile anche nella schermata dell'andamento. |  |
| 4.a2 | Medico | Preme "Riattiva Piano" (RiattivazionePianoStimolazione, RF_MD_6); a riattivazione avvenuta il flusso riprende dal passo 4. |  |
| 4.a3 | Medico | Non riattiva il piano; può consultare l'andamento (passi 5–6), poi il caso d'uso termina |  |
| 6.a1 | Sistema | Il paziente non ha sessioni svolte: il Sistema mostra un andamento vuoto e il flusso prosegue dal passo 7. |  |
| 9.a1 | Medico | Il medico decide di annullare le modifiche del piano di stimolazione e preme sul pulsante "Esci senza salvare". |  |
| 9.a2 | Sistema | Il sistema scarta le modifiche e il flusso riprende dal passo 4. |  |
| SCENARIO / FLUSSO DI EVENTI DI ERRORE: Parametri non validi, Errore di connessione durante il salvataggio |  |  |  |
| 10.e1 | Sistema | Il Sistema rileva campi vuoti o non validi, non salva il piano, evidenzia i campi errati e mostra un messaggio. |  |
| 10.e2 | Medico | Corregge i campi e preme di nuovo "Salva"; il flusso riprende dal passo 10. |  |
| 10.e3 | Sistema | Il Sistema non riesce a salvare, non salva il piano, mostra un messaggio di errore e mantiene i valori nel modulo; il piano precedente resta in vigore. |  |
| 10.e4 | Medico | Il Medico preme di nuovo "Salva" e il flusso riprende dal passo 10, oppure preme "Esci senza salvare" e si applica 9.a2. |  |
| NOTE: La modifica del piano è consentita solo dalla schermata dell’andamento, perché le decisioni cliniche si basano sui risultati delle sessioni. |  |  |  |
| MOCK-UP | UI_MD_1 |  |  |
| SPECIAL REQUIREMENT | Funzionalità: accesso ristretto al medico associato al paziente (RNF_FUN_3) |  |  |

| IDENTIFICATIVO | UC_MD_2 | DATA | 24/11/2026 |
| :---: | :---: | :---: | :---: |
| NOME | CreazionePianoStimolazione | VERSIONE | 0.3 |
|  |  | AUTORE | Luigi Alessio Pascarella |
| DESCRIZIONE | Il caso d'uso descrive la creazione, da parte del medico, del piano di stimolazione cognitiva di un paziente a lui associato, definendo il livello di difficoltà iniziale e il numero di esercizi per sessione con cui il Sistema genererà le sessioni di esercizi (RF_MD_1). |  |  |
| ATTORE PRINCIPALE | Medico: ha interesse ad avviare il percorso di stimolazione cognitiva del paziente con parametri adatti al suo stato, valutato anche tramite il questionario informativo. |  |  |
| ATTORI SECONDARI | NA |  |  |
| ENTRY CONDITION | 1. Il Medico è autenticato sulla piattaforma.2. Il paziente è associato al Medico dall'amministratore.3. Il paziente non ha un piano di stimolazione (né "Attivo" né "Sospeso"). |  |  |
| EXIT CONDITION ON SUCCESS | Il piano di stimolazione è salvato nel database nello stato "Attivo", con i parametri inseriti e la data di creazione, ed è associato al paziente, che può svolgere la sessione prescritta (RF_PZ_1). |  |  |
| EXIT CONDITION ON FAILURE | Nessun piano viene creato e il paziente resta senza piano di stimolazione. |  |  |
| RILEVANZA/USER PRIORITY | Alta |  |  |
| FREQUENZA STIMATA | 1 per paziente, all'inizio del percorso o dopo l'eliminazione del piano precedente |  |  |
| EXTENSION POINT | Consultazione questionario informativo (passo 4): VisualizzaRisposteQuestionarioInformativo, RF_MD_8 |  |  |
| GENERALIZATION OF | NA |  |  |
| FLUSSO DI EVENTI PRINCIPALE / MAIN SCENARIO |  |  |  |
| 1 | Medico | Il Medico apre nella propria area personale la sezione "I miei pazienti". |  |
| 2 | Sistema | Il Sistema mostra l'elenco dei pazienti associati al Medico con nome, cognome, codice fiscale, età, relativo piano di stimolazione ed eventuali tutori associati (include VisualizzaElencoPazientiAssociati, RF_MD_3). |  |
| 3 | Medico | Il Medico cerca il paziente per nome o codice fiscale e lo seleziona. |  |
| 4 | Sistema | Il Sistema mostra la scheda del paziente con i dati anagrafici e le azioni disponibili, tra cui il pulsante "Aggiungi piano stimolazione" e, se presente un questionario compilato, l'opzione per consultarlo (extension point VisualizzaRisposteQuestionarioInformativo, RF_MD_8). |  |
| 5 | Medico | Il Medico preme "Aggiungi piano stimolazione". |  |
| 6 | Sistema | Il Sistema mostra il modulo del piano con i campi "Livello di difficoltà iniziale" (intero da 1 a 5) e "Numero di esercizi per sessione" (intero da 5 a 20). |  |
| 7 | Medico | Il Medico inserisce i parametri e preme "Conferma". |  |
| 8 | Sistema | Il Sistema verifica che i parametri siano compilati e compresi nei valori ammessi. |  |
| 9 | Sistema | Il Sistema salva il piano nello stato "Attivo" con la data di creazione, lo associa al paziente e mostra un messaggio di operazione riuscita. Al successivo accesso il paziente trova la sessione prescritta nella propria area. |  |
| SCENARIO / FLUSSO DI EVENTI ALTERNATIVO: Nessun paziente trovato |  |  |  |
| 3.a1 | Sistema | La ricerca non produce risultati: il Sistema mostra il messaggio "Nessun paziente trovato". Il flusso riprende dal passo 3. |  |
| SCENARIO / FLUSSO DI EVENTI ALTERNATIVO: Annullamento della creazione |  |  |  |
| 7.a1 | Medico | Invece di confermare, il Medico preme "Annulla". |  |
| 7.a2 | Sistema | Il Sistema scarta i dati inseriti senza creare il piano. Il flusso riprende dal passo 4. |  |
| SCENARIO / FLUSSO DI EVENTI DI ERRORE: Parametri mancanti o non validi |  |  |  |
| 8.e1 | Sistema | Il Sistema rileva un parametro vuoto, non intero o fuori dai valori ammessi, non salva il piano, evidenzia in rosso il campo e mostra un messaggio (es. "Il livello di difficoltà deve essere compreso tra 1 e 5"). |  |
| 8.e2 | Medico | Il Medico corregge il campo e preme di nuovo "Conferma". Il flusso riprende dal passo 8. |  |
| SCENARIO / FLUSSO DI EVENTI DI ERRORE: Errore di connessione durante il salvataggio |  |  |  |
| 9.e1 | Sistema | Il Sistema non riesce a salvare, non crea il piano, mostra un messaggio di errore e mantiene nel modulo i valori inseriti. |  |
| 9.e2 | Medico | Il Medico preme di nuovo "Conferma" e il flusso riprende dal passo 8, oppure preme "Annulla" e si applica il flusso alternativo 7.a2 (Annullamento della creazione). |  |
| NOTE: Un paziente ha al massimo un piano di stimolazione (Class Diagram: Paziente 0..1 PianoStimolazione): il pulsante "Aggiungi piano stimolazione" è mostrato solo se il paziente non ha un piano.Prima di creare il piano il Medico può consultare le risposte definitive al questionario informativo (VisualizzaRisposteQuestionarioInformativo, RF_MD_8), ma non è obbligatorio: il piano può essere creato anche senza. |  |  |  |
| MOCK-UP | UI_MD_2 |  |  |
| SPECIAL REQUIREMENT | Funzionalità: accesso consentito solo al Medico associato al paziente (RNF_FUN_3); cifratura dei dati sanitari salvati (RNF_FUN_4). |  |  |

#### 3.4.2.3 Lato Tutore

| IDENTIFICATIVO | UC_TT_1 | DATA | 28/10/2026 |
| :---: | :---: | :---: | :---: |
| NOME | CompilaQuestionarioInformativoPaziente | VERSIONE | 0.4 |
|  |  | AUTORE | Massimo Giudice |
| DESCRIZIONE | Il caso d'uso descrive la procedura tramite la quale il Tutore compila e invia il questionario informativo relativo a un paziente a lui associato, ricevuto dal Medico curante. Il sistema gestisce salvataggi in bozza, errori di rete e garantisce l'immodificabilità dopo l'invio. |  |  |
| ATTORE PRINCIPALE | **TUTORE**: Ha interesse a fornire al medico informazioni accurate sullo stato di salute, sulle abitudini e sulle capacità del paziente, per permettere una corretta calibrazione del piano di stimolazione. |  |  |
| ATTORI SECONDARI | **MEDICO**: Riceve il questionario informativo compilato. |  |  |
| ENTRY CONDITION | 1. Il Tutore ha effettuato il login ed è autenticato nel sistema.2. Il Tutore è associato al Paziente ed è destinatario di un questionario informativo inviato dal Medico ancora nello stato "Da completare". |  |  |
| EXIT CONDITION ON SUCCESS | Il questionario viene validato e salvato con stato "Completato", **divenendo immodificabile**. Le risposte definitive vengono cifrate (RNF_FUN_4), rese visibili al Medico curante |  |  |
| EXIT CONDITION ON FAILURE | Il questionario non viene inviato (rimane "Da completare"). Il sistema conserva l'ultima bozza salvata manualmente o automaticamente (RNF_AFF_2). Il Medico non riceve i dati. |  |  |
| RILEVANZA/USER PRIORITY | Media |  |  |
| FREQUENZA STIMATA | 1/Semestre (o a ogni nuovo questionario inviato dal medico) |  |  |
| EXTENSION POINT | NA |  |  |
| FLUSSO DI EVENTI PRINCIPALE / MAIN SCENARIO |  |  |  |
| 1 | Tutore | Il tutore accede alla sezione "I miei pazienti" all'interno della propria area riservata e seleziona il questionario informativo da compilare per il paziente associato. |  |
| 2 | Sistema | Il sistema recupera dal database il modulo del questionario inviato dal Medico e lo mostra a schermo con le relative domande. |  |
| 3 | Tutore | Il tutore compila i campi di testo e le risposte a scelta multipla previsti dal questionario. |  |
| 4 | Sistema | Il sistema salva automaticamente in background le risposte parziali a intervalli regolari (bozza automatica). |  |
| 5 | Tutore | Il tutore clicca sul pulsante "Conferma e Invia". |  |
| 6 | Sistema | Il sistema valida i dati inseriti, verificando che tutti i campi contrassegnati come obbligatori siano stati compilati nel formato corretto e che il questionario sia ancora "Da completare". |  |
| 7 | Sistema | Il sistema salva e cifra le risposte nel database, aggiorna lo stato del questionario in "Completato", mostra a schermo un messaggio di successo. |  |
| SCENARIO / FLUSSO DI EVENTI ALTERNATIVO: Annullamento volontario e Salvataggio Bozza Manuale |  |  |  |
| 5.a1 | Tutore | Prima del passo 5, il tutore decide di interrompere la compilazione e clicca sul pulsante "Salva in Bozza". |  |
| 5.a2 | Sistema | Il sistema salva la bozza con le risposte parziali mantenendo lo stato "Da completare" e mostra un messaggio di salvataggio. Il flusso termina. |  |
| SCENARIO / FLUSSO DI EVENTI ALTERNATIVO: Conflitto di compilazione tra più tutori |  |  |  |
| 6.a1 | Sistema | Al passo 6, il sistema rileva che lo stato del questionario è già `"`Completato`"` (ad esempio in caso di doppio invio o sessione già chiusa su un'altra scheda). |  |
| 6.a2 | Sistema | Il sistema blocca l'invio e mostra il messaggio: "Il questionario è già stato completato*"*. Il flusso termina e il modulo diventa di sola lettura. |  |
| SCENARIO / FLUSSO DI EVENTI DI ERRORE: Invalidazione parametri |  |  |  |
| 6.e1 | Sistema | Al passo 6, se il sistema rileva che uno o più campi obbligatori sono vuoti o non validi, interrompe il salvataggio definitivo. |  |
| 6.e2 | Sistema | Il sistema evidenzia in rosso i campi mancanti e mostra un messaggio di errore a schermo. |  |
| 6.e3 | Tutore | Il tutore inserisce le informazioni mancanti nei campi segnalati e clicca nuovamente su "Conferma e Invia". Il flusso riprende dal passo 6. |  |
| SCENARIO / FLUSSO DI EVENTI DI ERRORE: Errore di connessione (RNF_AFF_2) |  |  |  |
| E1.1 | Sistema | Durante la compilazione (tra i passi 3 e 7), si verifica un'interruzione della rete. Il sistema avvisa il tutore della disconnessione e conserva l'ultimo stato salvato automaticamente (passo 4). |  |
| E1.2 | Sistema | Al ripristino della connessione, il sistema permette di riprendere la compilazione recuperando i dati dall'ultima bozza salvata. Il flusso riprende dal passo 3. |  |
| NOTE |  |  |  |
| MOCK-UP | UI_TT_1 |  |  |
| SPECIAL REQUIREMENT | Persistenza e ripristino delle bozze manuali e automatiche in caso di disconnessione (`RNF_AFF_2`), controllo degli accessi profilato per ruolo (`RNF_FUN_3`) e cifratura dei dati sanitari salvati con AES-256 (`RNF_FUN_4`). Per permettere una rettifica dei dati, il Medico dovrà generare e inviare un nuovo questionario. |  |  |

#### 3.4.2.4 Lato Amministratore

| IDENTIFICATIVO | UC_AD_1 | DATA | 09/11/2026 |
| :---: | :---: | :---: | :---: |
| NOME | AssegnaAssociazioniUtente | VERSIONE | 0.2 |
|  |  | AUTORE | Antonio Bassano |
| DESCRIZIONE | Il caso d'uso descrive il processo attraverso il quale l'amministratore di sistema associa a un paziente una figura di supporto (medico, nutrizionista o tutore) già registrato nella piattaforma. In particolare, il caso d'uso regola l'associazione di un utente principale (paziente) con una delle figure di supporto previste dal sistema, garantendo il rispetto dei vincoli di cardinalità stabiliti (massimo un medico, massimo un nutrizionista e zero o più tutori, consentendo anche l'assenza temporanea delle figure sanitarie). L'operazione si conclude con la memorizzazione persistente della associazione validata nel database.  |  |  |
| ATTORE PRINCIPALE | **AMMINISTRATORE:** L'amministratore ha interesse ad associare a un paziente le figure di supporto previste. |  |  |
| ATTORI SECONDARI | NA  |  |  |
| ENTRY CONDITION | - L'amministratore deve aver effettuato l'accesso alla piattaforma con credenziali valide ed essere autenticato nel sistema.- Gli utenti da associare devono essere già registrati nel sistema. |  |  |
| EXIT CONDITION ON SUCCESS | La nuova associazione tra gli utenti viene creata e memorizzata nel database rispettando i vincoli di cardinalità. |  |  |
| EXIT CONDITION ON FAILURE | Nessuna associazione viene creata e viene mostrato un messaggio di errore all'amministratore. |  |  |
| RILEVANZA/USER PRIORITY | Alta |  |  |
| FREQUENZA STIMATA | 2/Giorno |  |  |
| EXTENSION POINT | NA |  |  |
| GENERALIZATION OF | NA |  |  |
| FLUSSO DI EVENTI PRINCIPALE / MAIN SCENARIO |  |  |  |
| 1 | Amministratore | L'amministratore, dall'Elenco utenti, clicca su "Gestisci associazioni" accanto al paziente. |  |
| 2 | Sistema | Il sistema mostra la pagina Gestione associazioni con i dati anagrafici del paziente e le associazioni attuali. |  |
| 3 | Amministratore | L'amministratore seleziona l'opzione per creare una nuova associazione utente. |  |
| 4 | Sistema | Il sistema chiede il ruolo della figura da associare. |  |
| 5 | Amministratore | L'amministratore seleziona il ruolo desiderato per la nuova associazione (Medico, Nutrizionista o Tutore). |  |
| 6 | Sistema | Il sistema mostra l'elenco di tutti gli utenti, indicando quelli già associati, del ruolo selezionato. |  |
| 7 | Amministratore | L'amministratore seleziona l'utente nell'elenco. |  |
| 8 | Sistema | Il sistema evidenzia l'utente selezionato e abilita "Associa". |  |
| 9 | Amministratore | L'amministratore preme "Associa". |  |
| 10 | Sistema | Il sistema verifica la validità della richiesta (es. verifica che l'utente abbia il ruolo selezionato, che l'associazione non esista già e che la cardinalità sia rispettata). |  |
| 11 | Sistema | Il sistema registra l'associazione e mostra un messaggio di conferma all'amministratore. |  |
| SCENARIO / FLUSSO DI EVENTI ALTERNATIVO: Nessun utente per quel ruolo |  |  |  |
| 6.a1 | Sistema | Se la selezione del ruolo degli utenti non produce alcun risultato (es. perché non c'è nessun utente appartenente a quel ruolo), il sistema mostra un messaggio informativo (es. *"*Nessun utente trovato*"*). Il flusso torna al punto 5 per consentire all'amministratore di effettuare una nuova ricerca con filtro del ruolo differente. |  |
| SCENARIO / FLUSSO DI EVENTI DI ERRORE: Violazione vincoli di cardinalità |  |  |  |
| 10.e1 | Sistema | Se il sistema rileva che il limite di cardinalità è stato superato (es. tentativo di associare un secondo medico quando è consentito un solo medico per paziente) o che si sta tentando di creare una associazione duplicata, blocca l'operazione. |  |
| 10.e2 | Sistema | Il sistema mostra un messaggio di errore descrittivo all'amministratore, il flusso ricomincia dal punto 6. |  |
| NOTE |  |  |  |
| MOCK-UP | UI_AD_1 |  |  |
| SPECIAL REQUIREMENT | L'amministratore durante il procedimento può visualizzare solo i dati anagrafici, senza contenuti sanitari (RNF_FUN_3). |  |  |

#### 3.4.2.5 Lato Nutrizionista

| IDENTIFICATIVO | UC_NT_1 | DATA | 17/11/2026 |
| :---: | :---: | :---: | :---: |
| NOME | CreaPianoAlimentarePaziente | VERSIONE | 0.2 |
|  |  | AUTORE | Antonello Laudato |
| DESCRIZIONE | Il caso d'uso descrive la procedura con cui il nutrizionista redige e pubblica un piano alimentare personalizzato per un paziente a lui associato, consultando le eventuali risposte al questionario alimentare. |  |  |
| ATTORE PRINCIPALE | NUTRIZIONISTA: Ha interesse a definire e pubblicare un piano alimentare equilibrato e calibrato sul singolo paziente per contrastare i fattori di rischio legati al decadimento cognitivo. |  |  |
| ATTORI SECONDARI | NA |  |  |
| ENTRY CONDITION | 1. Il nutrizionista è autenticato sulla piattaforma.2. Il paziente è registrato e formalmente associato al nutrizionista operante.3. Il paziente non ha un piano alimentare assegnato. |  |  |
| EXIT CONDITION ON SUCCESS | Il piano alimentare, con i relativi pasti e le raccomandazioni idriche e nutrizionali, è salvato nel database (`RNF_FUN_4`) ed è consultabile dal paziente (`RF_PZ_``3`) e dagli eventuali tutori associati (`RF_TT_1`). |  |  |
| EXIT CONDITION ON FAILURE | Nessun piano alimentare viene creato né salvato nel sistema. |  |  |
| RILEVANZA/USER PRIORITY | Alta |  |  |
| FREQUENZA STIMATA | 1 per paziente |  |  |
| EXTENSION POINT | Consultazione questionario alimentare (passo 4): VisualizzaRisposteQuestionarioAlimentare, RF_NT_2 |  |  |
| GENERALIZATION OF | NA |  |  |
| FLUSSO DI EVENTI PRINCIPALE / MAIN SCENARIO |  |  |  |
| 1 | Nutrizionista | Accede nella propria area personale alla sezione "I miei pazienti". |  |
| 2 | Sistema | Mostra l'elenco dei pazienti associati al nutrizionista con nome, cognome, codice fiscale, età ed eventuali tutori associati (include VisualizzaElencoPazientiAssociati, RF_NT_6). |  |
| 3 | Nutrizionista | Cerca il paziente per nome o codice fiscale e lo seleziona. |  |
| 4 | Sistema | Mostra la scheda del paziente con i dati anagrafici, le risposte definitive del questionario alimentare (include VisualizzaRisposteQuestionarioAlimentare, RF_NT_2) e il pulsante "Crea Piano Alimentare". |  |
| 5 | Nutrizionista | Clicca sul pulsante "Crea Piano Alimentare". |  |
| 6 | Sistema | Mostra la scheda del paziente con i dati anagrafici, il pulsante 'Crea Piano Alimentare' e, se presente un questionario completato, le risposte definitive del questionario alimentare (extension point VisualizzaRisposteQuestionarioAlimentare, RF_NT_2) |  |
| 7 | Nutrizionista | Inserisce gli alimenti e le porzioni per i pasti, compila le raccomandazioni idriche e nutrizionali e clicca sul pulsante "Pubblica Piano Alimentare" |  |
| 8 | Sistema | Verifica che tutti i campi obbligatori siano compilati e nel formato valido. |  |
| 9 | Sistema | Salva e cifra il nuovo piano alimentare e i relativi pasti nel database (`RNF_FUN_4`) con la data di creazione, rendendolo consultabile al paziente e agli eventuali tutori associati, e mostra un messaggio di conferma. |  |
| SCENARIO/FLUSSO DI EVENTI ALTERNATIVO: Nessun paziente trovato |  |  |  |
| 3.a1 | Sistema | La ricerca non produce risultati: il Sistema mostra il messaggio "Nessun paziente trovato". Il flusso riprende dal passo 3. |  |
| SCENARIO / FLUSSO DI EVENTI ALTERNATIVO: Questionario alimentare non disponibile |  |  |  |
| 4.a1 | Sistema | Al passo 4 il questionario alimentare risulta assente o ancora nello stato "DaCompletare". Il Sistema segnala l'assenza di risposte definitive ma rende comunque disponibile il pulsante "Crea Piano Alimentare" per procedere con la redazione manuale. Il flusso prosegue dal passo 5. |  |
| SCENARIO / FLUSSO DI EVENTI ALTERNATIVO: Annullamento della creazione |  |  |  |
| 7.a1 | Nutrizionista | Invece di pubblicare, il Nutrizionista preme "Annulla". |  |
| 7.a2 | Sistema | Il Sistema scarta i dati inseriti senza creare il piano alimentare. Il flusso riprende dal passo 4. |  |
| SCENARIO / FLUSSO DI EVENTI DI ERRORE: Errore Caricamento Questionario Alimentare |  |  |  |
| 4.e1 | Sistema | Nel caso in cui si verifichi un errore di rete nel recupero del questionario alimentare, il Sistema mostra un messaggio d'avviso che segnala l'indisponibilità temporanea delle risposte. |  |
| 4.e2 | Nutrizionista | Può scegliere se tentare nuovamente il caricamento (il flusso riprende dal passo 4) oppure procedere con la compilazione manuale del piano alimentare (il flusso prosegue dal passo 5). |  |
| SCENARIO / FLUSSO DI EVENTI DI ERRORE: Dati Incompleti o Non Conformi |  |  |  |
| 8.e1 | Sistema | Nel caso in cui uno o più campi obbligatori risultino non compilati o presentino valori non validi, il Sistema blocca il salvataggio, evidenzia in rosso i campi non conformi e mostra a video un messaggio d'errore indicando i dati mancanti. |  |
| 8.e2 | Nutrizionista | Corregge i campi segnalati e ripete l'invio cliccando nuovamente su "Pubblica Piano Alimentare". Il flusso riprende dal passo 8. |  |
| SCENARIO / FLUSSO DI EVENTI DI ERRORE: Errore di Connessione |  |  |  |
| 9.e1 | Sistema | Nel caso in cui si verifichi un errore di connessione o di persistenza durante il salvataggio del piano alimentare, il Sistema blocca la pubblicazione, mostra un messaggio di errore e mantiene i dati inseriti nel form. |  |
| 9.e2 | Nutrizionista | Nutrizionista: Verifica la connessione e clicca nuovamente su "Pubblica Piano Alimentare" (il flusso riprende dal passo 8), oppure clicca su "Annulla" (il flusso riprende dal passo 7.a2). |  |
| NOTE |  |  |  |
| MOCK-UP | UI_NT_1 |  |  |
| SPECIAL REQUIREMENT | Accesso consentito esclusivamente al nutrizionista associato al paziente (`RNF_FUN_3`); cifratura dei dati sanitari salvati con AES-256 (`RNF_FUN_4`). |  |  |

### 3.4.3 Use Case Diagram

#### 3.4.3.1 Use Case Diagram Paziente

![Use Case Diagram Paziente](images/fig_08.png)

![Use Case Diagram Paziente](images/fig_09.jpg)

#### 3.4.3.2 Use Case Diagram Medico

![Use Case Diagram Medico](images/fig_10.png)

![Use Case Diagram Medico](images/fig_11.jpg)

![Use Case Diagram Medico](images/fig_12.png)

#### 3.4.3.3 Use Case Diagram Tutore

![Use Case Diagram Tutore](images/fig_13.png)

![Use Case Diagram Tutore](images/fig_14.png)

![Use Case Diagram Tutore](images/fig_15.png)

#### 3.4.3.4 Use Case Diagram Amministratore

![Use Case Diagram Amministratore](images/fig_16.jpg)

![Use Case Diagram Amministratore](images/fig_17.jpg)

#### 3.4.3.5 Use Case Diagram Nutrizionista

![Use Case Diagram Nutrizionista](images/fig_18.jpg)

### 3.4.4 Modello ad oggetti

#### 3.4.4.1 Tabella oggetti

| **Nome** | **Tipo** | **Descrizione** |
| :---: | :---: | :---: |
| Utente | Entity | Contiene i dati relativi a un utente generico. |
| Paziente | Entity | Contiene i dati relativi a un paziente. |
| Medico | Entity | Contiene i dati relativi a un generico medico. |
| Amministratore | Entity | Contiene i dati relativi a un amministratore della piattaforma. |
| Nutrizionista | Entity | Contiene i dati relativi a un generico nutrizionista. |
| PianoStimolazione | Entity | Contiene i dati del piano di stimolazione cognitiva assegnato dal medico (stato, livello di difficoltà, numero di esercizi, date di creazione e di ultima revisione). |
| SessioneStimolazione | Entity | Contiene i dati di una sessione svolta dal paziente (data, stato, punteggio) usati dal medico per consultarne il monitoraggio. |
| PianoAlimentare | Entity |  Contiene i dati del piano alimentare del paziente (date, raccomandazioni idriche e nutrizionali). |
| QuestionarioInformativo | Entity | Contiene i dati del questionario informativo creato dal medico e le relative risposte (bozza o definitive). |
| QuestionarioAlimentare | Entity | Contiene i dati del questionario alimentare inviato dal nutrizionista e le relative risposte (bozza o definitive). |
| Esercizio | Entity | Contiene i dati di un esercizio di stimolazione cognitiva (tipo, difficoltà, quesito, opzioni di risposta e risposta corretta). |
| RispostaEsercizio | Entity | Contiene la risposta fornita dal paziente a un esercizio durante una sessione (risposta data, correttezza, livello di aiuto, conferma). |
| Pasto | Entity | Contiene i dati di un singolo pasto del piano alimentare (giorno, tipo, alimenti, porzioni). |
| Tutore | Entity | Contiene i dati relativi a un tutore, associato a zero o più pazienti dall'amministratore. |
| Centro | Entity | Contiene i dati di un centro specializzato del catalogo territoriale (nome, indirizzo, comune, provincia, regione, contatti, fonte e data di ultima verifica). |
| Attivita | Entity | Contiene i dati di un’attività fisica o sociale offerta da un centro (nome, tipo, descrizione e, per gli eventi, date di inizio e di conclusione) e indica se è conclusa. |
| Questionario | Entity | Classe astratta con i dati comuni ai questionari informativo e alimentare (domande, stato, risposte). |
| CreaPianoStimolazioneButton | Boundary | Pulsante "Aggiungi piano  stimolazione" che permette al medico di avviare la creazione del piano di stimolazione (RF_MD_1). |
| CreaPianoStimolazioneForm | Boundary | Form per inserire il livello di difficoltà iniziale e il numero di esercizi per sessione del piano di stimolazione (RF_MD_1). |
| PannelloControlloAdminPage | Boundary | Pagina principale dell'amministratore da cui accedere alla gestione di utenti e centri (RF_AD_7, RF_AD_9) |
| ElencoUtentiPage | Boundary | Pagina per visualizzare, cercare e selezionare gli utenti registrati, mostrando solo i dati anagrafici (RF_AD_7). |
| InserisciUtenteForm | Boundary | Form per registrare un nuovo utente indicandone ruolo e dati anagrafici (senza alcun campo password)(RF_AD_1). |
| ModificaUtenteForm | Boundary | Form per aggiornare i dati di un account utente esistente (RF_AD_2). |
| EliminaUtenteButton | Boundary | Pulsante che permette all'amministratore di eliminare un utente dal sistema (RF_AD_3). |
| GestioneAssociazioniPage | Boundary | Mostra i dati anagrafici e le associazioni attuali del paziente e permette di aggiungerne, sostituirne o rimuoverne (RF_AD_8, RF_AD_10, RF_AD_11). |
| AssociaButton | Boundary | Pulsante "Associa" che conferma la nuova associazione tra utenti (RF_AD_8). |
| ModificaAssociazioneForm | Boundary | Form per sostituire il professionista di riferimento o variare i tutori associati a un paziente (RF_AD_10). |
| RimuoviAssociazioneButton | Boundary | Pulsante che permette di rimuovere un'associazione esistente senza cancellare gli account (RF_AD_11). |
| EsportaCredenzialiButton | Boundary | Pulsante che permette l'apertura di una pagina stampabile contenente le credenziali (RF_AD_12). |
| CredenzialiStampabiliPage | Boundary | Pagina con e-mail e password temporanea e il pulsante "Stampa" (RF_AD_12). |
| CreaPianoAlimentareForm | Boundary | Form per compilare e pubblicare il piano alimentare (RF_NT_1). |
| CreaPianoAlimentareButton | Boundary | Pulsante che permette al nutrizionista di avviare la creazione di un piano alimentare (RF_NT_1). |
| ModificaPianoStimolazioneButton | Boundary | Pulsante che permette al medico di avviare la revisione del piano di stimolazione (RF_MD_4). |
| ModificaPianoStimolazioneForm | Boundary | Form per modificare i parametri del piano di stimolazione (RF_MD_4). |
| MessaggioConfermaDialog | Boundary | Finestra che comunica l'esito positivo di una operazione. |
| MessaggioErroreDialog | Boundary | Finestra che comunica l'esito negativo di una operazione. |
| ElencoPazientiPage | Boundary | Pagina "I miei pazienti" per visualizzare, cercare e selezionare i pazienti associati (RF_MD_3, RF_NT_6, RF_TT_9). |
| SchedaPazientePage | Boundary | Pagina con i dati del paziente e le azioni disponibili (piani, questionario, andamento). |
| AvviaSessioneButton | Boundary | Pulsante che permette al paziente di avviare la sessione di stimolazione cognitiva (RF_PZ_1). |
| SessioneEserciziForm | Boundary | Interfaccia che presenta al paziente gli esercizi da svolgere con aiuto progressivo in caso di errore (RF_PZ_1, RF_PZ_6). |
| QuestionarioInformativoForm | Boundary | Form per compilare, salvare in bozza e inviare il questionario informativo da parte del tutore o del paziente (RF_TT_8, RF_PZ_5). |
| QuestionarioAlimentareForm | Boundary | Form per compilare, salvare in bozza e inviare il questionario alimentare da parte del tutore o del paziente (RF_TT_5, RF_PZ_4). |
| RicercaCentriPage | Boundary | Pagina con i filtri per comune, provincia o regione e l'elenco dei centri trovati, senza gli eventi già conclusi (RF_TT_3, RF_TT_6, RF_TT_7). |
| SchedaCentroPage | Boundary | Pagina con la scheda del centro: contatti, attività offerte, fonte e data di ultima verifica (RF_TT_4). |
| ElencoCentriPage | Boundary | Pagina della sezione "Centri e Attività" per l'amministratore, con l'elenco dei centri del catalogo (RF_AD_9). |
| CentroForm | Boundary | Form per inserire o modificare un centro e le relative attività, con fonte e data di verifica obbligatorie (RF_AD_4, RF_AD_5). |
| RimuoviCentroButton | Boundary | Bottone per rimuovere un centro dalla piattaforma (RF_AD_6) |
| VisualizzaAndamentoPersonalePage | Boundary | Pagina dell’area personale in cui il paziente consulta lo storico delle sessioni, i punteggi e l’andamento nel tempo (RF_PZ_2). |
| PianoAlimentarePazientePage | Boundary | Pagina di consultazione del piano alimentare con viste giornaliera e settimanale per il paziente e per il tutore associato (RF_PZ_3, RF_TT_1). |
| IngrandimentoTestoButton | Boundary | Selettore che permette al paziente di scegliere tra i tre livelli di testo “normale”, “grande” e “molto grande” (RF_PZ_7). |
| VisualizzaAndamentoPazienteButton | Boundary | Pulsante “Visualizza andamento paziente” nella scheda del paziente (RF_MD_2). |
| AndamentoPazientePage | Boundary | Pagina con punteggi, numero e frequenza delle sessioni e livello di difficoltà degli esercizi del paziente (RF_MD_2). |
| SospendiPianoStimolazioneButton | Boundary | Pulsante “Sospendi” per sospendere il piano di stimolazione (RF_MD_5). |
| RiattivaPianoStimolazioneButton | Boundary | Pulsante “Riattiva Piano” per riattivare il piano sospeso (RF_MD_6). |
| EliminaPianoStimolazioneButton | Boundary | Pulsante per eliminare il piano di stimolazione (RF_MD_10). |
| CreaQuestionarioInformativoForm | Boundary | Form con cui il medico crea il questionario informativo da associare al paziente (RF_MD_7). |
| InviaQuestionarioInformativoButton | Boundary | Pulsante con cui il medico invia il questionario al tutore o, se non c’è, al paziente (RF_MD_9). |
|  RisposteQuestionarioInformativoPage | Boundary | Pagina in cui il medico consulta le risposte definitive al questionario informativo (RF_MD_8). |
| CreaQuestionarioAlimentareForm | Boundary | Form con cui il nutrizionista crea il questionario alimentare, sceglie il destinatario (tutore o paziente) e lo invia (RF_NT_3). |
| ModificaPianoAlimentareButton | Boundary | Pulsante che avvia la modifica del piano alimentare (RF_NT_4). |
| ModificaPianoAlimentareForm | Boundary |  Form per modificare il piano alimentare assegnato (RF_NT_4). |
| EliminaPianoAlimentareButton | Boundary | Pulsante per eliminare il piano alimentare del paziente (RF_NT_5). |
| VisualizzaPianoAlimentarePage | Boundary | Pagina in cui il nutrizionista consulta il piano alimentare del paziente associato con i pulsanti per la modifica e l'eliminazione (RF_NT_7). |
| AndamentoPazientePage | Buondary | Pagina con punteggi, numero e frequenza delle sessioni e livello di difficoltà degli esercizi del paziente, consultabile dal medico e dal tutore associato (RF_MD_2, RF_TT_2). |
| RisposteQuestionarioAlimentarePage | Boundary | Pagina in cui il nutrizionista consulta le risposte definitive al questionario alimentare (RF_NT_2). |
| LoginPage | Boundary | Pagina in cui l’utente inserisce le credenziali per accedere alla piattaforma (RF_ UE_1). |
| LogoutButton | Boundary | Pulsante per disconnettersi dalla piattaforma (RF_ UE_2). |
| CambiaPasswordButton | Boundary | Voce del menu utente che apre il form di cambio password (RF_UE_3). |
| CambiaPasswordForm | Boundary | Form per il cambio password volontario (password attuale, nuova password e conferma) e per l'impostazione obbligatoria della nuova password al primo accesso (RF_UE_3, RF_UE_4). |
| CredenzialiDialog | Boundary | Finestra che, al termine della registrazione, mostra all'amministratore l'e-mail e la password temporanea del nuovo utente con il pulsante "Esporta credenziali". Chiusa la finestra, la password non è più visibile (RF_AD_1, RF_AD_12). |
| CambiaPasswordControl | Control | Verifica la password attuale, valida la nuova e la salva (RF_UE_3, RF_UE_4). |
| IngrandimentoTestoControl | Control | Coordina il cambio del livello di dimensione del testo e lo applica subito all’interfaccia (RF_PZ_7). |
| VisualizzaElencoUtentiControl | Control | Recupera l'elenco degli utenti registrati con i soli dati anagrafici (RF_AD_7). |
| InserisciUtenteControl | Control | Coordina la validazione e la registrazione di un nuovo utente e genera la password temporanea salvandone l'hash (RF_AD_1). |
| ModificaUtenteControl | Control | Coordina la validazione e l'aggiornamento dei dati di un utente (RF_AD_2). |
| EliminaUtenteControl | Control | Coordina l'eliminazione di un utente dal sistema (RF_AD_3). |
| AssegnaAssociazioniUtenteControl | Control | "Coordina la creazione di un'associazione tra utenti, verificando che l'utente abbia il ruolo selezionato, che l'associazione non esista già e che i vincoli di cardinalità siano rispettati (RF_AD_8). |
| ModificaAssociazioniUtenteControl | Control | Coordina la sostituzione o l'aggiornamento di un'associazione esistente nel rispetto dei vincoli di cardinalità (RF_AD_10). |
| RimuoviAssociazioniUtenteControl | Control | Coordina la rimozione di un'associazione tra utenti mantenendo gli account (RF_AD_11). |
| AutenticazioneControl | Control | Coordina l'autenticazione e la disconnessione degli utenti all'interno della piattaforma e reindirizza a CambiaPasswordForm se la password è temporanea. (RF_UE_1, RF_UE_2, RF_UE_4). |
| CreaPianoAlimentareControl | Control | Coordina la creazione e la pubblicazione del piano alimentare (RF_NT_1). |
| RevisionePianoStimolazioneControl | Control | Coordina la revisione dei parametri del piano di stimolazione (RF_MD_4). |
| EsportaCredenzialiControl | Control | Coordina la generazione della pagina stampabile con l'e-mail e la password temporanea del nuovo utente al termine della registrazione, senza conservare copie in chiaro (RF_AD_12). |
| CreazionePianoStimolazioneControl | Control | Coordina la creazione del piano di stimolazione (RF_MD_1). |
| AiutoProgressivoControl | Control | Gestisce l'erogazione fino a 2 suggerimenti progressivi in caso di errore del paziente durante un esercizio e il passaggio all'esercizio successivo una volta esauriti gli aiuti (RF_PZ_6). |
| SospensionePianoStimolazioneControl | Control | Coordina la sospensione del piano di stimolazione (RF_MD_5). |
| RiattivazionePianoStimolazioneControl | Control | Coordina la riattivazione del piano di stimolazione (RF_MD_6). |
| EliminazionePianoStimolazioneControl | Control | Coordina l'eliminazione del piano di stimolazione (RF_MD_10). |
| VisualizzaAndamentoPazienteControl | Control | Recupera i punteggi, numero di sessioni e frequenza delle sessioni del paziente (RF_MD_2, RF_PZ_2, RF_TT_2 ). |
| VisualizzaElencoPazientiControl | Control | Recupera l'elenco dei pazienti associati all'utente (medico, nutrizionista o tutore), con gli eventuali tutori di ciascun paziente (RF_MD_3, RF_NT_6, RF_TT_9). |
| CreaQuestionarioInformativoControl | Control | Coordina la creazione del questionario informativo (RF_MD_7). |
| InviaQuestionarioInformativoControl | Control | Coordina l'invio del questionario informativo (RF_MD_9). |
| VisualizzaRisposteQuestionarioControl | Control | Recupera le risposte definitive dei pazienti o dei tutori al questionario informativo (RF_MD_8) e al questionario alimentare (RF_NT_2). |
| CreaQuestionarioAlimentareControl | Control | Coordina creazione e invio del questionario alimentare (RF_NT_3). |
| ModificaPianoAlimentareControl | Control | Coordina l'aggiornamento e la revisione del piano alimentare (RF_NT_4). |
| EliminaPianoAlimentareControl | Control | Coordina l'eliminazione del piano alimentare (RF_NT_5). |
| VisualizzaPianoAlimentareControl | Control | Recupera il piano alimentare del paziente (RF_NT_7, RF_PZ_3, RF_TT_1). |
| SvolgiSessioneControl | Control | Coordina l'esecuzione della sessione di esercizi di stimolazione cognitiva prescritta dal medico e il salvataggio dei relativi risultati (RF_PZ_1). |
| CompilaQuestionarioInformativoControl | Control | Coordina la compilazione, il salvataggio in bozza e l'invio definitivo del questionario informativo (RF_TT_8, RF_PZ_5). |
| CompilaQuestionarioPianoAlimentareControl | Control | Coordina la compilazione, il salvataggio in bozza e l'invio definitivo del questionario alimentare (RF_TT_5, RF_PZ_4). |
| RicercaCentriControl | Control | Recupera i centri e le attività dal catalogo filtrando per area geografica, escludendo gli eventi conclusi e ordinando per vicinanza (RF_TT_3, RF_TT_6, RF_TT_7). |
| VisualizzaDettaglioCentroControl | Control | Recupera la scheda del centro con le attività offerte, la fonte e la data di verifica (RF_TT_4). |
| VisualizzaElencoCentriControl | Control | Recupera l'elenco dei centri presenti nel catalogo (RF_AD_9). |
| InserimentoCentroControl | Control | Coordina l'inserimento di un nuovo centro e delle relative attività, verificando i campi obbligatori e i duplicati (RF_AD_4). |
| ModificaCentroControl | Control | Coordina la modifica di un centro e delle relative attività, aggiornandone la data di verifica (RF_AD_5). |
| RimozioneCentroControl | Control | Coordina la rimozione di un centro non più attivo dal catalogo (RF_AD_6). |

### 3.4.5 Class Diagram

![Class Diagram](images/fig_19.png)

![Class Diagram](images/fig_20.png)

![Class Diagram](images/fig_21.png)

![Class Diagram](images/fig_22.png)

![Class Diagram](images/fig_23.png)

![Class Diagram](images/fig_24.png)

### 3.4.6 Modello dinamico

#### 3.4.6.1 Statechart Diagram

##### 3.4.6.1.1 Ciclo di vita del piano di stimolazione

![Ciclo di vita del piano di stimolazione](images/fig_25.png)

##### 3.4.6.1.2 Ciclo di vita del questionario informativo

![Ciclo di vita del questionario informativo](images/fig_26.png)

##### 3.4.6.1.3 Ciclo di vita della sessione di stimolazione

![Ciclo di vita della sessione di stimolazione](images/fig_27.jpg)

#### 3.4.6.2 Sequence Diagram

##### 3.4.6.2.1 RevisionePianoStimolazione SD_UC_MD_1

**Il sequence diagram è stato diviso in 2 moduli per facilitarne la lettura**

Link visualizzazione: [clicca qui](https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=SD_medico_definitivo.xml&dark=auto#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1OKNssgEeB8s7qf4uSpWhg0bHZUkfbRC7%26export%3Ddownload)

![RevisionePianoStimolazione SD_UC_MD_1](images/fig_28.jpg)

![RevisionePianoStimolazione SD_UC_MD_1](images/fig_29.jpg)

##### 3.4.6.2.2 SvolgiSessioneStimolazione SD_UC_PZ_1

**Il sequence diagram è stato diviso in 3 moduli per facilitarne la lettura**

Link visualizzazione: [clicca qui](https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=SD_PAZIENTE_DEFINITIVO.xml&page-id=SD_UC_PZ_1_M2&dark=auto#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1LP24ihvfoieBYU5FDveDXb2mdX8qbKsX%26export%3Ddownload)

![SvolgiSessioneStimolazione SD_UC_PZ_1](images/fig_30.jpg)

![SvolgiSessioneStimolazione SD_UC_PZ_1](images/fig_31.jpg)

![SvolgiSessioneStimolazione SD_UC_PZ_1](images/fig_32.jpg)

##### 3.4.6.2.3 CreaPianoAlimentarePaziente SD_UC_NT_1

![CreaPianoAlimentarePaziente SD_UC_NT_1](images/fig_33.png)

##### 3.4.6.2.4 CompilaQuestionarioInformativoPaziente SD_UC_TT_1

![CompilaQuestionarioInformativoPaziente SD_UC_TT_1](images/fig_34.png)

### 3.4.7 Interfaccia Utente - Percorsi di Navigazione e Mock-ups

#### 3.4.7.1 NP_AD

![NP_AD](images/fig_35.png)

#### 3.4.7.2 NP_NT

![NP_NT](images/fig_36.png)

#### 3.4.7.3 NP_PZ

![NP_PZ](images/fig_37.png)

#### 3.4.7.4 NP_TT

![NP_TT](images/fig_38.png)

#### 3.4.7.5 NP_MD

![NP_MD](images/fig_39.png)

#### 3.4.7.6 UI_AD_1 AssegnaAssociazioniUtente

![UI_AD_1 AssegnaAssociazioniUtente](images/fig_40.png)

![UI_AD_1 AssegnaAssociazioniUtente](images/fig_41.png)

![UI_AD_1 AssegnaAssociazioniUtente](images/fig_42.png)

![UI_AD_1 AssegnaAssociazioniUtente](images/fig_43.png)

![UI_AD_1 AssegnaAssociazioniUtente](images/fig_44.png)

![UI_AD_1 AssegnaAssociazioniUtente](images/fig_45.png)

![UI_AD_1 AssegnaAssociazioniUtente](images/fig_46.png)

![UI_AD_1 AssegnaAssociazioniUtente](images/fig_47.png)

![UI_AD_1 AssegnaAssociazioniUtente](images/fig_48.png)

![UI_AD_1 AssegnaAssociazioniUtente](images/fig_49.png)

#### 3.4.7.7 UI_TT_1 Compila Questionario Medico

![UI_TT_1 Compila Questionario Medico](images/fig_50.png)

![UI_TT_1 Compila Questionario Medico](images/fig_51.png)

![UI_TT_1 Compila Questionario Medico](images/fig_52.png)

![UI_TT_1 Compila Questionario Medico](images/fig_53.png)

#### 3.4.7.8 UI_TT_2 CercaCentriEAttivita

![UI_TT_2 CercaCentriEAttivita](images/fig_54.png)

#### 3.4.7.9 UI_MD_2 CreazionePianoStimolazione

![UI_MD_2 CreazionePianoStimolazione](images/fig_55.png)

![UI_MD_2 CreazionePianoStimolazione](images/fig_56.png)

![UI_MD_2 CreazionePianoStimolazione](images/fig_57.png)

![UI_MD_2 CreazionePianoStimolazione](images/fig_58.png)

#### 3.4.7.10 UI_PZ_1 SvolgiSessioneStimolazione

![UI_PZ_1 SvolgiSessioneStimolazione](images/fig_59.png)

![UI_PZ_1 SvolgiSessioneStimolazione](images/fig_60.png)

![UI_PZ_1 SvolgiSessioneStimolazione](images/fig_61.png)

![UI_PZ_1 SvolgiSessioneStimolazione](images/fig_62.png)

![UI_PZ_1 SvolgiSessioneStimolazione](images/fig_63.png)

#### 3.4.7.11 UI_NT_1 CreaPianoAlimentarePaziente

![UI_NT_1 CreaPianoAlimentarePaziente](images/fig_64.png)

![UI_NT_1 CreaPianoAlimentarePaziente](images/fig_65.png)

![UI_NT_1 CreaPianoAlimentarePaziente](images/fig_66.png)

![UI_NT_1 CreaPianoAlimentarePaziente](images/fig_67.png)

#### 3.4.7.12 UI_MD_1 VisualizzaAndamentoPaziente

![UI_MD_1 VisualizzaAndamentoPaziente](images/fig_68.png)

![UI_MD_1 VisualizzaAndamentoPaziente](images/fig_69.jpg)

![UI_MD_1 VisualizzaAndamentoPaziente](images/fig_70.jpg)

![UI_MD_1 VisualizzaAndamentoPaziente](images/fig_71.jpg)

# 4. Glossario

| **Termine** | **Definizione** |
| --- | --- |
| **AES-256** | Algoritmo di crittografia simmetrica adottato per cifrare tutti i dati personali sanitari dei pazienti memorizzati nel database, garantendo che nessun campo sanitario sia leggibile in chiaro (RNF_FUN_4). |
| **Aiuto progressivo** | Funzionalità che, in caso di errore durante un esercizio di stimolazione cognitiva, fornisce al paziente fino a 2 suggerimenti graduali; esauriti gli aiuti, la sessione prosegue con l'esercizio successivo (RF_PZ_6). |
| **Amministratore (AD)** | Ruolo utente responsabile della gestione operativa della piattaforma: registra, modifica ed elimina gli account utente; gestisce le associazioni tra pazienti e figure di supporto nel rispetto dei vincoli di cardinalità (accedendo ai soli dati anagrafici); inserisce, modifica e rimuove i centri e le attività del catalogo territoriale. |
| **Andamento paziente (Storico e andamento)** | Insieme dei dati storici relativi alle sessioni di stimolazione cognitiva svolte dal paziente (punteggi ottenuti, numero di sessioni, frequenza, livello di difficoltà ed esiti delle risposte), consultabile da paziente, medico e tutore associato. |
| **Area personale (Area riservata)** | Sezione della piattaforma accessibile previa autenticazione, profilata in base al ruolo dell'utente in modo da esporre esclusivamente le funzionalità e i dati di propria competenza. |
| **ASL (Azienda Sanitaria Locale)** | Ente pubblico del Servizio Sanitario destinatario della piattaforma MindCompanion e fonte istituzionale di riferimento per i dati relativi a centri e attività territoriali. |
| **Associazione tra utenti** | Legame configurato dall'amministratore tra un paziente già registrato e le relative figure di supporto secondo i seguenti vincoli di cardinalità: al massimo un medico (0...1), al massimo un nutrizionista (0...1) e zero o più tutori (0...*) per ciascun paziente; un tutore può assistere zero o più pazienti (0...*). Non sono consentite associazioni duplicate né associazioni tra utenti non pazienti. |
| **Attività** | Iniziativa di natura fisica o sociale (Fisica, Sociale) offerta da un centro censito nel catalogo territoriale, descritta da nome, tipologia, descrizione ed eventuali date di inizio e conclusione. Le attività già concluse rispetto alla data corrente vengono automaticamente escluse dalle viste di ricerca e dettaglio del tutore (RF_TT_6). |
| **Attore** | Ruolo esterno (umano) che interagisce con la piattaforma negli scenari, nei casi d'uso e nei diagrammi UML: Paziente, Tutore, Medico, Nutrizionista e Amministratore. |
| **Autenticazione** | Procedura di accesso (login) e disconnessione (logout) alla piattaforma mediante le credenziali personali associate all'account creato dall'amministratore. |
| **Boundary** | Categoria di oggetti del modello ad oggetti e dei Sequence Diagram che rappresenta i componenti di interfaccia tra gli attori e il sistema (pagine, form, pulsanti e finestre di dialogo). |
| **Bozza (Salvataggio in bozza)** | Stato intermedio di compilazione di un questionario informativo o alimentare (DaCompletare / Bozza salvata) che conserva manualmente o automaticamente in background le risposte parziali, proteggendole da disconnessioni di rete e mantenendole visibili esclusivamente a chi compila fino all'invio definitivo. |
| **BSON (Binary JSON)** | Formato binario di rappresentazione dei documenti utilizzato dal DBMS NoSQL MongoDB per l'archiviazione persistente dei dati della piattaforma (RNF_IMP_1). |
| **Cambio password al primo accesso** | Procedura obbligatoria con cui l'utente, al primo login con la password temporanea, imposta una nuova password personale prima di poter usare la piattaforma. È distinta dal cambio password volontario dall'area personale (RF_UE_3) (RF_UE_4). |
| **Catalogo territoriale** | Archivio centralizzato dei centri specializzati e delle relative attività fisiche e sociali disponibili sul territorio, gestito dall'amministratore e ricercabile dal tutore mediante filtri geografici (comune, provincia o regione). |
| **Centro (Centro specializzato)** | Struttura sanitaria, assistenziale o associativa registrata nel catalogo territoriale con nome, indirizzo, comune, provincia, regione, contatti, fonte delle informazioni e data di ultima verifica (campi obbligatori). |
| **Codice Fiscale (CF)** | Codice alfanumerico univoco presente nell'anagrafica degli utenti registrati, impiegato per l'identificazione e la ricerca di pazienti e figure di supporto all'interno della piattaforma. |
| **Continuità assistenziale** | Integrazione informativa e operativa continua tra struttura sanitaria, professionisti curanti (medico e nutrizionista), domicilio del paziente e tutore, volta a superare la frammentazione dei percorsi di cura. |
| **Control** | Categoria di oggetti del modello a oggetti e dei Sequence Diagram che implementa la logica di coordinamento tra i componenti di interfaccia (*Boundary*) e i dati di dominio (*Entity*). |
| **Controllo degli accessi per ruolo** | Meccanismo di sicurezza che consente a ogni utente di accedere esclusivamente alle funzioni e ai dati previsti per il proprio ruolo e per i pazienti a lui formalmente associati, rifiutando ogni richiesta non autorizzata (RNF_FUN_3). |
| **Cooperativa sociale** | Organizzazione operante nei servizi socioassistenziali e sociosanitari destinataria della piattaforma MindCompanion. |
| **Credenziali di accesso** | Coppia formata dall'e-mail dell'utente e dalla password, usata per autenticarsi sulla piattaforma (RF_UE_1). |
| **Dati anagrafici** | Informazioni identificative di base di un utente registrato (nome, cognome, e-mail, codice fiscale, data di nascita), unici dati accessibili all'amministratore durante la gestione degli account e delle associazioni (RF_AD_7, UC_AD_1). |
| **Dati sanitari (Dati personali sanitari)** | Insieme dei dati clinici, anamnestici, nutrizionali e dei risultati delle sessioni relativi al paziente, cifrati nel database mediante AES-256 e inaccessibili all'amministratore. |
| **Decadimento cognitivo lieve (MCI –** ***Mild Cognitive Impairment*)** | Condizione clinica caratterizzata da un lieve declino delle capacità cognitive rispetto a quanto atteso per l'età, fase iniziale nella quale la stimolazione cognitiva regolare può contribuire a rallentare o prevenire l'evoluzione verso la demenza. |
| **Demenza** | Condizione clinica acquisita e progressiva caratterizzata dal declino di memoria, linguaggio, attenzione e capacità di giudizio, che compromette progressivamente l'autonomia della persona nelle attività quotidiane. |
| **Entity** | Categoria di oggetti del modello ad oggetti e dei Sequence Diagram che rappresenta le entità informative persistenti del dominio applicativo (es. Paziente, PianoStimolazione, PianoAlimentare, Questionario, Centro). |
| **Esercizio** | Singola prova di stimolazione cognitiva generata dal sistema e calibrata sui parametri del piano assegnato. Appartiene a una delle aree previste (Memoria, Attenzione, Linguaggio) ed è composta da livello di difficoltà, quesito, opzioni di risposta e un'unica risposta esatta univoca. |
| **Esportazione credenziali** | Funzionalità con cui l'amministratore, al termine della registrazione di un nuovo utente, apre una pagina stampabile con l'e-mail e la password temporanea, da stampare o salvare come PDF dal browser e consegnare all'utente. Il sistema non conserva copie in chiaro delle credenziali esportate (RF_AD_12). |
| **Feedback empatico (Feedback graduale gentile)** | Messaggio rassicurante e non punitivo mostrato al paziente in caso di errore durante un esercizio, privo di allarmi sonori invasivi e selezionato da un catalogo approvato (RNF_USA_1). |
| **Ingrandimento testo** | Funzionalità di accessibilità dell'interfaccia paziente che permette di modificare in modo immediato la dimensione dei caratteri tra tre livelli disponibili: Normale, Grande e MoltoGrande (RF_PZ_7). |
| **Malattia di Alzheimer** | La forma più diffusa di demenza; patologia neurodegenerativa irreversibile e progressiva che compromette gradualmente memoria, funzioni cognitive e autonomia personale. |
| **Medico (MD)** | Professionista sanitario associabile ai pazienti dall'amministratore (al massimo uno per paziente). Ha facoltà di creare, inviare e consultare il questionario informativo, monitorare l'andamento delle sessioni e creare, revisionare, sospendere, riattivare o eliminare il piano di stimolazione cognitiva. |
| **MindCompanion** | Piattaforma web responsive integrata finalizzata alla prevenzione, al contrasto e al monitoraggio del decadimento cognitivo lieve e delle forme di demenza, attraverso stimolazione cognitiva personalizzata, gestione nutrizionale, condivisione con i tutori e catalogo territoriale. |
| **Mock-up (UI)** | Rappresentazione grafica prototipale delle schermate del sistema (identificata dal prefisso UI), realizzata per illustrare la disposizione degli elementi e i flussi di interazione utente. |
| **MongoDB** | DBMS NoSQL orientato ai documenti adottato per la persistenza dei dati della piattaforma in formato BSON (RNF_IMP_1). |
| **Navigation Path (NP)** | Diagramma dei percorsi di navigazione che descrive le schermate e le possibili transizioni di navigazione previste per ciascun ruolo utente (NP_AD, NP_NT, NP_PZ, NP_TT, NP_MD). |
| **Next.js / React / TypeScript** | Stack tecnologico (framework, libreria UI e linguaggio tipizzato) individuato per l'implementazione della piattaforma web MindCompanion (RNF_IMP_2). |
| **Nutrizionista (NT)** | Professionista specializzato associabile ai pazienti dall'amministratore (al massimo uno per paziente). Può inviare il questionario alimentare al tutore o al paziente, consultarne le risposte definitive e creare, modificare, visualizzare o eliminare il piano alimentare personalizzato. |
| **Password temporanea** | Password generata casualmente dal sistema alla registrazione di un nuovo utente, lunga almeno 12 caratteri e salvata solo come hash. Vale soltanto per il primo accesso, dopo il quale l'utente deve sostituirla (RF_AD_1, RF_UE_4, RNF_FUN_5). |
| **Pasto** | Singola unità alimentare del piano nutrizionale, identificata dal giorno della settimana (lunedì–domenica), dalla tipologia (Colazione, Pranzo, Cena, Spuntino/Spuntini), dagli alimenti e dalle relative porzioni. |
| **Paziente (PZ)** | Utente destinatario del percorso assistenziale e di prevenzione. Svolge le sessioni di stimolazione cognitiva prescritte, consulta il proprio andamento e il proprio piano alimentare, regola la dimensione del testo e compila i questionari quando inviati direttamente a lui. |
| **Persistenza progressiva** | Proprietà di affidabilità del sistema che garantisce il salvataggio incrementale degli esercizi già confermati in una sessione e dell'ultima bozza salvata di un questionario in caso di interruzione di rete (RNF_AFF_1, RNF_AFF_2). |
| **Piano alimentare** | Programma nutrizionale personalizzato redatto, pubblicato ed eventualmente aggiornato o eliminato dal nutrizionista per il paziente associato. Include i pasti settimanali e le raccomandazioni idriche e nutrizionali, ed è consultabile dal paziente e dal tutore in vista giornaliera e settimanale. |
| **Piano di stimolazione cognitiva** | Piano personalizzato assegnato dal medico a un paziente (al massimo un piano per paziente), definito da livello di difficoltà iniziale (intero da 1 a 5) e numero di esercizi per sessione (intero da 5 a 20). Può assumere stato Attivo o Sospeso ed essere revisionato, sospeso, riattivato o eliminato dal medico. |
| **Questionario alimentare** | Modulo conoscitivo inviato dal nutrizionista a un tutore associato o, in assenza di tutori, al paziente per raccogliere informazioni su abitudini, preferenze, allergie o intolleranze alimentari necessarie alla redazione della dieta. |
| **Questionario informativo (Questionario medico)** | Modulo conoscitivo creato dal medico e inviato al tutore associato (o al paziente stesso in assenza di tutore) per raccogliere informazioni sullo stato clinico, sulle terapie e sulle abitudini del paziente utili a calibrare il piano di stimolazione. Una volta inviato definitivamente diviene immodificabile. |
| **RAD (*Requirement Analysis Document*)** | Documento di analisi dei requisiti che descrive obiettivi, ambito, sistema corrente, sistema proposto, requisiti funzionali e non funzionali, modelli di sistema (scenari, casi d'uso, modello ad oggetti e dinamico) e interfacce utente. |
| **Requisito Funzionale (RF)** | Descrizione di una funzionalità o servizio che il sistema deve fornire agli utenti, identificata con notazione RF_[attore]_[numero] e classificata per priorità (Alta, Media, Bassa). |
| **Requisito Non Funzionale (RNF)** | Criterio qualitativo o vincolo relativo a funzionalità trasversali, usabilità, affidabilità, prestazioni, sostenibilità, implementazione o operazione, identificato con notazione RNF_[categoria]_[numero]. |
| **Responsive (Interfaccia responsive)** | Capacità dell'interfaccia web di adattarsi automaticamente alle dimensioni dello schermo, garantendo la fruibilità su PC e tablet (schermi con larghezza a partire da 768 px, RNF_SO_1). |
| **Risposta esercizio** | Entità che memorizza la risposta fornita dal paziente a un esercizio durante una sessione di stimolazione, indicando correttezza, livello di aiuto progressivo erogato e stato di conferma. |
| **RSA (*Residenza Sanitaria Assistenziale*)** | Struttura sociosanitaria per l'assistenza a persone anziane o non autosufficienti, tra i principali destinatari del sistema MindCompanion. |
| **Scenario (SC)** | Descrizione narrativa concreta del flusso di interazioni tra uno o più attori specifici e il sistema per illustrare l'esecuzione di una funzionalità. |
| **Sessione di stimolazione** | Singola esecuzione della sequenza di esercizi prevista dal piano di stimolazione attivo del paziente. Registra data, punteggio e stato (InSvolgimento, Sospesa, Completata, Interrotta). |
| **SOW (*Statement of Work*)** | Documento preliminare di commessa che definisce gli obiettivi generali, il perimetro e i riferimenti progettuali del sistema. |
| **Stimolazione cognitiva** | Insieme strutturato di esercizi cognitivi calibrati (su memoria, attenzione e linguaggio) mirati a mantenere attive le funzioni cerebrali, prevenire o rallentare il declino cognitivo e preservare l'autonomia del paziente. |
| **Tutore (TT)** | Figura di supporto (familiare o caregiver) associata dall'amministratore a zero o più pazienti. Può consultare l'andamento delle attività e il piano alimentare del paziente associato, compilare i questionari qualora designato come destinatario e ricercare centri specializzati e attività sul territorio. |
| **UML (*Unified Modeling Language*)** | Linguaggio di modellazione grafica orientata agli oggetti impiegato nel documento per rappresentare *Activity Diagram*, *Use Case Diagram*, *Class Diagram*, *Statechart Diagram* e *Sequence Diagram*. |
| **Use Case (UC)** | Specifica formale di un caso d'uso che definisce attori, condizioni di ingresso e uscita, flusso principale di eventi, scenari alternativi, gestione degli errori e requisiti speciali. |
| **Utente** | Entità astratta di riferimento per tutti i soggetti registrati nella piattaforma (Paziente, Tutore, Medico, Nutrizionista, Amministratore), caratterizzata da dati anagrafici e credenziali di autenticazione. |
| **Validatore formale (Univocità quiz)** | Modulo di controllo integrato nell'algoritmo di generazione degli esercizi di stimolazione cognitiva che garantisce che ogni quesito prodotto abbia una e una sola risposta esatta univoca, scartando quesiti ambigui o insolubili (RNF_FUN_2). |
| **WCAG 2.1 (livello AA)** | Linee guida internazionali per l'accessibilità web adottate come riferimento per l'interfaccia paziente, richiedendo caratteri di dimensione non inferiore a 18 px e contrasto con lo sfondo di almeno 4,5:1 (RNF_USA_3). |
