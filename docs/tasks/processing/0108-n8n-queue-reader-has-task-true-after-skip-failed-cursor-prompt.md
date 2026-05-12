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
docs/tasks/queue/0108-n8n-queue-reader-has-task-true-after-skip-failed.md

Project:
Alina Lavoro

Type:
n8n-runtime-validation-planning

Priority:
normal

Deploy policy:
no

Objective:
Preparare la futura validazione manuale n8n del ramo has_task:true dopo l'introduzione dello skip failed.

Il test dovrà verificare che un nuovo task in docs/tasks/queue/, senza corrispondenti file in processing/, done/ o failed/, venga selezionato dal queue reader.

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