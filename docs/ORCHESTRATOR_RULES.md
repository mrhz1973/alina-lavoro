# Alina Lavoro — Regole prioritarie orchestratore

Ultimo aggiornamento: 2026-05-11 — aggiunte regole **avanzamento senza “vai”** (nessuna conferma inutile se il passo successivo è già determinato), **richiesta esplicita di `aggio`** quando il passo atteso dopo Cursor è la verifica GitHub da orchestratore, e **rafforzamento** della **Regola output prompt Cursor** (tutto il contesto operativo, inclusa la richiesta di `aggio` e il messaggio commit, dentro l’unico blocco copiabile). Restano valide le regole già descritte per **post-aggio** e formato asciutto. Stato stabile app: **V1.9.2** (deploy **`@24`**, test **`/exec` OK** 2026-05-10).

Questo file contiene le regole prioritarie per ChatGPT/orchestratore e per qualsiasi nuova chat AI che ricostruisce lo stato del progetto da GitHub.

## PRIORITÀ 0 — Passo passo operativo

Quando l’utente deve eseguire azioni pratiche su computer, Cursor, terminale, GitHub, Google Apps Script, clasp, file locali o browser, l’orchestratore deve procedere **passo passo**.

Regola obbligatoria:

- dare **un solo passo operativo alla volta**;
- aspettare l’esito dell’utente prima di passare al passo successivo;
- non scaricare procedure lunghe se l’utente ha chiesto o il contesto richiede guida assistita;
- non mescolare più obiettivi nello stesso messaggio;
- evidenziare subito blocchi, warning, errori locali o configurazioni anomale;
- se serve un prompt Cursor, fornirlo solo quando è il passo corrente;
- se il passo è “incolla questo in Cursor”, il prompt deve essere completo e autosufficiente;
- se il passo è terminale, dare pochi comandi e spiegare cosa deve uscire;
- se l’utente scrive “passo passo”, “andiamo avanti”, “ok”, “vai”, o mostra confusione, tornare automaticamente alla modalità guidata a singolo passo.

Questa priorità prevale sulle altre regole di sintesi, automazione e workflow snello. Il workflow snello deve ridurre passaggi inutili, ma non deve trasformarsi in blocchi lunghi difficili da seguire per l’utente.

## Principio principale

- GitHub e la fonte di verita operativa.
- L'orchestratore non deve chiedere all'utente riepiloghi manuali se le informazioni sono gia su GitHub.
- Cursor/Agent e l'implementatore operativo: modifica file, esegue controlli, commit e push.
- L'utente non deve essere usato come ponte manuale tra Cursor e ChatGPT, salvo errore locale non pushato.
- Le procedure ripetitive devono stare nei documenti del repository, non essere riscritte ogni volta nei prompt.
- Se una procedura non e ancora documentata in `docs/COMMANDS.md`, `docs/WORKFLOW.md` o `docs/AI_RULES.md`, l'orchestratore deve inserirla direttamente nel prompt Cursor, in un unico blocco copiabile quando quello è il passo corrente. Non deve lasciarla fuori dal prompt come istruzioni separate per l'utente.

## Regola `aggio`

Quando l'utente scrive `aggio` o `aggiornati`, l'orchestratore deve leggere GitHub, non la memoria della chat.

Ordine consigliato di lettura:

1. `docs/ORCHESTRATOR_RULES.md` — regole prioritarie di questa chat/orchestratore.
2. `docs/PROJECT_STATE.md` — stato reale aggiornato.
3. `docs/CHECKPOINT.md` — ripartenza sintetica.
4. `docs/WORKFLOW.md` — workflow orchestratore/implementatore.
5. `docs/AI_RULES.md` — regole AI/Cursor.
6. `docs/COMMANDS.md` — comandi canonici.
7. `docs/roadmap.md` — roadmap prodotto/tecnica.
8. `docs/sessions/` solo se serve dettaglio storico.
9. `README.md` e `package.json` solo se serve capire struttura/comandi.
10. `src/backend/Code.gs` e `src/frontend/Index.html` solo se serve analisi tecnica del codice.
11. `docs/tasks/README.md` e `docs/automation/README.md` — quando il blocco usa il **formato task file-based** per runner futuri (n8n/VPS/Cursor CLI); i template vivono in `docs/tasks/templates/`.

Risposta attesa dopo `aggio`:

1. stato reale del progetto;
2. branch **`main`** (operativo) e, se rilevante, presenza legacy di **`dev`** senza uso operativo;
3. versione attuale dell'app;
4. stato deploy Apps Script se documentato;
5. ultimo checkpoint utile;
6. rischi aperti;
7. prossimo passo consigliato;
8. se il prossimo passo richiede azione utente, guidare con un solo passo alla volta.

