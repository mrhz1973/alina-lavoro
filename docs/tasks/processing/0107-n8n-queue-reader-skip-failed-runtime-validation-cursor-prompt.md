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
docs/tasks/queue/0107-n8n-queue-reader-skip-failed-runtime-validation.md

Project:
Alina Lavoro

Type:
n8n-runtime-validation

Priority:
normal

Deploy policy:
no

Objective:
Preparare e guidare la futura modifica manuale controllata del workflow n8n per aggiungere skip failed e validare lo scenario 0104.

Questo task non implementa direttamente la modifica n8n: definisce il lavoro da eseguire dopo gate manuale.

Requirements:


Expected output:


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