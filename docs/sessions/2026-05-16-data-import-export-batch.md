# Session — Data Import/Export Tools (batch 0407–0412)

**Date:** 2026-05-16
**Tasks:** 0407, 0408, 0409, 0410, 0411, 0412
**Branch:** main
**Status:** complete — source patched, **NOT deployed**
**Production at end of batch:** @35 (unchanged — V2.2.0 + 0406 fix)

---

## 0407 — Data model and import/export safety audit

### Backend spreadsheet schema (from `src/backend/Code.gs`)

| Tab | Columns |
|---|---|
| **TURNI** | id, data (YYYY-MM-DD), inizio (HH:mm), fine (HH:mm), pausa_minuti, minuti_lavorati, nota, manuale, creato_il, aggiornato_il, sync_version |
| **STIPENDI** | id, mese_lavorato (YYYY-MM), mese_busta (YYYY-MM), data_inserimento, importo_reale, ore_mese, tariffa_effettiva, note, creato_il, aggiornato_il |
| **NOTE** | id, data, tipo, testo, completata, creato_il, aggiornato_il |
| **CONFIG** | parametro, valore (key-value) |
| **SYNC_LOG** | timestamp, azione, stato, messaggio (log only — not exported) |

### Existing utilities (re-used in this batch)
- `backupSheet_(name)` — sheet copy with `_BACKUP_yyyyMMdd_HHmmss` suffix; auto-prunes to 5 backups per source sheet.
- `formatTimeForImport_`, `minutesFromImport_`, `dateObjectForImport_` — date/time parsers shared with the legacy `importaStoricoSoloFinoAOggi`.
- `upsertRecord_`, `getRecords_`, `ensureSheet_` — record I/O.
- `LockService.getScriptLock()` — concurrency guard.
- `safeConfig_` — strips `codice_accesso` from config exports.

### OAuth scope constraint (critical)
`appsscript.json` declares `https://www.googleapis.com/auth/spreadsheets.currentonly`.

**Consequence:** `SpreadsheetApp.openByUrl()` / `openById()` for **external** spreadsheets is NOT allowed at runtime. Importing from an arbitrary external Google Sheet would require a manifest scope upgrade to `spreadsheets` (full access), triggering a re-authorization prompt and broadening permissions.

**Decision:** keep `spreadsheets.currentonly`. External-spreadsheet import is implemented as a placeholder (`previewImportFromSpreadsheet`) that returns a clear deferred-error message pointing the user to the three supported modes.

### Frontend state shape
`state = {accessCode, page, detailMonth, config, shifts[], salaries[], notes[], summaries[], reminder, serverOk, _localMutationAt, __timePick?, __importPreview?}`.

`mergeServerData(data)` is the canonical state-from-server merge entry point. Task 0406 introduced `_localMutationAt` as a stale-merge guard; the import flow does not need it (apply happens server-side; client re-fetches via `getBootstrap` after success when no pending queue exists).

### Data portability model

**Export format — JSON full backup:**
```json
{
  "alinaBackup": true,
  "format": "alina-lavoro/v1",
  "exportedAt": "2026-05-16T...",
  "timezone": "Europe/Rome",
  "spreadsheetMeta": { "name": "...", "sheetCount": 5 },
  "counts": { "shifts": N, "salaries": N, "notes": N },
  "config": { ...safeConfig... },
  "shifts": [...],
  "salaries": [...],
  "notes": [...]
}
```

**Export format — CSV (per data type):**
- Stable headers = exact sheet column names.
- UTF-8; CRLF line endings.
- RFC4180 quoting: double-quote-wrap fields containing `,` `"` `\n` `\r`; escape internal quotes as `""`.

**Import safety rules:**
- Preview is read-only — no spreadsheet writes, no backups.
- Apply always calls `backupSheet_()` for each affected tab before any write.
- Default mode is `merge_skip_duplicates`. Optional `merge_update_duplicates`.
- `replace_all` is NOT implemented (returns error).
- Duplicate detection: same `id` → match by id; else same signature (date+inizio+fine for shifts; mese_lavorato for salaries; date+tipo+testo for notes).

