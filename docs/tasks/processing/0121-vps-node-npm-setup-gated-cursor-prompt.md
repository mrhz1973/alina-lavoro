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
docs/tasks/queue/0121-vps-node-npm-setup-gated.md

Project:
Alina Lavoro

Type:
vps-setup-gated

Priority:
normal

Deploy policy:
no

Objective:
Preparare il setup controllato di Node.js/npm sul VPS per abilitare il futuro utilizzo di Claude Code CLI.

**Questo task NON esegue nessun comando VPS, NON apre SSH, NON installa nulla e NON modifica n8n runtime.**

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