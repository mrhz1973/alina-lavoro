# Task 0411 — Frontend Import/Export UI

- Project: Alina Lavoro
- Type: frontend
- Priority: high
- Deploy: no
- Status: done

## Done status

- Completed by: Claude Code (batch 0407–0412)
- Completion date: 2026-05-16
- Files changed: `src/frontend/Index.html`
- New section: appended to Settings page via `renderImportExportSection_()`; section title 📦 "Importa / Esporta dati".
- Export UI:
  - Buttons: Backup JSON · Turni CSV · Stipendi CSV · Note CSV.
  - Result shown in modal with read-only textarea + Copia button (`document.execCommand('copy')` with manual-selection fallback for sandboxed iframes).
- Import UI:
  - Data type selector (Auto / Turni / Stipendi / Note).
  - Source selector (CSV/TSV paste · JSON paste · sheet tab in current Google Sheet).
  - Conditional fields per source.
  - Anteprima button (validates without writing).
  - Apply button visible only when at least one fresh row is detected; otherwise a `pill` "Nessuna riga nuova da importare" replaces it.
  - 🛡️ Safety notice shown before apply.
- Apply flow: calls `applyImport(..., {mode: 'merge_skip_duplicates'})`, then re-fetches `getBootstrap` and `mergeServerData` to refresh client state and cache.
- Mobile compatibility:
  - No new external dependencies, no new framework.
  - No `??`, `||=`, `?.[]` operators.
  - Monospace textarea with `font-size: 12px` for old WebView.
  - `.btn-row` flex-wraps existing CSS.
- 14 new JS functions added (all named with trailing `_` for internal helpers where appropriate).
- All text in Italian (consistent with task prompt; existing app's RU layer not extended in this batch).
- Session: `docs/sessions/2026-05-16-data-import-export-batch.md`.
