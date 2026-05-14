# Telegram Pinned-File Duplicate-Skip Validation Design

**Task:** 0196 (created)
**Date:** 2026-05-14
**Type:** docs-only / pre-runtime validation design
**Authorization prerequisite:** D-0197-A must be decided (opened) before any n8n UI step described here
**Status:** **superseded for harness approach** — D-0197-A = 1 decided/consumed, result NOT SUCCESSFUL (partial pinning insufficient, downstream dynamic reference leakage). This partial-override design is superseded by the fully-pinned harness design: `docs/automation/telegram-fully-pinned-validation-harness-design.md` (D-0202-A pending: inspection/repair, no Execute)

---

## 1. Purpose

Design a structurally valid path to validate the same-key duplicate-skip branch of the Telegram Mode A notifier workflow.

The previous two attempts (D-0187-A under batch 0188–0190, D-0193-A under batch 0194–0198) both failed to validate duplicate-skip because the workflow uses dynamic "Pick latest done file", and docs-only batches in between changed which file was latest. See `docs/tasks/done/0195-document-latest-done-drift-root-cause.md` for the root cause analysis.

This document describes the **pinned-file** approach: validate duplicate-skip using a fixed, known done file path and SHA selected explicitly by the operator, instead of "latest at runtime."

This document is **docs-only**. It does not authorize any runtime. The n8n UI steps described here are conditional and require **D-0197-A = 1** before any execution.

---

## 2. Preconditions

Before any pinned-file validation may run (post D-0197-A = 1):

- Workflow `TEST - Alina task completion Telegram notifier` exists, inactive, manual-only.
- No Schedule Trigger is present or enabled.
- `alina_telegram_notifier_state` Data Table exists with the current schema (`idempotency_key`, `done_file_path`, `done_file_sha`, `task_id`, `created_at`, etc. per existing design).
- At least one row exists in `alina_telegram_notifier_state` whose `idempotency_key` corresponds to a real file under `docs/tasks/done/`.
- The operator has explicitly chosen one of the pinned-key candidates (Section 4).
- No new send is attempted against that pinned file outside the validation run.

---

## 3. Goal

Drive the workflow once with input pinned to a key that **already exists** in `alina_telegram_notifier_state`, and verify that the workflow:

1. Computes the same `idempotency_key` as the existing row.
2. Loads the row via `Load notification state`.
3. Normalizes the decision to `skip_duplicate`.
4. Routes `Decide send or skip` to FALSE.
5. Does **not** execute `Send a text message`.
6. Does **not** execute `Store notification state`.
7. Produces no Telegram message.
8. Adds no new row to `alina_telegram_notifier_state`.

This is the same-key duplicate-skip success case (category (a) in task 0195).

---

## 4. Pinned-key candidates

Preferred default candidate, because it is already known to exist as a row in `alina_telegram_notifier_state` from prior runs:

- The exact `(done_file_path, done_file_sha)` observed in the most recent send/store row, if the user provides those values during validation (preferred — uses a real existing row).

If the operator does not have the prior values readily available, an explicit pinned file may be chosen from `docs/tasks/done/`. Recommended fixed candidate (as of this batch):

- `docs/tasks/done/0193-create-duplicate-skip-retry-same-key-decision-packet.md`

In this case the operator must first ensure the row corresponding to this file's current SHA exists in `alina_telegram_notifier_state`. If it does not, the run will fall into category (b) (new-key legitimate send) and must be stopped before further conclusions are drawn.

Under no circumstances must the operator embed real Telegram token, chat id, download URLs containing `token=`, or any other secret in this document or in any commit while choosing a pinned file.

---

## 5. Options for pinning input

The pinned-file approach can be realized through any of the following operator-side options. The operator picks **one** after D-0197-A = 1; this document does not pre-select.

### Option A — Temporary manual override of derived fields in n8n UI

Before executing the workflow:

1. Open the workflow in n8n UI (inactive, manual-only).
2. Insert a temporary "Set" node (or use existing Set fields) immediately before `Load notification state` to override `done_file_path`, `done_file_sha`, and `idempotency_key` with the pinned values.
3. Disable, mute, or bypass the dynamic outputs of `Pick latest done file` / `Get done file` / `Build idempotency key` only for fields downstream of this override.
4. Execute once manually.
5. After observation, remove the temporary override node and return the workflow to its prior shape.

Pros: minimal structural change, no second workflow.
Cons: requires careful cleanup; failure to remove override leaves the workflow biased.

### Option B — Duplicate a separate TEST-only workflow with pinned file input

Before executing the workflow:

