---
task: "0246"
date: 2026-05-14
type: docs-only / incident record
status: done
---

# Task 0246 — Record Telegram Mode A latest-done selection bug

## Context

Telegram Mode A was active as scheduled notification-only (Schedule Trigger every 5 minutes, activated batch 0227–0231, 2026-05-14). After initial activation success (first tick: Telegram 0245 arrived, reported batch 0227–0231), subsequent scheduled executions showed no new Telegram notifications.

## Symptom

- Workflow `TEST - Alina task completion Telegram notifier` showed recent executions as **Succeeded** in the n8n execution list.
- No new Telegram messages were arriving despite new completed tasks in `docs/tasks/done/`.
- GitHub Last completed was already **0245**.
- In a succeeded execution, node `Decide send or skip` showed **FALSE branch** for task **0232**.

## Observed behavior

- `Pick latest done file` was returning task `0232` as the "latest" done file.
- `Build idempotency key` generated key for 0232.
- `Load notification state` found an existing row for 0232 in `alina_telegram_notifier_state`.
- `Decide send or skip` correctly skipped (FALSE branch) because 0232 was already notified.
- Result: no Telegram, no duplicate — idempotency logic was working correctly.

## Root cause

`Pick latest done file` used order-dependent selection:

```javascript
const latest = files[files.length - 1];
```

This relies on GitHub returning `docs/tasks/done/` entries in ascending alphabetical order and selecting the last item. However, this is **not guaranteed** and failed in practice: the node was selecting task 0232 instead of the actual latest task 0245.

## Classification

- **Not** an idempotency failure.
- **Not** a duplicate-send risk.
- **Stale latest-done selection**: `Pick latest done file` was picking an older task due to order-dependent selection logic.

## Impact

- No new Telegram notifications sent since at least the first batch after initial activation.
- Idempotency logic worked correctly on the stale task ID; no spurious sends occurred.
- Telegram Mode A was effectively silent (succeeded but skipped every execution).

## Required fix

Replace `files[files.length - 1]` with robust selection:
- Filter `docs/tasks/done/*.md` (exclude `.gitkeep`).
- Parse four-digit numeric prefix from each filename.
- Sort descending by numeric task ID.
- Select the item with the highest task ID.

See: `docs/automation/telegram-mode-a-latest-done-selection-fix.md`

## Constraints

- No app source changes.
- No provider API LLM.
- No secrets recorded.

## Done status

Completed by: Claude Code (docs-only, incident record)
Task: 0246
