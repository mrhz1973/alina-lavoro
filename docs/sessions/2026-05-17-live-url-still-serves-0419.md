# Session — 2026-05-17 — Task 0422 — Live URL Still Serves 0419 (Root Cause Fix)

**Date:** 2026-05-17
**Task:** 0422 — forensic audit + corrected deploy
**Branch:** main
**Outcome:** FIXED — APP_BUILD='0420' now live on @49 (same deployment ID/URL)

---

## Root Cause

`clasp push` in task 0420 and task 0421 did **not** actually send content to Apps Script remote.

Evidence:
- `src/frontend/Index.html` and `.gas/Index.html` (local) both had `APP_BUILD='0420'`
- `clasp pull` in this session returned `.gas/Index.html` with `APP_BUILD='0419'`
- Remote HEAD had `APP_BUILD='0419'` — task 0421 redeploy pointed to a version built from stale 0419 content

Additional finding: `clasp pull` downloaded a `Code.js` (old 2185-line version) alongside the expected files. This `Code.js` residue was removed before push.

---

## Fix Applied

1. `clasp pull` — confirmed remote has 0419 (root cause verified)
2. `rm .gas/Code.js` — removed stale pull artifact (old Apps Script version)
3. `npm run sync` — restored `.gas/` from `src/` (0420 content)
4. `clasp push --force` — uploaded 0420 to remote (`Pushed 3 files`)
5. `clasp deploy --deploymentId AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ -d "V2.2.0 build 0420 corrected push"` → @49
6. Second `clasp pull` — verified remote now has `APP_BUILD='0420'` ✓

---

## Deploy Info

| Field | Value |
|---|---|
| Deployment ID | `AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ` |
| Apps Script version | **@49** |
| URL | unchanged (same deployment ID) |
| APP_BUILD remote verified | **0420** ✓ |
| Live HTML verified from terminal | **not possible** (Google auth required) |
| Live verification status | **pending user phone test** |

---

## Why Previous Deploys Failed

`clasp push` (without `--force`) was skipping when clasp's internal state tracking thought no diff existed — but the actual remote had not been updated. The `clasp deploy --deploymentId` in task 0421 created a new Apps Script version (@48) but from the stale 0419 content already on the remote. The version description said "0420" but the content was 0419.

---

## Checks

- `src/frontend/Index.html` APP_BUILD: `0420` ✓
- `.gas/Index.html` after sync: `0420` ✓
- Remote Apps Script after corrected push + pull: `0420` ✓
- `.gas/` clean (no Code.js residue): ✓
- No tag created ✓
- No rollback ✓
- 0391/0392 still pending ✓

---

## Next

0391 — manual phone test on @49 URL
0392 — stable tag `v2.2.0-stable` after test pass
