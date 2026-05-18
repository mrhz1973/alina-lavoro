# Task 0452 — Harden Inline Preview Button Binding

**Status:** ✅ DONE (Robust Button Binding Implemented)
**Date:** 2026-05-18
**Implementer:** Windsurf/Cascade

---

## Objective

Make the inline preview buttons work robustly in Apps Script HTMLService iframe context after task 0451 failed to show the JS ready marker in browser.

---

## Problem Statement

Task 0451 was present in `.gas/Code.js` and in Apps Script Editor Code.js, but the browser page still showed no "JS ready: 0451" and buttons did not respond.

**User verified:**
- `.gas/Code.js` contains `__ALINA_EXTERNAL_PREVIEW_JS_READY` and `window.runPreview/checkAccess/checkRuntime`
- Apps Script Editor Code.js contains 0451
- `npx.cmd clasp push --force` says "Script is already up to date"
- Browser still does not show JS ready marker
- Buttons show pointer cursor but do nothing

**Root Cause:**
The `DOMContentLoaded`-only binding used in 0451 is not reliable in Apps Script web app iframe context. The event may already have fired or the user HTML may be injected in a way that prevents the listener from running as expected.

---

## Implementation Summary

### 1. Restored Inline onclick Fallback ✅

Added inline `onclick` attributes back to buttons for maximum compatibility:

```html
<button id="btn-preview" onclick="runPreview()">Anteprima</button>
<button id="btn-access" onclick="checkAccess()">Verifica accesso file</button>
<button id="btn-runtime" onclick="checkRuntime()">Verifica runtime</button>
```

### 2. Kept Global Exports ✅

Functions remain exposed to `window`:

```javascript
window.runPreview = runPreview;
window.checkAccess = checkAccess;
window.checkRuntime = checkRuntime;
window.escHtml = escHtml;
```

### 3. Replaced DOMContentLoaded-Only with Robust Init ✅

Added `initExternalPreviewButtons()` function that:
- Sets the visible marker to "JS ready: 0452"
- Sets `window.__ALINA_EXTERNAL_PREVIEW_JS_READY = "0452"`
- Checks `document.readyState` to handle both loading and already-loaded scenarios

```javascript
function initExternalPreviewButtons() {
  var marker = document.getElementById("js-ready-marker");
  if (marker) marker.textContent = "JS ready: 0452";
  window.__ALINA_EXTERNAL_PREVIEW_JS_READY = "0452";
}

window.initExternalPreviewButtons = initExternalPreviewButtons;

// Initialize immediately or wait for DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initExternalPreviewButtons);
} else {
  initExternalPreviewButtons();
}
```

### 4. Removed addEventListener Click Handlers ✅

Since inline `onclick` is restored, removed the `addEventListener` click bindings to avoid double execution.

### 5. Preserved Backend Logic ✅

- `normalizedPreview` from task 0450: preserved
- `0448-runtime-forensic` marker: preserved
- Backend preview logic: unchanged
- Read-only behavior: maintained

---

## Validation Results

✅ **Inline onclick present**: `onclick="runPreview()"`, `onclick="checkAccess()"`, `onclick="checkRuntime()"`
✅ **Global exports present**: `window.runPreview`, `window.checkAccess`, `window.checkRuntime`
✅ **Init function present**: `initExternalPreviewButtons`
✅ **JS ready marker**: "JS ready: 0452" and `__ALINA_EXTERNAL_PREVIEW_JS_READY = "0452"`
✅ **Robust readyState check**: `if (document.readyState === "loading")`
✅ **normalizedPreview preserved**: Present in response
✅ **0448-runtime-forensic preserved**: Present
✅ **authorizeSheetsReadonlyOnce absent**: Not found
✅ **SpreadsheetApp.openById absent**: Only in comment
✅ **npm.cmd run sync executed**: Exit code 0
✅ **npx.cmd clasp push --force executed**: Pushed 4 files at 21:47:58
✅ **clasp deploy NOT executed**: Forbidden
✅ **production @57 untouched**: Confirmed

---

## Testing Instructions

**URL to test:**
`https://script.google.com/macros/s/AKfycbwv2UB_Cdz17ZOUqeLzcougzqCbHrIkH3HjrbdTeDo-/dev?route=external-import-preview-inline&t=0452`

**Expected behavior:**
- Page loads and shows "JS ready: 0452" below info text
- All three buttons (Anteprima, Verifica accesso file, Verifica runtime) are clickable
- Console shows no "ReferenceError" for runPreview/checkAccess/checkRuntime
- Buttons perform their respective functions when clicked

---

## Files Changed

- `src/backend/Code.gs` — Updated `buildExternalImportPreviewInlineHtml_()` with robust button binding
- `docs/tasks/done/0452-harden-inline-preview-button-binding.md` — This task documentation
- `docs/sessions/2026-05-18-harden-inline-preview-button-binding.md` — Session log
- `docs/LLMS.md` — Updated task state
- `docs/wiki/current-state.md` — Updated current state

---

## Forbidden Actions Compliance

✅ **No production deploy**
✅ **No clasp deploy**
✅ **No data import into app database**
✅ **No write operations**
✅ **No SpreadsheetApp.openById active code**
✅ **No authorizeSheetsReadonlyOnce temporary function**
✅ **Production @57 untouched**

---

## Current Status

**INLINE PREVIEW BUTTON BINDING HARDENED**

The inline preview now uses:
- Inline `onclick` fallback for maximum compatibility
- Global `window` exports for function availability
- `initExternalPreviewButtons()` with `document.readyState` check
- Immediate initialization if DOM already loaded
- Visible "JS ready: 0452" marker

Ready for user testing.