---

## 0408 — Backend export/backup API

Added to `src/backend/Code.gs`:

| Function | Purpose |
|---|---|
| `exportAllData(accessCode)` | Returns full JSON backup as a structured object |
| `getExportBundle(accessCode)` | Returns JSON + all three CSVs in one call |
| `exportShiftsCsv(accessCode)` | Returns TURNI as CSV string |
| `exportSalariesCsv(accessCode)` | Returns STIPENDI as CSV string |
| `exportNotesCsv(accessCode)` | Returns NOTE as CSV string |
| `buildExportBundle_()` | Internal — assembles the JSON backup payload |
| `csvForRecords_(headers, records)` | Internal — array-of-rows → CSV string |
| `csvLine_`, `csvCell_` | RFC4180 quoting |

Notes:
- `safeConfig_` strips `codice_accesso` from exports (security).
- No secrets, no spreadsheet URL or token included.
- Reuses existing `backupSheet_` for apply-time backups (not export).

---

## 0409 — Backend import preview + validation

Added to `src/backend/Code.gs`:

| Function | Purpose |
|---|---|
| `listImportableSheets(accessCode)` | Lists tabs in the current spreadsheet (excludes system + backup sheets) |
| `previewImportFromCsv(accessCode, csv, dataType?)` | Parse CSV/TSV, validate, return preview |
| `previewImportFromJson(accessCode, jsonText)` | Parse JSON backup, validate all three sections |
| `previewImportFromSheetTab(accessCode, sheetName, dataType?)` | Read a tab in the CURRENT spreadsheet, validate |
| `previewImportFromSpreadsheet(accessCode, urlOrId, sheetName, dataType)` | **Deferred** — returns clear error citing OAuth scope limitation |
| `buildImportPreview_(parsed, dataType, source)` | Core preview builder (no writes) |
| `detectDataType_(headers)` | Auto-detect shifts/salaries/notes from header presence |
| `normalizeImportRow_` + `normalizeShiftRow_` / `normalizeSalaryRow_` / `normalizeNoteRow_` | Normalize types after header mapping |
| `mapImportHeaders_(row, dataType)` + `importHeaderAliases_()` | Header aliases (it/en, common variants) |
| `parseImportDate_(value)` | YYYY-MM-DD, YYYY/MM/DD, DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY, Date objects |
| `parseImportMonth_(value)` | YYYY-MM, YYYY-MM-DD prefix, MM/YYYY |
| `parseImportTime_(value)` | Delegates to existing `formatTimeForImport_` (handles HH:mm, decimal hours, Date) |
| `parseBool_(value, default)` | true/false/yes/no/sì/нет/1/0 |
| `validateRow_(row, dataType)` | Per-type required-field check |
| `rowSummary_(row, dataType)` | Compact one-line preview string |
| `duplicateSignature_(row, dataType)` | Stable signature for duplicate detection |
| `loadExistingForType_(dataType)` | Reads existing TURNI/STIPENDI/NOTE |
| `parseCsv_(text)` | Robust RFC4180 CSV parser; BOM-aware; auto-detects TSV when first line has tabs but no commas |
| `parseTsv_(text)` | Tab-separated fallback (Google Sheets paste sometimes produces TSV) |

Preview return shape (single type):
```
{ success, source, dataType, headersDetected, totalRows,
  validCount, invalidCount, duplicateCount, freshCount,
  sample[], duplicateSamples[], invalidSamples[],
  payload: { dataType, rows: [valid normalized rows] } }
```

Preview return shape (JSON multi-section):
```
{ success, source, format, exportedAt, counts,
  sections: { shifts: {...}, salaries: {...}, notes: {...} } }
```

---

## 0410 — Backend import apply with backup + merge protection

Added to `src/backend/Code.gs`:

