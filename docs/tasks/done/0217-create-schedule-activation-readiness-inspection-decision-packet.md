# 0217 — Create schedule activation readiness inspection Decision Packet (D-0217-A)

- Project: Alina Lavoro
- Type: docs-only / Decision Packet
- Status: done
- Priority: normal
- Deploy: no
- Date: 2026-05-14

## Scope

Add a new Pending Decision Packet `D-0217-A` to `docs/INBOX.md` authorizing **only** a controlled n8n UI readiness inspection of the intended Telegram Mode A notifier workflow, before any schedule activation. This packet operationalizes Stage 2 of the design path in `docs/automation/telegram-mode-a-schedule-activation-design-first-path.md` (task 0216).

## D-0217-A summary

- **Decision ID:** D-0217-A
- **Kind:** automation
- **Status:** pending
- **Options:**
  1. Authorize controlled n8n UI readiness inspection only (scope below).
  2. Keep Telegram notifier manual-only and skip readiness inspection for now.
  3. Defer and refine the design further before any n8n UI inspection.
- **Recommendation:** Option 1 if the user wants to continue toward schedule activation soon. Option 3 if the workflow identity or activation strategy is still unclear. Option 2 if automatic Telegram notifications are not needed now.

## Scope of Option 1 (readiness inspection only)

- Open the intended Telegram Mode A notifier workflow.
- Do not open or modify the queue reader workflow.
- Confirm workflow name and purpose.
- Confirm `active=false` before any action.
- Confirm no Schedule Trigger is currently active.
- Confirm idempotency / state-store nodes are present and wired.
- Confirm Data Table target is `alina_telegram_notifier_state`.
- Confirm Telegram node remains notification-only.
- Confirm no automatic INBOX response logic exists.
- Confirm D-0209-A duplicate-skip success is recorded in docs.
- No Execute.
- No Telegram send.
- No Schedule Trigger.
- No workflow import / export.
- Stop and report findings.

## Main risk

- Human may inspect or modify the wrong workflow.
- Inspection may accidentally become activation.
- Existing schedule state may be misunderstood.
- Telegram must remain notification-only and must not answer INBOX.

## Explicit non-authorizations

- No Schedule Trigger activation.
- No Execute.
- No Telegram send / test.
- No queue reader modification.
- No workflow export with secrets.
- No token / chat id in repo / docs / chat.
- No provider API LLM.
- No app / deploy / tag / rollback.
- No automatic INBOX response.

## INBOX update performed by this task

- Add `D-0217-A` as Pending in `docs/INBOX.md`.
- D-0213-A is moved from `## Pending` to `## Decided` with response `3` (recorded in task 0215).
- D-0209-A remains in `## Decided` (`fully pinned duplicate skip succeeded`).
- D-0206-A remains in `## Decided` (`import/inspection ok`).
- D-0202-A remains in `## Superseded`.

## State after this task

- D-0217-A: pending.
- D-0213-A: decided = 3.
- Telegram Mode A: manual-only / inactive.
- No Schedule Trigger active.
- No automatic Telegram notification active.
- Duplicate-skip: conclusively validated.
- Next valid step: user decision on D-0217-A.

## Done status

- Completed by: Claude Code (implementer)
- Completion commit: this batch
- No runtime. No n8n UI. D-0217-A is created as **Pending** only.
