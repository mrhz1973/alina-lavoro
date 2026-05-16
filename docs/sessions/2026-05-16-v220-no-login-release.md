# Session — V2.2.0 No-Login Release

**Date:** 2026-05-16
**Tasks:** 0384–0390
**Branch:** main
**Implementer:** Claude Code (Sonnet 4.6)

## Objective

Remove the access code startup gate entirely. App must open directly on `/exec` without asking for any code.

## Changes

### Backend (`src/backend/Code.gs`)
- `requireAccess_(code)`: converted to no-op — V2.2.0 note added, `throw` removed. All function signatures unchanged; `accessCode` params accepted but ignored. No data migration needed.

### Frontend (`src/frontend/Index.html`)
- **Removed** `loginView` div (the code screen, lines 222–223)
- **Removed** `hidden` class from `appView` and `nav` (app visible immediately on load)
- **Removed** `login()` async function
- **Removed** `tryQuickResumeFromCache_()` function
- **Replaced** `loginBackground_(code)` with `initBackground_()` (no code param; calls `getBootstrap([])`)
- **Rewrote** DOMContentLoaded: loads cache → apply theme/lang → `showApp()` immediately → `initBackground_()` in background
- **Removed** `change_code` field from `renderSettings()`
- **Removed** `newCode` / `codice_accesso` handling from `saveSettings()`
- **Removed** `!state.accessCode` guard from `flushQueue()`
- **Updated** `APP_VERSION` → `'2.2.0'`
- **Updated** changelog comment to include `V2.2.0: no-login direct start`

### `package.json`
- `version`: `2.1.1` → `2.2.0`

## Startup behavior (V2.2.0)

| Scenario | Behavior |
|---|---|
| Normal (server responds) | App visible immediately with cached data; server data merges in background |
| Cache exists, server fails | App visible with cached data; serverOk=false; no error screen |
| No cache, server fails | App visible with empty state (no data messages); no code screen |

## Deploy

- **clasp push:** 3 files (appsscript.json, Code.gs, Index.html)
- **Deploy:** `@31` — same deployment ID as @30/@29/@28/@26/@24
- **Description:** V2.2.0

## Checks

- `git diff --check`: no whitespace errors
- `node --check` on extracted JS: OK
- No modern operators (`??`, `||=`, `?.`): confirmed
- `data-page` navbar: home, months, notes, settings (unchanged)
- `APP_VERSION`: 2.2.0 confirmed
- `loginView` removed: confirmed
- `appView hidden` removed: confirmed
- `initBackground_` present: confirmed
- `login()` removed: confirmed
- `cfg_codice_accesso` removed: confirmed
- `!state.accessCode` guard removed: confirmed
- Backend `requireAccess_` no-op: confirmed
- No `appsscript.json` structural change
- No `gas-current/` modified
- No `.gas/_check_inline.js` in final push (cleaned before re-push)

## Commits

- `f997190` — `app: remove access code startup gate (V2.2.0)`
- docs commit: see below

## Git status after deploy

Clean (docs commit follows).

## Open

- Task 0391: user tests `/exec` and reports OK
- Task 0392: stable tag `v2.2.0-stable` — pending user confirmation
