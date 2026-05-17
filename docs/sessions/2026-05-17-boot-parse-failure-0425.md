# Session — Boot parse failure forensic hotfix 0425
**Date:** 2026-05-17
**Task:** 0425
**Branch:** main
**APP_BUILD:** 0425 → Deploy @52

## Forensic analysis

**Hypothesis tested (parse failure):** `node --check` on all 3 inline scripts → PASS. No parse error.

**Apostrophe check:** `l'app` in I18N string uses U+2019 (RIGHT SINGLE QUOTATION MARK, `\xe2\x80\x99`) — NOT U+0027. No string termination issue.

**No `getlementById` typo found.**

**No optional chaining `?.` or nullish coalescing `??` found.**

**Root causes identified (runtime, not parse):**

1. **Missing `readyState` guard on DOMContentLoaded:** In cached/preloaded GAS web app scenarios, the DOMContentLoaded event may have already fired before the script executes (readyState is already `'interactive'` or `'complete'`). The old `document.addEventListener('DOMContentLoaded', fn)` pattern silently registers a listener that never fires. Neither `render()` nor the fallback ever gets called. Boot placeholder stays forever.

2. **No try/catch around renderXxx() in render():** If `renderHome()` (or any other renderXxx) throws at runtime, `render()` throws, and `_bootMain_`'s catch calls `renderBootFallback_()`. But `renderBootFallback_()` had an early-return path if `#content` is null that fails SILENTLY — user sees the boot placeholder, NOT the fallback.

3. **`renderBootFallback_()` silent failure:** If `document.getElementById('content')` returns null for any reason, the function returns immediately with no visible output. User sees boot placeholder with no error indication.

## Fixes applied

### 1. Panic boot script (separate ES5 script, before main script)
- Added as separate `<script>` before the main `<script>` block.
- Pure ES5: `var`, no arrow functions, no const/let, no optional chaining.
- Wrapped in total try/catch.
- Uses `readyState` check: if loading → addEventListener DOMContentLoaded + setTimeout 2000ms; else → setTimeout 2000ms directly.
- If `#bootPlaceholder` still in DOM after 2 seconds, injects "Errore avvio app / Build 0425 / Riprova" into `#content`.
- Diagnostic function: if this shows but main app doesn't, JavaScript is running but main script's render chain is failing.

### 2. DOMContentLoaded → _bootMain_() with readyState guard
- Extracted boot logic to `function _bootMain_()`.
- Boot trigger: `if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',_bootMain_)}else{_bootMain_()}`
- Guarantees `_bootMain_()` runs regardless of when the script executes relative to DOM readiness.

### 3. render() — try/catch around all renderXxx() calls
- Wrapped all `renderXxx()` calls in `try{...}catch(e){try{renderBootFallback_()}catch(_){}}`.
- Uses `else if` chain (equivalent behavior, more efficient).
- If any renderXxx throws, `renderBootFallback_()` is called immediately.

### 4. renderBootFallback_() — body injection fallback
- If `document.getElementById('content')` returns null, creates a fixed-position full-screen div and appends it to `document.body` instead of silently returning.
- Updated message to include "Build 0425" for diagnostic identification.
- Added `location.reload()` button as alternative to retryBoot_().

### 5. APP_BUILD updated to '0425'

## Import/Export status
- External Google Sheet import code (introduced in 0420) NOT suspended.
- No parse error, no boot dependency from external import code.
- External import only activates from Settings page, not at boot.

## Validations
- `git diff --check`: PASS (0 whitespace errors)
- `node --check` script_check_0.js (theme script): PASS
- `node --check` script_check_1.js (panic script): PASS
- `node --check` script_check_2.js (main script): PASS
- `npm run sync`: OK
- `.gas/Index.html` APP_BUILD='0425': CONFIRMED
- `.gas/Index.html` APP_BUILD='0424' not present: CONFIRMED
- `clasp push --force`: Pushed 3 files OK
- `clasp deploy --deploymentId`: @52 OK
- `clasp pull` remote verify APP_BUILD='0425': CONFIRMED

## Deploy
- Deployment ID: AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ
- Deploy number: @52
- URL: unchanged

## Next gate
- 0391: manual phone test for @52
- 0392: stable tag after test pass
- If user sees "Build 0425" panic boot but not Home: main render chain still failing → further diagnosis needed
- If user sees Home page: fixed
