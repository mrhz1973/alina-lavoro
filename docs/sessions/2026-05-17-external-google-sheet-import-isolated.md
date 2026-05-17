# 2026-05-17 — External Google Sheet Import (Isolated) — Task 0430

**Build:** 0430
**Deploy:** @56 (URL unchanged)
**APP_VERSION:** 2.2.0 (unchanged)
**Tag:** none (per anti-disaster rule — only stable tag if user requests)
**Rollback reference:** `v2.2.0-build0428-stable` / @55 / build 0428

---

## Goal

Implement an isolated, on-demand import of data from an external Google Sheet
owned by the user's Google account, with the flow:

1. anteprima (read-only)
2. backup obbligatorio (TURNI + STIPENDI + NOTE)
3. sostituzione archivio corrente (only the detected type)
4. import nuovi dati

The feature must be reachable only via explicit user action in
Settings > Importa/Esporta. It must NEVER be triggered at boot.

## Files touched

- `src/backend/Code.gs`
- `src/frontend/Index.html`
- `appsscript.json`
- `.gas/Code.gs`, `.gas/Index.html`, `.gas/appsscript.json` (via `npm run sync`)
- `docs/LLMS.md`, `docs/wiki/current-state.md`
- `docs/sessions/2026-05-17-external-google-sheet-import-isolated.md` (this file)
- `docs/tasks/done/0430-external-google-sheet-import-isolated.md`

## Backend changes (`src/backend/Code.gs`)

### Replaced stub `previewImportFromSpreadsheet(accessCode, urlOrId, sheetName, dataType)`

Now performs a read-only preview against an external Google Sheet:

- accepts URL or bare ID (extracted via `extractSpreadsheetId_`);
- opens with `SpreadsheetApp.openById`;
- reads the named tab, or the first tab if none specified;
- detects data type from headers or accepts explicit `shifts|salaries|notes`;
- normalises rows via existing `buildImportPreview_`;
- returns rows preview + valid/invalid counts + `payload` for apply;
- annotates `externalSpreadsheetId`, `externalSheetName`, `externalSourceLabel`,
  and `canReplace` for UI use.

No writes. Errors return a readable message when access is denied or the file
is not reachable. Logs `previewImportFromSpreadsheet` on each call.

### Added `applyReplaceFromExternalSheet(accessCode, payload, options)`

The replace flow, separated from `applyImport` to keep the existing
merge-skip-duplicates flow untouched. Guards and steps:

1. Requires `options.confirm === 'REPLACE_ARCHIVE'`. Without this string the
   call returns `success:false` with a clear message.
2. Validates `payload.dataType` (`shifts|salaries|notes`) and `payload.rows`
   (non-empty array).
3. Acquires `LockService.getScriptLock().waitLock(20000)`.
4. Calls `backupSheet_(sheetName)` for all three data sheets
   (TURNI, STIPENDI, NOTE) BEFORE any destructive write. If any backup fails,
   the function returns `success:false` and aborts — no clear, no insert.
5. Clears only the data rows of the target type's sheet via
   `clearContent()` (header row preserved by starting from row 2).
6. Inserts new rows using `prepareRowForWrite_` + `appendRow`.
7. `SpreadsheetApp.flush()`, log, release lock.

Other sheets are not touched. The spreadsheet is never deleted. No sheet is
deleted by this function — the only deletions are old backups beyond the most
recent 5, handled by `pruneBackupsForSheet_` inside `backupSheet_`.

### Added helpers

- `extractSpreadsheetId_(urlOrId)` — extracts the spreadsheet ID from a URL or
  returns the value if it already looks like a bare ID.
- `headersForType_(dataType)` — returns the canonical header array for the
  target sheet.

## Frontend changes (`src/frontend/Index.html`)

- Bumped `APP_BUILD` to `'0430'`. `APP_VERSION` unchanged at `'2.2.0'`.
- Added `renderExternalSheetImportSection_()` rendered at the end of
  `renderImportExportSection_()` (which is itself only rendered by
  `renderSettings()`).
