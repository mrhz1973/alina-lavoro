# Task 0201 — Create Fully-Pinned Validation Harness Design

**Task:** 0201
**Date:** 2026-05-14
**Type:** low-touch-loop-docs-only
**Authorization:** none required (docs-only)
**Status:** completed

---

## 1. Purpose

Create the design document for a fully-pinned validation harness that replaces the partial-override approach which failed in D-0197-A.

---

## 2. Created files

- `docs/automation/telegram-fully-pinned-validation-harness-design.md` — new design document

---

## 3. Design summary

The fully-pinned harness:

- Removes or disables all dynamic upstream nodes (`List done files`, `Pick latest done file`, `Get done file`, `Build idempotency key`, `Override pinned idempotency key`).
- Replaces them with a single `Static pinned input` Set node containing literal pinned values.
- Requires all downstream nodes to use `$json.*` current item fields only — no named upstream references.
- Includes a node expression audit checklist for every downstream node.
- Defines inspection/repair scope (D-0202-A Option 1): open, restructure, audit expressions, do NOT Execute.
- Defines success criteria for a future Execute run (gated separately): FALSE branch, no send, no new row.
- Defines fail-closed behavior and hard stop conditions.
- Enforces secret hygiene: no token/chat id outside n8n vault.
- Lists out-of-scope items (Schedule Trigger, automatic notifications, JSON export, provider APIs, etc.).

---

## 4. Runtime status

No runtime is authorized by this task or by the design document.

- Inspection/repair requires **D-0202-A = 1** (pending in `docs/INBOX.md`).
- Execute run requires a **separate future gate** after inspection/repair.

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

*Design document created. Inspection/repair gated by D-0202-A. Execute run gated separately.*
