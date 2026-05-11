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
docs/tasks/queue/0004-test-n8n-done-copy-only-generalized.md

Project:
Alina Lavoro

Type:
test

Priority:
low

Deploy policy:
no

Objective:
Preparare un task di test per validare la versione generalizzata del workflow n8n `done copy-only`, usando path dinamici derivati da `task_name` o `queue_path`.

Requirements:
- Non modificare codice applicativo.
- Non modificare Apps Script.
- Non fare deploy.
- Non creare tag.
- Non toccare `gas-current/`.
- Non cancellare file da `docs/tasks/queue`.
- Il futuro workflow generalizzato dovrà derivare dinamicamente:
  - queue_path
  - done_path
  - cursor_prompt_path
  - session_path
- Il futuro workflow generalizzato dovrà creare o aggiornare la copia in `docs/tasks/done`.
- La copia `done` dovrà conservare il contenuto del task originale.
- La copia `done` dovrà aggiungere una sezione `Done copy-only outcome`.
- La sessione automation dovrà essere aggiornata con l'esito `done`.
- Il test deve seguire il design in `docs/automation/n8n-workflows/done-copy-only-generalization.md`.

Expected output:
In una futura simulazione n8n generalizzata, questo task dovrà produrre:

- `docs/tasks/processing/0004-test-n8n-done-copy-only-generalized-cursor-prompt.md`
- `docs/sessions/automation-0004-test-n8n-done-copy-only-generalized.md`
- `docs/tasks/done/0004-test-n8n-done-copy-only-generalized.md`

Il file originale dovrà restare in:

- `docs/tasks/queue/0004-test-n8n-done-copy-only-generalized.md`

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