| Function | Purpose |
|---|---|
| `applyImport(accessCode, payload, options)` | Validated apply with per-tab backup, lock-protected |
| `prepareRowForWrite_(row, dataType, overrideId?)` | Final row preparation (id, timestamps) |
| `writeRowForType_(dataType, row)` | Dispatches to `upsertRecord_` with proper sheet/headers |
| `sheetNameForType_(dataType)` | Type → sheet name mapping |

Apply contract:
1. Validate mode (only `merge_skip_duplicates` and `merge_update_duplicates` are accepted; `replace_all` returns error).
2. Normalize payload to `sections` form.
3. Acquire `LockService` (15s timeout).
4. For each non-empty section:
   - `backupSheet_(sheetName)` — fails the section if backup throws.
   - Build `existingIds` / `existingBySig` lookups from current sheet contents.
   - For each row: re-validate; detect duplicate; insert / update / skip per mode.
   - Update lookups after each insert to catch intra-batch duplicates.
5. `SpreadsheetApp.flush()` at the end.
6. Returns summary with counts + per-type details + errors + list of backups created.

Lock release happens in `finally` to guarantee unlock even on exception.

Result shape:
```
{ success, mode, backups: [sheetNames],
  inserted, updated, skipped, failed,
  details: { shifts: {inserted, updated, skipped, failed, errors[]}, ... },
  errors: [...] }
```

---

## 0411 — Frontend Import/Export UI

Added to `src/frontend/Index.html`:

**Render layer**
- `renderImportExportSection_()` — appended after the existing Settings card.
- New section title: **"Importa / Esporta dati"** with 📦 kicker.
- Section is appended via template-literal interpolation in `renderSettings()`; new call to `onImportSourceChange_()` initializes visibility of the source-specific fields.

**Export UI**
- Four buttons: Backup JSON, Turni CSV, Stipendi CSV, Note CSV.
- Each opens a modal with the exported text in a read-only `<textarea>` + "Copia" button.
- Copy uses `document.execCommand('copy')` with manual-selection fallback for sandboxed iframes.

**Import UI**
- Data-type selector (Auto / Turni / Stipendi / Note).
- Source selector: CSV/TSV paste · JSON paste · Foglio del Google Sheet corrente.
- Conditional fields: paste textarea OR sheet tab name input.
- "Anteprima" button → calls preview backend → renders summary.
- "Pulisci" button → resets the form.

**Preview display**
- Totals, fresh count, duplicate count, invalid count.
- Up to 5 sample new rows, 10 duplicate samples, 10 invalid samples (with errors).
- Multi-section breakdown for JSON backups (shifts/salaries/notes separately).
- **🛡️ Safety notice** before the apply button.
- "Importa ora" button (disabled visually with a `pill` when zero fresh rows) + "Annulla".

**Apply flow**
- Calls `applyImport(accessCode, payload, {mode: 'merge_skip_duplicates'})`.
- On success: re-fetches `getBootstrap` and merges (no `_localMutationAt` race since import happens server-side without going through the local queue).
- Result panel: insert/update/skip/fail counts + backup sheet names + first 10 errors.

**Compatibility / no external dependencies**
- All inline; no new libraries.
- Old-Android-compatible: no `??`, no `||=`, no `?.[]` patterns.
- Mobile-friendly: monospace textarea with `font-size: 12px`, btn-row flex-wraps.

---

## 0412 — Documentation, state update, validation close

### Files changed
- `src/backend/Code.gs` — appended ~500 lines (export/import API + parser + apply)
- `src/frontend/Index.html` — `renderSettings` now appends import/export card + 14 new JS functions
- `docs/LLMS.md` — Last completed → 0412
- `docs/wiki/current-state.md` — Last completed → 0412
- `docs/PROJECT_STATE.md` — Last completed line + batch annotation
- `docs/CHECKPOINT.md` — Latest completed list updated
- `docs/sessions/2026-05-16-data-import-export-batch.md` (this file)
- `docs/tasks/done/0407..0412-*.md` — done markers

