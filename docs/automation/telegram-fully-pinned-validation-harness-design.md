# Telegram Fully-Pinned Validation Harness Design

**Task:** 0201 (created)
**Date:** 2026-05-14
**Type:** docs-only / pre-runtime harness design
**Authorization prerequisite:** D-0202-A must be decided before any n8n UI step described here
**Status:** design preserved for audit — **D-0202-A SUPERSEDED** by D-0206-A (template-first policy, batch 0204–0208, 2026-05-14); **D-0206-A = 1 decided/applied** (import/inspection ok, 2026-05-14); **D-0209-A = 1 decided/applied/completed** (`fully pinned duplicate skip succeeded`, 2026-05-14) — duplicate-skip **conclusively validated** on fully-pinned harness; **D-0213-A pending** for Telegram Mode A schedule activation (notification-only; separate gate)

---

## 1. Purpose

Replace the partial-override approach (which failed in D-0197-A) with a clean, fully-pinned TEST-only harness that guarantees all downstream nodes use pinned values and none reference dynamic upstream outputs.

The D-0197-A attempt showed that inserting a Set/Edit Fields override node between `Build idempotency key` and `Load notification state` is insufficient: downstream nodes may still reference earlier dynamic nodes by name, bypassing the override. See `docs/tasks/done/0200-document-pinned-validation-failure-root-cause.md` for the root cause analysis.

This design is **docs-only**. No runtime is authorized. The n8n UI inspection/repair steps require **D-0202-A = 1** before any action.

---

## 2. Core principle: no dynamic upstream references

The fully-pinned harness must satisfy one absolute rule:

**No downstream node in the pinned test chain may contain any expression that references a dynamic upstream node by name.**

Specifically, no expression may reference:
- `$('Manual Trigger').*`
- `$('List done files').*`
- `$('Pick latest done file').*`
- `$('Get done file').*`
- `$('Build idempotency key').*`

All downstream nodes must read their input exclusively from `$json.*` (current item data flowing from the immediately previous node in the chain) or from static/literal values.

---

## 3. Target harness shape

The fully-pinned TEST-only workflow should have this chain:

```
Manual Trigger
→ Static pinned input (Set node with fixed values)
→ Load notification state
→ Normalize notification state
→ Decide send or skip
→ [true] Build notification payload → Send a text message → Store notification state
→ [false] (no action — duplicate skip confirmed)
```

The following dynamic nodes are **removed or disabled** from the pinned harness:
- `List done files`
- `Pick latest done file`
- `Get done file`
- `Build idempotency key`
- `Override pinned idempotency key` (the partial fix — no longer needed)

---

## 4. Static pinned input node

A single Set/Edit Fields node named `Static pinned input` (or equivalent) provides exactly these fields as its output:

| Field | Value |
|-------|-------|
| task_id | The pinned task ID (e.g., `0193`) |
| done_file_path | The pinned done file path (e.g., `docs/tasks/done/0193-create-duplicate-skip-retry-same-key-decision-packet.md`) |
| done_file_sha | The pinned SHA (e.g., `5d8b3a23c286ae0bc52c041ae789f4a02ee9754e`) |
| idempotency_key | The pinned key (e.g., `docs/tasks/done/0193-create-duplicate-skip-retry-same-key-decision-packet.md::5d8b3a23c286ae0bc52c041ae789f4a02ee9754e`) |

These values must be set as **static/literal** in the node configuration, not as expressions referencing other nodes.

---

## 5. Node expression audit checklist

Before any Execute run (gated separately, after D-0202-A inspection/repair), every downstream node must be inspected:

### Load notification state
- [ ] Lookup field references `$json.idempotency_key` (current item), not a named upstream node.
- [ ] Filter/match expression uses the correct field name matching the Data Table column.
- [ ] Always Output Data behavior is understood (what shape when row found vs. not found).

### Normalize notification state
- [ ] All expressions reference `$json.*` only.
- [ ] Logic for `send` vs. `skip_duplicate` correctly reads the Data Table lookup result.
- [ ] No reference to `$('Build idempotency key')` or `$('Pick latest done file')` or similar.

### Decide send or skip
- [ ] IF condition references `$json.notification_state_decision` (or equivalent current item field).
- [ ] No reference to named upstream dynamic nodes.

### Build notification payload
- [ ] All fields reference `$json.*` only.
- [ ] `task_id`, `done_file_path`, etc. come from current item, not from dynamic upstream.
- [ ] No reference to `$('Get done file')` or similar.

### Send a text message
- [ ] Message template uses `$json.*` fields only.
- [ ] Telegram credential is in n8n vault — no token in node expression.
- [ ] Chat id is in n8n credential store — no chat id in node expression or docs.

