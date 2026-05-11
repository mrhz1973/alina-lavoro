# n8n Workflow Design — Done / Failed Task Handling

## Ownership canonica

**Aggiornamento (2026-05-11):** per la definizione di **chi possiede le transizioni** done/failed, i due pattern validi (`## Done status` e `## Done copy-only outcome`), le regole di coesistenza e la politica retry, il documento **canonico** è:

**[`lifecycle-ownership.md`](./lifecycle-ownership.md)**

Note operative da `lifecycle-ownership.md`:
- **`## Done status`** (Claude Code runner manuale) e **`## Done copy-only outcome`** (n8n workflow) sono **entrambi pattern validi**: non vanno retro-normalizzati.
- I file già scritti in `docs/tasks/done/` non vanno modificati retroattivamente.
- **Failed** resta design non validato: nessun file scritto in `docs/tasks/failed/` finché il pattern non è validato manualmente.

## Stato

**Design documentale** — non implementato nel workflow n8n reale (`TEST - GitHub list Alina task queue`) finché non viene adottato esplicitamente. Non modifica codice applicativo né `gas-current/`. **Failed handling non validato (2026-05-11):** nessun file in `docs/tasks/failed/` ancora creato; design documentato qui e in `lifecycle-ownership.md`.

## Scopo

Definire una **strategia prudente e ripetibile** per **archiviare o chiudere** i task file-based spostando (o copiando) contenuto da `docs/tasks/queue/` verso **`docs/tasks/done/`** o **`docs/tasks/failed/`**, mantenendo **tracciabilità** e riducendo il rischio di **perdita dati**. Questo documento integra `task-lifecycle.md` con dettaglio operativo orientato a futuri nodi n8n e commit GitHub.

## Baseline attuale (queue reader validato)

Il workflow **`TEST - GitHub list Alina task queue`** oggi, in sintesi:

- Elenca **`docs/tasks/queue`** e **`docs/tasks/processing`**.
- **Salta** i task per cui esiste già `docs/tasks/processing/{task}-cursor-prompt.md` (anti-doppio-run, Opzione A).
- Seleziona il **primo** task in coda ancora **senza** quel prompt; genera/aggiorna **prompt** e **sessione** (`docs/sessions/automation-{task}.md`).
- **Non esegue** Cursor automaticamente.
- **Non** applica transizioni reali verso **`done`** o **`failed`**; i file task **restano** in `queue` anche dopo la generazione del prompt.

La validazione con task `0002` è documentata in `docs/sessions/2026-05-11-n8n-queue-reader-0002-validation.md`.

**Done copy-only (task 0003, workflow manuale separato):** copia in `docs/tasks/done` + aggiornamento sessione, **senza** delete da `queue` — [`done-copy-only.md`](./done-copy-only.md); sessione [`2026-05-11-n8n-done-copy-only-0003-validation.md`](../sessions/2026-05-11-n8n-done-copy-only-0003-validation.md). **Generalizzazione done copy-only (design):** [`done-copy-only-generalization.md`](./done-copy-only-generalization.md).

## Principio principale

**Non cancellare** mai il file task in `queue` prima che la **destinazione** (`done` o `failed`) sia stata **creata** (o aggiornata in modo idempotente) e **verificata** (contenuto leggibile, commit riuscito, SHA coerente dove serve).

## Strategia `done`

Un task può essere considerato candidato a **`docs/tasks/done/{task}.md`** solo quando, **cumulativamente** (definizione da stringere al momento dell’implementazione):

- Il **prompt** è stato generato (o non richiesto per task puramente documentali con policy esplicita).
- **Cursor** o un **runner manuale** ha completato il lavoro previsto dal task, **oppure** il task è stato esplicitamente chiuso come “documentale completato” con criteri scritti nel task stesso.
- La **sessione** è stata **aggiornata** con esito positivo, timestamp e riferimenti (path prompt, path sessione, note controlli).
- Eventuale **commit** / **hash** rilevante è registrato nella sessione o nel front matter del task archiviato.
- **Nessun errore aperto** noto (test falliti, gate manuale non superato, policy violation).

