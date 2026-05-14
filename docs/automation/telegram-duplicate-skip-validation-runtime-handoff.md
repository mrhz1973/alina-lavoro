# Telegram Duplicate-Skip Validation Runtime Handoff

**Document:** Runtime handoff for duplicate-skip validation  
**Authorization:** D-0187-A = 1 (recorded batch 0188–0190, 2026-05-14)  
**Type:** docs-only / runtime handoff document  
**Status:** active — awaiting one manual duplicate-skip validation run

---

## 1. Purpose

D-0187-A = 1 opens exactly one duplicate-skip validation run.

This document is the handoff for the next n8n UI validation execution. It defines the expected behavior, success criteria, failure criteria, and the single authorized runtime micro-step.

**This document itself is docs-only.** No n8n UI action is taken by creating this document. No Telegram message is sent. No runtime is performed.

---

## 2. Current workflow

**Workflow name:** `TEST - Alina task completion Telegram notifier`

**Current implemented node chain (by user report, task 0185, 2026-05-14):**

```
Manual Trigger
→ List done files
→ Pick latest done file
→ Get done file
→ Build idempotency key
→ Load notification state
→ Normalize notification state
→ Decide send or skip (IF {{ $json.notification_state_decision === "send" }})
  ├─ true → Build notification payload → Send a text message → Store notification state
  └─ false → (skip path — no Telegram send)
```

**Data Table:** `alina_telegram_notifier_state` — created and one row written from first test.

**Workflow status:** Inactive / manual-only — no Schedule Trigger present or enabled.

**No automatic behavior is active.** The workflow can only be triggered manually by the user in the n8n UI.

---

## 3. Scope authorized by D-0187-A = 1

The following is authorized for exactly one future manual execution:

- One manual Execute workflow only
- Use the same latest done file from the first test (to trigger duplicate detection)
- Expected result: duplicate detection for same idempotency key
- Expected result: `Decide send or skip` routes to false branch
- Expected result: no Telegram message sent
- Expected result: no new Data Table row inserted
- Workflow remains inactive/manual-only throughout

---

## 4. Scope not authorized

The following remain explicitly outside this gate:

- Second validation run (only one is authorized)
- Schedule Trigger activation
- Automatic notifications
- Queue reader modification (`TEST - GitHub list Alina task queue`)
- Workflow JSON export/import
- Telegram bot token or chat id in repo/docs/AI chat
- Provider API LLM (OpenAI, Anthropic, OpenRouter, etc.)
- New billing or recurring costs
- App/deploy/tag/rollback
- Automatic INBOX responses
- Automatic `D-NNNN-X = N` writing

---

## 5. Expected result

When the workflow is executed manually for the same done file used in the first test:

1. **Load notification state** finds existing row for the same idempotency key in `alina_telegram_notifier_state`
2. **Normalize notification state** outputs:
   - `notification_state_found = true`
   - `notification_state_decision = skip_duplicate`
   - `notification_state_reason = idempotency_key_already_exists`
3. **Decide send or skip** evaluates `{{ $json.notification_state_decision === "send" }}` → false
4. **False branch routing:** skip path taken, no Telegram send
5. **Send a text message** does not execute
6. **Store notification state** does not execute
7. **No Telegram message arrives** in the chat

**Validation success indicator:** n8n execution log shows the skip path was taken with reason "idempotency_key_already_exists" or similar.

---

## 6. Failure result

Stop immediately and document failure if any of the following occurs:

| Failure | Stop Condition |
|---------|---------------|
| Telegram message arrives | Duplicate-skip failed — investigate state-store lookup logic |
| `Store notification state` executes and inserts another row | Duplicate-skip failed — IF condition or routing bug |
| Workflow errors before lookup | Validation inconclusive — check node configuration |
| Schedule Trigger appears | Stop — not authorized by D-0187-A |
| Queue reader workflow touched | Stop — unrelated workflow must not be modified |
| Second validation run attempted | Stop — only one run is authorized |

**On any failure:** Disable workflow if necessary, document the incident in a session file, and do not proceed without a new explicit decision.

---

## 7. First runtime micro-step recommendation

> **Do this and nothing more for this validation run:**
>
> 1. Open n8n UI.
> 2. Open workflow `TEST - Alina task completion Telegram notifier`.
> 3. Confirm workflow is inactive (no green "Active" toggle).
> 4. Confirm no Schedule Trigger node is present.
> 5. Execute workflow once using Manual Trigger (same done file as first test).
> 6. Observe execution path:
>    - IF branch should route false (skip)
>    - No "Send a text message" execution
>    - No "Store notification state" execution
> 7. Verify no Telegram message arrives.
> 8. Verify no new row in `alina_telegram_notifier_state`.
> 9. Stop and report: `duplicate skip riuscito` or `duplicate skip errore`.

**Do not run twice.** One execution is authorized. If the first execution fails, stop and report before any retry.

---

## 8. After validation

If duplicate-skip validation succeeds:
- Document success in session file
- Consider returning to schedule activation gate (separate future Decision Packet)
- Workflow remains manual-only until schedule gate is explicitly opened

If duplicate-skip validation fails:
- Document failure in session file
- Do not proceed to schedule activation
- Investigate and fix before retry

---

## 9. Cross-references

| Document | Role |
|----------|------|
| `docs/automation/telegram-notifier-idempotency-state-store-implementation-design.md` | Full design: key model, state-store schema, send/skip algorithm |
| `docs/automation/telegram-notifier-idempotency-implementation-checklist.md` | Step-by-step checklist; §6 duplicate skip validation |
| `docs/automation/telegram-notifier-runbook-idempotency-hardening.md` | Permanent boundaries, stop conditions, rollback procedures |
| `docs/automation/telegram-mode-a-completion-notification-mvp.md` | Phase table with current status |
| `docs/automation/telegram-idempotency-runtime-ui-handoff.md` | Original runtime handoff for implementation phase |
| `docs/INBOX.md` | D-0187-A = 1 decision record |
| `docs/automation/candidate-gate-backlog.md` | Candidate D state and next gate planning |

---

*This document is docs-only. No runtime was performed. No n8n UI action. No Telegram message. No Schedule Trigger. No token or chat id in repo. Authorization: D-0187-A = 1 (batch 0188–0190, 2026-05-14).*