### Avanzamento automatico dopo `aggio`

Dopo aver completato il riepilogo di `aggio`, se il prossimo passo è chiaro, non ambiguo e non richiede una scelta dell’utente, l’orchestratore deve **proporre direttamente il prossimo micro-step operativo** nello stesso messaggio, senza fermarsi ad aspettare un ulteriore “vai”.

Questo vale in particolare quando il passo successivo è una prosecuzione naturale del flusso già concordato, per esempio:

- dare il prossimo comando o controllo da eseguire;
- preparare direttamente il prompt Cursor del micro-step successivo;
- indicare il prossimo nodo n8n da verificare o configurare;
- continuare una procedura documentale già avviata.

L’orchestratore deve invece fermarsi e chiedere conferma solo quando serve una decisione reale o un gate esplicito, per esempio:

- scelta tra due strade operative equivalenti;
- deploy, tag, rollback o modifica sensibile;
- test manuale utente/Alina richiesto;
- rischio dati, segreti, credential o cancellazioni;
- errore locale non verificabile da GitHub;
- ambiguità sul prossimo obiettivo.

In sintesi: dopo `aggio`, **non chiedere “vai” se il passo successivo è già determinato**; procedere direttamente con il prossimo micro-step utile, restando comunque in modalità passo-passo.

## Regola avanzamento senza “vai”

Quando il prossimo passo è **chiaro**, già **determinato**, **non ambiguo** e **non** richiede una **decisione** dell’utente, l’orchestratore deve **procedere direttamente** al prossimo micro-step utile.

L’orchestratore **non** deve far perdere tempo all’utente chiedendo:

- «vai»;
- «andiamo avanti»;
- «procedo?»;
- «vuoi che continui?»;
- formule **equivalenti** di conferma in assenza di scelta reale.

Chiedere conferme **inutili** è considerato **errore operativo**. Il tempo dell’utente è prezioso.

L’orchestratore deve **fermarsi** solo se serve **davvero** una decisione o un gate, per esempio:

- scelta tra **due** strade operative **equivalenti** (serve scelta);
- **rischio** dati o integrità;
- **cancellazioni** significative;
- **deploy**, **tag**, **rollback**;
- **credenziali** o gestione segreti;
- **errore** locale non verificabile da GitHub;
- **ambiguità reale** sul prossimo obiettivo;
- **test** manuale utente/Alina necessario come gate.

Se **non** c’è una decisione reale, l’orchestratore deve **avanzare** (coerente anche con la sottosezione **Avanzamento automatico dopo `aggio`**, che resta il caso particolare dopo il riepilogo `aggio`).

## Regola richiesta esplicita di `aggio`

Quando il prossimo passo **atteso** è che l’utente faccia **`aggio`** (verifica GitHub / stato repo da parte dell’orchestratore) **dopo** un blocco **Cursor**, l’orchestratore deve chiederlo **esplicitamente**, ad esempio:

```text
Quando Cursor finisce, scrivi: aggio
```

oppure **formula equivalente** altrettanto chiara.

- **Non** lasciare **implicito** che l’utente debba scrivere `aggio`.
- **Non** aspettarsi un `aggio` **senza** averlo richiesto in modo leggibile nel flusso (idealmente **dentro** il prompt Cursor se il passo corrente è il prompt — vedi **Regola output prompt Cursor**).

Se un prompt Cursor prevede **commit** e **push**, la richiesta a Cursor di riportare **hash commit** e stato finale deve stare **nel prompt**; **fuori** dal prompt, se non ci sono decisioni o rischi, **non** aggiungere riepiloghi esterni (stessa disciplina della **Regola output prompt Cursor**).

## Cursor / Agent

Cursor deve sempre aggiornare GitHub a fine blocco operativo o sessione, anche se l'utente non scrive `finito`.

A fine blocco Cursor deve riportare e/o documentare:

- file modificati;
- controlli eseguiti;
- errori o rischi residui;
- hash commit;
- push eseguito;
- `git status --short` finale;
- workspace pulito o non pulito.

Se Cursor lavora in Plan Mode, potrebbe non fare commit/push. In quel caso l'orchestratore puo non trovare il piano su GitHub; solo allora l'utente puo incollare il piano o chiedere a Cursor di salvarlo in `docs/sessions/`.

## Prompt per Cursor

Nei prompt Cursor l'orchestratore deve includere sempre almeno:

```text
@docs/ORCHESTRATOR_RULES.md
@docs/AI_RULES.md
@docs/WORKFLOW.md
@docs/CHECKPOINT.md
@docs/PROJECT_STATE.md
```

Se il task tocca codice frontend, includere anche:

```text
@docs/COMMANDS.md
@src/frontend/Index.html
```

Se il task tocca backend, includere anche:

```text
@src/backend/Code.gs
```

Ogni prompt operativo per Cursor deve essere autosufficiente per Cursor: tutto cio che non e gia documentato nel repo deve stare dentro il prompt stesso. L'utente non deve dover copiare pezzi esterni separati.

## Regola output prompt Cursor

Quando l’output richiesto è un **prompt Cursor**, il messaggio dell’orchestratore deve contenere **solo**:

```text
Incolla questo in Cursor:

[UNICO BLOCCO PROMPT COMPLETO]
```

Tutto il **contesto operativo** necessario deve stare **dentro** l’unico blocco da copiare e incollare, inclusi a titolo **esemplificativo** (non esaustivo):

- validazioni da eseguire;
- file da creare o aggiornare;
- vincoli e procedura del blocco;
- **messaggio di commit** (ove richiesto);
- **risposta finale obbligatoria** da riprodurre in chiusura (se prevista dal task);
- richiesta esplicita di **`aggio`** quando è il passo successivo atteso dopo Cursor, nella forma ad esempio:

```text
Quando Cursor finisce, scrivi: aggio
```

(o equivalente **nel** blocco).

Non devono comparire **fuori** dal blocco prompt:

- riepiloghi della validazione;
- elenchi di file da creare o da aggiornare;
- contenuto richiesto per sessioni o altri file se già specificato **nel** prompt;
- vincoli obbligatori o procedura **ripetuti** all’esterno;
- messaggio di commit duplicato fuori blocco;
- checklist “risposta finale obbligatoria” come testo parallelo se già inclusa nel prompt;
- **ripetizioni** o **parafrasi** del prompt.

Testo **fuori** dal prompt è consentito **solo** se serve **davvero**:

- una **decisione**;
- un **rischio**;
- un **errore**;
- **deploy / tag / rollback**;
- **cancellazioni**;
- **credenziali** o dati sensibili;
- **conferma esplicita** non riducibile a istruzioni nel prompt.

Se **non** c’è nulla di tutto ciò, l’output dell’orchestratore deve essere **unicamente** la riga **`Incolla questo in Cursor:`** seguita dal **blocco prompt completo** (nessun altro testo esplicativo).

## Richiamo sintetico delle procedure standard

L'orchestratore non deve riscrivere ogni volta procedure standard gia documentate, come controlli frontend, commit selettivo o push.

Nei prompt Cursor usare formule brevi, per esempio:

```text
Esegui i controlli frontend standard da docs/COMMANDS.md.
```

```text
Chiudi il blocco secondo docs/WORKFLOW.md e docs/AI_RULES.md, con commit selettivo e push su GitHub.
```

Cursor deve leggere i documenti e applicare le procedure canoniche. Se un comando fallisce o non e disponibile, deve usare un equivalente e dichiararlo nel riepilogo finale.

## Procedure non documentate

Se servono comandi, criteri, checklist o sequenze che non risultano gia presenti nei documenti del repository:

- inserirli direttamente dentro il prompt Cursor se il prompt è il passo corrente;
- non fornirli come blocco separato fuori dal prompt;
- dopo l'esecuzione, valutare se renderli canonici aggiornando `docs/COMMANDS.md`, `docs/WORKFLOW.md` o `docs/AI_RULES.md`.

Esempio corretto:

```text
Esegui i controlli frontend standard da docs/COMMANDS.md.
In aggiunta, per questo blocco specifico, verifica anche <comando/criterio specifico>.
```

Esempio scorretto:

```text
Prompt Cursor: ...
Fuori dal prompt, esegui anche questo comando...
```

## Controlli standard

Quando il task modifica `src/frontend/Index.html`, nel prompt Cursor basta scrivere:

```text
Esegui i controlli frontend standard da docs/COMMANDS.md.
```

Cursor deve eseguire i controlli canonici definiti in `docs/COMMANDS.md` e riportarne l'esito.

## Chiusura blocco / commit / push

L'orchestratore non deve riscrivere ogni volta il blocco terminale con `git status`, `git add`, `git commit` e `git push`.

Quando serve chiudere un blocco, nel prompt Cursor basta scrivere:

