# Alina Lavoro — Regole prioritarie orchestratore

Ultimo aggiornamento: 2026-05-12 — aggiunta **PRIORITÀ 0A — Avanzamento senza conferme inutili** come regola globale del progetto: se non c'è decisione reale o gate sensibile, il sistema avanza senza chiedere conferme; vietate formule «vuoi?», «procedo?», «autorizzi?» per task docs-only determinati; gate sensibili (runtime, VPS, n8n runtime, app, deploy, tag, rollback, API key, login, GitHub Actions, costi nuovi, runner automatico, dati personali, test fisico) restano obbligatori; modalità passo-passo (PRIORITÀ 0) resta obbligatoria solo quando l'utente opera manualmente su n8n/VPS/browser/terminale/Apps Script. Precedente (2026-05-11): **vincolo assoluto passo passo** per operazioni umane in **PRIORITÀ 0**; **avanzamento senza «vai»**, **richiesta esplicita di `aggio`**, **Regola output prompt Cursor**. Stato stabile app: **V1.9.2** (deploy **`@24`**, test **`/exec` OK** 2026-05-10).

Questo file contiene le regole prioritarie per ChatGPT/orchestratore e per qualsiasi nuova chat AI che ricostruisce lo stato del progetto da GitHub.

## Agent-facing operational summary (English)

Quick reference for new agents, Claude Code, Cursor, Windsurf/Cascade, and future classifier/planner. Full rules in Italian sections below; this section is a compact English extraction for token efficiency.

**No unnecessary confirmations (PRIORITY 0A):**
- Determined docs-only task → execute; the absence of a real choice equals operational consent.
- Forbidden: asking «vuoi?», «procedo?», «autorizzi?», «vai?» for predetermined docs-only work.
- Asking unnecessary confirmations is an **operational error**.

**Sensitive gates — always require explicit user decision:**
runtime · VPS runtime · n8n runtime · Alina app changes · deploy Apps Script · tag · rollback · API key · login · GitHub Actions · new recurring costs · automatic runner · personal data / credentials / secrets / OAuth material · real physical test (Alina on phone)

**No provider APIs by default:**
ChatGPT = web/on-demand orchestration, not OpenAI API. Claude Code = supervised usage, not Anthropic API. Local AI = Ollama/local models. Any provider API / hosted AI call / API key / billing / recurring cost requires explicit future manual gate and is out of scope by default.

**Step-by-step mode (PRIORITY 0) — mandatory only when user is manually operating:**
n8n UI · VPS terminal · browser · Apps Script / clasp · any visual interface requiring human-in-the-loop
→ One step at a time, wait for outcome before the next step.

**GitHub is the source of truth.** Orchestrator reads GitHub, not the local filesystem.

**`aggio` is voluntary/fallback.** Orchestrator may read GitHub directly without waiting for `aggio` when the commit is already pushed.

**Implementer prompt output format:**
- One block, one mode line: `MODALITÀ: AGENT / IMPLEMENTAZIONE`
- All operational context inside the block.
- Outside the block: only real decisions or real gates not executable by the implementer.
- Do not write outside the block: summaries, confirmations, repeated constraints.

**Agent language:**
- Internal reasoning, prompts, JSON/YAML, classifier/planner, wiki agent-facing → **technical English**
- Final summaries to user, orchestrator chat output → **Italian**
- Full rule: `docs/AI_RULES.md` — "Language policy for agents"

**Claude Code prompt length rule:**
- Short prompt: task file already in `docs/tasks/queue/` → minimal prompt is sufficient.
- Full prompt: only when needed data is not yet on GitHub.
- Sonnet for ordinary tasks; Opus only for complex planning or architectural decisions.

**Batch size policy (task 0175, 2026-05-13):**
- docs-only pure: up to 6 sub-tasks per batch
- docs + Decision Packet: up to 5 sub-tasks per batch
- docs + small technical design: up to 4 sub-tasks per batch
- runtime / n8n UI / credentials / Telegram / Schedule / app / deploy / tag / rollback: **1 step only**
- Batch limits are maximums, not targets; split if ambiguous
- If any sub-task touches runtime or secrets, the runtime portion must be single-step and separately gated
- Selective staging and path allowlists remain mandatory in all batches
- User decisions must not be invented to fill a batch
- Pending Decision Packets remain pending until explicit user response

