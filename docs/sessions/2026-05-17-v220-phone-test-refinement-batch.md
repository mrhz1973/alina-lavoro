# Session — 2026-05-17 — Task 0417 V2.2.0 phone test refinement batch

## Scope

Phone-test refinement batch following 0416 deploy @39. Source patches + deploy authorized.

## Changes

### FIX 1 — Home header cleanup
- `src/frontend/Index.html` topbar: removed `<p id="todayLabel">` date line; replaced visible title `Alina Lavoro` with localized `<h1 data-i18n="hello">Ciao Alina</h1>` (RU: "Привет, Алина").
- Hero card on Home: removed the `<div class="kicker">${t('hello')}</div>` eyebrow so the greeting no longer duplicates.
- The hero card keeps the status title and the long-form date inside `status-subtitle` (date appears only there).
- `render()` updated with null guard for the removed `todayLabel` element.

### FIX 2 — Annual analytics 3-bar per-month redesign
- New helpers:
  - `buildAnalyticsLegend_()` — 3-dot legend (days, hours, salary).
  - `buildAnalyticsMonthlyMultiChart_(items)` — renders, per month, 3 colored bars in order: days → hours → salary, each with its own value.
  - `buildAnalyticsYearBlock_(year, items)` — totals grid + 3-bar chart, scoped to that year only.
- `buildAnalyticsSection_(summaries)` now iterates **all years** (current year first, then older descending), each year inside its own `.analytics-year` block. Legend rendered once at the top of the body.
- Distinct colors: days `#6c5ce7`, hours `#00cec9`, salary `#fdcb6e`.
- Calculations are unchanged; chart uses `stipendio_reale` when available, falling back to `stimato`.
- Removed unused `buildAnalyticsBarChart_` and `buildAnalyticsSalaryChart_`.

### FIX 3 — Month list simplification
- `buildMonthsListSection_`: each month is now one single clickable `article.list-item--month.list-item--clickable` (`role="button"`, `tabindex="0"`, Enter/Space keyboard activation). Clicking the whole card opens `openMonthDetail_(mw)`.
- Removed the per-month "Dettaglio" ghost button.
- Salary button preserved for editable past months (`isSalaryMonthEditable_`); it uses `stopPropagation` so it does not trigger the card click.
- CSS: `.list--months` is now single column (1fr) on all viewports; `.list-item--clickable` gets hover/active/focus affordances.
- Same behavior in current-year list and inside older-year collapsible folders.

## Preserved
- IT/RU language toggle, theme/lang stale-server protection.
- Home compact metrics card (Riepilogo).
- Home notes today-only filter.
- Bottom nav Home / Mesi / Note.
- Mesi page heading outside fake card.
- Start-work state fix (0406).
- "Oggi" badge in month detail.
- Import / export (0407–0412).
- Settings save returns Home (0416).
- Annual analytics scoped per year — no duplicate current-year "2026" folder.
- Settings shows `Versione: 2.2.0 · Build: 0417`.

## Validation
- `git diff --check` — OK.
- Inline script extraction + `node --check` — OK (64691 chars).
- Modern operator grep `?? || ?.` — no matches.
- `data-page` tabs: home / months / notes — unchanged.
- `APP_BUILD='0417'` — confirmed.

## Deploy
- Command: `npm run sync && npx clasp push --force && npx clasp deploy -i AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ`.
- Result: **@41** on existing deployment ID — URL unchanged from @37/@39.
- Note: Apps Script reported "up to 20 versioned deployments" cap on a fresh `clasp deploy`; resolved by updating the existing deployment ID (same pattern as 0415/0416, URL stays the same).

## Gates still pending
- 0391 — post-deploy phone test for @41 (was pending @39).
- 0392 — `v2.2.0-stable` tag, after phone test pass.

No tag created. No rollback. 0391 and 0392 remain pending.

## Next step
User reopens the phone link and continues the phone test on @41.
