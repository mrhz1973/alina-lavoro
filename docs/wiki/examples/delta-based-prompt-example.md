# Delta-Based Prompt Example — LLM Wiki V3.1

**Task:** 0235 (introduced)
**Date:** 2026-05-14
**Type:** example / prompt style guide
**Status:** active reference

## Purpose

Show the canonical V3.1 short-prompt style using the Template Pack + Task Delta pattern. Future orchestrator prompts should follow this shape for docs-only tasks.

---

## Old style vs V3.1 style

### Old style (avoid)

```text
@docs/ORCHESTRATOR_RULES.md
@docs/AI_RULES.md
@docs/WORKFLOW.md
@docs/CHECKPOINT.md
@docs/PROJECT_STATE.md
@src/frontend/Index.html

You are the supervised implementer for Alina Lavoro.
Work only on branch main.
Never use git add .
Do not modify gas-current/.
Do not deploy, tag, or rollback unless explicitly requested.
Always commit selectively and push at the end.
Always report commit hash, checks, final git status --short, and whether workspace is clean.
Do not read PROJECT_STATE.md or CHECKPOINT.md by default.
...
[200+ more lines of repeated boilerplate]

TASK:
Update docs/LLMS.md to say Last completed = 0234.
```

Problems with this style:
- Repeats hundreds of lines already in canonical docs and templates.
- Forces implementer to parse a huge context window to find the 3 actual task lines.
- Includes PROJECT_STATE.md and CHECKPOINT.md by default, wasting tokens.
- Duplicates git rules, security rules, final report format — all already in templates.

### V3.1 style (preferred)

```text
@docs/roadmap.md
@AGENTS.md
@docs/wiki/task-id-preflight.md
@docs/wiki/prompt-routing.md
@docs/tasks/templates/implementer-standard.md
@docs/tasks/templates/docs-only-task.md
@docs/tasks/templates/final-report-contract.md

TASK DELTA:

Repository: mrhz1973/alina-lavoro
Task: 0235
Verified Last completed: 0234

Goal:
Update docs/LLMS.md and docs/wiki/current-state.md to Last completed = 0235.
Create docs/tasks/done/0235-<slug>.md and docs/sessions/YYYY-MM-DD-<slug>.md.

No runtime. No src/. No deploy/tag/rollback. No secrets.
```

Why this is better:
- ~15 lines of delta instead of 200+ lines of boilerplate.
- Standard git/security/report-format rules live in the templates.
- `AGENTS.md` is the pointer-only entry; `task-id-preflight.md` prevents stale IDs.
- `roadmap.md` gives current workstream context; `final-report-contract.md` covers report format.

---

## Full V3.1 prompt example (docs-only task)

```text
@docs/roadmap.md
@AGENTS.md
@docs/wiki/task-id-preflight.md
@docs/wiki/prompt-routing.md
@docs/tasks/templates/implementer-standard.md
@docs/tasks/templates/docs-only-task.md
@docs/tasks/templates/final-report-contract.md

TASK DELTA:

Repository: mrhz1973/alina-lavoro
Task: XXXX
Verified Last completed: XXXX (from docs/LLMS.md on main)

Goal:
<one sentence describing the docs change>

Allowed paths:
- docs/ only (list specific files if relevant)

Forbidden paths:
- src/**, gas-current/**, appsscript.json, package.json
- docs/PROJECT_STATE.md, docs/CHECKPOINT.md (unless explicitly justified)

Runtime: forbidden.

Expected result:
- <file A> updated: <what changes>
- docs/tasks/done/XXXX-<slug>.md created
- docs/sessions/YYYY-MM-DD-<slug>.md created
- docs/LLMS.md and docs/wiki/current-state.md: Last completed = XXXX

No n8n UI. No Execute. No Telegram send. No Schedule change.
No deploy/tag/rollback. No provider API LLM. No secrets.
```

---

## Full V3.1 prompt example (state update batch)

```text
@docs/roadmap.md
@AGENTS.md
@docs/wiki/task-id-preflight.md
@docs/tasks/templates/implementer-standard.md
@docs/tasks/templates/state-update-batch.md
@docs/tasks/templates/final-report-contract.md

TASK DELTA:

Repository: mrhz1973/alina-lavoro
Task: XXXX
Verified Last completed: XXXX

Goal:
Consolidate batch XXXX–XXXX into state docs.

What changed:
- <brief description of what the batch did>

Required updates:
- docs/LLMS.md: Last completed = XXXX; [any stack entry if new component]
- docs/wiki/current-state.md: header + Last completed
- docs/wiki/token-efficiency.md: [add navigation rows if new docs/wiki files]
- docs/roadmap.md: compact note in automation section
- docs/tasks/done/XXXX-<slug>.md
- docs/sessions/YYYY-MM-DD-<slug>.md

No runtime. No n8n UI. No secrets.
```

---

## Task-ID guard reminder

Before assigning any task ID:

1. Read `docs/LLMS.md` from main → extract `Last completed`.
2. Use `Last completed + 1` as the next task ID (unless that ID already exists in `docs/tasks/done/`).
3. If the proposed ID ≤ Last completed → stop, do not write.

Example: Last completed = 0234 → use 0235.

---

## What NOT to include in a V3.1 delta prompt

| Do not include | Reason |
|---|---|
| Full git workflow steps | Already in `implementer-standard.md` |
| Security constraints list | Already in `implementer-standard.md` and task-type template |
| Final report format | Covered by `final-report-contract.md` |
| `@docs/PROJECT_STATE.md` | Fallback only — never default |
| `@docs/CHECKPOINT.md` | Restart context only — never default |
| Repeated boilerplate from prior prompts | Templates cover it |
| Full INBOX history | Mention only if a new DP is introduced |

---

## Location

This example lives at `docs/wiki/examples/delta-based-prompt-example.md`.

Navigation entry: `docs/wiki/token-efficiency.md` → "V3.1 delta-based prompt example?"
