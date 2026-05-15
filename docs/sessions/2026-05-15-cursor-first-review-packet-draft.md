# Session — Cursor-first review packet draft

- **Date:** 2026-05-15
- **Task ID:** 0310
- **Repository:** mrhz1973/alina-lavoro · branch: main
- **Implementer:** Claude Code (supervised)

## Objective

Draft the exact Review Packet shape for Cursor Agent 2 reviewing Cursor Agent 1 output (design-only; no runtime).

## Actions taken

- Added §24 (Cursor-first review packet — Agent 2 reviewing Agent 1) to `docs/automation/dual-cli-orchestrator-lite-design.md`.
- Section specifies all required fields: reviewed_task_id, implementer_role (Cursor-specific addition), commit_hash, changed_files, checks_observed, allowed_paths_result, forbidden_paths_result, final_status, gate_status, reviewer_decision, next_action.
- Status definitions: APPROVED, NEEDS_FIX, FAILED, HUMAN_GATE_REQUIRED.
- Critical rule: Agent 2 must verify diff/commit/changed files from GitHub directly, not trust Agent 1's prose alone.
- States no automated merge or deploy is triggered by APPROVED.

## Files modified

- `docs/automation/dual-cli-orchestrator-lite-design.md` — §24 appended
- `docs/tasks/done/0310-cursor-first-review-packet-draft.md` — done marker
- `docs/sessions/2026-05-15-cursor-first-review-packet-draft.md` — this file
- `docs/LLMS.md` — Last completed updated to 0310
- `docs/wiki/current-state.md` — Last completed updated to 0310

## Checks run

- `git status` — clean before start (after 0309 push)

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

Task 0311 — cursor-first-no-op-dry-run-plan
