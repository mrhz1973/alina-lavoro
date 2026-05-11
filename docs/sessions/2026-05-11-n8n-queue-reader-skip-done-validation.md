# Sessione — n8n queue reader skip `done` (validazione manuale)

## Data

2026-05-11

## Obiettivo

Registrare su GitHub che il workflow n8n reale **`TEST - GitHub list Alina task queue`** ha **implementato** e superato una **validazione manuale** in interfaccia n8n per lo **skip** dei task in `docs/tasks/queue/` quando esiste già il prompt in **`docs/tasks/processing/`** oppure il file omonimo in **`docs/tasks/done/`**.

## Workflow modificato

**`TEST - GitHub list Alina task queue`**

## Workflow non toccato

**`TEST - Mark Alina task done copy-only generalized`** (nessuna modifica durante questo lavoro).

## Modifica effettuata

- Aggiunto nodo n8n **`List done files`** con lettura directory **`docs/tasks/done`**.
- **`Execute Once`** su **`List done files`** (necessario perché senza questa opzione il nodo emetteva molteplici item ripetuti a valle).
- Aggiornato il nodo **Code** **`Filter first queued task`** per leggere le tre liste (`$('List files')`, `$('List processing files')`, `$('List done files')`) e applicare lo skip combinato.

## Problema risolto

Senza **`Execute Once`**, **`List done files`** produceva circa **60** item duplicati; dopo la correzione l’output è **3** item, coerenti con il contenuto reale della directory: **`.gitkeep`**, **`0003-test-n8n-done-copy-only.md`**, **`0004-test-n8n-done-copy-only-generalized.md`**.

## Diagnostica temporanea

Il nodo **`Filter first queued task`** è stato **prima** provato con codice **diagnostico temporaneo**; quel codice è stato **rimosso** prima della chiusura. Il nodo è ora in **versione finale pulita** nell’istanza n8n.

## Codice finale pulito (confermato)

> **Nota:** riferimento per il nodo **Code** in n8n; **non** è file sorgente dell’app Alina nel repository.

I nomi tra `$('…')` devono coincidere con i **nomi dei nodi** nel workflow n8n (`List files`, `List processing files`, `List done files`).

```javascript
const queuedFiles = $('List files').all().map(item => item.json);
const processingFiles = $('List processing files').all().map(item => item.json);
const doneFiles = $('List done files').all().map(item => item.json);

const processingNames = new Set(
  processingFiles
    .map(file => String(file.name || ''))
    .filter(name => name.endsWith('-cursor-prompt.md'))
    .map(name => name.replace(/-cursor-prompt\.md$/i, '.md'))
);

const doneNames = new Set(
  doneFiles
    .map(file => String(file.name || ''))
    .filter(name => name.endsWith('.md') && name !== '.gitkeep')
);

const tasks = queuedFiles
  .filter(file => {
    const name = String(file.name || '');
    const path = String(file.path || '');

    if (!name.endsWith('.md')) return false;
    if (path.indexOf('docs/tasks/queue/') !== 0) return false;

    if (processingNames.has(name)) return false;
    if (doneNames.has(name)) return false;

    return true;
  })
  .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));

if (!tasks.length) {
  return [
    {
      json: {
        has_task: false,
        message: 'No queued task found or all queued tasks already have processing prompts or done files'
      }
    }
  ];
}

const task = tasks[0];

return [
  {
    json: {
      has_task: true,
      task_name: task.name,
      task_path: task.path,
      task_sha: task.sha || '',
      task_size: task.size || 0,
      skip_reason: ''
    }
  }
];
```

## Esito finale del test (workflow completo)

- **`has_task: false`**
- **`message: No queued task found or all queued tasks already have processing prompts or done files`**

La validazione dimostra che il workflow reale **salta** i task in **`docs/tasks/queue/`** già presenti in **`processing`** o in **`done`**, coerentemente con la logica documentata.

## Aggiornamento incrementale — `Execute Once` su `List processing files`

- **Nodo modificato:** **`List processing files`** — abilitato **`Execute Once`** (come già per **`List done files`**) per evitare la moltiplicazione inutile degli item quando a monte ci sono più trigger/item.
- **Output osservato dopo modifica:** **4** voci pulite:
  - `0001-test-n8n-task-cursor-prompt.md`
  - `0002-test-n8n-processing-skip-cursor-prompt.md`
  - `0003-test-n8n-done-copy-only-cursor-prompt.md`
  - `0004-test-n8n-done-copy-only-generalized-cursor-prompt.md`
