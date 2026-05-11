# n8n Workflow Template — Queue Reader AI-Friendly

## Scopo di questo documento

Questo file è una **specifica AI-friendly** e **redatta** per ricostruire in n8n il comportamento del workflow **`TEST - GitHub list Alina task queue`** senza pubblicare **export JSON** contenenti segreti. Serve a orchestratori LLM, maintainer e futuri runner che devono clonare la logica su un’altra istanza n8n.

Non è un export workflow eseguibile: è una **mappa concettuale + pseudo-code** dei nodi **Code** e delle policy GitHub.

## Stato

Deriva dal workflow **già testato** in repository:

- **`TEST - GitHub list Alina task queue`**

Comportamento documentato di riferimento (allineato a `docs/automation/n8n-workflows/queue-reader.md`):

- Test completo OK; workflow **ri-eseguibile**.
- Lettura **queue** + **processing** + **`done`**; primo `.md` in coda **senza** prompt in `processing` **né** file omonimo in `done`; decode; classify — **implementato e validato in n8n** (2026-05-11), vedi [`docs/sessions/2026-05-11-n8n-queue-reader-skip-done-validation.md`](../../sessions/2026-05-11-n8n-queue-reader-skip-done-validation.md).
- **List done files:** usare **`Execute Once`** in n8n se necessario per evitare item duplicati dalla moltiplicazione a monte.
- Generazione prompt Cursor; **create/update** sotto `<PROCESSING_PATH>`.
- **Create/update** sessione automation sotto `<SESSIONS_PATH>`.
- **Cursor non** è eseguito automaticamente dal workflow.
- Nessuna modifica al codice app, nessun deploy, nessun tag, nessun tocco a `gas-current/`.
- Modifiche al workflow reale in n8n: disciplina **passo passo** e **`n8n manual run discipline`** — [`docs/automation/README.md`](../../automation/README.md), sessione [`docs/sessions/2026-05-11-operational-step-by-step-hard-rule.md`](../../sessions/2026-05-11-operational-step-by-step-hard-rule.md).
- **Nessuna delete** da `<QUEUE_PATH>`.

## Avvertenza sicurezza

- Questo documento **non** contiene credenziali, token, webhook privati, host VPS o ID di credential n8n.
- Gli **export JSON** reali del workflow vanno **ispezionati e redatti** prima di ogni commit (rimuovere riferimenti a credenziali, URL interni, header custom con segreti).
- Le **credential GitHub** devono restare configurate **solo in n8n**; in Git va solo questa specifica o export già redatto.

## Variabili e placeholder

Usare costanti o *Set* node in n8n; in documentazione sostituire con i valori reali solo in ambiente operativo, non nel repo se non pubblici.

| Nome | Valore di esempio (Alina Lavoro) | Note |
|--------|----------------------------------|------|
| `OWNER` | `mrhz1973` | Placeholder generico: `<OWNER>` |
| `REPO` | `alina-lavoro` | Placeholder: `<REPO>` |
| `BRANCH` | `main` | Placeholder: `<BRANCH>` |
| `QUEUE_PATH` | `docs/tasks/queue` | Path directory coda |
| `PROCESSING_PATH` | `docs/tasks/processing` | Path prompt Cursor generati |
| `DONE_PATH` | `docs/tasks/done` | Path file task archiviati in **done** (solo lettura per filtro skip) |
| `SESSIONS_PATH` | `docs/sessions` | Path sessioni automation |
| `TASK_FILE_PATTERN` | `*.md` | Solo markdown |
| `IGNORE_FILES` | `.gitkeep` | Esclusi dalla selezione |

Endpoint API GitHub (concettuale, senza token):

- Base repository contents: `GET /repos/<OWNER>/<REPO>/contents/{path}?ref=<BRANCH>`

Credenziale HTTP/GitHub in n8n: nome concettuale **`<GITHUB_CREDENTIAL_NAME>`** (solo placeholder).

## Struttura nodi (catena completa)

```text
Manual Trigger
→ List files                    (<QUEUE_PATH>)
→ List processing files         (<PROCESSING_PATH>)
→ List done files               (<DONE_PATH>)
→ Filter first queued task
→ IF has queued task
    ├→ true  → Get queued task file
    │          → Decode task markdown
    │          → Classify task
    │          → Build Cursor prompt
    │             ├→ Check Cursor prompt file exists
    │             │   ├→ Success → IF Cursor prompt file exists
    │             │   │   ├→ true  → Update Cursor prompt file
    │             │   │   └→ false → Create Cursor prompt file
    │             │   └→ Error → Create Cursor prompt file
    │             └→ Build session file
    │                 → Check session file exists
    │                     ├→ Success → IF session file exists
    │                     │   ├→ true  → Update session file
    │                     │   └→ false → Create session file
    │                     └→ Error → Create session file
    └→ false → No queued task / already processing   (Code: no_action; nessun write GitHub)
```

