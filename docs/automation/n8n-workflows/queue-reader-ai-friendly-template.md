# n8n Workflow Template — Queue Reader AI-Friendly

## Scopo di questo documento

Questo file è una **specifica AI-friendly** e **redatta** per ricostruire in n8n il comportamento del workflow **`TEST - GitHub list Alina task queue`** senza pubblicare **export JSON** contenenti segreti. Serve a orchestratori LLM, maintainer e futuri runner che devono clonare la logica su un’altra istanza n8n.

Non è un export workflow eseguibile: è una **mappa concettuale + pseudo-code** dei nodi **Code** e delle policy GitHub.

## Stato

Deriva dal workflow **già testato** in repository:

- **`TEST - GitHub list Alina task queue`**

Comportamento documentato di riferimento (allineato a `docs/automation/n8n-workflows/queue-reader.md`):

- Test completo OK; workflow **ri-eseguibile**.
- Lettura primo task Markdown in `<QUEUE_PATH>`; decode; classify.
- Generazione prompt Cursor; **create/update** sotto `<PROCESSING_PATH>`.
- **Create/update** sessione automation sotto `<SESSIONS_PATH>`.
- **Cursor non** è eseguito automaticamente dal workflow.
- Nessuna modifica al codice app, nessun deploy, nessun tag, nessun tocco a `gas-current/`.

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
| `SESSIONS_PATH` | `docs/sessions` | Path sessioni automation |
| `TASK_FILE_PATTERN` | `*.md` | Solo markdown |
| `IGNORE_FILES` | `.gitkeep` | Esclusi dalla selezione |

Endpoint API GitHub (concettuale, senza token):

- Base repository contents: `GET /repos/<OWNER>/<REPO>/contents/{path}?ref=<BRANCH>`

Credenziale HTTP/GitHub in n8n: nome concettuale **`<GITHUB_CREDENTIAL_NAME>`** (solo placeholder).

## Struttura nodi (catena completa)

```text
Manual Trigger
→ List files
→ Filter first queued task
→ Get queued task file
→ Decode task markdown
→ Classify task
→ Build Cursor prompt
   ├→ Check Cursor prompt file exists
   │   ├→ Success → IF Cursor prompt file exists
   │   │   ├→ true  → Update Cursor prompt file
   │   │   └→ false → Create Cursor prompt file
   │   └→ Error → Create Cursor prompt file
   └→ Build session file
       → Check session file exists
           ├→ Success → IF session file exists
           │   ├→ true  → Update session file
           │   └→ false → Create session file
           └→ Error → Create session file
```

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

### 2. List files

| Campo | Valore |
|--------|--------|
| **Nome** | List files |
| **Tipo n8n presumibile** | GitHub — *Get contents of a directory* / list files |
| **Input atteso** | Owner/repo/branch/path da placeholder |
| **Output atteso** | Lista entry (file/dir) sotto `<QUEUE_PATH>` |
| **Note** | Parametri: `<OWNER>`, `<REPO>`, `<BRANCH>`, path = `<QUEUE_PATH>`. Credential = `<GITHUB_CREDENTIAL_NAME>`. |
| **Placeholder** | `<OWNER>`, `<REPO>`, `<BRANCH>`, `<QUEUE_PATH>` |

### 3. Filter first queued task

| Campo | Valore |
|--------|--------|
| **Nome** | Filter first queued task |
| **Tipo n8n presumibile** | Code |
| **Input atteso** | Lista file da List files |
| **Output atteso** | Un item con `path`, `name`, `sha` (se disponibile) del **primo** `.md` ordinato per nome; esclusi `<IGNORE_FILES>` |
| **Note** | Vedi pseudo-code sotto. |
| **Placeholder** | `TASK_FILE_PATTERN`, `IGNORE_FILES` |

### 4. Get queued task file

| Campo | Valore |
|--------|--------|
| **Nome** | Get queued task file |
| **Tipo n8n presumibile** | GitHub — *Get a file* / file content |
| **Input atteso** | Path file dalla fase filter |
| **Output atteso** | Contenuto file (base64 o testo secondo API), `sha` per commit successivi |
| **Note** | Conservare `sha` per update futuri su altri nodi se necessario. |
| **Placeholder** | Stessi owner/repo/branch |

