# Task 0227 — Record Telegram Mode A Pre-Schedule Cleanup Success

**Date:** 2026-05-14
**Type:** docs-only / post-runtime record
**Batch:** 0227–0231

---

## Summary

The user performed the supervised cleanup of workflow `TEST - Alina task completion Telegram notifier` in the n8n UI, satisfying the cleanup-first requirement from D-0221-A = 3.

---

## Cleanup performed

**Workflow:** `TEST - Alina task completion Telegram notifier`

### Cleanup 1 — Build notification payload scope_note

- **Old wording (stale):** "Payload only. D-0165-A allows workflow creation only. No Telegram test message authorized."
- **New wording:** "Payload only. Telegram Mode A notification-only. No INBOX response, no decision writing, no Schedule Trigger activation by this node."
- The replacement is descriptive only; no behavioural effect on the node.
- No real Chat ID, token, or credential name introduced.
- Reaffirms notification-only nature and no-INBOX-answer constraint.

### Cleanup 2 — Store notification state short_hash mapping

- **Old mapping (empty):** `{{ "" }}`
- **New mapping:** `{{ $('Build notification payload').first().json.short_hash }}`
- Maps `short_hash` from the upstream `Build notification payload` node output.
- Primary idempotency key logic unchanged — duplicate-skip remains conclusively validated (D-0209-A).

---

## What was NOT done

- No Execute step pressed during cleanup.
- No workflow Execute pressed during cleanup.
- No Telegram send caused by cleanup itself.
- No Schedule Trigger activation caused by cleanup itself.
- No queue reader modification.
- No secrets, tokens, Chat ID, or OAuth material recorded.
- No workflow import/export.
- No app/deploy/tag/rollback.

---

## Cleanup-first requirement satisfied

D-0221-A = 3 required cleanup before Schedule Trigger activation. Both cleanup candidates identified in `docs/automation/telegram-mode-a-pre-schedule-cleanup-plan.md` are now addressed:
- B.1 (stale scope_note) — resolved.
- B.2 (short_hash empty mapping) — resolved.

No new risk was found during the cleanup process.

The conditional follow-on activation intent recorded with D-0221-A = 3 may now be applied:
proceed toward controlled Schedule Trigger activation per `docs/automation/telegram-mode-a-schedule-activation-supervision-checklist.md`.

---

## References

- `docs/INBOX.md` — D-0221-A = 3 decided (cleanup-first path)
- `docs/automation/telegram-mode-a-pre-schedule-cleanup-plan.md` — cleanup plan (now closed)
- `docs/automation/telegram-mode-a-schedule-activation-supervision-checklist.md`
- `docs/tasks/done/0224-record-d0221a-cleanup-first-conditional-activation-intent.md`

---

*Docs-only record. No runtime by implementer. No n8n UI action by implementer. No Telegram send. No secrets recorded.*
