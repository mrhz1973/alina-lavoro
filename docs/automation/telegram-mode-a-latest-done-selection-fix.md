# Telegram Mode A — Latest Done Selection Fix

**Date:** 2026-05-14
**Incident tasks:** 0246 (bug record), 0247 (fix record), 0248 (validation record)
**Related workflow:** `TEST - Alina task completion Telegram notifier`
**Status:** Fixed and manually validated. Scheduled post-fix tick pending observation.

---

## Incident summary

After Telegram Mode A activation (batch 0227–0231, 2026-05-14), scheduled executions were succeeding but sending no Telegram notifications. Investigation revealed the node `Pick latest done file` was consistently selecting task **0232** instead of the actual latest task **0245**.

## Root cause

`Pick latest done file` used order-dependent selection:

```javascript
const latest = files[files.length - 1];
```

This relies on GitHub returning `docs/tasks/done/` directory entries in ascending alphabetical order. This assumption is **not reliable** and failed in practice, causing the node to select an older task.

Because 0232 was already in `alina_telegram_notifier_state`, the idempotency logic correctly skipped it on every tick — resulting in silent success with no Telegram.

**This was not an idempotency bug.** The duplicate-skip logic worked correctly. The bug was upstream in task selection.

## Bad pattern (do not use)

```javascript
// BAD — order-dependent, relies on GitHub response ordering
const latest = files[files.length - 1];
```

## Required pattern (correct)

```javascript
// GOOD — numeric sort, always selects highest task ID
const doneFiles = files.filter(f => /^\d{4}-.*\.md$/.test(f.name) && f.name !== '.gitkeep');
const sorted = doneFiles.sort((a, b) => {
  const idA = parseInt(a.name.substring(0, 4), 10);
  const idB = parseInt(b.name.substring(0, 4), 10);
  return idB - idA; // descending
});
const latest = sorted[0];
```

Key requirements:
- Filter `docs/tasks/done/*.md` entries only (exclude `.gitkeep`, exclude non-task files).
- Parse the four-digit numeric prefix from each filename.
- Sort **descending** by numeric task ID.
- Select index `[0]` (highest numeric ID).

## Expected idempotency behavior after fix

1. `Pick latest done file` selects the task with the highest numeric ID in `docs/tasks/done/`.
2. `Build idempotency key` generates `<path>::<sha>`.
3. `Load notification state` checks `alina_telegram_notifier_state` for that key.
4. If **not found** → TRUE branch → send Telegram → store row. (New task notification.)
5. If **found** → FALSE branch → skip. (Duplicate-skip, already notified.)

This means: after a manual send for task N, the next scheduled tick for the same task N will always duplicate-skip correctly.

## Diagnostic signs of this bug

If you observe:

- Workflow executions show **Succeeded** in the n8n execution list.
- No new Telegram notifications arriving.
- `Decide send or skip` shows **FALSE branch** in execution output.
- The `task_id` seen in execution output is **lower than** the `Last completed` value in `docs/LLMS.md`.

→ **Inspect `Pick latest done file`** first. Compare its `task_id` output against `Last completed` in `docs/LLMS.md`. If they differ, the selection logic is stale or order-dependent.

## Validation checklist

Before declaring fix stable after reactivation:

- [ ] `Pick latest done file` outputs the latest numeric task ID (matching `Last completed` in `docs/LLMS.md`).
- [ ] `Get done file` reads the same task file.
- [ ] `Build idempotency key` outputs `idempotency_ready = true` with a key for that task.
- [ ] Manual execution sends Telegram for that task (if not previously notified).
- [ ] Next scheduled tick duplicate-skips that task (FALSE branch, no Telegram, no new Data Table row).

## Current validation status (2026-05-14) — COMPLETE

| Check | Status |
|-------|--------|
| `Pick latest done file` outputs task_id 0245 | ✅ Validated (node-level test) |
| `Get done file` reads task 0245 | ✅ Validated (node-level test) |
| `Build idempotency key` ready for 0245 | ✅ Validated (node-level test) |
| Manual execution: Telegram 0245 arrived | ✅ Validated (user report, task 0248) |
| First scheduled tick post-fix: Telegram for new task 0250 | ✅ Validated (user report, task 0251) |
| Second scheduled tick post-fix: duplicate-skip task 0250 | ✅ Validated (user report, task 0252) |

**Note on first scheduled tick:** Between the manual validation run and the first scheduled tick, docs batch 0246–0250 was committed, creating newer done markers. The first scheduled tick correctly selected task 0250 (the new latest), sent a Telegram (unnotified task), and the second tick correctly skipped it (duplicate-skip).

**Telegram Mode A is declared stable-after-fix** as of 2026-05-14 (tasks 0251–0253).

## Monitoring reference

- Monitoring checklist: `docs/automation/telegram-mode-a-post-activation-monitoring-checklist.md`
- Stabilization plan: `docs/automation/telegram-mode-a-post-activation-stabilization-plan.md`
