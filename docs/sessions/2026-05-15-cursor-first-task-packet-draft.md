# Session — Cursor-first task packet draft

- **Date:** 2026-05-15
- **Task ID:** 0309
- **Repository:** mrhz1973/alina-lavoro · branch: main
- **Implementer:** Claude Code (supervised)

## Objective

Draft the exact Task Packet shape for the future Cursor Agent 2 → Cursor Agent 1 handoff (design-only; no runtime).

## Actions taken

- Added §23 (Cursor-first task packet — Agent 2 → Agent 1) to `docs/automation/dual-cli-orchestrator-lite-design.md`.
- Section specifies all required fields: task_id, role_assignment (Cursor-specific addition over §12), expected_previous_state, goal, allowed_paths, forbidden_paths, required_reads, runtime_gate_status, stop_conditions, expected_outputs, session_note_path, done_marker_path, review_packet_expected.
- States that the packet is produced by Agent 2 only, never self-assigned by Agent 1.
- States a packet without review_packet_expected: true is malformed.

## Files modified

- `docs/automation/dual-cli-orchestrator-lite-design.md` — §23 appended
- `docs/tasks/done/0309-cursor-first-task-packet-draft.md` — done marker
- `docs/sessions/2026-05-15-cursor-first-task-packet-draft.md` — this file
- `docs/LLMS.md` — Last completed updated to 0309
- `docs/wiki/current-state.md` — Last completed updated to 0309

## Checks run

- `git status` — clean before start (after 0308 push)

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

Task 0310 — cursor-first-review-packet-draft
