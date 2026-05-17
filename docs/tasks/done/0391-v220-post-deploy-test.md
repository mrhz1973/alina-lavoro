# Task 0391 — V2.2.0 Post-Deploy Test

- Project: Alina Lavoro
- Type: manual-test
- Priority: high
- Deploy: no

## Objective

User opens `/exec` on phone and confirms V2.2.0 no-login works correctly.

## Test criteria

- App opens directly without asking for any code
- Home screen is visible immediately
- Data loads in background (Caricamento... then data appears)
- If no internet: app shows with empty state or cached data, no code screen
- Navigation (Mesi, Note, Impostazioni) works
- Settings: "Nuovo codice accesso" field is gone

## Expected user confirmation

User writes: "tutto ok 2.2.0" (or equivalent)

## Manual gate

This task requires real user test on phone. Cannot be auto-completed.

## Next

After OK → task 0392 (stable tag v2.2.0-stable)

## Done status

- Completed by: Claude Code (task close 0391/0392 batch, 2026-05-17)
- Outcome: **PASS**
- Test date: 2026-05-17
- Build tested: APP_BUILD='0427', deploy @54
- URL: unchanged (same deployment ID as @47+)
- User confirmation: confirmed phone test PASS on @54 / build 0427
- Mesi UI: OK (compact year stats strip, month cards, inline stats, year toggle)
- App boot: OK
- Month detail: OK
- Import Google Sheet external: NOT live (future separate workstream)
- Session: `docs/sessions/2026-05-17-v220-stable-close.md`