### Store notification state
- [ ] All fields reference `$json.*` only.
- [ ] `task_id`, `done_file_path`, `done_file_sha`, `idempotency_key` come from current item.
- [ ] No reference to `$('Build idempotency key')` or any other dynamic upstream node.

---

## 6. Inspection/repair scope (D-0202-A Option 1)

If D-0202-A = 1 is decided, the authorized scope is:

1. Open the duplicate TEST-only workflow `TEST - Alina Telegram notifier PINNED VALIDATION ONLY` in n8n UI.
2. Remove or disable: `List done files`, `Pick latest done file`, `Get done file`, `Build idempotency key`, `Override pinned idempotency key`.
3. Add or configure: `Static pinned input` node with the literal pinned values from §4.
4. Wire: `Manual Trigger` → `Static pinned input` → `Load notification state` → ... (rest of chain unchanged).
5. Inspect every expression in §5 checklist. Replace any named upstream reference with `$json.*`.
6. **Do NOT Execute.** Save the workflow. Leave it inactive/manual-only.
7. Report findings and any expressions that were changed.
8. A separate future Decision Packet is required to authorize one Execute run after inspection/repair is complete.

---

## 7. Success criteria (for a future Execute run, NOT part of D-0202-A)

A future Execute run (gated separately) succeeds only if **all** of the following hold:

- The computed `idempotency_key` in the static pinned input matches the existing row's key in `alina_telegram_notifier_state`.
- `Load notification state` returns exactly one matching row with Data Table fields (`id`, `notification_status`, `notified_at`, etc.).
- `Normalize notification state` resolves to `skip_duplicate`.
- `Decide send or skip` routes FALSE.
- `Build notification payload` is **not** executed.
- `Send a text message` is **not** executed.
- `Store notification state` is **not** executed.
- No Telegram message arrives.
- No new row is added to `alina_telegram_notifier_state`.

Any deviation triggers fail-closed behavior and a new Decision Packet.

---

## 8. Fail-closed behavior

If during a future Execute run any of the following occurs:

- `Load notification state` does not return the existing row fields.
- `Decide send or skip` routes TRUE despite the pinned key existing in the table.
- `Send a text message` executes.
- `Store notification state` executes.
- Any Telegram message arrives.
- Any new row appears in `alina_telegram_notifier_state`.

Then:
- Stop the run.
- Do **not** retry under the same gate.
- Record the observation in a new docs-only task.
- A new Decision Packet is required.

---

## 9. Stop conditions (hard)

- Stop immediately if a Telegram message is sent during a future Execute run.
- Stop immediately if any row is added to `alina_telegram_notifier_state`.
- Stop if any secret would have to leave n8n's credential store.
- Stop if the inspection reveals expressions that cannot be safely rewritten to `$json.*`.

---

## 10. Secret hygiene

- No Telegram bot token may appear outside n8n's credential store.
- No chat id may appear in node expressions, docs, session notes, or AI chat.
- No URL containing `token=` in any document.
- No workflow JSON export/import.

---

## 11. Out of scope

This design does not authorize and does not address:

- Schedule Trigger activation
- Automatic notifications
- Multi-key/batch validation
- Workflow JSON export/import
- Token / chat id discovery, rotation, or storage
- Provider API LLM usage
- New billing
- Browser Bridge
- Ollama runtime
- Cursor CLI / headless
- App / deploy / tag / rollback / merge
- Any Execute run (requires a separate future gate after D-0202-A inspection/repair)

---

## 12. Cross-references

- `docs/tasks/done/0199-record-d0197a-pinned-validation-not-successful.md` — D-0197-A outcome
- `docs/tasks/done/0200-document-pinned-validation-failure-root-cause.md` — root cause
- `docs/automation/telegram-pinned-file-duplicate-skip-validation-design.md` — prior (partial) design, superseded for harness approach
- `docs/tasks/done/0195-document-latest-done-drift-root-cause.md` — 3 result categories
- `docs/automation/telegram-notifier-idempotency-state-store-implementation-design.md`
- `docs/automation/telegram-notifier-idempotency-implementation-checklist.md`
- `docs/automation/telegram-idempotency-runtime-ui-handoff.md`
- `docs/automation/telegram-duplicate-skip-validation-runtime-handoff.md`
- `docs/automation/telegram-notifier-runbook-idempotency-hardening.md`
- `docs/automation/telegram-mode-a-completion-notification-mvp.md`
- `docs/automation/candidate-gate-backlog.md`

---

*This design is docs-only. No runtime is authorized. Inspection/repair requires D-0202-A = 1. Execute run requires a separate future gate after inspection/repair.*
