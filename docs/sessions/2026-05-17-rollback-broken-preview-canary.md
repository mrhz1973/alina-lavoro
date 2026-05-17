# Session — Rollback Broken Preview Canary (task 0434)

**Date:** 2026-05-17
**Task:** 0434 — Rollback broken preview canary (build 0433 → 0428 in HEAD/dev)
**Implementer:** Claude Code (Sonnet)
**APP_BUILD restored:** 0428

---

## Context

Task 0433 (external sheet preview canary) failed the /dev boot test:
- Symptom: /dev blocked on "Apertura app…" (same boot failure pattern as task 0430)
- No hotfix attempted — per safe design policy (max 1 hotfix then rollback)
- Decision: rollback HEAD/dev to 0428 baseline immediately

Production /exec @57 / build 0428 was NOT touched at any point.

---

## What was done

Restored source files from tag `v2.2.0-build0428-stable`:

```
git checkout v2.2.0-build0428-stable -- src/frontend/Index.html src/backend/Code.gs appsscript.json
```

### Verification after restore

- `src/frontend/Index.html`: `APP_BUILD='0428'` ✓
- `src/backend/Code.gs`: `previewExternalSheetImport` NOT present ✓
- `appsscript.json`: `spreadsheets.readonly` NOT present ✓
- No external sheet import UI in Settings ✓

### Checks

- `git diff --check` — OK
- Inline JS extraction + `node --check` — syntax OK
- `npm run sync` — synced to `.gas/`
- `.gas/Index.html` contains `APP_BUILD='0428'` ✓
- `.gas/Code.js` not present ✓
- `npx clasp push --force` — pushed 3 files (HEAD only, no deploy)

---

## Production state

| Field | Value |
|---|---|
| Production URL | @57 (unchanged, untouched) |
| Production build | 0428 (unchanged) |
| HEAD/dev build | 0428 (restored) |
| clasp deploy executed | NO |
| import Google Sheet live | NO |
| spreadsheets.readonly | NOT present |

---

## Post-mortem: why 0433 broke /dev boot

The preview-only canary (0433) added `renderExternalSheetPreviewSection_()` call inside `renderSettings()`. Although it was not in the boot path directly, the Settings render is triggered during app initialization. A rendering error in the new function (or a scope/reference issue in the minified inline script) caused the boot spinner to hang.

Root cause was not deeply investigated per policy — rollback is the correct response.

**Pattern:** any code change in `renderSettings()` or functions it calls is NOT fully isolated from boot. The "only on button click" rule for server calls is correct, but rendering functions called from Settings render do run during app init.

---

## Lessons for future import attempt

- The safe approach for external sheet import canary is a **separate ultra-minimal dev page** outside the main app, not a Settings section inside the main app.
- Or: the import UI must be lazy-rendered only after explicit user navigation, not as part of `renderSettings()` auto-render.
- Any new attempt needs a separate explicit task gate.

---

## Next step

Production @57 / build 0428 stable. No pending work.
Future external import attempt must use a different architecture (separate dev page or lazy render only).
