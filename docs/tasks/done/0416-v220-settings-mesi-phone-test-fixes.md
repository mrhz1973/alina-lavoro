# Task 0416 — V2.2.0 Settings + Mesi Phone Test UX Fixes

- Project: Alina Lavoro
- Type: app-fix + deploy
- Priority: high
- Status: done
- Deploy: yes (authorized in task prompt)

## Objective

Apply three small UX fixes identified during phone test of @37, then deploy so the user can continue testing.

## Fixes

1. **Settings version line**: Remove Deploy from visible line. Show only `Versione: 2.2.0 · Build: 0416`.
2. **Save Settings → Home**: After saveSettings() completes, navigate to Home automatically.
3. **Mesi duplicate year header**: Remove collapsible "2026" header immediately below "Analisi · Anno 2026". Current-year months rendered directly; older years remain collapsible.

## Done status

- Completed by: Claude Code (2026-05-17)
- Completion commit: `8507b2e` (source fix)
- Deploy: @39 (script version), same deployment ID as @37, URL unchanged
- Session: `docs/sessions/2026-05-17-v220-settings-mesi-phone-test-fixes.md`
- Post-deploy phone test: pending (0391)
- Stable tag: pending (0392)
