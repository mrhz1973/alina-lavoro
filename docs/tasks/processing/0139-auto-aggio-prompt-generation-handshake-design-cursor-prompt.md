@docs/LLMS.md
@docs/wiki/current-state.md
@docs/wiki/token-efficiency.md
@docs/ORCHESTRATOR_RULES.md
@docs/AI_RULES.md
@docs/WORKFLOW.md
@docs/COMMANDS.md

MODALITÀ: AGENT / IMPLEMENTAZIONE

Task source:
docs/tasks/queue/0139-auto-aggio-prompt-generation-handshake-design.md

Project:


Type:


Priority:


Deploy policy:


Objective:
Create a docs-only design document that clarifies that "aggio" is not only a status refresh, but serves as a prompt-generation handshake. The design must formalize that:

1. "aggio" means the implementer probably finished
2. ChatGPT web must realign to GitHub
3. ChatGPT must perform post-check
4. ChatGPT must identify whether real human decisions exist
5. If no decisions exist, ChatGPT must immediately generate the next implementer prompt
6. If decisions exist, ChatGPT must stop, ask the user, and generate the next prompt only after the user decides

---

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
- LLMS-first orientation: read docs/LLMS.md first, then docs/wiki/current-state.md, then docs/wiki/token-efficiency.md, then the task file. Do NOT read docs/PROJECT_STATE.md or docs/CHECKPOINT.md by default; if you open them, say why in the final response.

Final response required:
- Files changed.
- Checks executed.
- Commit hash.
- Git status final.
- Any risks or manual tests required.
- Any sensitive gate encountered (yes/no; if yes, which one).
- Whether docs/PROJECT_STATE.md or docs/CHECKPOINT.md were opened (yes/no; if yes, why).