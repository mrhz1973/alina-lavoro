# Task 0200 — Document Pinned Validation Failure Root Cause

**Task:** 0200
**Date:** 2026-05-14
**Type:** low-touch-loop-docs-only
**Authorization:** none required (docs-only)
**Status:** completed

---

## 1. Purpose

Document the root cause hypothesis for why the D-0197-A pinned-file validation attempt did not succeed: **partial pinning is insufficient** when downstream nodes still reference dynamic upstream node outputs instead of current item fields from the override node.

---

## 2. Root cause hypothesis: partial pinning insufficient

The duplicate TEST-only workflow (`TEST - Alina Telegram notifier PINNED VALIDATION ONLY`) inserted an `Override pinned idempotency key` node (Set/Edit Fields) between `Build idempotency key` and `Load notification state`.

The override node correctly output the pinned values for task 0193. However:

- **Downstream nodes may reference upstream nodes directly.** In n8n, node expressions can reference specific upstream node outputs by name (e.g., `{{ $('Pick latest done file').item.json.done_file_path }}`). If `Load notification state`, `Normalize notification state`, `Build notification payload`, `Send a text message`, or `Store notification state` contain such direct references, they bypass the override node's output and use the dynamic values from earlier in the chain.
- **The override node changes the current item data** (`$json.*`), but does not change the output of previously executed nodes. Any downstream expression referencing a specific node name instead of `$json.*` will still get the dynamic (non-pinned) value.
- **Evidence:** `Store notification state` wrote a row for task 0198 (not 0193), and `Load notification state` output did not contain Data Table row fields for the existing 0193 row. This strongly suggests the lookup used a different key than the pinned one.

---

## 3. What a Set/Edit Fields override does and does not do

**Does:**
- Sets the `$json` current item fields for the immediately next node in the chain.
- If the next node reads `$json.idempotency_key`, it gets the pinned value.

**Does not:**
- Change the stored output of any previously executed node.
- Affect expressions that reference upstream nodes by name (e.g., `$('Build idempotency key').item.json.idempotency_key`).
- Guarantee that all downstream nodes read from `$json.*` rather than from named upstream references.

---

## 4. Specific investigation items

The following must be investigated during harness inspection/repair (gated by D-0202-A):

### (a) Exact string mismatch
- Verify that the pinned `idempotency_key` string exactly matches the Data Table row's `idempotency_key` field, character-for-character.
- Check for leading/trailing whitespace, encoding differences, or invisible characters.

### (b) Data Table lookup behavior
- Verify how `Load notification state` performs the lookup (filter expression, field name, match mode).
- Check whether `If Row Exists` / `Always Output Data` behavior produces the expected output shape when a row is found vs. not found.
- Check whether the node reads `$json.idempotency_key` or references a specific upstream node.

### (c) Field type / string comparison
- Verify that the `idempotency_key` field in the Data Table is stored as a string, not as a different type that would cause comparison failure.

### (d) Normalize notification state assumptions
- Verify what `Normalize notification state` expects as input and how it determines `send` vs. `skip_duplicate`.
- Check whether it reads from `$json.*` or from a named upstream node.

### (e) Downstream direct node references
- Inspect every expression in:
  - `Load notification state`
  - `Normalize notification state`
  - `Decide send or skip`
  - `Build notification payload`
  - `Send a text message`
  - `Store notification state`
- Identify any expression referencing upstream nodes by name instead of `$json.*`.
- These are the most likely source of the dynamic reference leakage.

---

## 5. Why the new-key send on 0198 is still legitimate behavior

The run wrote/sent task 0198 because (most likely) downstream nodes used the dynamic latest done file (task 0198) rather than the pinned 0193 values. For the 0198 key, this is a new-key legitimate send (category (b) per task 0195):

- The 0198 key did not exist in `alina_telegram_notifier_state` before the run.
- The workflow correctly sent a notification and wrote a row for a new key.
- This is correct send/store behavior for an unrecognized key.

However, the pinned test intended to validate same-key duplicate-skip for 0193, and that was not tested. The test harness failed, not necessarily the idempotency logic.

---

## 6. What is still needed

Same-key duplicate-skip validation requires a **fully pinned harness** where:

- All dynamic upstream nodes (`List done files`, `Pick latest done file`, `Get done file`, `Build idempotency key`) are either removed, disabled, or their outputs are not referenced by any downstream node.
- All downstream nodes use only `$json.*` current item fields from a single static input node.
- The static input node provides exactly `task_id`, `done_file_path`, `done_file_sha`, `idempotency_key`.

The fully pinned harness design is created in task 0201: `docs/automation/telegram-fully-pinned-validation-harness-design.md`.

A controlled inspection/repair pass (no Execute) is gated by D-0202-A (pending).

---

## 7. Forbidden actions respected

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
- No merge

---

*Partial pinning is insufficient. Downstream nodes likely reference dynamic upstream nodes by name. A fully pinned harness with $json.* current item fields is required. Inspection/repair gated by D-0202-A.*
