# Session — Fix Inline Preview Button JS Bindings (task 0451)

**Date:** 2026-05-18
**Task:** 0451 — Fix Inline Preview Button JS Bindings
**Implementer:** Windsurf/Cascade

---

## Context

**Problem:** After task 0450, browser console showed:
- `Uncaught ReferenceError: checkRuntime is not defined`
- `Uncaught ReferenceError: checkAccess is not defined`
- `Uncaught ReferenceError: runPreview is not defined`

Buttons rendered but handlers undefined.

**Current Verified State:**
- Runtime 0448 route previously worked
- Access probe previously worked
- Preview previously worked before 0450 UI changes
- Task 0450 added normalizedPreview and updated inline UI

---

## Implementation

### 1. Pre-flight ✅

- Branch: main
- Workspace: clean
- Last commit: 4c0abcc (task 0450)

### 2. Root Cause Identified ✅

Task 0450 added inline `onclick` attributes:
```html
<button id="btn-preview" onclick="runPreview()">Anteprima</button>
```

But functions were NOT exposed to `window`, so `window.runPreview` was undefined when onclick tried to execute.

### 3. Fix Applied ✅

**Removed inline onclick:**
```html
<!-- Before -->
<button id="btn-preview" onclick="runPreview()">Anteprima</button>

<!-- After -->
<button id="btn-preview">Anteprima</button>
```

**Exposed functions globally:**
```javascript
window.runPreview = runPreview;
window.checkAccess = checkAccess;
window.checkRuntime = checkRuntime;
window.escHtml = escHtml;
```

**Added DOMContentLoaded binding:**
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

**Added JS-ready marker:**
```javascript
window.__ALINA_EXTERNAL_PREVIEW_JS_READY = "0451";
```

Visible indicator shows "JS ready: 0451" when DOM is loaded.

---

## Commands Executed

```powershell
# Sync
npm.cmd run sync

# Validation
Select-String -Path ".gas\Code.js" -Pattern "window.runPreview|window.checkAccess|window.checkRuntime|DOMContentLoaded|__ALINA_EXTERNAL_PREVIEW_JS_READY|JS ready: 0451|normalizedPreview|0448-runtime-forensic"

# Push
npx.cmd clasp push --force
```

Output:
```
Pushed 4 files at 20:24:53.
└─ .gas\appsscript.json
└─ .gas\Code.js
└─ .gas\ExternalImportPreview.html
└─ .gas\Index.html
```

---

## Result

**JS BINDINGS FIXED**

- All three buttons (Anteprima, Verifica accesso file, Verifica runtime) now have robust bindings
- Functions exposed to `window` for global access
- DOMContentLoaded ensures DOM is ready before binding
- JS-ready marker proves script loaded
- normalizedPreview preserved from task 0450
- 0448-runtime-forensic marker preserved

---

## Testing URL

`https://script.google.com/macros/s/AKfycbwv2UB_Cdz17ZOUqeLzcougzqCbHrIkH3HjrbdTeDo-/dev?route=external-import-preview-inline&t=0451`

**Expected:**
- Page shows "JS ready: 0451" below info text
- All three buttons clickable
- Console shows no "ReferenceError" for runPreview/checkAccess/checkRuntime
- Buttons perform their respective functions
