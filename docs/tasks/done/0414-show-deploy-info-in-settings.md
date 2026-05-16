# Task 0414 — Show deploy info in Settings

## Done status

- Completed by: Claude Code (worktree session 2026-05-16)
- Completion commit: 8b7b393
- Session: docs/sessions/2026-05-16-show-deploy-info-in-settings.md

## Evidence

- Added `APP_DEPLOY='@35'` and `APP_BUILD='0413'` constants
- Settings page now shows: `Versione: 2.2.0 · Deploy: @35 · Build: 0413`
- No deploy executed; production remains @35
- All standard frontend checks passed
