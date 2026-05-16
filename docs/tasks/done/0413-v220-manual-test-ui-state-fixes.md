# Task 0413 — V2.2.0 Manual Test UI/State Fixes

- Project: Alina Lavoro
- Type: bug-fix + UX patch
- Priority: high
- Deploy: NO (source patch only — production remains @35)
- Status: done

## Objective

Apply a single coherent frontend source patch to fix 9 user-reported UI/state bugs surfaced during V2.2.0 + 0406 manual testing, while preserving the 0406 start-work fix, the Oggi badge, no-login direct start, and the 0407–0412 import/export source code already on `main`.

## Issues addressed

1. Language toggle button label now updates IT ↔ RU.
2. Theme/lang stale-server overwrite guard — config mutations bump `_localMutationAt`; `initBackground_` and `flushQueue` merge order swapped so local wins on conflict during in-flight server calls.
3. Modal backdrop blocks background controls — base z-index 10050, stronger backdrop, solid modal surface.
4. Compact Home metrics card — single 2×2 grid replaces the three separate metric cards plus standalone estimated card; sync row inside the same card.
5. Home notes filtered to today only — Notes page unchanged, full history preserved in storage.
6. Bottom nav reduced to Home / Mesi / Note; Settings still accessible via top-right gear; `setPage('settings')` and Settings page intact.
7. Mesi page title now a real `.page-heading` (centered, no card) — analytics, groupings, Dettaglio mese logic untouched.
8. Annual analytics labels now annual (Ore anno / Giorni anno / Guadagno stimato anno / Stipendio reale anno) in IT and RU.
9. Annual analytics charts now year-scoped — `yearChart` derived from `yearItems` instead of unfiltered `summaries.slice(0,12)`.
10. 0406 start-work fix, Oggi badge, no-login direct start, and import/export 0407–0412 frontend code all preserved.

## Done status

- Completed by: Claude Code (task 0413)
- Completion date: 2026-05-16
- Completion commit: see git log for `fix: apply manual test UI and state fixes`
- Deploy: NOT executed — source patch only; production remains @35
- Backend touched: NO — frontend-only patch sufficient
- Tag created: NO — v2.2.0-stable remains pending
- Rollback: NOT executed
- gas-current: NOT modified
- 0391 (post-deploy test for @35): pending
- 0392 (v2.2.0-stable tag): pending
- Session: `docs/sessions/2026-05-16-v220-manual-test-ui-state-fixes.md`

## Validation

- `git diff --check` → clean
- inline script `node --check` → OK
- modern operators (`??`, `||=`, `?.`) check → no match
- nav `data-page` enumerated: home / months / notes
- `APP_VERSION` remains `2.2.0`
- import/export function definitions and call sites preserved

## Next step

Explicit deploy gate required before 0413 fixes plus the 0407–0412 import/export source reach production (@36 or later). Until then production stays at @35 (V2.2.0 + 0406 fix only).
