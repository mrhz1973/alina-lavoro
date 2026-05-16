# Task 0408 — Backend export/backup API

- Project: Alina Lavoro
- Type: backend
- Priority: high
- Deploy: no
- Status: done

## Done status

- Completed by: Claude Code (batch 0407–0412)
- Completion date: 2026-05-16
- Files changed: `src/backend/Code.gs` (append)
- Functions added:
  - `exportAllData(accessCode)` — full JSON backup
  - `getExportBundle(accessCode)` — JSON + 3 CSVs in one call
  - `exportShiftsCsv(accessCode)` — TURNI as CSV
  - `exportSalariesCsv(accessCode)` — STIPENDI as CSV
  - `exportNotesCsv(accessCode)` — NOTE as CSV
  - `buildExportBundle_()` — internal assembler
  - `csvForRecords_(headers, records)`, `csvLine_`, `csvCell_` — RFC4180 CSV writer
- Format constant: `IMPORT_EXPORT_FORMAT = 'alina-lavoro/v1'`.
- Reuses existing `safeConfig_` (strips `codice_accesso`).
- No new dependencies, no new OAuth scope, no manifest change.
- Backup utility `backupSheet_` re-used in task 0410 (not yet here).
- Session: `docs/sessions/2026-05-16-data-import-export-batch.md`.
