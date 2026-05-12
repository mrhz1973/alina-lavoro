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
docs/tasks/queue/0113-n8n-queue-reader-subworkflow-prerequisite.md

Project:
Alina Lavoro

Type:
n8n-runtime-prerequisite

Priority:
normal

Deploy policy:
no

Objective:
Analizzare e implementare in n8n il prerequisito che rende il queue reader `TEST - GitHub list Alina task queue` richiamabile dal nodo Execute Sub-workflow del workflow watcher, **senza rompere** il trigger manuale già validato.

Preferenza architetturale: **Opzione B1** — aggiungere al queue reader un secondo trigger "When executed by another workflow", mantenendo il Manual Trigger invariato.

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