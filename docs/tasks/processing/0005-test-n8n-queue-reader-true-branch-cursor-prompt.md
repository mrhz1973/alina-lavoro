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
docs/tasks/queue/0005-test-n8n-queue-reader-true-branch.md

Project:
Alina Lavoro

Type:
test

Priority:
low

Deploy policy:
no

Objective:
Preparare un task di test realmente eleggibile per validare il ramo `has_task: true` del workflow n8n `TEST - GitHub list Alina task queue` dopo l’implementazione dello skip combinato `processing` + `done`.

Requirements:
- Non modificare codice applicativo.
- Non modificare Apps Script.
- Non fare deploy.
- Non creare tag.
- Non toccare `gas-current/`.
- Non cancellare file da `docs/tasks/queue`.
- Questo task deve restare privo di file omonimo in `docs/tasks/processing/`.
- Questo task deve restare privo di file omonimo in `docs/tasks/done/`.

Expected output:
Al prossimo run del workflow n8n `TEST - GitHub list Alina task queue`, questo task dovrebbe essere selezionato come primo task eleggibile e produrre:

- `has_task: true`
- `task_name: 0005-test-n8n-queue-reader-true-branch.md`
- `task_path: docs/tasks/queue/0005-test-n8n-queue-reader-true-branch.md`

Il workflow n8n potrà poi generare il prompt Cursor e la sessione automation come da logica già esistente.

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