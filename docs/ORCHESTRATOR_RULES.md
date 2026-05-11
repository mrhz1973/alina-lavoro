# Alina Lavoro — Regole prioritarie orchestratore

Ultimo aggiornamento: 2026-05-11 — **vincolo assoluto passo passo** per operazioni umane (n8n, VPS, browser, GAS, ecc.) integrato in **PRIORITÀ 0**; chiarita la convivenza con **avanzamento senza «vai»** (non salta passi manuali). In precedenza: regole **avanzamento senza “vai”**, **richiesta esplicita di `aggio`**, **Regola output prompt Cursor** (blocco solo Cursor; `aggio` fuori blocco). Stato stabile app: **V1.9.2** (deploy **`@24`**, test **`/exec` OK** 2026-05-10).

Questo file contiene le regole prioritarie per ChatGPT/orchestratore e per qualsiasi nuova chat AI che ricostruisce lo stato del progetto da GitHub.

## PRIORITÀ 0 — Passo passo operativo

### Vincolo assoluto (operazioni umane e automazione esterna)

Quando l’utente sta operando (o deve operare) su **computer, n8n, VPS, Cursor, terminale, GitHub (interfaccia o flussi che richiedono occhio umano), Google Apps Script, clasp, browser o file locali**, la modalità **passo passo** è un **vincolo assoluto** per l’orchestratore e per ogni guida operativa rivolta all’utente. Vale anche per **workflow automation** che non sono ancora “fire-and-forget” senza supervisione.

In questa modalità l’orchestratore deve:

- dare **un solo passo operativo alla volta**;
- **attendere l’esito esplicito dell’utente** (conferma, risultato visibile, `aggio`, o messaggio chiaro di chiusura) prima di proporre il passo successivo;
- se il passo corrente **non è completato**, **fallisce**, resta **ambiguo**, o l’utente **sta ancora verificando** (es. run n8n, diff su schermo, test manuale): è **vietato** proporre in anticipo **export**, **chiusure di sessione**, **commit**, **documentazione di completamento** o **passi successivi** come se il passo fosse già chiuso;
- le versioni **diagnostiche** o **temporanee** (codice n8n, nodi di test, patch “solo per vedere”) devono essere **chiuse esplicitamente**: ripristino a versione **finale pulita**, verifica, **conferma utente** — **solo dopo** il passo successivo;
- se l’utente segnala **confusione**, **errore**, **irritazione**, o dice **«passo passo»**, **«un passo alla volta»** o equivalente, la modalità a **singolo passo** diventa **ancora più stretta** (zero anticipazione).

**Convivenza con «non chiedere vai»** (sezioni **Avanzamento automatico dopo `aggio`** e **Regola avanzamento senza “vai””**):

- «**Non chiedere vai**» **non** autorizza a **saltare** passaggi che richiedono azione o verifica **manuale** dell’utente. Significa solo: non chiedere conferme **inutili** quando il passo precedente è **già completato**, il prossimo micro-step è **determinato** e **non** c’è un’azione manuale in sospeso.
- Se **non** c’è un’azione manuale in corso e il prossimo micro-step è chiaro, l’orchestratore può **proporre direttamente** quel micro-step (anche subito dopo `aggio`, vedi sotto).
- Se invece l’utente deve **eseguire o verificare** qualcosa (n8n, browser, terminale, deploy, ecc.), l’orchestratore si **ferma** e attende l’**esito** prima di qualsiasi passo successivo.

Questa priorità vale per **ChatGPT orchestratore**, **Cursor/Agent**, **n8n**, **VPS**, **workflow automation**, **terminale** e per il coordinamento su **GitHub** quando il passo richiede l’umano nel loop.

### Requisiti operativi (dettaglio)

Quando l’utente deve eseguire azioni pratiche su computer, Cursor, terminale, GitHub, Google Apps Script, clasp, file locali o browser, l’orchestratore deve procedere **passo passo**.

Regola obbligatoria:

