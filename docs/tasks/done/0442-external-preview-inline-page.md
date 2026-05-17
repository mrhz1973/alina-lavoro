# Task 0442 — External Preview Inline Page

**Status:** ✅ DONE
**Date:** 2026-05-17
**Implementer:** Windsurf/Cascade

---

## Objective

Create new DEV inline route `/dev?route=external-import-preview-inline` to bypass HTML sync issues and serve external preview page directly from Code.gs.

---

## Problem Statement

- Production `/exec` stable: @57 / build 0428
- `ExternalImportPreview.html` on GitHub contains "Verifica runtime" button, but `/dev` continues serving old page without button
- Task 0441 fixed HTML sync issue, but user test still shows old HTML
- Route `debug-route` works: doGet/Code.gs executes correctly
- Need to bypass `ExternalImportPreview.html` dependency

---

## Solution Implemented

### Route Detection Function
```javascript
function isExternalImportPreviewInlineRoute_(route) {
  return route === 'external-import-preview-inline' ||
         route === 'import-preview-inline';
}
```

### Route Handler in doGet()
```javascript
if (isExternalImportPreviewInlineRoute_(route)) {
  return HtmlService
    .createHtmlOutput(buildExternalImportPreviewInlineHtml_())
    .setTitle('Preview Google Sheet esterno INLINE 0442')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
```

### Inline HTML Builder
**Implemented `buildExternalImportPreviewInlineHtml_()` - Complete HTML page with:**
- Title: "Preview Google Sheet esterno INLINE 0442"
- Badge: "SOLO LETTURA — nessuna modifica ai dati"
- "Verifica runtime" button (calls `externalImportPreviewRuntimeInfo()`)
- URL/ID Google Sheet field
- Tab/foglio field  
- "Anteprima" button (calls `previewExternalSheetImport()`)
- Results area
- Full CSS and JavaScript inline

### Route Aliases
- `external-import-preview-inline`
- `import-preview-inline`

---

## Technical Implementation Details

### HTML Features
- Responsive design (max-width 640px)
- Mobile-friendly viewport meta tag
- Consistent styling with original preview page
- Error handling for both preview and runtime check
- Proper HTML escaping

### Backend Integration
- **Runtime Check:** Calls `externalImportPreviewRuntimeInfo()` → shows marker "0440-runtime-sheets-api"
- **Preview Function:** Calls `previewExternalSheetImport()` → uses Advanced Sheets Service read-only
- **No External Dependencies:** HTML generated entirely from Code.gs

---

## Constraints Respected

- ❌ **NO production deploy**
- ❌ **NO clasp deploy**
- ❌ **NO Index.html modifications**
- ❌ **NO replace operations**
- ❌ **NO data writing**
- ❌ **NO full spreadsheets scope**
- ❌ **NO Drive scope**
- ❌ **NO git add .**
- ✅ **HEAD/dev push only**

---

## Validation Results

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

- `src/backend/Code.gs` - Added inline route detection, handler, and HTML builder function

---

## Test Instructions

**URL:** `/dev?route=external-import-preview-inline`

**Expected Results:**
1. ✅ Page title: "Preview Google Sheet esterno INLINE 0442"
2. ✅ Orange "Verifica runtime" button visible
3. ✅ Click "Verifica runtime" → shows marker "0440-runtime-sheets-api"
4. ✅ Click "Anteprima" → uses Advanced Sheets Service read-only
5. ✅ No dependency on ExternalImportPreview.html file sync

---

## Production Impact

**Zero impact** - Production @57/build 0428 untouched.
Only HEAD/dev updated with inline route.

---

## Status

**INLINE ROUTE IMPLEMENTED** - External preview page now served inline from Code.gs.
Ready for user testing to verify runtime diagnostic and preview functionality without HTML sync dependencies.

---

## Documentation

- `docs/sessions/2026-05-17-external-preview-inline-page.md` - Full implementation session
