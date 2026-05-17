# Session — Rollback to build 0419

**Date:** 2026-05-17
**Task:** 0426
**Type:** rollback / deploy

---

## Context

Builds 0420–0425 introduced external Google Sheet import (0420) and a series
of boot fix attempts (0422–0425) that collectively left the app broken with
"Errore avvio app / Build 0425" on the live URL.

The last known-good version was V2.2.0 + 0406–0419 / deploy @45.

---

## Rollback method

**Preference B: source restore from git.**

- Target commit: `e476618` (docs: close task 0419 mesi final cleanup deploy @45)
- Files restored:
  - `src/frontend/Index.html` — APP_BUILD='0419'
  - `src/backend/Code.gs` — external sheet backend functions removed
  - `appsscript.json` — `spreadsheets.readonly` scope removed

---

## Checks executed

- `git diff --check` — clean, no trailing whitespace
- `node --check` on extracted inline script — OK
- `npm run sync` — synced 3 files to `.gas/`
- Removed stale `.gas/Code.js` (same conflict as task 0422)
- `npx clasp push --force` — pushed 3 files OK (09:54:17)
- `npx clasp deploy --deploymentId AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ` — deployed @53

---

## Outcome

| Field | Value |
|---|---|
| APP_BUILD | `0419` |
| Deploy number | **@53** |
| Deployment ID | AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ |
| URL changed | **No** (same deployment ID) |
| Import Google Sheet external live | **No** (feature removed from live) |
| Commit hash | `6c38dd4` |
| Stable tag | Not created |
| 0391/0392 | Pending (phone test + stable tag) |

---

## State after rollback

- Production: V2.2.0 + 0406–0419 / @53 / APP_BUILD='0419'
- External sheet import (0420): suspended, not live
- 0420–0425: remain in git history / docs as diagnostics, not in production
- Next gate: manual phone test on @53 → 0391 → 0392
