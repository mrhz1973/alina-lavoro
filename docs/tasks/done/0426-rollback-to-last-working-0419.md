# Task 0426 — Rollback to last working build 0419

- Project: Alina Lavoro
- Type: rollback
- Priority: urgent
- Deploy: yes (authorized)
- Status: done

## Objective

Restore the live Web App to build 0419 / deploy @45 state after 0420–0425
left the app broken (boot error "Errore avvio app / Build 0425").

## Done status

- Completed by: Claude Code (Sonnet)
- Completion commit: `6c38dd4`
- Deploy: @53 (same ID/URL as @52)
- APP_BUILD restored: `0419`
- Method: source restore from git commit `e476618` + clasp push --force + deploy
- Checks: git diff --check clean · node --check OK · npm run sync OK · push OK
- External sheet import: not live (feature suspended)
- Stable tag: not created
- 0391/0392: remain pending
- Session: `docs/sessions/2026-05-17-rollback-to-last-working-0419.md`
