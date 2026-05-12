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
docs/tasks/queue/0114-n8n-watcher-schedule-trigger-runtime-activation.md

Project:
Alina Lavoro

Type:
n8n-runtime-activation

Priority:
normal

Deploy policy:
no

Objective:
Attivare il watcher n8n con Schedule Trigger ogni 5 minuti (timezone `Europe/Berlin`), verificare il comportamento `has_task:false` (coda vuota, silenzioso), e pubblicare il workflow watcher come polling automatico.

Il runner documentale automatico (Claude Code CLI / Cursor CLI sul VPS) resta **fuori scope**.

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