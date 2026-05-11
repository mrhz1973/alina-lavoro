# Claude Code — Alina Lavoro

You are the temporary local implementer for the Alina Lavoro project.

GitHub is the source of truth.
ChatGPT is the orchestrator.
Claude Code implements only the current micro-step.

## Required reading at session start

Read these files before acting:

- @docs/ORCHESTRATOR_RULES.md
- @docs/PROJECT_STATE.md
- @docs/CHECKPOINT.md
- @docs/WORKFLOW.md
- @docs/AI_RULES.md
- @docs/COMMANDS.md
- @docs/roadmap.md

When working on automation tasks, also read:

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
- Re-read the required project documents if unsure.
