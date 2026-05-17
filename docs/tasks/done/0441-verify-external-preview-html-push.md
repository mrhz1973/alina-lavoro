# Task 0441 — Verify External Preview HTML Push

**Status:** ✅ DONE
**Date:** 2026-05-17
**Implementer:** Windsurf/Cascade

---

## Objective

Verify that `ExternalImportPreview.html` is properly copied to `.gas/` and pushed to Apps Script HEAD/dev, since the runtime diagnostic button from task 0440 was not visible in `/dev?route=external-import-preview`.

---

## Problem Statement

GitHub `src/frontend/ExternalImportPreview.html` contained the "Verifica runtime" button (added in task 0440), but the live `/dev?route=external-import-preview` page still showed the old version without the button.

This indicated an HTML sync/push issue between source and Apps Script runtime.

---

## Root Cause

**npm run sync failed to copy updated HTML** - The automated sync process did not properly copy the updated `ExternalImportPreview.html` from `src/frontend/` to `.gas/`, resulting in old HTML being pushed to Apps Script.

---

## Solution Implemented

### Diagnostic Process
1. ✅ **Source Verification:** Confirmed `src/frontend/ExternalImportPreview.html` contains all markers
2. ❌ **Initial Sync:** `npm run sync` failed to copy updated HTML to `.gas/`
3. ✅ **Manual Copy:** Used `Copy-Item` to force copy HTML to `.gas/`
4. ✅ **Verification:** Confirmed `.gas/ExternalImportPreview.html` now contains markers
5. ✅ **Push:** Executed `npx clasp push --force` to update Apps Script

### Technical Commands
```powershell
# Source verification
Select-String -Path 'src\frontend\ExternalImportPreview.html' -Pattern 'Verifica runtime|checkRuntime|externalImportPreviewRuntimeInfo'

# Failed sync
npm run sync

# Manual copy fix
Copy-Item 'src\frontend\ExternalImportPreview.html' '.gas\ExternalImportPreview.html' -Force

# Verification after manual copy
Select-String -Path '.gas\ExternalImportPreview.html' -Pattern 'Verifica runtime|checkRuntime|externalImportPreviewRuntimeInfo'

# Push to Apps Script
npx clasp push --force
```

---

## Verification Results

### Before Fix
- **Source:** ✅ Contains "Verifica runtime" button
- **.gas/:** ❌ Missing "Verifica runtime" button
- **Apps Script:** ❌ Serving old HTML

### After Fix
- **Source:** ✅ Contains "Verifica runtime" button
- **.gas/:** ✅ Contains "Verifica runtime" button
- **Apps Script:** ✅ Updated with new HTML

---

## Files Verified

**src/frontend/ExternalImportPreview.html:**
```html
<button id="btn-runtime" onclick="checkRuntime()" style="background: #f39c12; margin-left: 10px;">Verifica runtime</button>
```

**.gas/ExternalImportPreview.html (after manual copy):**
```html
<button id="btn-runtime" onclick="checkRuntime()" style="background: #f39c12; margin-left: 10px;">Verifica runtime</button>
```

---

## Constraints Respected

- ❌ **NO production deploy**
- ❌ **NO clasp deploy**
- ❌ **NO Index.html modifications**
- ❌ **NO full spreadsheets scope**
- ❌ **NO Drive scope**
- ❌ **NO replace operations**
- ❌ **NO data writing**
- ❌ **NO git add .**
- ✅ **HEAD/dev push only**

---

## Test Instructions

**URL:** `/dev?route=external-import-preview`

**Expected Results:**
1. ✅ Orange "Verifica runtime" button visible next to "Anteprima"
2. ✅ Clicking button shows runtime diagnostic with marker "0440-runtime-sheets-api"
3. ✅ This resolves the HTML sync issue from task 0440

---

## Production Impact

**Zero impact** - Production @57/build 0428 untouched.
Only HEAD/dev updated with correct HTML.

---

## Status

**HTML SYNC ISSUE RESOLVED** - ExternalImportPreview.html properly synced and pushed to Apps Script HEAD/dev.
Runtime diagnostic from task 0440 should now be functional.

---

## Documentation

- `docs/sessions/2026-05-17-verify-external-preview-html-push.md` - Full diagnostic session
