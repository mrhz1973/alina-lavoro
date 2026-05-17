# Task 0434 — Rollback Broken Preview Canary

- Project: Alina Lavoro
- Type: rollback
- Priority: urgent
- Deploy policy: push-only (no deploy)
- Branch: main

## Objective

Roll back HEAD/dev from build 0433 (broken preview canary) to build 0428 baseline.
Production @57 must not be touched.

## Done status

- Completed by: Claude Code (Sonnet)
- Completion date: 2026-05-17
- Session: `docs/sessions/2026-05-17-rollback-broken-preview-canary.md`

### Evidence

- Source restored from `v2.2.0-build0428-stable` tag via `git checkout v2.2.0-build0428-stable -- src/frontend/Index.html src/backend/Code.gs appsscript.json`
- `APP_BUILD='0428'` confirmed in `src/frontend/Index.html`
- `previewExternalSheetImport` not present in `src/backend/Code.gs`
- `spreadsheets.readonly` not present in `appsscript.json`
- All frontend checks passed (diff-check, node --check, sync)
- `npx clasp push --force` — HEAD updated, 3 files pushed, no deploy created
- Production @57 / build 0428 NOT touched
- import Google Sheet external NOT live
