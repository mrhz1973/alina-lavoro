# Task 0193 — Create Duplicate-Skip Retry Same-Key Decision Packet

**Task:** 0193
**Date:** 2026-05-14
**Type:** docs-only
**Authorization:** D-0187-A = 1 (consumed in task 0191)

---

## 1. Purpose

Create a new pending Decision Packet D-0193-A to authorize, if the user chooses, exactly one manual duplicate-skip retry against the same currently stored 0190 idempotency key. This would provide a valid duplicate-skip validation by re-executing the workflow with the same done file that was just sent/stored in the D-0187-A run.

---

## 2. Context

**D-0187-A outcome (task 0191):**
- Authorized exactly one duplicate-skip validation run
- Run executed once under D-0187-A = 1
- Result: INCONCLUSIVE
- Reason: "Pick latest done file" selected task 0190 (newer than the original test)
- Idempotency key changed from original test to new key
- Workflow correctly executed send/store for new key
- Duplicate-skip logic (false branch) was not tested
- D-0187-A is now consumed and closed

**Current state:**
- Workflow: `TEST - Alina task completion Telegram notifier`
- Status: inactive/manual-only, no Schedule Trigger
- Data Table `alina_telegram_notifier_state`: one row for task 0190
- Idempotency key: `docs/tasks/done/0190-update-duplicate-skip-validation-cross-references.md::59f44f9af63c07161d12b2228a5c897bfb61aeae`
- No further runtime run is authorized without a new Decision Packet

---

## 3. Decision Packet D-0193-A

**Decision ID:** D-0193-A
**Kind:** automation
**Data:** 2026-05-14
**inbox_status:** pending (to be added to docs/INBOX.md)

## Contesto

D-0187-A = 1 authorized exactly one duplicate-skip validation run. The run was executed (task 0191, 2026-05-14). The result was INCONCLUSIVE because "Pick latest done file" selected task 0190 (the most recent done file at execution time), which generated a different idempotency key from the original test. The workflow correctly executed the send/store path for the new 0190 key. The duplicate-skip logic (false branch) was not tested. D-0187-A is now consumed. A new Decision Packet is required to authorize a retry against the same 0190 idempotency key.

## Perché serve decisione

A duplicate-skip retry against the same 0190 key is a runtime action. Even though it is the same workflow and the same done file, it requires an explicit human gate per project policy. The retry would test the duplicate-skip logic by re-executing the workflow with an idempotency key that already exists in the Data Table.

## Opzioni

1. **Authorize exactly one duplicate-skip retry against the same 0190 key** — authorize one future manual Execute workflow with the same done file (task 0190) that was just sent/stored. Expected result: duplicate detection, false branch routing, no Telegram message, no new Data Table row. This would validate the duplicate-skip logic conclusively.

2. **Do not retry duplicate-skip now** — skip the retry for now. The duplicate-skip logic remains unvalidated. Schedule activation remains separately gated. The workflow remains manual-only. The user may return to this gate later if desired.

## Raccomandazione orchestratore

Option 1, as a narrow runtime gate for duplicate-skip validation only. The retry would conclusively test the duplicate-skip logic by using the same 0190 idempotency key that is already stored. If the retry succeeds (false branch, no Telegram send, no new row), the duplicate-skip implementation is validated and schedule activation can proceed as a separate future gate. If the retry fails (duplicate Telegram message), the idempotency implementation must be investigated and fixed before proceeding.

## Rischio principale

Scope creep from retry toward schedule activation or repeated Telegram messages without separate gates. The retry must be exactly once, with the same 0190 done file, and must stop immediately if a duplicate message is sent.

## Impatto

- App Alina: no impact.
- GitHub docs: this task records the Decision Packet creation only.
- Runtime: no runtime performed by this task; retry execution is a future manual user step if D-0193-A = 1.
- n8n: no workflow modification by this task.
- INBOX: remains source of truth; Telegram must not answer it.
- Gate 7: no impact; remains closed.
- Provider API LLM: no impact; still forbidden by default.
- Billing: no new LLM billing.

## Micro-interazioni umane eliminate

0 immediately. After duplicate-skip is validated and schedule is activated, Telegram Mode A may reduce manual checking burden.

## Scelta richiesta

`D-0193-A = 1` per autorizzare esattamente un retry duplicate-skip contro la stessa chiave 0190.
`D-0193-A = 2` per non riprovare ora; la validazione duplicate-skip rimane non conclusa.

## Cosa succede dopo la scelta

