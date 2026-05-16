# Task 0362 — V2.1 Post-Deploy Test

## Done status

- **Completed:** 2026-05-16
- **Outcome:** FAILED — test did not pass.
- **User report:** "mi chiede sempre il codice anche dopo login e riapertura"
  (app asks for access code every time, even after successful login and reopen)
- **Root cause:** `tryQuickResumeFromCache_` had a strict `c.accessCode !== savedCode` check
  that rejected valid caches where `accessCode` was absent or mismatched in the stored cache object.
  The app fell back to calling `login()` → GAS server call → user sees login screen on every open.
- **v2.1.0-stable NOT created.** Stable tag blocked pending fix.
- **Fix task:** 0364 — V2.1.1 quick resume persistence fix.
- **Next test gate:** task 0366 (V2.1.1 post-deploy test).
