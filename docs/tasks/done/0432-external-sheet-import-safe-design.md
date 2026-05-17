# Task 0432 — External Google Sheet import: design-only safe strategy

- Project: Alina Lavoro
- Type: docs-only
- Priority: normal
- Deploy: no
- Status: done

## Objective

Define a safe, progressive strategy for re-implementing external Google Sheet import after the 0430 boot failure. No code. No deploy.

## Done status

- Completed by: Claude Code (Sonnet)
- Completion date: 2026-05-17
- Session: `docs/sessions/2026-05-17-external-sheet-import-safe-design.md`

## Actions taken

1. Created `docs/sessions/2026-05-17-external-sheet-import-safe-design.md` with:
   - Rule 1: no direct production deploy
   - Rule 2: no import call in the boot path
   - Rule 3: 5-step progressive implementation (A→E)
   - Rule 4: preview-only mode spec
   - Rule 5: replace mode spec (canary only, backup mandatory)
   - Rule 6: token budget and hotfix limit (max 1 hotfix then rollback)
   - Rule 7: OAuth scope discipline (minimum scope, no Drive unless justified)
   - Rollback reference section
2. Updated `docs/sessions/2026-05-17-rollback-from-broken-0430.md`: phone test @57/0428 PASS
3. Updated `docs/tasks/done/0431-rollback-from-broken-0430.md`: phone test PASS recorded

## Final state

| Item | Value |
|---|---|
| Code modified | no |
| Deploy | no |
| Tag | no |
| src/frontend/Index.html | unchanged |
| src/backend/Code.gs | unchanged |
| appsscript.json | unchanged |
| Design doc created | yes |
| 0431 PASS recorded | yes |
