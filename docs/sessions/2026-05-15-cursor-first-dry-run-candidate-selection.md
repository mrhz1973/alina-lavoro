# Session — Cursor-first dry-run candidate selection

- **Date:** 2026-05-15
- **Task ID:** 0308
- **Repository:** mrhz1973/alina-lavoro · branch: main
- **Implementer:** Claude Code (supervised)

## Objective

Define the safest candidate shape for the future Cursor-first dry-run (design-only; no runtime).

## Actions taken

- Added §22 (Cursor-first dry-run candidate selection) to `docs/automation/dual-cli-orchestrator-lite-design.md`.
- Section defines: mandatory candidate criteria (docs-only, no app, no n8n runtime, no Telegram, no deploy/tag/rollback, no secrets, one trivial task only); what the dry-run proves (artifact handoff, not code functionality); what it does not prove; scope boundary.

## Files modified

- `docs/automation/dual-cli-orchestrator-lite-design.md` — §22 appended
- `docs/tasks/done/0308-cursor-first-dry-run-candidate-selection.md` — done marker
- `docs/sessions/2026-05-15-cursor-first-dry-run-candidate-selection.md` — this file
- `docs/LLMS.md` — Last completed updated to 0308
- `docs/wiki/current-state.md` — Last completed updated to 0308

## Checks run

- `git status` — clean before start
- `git log --oneline -5` — last commit 673d8c0 (task 0307)
- Task-ID preflight — 0308 confirmed free

## Confirmation

- No Cursor execution
- No n8n runtime
- No Ollama execution
- No app source changes
- No deploy / tag / rollback
- No provider API / billing / secrets
- No real chat_id / OAuth / credentials

## Residual risks

None.

## Next micro-step

Task 0309 — cursor-first-task-packet-draft
