# Session Note — 2026-05-14 — Local Clone Preflight Standardization

**Date:** 2026-05-14
**Task:** 0274
**Type:** docs-only
**Agent:** Windsurf/Cascade

---

## What was done

Added a mandatory local clone preflight to existing implementer docs:

1. `docs/tasks/templates/implementer-standard.md` — new subsection "Local clone preflight (run before any edit)" with 5 git commands and dirty/clean decision rules.
2. `docs/COMMANDS.md` — new section "Mandatory local preflight" with the same reusable command block.
3. `docs/LLMS.md` and `docs/wiki/current-state.md` — Last completed → 0274.

## Why

Multi-workstation setup (Windows workstation + Mac M2) means the local clone can be stale, on a wrong branch, or dirty from a previous session. The preflight prevents:
- working on a stale clone;
- working in the wrong folder;
- assigning a duplicate task ID;
- pulling over uncommitted changes.

## Forbidden actions respected

No runtime, no n8n, no app, no deploy/tag/rollback, no provider API, no billing, no secrets. No new guidance doc created.
