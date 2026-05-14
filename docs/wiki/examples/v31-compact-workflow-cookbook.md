# V3.1 Compact Workflow Cookbook — LLM Wiki V3.1

**Task:** 0239 (introduced)
**Date:** 2026-05-14
**Type:** example / practical reference
**Status:** active reference

## Purpose

Practical examples showing how to apply V3.1 compact workflow patterns for common task types. Use these as a starting point; adjust the delta for the specific task.

---

## Example 1 — Docs-only state update

**Situation:** tasks 0241 through 0243 are docs-only wiki additions. Batch them.

```text
@docs/roadmap.md
@docs/wiki/task-id-preflight.md
@docs/tasks/templates/implementer-standard.md
@docs/tasks/templates/state-update-batch.md
@docs/tasks/templates/final-report-contract.md

TASK DELTA:

Repository: mrhz1973/alina-lavoro
Tasks: 0241–0243
Verified Last completed: 0240 (from docs/LLMS.md on main)

Goal:
Batch 0241–0243: add three new wiki design notes and update state docs.

Sub-tasks:
0241: Create docs/wiki/X.md — describes Y.
0242: Create docs/wiki/Z.md — describes W.
0243: Update state docs (LLMS.md, current-state.md, roadmap.md, token-efficiency.md).

Expected result:
- docs/wiki/X.md created
- docs/wiki/Z.md created
- docs/LLMS.md: Last completed = 0243
- docs/wiki/current-state.md: header + Last completed
- docs/wiki/token-efficiency.md: navigation rows for X.md and Z.md added
- docs/roadmap.md: compact note in automation section
- docs/tasks/done/0241-X.md created
- docs/tasks/done/0242-Z.md created
- docs/tasks/done/0243-state-update.md created
- docs/sessions/2026-05-14-batch-0241-0243.md created

No runtime. No src/. No deploy/tag/rollback. No secrets.
```

---

## Example 2 — INBOX decision recording

**Situation:** user answered D-0244-A = 2. Record the decision.

```text
@docs/wiki/task-id-preflight.md
@docs/tasks/templates/implementer-standard.md
@docs/tasks/templates/inbox-decision-recording.md
@docs/tasks/templates/final-report-contract.md

TASK DELTA:

Repository: mrhz1973/alina-lavoro
Task: 0245
Verified Last completed: 0244

Goal:
Record user decision D-0244-A = 2 in docs/INBOX.md and update state docs.

Decision:
- D-0244-A = 2 (user's explicit response: option 2 — defer)
- Move D-0244-A from Pending to Decided section

Expected result:
- docs/INBOX.md: D-0244-A moved to Decided with value = 2
- docs/LLMS.md: Last completed = 0245; INBOX decided count +1
- docs/wiki/current-state.md: INBOX state updated
- docs/tasks/done/0245-record-D-0244-A.md created
- docs/sessions/2026-05-14-record-D-0244-A.md created

No runtime. No src/. No deploy/tag/rollback. No secrets.
```

---

## Example 3 — n8n template-first task

**Situation:** need to create a new n8n workflow template (docs-only, no import yet).

```text
@docs/roadmap.md
@docs/wiki/task-id-preflight.md
@docs/tasks/templates/implementer-standard.md
@docs/tasks/templates/n8n-template-first-task.md
@docs/tasks/templates/final-report-contract.md

TASK DELTA:

Repository: mrhz1973/alina-lavoro
Task: 0246
Verified Last completed: 0245

Goal:
Create an importable n8n JSON template for the XYZ workflow and companion .md doc.

Deliverables:
- docs/automation/n8n-workflows/templates/xyz-workflow.template.json
- docs/automation/n8n-workflows/templates/xyz-workflow.template.md

Template requirements:
- active: false
- Manual Trigger only (no Schedule Trigger)
- Credential names are placeholders (REPLACE_WITH_…)
- No real tokens, chat_id, or OAuth material
- Full node wiring included

Expected result:
- Both template files created
- docs/tasks/done/0246-xyz-template.md created
- docs/sessions/2026-05-14-xyz-template.md created
- docs/LLMS.md: Last completed = 0246
- docs/wiki/current-state.md updated

No runtime. No n8n UI. No Execute. No import. No secrets.
```

---

## Example 4 — n8n UI supervised cleanup

**Situation:** user needs to clean up stale expressions in an existing n8n workflow. One step at a time.

```text
@docs/wiki/task-id-preflight.md
@docs/tasks/templates/implementer-standard.md
@docs/tasks/templates/n8n-ui-supervised-cleanup.md
@docs/tasks/templates/final-report-contract.md

TASK DELTA:

Repository: mrhz1973/alina-lavoro
Task: 0247
Verified Last completed: 0246

Goal:
Supervised cleanup of stale expression in "Build notification payload" node of
TEST - Alina task completion Telegram notifier.

Step (one step only — user will confirm before next):
1. In n8n UI, open node "Build notification payload".
2. Locate field scope_note.
3. Change expression from [stale expression] to [correct expression].
4. Click Save (do not Execute, do not change Schedule).
5. Report what you see.

No Execute. No Telegram send. No Schedule change. No runtime beyond this one node field change.
No src/. No deploy/tag/rollback. No secrets in repo.
```

