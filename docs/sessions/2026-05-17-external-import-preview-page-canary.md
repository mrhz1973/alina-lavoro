# Session — External Import Preview Page Canary (task 0435)

**Date:** 2026-05-17
**Task:** 0435 — Separate external import preview page (dev only)
**Implementer:** Claude Code (Sonnet)

---

## Context

Previous attempts (0430, 0433) failed because external import code was integrated inside the main app (Index.html / renderSettings). Both caused app boot failure ("Apertura app… stuck").

Safe design (0432) mandated a completely separate page, accessible only via URL parameter, with zero impact on main app boot.

---

## What was done

### Files created
- `src/frontend/ExternalImportPreview.html` — standalone minimal HTML page; no app state, no navbar, no boot dependency

### Files modified
- `src/backend/Code.gs` — `doGet(e)` now routes `?page=external-import-preview` to ExternalImportPreview.html; default route (no parameter) unchanged; added `previewExternalSheetImport(payload)` function (read-only) and `extractSpreadsheetId_()` helper
- `appsscript.json` — added `spreadsheets.readonly` scope (needed for cross-spreadsheet read)
- `package.json` — sync script now includes `ExternalImportPreview.html` copy to `.gas/`

### Files NOT modified
- `src/frontend/Index.html` — untouched; APP_BUILD='0428'; no import code added
- No changes to `renderSettings`, `DOMContentLoaded`, `render`, `renderHome`, `showApp`, `initBackground_`, `getBootstrap`

---

## Architecture

- `doGet(e)`: if `e.parameter.page === 'external-import-preview'` → serve ExternalImportPreview.html; else → existing Index.html flow (setupAlinaLavoro + Index)
- `previewExternalSheetImport(payload)`: read-only; extracts spreadsheet ID from URL or raw ID; opens sheet via `SpreadsheetApp.openById`; reads data; returns `{ ok, rowsRead, validRows, invalidRows, recognizedColumns, sampleRows, errors }`
- No LockService, no write, no backup, no replace, no cache, no config modification

---

## Scope

- Added `spreadsheets.readonly` to appsscript.json — required for cross-spreadsheet read via `SpreadsheetApp.openById`
- `spreadsheets.currentonly` retained (used by main app)
- Production @57 uses same appsscript.json via HEAD push; scope addition may prompt re-authorization on next /dev open

---

## Validations run

- `git diff --check`: clean
- Index.html not modified (verified)
- `renderSettings` not modified (verified)
- `renderExternalSheetPreviewSection_` not present in Index.html (verified)
- No external import in boot path (verified)
- `npm run sync` successful
- `.gas/ExternalImportPreview.html` exists (verified)
- `.gas/Index.html` APP_BUILD='0428' (verified)
- `.gas/Code.js` not present (removed if stale)
- `npx clasp push --force`: 4 files pushed OK

---

## Deploy status

- **No deploy executed**
- Production @57 / build 0428 **untouched**
- HEAD/dev updated with new page (clasp push --force only)

---

## How to test

1. Open `/dev?page=external-import-preview` URL in browser
2. Enter a Google Sheet URL or ID (must be accessible by the deploying account)
3. Click "Anteprima"
4. Verify read-only preview result is displayed
5. Verify main `/dev` URL (no parameter) still boots normally

**Do NOT open `/dev` for the main boot test at this stage — only test `?page=external-import-preview`.**

---

## Next step

If `/dev?page=external-import-preview` opens without errors and shows preview correctly:
→ Gate C: full boot test (open `/dev` without parameter, verify normal boot)
→ Then Gate D if C passes: enable replace with backup, LockService, canary only
→ Gate E: production deploy (requires explicit task prompt)

If boot fails on `/dev?page=external-import-preview`:
→ Immediate rollback: revert Code.gs to build 0428 state (restore doGet without routing)

---

## Risk

- `spreadsheets.readonly` scope added to appsscript.json may cause re-authorization prompt on first open
- This is expected and acceptable for a dev preview page
- Production @57 still serves from its own deployed snapshot; scope change in HEAD does not affect @57 until a new deploy is made to @57
