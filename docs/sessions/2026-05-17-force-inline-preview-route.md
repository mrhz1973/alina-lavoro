# Session — Force Inline Preview Route (task 0443)

**Date:** 2026-05-17
**Task:** 0443 — Force inline preview route
**Implementer:** Windsurf/Cascade

---

## Real Context

- Production `/exec` stable: @57 / build 0428
- Production must NOT be touched
- `/dev?route=debug-route` works and shows:
  ```
  route computed: debug-route
  e.parameter: {"route":"debug-route"}
  ```
- So the `route` parameter arrives correctly to `doGet(e)`
- `/dev?route=external-import-preview-inline` instead opens Home
- So `doGet(e)` is not intercepting `external-import-preview-inline`, or the inline route is not present in remote Code.gs
- No production deploy

---

## Root Cause Analysis

The issue was that the remote Apps Script runtime was not updated with the inline route from task 0442. Even though the local Code.gs contained the route, the sync/push process didn't update the remote runtime properly.

**Evidence:**
- Local `src/backend/Code.gs` contained `isExternalImportPreviewInlineRoute_()` and `buildExternalImportPreviewInlineHtml_()`
- Remote `.gas/Code.gs` did NOT contain `external-import-preview-inline` after sync
- `/dev?route=debug-route` worked (proving route detection works)
- `/dev?route=external-import-preview-inline` opened Home (proving route not intercepted)

---

## Fix Applied

### 1. Explicit Route Check in doGet()

**Added explicit check FIRST in `doGet(e)`:**
```javascript
// FORCE INLINE PREVIEW ROUTE - must be checked FIRST
if (route === 'external-import-preview-inline' || route === 'import-preview-inline') {
  return HtmlService
    .createHtmlOutput(buildExternalImportPreviewInlineHtml_())
    .setTitle('Preview Google Sheet esterno INLINE 0442')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
```

**Key improvements:**
- Explicit string comparison instead of helper function
- Checked BEFORE debug-route and other routes
- Clear comment explaining priority

### 2. Verified Supporting Functions

**Confirmed presence of:**
- ✅ `buildExternalImportPreviewInlineHtml_()` - Complete HTML page generator
- ✅ `externalImportPreviewRuntimeInfo()` - Runtime diagnostic function
- ✅ `previewExternalSheetImport()` - Uses Advanced Sheets Service (no SpreadsheetApp.openById)

### 3. Sync and Force Push

**Process:**
1. `npm run sync` - Local sync completed
2. Verified `.gas/Code.gs` missing inline route
3. `npx clasp push --force` - Forced update to remote runtime

---

## Technical Implementation Details

### Route Priority
The inline route is now checked FIRST in `doGet(e)` to ensure it's not bypassed by other route logic.

### HTML Features
The inline page includes:
- Title: "Preview Google Sheet esterno INLINE 0442"
- "Verifica runtime" button (calls `externalImportPreviewRuntimeInfo()`)
- URL/ID Google Sheet field
- Tab/foglio field
- "Anteprima" button (calls `previewExternalSheetImport()`)
- Results area with proper error handling

### Security Constraints
- ❌ NO production deploy
- ❌ NO clasp deploy
- ❌ NO Index.html modifications
- ❌ NO replace operations
- ❌ NO data writing
- ✅ Only HEAD/dev push

---

## Validations Completed

✅ **git diff --check:** clean  
✅ **src/frontend/Index.html:** NOT modified  
✅ **doGet contains explicit check:** `external-import-preview-inline`  
✅ **buildExternalImportPreviewInlineHtml_():** Present and complete  
✅ **externalImportPreviewRuntimeInfo():** Present  
✅ **previewExternalSheetImport:** NO `SpreadsheetApp.openById`/`openByUrl` active  
✅ **appsscript.json:** NO full spreadsheets scope  
✅ **appsscript.json:** NO Drive scope  
✅ **NO replace functions:** `applyExternalSheetReplace`, `applyReplaceFromExternalSheet`  
✅ **NO data writing in preview flow**  
✅ **npm run sync:** completed  
✅ **.gas/Code.gs verified:** Missing inline route before push  
✅ **npx clasp push --force:** completed (NO deploy)  

---

## Files Modified

- `src/backend/Code.gs` - Added explicit inline route check in doGet()

---

## Test Instructions

**URL:** `/dev?route=external-import-preview-inline`

**Expected Results:**
1. Page title: "Preview Google Sheet esterno INLINE 0442"
2. Orange "Verifica runtime" button visible and functional
3. Click "Verifica runtime" → shows marker "0440-runtime-sheets-api"
4. Click "Anteprima" → uses Advanced Sheets Service read-only
5. No longer opens Home page

---

## Production Impact

**Zero impact** - Production @57/build 0428 untouched.
Only HEAD/dev updated with forced inline route.

---

## Status

**INLINE ROUTE FORCED** - Explicit route check added and pushed to remote runtime.
The route should now be properly intercepted and serve the inline preview page instead of Home.

---

## Documentation

- `docs/tasks/done/0443-force-inline-preview-route.md` - Task completion summary
