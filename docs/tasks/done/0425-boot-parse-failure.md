---
id: 0425
title: Boot parse failure forensic hotfix
type: app-hotfix
status: done
date_completed: 2026-05-17
deploy: '@52'
app_build: '0425'
session: docs/sessions/2026-05-17-boot-parse-failure-0425.md
---

## Objective
Forensic investigation and fix for persistent boot failure after 0424/@51.
App showed "Apertura app… / Caricamento" indefinitely.
No fallback "Errore avvio app" visible.

## Root causes identified
1. **Missing readyState guard**: DOMContentLoaded listener registered after event may have already fired in cached GAS web app scenarios.
2. **No try/catch around renderXxx() in render()**: render failure propagates and calls renderBootFallback_(), which could fail silently.
3. **renderBootFallback_() silent early return**: if `#content` is null, returns without any visible output.

## Changes (src/frontend/Index.html)
- Added panic boot script (separate ES5 `<script>` before main, total try/catch, readyState check, 2s delay)
- DOMContentLoaded extracted to `_bootMain_()` with readyState guard
- render(): renderXxx() calls wrapped in try/catch → calls renderBootFallback_() on failure
- renderBootFallback_(): added body injection fallback when `#content` is null; added "Build 0425" label
- APP_BUILD: '0424' → '0425'

## Deploy
- Push: `clasp push --force` → 3 files
- Deploy: @52 (same deployment ID/URL as @51)
- Remote verified: APP_BUILD='0425' confirmed via clasp pull

## Done status
- Completed by: Claude Code (Sonnet 4.6)
- Completion commit: see git log
- node --check: PASS (all 3 scripts)
- git diff --check: PASS
- Remote verification: PASS (clasp pull confirms 0425)
- Next: 0391 (phone test), 0392 (stable tag)