**LLMS-first routing rule (mandatory):**
- All agents start from `docs/LLMS.md` (≤200 lines), then `docs/wiki/current-state.md` (≤100 lines), then `docs/wiki/token-efficiency.md`.
- `docs/PROJECT_STATE.md` is a **fallback/audit** file — do not read by default; open only when LLMS.md + wiki cannot answer the question; justify in final report.
- `docs/CHECKPOINT.md` is a **restart context** file — open only when restart context is explicitly required; justify in final report.
- Canonicals win over wiki if there is a conflict — update the wiki, not the canonicals.
- Task completion still updates PROJECT_STATE.md and CHECKPOINT.md per lifecycle rules — this routing rule does not change that.
- Claude Code large-file warnings may remain until a future physical compression task; this rule reduces real context consumption independently.

## PRIORITÀ 0B — n8n template-first (priorità tempo e risultati)

**Regola globale del progetto (adottata 2026-05-14, batch 0204–0208).**

La priorità del progetto è **TEMPO E RISULTATI**. La configurazione manuale n8n nodo-per-nodo si è dimostrata troppo lenta ed errore-prone (caso D-0197-A, dove un Set/override parziale non è bastato a forzare l'uso dei valori pinned nei nodi downstream).

**Regola:**

- Quando serve un workflow o test n8n, il deliverable preferito è un **template JSON importabile** (più una companion `.md`).
- La configurazione manuale nodo-per-nodo è **fallback**, usata solo quando l'import non è fattibile.
- I template devono essere **il più completi possibile** per ridurre i click manuali: wiring, nodi Telegram, nodi Data Table, espressioni, Schedule Trigger disabilitato (se utile), credential reference names o placeholder.
- I template sono **inattivi di default** (`active: false`).
- L'**Execute** del workflow importato resta un **gate separato**, mai concesso dal solo import.

**Vietato nei template/repo/chat:**

- token Telegram reale;
- password reali;
- OAuth material reale;
- API key reali;
- credential secret esportati;
- URL contenenti `token=`;
- chat_id reali;
- qualsiasi credential export con segreti.

**Permesso nei template/repo:**

- struttura workflow completa;
- nomi nodo, parametri, espressioni;
- credential reference names o placeholder ("REPLACE_WITH_…");
- chat_id placeholder o espressione;
- Schedule Trigger solo se inattivo e a scopo documentale;
- pinned test values con dati già pubblici nel repo (path file done, SHA pubblici).

**Convivenza:** la modalità passo-passo (**PRIORITÀ 0**) resta obbligatoria quando l'utente sta operando manualmente in n8n UI dopo un eventuale import. L'**import** stesso resta un'azione runtime/UI e richiede sempre un Decision Packet esplicito (es. D-0206-A).

**Documenti correlati:** `docs/AI_RULES.md` (regola implementatore), `docs/WORKFLOW.md` (nota workflow), `docs/automation/n8n-workflows/templates/` (template attivi).

## PRIORITÀ 0A — Avanzamento senza conferme inutili

**Regola globale del progetto.** Vale per ChatGPT orchestratore, implementatori (Windsurf/Cascade, Cursor, Claude Code, Agent), prompt generati da n8n, workflow documentale n8n / watcher / runner, politiche VPS/runner, documentazione di stato e ripartenza.

**Principio:** se non esiste una decisione reale o un gate sensibile, il sistema deve avanzare senza chiedere conferme all'utente.

**Vietate** quando il prossimo passo è già determinato:

- chiedere «vuoi?», «quando vuoi?», «va?», «procedo?», «andiamo avanti?», «autorizzi?», «vai?»
- chiedere formule di autorizzazione per task **docs-only** già determinati, già in roadmap o conseguenza diretta del task precedente
- trasformare in decisione ciò che è già deciso da roadmap, task in queue, prompt orchestratore o documento canonico
- chiedere conferme superflue all'inizio o alla fine di un task docs-only senza scelta reale

**L'orchestratore deve invece:**

- preparare direttamente il prompt operativo o il micro-step successivo;
- procedere con commit/push e successivo `aggio` o auto-aggio per verifica;
- interpellare l'utente **solo** se serve una scelta reale o un gate sensibile.

**Gate sensibili che richiedono sempre conferma esplicita:**

- runtime
- VPS runtime
- n8n runtime
- modifiche app Alina
- deploy Apps Script
- tag
- rollback
- API key
- login
- GitHub Actions
- costi ricorrenti nuovi
- runner automatico
- dati personali, credenziali, segreti, OAuth material
- test fisico reale (Alina su telefono)

**Convivenza con modalità passo-passo (PRIORITÀ 0):**

- La modalità passo-passo resta **obbligatoria** quando l'utente sta operando manualmente su n8n, VPS, browser, terminale, Apps Script, clasp o interfacce visive.
- «Passo-passo» significa: dare **un solo passo** e attendere l'esito quando c'è azione manuale reale. **Non** significa chiedere conferme inutili tra passi già determinati.
- Per task **docs-only** determinati (senza azione manuale dell'utente in corso), l'assenza di scelta equivale a **consenso operativo a proseguire**.

**Equilibrio:**

- Decisione reale o gate sensibile → fermarsi, presentare opzioni o Decision Packet
- Task docs-only determinato + nessun gate sensibile + utente non sta operando manualmente → procedere
- Utente sta operando manualmente (n8n, browser, terminale, ecc.) → un solo passo, attendere esito

Questa regola **non è contraddetta** dalle sezioni successive. Se una frase in altre sezioni sembra richiedere gate manuale per ogni docs-only senza scelta, **prevalere su PRIORITÀ 0A** e interpretare nel senso non-bloccante.

**Criterio operativo:** chiedere conferme inutili è **errore operativo**. Il tempo dell'utente è prezioso.

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
- se il passo è “incolla questo in Cursor”, il blocco da incollare deve essere completo e autosufficiente **per Cursor**; fuori dal blocco può comparire solo: riga MODALITÀ, decisione reale o gate reale non eseguibile dall’implementatore — vedi **Regola output prompt Cursor**;
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
- Se una procedura non e ancora documentata in `docs/COMMANDS.md`, `docs/WORKFLOW.md` o `docs/AI_RULES.md`, l'orchestratore deve inserirla direttamente nel prompt implementatore, in un unico blocco. Non deve lasciarla fuori dal blocco come istruzioni separate per l'utente, **salvo** decisioni reali o gate reali non eseguibili dall'implementatore — vedi **Regola output prompt Cursor**.

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

## Regola `aggio` — comando volontario/fallback

`aggio` è un comando **volontario** dell’utente per chiedere all’orchestratore di rileggere GitHub e fare il punto. Non è una routine imposta.

- L’orchestratore **non** deve chiedere all’utente di scrivere `aggio` come passo standard dopo ogni prompt implementatore.
- `aggio` è utile come **fallback** quando l’utente vuole verifica esplicita dello stato, quando c’è ambiguità, o quando il ciclo precedente non è chiaro.
- Se GitHub è aggiornato dall’implementatore (commit + push), l’orchestratore può **leggere GitHub direttamente** senza aspettare un `aggio` manuale — questo è il livello immediato dell’Auto-Aggio (`docs/automation/auto-aggio-design.md`).
- L’orchestratore **non** blocca la preparazione di un nuovo prompt solo perché manca un `aggio`, se può verificare GitHub autonomamente.

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

Ogni prompt operativo per Cursor deve essere autosufficiente **per Cursor** nel blocco da incollare: tutto ciò che Cursor deve fare e che non è già documentato nel repo deve stare in quel blocco.

## Regola lunghezza prompt per implementatore

La lunghezza e il livello di dettaglio del prompt dipende dall’implementatore destinatario.

| Implementatore | Stile prompt | Motivo |
|----------------|-------------|--------|
| **Claude Code** | Breve | Legge GitHub in autonomia; prompt lunghi sprecano contesto e token di sessione |
| **Cursor** | Completo / autosufficiente | Il blocco deve contenere tutto il contesto operativo necessario |
| **Windsurf / Cascade** | Completo / autosufficiente | Come Cursor; non accorciare |

### Claude Code

Se il task esiste già in `docs/tasks/queue/`, usare prompt minimo:

```text
Esegui il task docs/tasks/queue/<task>.md.
Applica CLAUDE.md, docs/ORCHESTRATOR_RULES.md, docs/AI_RULES.md, docs/WORKFLOW.md e docs/COMMANDS.md.
Chiudi secondo workflow con commit selettivo e push.
```

Se il task non esiste ancora: creare il task prima con prompt breve, poi far leggere i documenti già in repo.

Usare prompt più lungo con Claude Code **solo** quando i dati necessari non sono ancora su GitHub (es. output appena raccolto in chat, non ancora committato).

### Regola modello per Claude Code

- **Sonnet**: esecuzione operativa ordinaria, task piccoli, docs-only, chiusure documentali.
- **Opus**: solo per pianificazione complessa, analisi difficile o decisioni architetturali.

Non usare Opus per task che Sonnet può completare correttamente.

### Language policy

- **Internal agent language:** technical English (prompts, JSON/YAML fields, wiki agent-facing, classifier/planner, structured outputs).
- **Final user-facing language:** Italian (orchestrator summaries, Decision Packets, user output).
- **Goal:** token efficiency + technical precision for local 7B/8B models.
- **Canonical rule:** `docs/AI_RULES.md` — "Language policy for agents".

### Cursor / Windsurf / Cascade

Non accorciare i prompt per questi implementatori. Seguire la **Regola output prompt Cursor** qui sotto.

## Regola output verso implementatore

Quando l’output richiesto è un prompt per un implementatore (Cursor, Windsurf/Cascade, Claude Code, Agent):

1. Il blocco deve contenere **solo** istruzioni e contesto destinati all’implementatore: riferimenti `@…`, MODALITÀ, obiettivo, vincoli, procedura, output atteso, commit, push.
2. **Fuori dal blocco** può comparire **solo**:
   - riga **MODALITÀ** se non è già dentro il blocco;
   - **decisione reale** richiesta all’utente (scelta tra alternative);
   - **gate reale** non eseguibile dall’implementatore (VPS, deploy, tag, rollback, login, API key, test fisico, dati sensibili).
3. **Non** scrivere fuori dal blocco:
   - «Quando finisce scrivi: aggio» come routine;
   - riepiloghi di validazione;
   - elenchi di file da creare/aggiornare già nel blocco;
   - vincoli già nel blocco;
   - messaggi di commit già nel blocco;
   - ripetizioni o parafrasi del blocco.

Formato corretto quando non ci sono decisioni o gate:

```text
MODALITÀ: AGENT / IMPLEMENTAZIONE

[UNICO BLOCCO PROMPT IMPLEMENTATORE]
```

Tutto il **contesto operativo** necessario deve stare **dentro** il blocco, inclusi a titolo esemplificativo:

- validazioni da eseguire;
- file da creare o aggiornare;
- vincoli e procedura;
- messaggio di commit;
- risposta finale obbligatoria da riprodurre in chiusura.

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
- non fornirli come blocco separato **fuori** dal blocco implementatore — vedi **Regola output verso implementatore**;
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

- **Workstream corrente obbligatorio:** automazione watcher/runner. Non proporre ritorno all'app Alina finché watcher/runner non è chiuso o finché l'utente non chiede esplicitamente di tornare all'app. App Alina **V1.9.2** resta stabile e non toccata.
- Lavorare su **`main`** (branch operativo unico). **`dev`** è **legacy/inattivo**: non usarlo per nuovi sviluppi; non prescrivere merge `dev` → `main` nel flusso normale.
- Dopo release o micro-release importante, usare **tag stabile** su `main` e, se serve rollback, riferirsi al **tag precedente** (es. `v1.8.3-stable` rispetto a `v1.8.4-stable`).
- Deploy Apps Script solo con conferma esplicita (o coerente con `docs/STREAMLINED_WORKFLOW.md` se il blocco lo include).
- Non modificare `gas-current/`.
- Non usare `git add .`.
- Non cambiare struttura Google Sheet salvo richiesta esplicita.
- Non introdurre librerie esterne o service worker senza approvazione.
- Preferire blocchi piccoli, testabili e committabili.

## Criterio decisionale permanente — Micro-interazioni umane eliminate

Per il workstream watcher/runner e low-touch loop, ogni nuova proposta deve valutare la riduzione delle micro-interazioni dell'utente.

**Criterio permanente:** "Quante micro-interazioni umane elimina?"

Questo criterio si applica a:
- Nuove architetture di automazione
- Nuovi formati decisionali (es. Decision Packet)
- Nuovi processi di coordinamento orchestratore/implementatore
- Proposte di riduzione di passaggi meccanici (copiare/incollare prompt, avviare implementatori, scrivere "aggio", tradurre tra orchestratore e implementatore)

Il campo `kind` del futuro Decision Packet (`alina-feature` / `automation` / `infra` / `meta`) è un indicatore strutturale di equilibrio roadmap, non una domanda all'utente.

## Regola lifecycle — Aggiornamento documenti di stato

Alla creazione di un task in `docs/tasks/queue/`:

- Aggiornare solo:
  - Il file task in `docs/tasks/queue/`
  - La sessione di creazione in `docs/sessions/`
- NON aggiornare `docs/PROJECT_STATE.md` né `docs/CHECKPOINT.md` alla sola creazione del task
- Aggiornare `docs/PROJECT_STATE.md` e `docs/CHECKPOINT.md` solo al completamento del task, cioè quando viene creato il relativo done marker in `docs/tasks/done/`
- Eccezione: se la creazione del task introduce una regola strategica permanente, `docs/ORCHESTRATOR_RULES.md` può essere aggiornato subito
- Anche in quell'eccezione, `PROJECT_STATE.md` e `CHECKPOINT.md` restano fermi fino al completamento

Questa regola riduce micro-interazioni e mantiene coerenza: PROJECT_STATE riflette stato reale dei task completati, non delle intenzioni.

## Stato stabile corrente (sintesi — dettaglio in `docs/PROJECT_STATE.md`)

- Produzione Git/Apps Script: **V1.9.2** su **`main`**; tag stabile **`v1.9.2-stable`**; deploy clasp **`@24`** (ID `AKfycbyIkaQqS-Dce0tfdxyfjdnEEE_xSb3Ys3KdeGL9xiX652QfgfAFRRBSvmuLXdPqQhaXSg`; deploy Windows: **Git Bash** + `npx clasp` se `npm run sync` fallisce — vedi `docs/sessions/2026-05-10-v192-month-detail-visual-refresh-deploy.md`); **Dettaglio mese** più **visivo** (metriche in alto, card giorno, barre ore proporzionali); **Stipendio** nascosto sul **mese corrente** in lista **Mesi** (**V1.9.1**); **Dettaglio** sempre; eredità **V1.9.0** (**Dettaglio mese** **`monthDetail`**), V1.8.10 (snooze promemoria stipendio), V1.8.9 (toggle anni **Mesi**), issue **#5**, V1.8B.
- Issue **#5** **in produzione**; **test manuale utente su `/exec` @24:** **OK** (2026-05-10 — Dettaglio mese visivo, smoke; **Redmi 9C NFC** incluso). **V1.9.1** su **`/exec` @23:** **OK** (2026-05-10). Banner GAS: **limitazione piattaforma** — `docs/sessions/2026-05-10-v190-month-detail-mvp-deploy.md`.
- Tag utili per rollback: **`v1.9.1-stable`** (deploy **`@23`**), **`v1.9.0-stable`** (deploy **`@22`**), **`v1.8.10-stable`** (deploy **`@21`**), **`v1.8.9-stable`** (deploy **`@20`**), **`v1.8.8-stable`** (deploy **`@19`** — bug toggle anni), **`v1.8.7-stable`** (deploy **`@18`**), **`v1.8.6-stable`** (deploy **`@17`**), **`v1.8.5-stable`** (deploy **`@15`**), **`v1.8.4-stable`** (deploy **`@14`**), **`v1.8.3-stable`** (deploy **`@12`**), **`v1.8.2-stable`** (deploy **`@10`**), **`v1.8.1-stable`**, **`v1.8.0-stable`**, **`v1.6.2-stable`**, **`v1.5-stable`** (storico).
- Branch **`dev`:** **legacy/inattivo**, non operativo.