- UI fields: URL or ID, optional tab name, optional data type, "Anteprima
  Google Sheet" button.
- Preview shows source, detected type, totale/valide/invalide, sample rows,
  invalid rows.
- After preview: mandatory checkbox "Ho capito che l'archivio corrente verrà
  sostituito" + "Sostituisci archivio corrente" button (disabled until
  checkbox is ticked).
- On Sostituisci: calls `applyReplaceFromExternalSheet` with the validated
  payload and `{confirm: 'REPLACE_ARCHIVE'}`, then refreshes local state via
  `getBootstrap`.
- Handler functions: `doPreviewExternalSheet_`, `renderExternalSheetPreview_`,
  `onExternalConfirmChange_`, `cancelExternalSheetPreview_`,
  `doApplyReplaceFromExternalSheet_`, `renderExternalReplaceResult_`,
  `resetExternalSheetForm_`.

### Boot safety

The new functions are not reachable from any boot-path code:

- `DOMContentLoaded` → `loadCache` → `applyThemeLang` → `showApp` → `render`
  → `initBackground_` → `getBootstrap`. None of these call
  `previewImportFromSpreadsheet` or `applyReplaceFromExternalSheet`.
- `renderSettings()` only renders HTML (with `onclick` handlers). The user
  must explicitly tap "Anteprima Google Sheet" or "Sostituisci archivio
  corrente" to trigger any backend call.
- `onImportSourceChange_()` only toggles existing import UI, no backend call.

## OAuth scope change (`appsscript.json`)

Added the minimum scope required to read external Google Sheets:

```diff
   "oauthScopes": [
     "https://www.googleapis.com/auth/spreadsheets.currentonly",
+    "https://www.googleapis.com/auth/spreadsheets.readonly",
     "https://www.googleapis.com/auth/script.container.ui"
   ],
```

Rationale: `spreadsheets.currentonly` only grants access to the bound
spreadsheet. To read a different (external) spreadsheet, `spreadsheets.readonly`
is required. Drive scope was **not** added — we never list, search, copy or
delete Drive files; we only open a sheet the user explicitly provides by
URL/ID.

## Backup behavior

`backupSheet_(name)` duplicates the target sheet as
`<NAME>_BACKUP_yyyyMMdd_HHmmss` then keeps only the 5 most recent backups for
that name. Behavior is unchanged. The replace flow backs up all three data
sheets (TURNI, STIPENDI, NOTE) before clearing the target type's data rows.
Backups created during this run are never deleted by this run; the rolling
window of 5 is enforced by `pruneBackupsForSheet_`.

## Replace behavior

- Replace targets a single data type (the one detected from the external sheet).
- Other types are not touched.
- Data rows of the target type are cleared from row 2 onward — header row
  preserved.
- New rows are appended via `prepareRowForWrite_` to keep timestamps and IDs
  consistent with the rest of the app.

## Validations executed

- `git diff --check` — clean.
- Inline JS extracted from `Index.html`, `node --check` — OK (no syntax error).
- No new modern operators introduced (grep returned no match).
- `APP_BUILD='0430'` confirmed in `src/frontend/Index.html` and `.gas/Index.html`.
- No `.gas/Code.js` left over before push.
- External sheet handlers are not in the boot path (verified by grep).

## Deploy

```
npm run sync
clasp push --force        # OK: Pushed 3 files at 18:12:49
clasp deploy --deploymentId AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ
# Deployed AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ @56
```

URL unchanged.

## Remote verification

Pulled the remote into a temporary directory and confirmed:

- `Index.html` contains `APP_BUILD='0430'`
- `appsscript.json` contains `spreadsheets.readonly`
- `Code.js` contains `applyReplaceFromExternalSheet`

Phone test pending user. Rollback reference: `v2.2.0-build0428-stable` /
@55 / build 0428. No new stable tag created.

## No tag, no rollback

- No tag created (per anti-disaster rule).
- No rollback executed.
- Anti-disaster rule: max 1 fast fix if app boot breaks; otherwise revert to
  build 0428 by clasp deploying the snapshot at `v2.2.0-build0428-stable`.