La transizione deve essere **intenzionale** (gate umano o nodo “decision” con input verificabile), non implicita solo perché il prompt esiste.

## Strategia `failed`

Un task va verso **`docs/tasks/failed/{task}.md`** (o equivalente documentato) quando si verifica almeno uno tra:

- Errore **n8n** (timeout, eccezione nodo).
- Errore **GitHub** (rate limit, branch protection, 409 conflitto).
- **Parsing** del task fallito (Markdown/metadata illeggibili).
- **Prompt non generabile** (vincoli non soddisfatti).
- **Cursor** o runner fallisce in modo non recuperabile nel tempo definito dal task.
- **Controlli** richiesti dal task non superati.
- **Violazione di policy** (deploy vietato, percorsi vietati, uso comandi vietati, ecc.).

Il file in `failed` deve contenere o richiamare un **`failure_reason`** leggibile e collegabile alla sessione.

## Sequenza sicura: create → verify → delete (o policy senza delete)

### Per `done`

1. **Creare** (o aggiornare se idempotente) `docs/tasks/done/{task}.md` con contenuto completo o con riferimento al task originale + metadata di chiusura.
2. **Verificare** con GET file (GitHub) che il contenuto atteso sia presente (dimensione, SHA se disponibile).
3. **Aggiornare** opzionalmente la sessione con path `done`, timestamp `completed_at`, esito.
4. **Solo dopo** verifica positiva: secondo **policy** scelta, **eliminare** il file da `queue` **oppure** lasciarlo con **marker** (front matter `status: done_archived`, sezione in coda) che impedisce al filtro di riselezionarlo.

### Per `failed`

1. **Creare** `docs/tasks/failed/{task}.md` includendo **`failure_reason`** (testo strutturato), riferimento al task in queue, timestamp.
2. **Verificare** la persistenza del file come sopra.
3. **Aggiornare** la sessione con esito `failed`, path file failed, motivazione.
4. **Solo dopo** verifica: **delete** da `queue` oppure **marker** `status: failed` / duplicato controllato, secondo policy.

In entrambi i casi: **nessun delete** sulla sorgente prima della conferma della destinazione.

## Variante prudente senza delete (fase 1)

Per la **prima fase** operativa si raccomanda:

- **Non cancellare** nulla da `queue`.
- Aggiungere **marker** nel task in `queue` (front matter o sezione “Stato chiusura”) **oppure** aggiornare **solo** la sessione con `outcome: done` / `failed` e path della copia in `done`/`failed`.
- Il filtro del queue reader (o un workflow separato “closure”) deve **escludere** dalla selezione i task già marcati chiusi, analogamente allo skip sul prompt.

Questo massimizza **recuperabilità** e riduce il rischio di perdita per errori GitHub intermedi.

## Metadata consigliati

Da propagare nel file `done`/`failed`, nella sessione e opzionalmente nel task in `queue`:

| Campo | Uso indicativo |
|--------|----------------|
| `status` | `done`, `failed`, `queued`, `processing`, ecc. |
| `picked_at` | Presa in carico / generazione prompt. |
| `processed_at` | Inizio o completamento lavoro agente. |
| `completed_at` | Chiusura positiva. |
| `failed_at` | Chiusura negativa. |
| `failure_reason` | Dettaglio errore o gate non superato. |
| `cursor_prompt_path` | Path del prompt in `processing`. |
| `session_path` | Path sessione in `docs/sessions/`. |
| `commit_hash` | Ultimo commit rilevante, se disponibile. |
| `workflow_run_id` | Identificativo esecuzione n8n, se disponibile nell’API (mai segreti). |

## Opzioni implementative

