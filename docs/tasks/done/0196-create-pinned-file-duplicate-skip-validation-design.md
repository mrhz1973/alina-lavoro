# Task 0196 — Create Pinned-File Duplicate-Skip Validation Design

**Task:** 0196
**Date:** 2026-05-14
**Type:** low-touch-loop-docs-only
**Authorization:** none required (docs-only)
**Status:** completed

---

## 1. Purpose

Create the design document for a pinned-file approach to same-key duplicate-skip validation of the Telegram Mode A notifier workflow.

The new design is required because both D-0187-A and D-0193-A validation runs were inconclusive due to latest-done drift (see `docs/tasks/done/0195-document-latest-done-drift-root-cause.md`). A fixed, operator-chosen pinned file/key is the only structurally valid input for testing the duplicate-skip (FALSE) branch.

---

## 2. Created/updated files

- `docs/automation/telegram-pinned-file-duplicate-skip-validation-design.md` — new design document

---

## 3. Design summary

The pinned-file design:

- Defines preconditions (workflow inactive, manual-only, Data Table populated with at least one known row).
- Defines the goal: drive the workflow once with a key that already exists, verify FALSE branch, no Telegram, no new row.
- Lists pinned-key candidates: preferred = the exact `(done_file_path, done_file_sha)` from the most recent send/store row; fallback fixed candidate = `docs/tasks/done/0193-create-duplicate-skip-retry-same-key-decision-packet.md`.
- Offers three options for pinning the input (Option A: temporary override node; Option B: duplicate TEST-only workflow with static input; Option C: edit `Pick latest done file` to a fixed filter).
- Specifies secret hygiene: tokens and chat ids stay in n8n credentials, never in docs/commits/chat; no workflow JSON export.
- Defines fail-closed behavior and hard stop conditions.
- Defines explicit success criteria for category (a) same-key duplicate-skip success.
- Lists out-of-scope items (Schedule Trigger, automatic notifications, JSON export, provider APIs, Browser Bridge, Ollama, Cursor, app/deploy/tag/rollback/merge).
- Cross-references prior batches and Telegram/idempotency docs.

---

## 4. Runtime status

This task creates a design only. No runtime is authorized by this task or by the new design document.

A pinned-file validation run requires explicit decision **D-0197-A = 1** in `docs/INBOX.md`. D-0197-A is **pending** as of this batch.

---

## 5. Forbidden actions respected

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

*Design document created. Validation runs gated by D-0197-A (pending).*
