# Task 0364 — V2.1.1 Quick Resume Persistence Fix

## Done status

- **Completed:** 2026-05-16
- **Outcome:** Source fix implemented; checks pass; version bumped to 2.1.1.
- **Fix:** `tryQuickResumeFromCache_` now accepts `savedCode present + cache exists` (removed strict
  `c.accessCode !== savedCode` check); sets `state.accessCode = savedCode` + calls `saveCache()` before
  `showApp()`; `loginBackground_` still validates with server in background.
- **APP_VERSION:** 2.1.1
- **package.json:** 2.1.1
- **Session:** docs/sessions/2026-05-16-v211-quick-resume-hotfix.md
- **Next step:** task 0365 — deploy V2.1.1.
