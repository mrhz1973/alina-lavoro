# Cursor prompt template — default (`Build Cursor prompt`)

This file documents the **layout** of the operational prompt assembled by the n8n node **Build Cursor prompt** (workflow **TEST - GitHub list Alina task queue**). The `{{name}}` tokens are **placeholders**: substitution from GitHub/n8n will be introduced in a future task.

| Placeholder | Typical content |
|-------------|-----------------|
| `{{task_source_path}}` | Path of the task file in `docs/tasks/queue/…` |
| `{{project}}` | Project name (e.g. Alina Lavoro) |
| `{{type}}` | Task type (e.g. docs-only, test) |
| `{{priority}}` | Priority (e.g. normal, low) |
| `{{deploy_policy}}` | Deploy policy (e.g. no, none) |
| `{{objective}}` | Objective section text (Markdown inline / paragraphs) |
| `{{requirements}}` | Requirements text or list |
| `{{expected_output}}` | Expected output text or list |

---

@docs/LLMS.md
@docs/wiki/current-state.md
@docs/wiki/token-efficiency.md
@docs/ORCHESTRATOR_RULES.md
@docs/AI_RULES.md
@docs/WORKFLOW.md
@docs/COMMANDS.md

MODALITÀ: AGENT / IMPLEMENTAZIONE

Task source:
{{task_source_path}}

Project:
{{project}}

Type:
{{type}}

Priority:
{{priority}}

Deploy policy:
{{deploy_policy}}

Objective:
{{objective}}

Requirements:
{{requirements}}

Expected output:
{{expected_output}}

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
- LLMS-first orientation: read docs/LLMS.md first, then docs/wiki/current-state.md, then docs/wiki/token-efficiency.md, then the task file. Do NOT read docs/PROJECT_STATE.md or docs/CHECKPOINT.md by default; if you open them, say why in the final response.

Final response required:
- Files changed.
- Checks executed.
- Commit hash.
- Git status final.
- Any risks or manual tests required.
- Any sensitive gate encountered (yes/no; if yes, which one).
- Whether docs/PROJECT_STATE.md or docs/CHECKPOINT.md were opened (yes/no; if yes, why).
