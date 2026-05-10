# Alina Lavoro — Regole prioritarie orchestratore

Ultimo aggiornamento: 2026-05-10 — priorità **passo-passo** per l’orchestratore; sintesi stato stabile **V1.8.2** in fondo al file.

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

Risposta attesa dopo `aggio`:

1. stato reale del progetto;
2. branch **`main`** (operativo) e, se rilevante, presenza legacy di **`dev`** senza uso operativo;
3. versione attuale dell'app;
4. stato deploy Apps Script se documentato;
5. ultimo checkpoint utile;
6. rischi aperti;
7. prossimo passo consigliato;
8. se il prossimo passo richiede azione utente, guidare con un solo passo alla volta.

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
- Dopo release o micro-release importante, usare **tag stabile** su `main` e, se serve rollback, riferirsi al **tag precedente** (es. `v1.8.1-stable` rispetto a `v1.8.2-stable`).
- Deploy Apps Script solo con conferma esplicita (o coerente con `docs/STREAMLINED_WORKFLOW.md` se il blocco lo include).
- Non modificare `gas-current/`.
- Non usare `git add .`.
- Non cambiare struttura Google Sheet salvo richiesta esplicita.
- Non introdurre librerie esterne o service worker senza approvazione.
- Preferire blocchi piccoli, testabili e committabili.

## Stato stabile corrente (sintesi — dettaglio in `docs/PROJECT_STATE.md`)

- Produzione Git/Apps Script: **V1.8.2** su **`main`**; tag stabile **`v1.8.2-stable`**; deploy clasp **`@10`** (deploy Windows: **`npx.cmd clasp push`** / **`npx.cmd clasp deploy`**).
- Issue **#5** (arrotondamento Inizio/Fine a 5 minuti) **in produzione**; **test manuale utente su `/exec` OK**.
- Tag utili per rollback: **`v1.8.2-stable`**, **`v1.8.1-stable`**, **`v1.8.0-stable`**, **`v1.6.2-stable`**, **`v1.5-stable`** (storico).
- Branch **`dev`:** **legacy/inattivo**, non operativo.