- dare **un solo passo operativo alla volta**;
- aspettare l’esito dell’utente prima di passare al passo successivo;
- non scaricare procedure lunghe se l’utente ha chiesto o il contesto richiede guida assistita;
- non mescolare più obiettivi nello stesso messaggio;
- evidenziare subito blocchi, warning, errori locali o configurazioni anomale;
- se serve un prompt Cursor, fornirlo solo quando è il passo corrente;
- se il passo è “incolla questo in Cursor”, il blocco da incollare deve essere completo e autosufficiente **per Cursor**; le istruzioni **solo** per l’utente (es. **`Quando Cursor finisce, scrivi: aggio`**) restano **fuori** dal blocco — vedi **Regola output prompt Cursor**;
- se il passo è terminale, dare pochi comandi e spiegare cosa deve uscire;
- se l’utente scrive «passo passo», «un passo alla volta», mostra confusione, errore o irritazione, **restringere** alla guida **singolo passo** senza anticipare il successivo;
- se l’utente conferma che il passo precedente è **concluso** («ok», «fatto», «andiamo avanti» in quel senso), si può passare al micro-step successivo — senza confondere con la richiesta inutile di «vai» quando il passo successivo è già ovvio **e** non c’è lavoro manuale pendente.

Questa priorità prevale sulle altre regole di sintesi, automazione e workflow snello. Il workflow snello deve ridurre passaggi inutili, ma **non** anticipare passi mentre un’azione manuale è ancora **aperta** o **non confermata**.

## Principio principale

- GitHub e la fonte di verita operativa.
- L'orchestratore non deve chiedere all'utente riepiloghi manuali se le informazioni sono gia su GitHub.
- Cursor/Agent e l'implementatore operativo: modifica file, esegue controlli, commit e push.
- L'utente non deve essere usato come ponte manuale tra Cursor e ChatGPT, salvo errore locale non pushato.
- Le procedure ripetitive devono stare nei documenti del repository, non essere riscritte ogni volta nei prompt.
- Se una procedura non e ancora documentata in `docs/COMMANDS.md`, `docs/WORKFLOW.md` o `docs/AI_RULES.md`, l'orchestratore deve inserirla direttamente nel prompt Cursor, in un unico blocco copiabile quando quello è il passo corrente. Non deve lasciarla fuori dal prompt come istruzioni separate per l'utente, **salvo** le istruzioni che sono **solo** per l'utente (es. richiesta di `aggio` dopo Cursor), che restano **fuori** dal blocco incollabile — vedi **Regola output prompt Cursor** e **Regola richiesta esplicita di `aggio`**.

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

Dopo aver completato il riepilogo di `aggio`, se il prossimo passo è chiaro, non ambiguo e non richiede una scelta dell’utente, l’orchestratore deve **proporre direttamente il prossimo micro-step operativo** nello stesso messaggio, senza fermarsi ad aspettare un ulteriore “vai” — **salvo** che esista ancora un **passo manuale aperto** (n8n, browser, verifica visiva, ecc.): in quel caso **non** anticipare; attendere conferma come in **PRIORITÀ 0**.

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

Questa regola è **subordinata** a **PRIORITÀ 0**: se un passo **manuale** o di **verifica utente** non è chiuso, **non** si applica l’anticipazione del micro-step successivo.

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

Quando il prossimo passo **atteso** è che l’utente faccia **`aggio`** (verifica GitHub / stato repo da parte dell’orchestratore) **dopo** un blocco **Cursor**, l’orchestratore deve chiederlo **esplicitamente** all’utente, ad esempio con la frase:

`Quando Cursor finisce, scrivi: aggio`

oppure **formula equivalente** altrettanto chiara.

- **Non** lasciare **implicito** che l’utente debba scrivere `aggio`.
- **Non** aspettarsi un `aggio` **senza** averlo richiesto in modo leggibile nel flusso.
- Questa frase **non** fa parte del contenuto da dare a Cursor: è **istruzione operativa per l’utente** e deve stare **fuori** dal blocco da copiare in Cursor (vedi **Regola output prompt Cursor**).

Forma del messaggio quando, dopo il prompt Cursor, il passo successivo atteso è la verifica da orchestratore (esempio):

```text
Incolla questo in Cursor:

[UNICO BLOCCO PROMPT CURSOR]

Quando Cursor finisce, scrivi: aggio
```

