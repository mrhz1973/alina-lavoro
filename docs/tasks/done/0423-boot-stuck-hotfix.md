# Task 0423 — Boot Stuck Hotfix

- Project: Alina Lavoro
- Type: hotfix
- Priority: critical
- Deploy: yes — @50 (same ID/URL)

## Objective

Fix app boot stuck on placeholder "Apertura app… / Caricamento" after 0420 deploy (@49).

## Done status

- Completed by: Claude Code (task 0423)
- Completion commit: (see push below)
- Build: APP_BUILD='0423'
- Deploy: @50 — AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ
- Remote verified: Yes — clasp pull APP_BUILD='0423'
- Session: docs/sessions/2026-05-17-boot-stuck-hotfix-0423.md

## Fix summary

5 targeted edits to `src/frontend/Index.html`:
1. DOMContentLoaded: try/catch + state null-guards + 3s boot timeout fallback
2. applyThemeLang: `var _cfg=state.config||{}` null-safe
3. showApp: try/catch around applyThemeLang and render
4. t(): null-safe state.config.lingua access
5. renderActiveNotesMini: `(state.notes||[]).filter` guard
