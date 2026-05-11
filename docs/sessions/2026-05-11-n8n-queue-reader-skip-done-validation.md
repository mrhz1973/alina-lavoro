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

## Cosa NON è stato fatto

- **Nessun** export JSON n8n committato nel repository.
- **Nessuna** modifica al codice app (`src/`, `Index.html`, `Code.gs`, ecc.).
- **Nessun** deploy Apps Script, **nessun** tag, **nessun** rollback.
- **Nessuna** delete da `docs/tasks/queue/` (il skip non rimuove file in coda).

## Rischi residui

- **Export JSON** del workflow da **redigere** (credenziali, URL interni) prima di ogni eventuale commit o condivisione.
- **Test futuro** consigliato sul ramo **`has_task: true`** con almeno un task in coda **realmente eleggibile** (nessun prompt in `processing` e nessun omonimo in `done`), per confermare end-to-end la catena Get → Decode → … oltre al caso “tutti saltati” già osservato.

## File documentazione toccati da questo aggiornamento incrementale

- `docs/automation/n8n-workflows/queue-reader.md`
- `docs/automation/n8n-workflows/queue-reader-ai-friendly-template.md`
- `docs/automation/n8n-workflows/done-copy-only-generalization.md`
- `docs/automation/README.md`
- `docs/sessions/2026-05-11-n8n-queue-reader-skip-done-validation.md` (questo file)

*(Documentazione correlata già aggiornata in commit precedente su `main`: `docs/PROJECT_STATE.md`, `docs/CHECKPOINT.md`, `docs/roadmap.md`, `docs/sessions/2026-05-11-n8n-queue-reader-skip-done-design.md`.)*

## Prossimo passo suggerito

Un **solo** run n8n controllato con **almeno un** file `.md` in `docs/tasks/queue/` che resti **eleggibile** dopo i filtri, verificando **`has_task: true`** e l’intera catena a valle.

## Riferimenti incrociati

- Design precedente: [`2026-05-11-n8n-queue-reader-skip-done-design.md`](./2026-05-11-n8n-queue-reader-skip-done-design.md)
- Disciplina operativa: [`2026-05-11-operational-step-by-step-hard-rule.md`](./2026-05-11-operational-step-by-step-hard-rule.md)
- [`docs/automation/n8n-workflows/queue-reader.md`](../automation/n8n-workflows/queue-reader.md)
