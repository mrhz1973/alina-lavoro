# Task 0400 — V2.2.0 Month Detail Day-Label + Today-Badge Fix

- Project: Alina Lavoro
- Type: frontend-bugfix
- Priority: high
- Deploy: no

## Symptom (user-reported)

In Dettaglio mese, the word "Oggi" appears on every day card instead of only on the actual current day.

## Root cause

`renderMonthDetail` reused the i18n key `today_hours` (Italian: "Ore oggi") as the per-day stats label, so every card displayed "Ore oggi: X h Y min". It was not a date-comparison bug — there was no badge logic at all; the user perceived the repeated word "Oggi" as a badge.

## Fix

`src/frontend/Index.html` — three changes:

1. New i18n keys (IT + RU):
   - `day_hours_label`: 'Ore' / 'Часы'
   - `today_badge`: 'Oggi' / 'Сегодня'

2. `renderMonthDetail` per-day card label:
   - Before: `stat1l.textContent = t('today_hours');`
   - After:  `stat1l.textContent = t('day_hours_label');`

3. Proper today indicator: compute `todayStr = today()` once before the day-card loop, then per card check `days[j].date === todayStr` (full local date — year/month/day — using the existing `today()` helper which already produces `YYYY-MM-DD`). When the card date is today, add the `is-today` class to the `<article>` and append a small `.month-detail-day-today-badge` pill containing `t('today_badge')` to the date row.

4. `buildMonthDetailSig_` now includes `today()` so the render signature invalidates across midnight.

## Done status

- Completed by: Claude Code (Opus 4.7, Extreme)
- Completion date: 2026-05-16
- Session: docs/sessions/2026-05-16-v220-frontend-fix-ui-polish-batch.md
- Deploy/tag/rollback: NOT executed (source-only patch)
