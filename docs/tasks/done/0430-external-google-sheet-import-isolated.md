# Task 0430 — External Google Sheet Import (Isolated)

- Project: Alina Lavoro
- Type: feature + deploy
- Status: done
- Priority: high
- Deploy: yes (@56, URL unchanged)
- Completed: 2026-05-17

## Goal

Implement isolated external Google Sheet import (preview → mandatory backup →
replace current archive → import new data), reachable only from
Settings > Importa/Esporta. Must NEVER be triggered at boot.

## Outcome

Build 0430 deployed to Apps Script `@56` (URL unchanged). Phone test pending.

- Frontend: new card "Importa da Google Sheet esterno" with URL/ID input,
  optional tab, optional data type, Anteprima button, summary, mandatory
  checkbox, Sostituisci button (disabled until checkbox is ticked).
- Backend:
  - `previewImportFromSpreadsheet(accessCode, urlOrId, sheetName, dataType)` —
    read-only via `SpreadsheetApp.openById`, returns rows preview + payload.
  - `applyReplaceFromExternalSheet(accessCode, payload, options)` —
    requires `options.confirm === 'REPLACE_ARCHIVE'`, `LockService.waitLock(20s)`,
    `backupSheet_` of TURNI + STIPENDI + NOTE, clears target type's data rows,
    inserts new rows; backup failure aborts the operation before any write.
- OAuth: added `spreadsheets.readonly` (minimum scope; Drive scope NOT added).
- APP_BUILD: `0430`. APP_VERSION: `2.2.0` (unchanged).

## Files touched

- `src/backend/Code.gs`
- `src/frontend/Index.html`
- `appsscript.json`
- `.gas/Code.gs`, `.gas/Index.html`, `.gas/appsscript.json` (via `npm run sync`)
- `docs/LLMS.md`
- `docs/wiki/current-state.md`
- `docs/sessions/2026-05-17-external-google-sheet-import-isolated.md`
- `docs/tasks/done/0430-external-google-sheet-import-isolated.md`

## Validations

- `git diff --check` — clean
- `node --check` on inline frontend script — OK
- No new modern operators
- `APP_BUILD='0430'` verified locally and remotely
- External sheet handlers not in any boot path (verified by grep)
- `.gas/Code.js` removed before push
- Remote pulled into a tmp dir and verified: `APP_BUILD='0430'`,
  `spreadsheets.readonly` scope, `applyReplaceFromExternalSheet` present.

## Deploy

- `npm run sync`
- `npx clasp push --force` — Pushed 3 files
- `npx clasp deploy --deploymentId AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ` — @56
- URL unchanged
- No new stable tag

## Rollback reference

- `v2.2.0-build0428-stable` (on @55 / build 0428, 2026-05-17) — anti-disaster
  fallback if boot breaks. Per the prompt anti-disaster rule, maximum one
  fast fix; otherwise revert to this snapshot.

## Notes

- Phone test pending user.
- Import Google Sheet esterno is now live in source and deployed; first user
  consent prompt for `spreadsheets.readonly` will fire on the first call.
