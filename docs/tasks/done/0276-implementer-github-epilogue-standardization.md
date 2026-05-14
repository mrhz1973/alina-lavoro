# Task 0276 — Implementer GitHub Epilogue Standardization

**Task:** 0276
**Date:** 2026-05-14
**Type:** docs-only
**Status:** completed

---

## Purpose

Make explicit in existing templates that every supervised implementer — Claude Code, Windsurf/Cascade, Cursor, and Antigravity — must follow the same standard flow and persist the final report to GitHub, so the orchestrator can recover it via `aggio` without user copy/paste.

## Changes

### docs/tasks/templates/implementer-standard.md
- Added "Applies to: Claude Code, Windsurf/Cascade, Cursor, and Antigravity."
- Clarified all are supervised implementers, not autonomous runners.
- Added "Read GitHub instructions, not only chat" requirement.
- Added "Final report persistence" section: report must be written to `docs/sessions/YYYY-MM-DD-<slug>.md` and (if numbered task) `docs/tasks/done/<task-id>-<slug>.md`, then pushed selectively.

### docs/tasks/templates/final-report-contract.md
- Added "Applies to" note for all four implementers.
- Added explicit statement that the final report must **not** remain only in terminal/chat.
- Specified GitHub persistence targets (`docs/sessions/`, `docs/tasks/done/`).
- Specified selective push requirement so orchestrator can read via `aggio`.

### docs/tasks/templates/docs-only-task.md
- Updated "Expected output" section to name exact target paths for done marker and session note.
- Added explicit requirement that both must be pushed to GitHub for orchestrator recovery.

### docs/LLMS.md
- Last completed → 0276.
- Added Antigravity to implementers table.

### docs/wiki/current-state.md
- Last updated header → task 0276.
- Last completed → 0276, Previous → 0275.

## What was NOT done

- No new guidance/policy/checklist document created.
- No AGENTS.md change (not necessary).
- No runtime, n8n, app, deploy, tag, rollback, provider API, billing, secrets.
