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
docs/tasks/queue/0001-test-n8n-task.md

Project:
Alina Lavoro

Type:
test

Priority:
low

Deploy policy:
no

Objective:
Verificare che n8n possa creare un file task dentro docs/tasks/queue e che un workflow separato possa leggerlo.

Requirements:
- Non modificare codice applicativo. - Non modificare Apps Script. - Non fare deploy. - Non creare tag. - Non toccare gas-current.

Expected output:
Il workflow TEST - GitHub list Alina task queue deve vedere questo file nella cartella docs/tasks/queue.

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