# Task 0435 — External Import Preview Page Canary

- Project: Alina Lavoro
- Type: app-canary
- Priority: normal
- Deploy policy: clasp push only — NO deploy

## Objective

Create a completely separate dev-only page for external Google Sheet import preview, accessible via `?page=external-import-preview`, with zero impact on main app boot.

## Done status

- Completed by: Claude Code (Sonnet)
- Completion date: 2026-05-17
- Session: `docs/sessions/2026-05-17-external-import-preview-page-canary.md`

### Evidence

- `src/frontend/ExternalImportPreview.html` created — standalone minimal page
- `src/backend/Code.gs` updated — `doGet` routes `?page=external-import-preview`; `previewExternalSheetImport` function added (read-only)
- `appsscript.json` — `spreadsheets.readonly` scope added
- `package.json` — sync includes ExternalImportPreview.html
- `npx clasp push --force` — 4 files pushed: appsscript.json, Code.gs, ExternalImportPreview.html, Index.html
- `src/frontend/Index.html` — NOT modified; APP_BUILD='0428' unchanged
- No deploy executed; production @57 untouched

### Test URL

`/dev?page=external-import-preview`

### What was NOT done (by design)

- No production deploy
- No replace / write operations
- No modification to Index.html, renderSettings, boot path
- No git add .