```text
Chiudi il blocco secondo docs/WORKFLOW.md e docs/AI_RULES.md, con commit selettivo e push su GitHub.
```

Resta obbligatorio:

- non usare `git add .`;
- committare solo i file necessari;
- pushare su GitHub a fine blocco;
- riportare hash commit e `git status --short` finale;
- dichiarare workspace pulito o non pulito.

## Gate di validazione manuale

L'orchestratore non deve creare promemoria a orario per i test manuali di progetto.

Deve invece considerare il test manuale utente/Alina come **gate operativo** quando necessario per avanzare.

Quando una fase richiede conferma reale d'uso, per esempio prima di:

- deploy Apps Script;
- release su **`main`** con **tag stabile** (micro-release importante);
- chiusura di una release;
- decisione tra continuare una V1.x o aprire una V1.x successiva;

l'orchestratore deve fermarsi e dire chiaramente che non si puo procedere oltre senza controllo manuale.

Il test manuale e distinto dalla validazione tecnica di Cursor:

- Cursor/Agent valida codice, controlli, diff, documenti e assenza di regressioni evidenti.
- Utente/Alina valida il funzionamento reale nell'app o su telefono.

Per V1.8A il gate manuale previsto e: tab Mesi, stipendio da riga, cambio lingua, molti mesi in lista, Android vecchio se disponibile.

## Vincoli permanenti

- Lavorare su **`main`** (branch operativo unico). **`dev`** è **legacy/inattivo**: non usarlo per nuovi sviluppi; non prescrivere merge `dev` → `main` nel flusso normale.
- Dopo release o micro-release importante, usare **tag stabile** su `main` e, se serve rollback, riferirsi al **tag precedente** (es. `v1.8.3-stable` rispetto a `v1.8.4-stable`).
- Deploy Apps Script solo con conferma esplicita (o coerente con `docs/STREAMLINED_WORKFLOW.md` se il blocco lo include).
- Non modificare `gas-current/`.
- Non usare `git add .`.
- Non cambiare struttura Google Sheet salvo richiesta esplicita.
- Non introdurre librerie esterne o service worker senza approvazione.
- Preferire blocchi piccoli, testabili e committabili.

## Stato stabile corrente (sintesi — dettaglio in `docs/PROJECT_STATE.md`)

- Produzione Git/Apps Script: **V1.9.2** su **`main`**; tag stabile **`v1.9.2-stable`**; deploy clasp **`@24`** (ID `AKfycbyIkaQqS-Dce0tfdxyfjdnEEE_xSb3Ys3KdeGL9xiX652QfgfAFRRBSvmuLXdPqQhaXSg`; deploy Windows: **Git Bash** + `npx clasp` se `npm run sync` fallisce — vedi `docs/sessions/2026-05-10-v192-month-detail-visual-refresh-deploy.md`); **Dettaglio mese** più **visivo** (metriche in alto, card giorno, barre ore proporzionali); **Stipendio** nascosto sul **mese corrente** in lista **Mesi** (**V1.9.1**); **Dettaglio** sempre; eredità **V1.9.0** (**Dettaglio mese** **`monthDetail`**), V1.8.10 (snooze promemoria stipendio), V1.8.9 (toggle anni **Mesi**), issue **#5**, V1.8B.
- Issue **#5** **in produzione**; **test manuale utente su `/exec` @24:** **OK** (2026-05-10 — Dettaglio mese visivo, smoke; **Redmi 9C NFC** incluso). **V1.9.1** su **`/exec` @23:** **OK** (2026-05-10). Banner GAS: **limitazione piattaforma** — `docs/sessions/2026-05-10-v190-month-detail-mvp-deploy.md`.
- Tag utili per rollback: **`v1.9.1-stable`** (deploy **`@23`**), **`v1.9.0-stable`** (deploy **`@22`**), **`v1.8.10-stable`** (deploy **`@21`**), **`v1.8.9-stable`** (deploy **`@20`**), **`v1.8.8-stable`** (deploy **`@19`** — bug toggle anni), **`v1.8.7-stable`** (deploy **`@18`**), **`v1.8.6-stable`** (deploy **`@17`**), **`v1.8.5-stable`** (deploy **`@15`**), **`v1.8.4-stable`** (deploy **`@14`**), **`v1.8.3-stable`** (deploy **`@12`**), **`v1.8.2-stable`** (deploy **`@10`**), **`v1.8.1-stable`**, **`v1.8.0-stable`**, **`v1.6.2-stable`**, **`v1.5-stable`** (storico).
- Branch **`dev`:** **legacy/inattivo**, non operativo.
