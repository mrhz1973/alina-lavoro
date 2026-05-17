# Task 0418 — V2.2.0 Mesi + Month Detail compact-card redesign + deploy

- Project: Alina Lavoro
- Type: frontend + deploy
- Priority: normal
- Status: done
- Deploy: yes (redeploy in place against existing production deployment ID)

## Objective

Redesign the Mesi page month list and the Month Detail day list as compact, clickable card/tab layouts, and deploy for phone test on the same `/exec` URL.

## Allowed paths

- `src/frontend/Index.html`
- `docs/LLMS.md`
- `docs/wiki/current-state.md`
- `docs/sessions/2026-05-17-v220-mesi-month-detail-redesign.md`
- `docs/tasks/done/0418-v220-mesi-month-detail-redesign.md`
- `gas-current/` only if the deploy workflow updates it

## Done status

- `APP_BUILD='0418'` (`src/frontend/Index.html` line 292).
- Mesi page: year accordions (2026 / 2025 / …) preserved; inside each year, months are compact `.list-item--month.month-tab` cards. Each card shows month name + days + hours + salary/estimated + three proportional bars (days / hours / salary) scaled within the year. A single compact color legend (`.months-legend`) sits above the year accordions. Optional small `Stipendio reale` button only for editable past months (`isSalaryMonthEditable_`). The whole card is clickable (mouse + keyboard) and opens the Month Detail.
- Month Detail: each day is a compact `.list-item--clickable.month-detail-day` card showing date, hours, estimated, optional `📝 N` note indicator. Whole card is clickable and opens `openManualShiftModal('', date)` (extended to accept `dateOverride`). Today badge preserved.
- Helper `dayNotesCountForDate_` counts shifts on a date with non-empty `nota`. `buildMonthDetailSig_` includes per-day note count so the cache invalidates when notes change.
- Import/export Settings section, Home, navbar, IT/RU toggle, theme, today badge, start-work / end-work fix 0406 all preserved.
- Validations: `git diff --check` clean; `node --check` on inline script OK; import/export grep OK; APP_BUILD confirmed.
- Deploy: `npm run sync && npx clasp push --force` OK; new versioned deployment blocked at 21-deployment cap; redeployed in place via `npx clasp deploy -i AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ -d 'V2.2.0 task-0418 compact months and clickable days'` → `@43` against the same deployment ID → `/exec` URL unchanged.

## Gates respected

- No stable tag created.
- No rollback.
- 0391 (phone test) and 0392 (stable tag) remain pending.
- No `git add .` (selective staging only).
- No reset / clean / force push / delete.
- No secrets / credentials / OAuth touched.
- `appsscript.json` and `package.json` not modified.

## References

- Session: `docs/sessions/2026-05-17-v220-mesi-month-detail-redesign.md`.
- Deployment ID: `AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ` (now at version `@43`; same URL as @37 / @39 / @41).
