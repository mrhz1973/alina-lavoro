# n8n Workflow Design — Queue Reader Skip Failed

## Scopo

Questo documento definisce il design operativo per implementare lo skip `failed` nel workflow n8n `TEST - GitHub list Alina task queue`, basandosi sul formato `## Failed status` documentato con task 0104.

## Stato corrente

- **Queue reader attuale**: legge `queue/`, `processing/`, `done/`
- **Skip `failed`**: **non implementato** né validato
- **Formato `## Failed status`**: documentato con stub task 0104
- **Task 0104**: stub intenzionale in `docs/tasks/failed/0104-failed-validation-stub.md`

## Obiettivo design

Preparare la modifica controllata del workflow n8n per aggiungere lo skip `failed`, senza eseguire subito la modifica runtime.

## Specifiche implementative

### 1. Nodo da aggiungere

**Nome nodo**: `List failed files`

**Tipo**: GitHub List Directory

**Configurazione**:
- Directory: `docs/tasks/failed`
- Execute Once: **YES** (come `List processing files` e `List done files`)
- Output: lista file con name, path, sha, size

### 2. Modifica filtro esistente

**Nodo target**: `Filter first queued task`

**Logica aggiuntiva**:
- Aggiungere `failedNames` Set analogo a `processingNames` e `doneNames`
- Estrarre nomi file da `List failed files` (escludere `.gitkeep`)
- Condizione skip: `if (failedNames.has(name)) return false`

### 3. Codice nodo aggiornato

```javascript
const queuedFiles = $('List files').all().map(item => item.json);
const processingFiles = $('List processing files').all().map(item => item.json);
const doneFiles = $('List done files').all().map(item => item.json);
const failedFiles = $('List failed files').all().map(item => item.json);

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

const failedNames = new Set(
  failedFiles
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
    if (failedNames.has(name)) return false; // NUOVO

    return true;
  })
  .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));

if (!tasks.length) {
  return [
    {
      json: {
        has_task: false,
        message: 'No queued task found or all queued tasks already have processing prompts, done files, or failed files'
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

### 4. Messaggi output aggiornati

- **has_task: false**: "No queued task found or all queued tasks already have processing prompts, done files, or failed files"
- **skip_reason**: popolato se skip per failed (opzionale)

### 5. Flusso nodi completo

```
Manual Trigger
→ List files                         (queue: docs/tasks/queue)
→ List processing files              (docs/tasks/processing)
→ List done files                    (docs/tasks/done)
→ List failed files                  (docs/tasks/failed) [NUOVO]
→ Filter first queued task           (salta se processing/done/failed)
→ IF has queued task
    ├→ true  → Get queued task file
    │          → Decode task markdown
    │          → Classify task
    │          → Build Cursor prompt
    │             └→ ... (esistente)
    └→ false → No queued task / already processing
```

## Scenari di validazione manuale

### Scenario 0104 (deve essere saltato)
- `docs/tasks/queue/0104-*.md` esiste
- `docs/tasks/failed/0104-failed-validation-stub.md` esiste
- Atteso: `has_task: false`, skip per failed

### Scenario senza marker (deve essere eleggibile)
- Task in `queue/` senza corrispondente `failed/`
- Atteso: `has_task: true`, selezione normale

### Scenario nessun task eleggibile
- Tutti i task in queue hanno processing/done/failed
- Atteso: `has_task: false`, ramo `false/no_action`

## Note operative

- **Execute Once** su `List failed files` per evitare duplicati
- **Ordine nodi**: dopo `List done files` per coerenza
- **Messaggi**: aggiornati per includere "failed files"
- **Compatibilità**: mantieni skip processing/done esistenti

## Prossimo passo manuale

Dopo validazione design:
1. Aprire workflow n8n `TEST - GitHub list Alina task queue`
2. Aggiungere nodo `List failed files`
3. Aggiornare codice `Filter first queued task`
4. Test manuale con scenario 0104
5. Documentare validazione in sessione

## Riferimenti

- Task 0104: `docs/tasks/failed/0104-failed-validation-stub.md`
- Sessione stub: `docs/sessions/2026-05-12-failed-validation-stub.md`
- Queue reader: `docs/automation/n8n-workflows/queue-reader.md`
- Lifecycle ownership: `docs/automation/n8n-workflows/lifecycle-ownership.md`
