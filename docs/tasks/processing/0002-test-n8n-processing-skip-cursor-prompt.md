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
docs/tasks/queue/0002-test-n8n-processing-skip.md

Project:
Alina Lavoro

Type:
test

Priority:
low

Deploy policy:
no

Objective:
Verificare che il workflow n8n `TEST - GitHub list Alina task queue`, dopo l'introduzione dello skip dei task già presenti in `processing`, selezioni correttamente un nuovo task libero in `docs/tasks/queue`.

Requirements:
- Non modificare codice applicativo.
- Non modificare Apps Script.
- Non fare deploy.
- Non creare tag.
- Non toccare `gas-current/`.
- Il workflow deve saltare `0001-test-n8n-task.md` perché ha già il relativo prompt in `docs/tasks/processing`.
- Il workflow deve selezionare questo nuovo task `0002-test-n8n-processing-skip.md` perché non ha ancora un prompt corrispondente in `docs/tasks/processing`.

Expected output:
Alla prossima esecuzione manuale di n8n, il workflow deve produrre/aggiornare:

- `docs/tasks/processing/0002-test-n8n-processing-skip-cursor-prompt.md`
- `docs/sessions/automation-0002-test-n8n-processing-skip.md`

senza modificare l'app Alina.

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