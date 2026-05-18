# Session — Harden Inline Preview Button Binding (task 0452)

**Date:** 2026-05-18
**Task:** 0452 — Harden Inline Preview Button Binding
**Implementer:** Windsurf/Cascade

---

## Context

**Problem:** Task 0451 was present in Apps Script Editor but browser did not show JS ready marker.

**User evidence:**
- `.gas/Code.js` contains `__ALINA_EXTERNAL_PREVIEW_JS_READY` and window exports
- Apps Script Editor Code.js contains 0451 code
- `npx.cmd clasp push --force` says "Script is already up to date"
- Browser shows no "JS ready: 0451" marker
- Buttons show pointer cursor but do nothing

**Root cause identified:** `DOMContentLoaded`-only binding not reliable in Apps Script iframe context.

---

## Implementation

### 1. Pre-flight ✅

- Branch: main
- Workspace: clean
- Last commit: d0def74 (task 0451)

### 2. Changes Applied ✅

**Restored inline onclick:**
```html
<button id="btn-preview" onclick="runPreview()">Anteprima</button>
<button id="btn-access" onclick="checkAccess()">Verifica accesso file</button>
<button id="btn-runtime" onclick="checkRuntime()">Verifica runtime</button>
```

**Added robust init function:**
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

**Removed addEventListener click handlers:**
- Only inline onclick is used (no double binding)

### 3. Validation ✅

**Patterns verified in src/backend/Code.gs:**
- `JS ready: 0452` ✅
- `__ALINA_EXTERNAL_PREVIEW_JS_READY` ✅
- `onclick="runPreview"` ✅
- `onclick="checkAccess"` ✅
- `onclick="checkRuntime"` ✅
- `window.runPreview` ✅
- `window.checkAccess` ✅
- `window.checkRuntime` ✅
- `initExternalPreviewButtons` ✅
- `normalizedPreview` ✅
- `0448-runtime-forensic` ✅
- `authorizeSheetsReadonlyOnce` ❌ (absent as required)

**Staging validation (.gas/Code.js):**
- All patterns present ✅

---

## Commands Executed

```powershell
# Validation
git diff --check
Select-String -Path "src\backend\Code.gs" -Pattern "JS ready: 0452|__ALINA_EXTERNAL_PREVIEW_JS_READY|onclick=`"runPreview|window.runPreview|initExternalPreviewButtons"

# Sync
npm.cmd run sync

# Staging validation
Select-String -Path ".gas\Code.js" -Pattern "JS ready: 0452|__ALINA_EXTERNAL_PREVIEW_JS_READY|onclick=`"runPreview|window.runPreview|initExternalPreviewButtons"

# Push
npx.cmd clasp push --force
```

**Output:**
```
Pushed 4 files at 21:47:58.
└─ .gas\appsscript.json
└─ .gas\Code.js
└─ .gas\ExternalImportPreview.html
└─ .gas\Index.html
```

---

## Result

**BUTTON BINDING HARDENED**

- Inline onclick restored as fallback
- Global window exports maintained
- Robust init with document.readyState check
- Immediate init if DOM already loaded
- JS ready marker: 0452
- normalizedPreview preserved
- 0448-runtime-forensic preserved

---

## Testing URL

`https://script.google.com/macros/s/AKfycbwv2UB_Cdz17ZOUqeLzcougzqCbHrIkH3HjrbdTeDo-/dev?route=external-import-preview-inline&t=0452`

**Expected:**
- Shows "JS ready: 0452" below info text
- All buttons clickable via inline onclick
- No console ReferenceError
- Buttons work immediately
