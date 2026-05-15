# Session — V2.0.1 Quick Resume Prep (task 0325)

- Date: 2026-05-15
- Task: 0325
- Type: app-finalization / UX
- Branch: main (worktree retarget-v200)

## Context

V2.0.0 is stable in production (@26). User asked whether the initial access-code screen can be removed because startup feels slow. Orchestrator decision: do not remove login entirely; implement safer quick resume — if saved code + valid local cache exist, show cached app immediately and sync in background.

## Changes made

### src/frontend/Index.html
- APP_VERSION bumped 2.0.0 → 2.0.1
- Script comment updated to include V2.0.1 quick resume note
- DOMContentLoaded modified: if tryQuickResumeFromCache_ succeeds, call loginBackground_ instead of login()
- Added `tryQuickResumeFromCache_(savedCode, c)`: shows app immediately if savedCode matches c.accessCode
- Added `loginBackground_(code)`: silent server bootstrap; merges data + render on success; render on error; no loading toast

### package.json
- version bumped 2.0.0 → 2.0.1

## Behavior after change

| Scenario | Before | After |
|----------|--------|-------|
| Saved code + matching cache | Show login → wait for server → show app | Show app immediately from cache; server syncs silently |
| Saved code + no/mismatched cache | Show login → wait for server → show app | Unchanged (calls login() as before) |
| No saved code | Show login screen | Unchanged |
| Server fails (offline), cached session | Show login → error → fallback to cached app | Show app immediately; server error → silent render |

## Production state

- Production: V2.0.0 @26 (unchanged — no deploy in this task)
- Stable tag: v2.0.0-stable (unchanged)
- Source target: V2.0.1 (not yet deployed)

## Checks run

- git diff --check: OK
- package.json valid JSON: OK
- APP_VERSION = 2.0.1: OK
- package.json version = 2.0.1: OK
- Forbidden operators (??/||=/?.) grep: none found
- navbar data-page tabs: home, months, notes, settings
- No src/backend/Code.gs changes
- No appsscript.json changes
- No gas-current/** changes
- node --check on extracted inline JS: OK

## Next step

Manual source review of quick resume behavior → V2.0.1 test gate → deploy gate (separate task, requires explicit authorization).