1. Duplicate `TEST - Alina task completion Telegram notifier` into a clearly named copy such as `TEST - Alina Telegram notifier PINNED VALIDATION ONLY` (inactive, manual-only).
2. Replace the `List done files` / `Pick latest done file` / `Get done file` chain with a single static value source providing the pinned `done_file_path` and `done_file_sha`.
3. Leave `Build idempotency key`, `Load notification state`, `Normalize notification state`, `Decide send or skip`, `Build notification payload`, `Send a text message`, `Store notification state` unchanged.
4. Execute once manually on the duplicate.
5. After observation, leave the duplicate inactive and untouched, or delete it. Do not let it run automatically.

Pros: isolates validation from production-shape workflow.
Cons: requires a second workflow to be created and cleaned up.

### Option C — Manually select a fixed file before idempotency lookup

Before executing the workflow:

1. Edit `Pick latest done file` only (in the inactive workflow) to filter to a single fixed file path equal to the pinned candidate.
2. Execute once manually.
3. After observation, restore `Pick latest done file` to its prior dynamic logic.

Pros: smallest change.
Cons: same restore-discipline risk as Option A.

---

## 6. Secret hygiene

For all options:

- No Telegram bot token may appear in the workflow definition outside n8n's credential store. Credentials must remain in n8n's vault, never in commits, docs, session notes, or AI chat.
- No `chat id` may appear in the workflow JSON or in this document. If a value must be referenced, refer to it as `<chat_id stored in n8n credentials>`.
- No URL containing `token=` may be pasted into any document, session note, AI chat, or commit message.
- No workflow JSON export/import is authorized by this design.

---

## 7. Fail-closed behavior

The validation run must fail closed if any of the following occurs:

- The pinned key cannot be matched to an existing row in `alina_telegram_notifier_state`.
- `Load notification state` returns more than one row for the key (data integrity issue).
- `Normalize notification state` resolves to a value other than `skip_duplicate` for an existing row.
- `Decide send or skip` routes TRUE despite an existing row.
- `Send a text message` is executed.
- `Store notification state` is executed.
- Any error is raised by a node downstream of `Build idempotency key`.

In any of these cases:

- Stop the run.
- Do **not** retry under D-0197-A.
- Do **not** open a Schedule Trigger.
- Record the observation in a new docs-only task.
- A new Decision Packet is required before any further runtime.

---

## 8. Stop conditions (hard)

Independent of D-0197-A's decision:

- Stop immediately if a Telegram message is sent during this run.
- Stop immediately if any row is added to `alina_telegram_notifier_state` during this run.
- Stop if the temporary override / duplicate workflow / fixed-file edit cannot be cleanly reverted.
- Stop if any secret would have to leave n8n's credential store.

---

## 9. Success criteria (category (a))

The run is conclusive success only if **all** of the following hold:

- The computed `idempotency_key` matches the existing row's key in `alina_telegram_notifier_state`.
- `Load notification state` returns exactly one matching row.
- `Normalize notification state` resolves to `skip_duplicate`.
- `Decide send or skip` routes FALSE.
- `Send a text message` is **not** executed.
- `Store notification state` is **not** executed.
- No Telegram message arrives.
- No new row is added to `alina_telegram_notifier_state`.

Any deviation downgrades the result to (b) inconclusive or (c) confirmed idempotency failure and triggers the fail-closed behavior in §7.

---

## 10. Out of scope

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

Schedule activation remains a **separate** future gate that may only be considered after a category (a) pinned-file success is recorded.

---

## 11. Cross-references

- `docs/tasks/done/0191-record-duplicate-skip-validation-inconclusive-due-to-new-latest-done-file.md`
- `docs/tasks/done/0194-record-d0193a-retry-attempt-inconclusive-due-to-latest-done-drift.md`
- `docs/tasks/done/0195-document-latest-done-drift-root-cause.md`
- `docs/automation/telegram-notifier-idempotency-state-store-implementation-design.md`
- `docs/automation/telegram-notifier-idempotency-implementation-checklist.md`
- `docs/automation/telegram-idempotency-runtime-ui-handoff.md`
- `docs/automation/telegram-duplicate-skip-validation-runtime-handoff.md`
- `docs/automation/telegram-notifier-runbook-idempotency-hardening.md`
- `docs/automation/telegram-mode-a-completion-notification-mvp.md`
- `docs/automation/candidate-gate-backlog.md`

---

*This design is docs-only. No runtime is authorized by this document. Any pinned-file validation run requires explicit D-0197-A = 1 in `docs/INBOX.md`.*
