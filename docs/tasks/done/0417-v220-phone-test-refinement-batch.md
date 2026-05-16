# Task 0417 — V2.2.0 phone test refinement batch

- Project: Alina Lavoro
- Type: code + deploy
- Status: done
- Deploy: authorized (executed)
- Branch: main
- Completed: 2026-05-17

## Scope

Phone-test refinement of V2.2.0 following 0416 deploy @39. Three UX changes + Apps Script redeploy.

## What changed

1. **Home header cleanup**
   - Topbar title: "Alina Lavoro" → localized "Ciao Alina" (RU "Привет, Алина").
   - Removed header date `#todayLabel`.
   - Removed duplicate "CIAO ALINA" eyebrow inside the Home hero card.
   - Date now appears only once, inside the hero card subtitle.

2. **Annual analytics — per-month 3-bar redesign**
   - For every year (current and older), each month renders 3 colored bars in order: days, hours, salary, each with its own value label.
   - Distinct colors with a single legend at the top of the analytics body.
   - Year totals preserved above each year's chart.
   - Annual scope per year preserved (no cross-year leakage).

3. **Month list simplification**
   - Removed the "Dettaglio" ghost button.
   - Each month is one clickable card (`role="button"`, keyboard accessible). The whole card opens month detail.
   - Salary button retained for editable past months with click propagation stopped.
   - Single column on mobile.

## Files

- `src/frontend/Index.html` (header, hero, analytics section, months list section, CSS)
- `docs/sessions/2026-05-17-v220-phone-test-refinement-batch.md`
- `docs/tasks/done/0417-v220-phone-test-refinement-batch.md`
- `docs/LLMS.md`
- `docs/wiki/current-state.md`
- `.gas/Index.html` (deploy snapshot)
- `.gas/Code.gs` (unchanged code copy — sync artifact)
- `.gas/appsscript.json` (sync artifact)

`src/backend/Code.gs` was not modified.

## Validation

- `git diff --check`: OK
- `node --check` on extracted inline script: OK
- Modern operator grep (?? || ?.): no match
- `data-page`: home, months, notes — unchanged
- `APP_BUILD='0417'` verified

## Deploy

- `npm run sync && npx clasp push --force && npx clasp deploy -i AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ`
- Result: **@41** on existing deployment ID.
- URL: **unchanged** (same as @37, @39).
- No new versioned deployment was created — the existing one was updated to bypass the 20-deployment cap.

## Gates

- v2.2.0-stable: **NOT created** — phone test still pending.
- Rollback: **NOT executed**.
- 0391 (post-deploy phone test): remains **pending**, now targeting @41.
- 0392 (stable tag): remains **pending**.

## Next step

User reopens the phone link and continues the phone test on @41.
