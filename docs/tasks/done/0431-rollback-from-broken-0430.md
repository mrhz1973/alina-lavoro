# Task 0431 — Emergency rollback: restore build 0428 after external import boot failure

- Project: Alina Lavoro
- Type: rollback
- Priority: emergency
- Deploy: yes (authorized in task prompt)
- Status: done

## Objective

Build 0430 (external Google Sheet import) broke production — app stuck on "Apertura app…". No hotfix. Immediate rollback to v2.2.0-build0428-stable (build 0428).

## Done status

- Completed by: Claude Code (Sonnet)
- Completion date: 2026-05-17
- Completion commit: (see below — post-commit hash)
- Session: `docs/sessions/2026-05-17-rollback-from-broken-0430.md`

## Actions taken

1. Restored `src/frontend/Index.html`, `src/backend/Code.gs`, `appsscript.json` from tag `v2.2.0-build0428-stable`
2. Verified APP_BUILD='0428', no 0430 functions, no spreadsheets.readonly scope
3. Ran git diff --check + node --check — OK
4. npm run sync → clasp push --force → clasp deploy @57
5. Remote verified via clasp pull: APP_BUILD='0428'
6. Updated docs/LLMS.md, docs/wiki/current-state.md

## Final state

| Item | Value |
|---|---|
| APP_BUILD | 0428 |
| Deploy | @57 |
| URL changed | no |
| Import Google Sheet external live | no |
| appsscript.json restored | yes (spreadsheets.currentonly only) |
| spreadsheets.readonly present | no |
| Tag created | no |
| Hotfix attempted | no |
| Rollback source | v2.2.0-build0428-stable |
