# Claude Code — Alina Lavoro

You are the temporary local implementer for the Alina Lavoro project.

GitHub is the source of truth.
ChatGPT is the orchestrator.
Claude Code implements only the current micro-step.

## Required reading at session start — LLMS-first routing (mandatory)

**Step 1 — always read these three files first:**

1. @docs/LLMS.md — compact agent entry point (≤200 lines); answers most orientation questions
2. @docs/wiki/current-state.md — state snapshot (≤100 lines)
3. @docs/wiki/token-efficiency.md — navigation rules and what NOT to read

**Step 2 — always read these rule files:**

4. @docs/ORCHESTRATOR_RULES.md — hard priority rules (compact, always needed)
5. @docs/AI_RULES.md — implementer rules
6. @docs/WORKFLOW.md — workflow rules

**Step 3 — read the assigned task file** (if a task file is provided or in queue).

**Step 4 — read only task-specific canonical docs** (e.g. `docs/COMMANDS.md` if frontend checks needed; automation design docs only for automation tasks).

**DO NOT read by default:**

- `docs/PROJECT_STATE.md` — fallback only (full historical state, large file); open only when LLMS.md + wiki cannot answer your question; if you open it, say why in your final report
- `docs/CHECKPOINT.md` — restart context only; open only when restart context is explicitly required; if you open it, say why in your final report
- `docs/roadmap.md` — read only if a task requires product/roadmap context
- `docs/sessions/*` — skip unless debugging a specific past event

**Note:** Claude Code large-file warnings for PROJECT_STATE.md and CHECKPOINT.md may remain until a future physical compression task. This routing rule reduces real context consumption independently of those warnings.

**When working on automation tasks,** also read (only as needed):

- @docs/tasks/README.md
- @docs/automation/n8n-workflows/lifecycle-ownership.md
- @docs/automation/n8n-workflows/queue-reader.md
- @docs/automation/n8n-workflows/done-failed-design.md

## Hard rules

- Work only on branch main.
- dev is legacy/inactive.
- Never use git add .
- Do not modify gas-current/ as source.
- Do not deploy, tag, or rollback unless explicitly requested.
- Do not modify src/** unless the current task explicitly allows it.
- For docs-only tasks, touch only allowed docs paths.
- Always commit selectively and push at the end of a completed block.
- Always report commit hash, checks, final git status --short, and whether the workspace is clean.

## Compact Instructions

After compacting, preserve:

- Current task ID and objective.
- Allowed and forbidden paths.
- Whether the task is docs-only or app-related.
- Branch: main.
- Latest relevant commit hash.
- Files already modified.
- Checks already executed.
- Any open risks or manual gates.
- Never infer deploy/tag/rollback permission from prior conversation.
