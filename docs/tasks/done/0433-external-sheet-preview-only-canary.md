# Task 0433 — External Sheet Preview Only Canary

- Project: Alina Lavoro
- Type: app-source
- Priority: normal
- Deploy policy: push-only (no deploy)
- Branch: main

## Objective

Implement Step B of the external Google Sheet import safe design (task 0432):
preview-only UI + backend in HEAD/dev, no production deploy.

## Done status

- Completed by: Claude Code (Sonnet)
- Completion date: 2026-05-17
- Completion commit: see git log
- Session: `docs/sessions/2026-05-17-external-sheet-preview-only-canary.md`

### Evidence

- `src/backend/Code.gs` — added `previewExternalSheetImport()` + `extractSpreadsheetId_()` (read-only, no writes)
- `src/frontend/Index.html` — added external sheet preview section in Settings; `APP_BUILD='0433'`
- `appsscript.json` — added `spreadsheets.readonly` scope
- `npx clasp push --force` executed — HEAD updated, no new deploy
- Production @57 / build 0428 NOT touched
- Forbidden functions not present (`applyExternalSheetReplace`, `applyReplaceFromExternalSheet`)
- Boot path isolation verified — preview only on explicit button click
- All frontend checks passed (syntax OK, no modern operators, tabs OK)

### Post-completion outcome

**CANARY FAILED — /dev boot test FAIL (2026-05-17)**
- Symptom: /dev blocked on "Apertura app…"
- Root cause: `renderExternalSheetPreviewSection_()` called inside `renderSettings()` — rendering errors in this function affect app boot
- No hotfix attempted per safe design policy
- Rolled back by task 0434: HEAD/dev restored to build 0428
- Session: `docs/sessions/2026-05-17-rollback-broken-preview-canary.md`
