# Task 0158 — Revise Telegram Mode A Completion Notification Decision Packet

- Project: Alina Lavoro
- Type: docs-only
- Priority: normal
- Deploy: no
- Status: done

## Done status

**Completed by:** Claude Code (task 0158, 2026-05-13)
**Completion commit:** see session file

### What was done

- Revised pending Decision Packet D-0157-A in-place in `docs/INBOX.md`.
- Title changed from "Open Telegram Mode A notifier gate" to "Open Telegram Mode A completion notification MVP gate".
- Scope updated: completion notification MVP — task id/slug, commit hash, optional INBOX pending count, instruction "scrivi aggio per post-check".
- Recommendation changed from Option 2 (defer) to Option 1 (open MVP gate).
- `source_task` field updated to reflect task 0157's slug (`0157-telegram-mode-a-completion-notification-decision-packet`).
- Added explicit constraints: no provider API LLM, no new LLM billing, no INBOX answer, no Browser Bridge, no Ollama, no Cursor, no app/deploy/tag/rollback.
- D-0157-A remains under `## Pending`; `response:` and `decided_at:` remain empty.

### Confirmations

- D-0157-A revised in-place: ✅
- D-0157-A remains pending (no decision recorded): ✅
- Recommendation changed to Option 1: ✅
- Scope = Telegram Mode A completion notification MVP: ✅
- Docs-only task: ✅
- No Telegram gate opened: ✅
- No Telegram bot/token/configuration created: ✅
- No n8n runtime modification: ✅
- No Browser Bridge action: ✅
- No app/deploy/tag/rollback action: ✅
- No API key / provider API / billing action: ✅
- No provider API LLM: ✅
- No new LLM billing: ✅
- No Ollama action: ✅
- No Cursor CLI/headless action: ✅
- Gate 7 remains closed: ✅
- INBOX still has 1 pending decision (D-0157-A): ✅

### Files modified

- `docs/INBOX.md` — D-0157-A revised in-place
- `docs/LLMS.md` — task state updated to 0158
- `docs/wiki/current-state.md` — task state updated to 0158
- `docs/automation/candidate-gate-backlog.md` — candidate D row and Section 6 updated

### Files created

- `docs/tasks/done/0158-revise-telegram-mode-a-completion-notification-decision-packet.md` (this file)
- `docs/sessions/2026-05-13-revise-telegram-mode-a-completion-notification-decision-packet.md`