### Files NOT touched (verified)
- `appsscript.json` — NOT modified. OAuth scope `spreadsheets.currentonly` preserved.
- `gas-current/**` — NOT modified.
- `.gas/**` — NOT modified.
- `package.json` / `package-lock.json` — NOT modified.

### Validation results
- `git diff --check` — clean
- `node --check` on extracted inline JS (frontend) — OK (63 187 chars)
- `node --check` on backend (copied to .js for syntax inspection) — OK
- Forbidden modern operators grep — none found
- Navbar tabs — 4 expected (home/months/notes/settings)
- `APP_VERSION='2.2.0'` — unchanged

### Deployment
- **Deploy not executed.** Production remains @35.
- **Tag not created.** v2.2.0-stable remains pending.
- **Rollback not executed.**
- **0391 / 0392 left pending** (user explicit instruction).

---

## How to use (user-facing)

### Export full backup (JSON)
1. Open the app → Impostazioni → Importa / Esporta dati.
2. Click **Backup JSON**.
3. Click **Copia** in the modal (or select-all and copy).
4. Paste into a new file (`alina-backup.json`) for permanent storage, or into a private Google Drive note.

### Export to Google Sheets (CSV)
1. Click **Turni CSV** (or Stipendi/Note).
2. Click **Copia**.
3. Open Google Sheets → create a new spreadsheet → click cell A1 → paste.
4. Google Sheets will auto-detect comma separation.

### Import from Google Sheets (sheet tab)
1. Open the Alina Lavoro Google Sheet (the same one that backs the app).
2. Create a new sheet/tab (e.g., **Importa**), with column headers on row 1 (e.g., `data, inizio, fine`).
3. Paste your data into rows below.
4. Back in the app → Impostazioni → Importa → Sorgente: **Foglio del Google Sheet corrente** → enter the tab name.
5. Click **Anteprima** to validate (no writes yet).
6. Click **Importa ora** to apply (creates automatic backup).

### Import via CSV paste
1. In Google Sheets: select your range → Edit → Copy.
2. In the app → Importa → Sorgente: **Incolla CSV / TSV** → paste into the textarea.
3. **Anteprima** → review → **Importa ora**.

### Import via JSON backup
1. Paste a previously-exported JSON backup.
2. Anteprima will show counts for shifts/salaries/notes.
3. Apply imports all three sections in one operation; each tab gets its own backup.

### Import safety guarantees
1. **Preview never writes.** It reads existing data only to flag duplicates.
2. **Apply creates a backup first** — a copy of each affected tab is preserved with a `_BACKUP_yyyymmdd_hhmmss` suffix (max 5 backups per tab, oldest pruned automatically).
3. **Default mode = merge, skip duplicates.** Existing rows are never overwritten by default.
4. **Duplicates** are detected by `id` first, then by content signature (date+inizio+fine for shifts; mese_lavorato for salaries; date+tipo+testo for notes).
5. **Invalid rows** are excluded and reported (with explanations).
6. **No `replace_all` mode** is available — even malicious or malformed payloads cannot wipe existing data through this UI.

### Deferred / limitation
**Import from an external Google Sheet URL/ID is NOT available** in this version.
- Reason: the app's OAuth scope is `spreadsheets.currentonly`, which prevents opening external spreadsheets.
- Workarounds offered: (a) copy data into a tab of the **current** spreadsheet and use sheet-tab import; (b) copy as CSV from Google Sheets and paste into the app; (c) JSON backup paste.
- A future scope upgrade to `https://www.googleapis.com/auth/spreadsheets` would enable external-sheet import but would require user re-authorization and broaden the app's permissions.

---

## Next step

A future explicit deploy gate is required before these import/export tools reach production (@35 currently has V2.2.0 + 0406 fix, but not 0407–0412). 0391 (post-deploy test) and 0392 (stable tag) remain pending and unrelated to this batch.
