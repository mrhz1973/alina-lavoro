# Task 0229 — Create Post-Activation Monitoring and Disable Checklist

**Date:** 2026-05-14
**Type:** docs-only
**Batch:** 0227–0231

---

## Summary

Created post-activation monitoring and disable checklist for Telegram Mode A, now that the Schedule Trigger is active.

**File created:** `docs/automation/telegram-mode-a-post-activation-monitoring-checklist.md`

---

## Checklist covers

- Active workflow: `TEST - Alina task completion Telegram notifier`
- Schedule interval: every 5 minutes
- Expected behavior: new unnotified done task → one Telegram notification → Store notification state writes row; already-notified done task → duplicate-skip → no duplicate Telegram.
- What to watch: duplicate Telegrams, failed scheduled executions, Store notification state errors, wrong workflow activation, Telegram content remains notification-only.
- Immediate abort/disable criteria: repeated duplicate notifications, INBOX-answering behavior, queue reader modified, wrong workflow active, secrets exposed, unexpected schedule frequency.
- Disable procedure concept: deactivate workflow or disable Schedule Trigger node in n8n UI, then report.
- Documentation rule: any incident must be recorded in docs before further activation changes.
- Security: no real Chat ID/token/credential export in docs/chat.

---

## What this task does NOT do

- Docs-only. No runtime by implementer.
- No n8n UI action.
- No Telegram send.
- No schedule modification.
- No secrets recorded.

---

## References

- `docs/automation/telegram-mode-a-post-activation-monitoring-checklist.md` (created by this task)
- `docs/tasks/done/0228-record-controlled-telegram-mode-a-schedule-activation-success.md`

---

*Docs-only. No runtime. Active schedule monitoring expectations documented. Disable/abort criteria documented.*