### 5. Decode task markdown

| Campo | Valore |
|--------|--------|
| **Nome** | Decode task markdown |
| **Tipo n8n presumibile** | Code |
| **Input atteso** | Raw markdown del task |
| **Output atteso** | Oggetto strutturato: sezioni, campi tabella metadata, corpo testo |
| **Note** | Parsing leggero (regex/split); coerente con il template task in `docs/tasks/templates/`. |
| **Placeholder** | — |

### 6. Classify task

| Campo | Valore |
|--------|--------|
| **Nome** | Classify task |
| **Tipo n8n presumibile** | Code |
| **Input atteso** | Output di Decode |
| **Output atteso** | `project`, `type`, `priority`, `status`, `deploy`, `objective`, ecc. |
| **Note** | Allinea chiavi a quanto già documentato in `queue-reader.md` (output strutturato). |
| **Placeholder** | — |

### 7. Build Cursor prompt

| Campo | Valore |
|--------|--------|
| **Nome** | Build Cursor prompt |
| **Tipo n8n presumibile** | Code |
| **Input atteso** | Task classificato + markdown originale |
| **Output atteso** | `content` (stringa prompt), `targetPath` sotto `<PROCESSING_PATH>`, nome file derivato dal task (es. `{basename}-cursor-prompt.md`) |
| **Note** | Vedi pseudo-code. |
| **Placeholder** | `<PROCESSING_PATH>` |

### 8. Check Cursor prompt file exists

| Campo | Valore |
|--------|--------|
| **Nome** | Check Cursor prompt file exists |
| **Tipo n8n presumibile** | GitHub — richiesta GET file (404 = non esiste) |
| **Input atteso** | `targetPath` |
| **Output atteso** | Success con `sha` oppure errore 404 |
| **Note** | Collegare **Success** all’IF; **Error** (404) al ramo Create. |
| **Placeholder** | — |

### 9. IF Cursor prompt file exists

| Campo | Valore |
|--------|--------|
| **Nome** | IF Cursor prompt file exists |
| **Tipo n8n presumibile** | IF |
| **Input atteso** | Flag o contenuto check |
| **Output atteso** | Ramo true / false |
| **Note** | true → Update; false → Create. |

### 10. Update Cursor prompt file / Create Cursor prompt file

| Campo | Valore |
|--------|--------|
| **Nome** | Update / Create file (prompt) |
| **Tipo n8n presumibile** | GitHub — create/update file API |
| **Input atteso** | Path, contenuto, `sha` obbligatorio per update |
| **Output atteso** | Commit risultato |
| **Note** | Policy in sezione dedicata. |

### 11. Build session file

| Campo | Valore |
|--------|--------|
| **Nome** | Build session file |
| **Tipo n8n presumibile** | Code |
| **Input atteso** | Metadata task + path prompt + stato “Cursor non eseguito” |
| **Output atteso** | `content`, `targetPath` sotto `<SESSIONS_PATH>` (es. `automation-{id}.md`) |
| **Note** | Vedi pseudo-code. |

### 12. Check session file exists → IF → Update / Create session file

| Campo | Valore |
|--------|--------|
| **Nome** | Stessa logica del prompt |
| **Tipo n8n presumibile** | GitHub GET + IF + create/update |
| **Input / Output** | Analoghi al blocco prompt |
| **Note** | Stessa **Create/update policy**. |

---

## Pseudo-code — nodi Code

### Filter first queued task

```javascript
// items: output GitHub list directory
const IGNORE = '.gitkeep';
const files = items[0].json /* oppure struttura reale API */
  .filter(function (e) {
    return e.type === 'file' && e.name.endsWith('.md') && e.name !== IGNORE;
  })
  .sort(function (a, b) { return a.name.localeCompare(b.name); });

if (!files.length) {
  throw new Error('No queued markdown task');
}

return [{ json: { path: files[0].path, name: files[0].name, sha: files[0].sha } }];
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
