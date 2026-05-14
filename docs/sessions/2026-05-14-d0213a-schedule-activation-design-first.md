# Session — 2026-05-14 — D-0213-A = 3 (schedule activation design-first)

## Summary

Docs-only batch 0215–0218 recording the user's explicit decision `D-0213-A = 3`: defer Telegram Mode A schedule activation and design a safer template-first / supervised path before any Schedule Trigger activation. Created the design document `docs/automation/telegram-mode-a-schedule-activation-design-first-path.md`, added a new narrower Pending Decision Packet `D-0217-A` for a controlled n8n UI readiness inspection only, and propagated state across canonical docs.

## Tasks created

- `docs/tasks/done/0215-record-d0213a-schedule-activation-design-first-decision.md` — record D-0213-A = 3.
- `docs/tasks/done/0216-design-telegram-mode-a-schedule-activation-template-first-path.md` — design schedule activation template-first path.
- `docs/tasks/done/0217-create-schedule-activation-readiness-inspection-decision-packet.md` — create D-0217-A pending.
- `docs/tasks/done/0218-update-state-after-d0213a-design-first-decision.md` — state propagation.

## Decision Packets touched

- **D-0213-A** — moved from Pending to Decided with response `3` and result `schedule activation deferred; design-first path opened`. Original Decision Packet body preserved for audit.
- **D-0217-A** — added as new Pending entry: authorize controlled n8n UI readiness inspection only. No Execute, no Schedule Trigger, no Telegram send, no workflow import/export. Queue reader untouched.

## Design document created

`docs/automation/telegram-mode-a-schedule-activation-design-first-path.md` — defines a staged gated path:

1. Stage 1: docs-only design and status update (this batch).
2. Stage 2: controlled n8n UI readiness inspection only (gated by D-0217-A).
3. Stage 3: template-first / checklist-backed activation plan.
4. Stage 4: controlled Schedule Trigger activation (separate future DP).
5. Stage 5: manual first-tick observation.
6. Stage 6: record outcome.

Includes readiness inspection scope, activation criteria, abort criteria, template-first policy application, and explicit non-authorizations.

## State after this session

- Last completed: 0218.
- D-0213-A: decided = 3.
- D-0217-A: pending.
- D-0209-A: remains decided/applied/completed (`fully pinned duplicate skip succeeded`).
- D-0206-A: remains decided/applied/completed (`import/inspection ok`).
- D-0202-A: remains superseded.
- Duplicate-skip: conclusively validated on the fully-pinned harness.
- Telegram Mode A: manual-only / inactive.
- No Schedule Trigger active.
- No automatic Telegram notification active.
- No runtime performed. No n8n UI opened. No queue reader modification. No app / deploy / tag / rollback.
- Next valid step: user decision on D-0217-A.
