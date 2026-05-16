# Task 0362 — V2.1 Post-Deploy Manual Test

- Project: Alina Lavoro
- Type: manual-test / gate
- Priority: high
- Deploy policy: no
- Status: queued
- Gate: MANUAL — requires user confirmation

## Objective

User manually tests V2.1.0 on /exec after deploy (task 0361).

## Test steps

1. Open /exec URL in browser (or phone).
2. Login with access code.
3. Navigate to Mesi page.
4. Verify analytics card appears above the months list.
5. Verify collapsible toggle works (▾ / ▸).
6. Verify annual dashboard shows correct year totals.
7. Verify hours bar chart renders for recent months.
8. Verify worked days bar chart renders.
9. Verify salary comparison chart appears if real salary data exists.
10. Verify Mesi list still renders correctly below analytics.
11. Verify Dettaglio mese still works.
12. Verify Home page, Notes, Settings unaffected.
13. Confirm no horizontal scrolling on mobile.

## Pass criteria

- All Mesi functionality intact.
- Analytics card visible and interactive.
- No JS errors in console.
- APP_VERSION in Settings shows 2.1.0.

## On pass → open task 0363 (stable tag gate).
## On fail → open targeted fix task before 0363.
