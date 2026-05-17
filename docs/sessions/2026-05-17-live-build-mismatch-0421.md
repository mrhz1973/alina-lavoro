# Session — Live build mismatch fix (task 0421)

**Date:** 2026-05-17
**Task:** 0421
**Branch:** main
**Deploy:** @48 (in-place redeploy, ID AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ, URL unchanged)

## Problem

After task 0420 deploy (@47), the live Web App endpoint showed Build 419 instead of Build 0420.

## Investigation

- `src/frontend/Index.html`: `APP_BUILD='0420'` ✓
- `.gas/Index.html`: `APP_BUILD='0420'` ✓ (sync already applied)
- `npx clasp push`: "Skipping push" — code already in Apps Script HEAD
- `npx clasp deployments`: @47 deployment existed with correct ID

Conclusion: the code was pushed to Apps Script HEAD during task 0420, but the deployment (the versioned snapshot served by the Web App URL) was not updated to reflect it, or the @47 version pointed to older code.

## Root cause

During task 0420, `clasp deploy --deploymentId` ran but created version @47 from the HEAD state at that time. Possible causes: push had already happened but deploy referenced a prior version, or the live endpoint cached @46 (Build 0419) from an earlier version. Regardless, the deployment pointer was stale.

## Fix

Re-ran in-place deploy:

```
npx clasp deploy --deploymentId AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ --description "V2.2.0 build 0420 fix redeploy"
```

Result: `Deployed AKfycbxtG6_... @48`

- New script version: @48
- Deployment URL: unchanged (same ID)
- APP_BUILD='0420' is now the live version

## Verification

`npx clasp deployments | grep AKfycbxtG6_`:
```
- AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ @48 - V2.2.0 build 0420 fix redeploy
```

Live HTML verification via terminal: not possible (requires authenticated browser session).
Manual phone test required to confirm Build 0420 is now visible → task 0391.

## No source changes

No `src/`, no `gas-current/`, no `git add .`, no rollback, no tag.

## Pending

- 0391: post-deploy phone test (now for @48)
- 0392: stable tag after test pass
