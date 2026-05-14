# Task 0274 — Local Clone Preflight Standardization

**Task:** 0274
**Date:** 2026-05-14
**Type:** docs-only
**Status:** completed

---

## Purpose

Codify a mandatory local clone preflight for all future Claude Code / Windsurf / Cursor implementer sessions. Prevents stale clones, wrong folders, duplicate task IDs, and accidental overwrites in the multi-workstation setup.

## Changes

- `docs/tasks/templates/implementer-standard.md` — added "Local clone preflight" subsection under Mandatory preflight: 5 git commands, dirty-tree stop rule, clean-tree pull rule.
- `docs/COMMANDS.md` — added "Mandatory local preflight" reusable command block with the same commands and decision logic.
- `docs/LLMS.md` — Last completed → 0274.
- `docs/wiki/current-state.md` — Last completed → 0274, Previous → 0273.

## What was NOT done

- No new guidance/policy document created (edits to existing templates and command reference only).
- No runtime, n8n, app, deploy, tag, rollback, provider API, billing, secrets.

---

*Local clone preflight standardized in existing docs. No new files beyond done marker and session note.*