If `D-0193-A = 1`: user may manually execute the workflow once with the same 0190 done file. Expected: duplicate detection, false branch, no Telegram send, no new Data Table row. If successful, duplicate-skip logic is validated. Schedule activation gate may follow as a separate future Decision Packet.

If `D-0193-A = 2`: no retry is authorized. Duplicate-skip logic remains unvalidated. Schedule activation remains separately gated. The workflow remains manual-only.

## Cosa NON verrà fatto senza ulteriore gate

This decision does not authorize:
- Second retry run (only one is authorized if Option 1 is chosen);
- Schedule Trigger activation;
- Automatic notifications;
- Queue reader workflow modification;
- Workflow JSON export/import;
- Token or chat id in repo/docs/AI chat;
- Provider API LLM;
- New billing;
- App/deploy/tag/rollback;
- Automatic INBOX responses;
- Automatic `D-NNNN-X = N` writing.

If option 1 is chosen, the scope is limited to:
- One manual Execute workflow only;
- Same done file (task 0190) that was just sent/stored;
- Expected duplicate detection for same idempotency key;
- Expected false branch routing;
- Expected no Telegram message;
- Expected no new Data Table row;
- Stop immediately if duplicate message is sent.

---

## 4. INBOX update

D-0193-A is added to `docs/INBOX.md` as Pending with the full Decision Packet content above. The INBOX entry includes:

- inbox_status: pending
- created_at: 2026-05-14
- source_task: 0193-create-duplicate-skip-retry-same-key-decision-packet
- source_document: docs/tasks/done/0191-record-duplicate-skip-validation-inconclusive-due-to-new-latest-done-file.md
- response: (pending)
- decided_at: (pending)
- archive_policy: keep

---

## 5. Current state after this task

**Decision Packets:**
- D-0187-A: Decided = 1, consumed, result inconclusive
- D-0193-A: Pending (added to INBOX.md in this batch)

**Workflow state:**
- Inactive / manual-only
- No Schedule Trigger
- Data Table `alina_telegram_notifier_state`: one row for task 0190
- Idempotency key: `docs/tasks/done/0190-update-duplicate-skip-validation-cross-references.md::59f44f9af63c07161d12b2228a5c897bfb61aeae`

**Next step:**
- User decision on D-0193-A (Option 1: authorize retry, Option 2: do not retry)
- If Option 1: one manual Execute workflow with the same 0190 done file, expected false branch
- If Option 2: no retry; schedule activation gate remains separately gated

---

## 6. Files changed in this batch

- `docs/tasks/done/0191-record-duplicate-skip-validation-inconclusive-due-to-new-latest-done-file.md` — inconclusive validation record
- `docs/tasks/done/0192-update-telegram-idempotency-validation-documentation.md` — documentation updates
- `docs/tasks/done/0193-create-duplicate-skip-retry-same-key-decision-packet.md` — this file
- `docs/INBOX.md` — add D-0193-A as Pending
- `docs/LLMS.md` — update task state and INBOX state
- `docs/wiki/current-state.md` — update Telegram Mode A state
- `docs/wiki/token-efficiency.md` — optional pointer update
- `docs/automation/telegram-notifier-idempotency-implementation-checklist.md` — clarify validation conditions
- `docs/automation/telegram-idempotency-runtime-ui-handoff.md` — clarify validation conditions
- `docs/automation/telegram-notifier-idempotency-state-store-implementation-design.md` — clarify validation conditions
- `docs/automation/telegram-notifier-runbook-idempotency-hardening.md` — clarify validation conditions
- `docs/automation/telegram-mode-a-completion-notification-mvp.md` — clarify validation conditions
- `docs/automation/candidate-gate-backlog.md` — add D-0193-A as pending gate
- `docs/roadmap.md` — reflect D-0193-A as next runtime gate
- `docs/sessions/2026-05-14-duplicate-skip-validation-inconclusive-and-retry-gate.md` — session report

---

## 7. Forbidden actions respected

This task is docs-only. No runtime actions were performed:

- No n8n UI action
- No workflow modification
- No Telegram test
- No Schedule Trigger activation
- No token/chat id in repo/docs/AI chat
- No workflow JSON export/import
- No API key creation
- No provider API usage
- No new billing
- No app/deploy/tag/rollback

---

*This task is docs-only. No runtime was performed. D-0193-A Decision Packet created and added to INBOX.md as Pending. No retry is authorized until user responds to D-0193-A.*
