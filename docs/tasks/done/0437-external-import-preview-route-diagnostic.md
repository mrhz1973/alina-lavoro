# Task 0437 — External Import Preview Route Diagnostic

- Project: Alina Lavoro
- Type: app-backend-only
- Priority: high
- Deploy: no-production / dev-head-only

## Objective

Diagnose and fix doGet routing so `/dev?page=external-import-preview` actually serves
ExternalImportPreview.html instead of the main app.

## Done status

- Completed by: Claude Code
- Completion commit: 5d45c8f
- Date: 2026-05-17
- Session: docs/sessions/2026-05-17-external-import-preview-route-diagnostic.md

**Changes:**
- `getRequestRoute_(e)` helper — reads page/route/view/alinaPage
- `isExternalImportPreviewRoute_(route)` — 4 aliases supported
- `debug-route` diagnostic page — shows raw e.parameter JSON
- doGet restructured: debug-route → preview-route → default Index

**Not changed:** Index.html, ExternalImportPreview.html, appsscript.json
**Production @57:** not touched, not deployed

**Test URLs:**
- `/dev?route=debug-route` — verify Apps Script receives params
- `/dev?route=external-import-preview` — preview page
- `/dev?page=external-import-preview` — preview page (original param)
