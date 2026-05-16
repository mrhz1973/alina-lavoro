# Task 0407 — Data Import/Export model and safety audit

- Project: Alina Lavoro
- Type: design / audit
- Priority: high
- Deploy: no
- Status: done

## Done status

- Completed by: Claude Code (batch 0407–0412)
- Completion date: 2026-05-16
- Audit deliverable: section "0407 — Data model and import/export safety audit" in `docs/sessions/2026-05-16-data-import-export-batch.md`.
- Key findings:
  - Schema captured: TURNI / STIPENDI / NOTE / CONFIG / SYNC_LOG (with column lists).
  - Existing utilities to reuse: `backupSheet_`, `upsertRecord_`, `getRecords_`, `formatTimeForImport_`, `minutesFromImport_`, `LockService`, `safeConfig_`.
  - OAuth scope is `spreadsheets.currentonly` → **external Google Sheet import requires scope upgrade**; in this batch we keep the scope unchanged and document the limitation.
  - Data portability model defined: JSON full backup (`alina-lavoro/v1`) + CSV per data type.
  - Safety rules defined: preview is read-only; apply always backs up first; default mode merge_skip_duplicates; no replace_all.
- Backend / frontend: nothing yet (design only at this task).
- Session: `docs/sessions/2026-05-16-data-import-export-batch.md`.
