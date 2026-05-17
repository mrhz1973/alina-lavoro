# Session — External Sheet Preview Only Canary (task 0433)

**Date:** 2026-05-17
**Task:** 0433 — Preview-only canary: external Google Sheet import (Step B of safe design)
**Implementer:** Claude Code (Sonnet)
**APP_BUILD:** 0433

---

## Status

Implementation complete. HEAD pushed via `clasp push --force`.
**Production @57 NOT touched. No deploy executed. No new deployment created.**

---

## What was done

### Backend (`src/backend/Code.gs`)

Added two functions:

- `previewExternalSheetImport(accessCode, urlOrId, sheetName, dataType)` — read-only preview of an external Google Sheet
  - Extracts spreadsheet ID from full URL or bare ID (≥20 chars alphanumeric)
  - Opens external spreadsheet via `SpreadsheetApp.openById()`
  - Reads specified tab or first sheet if tab is empty
  - Delegates to existing `buildImportPreview_()` for row analysis (no new write logic)
  - Returns: `{ ok, rowsRead, validRows, invalidRows, recognizedColumns, sampleRows, errors, externalSheetName, externalTabName }`
  - Errors handled: invalid ID, inaccessible sheet, tab not found, empty sheet
  - NOT called from boot path

- `extractSpreadsheetId_(urlOrId)` — private helper to extract ID from full URL or bare ID

### Frontend (`src/frontend/Index.html`)

- `APP_BUILD` updated from `'0428'` to `'0433'`
- New section added in Settings after the existing import/export section:
  - `renderExternalSheetPreviewSection_()` — renders the new card with inputs and preview button
  - `doPreviewExternalSheet_()` — async; only called by explicit button click; NOT in boot path
  - `renderExtSheetPreviewResult_()` — displays preview result inline

UI fields:
- URL o ID Google Sheet esterno
- Nome tab / foglio (optional, defaults to first sheet)
- Tipo dati (optional, defaults to auto-detect from headers)
- Pulsante: "Anteprima Google Sheet"

No write operations, no replace button, no backup creation, no destructive actions.

### `appsscript.json`

Added scope: `https://www.googleapis.com/auth/spreadsheets.readonly`
Required for `SpreadsheetApp.openById()` on external spreadsheets.

Note: scope addition may require re-authorization on next access. Production @57 is NOT affected until a new deploy is created.

---

## Boot path isolation verification

- `previewExternalSheetImport` is NOT called from: `doGet`, `getBootstrap`, `render`, `renderHome`, `renderSettings` (auto), `initBackground_`, `flushQueue`, `saveCache`, `loadCache`
- `doPreviewExternalSheet_()` is only triggered by explicit button click in Settings
- `renderSettings` calls `renderExternalSheetPreviewSection_()` to build HTML, but no server call is made on render — only on button click

---

## Checks executed

- `git diff --check` — no trailing whitespace
- JavaScript inline script extraction + `node --check` — syntax OK
- `grep` for modern operators (`??`, `||=`, `?.`) — none found
- `grep` for forbidden functions (`applyExternalSheetReplace`, `applyReplaceFromExternalSheet`) — none found
- `data-page` tabs (home, months, notes) — all present, no regression
- `npm run sync` — synced to `.gas/`
- `.gas/Code.js` removed (stale pull artifact)
- `npx clasp push --force` — pushed 3 files

---

## Production state

| Field | Value |
|---|---|
| Production URL | @57 (unchanged) |
| Production build | 0428 (unchanged) |
| Rollback reference | `v2.2.0-build0428-stable` / @55 |
| HEAD build | 0433 |
| Deploy 0433 | NOT created — push to HEAD only |

To test build 0433: use Apps Script editor > Deploy > Test deployments (HEAD).
**Do NOT test via production /exec URL** — that still serves @57 / build 0428.

---

## Next step (if needed)

Per safe design (task 0432), Step C is: full boot test on HEAD (open app, navigate, verify no hang).
Step D (replace + backup + LockService) and Step E (production deploy) require separate explicit task gates.
