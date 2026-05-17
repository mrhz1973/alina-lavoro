# Task 0440 — External Preview Runtime Version Check

**Status:** ✅ DONE
**Date:** 2026-05-17
**Implementer:** Windsurf/Cascade

---

## Objective

Add minimal runtime diagnostic to external preview page to verify which version/function is actually running, since user still sees `SpreadsheetApp.openById` error despite correct source code.

---

## Problem Statement

GitHub source code is correct (0438 fix applied):
- `previewExternalSheetImport` uses `Sheets.Spreadsheets.get`/`Values.get`
- No `SpreadsheetApp.openById`/`openByUrl` active
- Advanced Sheets Service enabled
- Proper readonly scopes

But `/dev?route=external-import-preview` still shows:
"SpreadsheetApp.openById requires https://www.googleapis.com/auth/spreadsheets"

Suggests runtime is executing old code.

---

## Solution Implemented

### Backend Diagnostic Function

**Added `externalImportPreviewRuntimeInfo()` in `src/backend/Code.gs`:**
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

**Constraints respected:**
- ❌ NO `SpreadsheetApp.openById` calls
- ❌ NO `SpreadsheetApp.openByUrl` calls
- ❌ NO Sheets API calls
- ❌ NO external sheet access
- ✅ Pure diagnostic function

### Frontend Runtime Check

**Added "Verifica runtime" button in `src/frontend/ExternalImportPreview.html`:**
- Orange button next to "Anteprima"
- Calls `google.script.run.externalImportPreviewRuntimeInfo()`
- Shows runtime marker, timestamp, usage info

**Added `checkRuntime()` JavaScript function:**
- Handles button state and loading
- Displays diagnostic results
- Error handling for runtime failures

---

## Technical Implementation Details

### Function Signature
```javascript
// Backend
externalImportPreviewRuntimeInfo() → {
  ok: true,
  marker: "0440-runtime-sheets-api", 
  timestamp: "2026-05-17T...",
  uses: "Sheets.Spreadsheets.Values.get",
  spreadsheetAppOpenByIdExpected: false
}

// Frontend
google.script.run.externalImportPreviewRuntimeInfo()
```

### UI Changes
- Button: `<button id="btn-runtime" onclick="checkRuntime()" style="background: #f39c12; margin-left: 10px;">Verifica runtime</button>`
- Results displayed in existing `#result-area`

---

## Validation Results

✅ **git diff --check:** clean  
✅ **src/frontend/Index.html:** NOT modified  
✅ **previewExternalSheetImport:** NO `SpreadsheetApp.openById`/`openByUrl` active  
✅ **externalImportPreviewRuntimeInfo:** NO `SpreadsheetApp.openById`/`openByUrl`  
✅ **appsscript.json:** NO full spreadsheets scope  
✅ **appsscript.json:** NO Drive scope  
✅ **npm run sync:** completed  
✅ **npx clasp push --force:** completed (NO deploy)  

---

## Test Instructions

**URL:** `/dev?route=external-import-preview`

**Steps:**
1. Open page in browser
2. Click **"Verifica runtime"** button
3. Verify result shows:
   ```
   Runtime Marker: 0440-runtime-sheets-api
   Timestamp: [current ISO timestamp]
   Uses: Sheets.Spreadsheets.Values.get
   SpreadsheetApp.openById Expected: false
   ```

**Interpretation:**
- ✅ Marker "0440-runtime-sheets-api" → Runtime is correct
- ❌ Missing/error marker → Runtime executing old code

---

## Expected Outcomes

**If runtime check passes:**
- Issue is client-side cache or authorization
- Recommend hard refresh and re-authorization

**If runtime check fails:**
- Investigate Apps Script deployment/caching issues
- May require additional debugging

---

## Files Modified

- `src/backend/Code.gs` - Added `externalImportPreviewRuntimeInfo()` function
- `src/frontend/ExternalImportPreview.html` - Added runtime check button and handler

---

## Production Impact

**Zero impact** - Production @57/build 0428 untouched.
Only HEAD/dev updated with diagnostic.

---

## Status

**IMPLEMENTATION COMPLETE** - Runtime diagnostic added and pushed to HEAD/dev.
Ready for user testing to determine actual runtime version.

---

## Documentation

- `docs/sessions/2026-05-17-external-preview-runtime-version-check.md` - Full session details
