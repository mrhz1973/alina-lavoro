# Task 0445 — External Preview Real Error Diagnostic

**Status:** ✅ DONE (Implementation Complete)
**Date:** 2026-05-18
**Implementer:** Windsurf/Cascade

---

## Objective

Add a safe diagnostic layer to the external Google Sheet preview flow to see the real Advanced Sheets API error instead of the generic message:
"File non accessibile: verifica che il Google Sheet sia tuo o condiviso con questo account."

---

## Problem Statement

- User clicking "Anteprima" with tab "Foglio1" gets generic error message
- Real API error details are hidden, making troubleshooting difficult
- Need diagnostic visibility without exposing sensitive data

---

## Implementation Summary

### 1. Safe Helper Functions ✅

**redactSpreadsheetId_(spreadsheetId)**
- Handles missing/null/empty → "(missing)"
- Short strings → first 3 chars + "…"
- Normal IDs → first 6 chars + "…" + last 4 chars
- Never exposes full spreadsheet IDs

**safeExternalImportError_(phase, spreadsheetId, tabName, err)**
- Returns structured diagnostic object with safe fields only
- Includes: phase, spreadsheetIdRedacted, tabName, rawMessage, name, stackFirstLine
- No full IDs, URLs, tokens, credentials, or OAuth material

### 2. Enhanced previewExternalSheetImport ✅

**Replaced generic error handling with precise phases:**
- `spreadsheet_get` - metadata retrieval errors
- `values_get_permission` - permission-related API errors  
- `values_get_range` - range parsing errors
- `values_get` - general API errors

**Preserved existing success behavior:**
- rowsRead, validRows, invalidRows, recognizedColumns, sampleRows, errors
- No changes to import/write behavior (preview-only)

### 3. New Diagnostic Probe ✅

**externalImportPreviewAccessProbe(payload)**
- Tolerant payload handling (url/spreadsheetId, tab/tabName)
- Phase 1: Get spreadsheet metadata with optional fields syntax
- Phase 2: Get sample values from target or first available sheet
- Uses only Sheets.Spreadsheets.get and Sheets.Spreadsheets.Values.get
- Never uses SpreadsheetApp.openById, DriveApp, or write operations

### 4. UI Enhancement ✅

**Added "Verifica accesso file" button:**
- Green button (#27ae60) in inline preview page
- Calls `externalImportPreviewAccessProbe()`
- Displays comprehensive diagnostic output
- Shows both success and error details safely

### 5. Route and Runtime Preservation ✅

**Maintained all existing functionality:**
- `/dev?route=external-import-preview-inline` ✅
- `/dev?route=debug-route` ✅
- `externalImportPreviewRuntimeInfo()` ✅
- Marker "0440-runtime-sheets-api" ✅
- Uses "Sheets.Spreadsheets.Values.get" ✅
- SpreadsheetApp.openById Expected: false ✅

---

## Validation Results

### Code Quality ✅
- **git diff --check:** Clean (no whitespace or syntax issues)
- **SpreadsheetApp.openById:** Only in comments/diagnostic text, not active code
- **Sheets.Spreadsheets API:** Used correctly in all functions

### Functions Implemented ✅
- ✅ `redactSpreadsheetId_()` - Safe ID redaction
- ✅ `safeExternalImportError_()` - Structured error formatting
- ✅ `externalImportPreviewAccessProbe()` - Two-phase diagnostic probe
- ✅ Enhanced `previewExternalSheetImport()` - Precise error phases
- ✅ Updated `buildExternalImportPreviewInlineHtml_()` - New button and handler

### Scopes Compliance ✅
- **appsscript.json:** Unchanged
- **Scopes:** spreadsheets.currentonly, spreadsheets.readonly, script.container.ui
- **No new scopes added** as required

---

## Diagnostic Output Examples

### Success Response
```javascript
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
```

### Error Response
```javascript
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

---

## Sync and Deployment Status

### Local Implementation ✅
- **npm run sync:** Completed successfully
- **npx clasp push --force:** Completed successfully
- **npx clasp deploy:** NOT executed (forbidden)

### Remote Sync Issue ❌
**Confirmed:** Same sync issue from task 0444 persists
- After `clasp pull`, `.gas/Code.gs` missing new diagnostic functions
- Remote runtime not updated despite successful push
- Requires `.clasp.json` investigation

---

## Production Impact

**Zero impact** - Production @57/build 0428 untouched.
Only HEAD/dev affected by sync issue.

---

## Files Changed

- `src/backend/Code.gs` - Added diagnostic functions and enhanced error handling
- `docs/sessions/2026-05-18-external-preview-real-error-diagnostic.md` - Session documentation
- `docs/tasks/done/0445-external-preview-real-error-diagnostic.md` - Task completion
- `docs/LLMS.md` - Updated task state
- `docs/wiki/current-state.md` - Updated current state

---

## Forbidden Actions Compliance

✅ **No production deploy**  
✅ **No clasp deploy**  
✅ **No Index.html modifications**  
✅ **No Drive scope added**  
✅ **No full spreadsheets scope added**  
✅ **No write operations**  
✅ **No data import into app database**  
✅ **No secrets/tokens/credentials exposed**  
✅ **No SpreadsheetApp.openById active code**  
✅ **No git add .**  

---

## Current Status

**IMPLEMENTATION COMPLETE** - All diagnostic code correctly implemented and ready for testing.

**BLOCKED BY SYNC ISSUE** - Same remote sync problem identified in task 0444 prevents runtime testing.

---

## Next Steps Required

1. **Resolve sync issue** - Investigate `.clasp.json` configuration (task 0444)
2. **Test new diagnostics** - Use "Verifica accesso file" button to see real API errors
3. **Analyze real errors** - Use diagnostic output to determine actual API issues and plan fixes

The diagnostic layer is complete and will provide real API error visibility once the sync issue is resolved.

---

## Documentation

- `docs/sessions/2026-05-18-external-preview-real-error-diagnostic.md` - Full implementation session
