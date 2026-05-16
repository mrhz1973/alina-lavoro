# Task 0399 — V2.2.1 Month Detail Label Cleanup

- Project: Alina Lavoro
- Type: app-hotfix / UX cleanup
- Priority: normal
- Deploy policy: requires explicit deploy gate
- Status: queued

## User finding

The user reported that in month detail, each historical day shows a label like "Ore oggi".

This is confusing because the row is not "today"; it is a day inside the selected month detail.

## Problem

The frontend likely reuses the existing `today_hours` translation key inside the month detail daily rows.

Current visible wording:

- `Ore oggi`

Preferred wording:

- `Ore`

Alternative acceptable wording:

- `Ore giorno`
- `Ore lavorate`

Recommended final choice: `Ore` because the date row already gives the day context.

## Scope

Implement in a future V2.2.1 hotfix batch, unless superseded by another app cleanup batch.

Expected code area:

- `src/frontend/Index.html`
- `renderMonthDetail()` daily-row labels
- i18n keys if a new label key is needed

## Acceptance criteria

- Month detail daily rows no longer show `Ore oggi`.
- Daily rows show a neutral label such as `Ore`.
- Existing Home metric may still show `Ore oggi` where appropriate.
- No backend change unless unexpectedly required.
- No deploy/tag without explicit gate.

## Notes

This is a UX wording bug, not a data bug. It should not block V2.2.0 post-deploy testing unless the user decides it is release-blocking.