- **Test workflow completo:** **`has_task: false`**, **`message: No queued task found or all queued tasks already have processing prompts or done files`** — **nessuna regressione** osservata rispetto allo scenario precedente.
- **Non** sono stati aggiunti **export JSON** al repository; **non** sono stati toccati workflow **non target** (es. **`TEST - Mark Alina task done copy-only generalized`**).
- **Sicurezza:** **non** documentare né condividere **URL raw GitHub** con **token temporanei** in query string.

## Validazione ramo `true` con task 0005 (2026-05-11)

- **Workflow testato:** **`TEST - GitHub list Alina task queue`**.
- **Workflow non toccati:** **`TEST - Mark Alina task done copy-only generalized`** e altri workflow n8n.
- **Task in coda (presente prima del test):** `docs/tasks/queue/0005-test-n8n-queue-reader-true-branch.md`.

### Primo run (filtro → build prompt → file su GitHub)

Output osservato in n8n dopo **Filter first queued task** e a valle:

- **`has_task: true`**
- **`task_name`:** `0005-test-n8n-queue-reader-true-branch.md`
- **`task_path`:** `docs/tasks/queue/0005-test-n8n-queue-reader-true-branch.md`
- **`task_sha`:** `2aa15d6e98a3c0b1f35808dc9de6dc5b68bb2b10`
- **`task_size`:** `1168`

**Nodo `Build Cursor prompt` (output osservato):**

- **`cursor_prompt_path`:** `docs/tasks/processing/0005-test-n8n-queue-reader-true-branch-cursor-prompt.md`
- **`session_path`:** `docs/sessions/automation-0005-test-n8n-queue-reader-true-branch.md`
- **`next_action`:** `create_cursor_prompt_file`

**Nodo `Create Cursor prompt file`:**

- File creato: `docs/tasks/processing/0005-test-n8n-queue-reader-true-branch-cursor-prompt.md`
- **SHA file (GitHub / output n8n):** `e0bd5a8debb7bb9a9651131dc6995a6e26b07336`
- **Commit:** `8d579a8cb4669199170e9479d6f144b512909c8e`
- **Messaggio commit:** `docs: create cursor prompt from queued task`

**Nodo `Create session file`:**

- File creato: `docs/sessions/automation-0005-test-n8n-queue-reader-true-branch.md`
- **SHA file:** `fec2ecbf8973fd85830f8cce94d42fbb167d40a1`
- **Commit:** `05e1292dcd8924d1c1146ed9ae7a4e3d33b5de6a`
- **Messaggio commit:** `docs: create automation session from queued task`

### Secondo run (skip via `processing`)

- **`has_task: false`**
- **`message`:** `No queued task found or all queued tasks already have processing prompts or done files`

### Interpretazione

Il ramo **`has_task: true`** è stato verificato almeno fino a: filtro di eleggibilità → **Build Cursor prompt** → **Create Cursor prompt file** → **Create session file** (commit su **`main`**). Il secondo run conferma che **0005** non viene più rieletto perché il relativo prompt esiste in **`docs/tasks/processing/`**. **Nessuna delete** da `docs/tasks/queue/`.

### Nota sicurezza (questa validazione)

**Non** documentare né copiare **URL raw GitHub** con `token=...`. **Non** committare export JSON n8n, credenziali, webhook o header sensibili.

## Validazione primo task reale docs-only 0100 (2026-05-11)

- **Workflow testato:** **`TEST - GitHub list Alina task queue`**.
- **Task in coda:** `docs/tasks/queue/0100-cursor-prompt-template-in-repo.md` (file in **`queue`** lasciato intatto per tutto il ciclo; **nessuna delete** da `queue`).

### Primo run (selezione 0100)

Output osservato dopo **Filter first queued task**:

- **`has_task: true`**
- **`task_name`:** `0100-cursor-prompt-template-in-repo.md`
- **`task_path`:** `docs/tasks/queue/0100-cursor-prompt-template-in-repo.md`
- **`task_sha`:** `b7a221e025659457e97059df84c25ef6167d7276`
- **`task_size`:** `2600`

### Edge case metadata (tabella Markdown)

Il task **0100** usava inizialmente metadata in **tabella** Markdown (`## Metadata` con pipe `|`). Il parser del nodo **Classify task** in n8n interpreta correttamente il **formato lista** usato dai task precedenti (`- Project: …`, `- Type: …`, ecc.), non la tabella.

Effetto osservato sul **primo** prompt generato: campi vuoti nel testo del prompt, ad esempio:

- `Project:` (vuoto)
- `Type:` (vuoto)
- `Priority:` (vuoto)
- `Deploy policy:` (vuoto)

