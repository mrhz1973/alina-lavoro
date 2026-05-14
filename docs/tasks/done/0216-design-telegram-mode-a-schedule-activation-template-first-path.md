# 0216 — Design Telegram Mode A schedule activation template-first path

- Project: Alina Lavoro
- Type: docs-only / design
- Status: done
- Priority: normal
- Deploy: no
- Date: 2026-05-14

## Scope

Create `docs/automation/telegram-mode-a-schedule-activation-design-first-path.md`, the safer schedule activation template-first / supervised path requested by the user via `D-0213-A = 3`.

## Summary of the design document

The document defines a multi-stage gated path from the validated duplicate-skip baseline (D-0209-A) to a future Telegram Mode A schedule activation:

1. **Stage 1** — docs-only design and status update (this batch).
2. **Stage 2** — controlled n8n UI **readiness inspection only** of the intended Telegram notifier workflow. Gated by a new Pending Decision Packet `D-0217-A`. No Execute, no Schedule.
3. **Stage 3** — if inspection succeeds, prepare a template-first or checklist-backed activation plan for the production-like notifier.
4. **Stage 4** — controlled Schedule Trigger activation. Future separate Decision Packet.
5. **Stage 5** — manual observation of first scheduled tick.
6. **Stage 6** — record outcome.

The document also specifies:

- **Readiness inspection scope** for Stage 2 (workflow name, `active=false`, no Schedule Trigger, idempotency nodes present, Data Table = `alina_telegram_notifier_state`, Telegram node notification-only, no INBOX-answering logic, queue reader untouched).
- **Activation criteria** required before Stage 4.
- **Abort criteria** (ambiguous workflow, missing idempotency node, INBOX-answering risk, unexpected active Schedule Trigger, wrong workflow opened, secrets leakage, unclear Data Table target, UI mismatch).
- **Template-first policy** applied here (prefer sanitized importable JSON template or checklist-backed import path; templates inactive by default; no real secrets).
- **Explicit non-authorizations** (no Schedule Trigger, no Execute, no Telegram send, no workflow import/export, no token/chat id, no queue reader changes, no app/deploy/tag/rollback, no provider API LLM, no API keys, no new billing, no automatic INBOX response, no second validation run).

## Properties of this design task

- This is **docs-only**.
- It prepares a safer path.
- It **does not authorize runtime**.
- It **does not activate schedule**.
- It **does not modify n8n**.
- It keeps Telegram Mode A **notification-only**.
- It creates the basis for the next narrower gate (`D-0217-A` for readiness inspection, created in task 0217).

## State after this task

- New design document committed: `docs/automation/telegram-mode-a-schedule-activation-design-first-path.md`.
- D-0213-A: decided = 3 (recorded in task 0215).
- D-0217-A: pending (created in task 0217).
- Telegram Mode A: manual-only / inactive.
- No Schedule Trigger active.
- No automatic Telegram notification active.
- Duplicate-skip: conclusively validated.

## Done status

- Completed by: Claude Code (implementer)
- Completion commit: this batch
- No runtime. No n8n UI. Docs-only design.
