# Session — Force Boot Recovery (task 0424) — 2026-05-17

## Summary

Boot stuck fix second pass. After @50 (task 0423), app occasionally still showed "Apertura app… / Caricamento" placeholder because the DOMContentLoaded handler did not guarantee render() execution before background async init.

## Root Cause

The @50 fix added null-guards and a 3s fallback timer but did not guarantee an immediate synchronous render from local state. The render() call was inside showApp() which could throw, and the fallback timer relied on getElementById('bootPlaceholder') still being present — a race condition.

## Fix Applied (APP_BUILD='0424')

- Added `ensureStateShape_()` — centralised state integrity guard (state/config/arrays/reminder/page).
- DOMContentLoaded now: loadCache (try/catch) → ensureStateShape_() → applyThemeLang (try/catch) → show appView + nav → render() (try/catch → renderBootFallback_ on failure) → async background init.
- Removed 3s fallback timer (replaced by immediate render + fallback).
- Added `renderBootFallback_()` — shows "Errore avvio app" with Riprova + Impostazioni buttons.
- Added `retryBoot_()` — calls ensureStateShape_() + render().
- `window.onerror` now calls renderBootFallback_() if bootPlaceholder is still visible.
- `window.addEventListener('unhandledrejection', ...)` silenced (no placeholder stuck).
- `initBackground_()` and `setupMobileUi_()` wrapped in try/catch in DOMContentLoaded.
- `render()` function: applyThemeLang() wrapped in try/catch.
- `initBackground_()`: applyThemeLang() + render() wrapped in try/catch.

## Deploy

- APP_BUILD source: '0424'
- .gas/Index.html: APP_BUILD='0424' ✓
- Remote pull verified: APP_BUILD='0424' ✓
- Deploy: @51 (same ID, URL unchanged)
- Deploy ID: AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ

## Checks

- git diff --check: clean
- node --check main script: SYNTAX OK
- node --check boot script: SYNTAX OK
- previewImportFromSpreadsheet: present (2 matches)
- No nullish/optional-chaining operators
- data-page nav tabs: verified

## Status

- Tag: none (0391/0392 pending — phone test gate)
- Next: 0391 (manual phone test on @51)
