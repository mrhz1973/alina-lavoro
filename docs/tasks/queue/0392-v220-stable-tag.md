# Task 0392 — V2.2.0 Stable Tag

- Project: Alina Lavoro
- Type: release
- Priority: high
- Deploy: no

## Objective

Create stable tag `v2.2.0-stable` on main after user confirms V2.2.0 test OK.

## Gate

Requires task 0391 (post-deploy test) confirmed by user.

## Command

```bash
git tag v2.2.0-stable
git push origin v2.2.0-stable
```

## After tag

Update docs/LLMS.md and docs/wiki/current-state.md:
- Tag: v2.2.0-stable (created date)
- App scope: V2.2.0 stable · no-login direct start · maintenance-mode
