# Session — External Import Preview Page Route Fix (task 0436)

**Date:** 2026-05-17
**Task:** 0436 — Fix routing for /dev?page=external-import-preview
**Implementer:** Claude Code (Sonnet)

---

## Problem

After task 0435, `/dev?page=external-import-preview` was not serving `ExternalImportPreview.html`. Instead it showed the main app (Index.html) with the Impostazioni / Importa-Esporta section.

## Root Cause

The `doGet(e)` routing used a strict `===` comparison on `e.parameter.page` without sanitizing the value. Possible causes:
- URL-encoded or whitespace-padded parameter value failing strict match
- GAS-side caching serving an older version of Code.gs from task 0435 push
- No alias coverage (URL might have been typed with different casing or slug)

The `.gas/` directory had no stale `Code.js` artifact. Source files and sync script were correct.

## Fix Applied

Updated `doGet(e)` in `src/backend/Code.gs`:

**Before:**
```javascript
function doGet(e) {
  if (e && e.parameter && e.parameter.page === 'external-import-preview') {
```

**After:**
```javascript
function doGet(e) {
  var page = '';
  try {
    page = String((e && e.parameter && e.parameter.page) ? e.parameter.page : '').trim().toLowerCase();
  } catch (_) {
    page = '';
  }

  if (page === 'external-import-preview' || page === 'externalimportpreview' || page === 'import-preview') {
```

- `String(...).trim().toLowerCase()` — normalizes whitespace and case
- Try/catch — defensive against null/undefined throws
- Aliases added: `externalimportpreview`, `import-preview`
- Default route (no parameter) unchanged

## Validations

- `git diff --check`: OK
- `src/frontend/Index.html`: NOT modified (only Code.gs in `git diff --name-only`)
- `.gas/ExternalImportPreview.html`: present (4582 bytes)
- `.gas/Code.js`: absent (no stale artifact)
- No `applyExternalSheetReplace` / `applyReplaceFromExternalSheet` in Code.gs
- `npm run sync`: OK (4 files in .gas/)
- `npx clasp push --force`: 4 files pushed at 23:39:17

## Deploy Status

- **No clasp deploy executed**
- **Production @57 / build 0428: untouched**
- HEAD/dev updated via clasp push --force only

## Test URL

`/dev?page=external-import-preview`

Also accepted after fix:
- `/dev?page=externalImportPreview`
- `/dev?page=import-preview`

Main `/dev` (no parameter) unchanged — still boots Index.html normally.

## Files Modified

| File | Change |
|------|--------|
| `src/backend/Code.gs` | doGet routing made robust (+8 lines, -1) |

## Files NOT Modified

- `src/frontend/Index.html` — untouched
- `src/frontend/ExternalImportPreview.html` — untouched
- `appsscript.json` — untouched
- `package.json` — untouched