**Nessuna modifica al workflow n8n** per risolvere: il file in **`queue`** è stato normalizzato al formato lista (`Project: Alina Lavoro`, `Type: docs-only`, `Priority: normal`, `Status: queued`, `Deploy: no` — commit di normalizzazione documentato in cronologia Git **`d8dab29`**).

### Rimozione prompt errato in `processing`

Il file `docs/tasks/processing/0100-cursor-prompt-template-in-repo-cursor-prompt.md` generato con metadata vuoti **bloccava** la rigenerazione (skip **`processing`**). È stato rimosso con commit mirato **`3f4aa2dad14e9b9f454e1ed6a2ef0be1cdd9db6b`**, messaggio **`docs: remove stale generated prompt for task 0100`**.

### Rigenerazione corretta (dopo normalizzazione)

**Build Cursor prompt** (output osservato): `Project: Alina Lavoro`, `Type: docs-only`, `Priority: normal`, `Deploy policy: no`, **`cursor_prompt_path`:** `docs/tasks/processing/0100-cursor-prompt-template-in-repo-cursor-prompt.md`, **`session_path`:** `docs/sessions/automation-0100-cursor-prompt-template-in-repo.md`, **`next_action`:** `create_cursor_prompt_file`.

**Create Cursor prompt file:**

- Path: `docs/tasks/processing/0100-cursor-prompt-template-in-repo-cursor-prompt.md`
- **SHA file:** `7a89e587510616aef2afdf8a0e0c632f434b9002`
- **Commit:** `4f09513bf5faf4d04798dd3dccb70f49c5d0d026`
- **Messaggio:** `docs: create cursor prompt from queued task`

**Update session file** (sessione automation **già esistente**, aggiornata al run successivo):

- Path: `docs/sessions/automation-0100-cursor-prompt-template-in-repo.md`
- **SHA file:** `085b363a8f192382b28fd4ac48f5b98df09da6fa`
- **Commit:** `b7ba5557b7217818cb619e48fbca4b6dbe3d122d`

### Secondo run dopo rigenerazione corretta

- **`has_task: false`**
- **`message`:** `No queued task found or all queued tasks already have processing prompts or done files`

### Interpretazione

Il **primo task reale docs-only** è passato attraverso il queue reader; l’edge case è stato individuato e risolto **solo** con correzione del Markdown in **`queue`** + cancellazione mirata in **`processing`** (senza toccare n8n); prompt e sessione risultano coerenti; il secondo run conferma lo skip via **`processing`**. **Nessuna delete** da `docs/tasks/queue/`.

### Nota sicurezza (validazione 0100)

**Non** documentare né copiare URL raw GitHub con `token=...`. **Non** aggiungere export JSON n8n al repository.

## Cosa NON è stato fatto

- **Nessun** export JSON n8n committato nel repository.
- **Nessuna** modifica al codice app (`src/`, `Index.html`, `Code.gs`, ecc.).
- **Nessun** deploy Apps Script, **nessun** tag, **nessun** rollback.
- **Nessuna** delete da `docs/tasks/queue/` (il skip non rimuove file in coda).

## Rischi residui

- **Export JSON** del workflow da **redigere** (credenziali, URL interni, **mai** URL raw con token in chiaro) prima di ogni eventuale commit o condivisione — resta il rischio principale se si versiona l’export.
- **Metadata in coda:** finché il nodo **Classify task** non viene esteso per leggere tabelle Markdown in **`## Metadata`**, i task devono usare il **formato lista** (`- Project: …`, `- Type: …`, ecc.); altrimenti il prompt Cursor può contenere **campi vuoti** (scenario reale **0100**, 2026-05-11).

## File documentazione toccati da questo aggiornamento incrementale

- `docs/automation/n8n-workflows/queue-reader.md`
- `docs/automation/n8n-workflows/queue-reader-ai-friendly-template.md`
- `docs/PROJECT_STATE.md`
- `docs/CHECKPOINT.md`
- `docs/sessions/2026-05-11-n8n-queue-reader-skip-done-validation.md` (questo file)

## Prossimo passo suggerito

Se serve tracciabilità del grafo n8n nel repo: preparare un **export JSON redatto** (o solo aggiornamenti testuali in `queue-reader.md` / template) senza segreti. In parallelo, evoluzioni **watcher** / runner — `docs/automation/runbook.md`.

## Riferimenti incrociati

- Design precedente: [`2026-05-11-n8n-queue-reader-skip-done-design.md`](./2026-05-11-n8n-queue-reader-skip-done-design.md)
- Disciplina operativa: [`2026-05-11-operational-step-by-step-hard-rule.md`](./2026-05-11-operational-step-by-step-hard-rule.md)
- [`docs/automation/n8n-workflows/queue-reader.md`](../automation/n8n-workflows/queue-reader.md)
