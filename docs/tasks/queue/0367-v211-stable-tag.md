# Task 0367 — V2.1.1 Stable Tag

- Project: Alina Lavoro
- Type: release / docs
- Priority: high
- Deploy policy: no (tag only)
- Status: queued
- Gate: MANUAL — requires task 0366 post-deploy test OK

## Objective

Create stable tag `v2.1.1-stable` on main after V2.1.1 post-deploy test is confirmed OK.

## Prerequisites

- Task 0366 post-deploy manual test: PASS
- No regression reported

## Steps

1. Confirm task 0366 result is OK.
2. `git tag v2.1.1-stable`
3. `git push origin v2.1.1-stable`
4. Update docs/LLMS.md and docs/wiki/current-state.md with tag.
5. Create done marker docs/tasks/done/0367-v211-stable-tag.md.
6. Commit + push.

## Do not execute before 0366 result is confirmed.
