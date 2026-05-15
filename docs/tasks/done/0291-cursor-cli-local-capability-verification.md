# Task 0291 — Cursor CLI Local Capability Verification

- Project: Alina Lavoro
- Type: docs-only capability probe
- Priority: normal
- Deploy: no

## Goal

Verify whether Cursor has a usable local CLI or command interface for the future dual CLI design.

## Done status

- Completed by: Claude Code (supervised implementer)
- Completion date: 2026-05-15
- Completion commit: (see push below)
- Session: `docs/sessions/2026-05-15-cursor-cli-local-capability-verification.md`

## Result

**Partially present / interactive-only.**

- Binary found: `C:\Program Files\cursor\resources\app\bin\cursor` (v3.3.30)
- `cursor agent` subcommand present — "Start the Cursor agent in your terminal"
- No headless/batch/force-mode flags confirmed
- Not suitable for unattended runtime automation as-is

§1b status: **Unverified for runtime automation** (CLI present, interactive-only, headless not confirmed).
Dual CLI remains LATER/GATED.
