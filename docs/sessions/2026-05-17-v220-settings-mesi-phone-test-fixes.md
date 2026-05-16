# Session — 2026-05-17 · Task 0416 — Settings + Mesi Phone Test UX Fixes

## Summary

Three UX fixes applied, deployed, and live for continued phone test.

## Fixes applied

### Fix 1 — Settings version line
- Removed `APP_DEPLOY` constant and `Deploy: @35` from Settings visible line.
- Updated `APP_BUILD` from `'0413'` to `'0416'`.
- Settings now shows: `Versione: 2.2.0 · Build: 0416`.

### Fix 2 — Save Settings → Home
- `saveSettings()` now calls `setPage('home')` instead of `render()` after saving.
- After tapping Save, app navigates to Home. Toast "Salvato" still shows.

### Fix 3 — Remove duplicate current-year header in Mesi
- `renderMonths()` now renders current-year months directly (no collapsible header) below the analytics section.
- Older years (2025, 2024, …) retain collapsible year-block headers.
- `monthsDomMatches_()` updated: last check simplified to `lists.length>0` (itemCount check already validates data integrity).

## Deploy

| Field | Value |
|---|---|
| Deployment ID | AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ |
| Script version | @39 (updated existing deployment; URL unchanged) |
| URL changed | No |
| Stable tag created | No |

## Checks

- `git diff --check` — clean
- `node --check` on extracted inline JS — OK
- Modern operator grep — no hits
- Navbar tabs — home, months, notes (correct, no settings tab in nav)
- Import/export functions present — yes

## Files changed

- `src/frontend/Index.html` — 3 UX fixes
- `gas-current/Index.html` — deploy snapshot updated
- `docs/sessions/2026-05-17-v220-settings-mesi-phone-test-fixes.md` — this file
- `docs/tasks/done/0416-v220-settings-mesi-phone-test-fixes.md`
- `docs/LLMS.md`
- `docs/wiki/current-state.md`
- `docs/PROJECT_STATE.md`
- `docs/CHECKPOINT.md`

## Commit

- Source fix commit: `8507b2e`
- Docs commit: pending

## Status

- 0416 deployed @39 (same URL as @37)
- 0391 post-deploy phone test: pending
- 0392 stable tag: pending
- v2.2.0-stable: pending phone test