---

## Example 5 — Post-runtime recording

**Situation:** a runtime step just succeeded (user confirmed). Record the result without re-executing.

```text
@docs/wiki/task-id-preflight.md
@docs/tasks/templates/implementer-standard.md
@docs/tasks/templates/state-update-batch.md
@docs/tasks/templates/final-report-contract.md

TASK DELTA:

Repository: mrhz1973/alina-lavoro
Task: 0248
Verified Last completed: 0247

Goal:
Record result of runtime task 0247 (cleanup succeeded, user confirmed) in state docs.

What happened (runtime — already done, not to be re-executed):
- Node "Build notification payload" scope_note updated in n8n UI by user.
- No Execute, no Telegram send, no Schedule change.
- User confirmed: OK.

Required updates:
- docs/LLMS.md: Last completed = 0248; note 0247 cleanup completed
- docs/wiki/current-state.md: Telegram workflow section updated
- docs/roadmap.md: compact note
- docs/tasks/done/0247-cleanup.md created (backfill for completed runtime task)
- docs/tasks/done/0248-post-runtime-recording.md created
- docs/sessions/2026-05-14-post-runtime-recording.md created

No new runtime. No re-execution. No n8n UI. No secrets.
```

---

## Example 6 — Multi-step docs-only batch

**Situation:** five related wiki files need to be created as part of operationalizing a new workflow. No real decision pending. Batch all five.

```text
@docs/roadmap.md
@docs/wiki/task-id-preflight.md
@docs/tasks/templates/implementer-standard.md
@docs/tasks/templates/docs-only-task.md
@docs/tasks/templates/final-report-contract.md

TASK DELTA:

Repository: mrhz1973/alina-lavoro
Tasks: 0249–0253
Verified Last completed: 0248

Goal:
Batch 0249–0253: operationalize the new XYZ workflow documentation layer.

Sub-tasks:
0249: Create docs/wiki/xyz-overview.md
0250: Create docs/wiki/xyz-step-by-step.md
0251: Create docs/wiki/examples/xyz-example.md
0252: Update docs/wiki/template-pack-index.md (add XYZ template)
0253: Update state docs (LLMS.md, current-state.md, token-efficiency.md, roadmap.md)

Allowed paths:
- docs/wiki/
- docs/wiki/examples/
- docs/tasks/done/
- docs/sessions/
- docs/LLMS.md
- docs/wiki/current-state.md
- docs/wiki/token-efficiency.md
- docs/wiki/template-pack-index.md
- docs/roadmap.md

Expected result:
[list files per sub-task]

No runtime. No src/. No deploy/tag/rollback. No secrets.
```

---

## Example 7 — Bad vs good V3.1 compact prompt

### Bad (old style — avoid)

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
...
[150 more lines of repeated constraints]

TASK:
Update docs/LLMS.md to say Last completed = 0240.
```

Problems:
- 200+ lines for a 3-line task.
- Reads PROJECT_STATE.md and CHECKPOINT.md by default (wasted tokens).
- Repeats git rules, security rules, report format — all already in templates.
- Forces implementer to find the actual task buried in boilerplate.

### Good (V3.1 style)

```text
@docs/roadmap.md
@docs/wiki/task-id-preflight.md
@docs/tasks/templates/implementer-standard.md
@docs/tasks/templates/state-update-batch.md
@docs/tasks/templates/final-report-contract.md

TASK DELTA:

Repository: mrhz1973/alina-lavoro
Task: 0240
Verified Last completed: 0239

Goal:
Update docs/LLMS.md and docs/wiki/current-state.md to Last completed = 0240.
Create docs/tasks/done/0240-state-update.md and docs/sessions/2026-05-14-state-update.md.

No runtime. No src/. No deploy/tag/rollback. No secrets.
```

Why it is better:
- ~12 lines of delta instead of 200+.
- All standard rules are in the templates.
- `task-id-preflight.md` prevents stale task ID.
- `roadmap.md` provides workstream context.
- `final-report-contract.md` covers the report format completely.

---

## Quick reference: what NOT to include in a delta prompt

| Do not include | Reason |
|---|---|
| Full git workflow | Already in `implementer-standard.md` |
| Security constraints list | Already in `implementer-standard.md` + task template |
| Final report format | Covered by `final-report-contract.md` |
| `@docs/PROJECT_STATE.md` | Fallback only — never default |
| `@docs/CHECKPOINT.md` | Restart context only — never default |
| Repeated boilerplate from prior sessions | Templates cover it |
| Full INBOX history | Only if a new DP is introduced |

---

## Location

This cookbook lives at `docs/wiki/examples/v31-compact-workflow-cookbook.md`.

Navigation entry: `docs/wiki/token-efficiency.md` → "V3.1 compact workflow cookbook?"
