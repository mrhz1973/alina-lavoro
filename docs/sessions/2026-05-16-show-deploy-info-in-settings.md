# Session — 2026-05-16 — Show deploy info in Settings (task 0414)

## Summary

Added `APP_DEPLOY` and `APP_BUILD` constants to `src/frontend/Index.html` and updated the Settings page version line to show three items: app version, Apps Script deploy slot, and source build level.

## Changes

- `src/frontend/Index.html`: added `const APP_DEPLOY='@35';` and `const APP_BUILD='0413';` after `APP_VERSION`; replaced single version line with `Versione: 2.2.0 · Deploy: @35 · Build: 0413`

## Checks

- `git diff --check`: clean
- JS syntax (`node --check` on extracted inline script): OK
- Modern operator grep: no matches
- data-page tabs: home, months, notes
- import/export functions: present (5 matches)

## Deploy / tag / rollback

- Deploy: NOT executed
- Tag: NOT created
- Rollback: NOT executed
- Production remains @35

## Commit

- Hash: 8b7b393
- Branch: worktree-tranquil-jumping-pebble → merged to main