I tre nodi **List** alimentano il **Code** `Filter first queued task`, che in n8n legge gli output tramite **`$('List files').all()`**, **`$('List processing files').all()`**, **`$('List done files').all()`** (i nomi devono coincidere con i nodi). **List done files** va impostato con **`Execute Once`** se senza questa opzione la directory viene ripetuta per ogni item a monte (effetto: decine di duplicati).

---

## Nodi — specifica per nodo

### 1. Manual Trigger

| Campo | Valore |
|--------|--------|
| **Nome** | Manual Trigger |
| **Tipo n8n presumibile** | `Manual Trigger` |
| **Input atteso** | Nessuno |
| **Output atteso** | Items vuoti o payload minimo per avviare il flusso |
| **Note** | Trigger di test; in produzione si può sostituire con Schedule/Webhook (fuori scope questo workflow). |
| **Placeholder** | — |

### 2. List files (queue)

| Campo | Valore |
|--------|--------|
| **Nome** | List files |
| **Tipo n8n presumibile** | GitHub — *Get contents of a directory* / list files |
| **Input atteso** | Owner/repo/branch/path da placeholder |
| **Output atteso** | Lista entry (file/dir) sotto `<QUEUE_PATH>` |
| **Note** | Parametri: `<OWNER>`, `<REPO>`, `<BRANCH>`, path = `<QUEUE_PATH>`. Credential = `<GITHUB_CREDENTIAL_NAME>`. |
| **Placeholder** | `<OWNER>`, `<REPO>`, `<BRANCH>`, `<QUEUE_PATH>` |

### 3. List processing files

| Campo | Valore |
|--------|--------|
| **Nome** | List processing files |
| **Tipo n8n presumibile** | GitHub — list directory |
| **Input atteso** | Stessi owner/repo/branch |
| **Output atteso** | Lista entry sotto `<PROCESSING_PATH>` |
| **Note** | Serve per costruire l’insieme dei basename `{task}-cursor-prompt.md` presenti. |
| **Placeholder** | `<PROCESSING_PATH>` |

### 4. List done files

| Campo | Valore |
|--------|--------|
| **Nome** | List done files |
| **Tipo n8n presumibile** | GitHub — list directory |
| **Input atteso** | Stessi owner/repo/branch |
| **Output atteso** | Lista entry sotto `<DONE_PATH>` |
| **Note** | In produzione: **`Execute Once`** se senza questa opzione la lista `done` viene emessa ripetuta (molti item duplicati). **Contratto** con [`done-copy-only-generalization.md`](./done-copy-only-generalization.md). |
| **Placeholder** | `<DONE_PATH>` |

### 5. Filter first queued task

| Campo | Valore |
|--------|--------|
| **Nome** | Filter first queued task |
| **Tipo n8n presumibile** | Code |
| **Input atteso** | Output dei tre nodi **List**, letti nel Code con **`$('List files').all()`** / **`$('List processing files').all()`** / **`$('List done files').all()`** (nomi nodi allineati) |
| **Output atteso** | Un item con `has_task: true` e `task_name`, `task_path`, `task_sha`, `task_size`, `skip_reason`, oppure `has_task: false` e `message` testuale (nessun task eleggibile) |
| **Note** | Codice di riferimento validato in [`docs/sessions/2026-05-11-n8n-queue-reader-skip-done-validation.md`](../../sessions/2026-05-11-n8n-queue-reader-skip-done-validation.md) e in `queue-reader.md`. |
| **Placeholder** | `TASK_FILE_PATTERN`, `IGNORE_FILES`, `<PROCESSING_PATH>`, `<DONE_PATH>` |

### 6. IF has queued task

| Campo | Valore |
|--------|--------|
| **Nome** | IF has queued task |
| **Tipo n8n presumibile** | IF |
| **Input atteso** | Item da Filter (`has_task` / flag coerente) |
| **Output atteso** | Ramo `true` → catena Get/Decode/…; ramo `false` → Code terminatore **no_action** (nessun write GitHub) |
| **Note** | Allineato a `queue-reader.md`; in assenza di task il filtro espone `message` testuale; ramo `false` → Code **no_action** (nessun write GitHub). |
| **Placeholder** | — |

