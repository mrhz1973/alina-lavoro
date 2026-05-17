# Session — 2026-05-17 day-bars-color-fix-ui-only (task 0428)

## Objective
Fix day card bars in Month Detail: bars appeared all dark (just bar track showing, no colored fill).

## Root Cause
`.month-detail-day-bar-fill` was a `<span>` without `display:block`. Since `<span>` is inline by default, `height:100%` had no effect — the fill had zero height and was invisible. The bar track background (dark semi-transparent) showed through, making all bars appear dark/uncolored.

Comparison: `.month-tab-bar-fill` (month cards) correctly had `display:block;height:100%` — that's why month bars worked.

## Fix Applied
- Removed `.month-detail-day-bar`, dark-mode override, and `.month-detail-day-bar-fill` from inside `@media(max-width:899px)` block.
- Added them to the general CSS section (no media query restriction, so they apply on all screen sizes).
- Added `display:block` to `.month-detail-day-bar-fill`; removed the default `background:linear-gradient(...)` (legend classes provide correct colors at higher specificity).
- Legend classes `.month-detail-day-bar-fill.legend-days/hours/salary` were already correct (lines 256-258); they now render correctly once the fill has display:block.

## Validations
- git diff --check: OK
- node --check extracted script: OK
- APP_BUILD='0428' in Index.html: confirmed
- .gas/Code.js absent: confirmed
- previewImportFromSpreadsheet: not present (confirmed)
- applyReplaceFromExternalSheet: not present (confirmed)
- src/backend/Code.gs: not modified
- appsscript.json: not modified
- npm run sync: OK (3 files synced)
- clasp push --force: OK (3 files pushed)
- clasp deploy @55: OK

## Deploy
- Deploy ID: AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ
- Deploy number: @55
- URL: unchanged
- APP_BUILD: 0428
- APP_VERSION: 2.2.0

## Files Modified
- src/frontend/Index.html

## Status
Deployed @55. Phone test PASS — user confirmed 2026-05-17. Bars render correctly (purple/teal/yellow). Task 0428 closed.
