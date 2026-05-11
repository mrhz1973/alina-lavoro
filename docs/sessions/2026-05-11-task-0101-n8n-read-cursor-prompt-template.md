# Sessione — 2026-05-11 — Task 0101 n8n read cursor prompt template

## Obiettivo
Documentare la validazione manuale completata del task `0101-n8n-read-cursor-prompt-template-from-repo.md` e la modifica al workflow n8n `TEST - GitHub list Alina task queue` per leggere il template Cursor dal repository.

## Workflow n8n modificato
- Modificato: `TEST - GitHub list Alina task queue`.
- Non toccati: altri workflow n8n.

## Nodo aggiunto
- Nodo nuovo: `Get cursor prompt template`.
- Flusso finale: `Classify task` → `Get cursor prompt template` → `Build Cursor prompt`.

## Verifica lettura template
Template letto da `docs/tasks/templates/cursor-prompt-default.md` con metadati osservati:
- `name`: `cursor-prompt-default.md`
- `path`: `docs/tasks/templates/cursor-prompt-default.md`
- `sha`: `07ba24ff6717f1870aba6bbe1d7045786da348e9`
- `size`: `1856`
- `encoding`: `base64`

## Errori risolti durante la modifica
1. Errore `item is not defined` nel Code node `Build Cursor prompt` (modalità dove `item` non è disponibile).
   - Fix: `const templateFile = items[0].json;`
2. Prompt generato inizialmente errato perché includeva header documentativo `# Cursor prompt template — default`.
   - Fix: split del template dopo separatore `---` e uso solo della parte operativa.

## Codice finale di riferimento — Build Cursor prompt
```javascript
const classifiedTask = $('Classify task').first().json;
const templateFile = items[0].json;

const safeTaskName = String(classifiedTask.task_name || 'task')
  .replace(/[^a-zA-Z0-9._-]/g, '-')
  .replace(/-+/g, '-');

const cursorPromptPath =
  'docs/tasks/processing/' +
  safeTaskName.replace(/\.md$/i, '-cursor-prompt.md');

const sessionPath =
  'docs/sessions/automation-' +
  safeTaskName.replace(/\.md$/i, '.md');

if (!templateFile.content) {
  throw new Error('Missing template content from Get cursor prompt template');
}

const decodedTemplate = Buffer.from(
  String(templateFile.content || ''),
  String(templateFile.encoding || '').toLowerCase() === 'base64' ? 'base64' : 'utf8'
).toString('utf8');

const templateParts = decodedTemplate.split(/\n---\n/);
const template = templateParts.length > 1
  ? templateParts.slice(1).join('\n---\n').trim()
  : decodedTemplate.trim();

function replaceAll(text, token, value) {
  return String(text).split(token).join(String(value || ''));
}

let prompt = template;

prompt = replaceAll(prompt, '{{task_source_path}}', classifiedTask.task_path || '');
prompt = replaceAll(prompt, '{{project}}', classifiedTask.project || '');
prompt = replaceAll(prompt, '{{type}}', classifiedTask.type || '');
prompt = replaceAll(prompt, '{{priority}}', classifiedTask.priority || '');
prompt = replaceAll(prompt, '{{deploy_policy}}', classifiedTask.deploy || '');
prompt = replaceAll(prompt, '{{objective}}', classifiedTask.objective || '');
prompt = replaceAll(prompt, '{{requirements}}', classifiedTask.requirements || '');
prompt = replaceAll(prompt, '{{expected_output}}', classifiedTask.expected_output || '');

return [
  {
    json: {
      task_name: classifiedTask.task_name || '',
      task_path: classifiedTask.task_path || '',
      task_sha: classifiedTask.task_sha || '',
      project: classifiedTask.project || '',
      type: classifiedTask.type || '',
      priority: classifiedTask.priority || '',
      deploy: classifiedTask.deploy || '',
      cursor_prompt_path: cursorPromptPath,
      session_path: sessionPath,
      next_action: 'create_cursor_prompt_file',
      cursor_prompt: prompt
    }
  }
];
```

## Validazione task 0101
Task in queue:
- `docs/tasks/queue/0101-n8n-read-cursor-prompt-template-from-repo.md`

Output finale `Build Cursor prompt` verificato:
- `Project: Alina Lavoro`
- `Type: n8n-docs`
- `Priority: normal`
- `Deploy policy: no`
- `cursor_prompt_path: docs/tasks/processing/0101-n8n-read-cursor-prompt-template-from-repo-cursor-prompt.md`
- `session_path: docs/sessions/automation-0101-n8n-read-cursor-prompt-template-from-repo.md`
- `next_action: create_cursor_prompt_file`
- `cursor_prompt` con inizio corretto: `@docs/roadmap.md`

Nota: eventuali stringhe `{{task_source_path}}`, `{{project}}`, ecc. dentro l’Objective del task 0101 sono testo del task, non placeholder rimasti irrisolti nel template operativo.

## Artefatti GitHub confermati
- Prompt corretto creato:
  - path: `docs/tasks/processing/0101-n8n-read-cursor-prompt-template-from-repo-cursor-prompt.md`
  - sha: `981d98ecf69baf48280755dad9171195c3c2884a`
  - commit: `f759ffb83a26b77da9770133a8a5fac55d01b27b`
- Sessione automation aggiornata:
  - path: `docs/sessions/automation-0101-n8n-read-cursor-prompt-template-from-repo.md`
  - sha: `978203f3620f36f02af258b3477c3aecdbf6b549`
  - commit: `e4fe4dd185829da49c5345693359a79d294bff41`

## Idempotenza (secondo run completo)
- `has_task: false`
- `message: No queued task found or all queued tasks already have processing prompts or done files`

Interpretazione: `0101` viene saltato correttamente perché il prompt esiste già in `docs/tasks/processing/`.

## Cleanup effettuato
- Rimosso prompt 0101 generato in modo errato prima della correzione:
  - commit: `c04a9eb7de02b4cb5bf1436a01933b46a0cf2597`
  - messaggio: `docs: remove regenerated prompt for task 0101`
  - quel file iniziava con `# Cursor prompt template — default`

## Cosa non è stato fatto
- Nessuna modifica ad app Alina (`src/`, `gas-current/`, `.gas/`, `appsscript.json`, `package.json`).
- Nessun deploy Apps Script.
- Nessun tag.
- Nessun rollback.
- Nessuna cancellazione in `docs/tasks/queue/`.
- Nessun export JSON n8n committato.

## Rischi residui
- Il parser `Classify task` resta dipendente dal formato metadata in lista: task con metadata in tabella possono produrre campi prompt incompleti finché il parser non viene esteso.
- La logica split su `---` dipende dal mantenimento del separatore nel template repository.