### 7. Get queued task file

| Campo | Valore |
|--------|--------|
| **Nome** | Get queued task file |
| **Tipo n8n presumibile** | GitHub — *Get a file* / file content |
| **Input atteso** | Path file dalla fase filter |
| **Output atteso** | Contenuto file (base64 o testo secondo API), `sha` per commit successivi |
| **Note** | Conservare `sha` per update futuri su altri nodi se necessario. |
| **Placeholder** | Stessi owner/repo/branch |

### 8. Decode task markdown

| Campo | Valore |
|--------|--------|
| **Nome** | Decode task markdown |
| **Tipo n8n presumibile** | Code |
| **Input atteso** | Raw markdown del task |
| **Output atteso** | Oggetto strutturato: sezioni, campi tabella metadata, corpo testo |
| **Note** | Parsing leggero (regex/split); coerente con il template task in `docs/tasks/templates/`. |
| **Placeholder** | — |

### 9. Classify task

| Campo | Valore |
|--------|--------|
| **Nome** | Classify task |
| **Tipo n8n presumibile** | Code |
| **Input atteso** | Output di Decode |
| **Output atteso** | `project`, `type`, `priority`, `status`, `deploy`, `objective`, ecc. |
| **Note** | Allinea chiavi a quanto già documentato in `queue-reader.md` (output strutturato). |
| **Placeholder** | — |

### 10. Build Cursor prompt

| Campo | Valore |
|--------|--------|
| **Nome** | Build Cursor prompt |
| **Tipo n8n presumibile** | Code |
| **Input atteso** | Task classificato + markdown originale |
| **Output atteso** | `content` (stringa prompt), `targetPath` sotto `<PROCESSING_PATH>`, nome file derivato dal task (es. `{basename}-cursor-prompt.md`) |
| **Note** | Vedi pseudo-code. |
| **Placeholder** | `<PROCESSING_PATH>` |

### 11. Check Cursor prompt file exists

| Campo | Valore |
|--------|--------|
| **Nome** | Check Cursor prompt file exists |
| **Tipo n8n presumibile** | GitHub — richiesta GET file (404 = non esiste) |
| **Input atteso** | `targetPath` |
| **Output atteso** | Success con `sha` oppure errore 404 |
| **Note** | Collegare **Success** all’IF; **Error** (404) al ramo Create. |
| **Placeholder** | — |

### 12. IF Cursor prompt file exists

| Campo | Valore |
|--------|--------|
| **Nome** | IF Cursor prompt file exists |
| **Tipo n8n presumibile** | IF |
| **Input atteso** | Flag o contenuto check |
| **Output atteso** | Ramo true / false |
| **Note** | true → Update; false → Create. |

### 13. Update Cursor prompt file / Create Cursor prompt file

| Campo | Valore |
|--------|--------|
| **Nome** | Update / Create file (prompt) |
| **Tipo n8n presumibile** | GitHub — create/update file API |
| **Input atteso** | Path, contenuto, `sha` obbligatorio per update |
| **Output atteso** | Commit risultato |
| **Note** | Policy in sezione dedicata. |

### 14. Build session file

| Campo | Valore |
|--------|--------|
| **Nome** | Build session file |
| **Tipo n8n presumibile** | Code |
| **Input atteso** | Metadata task + path prompt + stato “Cursor non eseguito” |
| **Output atteso** | `content`, `targetPath` sotto `<SESSIONS_PATH>` (es. `automation-{id}.md`) |
| **Note** | Vedi pseudo-code. |

### 15. Check session file exists → IF → Update / Create session file

| Campo | Valore |
|--------|--------|
| **Nome** | Stessa logica del prompt |
| **Tipo n8n presumibile** | GitHub GET + IF + create/update |
| **Input / Output** | Analoghi al blocco prompt |
| **Note** | Stessa **Create/update policy**. |

---

## Pseudo-code — nodi Code

### Filter first queued task

> **Nota:** codice di **riferimento** per il nodo n8n; **non** è sorgente versionata dell’app nel repo.

Riferimento allineato al workflow validato (nomi nodi **`List files`**, **`List processing files`**, **`List done files`**):

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

### Decode task markdown

