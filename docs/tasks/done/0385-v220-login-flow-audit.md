# Task 0385 — V2.2.0 Login Flow Audit

- Project: Alina Lavoro
- Type: audit
- Priority: high
- Deploy: no

## Objective

Audit all login/access-code touch points in frontend and backend before removing them.

## Findings

### Frontend (Index.html)
- `loginView` div: login screen shown by default
- `appView` / `nav`: start with `hidden` class
- DOMContentLoaded: checks `LS_ACCESS`, fills input, calls `login()` or `tryQuickResumeFromCache_`
- `login()`: validates code with server, shows app
- `tryQuickResumeFromCache_`: shows app if code + cache present
- `loginBackground_`: loads fresh data in background with code
- `flushQueue`: guarded by `!state.accessCode`
- `renderSettings`: has `change_code` / `cfg_codice_accesso` field
- `saveSettings`: saves new code to LS_ACCESS and state

### Backend (Code.gs)
- `requireAccess_(code)`: validates code against CONFIG sheet
- Called by: `getBootstrap`, `saveConfig`, `saveShift`, `saveSalary`, `saveNote`, `deleteNote`, `syncBatch`
- All functions return `getBootstrap(accessCode)` — chained

## Done status

- Completed by: Claude Code (Sonnet 4.6)
- Completion date: 2026-05-16
- Completion commit: f997190
- Session: docs/sessions/2026-05-16-v220-no-login-release.md
