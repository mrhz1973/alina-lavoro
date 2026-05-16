# Task 0370 — V2.1.1 Rollback / Supersession Cleanup

- Project: Alina Lavoro
- Type: docs
- Priority: normal
- Deploy policy: no
- Status: done

## Objective

Ensure rollback references in docs are correct for V2.1.1 stable release.
Confirm V2.1.0 has no stable tag (0362 failed). Confirm 0363 superseded by 0367.

## Done status

- Completed by: Claude Code (batch 0366–0371, 2026-05-16)
- V2.1.1: tag `v2.1.1-stable` → @30 (created task 0367)
- V2.1.0: no stable tag (0362 failed; tag `v2.1.0-stable` never created)
- V2.0.1: `v2.0.1-stable` → @28 (unchanged)
- V2.0.0: `v2.0.0-stable` → @26 (unchanged)
- Task 0363 (`docs/tasks/queue/0363-v21-stable-tag.md`): superseded by 0367, confirmed in current-state.md
- Rollback table in current-state.md updated with V2.1.1 row
