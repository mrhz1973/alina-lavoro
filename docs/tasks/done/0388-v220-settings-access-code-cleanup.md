# Task 0388 — V2.2.0 Settings Access Code Cleanup

- Project: Alina Lavoro
- Type: frontend
- Priority: normal
- Deploy: no

## Objective

Remove "Nuovo codice accesso" field from settings UI so it no longer confuses the user.

## Changes

- `renderSettings`: removed `change_code` / `cfg_codice_accesso` field
- `saveSettings`: removed `newCode` block and `localStorage.setItem(LS_ACCESS, newCode)`

## Done status

- Completed by: Claude Code (Sonnet 4.6)
- Completion date: 2026-05-16
- Completion commit: f997190
- Session: docs/sessions/2026-05-16-v220-no-login-release.md
