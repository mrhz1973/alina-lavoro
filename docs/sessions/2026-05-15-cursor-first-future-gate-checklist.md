# Session — Cursor-first future gate checklist

- **Date:** 2026-05-15
- **Task ID:** 0313
- **Repository:** mrhz1973/alina-lavoro · branch: main
- **Implementer:** Claude Code (supervised)

## Objective

Prepare a compact checklist for the future user gate that would authorize the first Cursor-first dry-run (checklist text only; does not open any gate; does not create a Decision Packet).

## Actions taken

- Added §27 (Cursor-first dry-run future gate checklist) to `docs/automation/dual-cli-orchestrator-lite-design.md`.
- Section provides a 9-item pre-gate checklist: Cursor availability confirmed, workspace clean, Agent 1/2 separation feasible, no app/runtime/deploy, no secrets, task is docs-only/no-op, rollback is no further action, ChatGPT aggio verification, stop conditions accepted.
- States explicitly what does NOT open the gate (reading the section, running this docs-only chain, any agent action without explicit user confirmation).
- No Decision Packet created in docs/INBOX.md.

## Files modified

- `docs/automation/dual-cli-orchestrator-lite-design.md` — §27 appended
- `docs/tasks/done/0313-cursor-first-future-gate-checklist.md` — done marker
- `docs/sessions/2026-05-15-cursor-first-future-gate-checklist.md` — this file
- `docs/LLMS.md` — Last completed updated to 0313
- `docs/wiki/current-state.md` — Last completed updated to 0313

## Checks run

- `git status` — clean before start (after 0312 push)

## Confirmation

- No Cursor execution
- No n8n runtime
- No Ollama execution
- No app source changes
- No deploy / tag / rollback
- No provider API / billing / secrets
- No real chat_id / OAuth / credentials
- No Decision Packet opened in INBOX

## Residual risks

None.

## Next micro-step

Task 0314 — cursor-first-dry-run-readiness-marker
