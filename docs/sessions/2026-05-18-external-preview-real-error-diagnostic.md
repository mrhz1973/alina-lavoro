# Session — External Preview Real Error Diagnostic (task 0445)

**Date:** 2026-05-18
**Task:** 0445 — External preview real error diagnostic
**Implementer:** Windsurf/Cascade

---

## Context

The user reported that clicking "Anteprima" with tab "Foglio1" returns only the generic message:
"File non accessibile: verifica che il Google Sheet sia tuo o condiviso con questo account."

The goal is to add a safe diagnostic layer to see the real Advanced Sheets API error instead of the generic message.

---

## Implementation Summary

### 1. Helper Functions Added ✅

**redactSpreadsheetId_(spreadsheetId)**
- Missing/null/empty → "(missing)"
- Short string → first 3 chars + "…"
- Normal ID → first 6 chars + "…" + last 4 chars

**safeExternalImportError_(phase, spreadsheetId, tabName, err)**
- Returns structured diagnostic object
- Includes: phase, spreadsheetIdRedacted, tabName, rawMessage, name, stackFirstLine
- No full IDs, URLs, tokens, or credentials exposed

### 2. Enhanced previewExternalSheetImport ✅

**Improved error handling:**
- `spreadsheet_get` phase: replaces generic metadata error
- `values_get_permission` phase: for permission errors
- `values_get_range` phase: for range parsing errors
- `values_get` phase: for general API errors

**Preserved success output:**
- rowsRead, validRows, invalidRows, recognizedColumns, sampleRows, errors

### 3. New Probe Function ✅

**externalImportPreviewAccessProbe(payload)**
- Tolerant payload handling (url/spreadsheetId, tab/tabName)
- Phase 1: Get spreadsheet metadata with optional fields
- Phase 2: Get sample values from target or first sheet
- Returns detailed success/failure diagnostics

### 4. UI Enhancement ✅

**Added "Verifica accesso file" button:**
- Green button (#27ae60) in inline page
- Calls `externalImportPreviewAccessProbe()`
- Displays diagnostic output with all safe fields
- Shows both success and error details

### 5. Route and Runtime Preservation ✅

**Maintained existing functionality:**
- `/dev?route=external-import-preview-inline` ✅
- `/dev?route=debug-route` ✅
- `externalImportPreviewRuntimeInfo()` ✅
- Marker "0440-runtime-sheets-api" ✅

---

## Validation Results

### Code Quality ✅
- **git diff --check:** Clean (no whitespace issues)
- **SpreadsheetApp.openById:** Only in comments/diagnostic text, not active code
- **Sheets.Spreadsheets API:** Used correctly in all functions

### Functions Present ✅
- ✅ `redactSpreadsheetId_()`
- ✅ `safeExternalImportError_()`
- ✅ `externalImportPreviewAccessProbe()`
- ✅ Enhanced `previewExternalSheetImport()`
- ✅ Updated `buildExternalImportPreviewInlineHtml_()`

### Scopes ✅
- **appsscript.json:** Unchanged (spreadsheets.currentonly, spreadsheets.readonly, script.container.ui)
- **No new scopes added**

---

## Sync and Deployment

### Local → Remote ✅
- **npm run sync:** Completed successfully
- **npx clasp push --force:** Completed successfully
- **npx clasp deploy:** NOT executed (forbidden)

### Remote Verification ❌
**Issue Identified:** After pull, `.gas/Code.gs` and `.gas/Code.js` only contain old functions:
- Missing: `redactSpreadsheetId_`, `safeExternalImportError_`, `externalImportPreviewAccessProbe`
- Present: Only original functions (previewExternalSheetImport, etc.)

**This confirms the sync issue from task 0444 persists.**

---

## Technical Implementation Details

### Diagnostic Fields Returned
```javascript
// Success case
{
  ok: true,
  phase: 'ok',
  spreadsheetIdRedacted: "ABCDEF…1234",
  tabName: "Foglio1",
  title: "Test Sheet",
  availableSheets: ["Foglio1", "Foglio2"],
  valuesRange: "Foglio1!A1:Z20",
  rowsSeen: 15
}

// Error case
{
  ok: false,
  phase: "spreadsheet_get",
  spreadsheetIdRedacted: "ABCDEF…1234",
  tabName: "Foglio1",
  rawMessage: "Requested entity was not found.",
  name: "Exception",
  stackFirstLine: "at Sheets.Spreadsheets.get (Code:123)"
}
```

### UI Display Logic
- **Success:** Shows all diagnostic fields in green result box
- **Error:** Shows error details in red error box
- **No sensitive data:** Full IDs, URLs, tokens never displayed

---

## Production Impact

**Zero impact** - Production @57/build 0428 untouched.
Only HEAD/dev affected by sync issue.

---

## Current Status

**IMPLEMENTATION COMPLETE** - All diagnostic code correctly implemented locally.
**SYNC ISSUE PERSISTS** - Remote Apps Script runtime not updated (same issue as task 0444).

The diagnostic layer is ready and will provide real API errors once the sync issue is resolved.

---

## Next Steps Required

**The diagnostic implementation is complete and ready for testing once sync is fixed:**

1. **Resolve sync issue** - Investigate `.clasp.json` configuration (task 0444)
2. **Test new diagnostics** - Use "Verifica accesso file" button to see real API errors
3. **Analyze real errors** - Use diagnostic output to determine actual API issues

---

## Documentation

- `docs/tasks/done/0445-external-preview-real-error-diagnostic.md` - Task completion summary
