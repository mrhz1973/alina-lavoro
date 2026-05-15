# Task 0322 — Retarget Release to V2.0.0

- Project: Alina Lavoro
- Type: app-finalization
- Priority: normal
- Deploy policy: no

## Objective

Skip V1.9.3 release label and retarget the prepared source (V1.9.3-prep, tasks 0316–0321) to V2.0.0 before any deploy. Version-only retarget; no deploy, no tag, no rollback.

## Done status

- Completed by: Claude Code (supervised)
- Date: 2026-05-15
- Session: `docs/sessions/2026-05-15-retarget-release-to-v200.md`
- Files changed:
  - `src/frontend/Index.html` — APP_VERSION 1.9.3 → 2.0.0
  - `package.json` — version 1.9.3 → 2.0.0
  - `docs/LLMS.md` — state updated to V2.0.0-prep
  - `docs/wiki/current-state.md` — state updated to V2.0.0-prep
  - `docs/roadmap.md` — Stato attuale updated to V2.0.0-prep
  - `docs/sessions/2026-05-15-retarget-release-to-v200.md` — session note
  - `docs/tasks/done/0322-retarget-release-to-v200.md` — this file
- Source files modified: src/frontend/Index.html (APP_VERSION only)
- Backend changed: No
- APP_VERSION: 2.0.0
- Deploy/tag/rollback: No
- Production: V1.9.2 @24 unchanged
- Next step: task 0323 — V2.0.0 deploy gate — requires explicit user authorization
