# Task 0436 — External Import Preview Page Route Fix

- Project: Alina Lavoro
- Type: app-backend
- Priority: normal
- Deploy policy: no (dev-head push only)
- Status: done

## Objective

Fix `doGet(e)` routing so that `/dev?page=external-import-preview` correctly serves `ExternalImportPreview.html` instead of the main Index.html app.

## Done status

- Completed by: Claude Code (Sonnet)
- Completion commit: see below
- Session: `docs/sessions/2026-05-17-external-import-preview-page-route-fix.md`

### Evidence

- `doGet(e)` updated with robust routing: `String(...).trim().toLowerCase()` + aliases + try/catch
- `src/frontend/Index.html`: NOT modified
- Production @57 / build 0428: untouched
- No deploy executed
- `clasp push --force`: 4 files pushed OK
- Test URL: `/dev?page=external-import-preview`
