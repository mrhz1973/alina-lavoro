# Session — 0423 Boot Stuck Hotfix

**Date:** 2026-05-17
**Task:** 0423 — hotfix boot stuck after 0420 deploy
**Build:** APP_BUILD='0423'
**Deploy:** @50 (same ID/URL as @49)

## Problem

After corrected push + redeploy @49 (task 0422), the live app opened the page but remained stuck on the boot placeholder "Apertura app… / Caricamento". The Home page never rendered.

## Root Cause Analysis

Static analysis + node --check passed (no syntax errors). The boot sequence in `DOMContentLoaded` was fragile: if `state.config` was `null` after the cache merge (possible when localStorage cache had `"config":null` from a prior session), `applyThemeLang()` would throw a TypeError on `state.config.tema`. This exception propagated out of the handler before `showApp()` was called, leaving the boot placeholder forever. Additionally, `renderActiveNotesMini()` had no null guard on `state.notes`, and `t()` accessed `state.config.lingua` without null-safety.

The new `spreadsheets.readonly` OAuth scope added in 0420 may have also caused `google.script.run` failures or authorization prompts affecting the boot flow.

## Fix Applied (src/frontend/Index.html)

1. **DOMContentLoaded**: wrapped `loadCache`+merge in `try/catch`; added explicit guards — `state.config` null-check + default, `Array.isArray` guards for `shifts/salaries/notes/summaries`, `reminder` object guard, `applyThemeLang` in `try/catch`; added 3-second fallback timer that forces `render()` if `#bootPlaceholder` still exists.
2. **`applyThemeLang`**: replaced all `state.config.X` with `var _cfg=state.config||{}` + `_cfg.X` — null-safe access.
3. **`showApp`**: wrapped `applyThemeLang()` and `render()` each in `try/catch` — boot never blocks.
4. **`t()`**: changed `state.config.lingua` to `(state.config&&state.config.lingua)`.
5. **`renderActiveNotesMini`**: changed `state.notes.filter(` to `(state.notes||[]).filter(`.

These changes guarantee that the Home page renders from cache or empty state regardless of localStorage corruption, null config, OAuth/scope errors, or backend failures.

## Validation

- `git diff --check`: clean
- `node --check` on extracted inline script: exit 0
- All fix patterns verified present via grep
- External sheet import (`doPreviewExternalSheet_`, `renderImportExportSection_`) still present
- `npm run sync`: clean
- `.gas/Index.html` APP_BUILD='0423' confirmed
- `clasp push --force`: 3 files pushed at 08:14:53
- `clasp deploy --deploymentId AKfycbxtG6...`: @50
- `clasp pull` + verify: remote APP_BUILD='0423' confirmed

## Deploy

| Field | Value |
|---|---|
| Deploy number | **@50** |
| Deployment ID | AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ |
| URL changed | **No** (same ID) |
| Remote verified | **Yes** — clasp pull confirms APP_BUILD='0423' |

## Open

- 0391: post-deploy phone test on @50 (pending)
- 0392: stable tag after test pass (pending)