Se un prompt Cursor prevede **commit** e **push**, la richiesta a Cursor di riportare **hash commit** e stato finale deve stare **nel blocco** destinato a Cursor; **fuori** dal blocco Cursor, se non ci sono decisioni o rischi, **non** aggiungere riepiloghi esterni (stessa disciplina della **Regola output prompt Cursor**).

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

Ogni prompt operativo per Cursor deve essere autosufficiente **per Cursor** nel blocco da incollare: tutto ciò che Cursor deve fare e che non è già documentato nel repo deve stare in quel blocco. L’utente non deve dover copiare **per Cursor** pezzi esterni separati da quel blocco; la richiesta di scrivere `aggio` dopo Cursor resta **fuori** dal blocco (vedi **Regola output prompt Cursor**).

## Regola output prompt Cursor

Quando l’output richiesto è un **prompt Cursor**:

1. Il blocco da copiare in Cursor deve contenere **solo** istruzioni e contesto destinati a **Cursor** (riferimenti `@…`, obiettivo, vincoli, procedura, output atteso da Cursor, ecc.).
2. La frase rivolta all’utente **`Quando Cursor finisce, scrivi: aggio`** (o equivalente) **non** è contenuto per Cursor: è **istruzione operativa per l’utente** e deve stare **fuori** dal blocco incollabile, **subito dopo** il blocco, quando il passo successivo atteso è la verifica GitHub da parte dell’orchestratore — vedi **Regola richiesta esplicita di `aggio`**.
3. Il messaggio dell’orchestratore ha quindi in generale questa forma (salvo eccezioni sotto):

```text
Incolla questo in Cursor:

[UNICO BLOCCO PROMPT CURSOR]

Quando Cursor finisce, scrivi: aggio
```

L’ultima riga si omette **solo** se **non** serve un `aggio` immediato dopo Cursor; in ogni caso **non** va **dentro** il blocco incollabile.

Tutto il **contesto operativo** necessario **per Cursor** deve stare **dentro** il blocco da copiare e incollare, inclusi a titolo **esemplificativo** (non esaustivo):

- validazioni da eseguire;
- file da creare o aggiornare;
- vincoli e procedura del blocco;
- **messaggio di commit** (ove richiesto);
- **risposta finale obbligatoria** da riprodurre in chiusura (se prevista dal task e destinata a Cursor).

**Non** includere nel blocco incollabile la richiesta di `aggio` per l’utente (punto 2).

Non devono comparire **fuori** dal blocco prompt Cursor:

- riepiloghi della validazione;
- elenchi di file da creare o da aggiornare;
- contenuto richiesto per sessioni o altri file se già specificato **nel** blocco;
- vincoli obbligatori o procedura **ripetuti** all’esterno;
- messaggio di commit duplicato fuori blocco;
- checklist “risposta finale obbligatoria” come testo parallelo se già inclusa nel blocco;
- **ripetizioni** o **parafrasi** del blocco.

Testo **fuori** dal blocco Cursor è consentito per:

- **istruzione esplicita all’utente** di scrivere `aggio` dopo Cursor, come sopra (non è duplicazione del prompt Cursor);
- oppure, se serve **davvero**:
  - una **decisione**;
  - un **rischio**;
  - un **errore**;
  - **deploy / tag / rollback**;
  - **cancellazioni**;
  - **credenziali** o dati sensibili;
  - **conferma esplicita** non riducibile a istruzioni nel blocco.

Se **non** c’è nulla di tutto ciò **oltre** alla riga facoltativa **`Quando Cursor finisce, scrivi: aggio`** quando serve, l’output dell’orchestratore deve essere **unicamente** la riga **`Incolla questo in Cursor:`** seguita dal **blocco prompt Cursor** (e, se applicabile, la riga per `aggio`), senza altro testo esplicativo.

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

- inserirli direttamente dentro il blocco da incollare in Cursor se il prompt è il passo corrente;
- non fornirli come blocco separato **fuori** dal blocco Cursor (non confondere con la riga per l’utente **`Quando Cursor finisce, scrivi: aggio`**, che è consentita **dopo** il blocco — vedi **Regola output prompt Cursor**);
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
