# Session — Retarget Release to V2.0.0 (task 0322)

- Date: 2026-05-15
- Task: 0322
- Type: app-finalization / version retarget
- Branch: main

## Context

V1.9.3-prep source was ready on main (tasks 0316–0321, physical test OK 2026-05-15).
User chose to skip the V1.9.3 release label and retarget the prepared source to V2.0.0 before any deploy.

## Changes

- `src/frontend/Index.html`: APP_VERSION 1.9.3 → 2.0.0
- `package.json`: version 1.9.3 → 2.0.0
- `docs/LLMS.md`: state updated to V2.0.0-prep; last completed → 0322
- `docs/wiki/current-state.md`: state updated to V2.0.0-prep; last completed → 0322
- `docs/roadmap.md`: Stato attuale updated to V2.0.0-prep; V1.9.3 label noted as skipped

## Production state

- Production unchanged: V1.9.2 @24, tag v1.9.2-stable.
- No deploy performed.
- No tag created.
- No rollback.

## Next step

Task 0323 — V2.0.0 deploy gate — requires explicit user authorization before any deploy.
