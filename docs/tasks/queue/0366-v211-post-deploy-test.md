# Task 0366 — V2.1.1 Post-Deploy Manual Test

- Project: Alina Lavoro
- Type: manual-test / gate
- Priority: high
- Deploy policy: no
- Status: queued
- Gate: MANUAL — requires user confirmation

## Objective

User manually tests V2.1.1 on /exec @30 after deploy.
Primary focus: quick resume no longer asks for code on reopen.

## Test steps

1. Open /exec URL in browser (or phone).
2. Login with access code (first time after update — normal).
3. Close the browser tab completely.
4. Reopen the same /exec URL.
5. Verify the app opens WITHOUT asking for the access code again.
6. Verify app data (Home, Mesi, etc.) is shown immediately.
7. Verify analytics card on Mesi still works (V2.1.0 feature unaffected).
8. Verify collapsible toggle on analytics works.
9. Verify Mesi list still renders correctly.
10. Verify Dettaglio mese still works.
11. Verify Home page, Notes, Settings unaffected.
12. Confirm APP_VERSION in Settings shows 2.1.1.

## Pass criteria

- App opens without access code prompt after first login + reopen.
- All V2.1.0 analytics features intact.
- No JS errors in console.
- APP_VERSION in Settings shows 2.1.1.

## On pass → open task 0367 (stable tag gate).
## On fail → open targeted fix task before 0367.
