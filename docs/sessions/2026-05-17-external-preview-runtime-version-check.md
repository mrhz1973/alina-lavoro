# Session — External Preview Runtime Version Check (task 0440)

**Date:** 2026-05-17
**Task:** 0440 — External preview runtime version check
**Implementer:** Windsurf/Cascade

---

## Context

GitHub source code is correct:
- `previewExternalSheetImport` uses `Sheets.Spreadsheets.get` / `Values.get`
- No `SpreadsheetApp.openById`/`openByUrl` active
- Advanced Sheets Service enabled in manifest
- No full spreadsheets scope
- No Drive scope

But user test on `/dev?route=external-import-preview` still shows error:
"SpreadsheetApp.openById requires https://www.googleapis.com/auth/spreadsheets"

This suggests runtime `/dev` is executing old code or unexpected copy.

---

## Objective

Add minimal runtime diagnostic to the separate preview page to verify which version/function is actually running.

---

## Implementation

### Backend Changes (src/backend/Code.gs)

**Added `externalImportPreviewRuntimeInfo()` function:**
```javascript
function externalImportPreviewRuntimeInfo() {
  return {
    ok: true,
    marker: "0440-runtime-sheets-api",
    timestamp: new Date().toISOString(),
    uses: "Sheets.Spreadsheets.Values.get",
    spreadsheetAppOpenByIdExpected: false
  };
}
```

- **NO `SpreadsheetApp.openById`** calls
- **NO `SpreadsheetApp.openByUrl`** calls  
- **NO Sheets API** calls
- **NO external sheet access**
- Pure diagnostic function

### Frontend Changes (src/frontend/ExternalImportPreview.html)

**Added "Verifica runtime" button:**
- Orange button next to "Anteprima"
- Calls `google.script.run.externalImportPreviewRuntimeInfo()`
- Displays runtime marker, timestamp, and usage info

**JavaScript function `checkRuntime()`:**
- Handles button state and loading
- Displays diagnostic results in result area
- Error handling for runtime failures

---

## Validations

✅ **git diff --check:** clean  
✅ **src/frontend/Index.html:** NOT modified  
✅ **previewExternalSheetImport:** NO `SpreadsheetApp.openById`/`openByUrl` active  
✅ **externalImportPreviewRuntimeInfo:** NO `SpreadsheetApp.openById`/`openByUrl`  
✅ **appsscript.json:** NO full spreadsheets scope  
✅ **appsscript.json:** NO Drive scope  
✅ **npm run sync:** completed  
✅ **npx clasp push --force:** completed (NO deploy)  

---

## Files Modified

- `src/backend/Code.gs` - Added `externalImportPreviewRuntimeInfo()` function
- `src/frontend/ExternalImportPreview.html` - Added runtime check button and handler

---

## Test Instructions

URL: `/dev?route=external-import-preview`

1. Open page in browser
2. Click **"Verifica runtime"** button
3. Expected result:
   ```
   Runtime Marker: 0440-runtime-sheets-api
   Timestamp: [current ISO timestamp]
   Uses: Sheets.Spreadsheets.Values.get
   SpreadsheetApp.openById Expected: false
   ```

4. If marker shows "0440-runtime-sheets-api" → runtime is correct
5. If marker missing/error → runtime is executing old code

---

## Purpose

This diagnostic will determine if:
- `/dev` runtime is executing the new 0438+0440 code
- There's a caching/deployment issue
- The error is client-side vs server-side

---

## Production Impact

**Zero impact** - Production @57/build 0428 untouched.
Only HEAD/dev updated with runtime diagnostic.

---

## Next Steps

If runtime check shows correct marker:
- Issue is likely client-side cache or authorization
- Recommend hard refresh and re-authorization

If runtime check shows old/missing marker:
- Investigate Apps Script deployment/caching issues
- May require additional debugging

---

## Status

**IMPLEMENTATION COMPLETE** - Runtime diagnostic added and pushed to HEAD/dev.
Ready for user testing to determine actual runtime version.
