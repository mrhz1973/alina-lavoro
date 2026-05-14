---
task: "0247"
date: 2026-05-14
type: docs-only / runtime fix record
status: done
---

# Task 0247 — Record `Pick latest done file` runtime fix

## Node fixed

`Pick latest done file`

## Workflow

`TEST - Alina task completion Telegram notifier`

## Workflow status during fix

Workflow was kept **inactive** during the entire fix and validation sequence. No scheduled executions occurred during this window.

## Fix applied (user action under orchestrator supervision)

Replaced order-dependent selection:

```javascript
const latest = files[files.length - 1];
```

With robust selection by highest numeric task ID:

- Filter `docs/tasks/done/*.md` entries (exclude `.gitkeep`).
- Parse four-digit numeric prefix from each filename.
- Sort descending by numeric task ID.
- Select the item with the highest numeric task ID.

## Validation performed

After the fix was applied, individual node execution was used to verify each step in the pipeline:

| Node | Output |
|------|--------|
| `Pick latest done file` | `task_id = 0245` |
| `Get done file` | Read `docs/tasks/done/0245-update-state-after-next-low-touch-backlog-batch.md`, sha `da1a4e96245d26901ddcd561a0936f335946a0db` |
| `Build idempotency key` | `idempotency_ready = true`, `idempotency_key = docs/tasks/done/0245-update-state-after-next-low-touch-backlog-batch.md::da1a4e96245d26901ddcd561a0936f335946a0db` |

## Constraints

- Fix performed in n8n UI by user under orchestrator supervision. No implementer runtime.
- No app source changes.
- No provider API LLM.
- No secrets recorded.
- No download_url values recorded.

## Done status

Completed by: Claude Code (docs-only, fix record)
Task: 0247
