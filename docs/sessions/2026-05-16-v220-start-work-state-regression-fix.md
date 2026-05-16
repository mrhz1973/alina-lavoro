# Session — V2.2.0 Start-Work State Regression Fix (task 0406)

**Date:** 2026-05-16
**Task:** 0406
**Branch:** main
**Commit:** e31cc09
**Deploy:** @35 (same deployment ID as @33/@31; URL unchanged)
**Status:** complete

---

## Root Cause

`initBackground_()` is called once at `DOMContentLoaded`. It starts an async `getBootstrap` server call. If the user taps "Inizio lavoro" and selects a start time **while** this server call is in-flight, the sequence is:

1. `commitStartWork()` → `upsertLocalShift(s)` → `state.shifts` updated locally → `render()` → Home shows **"Fine lavoro"** ✓
2. `initBackground_()` receives its `getBootstrap` response (stale: server hasn't received the new shift yet)
3. `mergeServerData(res.data)` executes: `state.shifts = data.shifts || []` — **complete replacement** with old server data
4. `render()` → Home reverts to **"Inizio lavoro"** ✗

This is a classic async read-then-clobber race condition: a background server call issued before a local mutation arrives after the mutation and silently overwrites it.

---

## Fix — Three targeted changes in `src/frontend/Index.html`

### 1. `state._localMutationAt` (line 243)
Added `_localMutationAt:0` to the `state` object. Runtime-only timestamp; not persisted to cache.

### 2. `upsertLocalShift` (line 293)
Added `state._localMutationAt = Date.now();` at the top of the function. Every local shift mutation now records its timestamp. This covers `commitStartWork`, `commitEndWork`, and `saveManualShift` since all call `upsertLocalShift`.

### 3. `initBackground_()` (line 250)
- Captures `var _bgStart = Date.now()` before the `await serverCall('getBootstrap')`.
- After the response arrives, checks `state._localMutationAt > _bgStart`.
  - **True** (local mutation happened after bootstrap call started → server data is stale):
    - Merges config only (spread, safe).
    - Adds any server shifts **not already in local state** (additive only; never removes local shifts).
    - Replaces salaries, notes, summaries, reminder from server (no pending queue for these).
  - **False** (no local mutations since call started → server data is fresh):
    - Calls `mergeServerData(res.data)` normally.

`flushQueue()` is unchanged: after `syncBatch` succeeds, the server has processed all pending mutations and returns fresh data. Queue is cleared before `mergeServerData` is called, so the replacement is always correct there.

---

## Simulated flow after fix

| Step | Action | `_localMutationAt` | `state.shifts` | Home button |
|------|---------|--------------------|----------------|-------------|
| 1 | App loads; `initBackground_()` starts (`_bgStart=T1`) | 0 | [] | boot placeholder |
| 2 | User taps "Inizio lavoro"; picks time; `commitStartWork()` runs | T2 (T2 > T1) | [shift{inizio:'09:30'}] | **Fine lavoro** |
| 3 | `flushQueue()` from commitStartWork starts (async) | T2 | [shift] | Fine lavoro |
| 4 | `initBackground_()` receives `getBootstrap` response (old data) | T2 | [shift] | Fine lavoro |
| 5 | Check: T2 > T1 → stale merge; local shift preserved | T2 | [shift] | **Fine lavoro** ✓ |
| 6 | `render()` in initBackground_ | T2 | [shift] | **Fine lavoro** ✓ |
| 7 | `await flushQueue()` in initBackground_ (queue empty if step 3 completed) | T2 | [shift] | Fine lavoro |

---

## Validation checks

- `git diff --check` → clean
- JS syntax (`node --check` on extracted script) → OK
- Forbidden modern operators grep → none found
- Navbar tabs → home/months/notes/settings ✓
- `APP_VERSION` → `2.2.0` (unchanged) ✓
- No forbidden files changed ✓
- Backend not touched (bug was entirely in frontend state management) ✓

---

## Files changed

- `src/frontend/Index.html` — 3 lines changed (state init, `upsertLocalShift`, `initBackground_`)
- `docs/LLMS.md` — state updated
- `docs/wiki/current-state.md` — state updated
- `docs/sessions/2026-05-16-v220-start-work-state-regression-fix.md` — this file
- `docs/tasks/done/0406-v220-start-work-state-regression-fix.md` — done marker

---

## Deploy

- `npm run sync` → OK (3 files to `.gas/`)
- `npx clasp push` → OK (Pushed 3 files)
- `npx clasp deploy --deploymentId AKfycbyIkaQqS-...` → Deployed @35 (same deployment ID as @33/@31; URL unchanged)
- Tag: NOT created (v2.2.0-stable pending manual user test)
- Rollback: NOT executed

---

## Next step

Manual user test: open app on phone, tap "Inizio lavoro", select time, verify Home stays on "Fine lavoro" without reverting.
