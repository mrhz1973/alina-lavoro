# Task 0406 — V2.2.0 Start-Work State Regression Fix

- Project: Alina Lavoro
- Type: bug-fix
- Priority: high
- Deploy: yes (authorized in task prompt)
- Status: done

## Objective

Fix the start-work button reversion bug in V2.2.0 patched @33: after the user selects a start time, the Home button briefly shows "Fine lavoro" then reverts to "Inizio lavoro".

## Done status

- Completed by: Claude Code (task 0406)
- Completion date: 2026-05-16
- Completion commit: e31cc09 — `fix: stabilize start work state after time selection`
- Deploy: @35 (same deployment ID as @33/@31; URL unchanged)
- Root cause: `initBackground_()` getBootstrap response (stale server data) called `mergeServerData` and replaced `state.shifts` after a local `commitStartWork` mutation, reverting the UI state.
- Fix: `_localMutationAt` timestamp guard in `upsertLocalShift` + conditional merge in `initBackground_`.
- Backend touched: NO
- Tag created: NO (v2.2.0-stable still pending manual user test)
- Rollback: NOT executed
- Session: `docs/sessions/2026-05-16-v220-start-work-state-regression-fix.md`
- Next step: manual user test of start-work flow on the live app (@35).
