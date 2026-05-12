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
docs/tasks/queue/0124-runner-alternatives-no-api-decision.md

Project:
Alina Lavoro

Type:
runner-decision-docs-only

Priority:
normal

Deploy policy:
no
- Runtime: no
- Manual gate: required before any future runtime, VPS, n8n, login, API key, runner, GitHub Actions, Cursor CLI, Codex CLI or Claude CLI execution

Objective:


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