```javascript
const raw = $input.first().json.content /* decodifica base64 se necessario */;

const lines = raw.split(/\r?\n/);
const sections = {};
var current = '_body';
sections[current] = [];

for (var i = 0; i < lines.length; i++) {
  var line = lines[i];
  if (/^##\s+/.test(line)) {
    current = line.replace(/^##\s+/, '').trim();
    sections[current] = [];
  } else {
    if (!sections[current]) sections[current] = [];
    sections[current].push(line);
  }
}

return [{ json: { raw: raw, sections: sections } }];
```

### Classify task

```javascript
const decoded = $input.first().json;
// Estrai campi da tabella Markdown o da convenzione progetto
return [{
  json: {
    project: 'Alina Lavoro',
    type: 'inferred',
    priority: 'normal',
    status: 'queued',
    deploy: 'no',
    objective: '…',
    sections: decoded.sections
  }
}];
```

### Build Cursor prompt

```javascript
const classified = $input.first().json;
var prompt = '';
prompt += '# Cursor prompt (generated)\n\n';
prompt += '## Objective\n' + (classified.objective || '') + '\n';
prompt += '## Context\n…\n';
prompt += '## Constraints\n…\n';

var baseName = classified.taskFileBase || 'task';
var targetPath = '<PROCESSING_PATH>/' + baseName + '-cursor-prompt.md';

return [{ json: { content: prompt, targetPath: targetPath, taskMeta: classified } }];
```

### Build session file

```javascript
const prev = $input.first().json;
var session = '';
session += '# Automation session\n\n';
session += '**Cursor executed:** no\n\n';
session += '**Prompt path:** ' + (prev.targetPath || '') + '\n';
session += '**Generated:** ' + new Date().toISOString() + '\n';

var sessionPath = '<SESSIONS_PATH>/automation-' + (prev.taskId || 'task') + '.md';

return [{ json: { content: session, targetPath: sessionPath } }];
```

*(Adattare i nomi proprietà `json` ai nodi precedenti reali del workflow.)*

---

## Create/update policy

1. **Read/check**: richiesta GET al path target su GitHub (`ref=<BRANCH>`).
2. **Se il file esiste**: si ottiene `sha` → **Update** con API “create or update” includendo `sha`.
3. **Se il file non esiste** (404): ramo **false** dell’IF oppure **Error** gestito → **Create** senza `sha`.
4. **Se il check fallisce** per assenza file (404), il ramo **Error → Create** garantisce creazione idempotente senza dipendere solo dall’IF.

Ordine consigliato: non sovrascrivere senza `sha` quando il file esiste (evita race); in caso di merge conflict su GitHub, risolvere sul repo.

---

## Output files

| Ruolo | Path tipo |
|--------|-----------|
| **Task input** | `<QUEUE_PATH>/{nome-task}.md` |
| **Lettura skip (no write)** | `<DONE_PATH>/{task}.md` |
| **Prompt Cursor output** | `<PROCESSING_PATH>/{nome}-cursor-prompt.md` |
| **Session automation output** | `<SESSIONS_PATH>/automation-{id}.md` |

Esempi reali già usati in test (repository):

- `docs/tasks/queue/0001-test-n8n-task.md`
- `docs/tasks/processing/0001-test-n8n-task-cursor-prompt.md`
- `docs/sessions/automation-0001-test-n8n-task.md`

---

## Non-goals

- **Non** esegue Cursor né Cursor CLI.
- **Non** modifica l’app (`src/frontend`, `src/backend`).
- **Non** esegue deploy Apps Script.
- **Non** crea tag Git.
- **Non** sposta ancora i task da `queue` a `processing` / `done` / `failed`.
- **Non** rimuove file da `<QUEUE_PATH>` (nessuna delete da coda in questa fase).
- **Non** sostituisce gate manuali (review umana, test `/exec`, policy release).

---

## Next possible workflow step (solo documentazione)

Possibili evoluzioni future, da progettare come workflow separato o estensione:

1. **Runner**: esecuzione manuale o script che legge il prompt in `<PROCESSING_PATH>` e invoca Cursor CLI con parametri redatti.
2. **Spostamento task**: dopo successo, PR o commit che sposta file da `queue` → `done` / `failed`.
3. **Report finale**: append a sessione o nuovo file in `docs/sessions/`.
4. **Notifica**: email/Telegram/Webhook generico (URL sempre placeholder nel repo: `<NOTIFICATION_WEBHOOK_URL>`).

---

## Riferimento incrociato

Documentazione workflow già pubblicata sul repo:

- `docs/automation/n8n-workflows/queue-reader.md`
