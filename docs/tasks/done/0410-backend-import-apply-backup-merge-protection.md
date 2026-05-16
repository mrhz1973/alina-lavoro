# Task 0410 — Backend import apply with backup and merge protection

- Project: Alina Lavoro
- Type: backend
- Priority: high
- Deploy: no
- Status: done

## Done status

- Completed by: Claude Code (batch 0407–0412)
- Completion date: 2026-05-16
- Files changed: `src/backend/Code.gs` (append)
- Functions added: `applyImport`, `prepareRowForWrite_`, `writeRowForType_`, `sheetNameForType_`.
- Safety contract:
  - `replace_all` mode is **NOT implemented** — returns error.
  - Default mode: `merge_skip_duplicates`.
  - Optional: `merge_update_duplicates` (uses existing row id).
  - Every affected tab gets a `backupSheet_(name)` call **before** any write.
  - Backup pruning keeps the latest 5 per source tab (existing utility behavior).
  - `LockService.getScriptLock(15s)` wraps the apply; lock released in `finally`.
- Duplicate detection (per row): same `id` → match by id; else same `duplicateSignature_` (date+inizio+fine for shifts; `mese_lavorato` for salaries; date+tipo+testo for notes).
- Server-side re-validation of every row at apply time (no trust on client-side preview).
- Intra-batch duplicate detection: lookup tables are updated after each insert.
- Result includes per-type details + global counts + errors + list of backups created.
- Final `SpreadsheetApp.flush()` to ensure visibility to next `getBootstrap`.
- Session: `docs/sessions/2026-05-16-data-import-export-batch.md`.
