# Task 0451 — Fix Inline Preview Button JS Bindings

**Status:** ✅ DONE (JS Bindings Fixed)
**Date:** 2026-05-18
**Implementer:** Windsurf/Cascade

---

## Objective

Fix the inline preview page JavaScript so the three buttons work again after task 0450 changes broke the button handlers.

---

## Problem Statement

After task 0450, the external Google Sheet inline preview page loads but buttons do nothing.

Browser console evidence:
- `Uncaught ReferenceError: checkRuntime is not defined`
- `Uncaught ReferenceError: checkAccess is not defined`
- `Uncaught ReferenceError: runPreview is not defined`

The HTML buttons were rendered, but the client-side JavaScript functions were not globally available.

---

## Root Cause

Task 0450 updated the inline UI HTML generation in `buildExternalImportPreviewInlineHtml_()` with inline `onclick` attributes:
```html
<button id="btn-preview" onclick="runPreview()">Anteprima</button>
```

However, the JavaScript functions (`runPreview`, `checkAccess`, `checkRuntime`, `escHtml`) were defined in the local scope of the script block but NOT exposed to the global `window` object. When the browser tried to execute `onclick="runPreview()"`, it looked for `window.runPreview` which was undefined.

---

## Implementation Summary

### 1. Removed Fragile Inline onclick Attributes ✅

Changed from:
```html
<button id="btn-preview" onclick="runPreview()">Anteprima</button>
<button id="btn-access" onclick="checkAccess()">Verifica accesso file</button>
<button id="btn-runtime" onclick="checkRuntime()">Verifica runtime</button>
```

To:
```html
<button id="btn-preview">Anteprima</button>
<button id="btn-access">Verifica accesso file</button>
<button id="btn-runtime">Verifica runtime</button>
```

### 2. Exposed Functions Globally ✅

Added at the end of the script block:
```javascript
window.runPreview = runPreview;
window.checkAccess = checkAccess;
window.checkRuntime = checkRuntime;
window.escHtml = escHtml;
```

### 3. Added Robust DOMContentLoaded Binding ✅

Added event listener after DOM is ready:
```javascript
document.addEventListener("DOMContentLoaded", function() {
  var btnPreview = document.getElementById("btn-preview");
  var btnAccess = document.getElementById("btn-access");
  var btnRuntime = document.getElementById("btn-runtime");
  if (btnPreview) btnPreview.addEventListener("click", runPreview);
  if (btnAccess) btnAccess.addEventListener("click", checkAccess);
  if (btnRuntime) btnRuntime.addEventListener("click", checkRuntime);
});
```

### 4. Added JS-Ready Marker ✅

Added global marker and visible indicator:
```javascript
window.__ALINA_EXTERNAL_PREVIEW_JS_READY = "0451";
```

Added visible div:
```html
<div id="js-ready-marker" style="font-size:0.7rem;color:#888;margin-top:4px;"></div>
```

Which displays "JS ready: 0451" after DOM is loaded.

---

## Validation Results

✅ **window.runPreview present** — Function exposed globally
✅ **window.checkAccess present** — Function exposed globally
✅ **window.checkRuntime present** — Function exposed globally
✅ **DOMContentLoaded listener present** — Event binding after DOM ready
✅ **__ALINA_EXTERNAL_PREVIEW_JS_READY = 
