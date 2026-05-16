# Task 0403 — V2.2.0 Month Detail Day-Card Readability Polish

- Project: Alina Lavoro
- Type: frontend-polish
- Priority: normal
- Deploy: no

## Goal

Improve readability of day cards in Dettaglio mese and give the corrected today indicator a clear but non-dominant visual identity. No data, calculations, or DOM rebuild logic changed.

## Change

`src/frontend/Index.html` — three small additions in `<style>`:

1. `.month-detail-day-date` — now `display:flex; align-items:center; flex-wrap:wrap; gap:8px` so the new today pill sits inline with the date string and wraps cleanly on narrow screens.

2. `.month-detail-day-today-badge` — small gradient pill (uses `--primary` / `--primary2`), 22px tall, uppercase "Oggi" / "Сегодня", `--radius` 999px. Only rendered (TASK 0400) on the card whose date matches `today()`.

3. `.month-detail-day.is-today` — inner-stroke highlight via `inset 0 0 0 1.5px var(--primary)` + `var(--shadow-soft)` (light) / inner stroke only (dark). Visible enough to find at-a-glance, light enough not to compete with totals/metrics.

Mobile day-card sizing/padding/spacing/border-radius were already well-tuned at `@media(max-width:899px)` and remain unchanged. Performance kept safe for old WebView: no expensive gradients on every card, no transforms, no layout-thrashing JS, no new DOM beyond a single inline `<span>` per today card.

## Done status

- Completed by: Claude Code (Opus 4.7, Extreme)
- Completion date: 2026-05-16
- Session: docs/sessions/2026-05-16-v220-frontend-fix-ui-polish-batch.md
- Deploy/tag/rollback: NOT executed (source-only patch)
