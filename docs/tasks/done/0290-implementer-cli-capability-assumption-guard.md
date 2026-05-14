# Task 0290 — Implementer CLI Capability Assumption Guard

- Project: Alina Lavoro
- Type: docs-only
- Priority: normal
- Deploy: no

## Objective

Add a capability guard to the dual CLI design: do not assume every supervised implementer has a usable CLI/runtime interface. Claude Code is currently confirmed as CLI; Cursor, Windsurf/Cascade, and Antigravity must be verified before any dual CLI/runtime implementation.

## Done status

- Completed by: Claude Code (supervised)
- Completion date: 2026-05-15
- Completion commit: (see session note)
- Files changed:
  - `docs/automation/dual-cli-orchestrator-lite-design.md` — §1b updated with CLI capability column and capability guard note
  - `docs/LLMS.md` — task state updated
  - `docs/wiki/current-state.md` — task state updated
  - `docs/tasks/done/0290-implementer-cli-capability-assumption-guard.md` — this file
  - `docs/sessions/2026-05-15-implementer-cli-capability-assumption-guard.md` — session note
- Checks: docs-only, no runtime, no forbidden paths touched
- Dual CLI remains LATER/GATED
