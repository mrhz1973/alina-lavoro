# Session — Rollback from broken 0430 (task 0431)

**Date:** 2026-05-17
**Task:** 0431 — Emergency rollback: restore build 0428 after external import boot failure
**Implementer:** Claude Code (Sonnet)

---

## Reason for rollback

Build 0430 (external Google Sheet import) caused app boot failure: app stuck on "Apertura app…" indefinitely. No hotfix attempted. Immediate rollback to baseline.

## Rollback executed

- Restored from tag: `v2.2.0-build0428-stable`
- Files restored: `src/frontend/Index.html`, `src/backend/Code.gs`, `appsscript.json`
- Command: `git checkout v2.2.0-build0428-stable -- src/frontend/Index.html src/backend/Code.gs appsscript.json`

## Verification

| Check | Result |
|---|---|
| APP_BUILD in Index.html | `'0428'` |
| previewImportFromSpreadsheet | stub only (returns deferred error, no external sheet access) |
| applyReplaceFromExternalSheet | NOT present |
| spreadsheets.readonly scope | NOT present (only spreadsheets.currentonly + script.container.ui) |
| git diff --check | OK |
| node --check (inline script) | OK |
| npm run sync | OK |
| .gas/Code.js | not present |
| .gas/Index.html APP_BUILD | `'0428'` |
| clasp push --force | Pushed 3 files at 21:58:42 |
| clasp deploy | @57 |
| clasp pull verification | APP_BUILD='0428' confirmed |

## Deploy

- Deployment ID: `AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ`
- Deploy number: **@57**
- URL: unchanged
- APP_BUILD: **0428**

## Post-rollback state

- Production: V2.2.0 + 0406–0428, build 0428, @57
- Import Google Sheet external: NOT live
- spreadsheets.readonly scope: NOT present
- Phone test: pending

## Future: external sheet import strategy

Build 0430 went directly to production with a real implementation of external Sheet import. This approach was risky because:
- OAuth scope change (`spreadsheets.readonly`) may interact with boot/auth flow
- No canary/test deploy was done before production

Future approach (when re-attempted):
1. docs-only design review first
2. preview-only on a canary/test deployment (never direct to production)
3. separate task with explicit phone test gate before any production deploy
