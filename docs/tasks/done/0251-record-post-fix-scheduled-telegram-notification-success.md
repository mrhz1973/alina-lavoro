---
task: "0251"
date: 2026-05-14
type: docs-only / validation record
status: done
---

# Task 0251 — Record post-fix scheduled Telegram notification success

## Context

After the `Pick latest done file` fix (task 0247) and manual validation for task 0245 (task 0248), the workflow was reactivated with the Schedule Trigger running every 5 minutes.

Between the manual validation run and the first scheduled tick, docs batch 0246–0250 was committed. This created new done marker files in `docs/tasks/done/`, making the latest done task **0250**, not 0245.

## First scheduled tick result

**success / Telegram arrived**

The first scheduled tick after reactivation correctly selected the **new latest done task (0250)** — not 0245. Because task 0250 had not yet been notified, the workflow took the TRUE branch and sent a Telegram notification.

## Why this was correct behavior

- The expectation recorded in task 0250 was that the first scheduled tick would duplicate-skip 0245 (the task notified by the manual run).
- That expectation was superseded by the docs batch 0246–0250, which created newer done markers.
- `Pick latest done file` (after the fix) correctly selected the highest numeric task ID: 0250.
- `Load notification state` found no row for task 0250 → TRUE branch → Telegram sent.

This is **not** a duplicate anomaly. This is the correct expected behavior of the fixed workflow when a new unnotified task exists.

## Constraints

- No app source changes.
- No provider API LLM.
- No secrets recorded.
- No real Chat ID, token, or credential recorded.

## Done status

Completed by: Claude Code (docs-only, validation record)
Task: 0251
