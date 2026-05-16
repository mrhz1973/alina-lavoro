# Task 0409 — Backend Google Sheets import preview + validation

- Project: Alina Lavoro
- Type: backend
- Priority: high
- Deploy: no
- Status: done

## Done status

- Completed by: Claude Code (batch 0407–0412)
- Completion date: 2026-05-16
- Files changed: `src/backend/Code.gs` (append)
- Supported preview inputs:
  - CSV / TSV paste (auto-detects tab vs comma separator).
  - JSON backup paste (re-imports `alina-lavoro/v1` format).
  - Sheet tab within the **current** Google Sheet (works with `spreadsheets.currentonly` scope).
  - External Google Sheet URL/ID — **deferred**: returns clear error with the three valid alternatives (scope upgrade required).
- Functions added (preview, no writes):
  - `listImportableSheets`, `previewImportFromCsv`, `previewImportFromJson`, `previewImportFromSheetTab`, `previewImportFromSpreadsheet` (deferred-stub).
  - `buildImportPreview_`, `detectDataType_`, `normalizeImportRow_` (+ per-type normalizers), `mapImportHeaders_`, `importHeaderAliases_`.
  - `parseImportDate_` (YYYY-MM-DD, YYYY/MM/DD, DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY, Date), `parseImportMonth_`, `parseImportTime_` (delegates to existing `formatTimeForImport_`), `parseBool_`.
  - `validateRow_`, `rowSummary_`, `duplicateSignature_`, `loadExistingForType_`.
  - `parseCsv_` (RFC4180, BOM-aware), `parseTsv_` (tab fallback).
- Validation reports: totalRows, validCount, invalidCount, duplicateCount, freshCount, sample (5), duplicateSamples (10), invalidSamples (10).
- **Preview never writes** to the spreadsheet and does **not** create backups.
- Locale-tolerant date parsing: accepts both ISO YYYY-MM-DD and Italian DD/MM/YYYY; normalizes to ISO.
- Header aliases support EN/IT variants (`data/date/giorno`, `inizio/start`, `nota/note/commento`, `importo_reale/importo/amount`, ...).
- Session: `docs/sessions/2026-05-16-data-import-export-batch.md`.
