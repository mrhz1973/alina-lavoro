# Task 0275 — AGENTS.md Compact Routing Pointer Cleanup

**Task:** 0275
**Date:** 2026-05-14
**Type:** docs-only
**Status:** completed

---

## Purpose

Keep AGENTS.md pointer-only and compact after V3.1 consolidation (0273) and local clone preflight (0274).

## Changes

### AGENTS.md
- Removed `docs/wiki/v31-enforcement-checklist.md` pointer (Prompt Size Guard is now consolidated into `docs/wiki/prompt-routing.md`).
- Updated `prompt-routing.md` description to include "+ Prompt Size Guard + Docs ROI Gate".
- Added new section "Local clone preflight" pointing to `implementer-standard.md` § Local clone preflight and `docs/COMMANDS.md` § Mandatory local preflight.
- AGENTS.md remains pointer-only — no rules, no state, no duplication.

### State files
- `docs/LLMS.md` — Last completed → 0275.
- `docs/wiki/current-state.md` — Last completed → 0275, Previous → 0274.

## What was NOT done

- No new guidance/policy/checklist document created.
- No runtime, n8n, app, deploy, tag, rollback, provider API, billing, secrets.
