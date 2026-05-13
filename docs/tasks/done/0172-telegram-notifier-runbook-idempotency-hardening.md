# Task 0172 — Telegram Notifier Runbook and Idempotency Hardening

- Project: Alina Lavoro
- Type: docs-only
- Priority: normal
- Deploy: no
- Status: done

## Objective

Create the runbook and idempotency/anti-duplication hardening documentation required before any Telegram schedule activation is considered.

## Done status

**Completed by:** Claude Code (local), supervised
**Completion date:** 2026-05-13
**Completion commit:** see session `docs/sessions/2026-05-13-telegram-schedule-deferral-hardening-and-next-gate.md`

**Evidence:**
- `docs/automation/telegram-notifier-runbook-idempotency-hardening.md` created with all required sections:
  - Purpose
  - Current validated state
  - Permanent boundaries
  - Workflow runtime intent
  - Idempotency model (`(done_file_path, done_file_sha)` recommended)
  - Suggested n8n state store options (Data Store recommended; GitHub writes deferred)
  - Duplicate prevention rules (fail-closed)
  - Message format (pinned MVP)
  - Schedule recommendation (conservative, Europe/Berlin, future gate only)
  - Observability (allowed/forbidden log items)
  - Stop conditions
  - Recovery / rollback
  - Schedule activation checklist (13 items)

**Scope confirmed:**
- docs-only ✅
- Runbook/idempotency hardening doc created ✅
- No runtime ✅
- No n8n UI action ✅
- No Schedule Trigger ✅
- No workflow JSON export/import ✅
- No token/chat id in repo ✅
- Queue reader untouched ✅
- No provider API LLM or billing ✅
- No app/deploy/tag/rollback ✅
