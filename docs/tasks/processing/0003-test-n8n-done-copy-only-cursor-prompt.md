@docs/roadmap.md
@docs/STREAMLINED_WORKFLOW.md
@docs/ORCHESTRATOR_RULES.md
@docs/AI_RULES.md
@docs/WORKFLOW.md
@docs/CHECKPOINT.md
@docs/PROJECT_STATE.md
@docs/COMMANDS.md

AGENT MODE.

Task source:
docs/tasks/queue/0003-test-n8n-done-copy-only.md

Project:
Alina Lavoro

Type:
test

Priority:
low

Deploy policy:
no

Objective:
Preparare un task di test per la futura simulazione della chiusura `done` in modalità copy-only, senza cancellare il file originale da `docs/tasks/queue`.

Requirements:
- Non modificare codice applicativo.
- Non modificare Apps Script.
- Non fare deploy.
- Non creare tag.
- Non toccare `gas-current/`.
- Non cancellare file da `docs/tasks/queue`.
- Il futuro workflow di chiusura dovrà creare una copia in `docs/tasks/done`.
- La copia `done` dovrà conservare il contenuto del task originale.
- La copia `done` dovrà aggiungere metadata o sezione di chiusura con:
- status: done
  - completed_at
  - cursor_prompt_path
  - session_path
  - outcome: copy-only validation
- La sessione automation dovrà essere aggiornata con l'esito `done` quando il blocco sarà implementato.

Expected output:
In una futura simulazione n8n, questo task dovrà produrre:

- `docs/tasks/processing/0003-test-n8n-done-copy-only-cursor-prompt.md`
- `docs/sessions/automation-0003-test-n8n-done-copy-only.md`
- `docs/tasks/done/0003-test-n8n-done-copy-only.md`

Il file originale dovrà restare in:

- `docs/tasks/queue/0003-test-n8n-done-copy-only.md`

Nessuna delete da `queue`.
Nessuna modifica app.

Mandatory constraints:
- Work on branch main only.
- Do not use dev.
- Do not use git add .
- Do not modify gas-current unless explicitly authorized by a deploy/release task.
- Do not deploy unless the task explicitly authorizes deploy.
- Do not create tags unless the task explicitly authorizes tag creation.
- Run the repository checks required by docs/COMMANDS.md.
- Commit selectively and push only the intended changes.

Final response required:
- Files changed.
- Checks executed.
- Commit hash.
- Git status final.
- Any risks or manual tests required.