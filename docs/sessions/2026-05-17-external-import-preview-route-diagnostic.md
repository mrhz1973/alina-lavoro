# Session — External Import Preview Route Diagnostic (task 0437)

**Date:** 2026-05-17
**Task:** 0437
**Branch:** main
**Commit:** 5d45c8f

## Context

Tasks 0435+0436 added ExternalImportPreview.html and robust doGet routing, but the user
reported that `/dev?page=external-import-preview` still opened the main app Home instead
of the preview page.

## Root cause analysis

Previous doGet read only `e.parameter.page`. The ordering was already correct (route check
before default Index serve). However:
- Only one parameter name (`page`) was checked — not `route`, `view`, `alinaPage`
- No diagnostic route existed to verify that Apps Script was receiving URL parameters at all
- Possible GAS caching of stale push from task 0436

## Changes made

`src/backend/Code.gs`:
- Added `getRequestRoute_(e)` — reads `page`, `route`, `view`, `alinaPage` in order; first
  non-empty value wins; normalizes via `String(...).trim().toLowerCase()`
- Added `isExternalImportPreviewRoute_(route)` — accepts four aliases:
  `external-import-preview`, `externalimportpreview`, `import-preview`, `importpreview`
- `doGet(e)` now calls `getRequestRoute_(e)` first, then:
  1. If `route === 'debug-route'` → returns minimal HTML with `e.parameter` JSON dump
  2. If `isExternalImportPreviewRoute_(route)` → serves ExternalImportPreview.html
  3. Otherwise → setupAlinaLavoro() + Index.html (unchanged)

`src/frontend/Index.html`: **NOT modified**
`src/frontend/ExternalImportPreview.html`: NOT modified
Production @57: **NOT touched, NOT deployed**

## Validations

- git diff showed only Code.gs changed
- .gas/Code.js: not present
- .gas/ExternalImportPreview.html: present after npm run sync
- `debug-route` and `getRequestRoute_` both verified in .gas/Code.gs
- clasp push --force: 4 files pushed at 23:47:49

## Test sequence (manual — user must perform)

**Step 1 — verify Apps Script receives parameters:**
`/dev?route=debug-route`
Expected: HTML page showing "ALINA ROUTE DEBUG" + `e.parameter` JSON

**Step 2 — test preview page:**
`/dev?route=external-import-preview`
or
`/dev?page=external-import-preview`
Expected: Preview Google Sheet esterno page

## Open

- Phone test gate pending (user)
- If debug-route shows empty e.parameter, the issue is URL parameter passing in Apps Script /dev URL
