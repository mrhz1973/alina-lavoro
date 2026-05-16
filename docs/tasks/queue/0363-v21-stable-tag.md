# Task 0363 — V2.1 Stable Tag

- Project: Alina Lavoro
- Type: release / docs
- Priority: high
- Deploy policy: no (tag only)
- Status: queued
- Gate: MANUAL — requires task 0362 post-deploy test OK

## Objective

Create stable tag `v2.1.0-stable` on main after V2.1.0 post-deploy test is confirmed OK.

## Prerequisites

- Task 0362 post-deploy manual test: PASS
- No regression reported

## Steps

1. Confirm task 0362 result is OK.
2. `git tag v2.1.0-stable`
3. `git push origin v2.1.0-stable`
4. Update docs/LLMS.md and docs/wiki/current-state.md with tag.
5. Create done marker docs/tasks/done/0363-v21-stable-tag.md.
6. Commit + push.

## Do not execute before 0362 result is confirmed.
