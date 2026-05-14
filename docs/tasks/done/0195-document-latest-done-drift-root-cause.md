# Task 0195 — Document Latest-Done Drift Root Cause

**Task:** 0195
**Date:** 2026-05-14
**Type:** low-touch-loop-docs-only
**Authorization:** none required (docs-only)
**Status:** completed

---

## 1. Purpose

Document the structural root cause that made both the D-0187-A validation (batch 0188–0190 → recorded inconclusive in 0191–0193) and the D-0193-A retry (recorded inconclusive in this batch, task 0194) unable to validate same-key duplicate-skip.

The root cause is **latest-done drift** caused by docs-only batches creating newer `docs/tasks/done/*.md` files between the original test and the validation run.

---

## 2. Why dynamic "Pick latest done file" is unsuitable for same-key duplicate-skip validation

The Telegram notifier workflow currently selects its target done file via a `Pick latest done file` node that picks the most recently created `docs/tasks/done/NNNN-*.md` file in the repository.

The idempotency key is computed as `done_file_path::done_file_sha`, deriving directly from whichever file the dynamic picker returns.

Consequence:
- Whenever a new docs-only batch creates a new `docs/tasks/done/NNNN-*.md` file, the latest done file changes.
- The next validation run therefore tests a **different** idempotency key from the previous run.
- The workflow correctly routes this new key to the send/store path (TRUE branch).
- The duplicate-skip (FALSE) branch is **never exercised** under these conditions.

This makes same-key validation structurally unstable: each successive batch documenting the previous attempt is itself enough to invalidate the next attempt.

---

## 3. Why docs-only batches change the latest file

The project workflow:

- Each task is recorded as `docs/tasks/done/NNNN-<slug>.md`.
- Every batch that records inconclusive outcomes, design updates, or new Decision Packets adds at least one new file under `docs/tasks/done/`.
- The numbering is monotonic, so the new file is always lexicographically and chronologically the latest.
- The notifier's `Pick latest done file` node therefore selects the new file rather than the prior test file.

This is not a workflow bug. It is the intended behavior of "notify when a new task completes." But it is **incompatible** with same-key duplicate-skip validation against a previously tested key.

---

## 4. Why a new-key send/store is correct behavior

For a key that does **not** exist in `alina_telegram_notifier_state`:

- `Load notification state` returns no row.
- `Normalize notification state` resolves to `send`.
- `Decide send or skip` routes TRUE.
- `Send a text message` executes.
- `Store notification state` writes a new row.

This is the **correct** new-key behavior. It demonstrates the send/store path works. It does **not** demonstrate either success or failure of duplicate-skip, because the duplicate-skip branch (FALSE) is only reached when the key already exists.

A TRUE branch on a new key must therefore not be interpreted as a duplicate-skip failure.

---

## 5. Three validation result categories

Any future duplicate-skip validation attempt must be classified into exactly one of these three categories:

### (a) Same-key duplicate-skip success
Conditions:
- Idempotency key already exists in `alina_telegram_notifier_state`.
- `Load notification state` returns a row.
- `Normalize notification state` resolves to `skip_duplicate`.
- `Decide send or skip` routes FALSE.
- `Send a text message` is **not** executed.
- `Store notification state` is **not** executed.
- No Telegram message arrives.
- No new Data Table row is written.

Meaning: duplicate-skip logic is conclusively validated.

### (b) New-key legitimate send
Conditions:
- Idempotency key does **not** exist in `alina_telegram_notifier_state`.
- `Load notification state` returns no row.
- `Normalize notification state` resolves to `send`.
- `Decide send or skip` routes TRUE.
- `Send a text message` executes.
- `Store notification state` writes a new row.
- Telegram message arrives.

Meaning: send/store path on a new key is correct. **Duplicate-skip is not validated by this case.** Inconclusive for the duplicate-skip question.

### (c) True idempotency failure
Conditions:
- Idempotency key already exists in `alina_telegram_notifier_state`.
- `Load notification state` returns a row.
- `Decide send or skip` nevertheless routes TRUE (or the send/store nodes execute anyway).
- A duplicate Telegram message is sent for the same key.
- A duplicate row is written for the same key.

Meaning: idempotency implementation is broken. Stop immediately. Investigate before any further runtime.

---

## 6. Where the existing attempts fall

| Attempt | Authorized by | Branch routed | Telegram sent | Classification |
|--------|---------------|---------------|---------------|----------------|
| Original send/write test (task 0185) | D-0180-A = 1 | TRUE (new key) | yes | (b) new-key legitimate send — baseline |
| Validation run (batch 0188–0190) | D-0187-A = 1 | TRUE (new latest = task 0190 likely) | yes | (b) / inconclusive — recorded in 0191 |
| Retry run (batch 0194–0198) | D-0193-A = 1 | TRUE (new latest likely shifted after 0191–0193) | yes | (b) / inconclusive — recorded in 0194 |

No attempt to date qualifies as (a) or (c). Duplicate-skip therefore remains **not conclusively validated**.

---

## 7. Required change in validation approach

Same-key duplicate-skip validation requires **pinned** input — a fixed, known done file path and SHA chosen explicitly, not derived from "whatever is newest at runtime."

The pinned-file design is created in task 0196:
`docs/automation/telegram-pinned-file-duplicate-skip-validation-design.md`.

A pinned-file validation run is gated by a new Decision Packet **D-0197-A**, pending in `docs/INBOX.md` (created in task 0197).

Schedule Trigger activation remains separately gated and is not authorized by D-0197-A.

---

## 8. Forbidden actions respected

This task is docs-only. No runtime was performed.

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

*Latest-done drift is the root cause of the inconclusive validations. Same-key duplicate-skip validation requires pinned-file input. Pinned-file design follows in task 0196 and is gated by D-0197-A.*
