# Task 0199 — Record D-0197-A Pinned Validation Not Successful

**Task:** 0199
**Date:** 2026-05-14
**Type:** low-touch-loop-docs-only
**Authorization:** D-0197-A = 1 (consumed by this batch)
**Status:** completed

---

## 1. Purpose

Record the outcome of the D-0197-A pinned-file duplicate-skip validation attempt as **not successful / inconclusive** due to likely partial pinning and downstream dynamic reference leakage. Do not classify this as a confirmed pure idempotency bug.

---

## 2. D-0197-A decision

- D-0197-A = 1 was decided by the user.
- Authorization: exactly one manual pinned-file duplicate-skip validation run.

---

## 3. Pre-run state

- Original workflow `TEST - Alina task completion Telegram notifier` remained inactive/manual-only.
- A duplicate TEST-only workflow was created: `TEST - Alina Telegram notifier PINNED VALIDATION ONLY`.
- Duplicate workflow was not Active. No Schedule Trigger.
- A node named `Override pinned idempotency key` was inserted between `Build idempotency key` and `Load notification state`.

Pinned values configured in the override node:

| Field | Value |
|-------|-------|
| task_id | 0193 |
| done_file_path | docs/tasks/done/0193-create-duplicate-skip-retry-same-key-decision-packet.md |
| done_file_sha | 5d8b3a23c286ae0bc52c041ae789f4a02ee9754e |
| idempotency_key | docs/tasks/done/0193-create-duplicate-skip-retry-same-key-decision-packet.md::5d8b3a23c286ae0bc52c041ae789f4a02ee9754e |

The user confirmed the override node output exactly these values.

The Data Table `alina_telegram_notifier_state` contained an existing row for task_id 0193 with the same idempotency_key.

---

## 4. Runtime outcome

- One manual Execute workflow on the duplicate TEST-only workflow.
- Telegram message arrived.
- Screenshot showed:
  - `Decide send or skip` routed **TRUE**
  - `Build notification payload` executed
  - `Send a text message` executed
  - `Store notification state` executed
- User inspected `Load notification state` output:
  - Output contained only the pinned input fields.
  - Did **not** contain Data Table row fields such as `id`, `notification_status`, `notified_at`, `workflow_name`.
  - Therefore `Load notification state` effectively did not find the existing 0193 row, despite Always Output Data being on.

---

## 5. Post-run Data Table observation

After the run, `alina_telegram_notifier_state` had 4 rows:

| id | task_id | Notes |
|----|---------|-------|
| 1 | 0184 | prior row |
| 2 | 0190 | prior row |
| 3 | 0193 | prior row (existing, should have been found by pinned lookup) |
| 4 | 0198 | **new row written by this run** |

New row details:
- id = 4
- task_id = 0198
- notification_status = sent
- notified_at = 2026-05-14T03:34:35.524+02:00
- message_preview_safe showed task 0198 done
- workflow_name showed `TEST - Alina task completion Telegram notifier`

This proves the run wrote/sent a new latest/dynamic task 0198 row, **not** a clean duplicate-skip on 0193. The downstream nodes did not use the pinned values.

---

## 6. Classification

**Result: NOT SUCCESSFUL / inconclusive pinned validation due to likely partial pinning and downstream dynamic reference leakage.**

- The pinned override node output was correct for task 0193.
- An existing row for 0193 with the same idempotency key existed in the Data Table.
- `Load notification state` did not return the existing 0193 row fields.
- `Store notification state` wrote a row for task 0198, not 0193.
- This indicates downstream nodes still referenced dynamic upstream outputs (e.g., `Pick latest done file`, `Get done file`, `Build idempotency key`) instead of the pinned override values.

Do **not** classify as a confirmed pure idempotency bug:
- The send/store on task 0198 was a new-key send (category (b) per task 0195), which is correct behavior for a key not found in the table.
- The failure is in the test harness (partial pinning), not necessarily in the idempotency logic itself.
- Same-key duplicate-skip validation still requires a fully pinned harness where all downstream nodes use `$json.*` current item fields only.

---

## 7. D-0197-A status

**Status: decided/applied/executed, result not successful (consumed)**

- D-0197-A authorized exactly one pinned-file validation run — that run was executed.
- The run did not validate same-key duplicate-skip.
- D-0197-A is now consumed. No further runtime is authorized under D-0197-A.

---

## 8. What is forbidden going forward

Until a new explicit gate (D-0202-A) is decided:

- No further runtime run of any Telegram notifier workflow (original or duplicate)
- No Schedule Trigger activation
- No automatic notifications
- No workflow JSON export/import
- No Telegram token / chat id in repo, docs, session notes, or AI chat
- No provider API LLM
- No new billing
- No app/deploy/tag/rollback
- No automatic INBOX response

---

## 9. Next step

A new Decision Packet **D-0202-A** is created in batch 0199–0203 to authorize, if the user chooses, a controlled inspection and repair of the duplicate TEST-only pinned workflow **without** any Execute run.

D-0202-A is **pending** in `docs/INBOX.md`. No runtime (including inspection/repair) is authorized until D-0202-A is explicitly decided.

---

## 10. Forbidden actions respected

This task is docs-only. No runtime was performed by this task:

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

*D-0197-A consumed as not successful. Partial pinning insufficient. D-0202-A pending for controlled harness inspection/repair.*
