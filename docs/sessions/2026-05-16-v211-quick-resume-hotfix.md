# Session — V2.1.1 Quick Resume Persistence Hotfix

- **Date:** 2026-05-16
- **Task:** 0364 — V2.1.1 quick resume persistence fix

## Context

V2.1.0 post-deploy test (task 0362) failed: user reported app always asking for access code
after login and reopen ("mi chiede sempre il codice anche dopo login e riapertura").

V2.1.0 analytics/charts itself is correct. The quick resume regression was pre-existing in
the V2.0.1 quick-resume logic.

## Root cause

`tryQuickResumeFromCache_` in `src/frontend/Index.html`:

```javascript
// Before (broken):
function tryQuickResumeFromCache_(savedCode,c){
  if(!savedCode||!c||c.accessCode!==savedCode)return false;
  showApp();return true
}
```

The strict `c.accessCode !== savedCode` check rejected valid caches where the stored
`accessCode` field was empty or mismatched (e.g. cache saved before `state.accessCode` was set,
or during a version transition). This caused the `else{login()}` path to execute on every startup,
which calls the GAS server → the user sees the login screen while waiting for the response.

## Fix

```javascript
// After (fixed):
function tryQuickResumeFromCache_(savedCode,c){
  if(!savedCode||!c)return false;
  state.accessCode=savedCode;
  saveCache();
  showApp();return true
}
```

- Removed strict `c.accessCode` equality check.
- Added `state.accessCode = savedCode` to ensure state is correct before `showApp()`.
- Added `saveCache()` to immediately persist the corrected accessCode.
- `loginBackground_(savedCode)` is still called by the caller to validate with server in background.
- If the server rejects the code (wrong code), the app still shows cached data (same behavior as before).
- Login screen still shown for first-ever access (no LS_ACCESS) or no cache at all.

## Files changed

- `src/frontend/Index.html`: `tryQuickResumeFromCache_` fix + APP_VERSION 2.1.0 → 2.1.1 + comment
- `package.json`: version 2.1.0 → 2.1.1

## Checks

- `git diff --check`: no whitespace errors
- `APP_VERSION='2.1.1'`: verified
- `package.json version "2.1.1"`: verified
- No `??`, `||=`, optional chaining found
- navbar data-page: 4 tabs unchanged (home, months, notes, settings)
- inline JS syntax check (Node vm): OK (51889 chars)
- No backend changes
- No appsscript.json changes

## Version

- APP_VERSION: 2.1.1
- package.json: 2.1.1
