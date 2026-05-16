# Task 0387 — V2.2.0 Backend Access Code Adjustment

- Project: Alina Lavoro
- Type: backend
- Priority: high
- Deploy: no

## Objective

Remove access code enforcement from backend without breaking existing data or function signatures.

## Change

`requireAccess_(code)` converted to no-op:
```javascript
function requireAccess_(code) {
  // V2.2.0: access code check removed — single-user personal app, URL is the key
}
```

All public function signatures unchanged. `accessCode` parameters accepted but ignored. No schema changes, no data migration, no config deletion.

## Done status

- Completed by: Claude Code (Sonnet 4.6)
- Completion date: 2026-05-16
- Completion commit: f997190
- Session: docs/sessions/2026-05-16-v220-no-login-release.md
