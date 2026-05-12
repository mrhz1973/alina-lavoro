@docs/roadmap.md
@docs/STREAMLINED_WORKFLOW.md
@docs/ORCHESTRATOR_RULES.md
@docs/AI_RULES.md
@docs/WORKFLOW.md
@docs/CHECKPOINT.md
@docs/PROJECT_STATE.md
@docs/COMMANDS.md

MODALITÀ: AGENT / IMPLEMENTAZIONE

Task source:
docs/tasks/queue/0132-llm-wiki-token-efficiency-design.md

Project:
Alina Lavoro

Type:
low-touch-loop-docs-only

Priority:
high

Deploy policy:
no
- Runtime: no
- App changes: no
- Manual gate: required before any future runtime, Ollama install, embeddings runtime, VPS changes, n8n runtime, API key, login, GitHub Actions, deploy, tag, rollback, runner automatico

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
- Do not insert user-facing instructions outside this prompt block; report any real gates in the final response.
- Do not ask the user for confirmation when the task is docs-only, already assigned, and has no real decision or sensitive gate.
- Proceed with the assigned docs-only task; the absence of a real choice equals operational consent to proceed.
- Stop only for sensitive gates: runtime, VPS runtime, n8n runtime, app changes, deploy, tag, rollback, API key, login, GitHub Actions, new recurring costs, automatic runner, secrets or personal data, or physical user/Alina test.
- If a sensitive gate appears during execution, stop and report it clearly in the final response.

Final response required:
- Files changed.
- Checks executed.
- Commit hash.
- Git status final.
- Any risks or manual tests required.
- Any sensitive gate encountered (yes/no; if yes, which one).