| ID | Descrizione | Note |
|----|----------------|------|
| **A** | **Move reale** `queue → done/failed` con **delete** finale da `queue` dopo verifica. | Massima pulizia directory; richiede disciplina su create/verify/delete e gestione conflitti. |
| **B** | **Copy-only** verso `done`/`failed`, **queue intatta** con marker o doppione controllato. | Più sicuro in fase iniziale; richiede regole di **esclusione** in lettura queue. |
| **C** | Solo **metadata / front matter** sul task in `queue` senza move file. | Minimo attrito GitHub; rischio di ambiguità se il marker non è letto ovunque. |
| **D** | Rafforzare **`processing/`** come stato intermedio (es. copia task o manifest). | Utile per audit; più file da mantenere coerenti. |

## Raccomandazione (progetto Alina Lavoro, ora)

**Iniziare con Opzione B (copy-only)** **oppure** **C (metadata)** — eventualmente **combinati**: copia in `done` con contenuto + aggiornamento sessione + marker in `queue` che esclude il task dalla selezione, **senza delete** da `queue` nella prima release del flusso di chiusura.

Solo dopo periodo di osservazione e procedure chiare, valutare **A** con delete esplicito e commit dedicati.

## Nodi n8n futuri (solo elenco design)

- **Decide task outcome** — input: stato sessione, esito Cursor, checklist; output: `done` | `failed` | `defer`.
- **Build done task content** — assembla Markdown per `docs/tasks/done/{task}.md`.
- **Build failed task content** — assembla Markdown con `failure_reason`.
- **Check done/failed file exists** — ramifica update vs create.
- **Create/update done file** / **Create/update failed file** — nodi GitHub, credential in n8n.
- **Verify destination file** — GET e confronto minimo (presenza, size).
- **Optional delete queue task** — **disabilitato inizialmente** o assente in fase 1; se abilitato, solo dopo verify OK.
- **Append outcome to session** — merge su `docs/sessions/automation-{task}.md`.

## Rischi

| Rischio | Impatto |
|---------|---------|
| **Perdita task** | Delete anticipato o commit fallito non gestito. |
| **Doppio stato** | Stesso task percepito come in `queue` e in `done`. |
| **Errori GitHub 409** | Conflitto su branch o SHA obsoleto. |
| **Due workflow concorrenti** | Doppia chiusura o race su stesso `{task}`. |
| **Done senza lavoro reale** | Chiusura automatica errata. |
| **Cancellazione prematura** | Irreversibilità prima dell’archivio verificato. |

## Mitigazioni

- **Delete disabilitato** nella prima fase operativa.
- Esecuzione **manuale** o con conferma finché la logica non è matura.
- **Un solo** workflow attivo per repo (o serializzazione).
- **Sessione sempre aggiornata** con outcome esplicito.
- **Nessun** deploy/tag automatico dal flusso di chiusura.
- Messaggi di **commit** chiari (`automation: complete queued task`, `automation: mark queued task failed`, ecc., come già in `task-lifecycle.md`).

## Prossimo micro-step consigliato

Il task **`0003`** in `docs/tasks/queue/` è stato usato per validare il queue reader (prompt + sessione); esito in [`docs/sessions/2026-05-11-n8n-queue-reader-0003-validation.md`](../../sessions/2026-05-11-n8n-queue-reader-0003-validation.md). **Prossimo passo:** implementare in n8n (o workflow dedicato) la **prima fase copy-only** verso `docs/tasks/done/0003-test-n8n-done-copy-only.md` e aggiornamento sessione con esito `done`, **senza** delete da `queue`, come da sezioni precedenti di questo documento.

---

*Documenti correlati: [`task-lifecycle.md`](./task-lifecycle.md), [`queue-reader.md`](./queue-reader.md), [`docs/sessions/2026-05-11-n8n-queue-reader-0002-validation.md`](../../sessions/2026-05-11-n8n-queue-reader-0002-validation.md), [`docs/sessions/2026-05-11-n8n-queue-reader-0003-validation.md`](../../sessions/2026-05-11-n8n-queue-reader-0003-validation.md).*
