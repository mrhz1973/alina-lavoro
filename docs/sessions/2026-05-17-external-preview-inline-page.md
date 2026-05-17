# Session — External Preview Inline Page (task 0442)

**Date:** 2026-05-17
**Task:** 0442 — External preview inline page
**Implementer:** Windsurf/Cascade

---

## Context

- Production `/exec` stable: @57 / build 0428
- Production must NOT be touched
- `ExternalImportPreview.html` on GitHub contains "Verifica runtime" button, but `/dev` continues serving old page without button
- Task 0441 indicated HTML sync issue, but user test still shows old HTML
- Route `debug-route` works: doGet/Code.gs executes correctly
- Strategy: bypass `ExternalImportPreview.html` and serve preview page inline from Code.gs

---

## Objective

Create new DEV inline route:
`/dev?route=external-import-preview-inline`

This route must show minimal page with:
- Title: "Preview Google Sheet esterno INLINE 0442"
- "Verifica runtime" button
- URL/ID Google Sheet field
- Tab/foglio field
- "Anteprima" button
- Results area

---

## Implementation

### 1. Route Detection

**Added `isExternalImportPreviewInlineRoute_()` function:**
```javascript
function isExternalImportPreviewInlineRoute_(route) {
  return route === 'external-import-preview-inline' ||
         route === 'import-preview-inline';
}
```

### 2. Route Handler

**Added inline route in `doGet(e)`:**
```javascript
if (isExternalImportPreviewInlineRoute_(route)) {
  return HtmlService
    .createHtmlOutput(buildExternalImportPreviewInlineHtml_())
    .setTitle('Preview Google Sheet esterno INLINE 0442')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
```

### 3. HTML Builder Function

**Implemented `buildExternalImportPreviewInlineHtml_()`:**
- Complete minimal HTML page inline
- Title: "Preview Google Sheet esterno INLINE 0442"
- Badge: "SOLO LETTURA — nessuna modifica ai dati"
- "Verifica runtime" button (calls `externalImportPreviewRuntimeInfo()`)
- URL/ID Google Sheet field
- Tab/foglio field
- "Anteprima" button (calls `previewExternalSheetImport()`)
- Results area
- Full CSS styling inline
- JavaScript handlers inline

### 4. Backend Functions Verification

**Confirmed `previewExternalSheetImport()` uses:**
- ✅ `Sheets.Spreadsheets.get()`
- ✅ `Sheets.Spreadsheets.Values.get()`
- ❌ NO `SpreadsheetApp.openById`
- ❌ NO `SpreadsheetApp.openByUrl`

**Confirmed `externalImportPreviewRuntimeInfo()` present:**
- ✅ Returns marker "0440-runtime-sheets-api"
- ✅ Uses no external APIs

---

## Technical Details

### Route Aliases
- `external-import-preview-inline`
- `import-preview-inline`

### HTML Features
- Responsive design with max-width 640px
- Mobile-friendly viewport meta tag
- Consistent styling with original preview page
- Error handling for both preview and runtime check
- Proper HTML escaping

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
✅ **previewExternalSheetImport:** NO `SpreadsheetApp.openById`/`openByUrl` active  
✅ **externalImportPreviewRuntimeInfo:** Present and correct  
✅ **New route external-import-preview-inline:** Present  
✅ **appsscript.json:** NO full spreadsheets scope  
✅ **appsscript.json:** NO Drive scope  
✅ **NO replace functions:** `applyExternalSheetReplace`, `applyReplaceFromExternalSheet`  
✅ **NO data writing in preview flow**  
✅ **npm run sync:** completed  
✅ **npx clasp push --force:** completed (NO deploy)  

---

## Files Modified

- `src/backend/Code.gs` - Added inline route and HTML builder function

---

## Test Instructions

**URL:** `/dev?route=external-import-preview-inline`

**Expected Results:**
1. Page title: "Preview Google Sheet esterno INLINE 0442"
2. Orange "Verifica runtime" button visible
3. Click "Verifica runtime" → shows marker "0440-runtime-sheets-api"
4. Click "Anteprima" → uses Advanced Sheets Service read-only
5. No dependency on ExternalImportPreview.html file sync

---

## Production Impact

**Zero impact** - Production @57/build 0428 untouched.
Only HEAD/dev updated with inline route.

---

## Purpose

This inline approach bypasses the HTML sync issues from tasks 0440/0441 by:
- Generating HTML directly from Code.gs
- No dependency on separate HTML file sync
- Ensuring runtime diagnostic works correctly
- Validating Advanced Sheets Service read-only implementation

---

## Status

**INLINE ROUTE IMPLEMENTED** - External preview page now served inline from Code.gs.
Ready for user testing to verify runtime diagnostic and preview functionality without HTML sync dependencies.
