# Session — Telegram Mode A latest-done selection fix

**Date:** 2026-05-14
**Batch:** 0246–0250
**Type:** docs-only / incident record + state update
**Branch:** main

---

## Context

Telegram Mode A was active as scheduled notification-only (every 5 minutes). After initial activation (batch 0227–0231, first tick Telegram arrived), subsequent scheduled executions were succeeding but not sending new Telegram notifications.

## Investigation

- n8n execution log: recent executions showed **Succeeded**.
- In a succeeded execution: `Decide send or skip` output showed **FALSE branch** for task **0232**.
- GitHub state: Last completed = **0245**.
- Conclusion: idempotency was working correctly for task 0232 (already notified). The bug was upstream.

## Root cause

`Pick latest done file` used order-dependent selection:

```javascript
const latest = files[files.length - 1];
```

GitHub `docs/tasks/done/` directory listing is not guaranteed to be in ascending order. In practice, this returned task 0232 rather than the actual latest task 0245.

Classification: **stale latest-done selection** — not an idempotency failure.

## Fix (user action under orchestrator supervision)

- Workflow kept **inactive** during entire fix + validation sequence.
- Node `Pick latest done file` modified: replaced order-dependent selection with numeric sort descending by four-digit task ID prefix.
- Node-level validation:
  - `Pick latest done file`: task_id = 0245 ✅
  - `Get done file`: read `docs/tasks/done/0245-update-state-after-next-low-touch-backlog-batch.md`, sha `da1a4e96245d26901ddcd561a0936f335946a0db` ✅
  - `Build idempotency key`: `idempotency_ready = true`, key for 0245 ✅

## Manual validation

One full manual execution performed (workflow inactive, Manual Trigger):
- **Result: success / Telegram 0245 arrived** ✅

## Post-validation status

- Latest-done selection fix: validated.
- Manual send for task 0245: validated.
- **First scheduled tick post-fix: pending observation.**
  - Expected: duplicate-skip 0245 (already notified by manual run), no Telegram.
- Telegram Mode A is **not declared stable-after-fix** until scheduled post-fix tick is confirmed.

## Documents created / updated

| Action | File |
|--------|------|
| Created | `docs/tasks/done/0246-record-telegram-mode-a-latest-done-selection-bug.md` |
| Created | `docs/tasks/done/0247-record-pick-latest-done-file-runtime-fix.md` |
| Created | `docs/tasks/done/0248-record-manual-validation-telegram-0245-success.md` |
| Created | `docs/automation/telegram-mode-a-latest-done-selection-fix.md` |
| Updated | `docs/automation/telegram-mode-a-post-activation-stabilization-plan.md` (section 10 added) |
| Updated | `docs/automation/telegram-mode-a-post-activation-monitoring-checklist.md` (section 3b added) |
| Created | `docs/tasks/done/0249-update-telegram-mode-a-monitoring-after-latest-done-fix.md` |
| Created | `docs/tasks/done/0250-update-state-after-telegram-latest-done-fix-manual-validation.md` |
| Created | `docs/sessions/2026-05-14-telegram-mode-a-latest-done-selection-fix.md` (this file) |
| Updated | `docs/LLMS.md` — Last completed = 0250 |
| Updated | `docs/wiki/current-state.md` — Last completed = 0250 |
| Updated | `docs/wiki/token-efficiency.md` — navigation entry added |
| Updated | `docs/roadmap.md` — compact paragraph added |

## Constraints confirmed

- No app source changes.
- No deploy/tag/rollback.
- No provider API LLM.
- No new billing.
- No token/chat_id/credential secret/OAuth material/tokenized URL recorded.
- No n8n runtime by implementer.
- No n8n UI by implementer.
- No workflow Execute by implementer.
- No Telegram send by implementer.
- No Schedule change by implementer.
