# Sessione — n8n queue reader skip `done` (validazione manuale)

## Data

2026-05-11

## Obiettivo

Registrare su GitHub che il workflow n8n reale **`TEST - GitHub list Alina task queue`** ha **implementato** e superato una **validazione manuale** in interfaccia n8n per lo **skip** dei task in `docs/tasks/queue/` quando esiste già il prompt in **`docs/tasks/processing/`** oppure il file omonimo in **`docs/tasks/done/`**.

## Contesto operativo verificato

| Aspetto | Esito |
|---------|--------|
| Workflow modificato | **`TEST - GitHub list Alina task queue`** |
| Workflow **non** toccato | **`TEST - Mark Alina task done copy-only generalized`** |
| Nuovo nodo | **`List done files`** — lettura directory **`docs/tasks/done`** |
| Opzione nodo | **`Execute Once`** su **List done files** (prima ~60 item duplicati; dopo correzione **3** item coerenti con directory: `.gitkeep`, `0003-test-n8n-done-copy-only.md`, `0004-test-n8n-done-copy-only-generalized.md`) |
| Fase diagnostica | **`Filter first queued task`** testato con codice **diagnostico temporaneo**, poi **rimosso** |
| Stato finale filtro | **Versione pulita** in produzione nel workflow |
| Test workflow completo | `has_task: false`, `message: No queued task found or all queued tasks already have processing prompts or done files` |
| Conclusione | Il reader **salta** correttamente le voci in coda già coperte da **processing** e/o **done** |

## Riferimento codice — `Filter first queued task` (n8n Code, versione documentata)

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

## File documentazione aggiornati nel repository

- `docs/automation/n8n-workflows/queue-reader.md`
- `docs/automation/n8n-workflows/queue-reader-ai-friendly-template.md`
- `docs/automation/n8n-workflows/done-copy-only-generalization.md`
- `docs/sessions/2026-05-11-n8n-queue-reader-skip-done-design.md`
- `docs/sessions/2026-05-11-n8n-queue-reader-skip-done-validation.md` (questo file)
- `docs/PROJECT_STATE.md`
- `docs/CHECKPOINT.md`
- `docs/roadmap.md`

## Cosa non rientra in questa sessione

- Nessuna modifica al codice app Alina, a `gas-current/`, deploy o tag.
- Nessun export JSON n8n committato nel repo.

## Prossimo passo suggerito

Regressioni mirate in n8n (coda con task **solo** libero, **solo** `processing`, **solo** `done`, combinazioni) e, se serve, sessione di regressione breve in `docs/sessions/`.

## Riferimenti incrociati

- Design precedente: [`2026-05-11-n8n-queue-reader-skip-done-design.md`](./2026-05-11-n8n-queue-reader-skip-done-design.md)
- Disciplina operativa: [`2026-05-11-operational-step-by-step-hard-rule.md`](./2026-05-11-operational-step-by-step-hard-rule.md)
- [`docs/automation/n8n-workflows/queue-reader.md`](../automation/n8n-workflows/queue-reader.md)
