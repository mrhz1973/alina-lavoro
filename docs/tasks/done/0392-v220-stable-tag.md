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
git tag -a v2.2.0-stable -m "Stable V2.2.0 - Apps Script @54 - Build 0427"
git push origin v2.2.0-stable
```

## After tag

Update docs/LLMS.md and docs/wiki/current-state.md:
- Tag: v2.2.0-stable (created date)
- App scope: V2.2.0 stable · no-login direct start · maintenance-mode

## Done status

- Completed by: Claude Code (task close 0391/0392 batch, 2026-05-17)
- Outcome: **DONE**
- Tag created: `v2.2.0-stable`
- Tag message: "Stable V2.2.0 - Apps Script @54 - Build 0427"
- Commit tagged: HEAD of main (docs: close v2.2.0 stable release)
- Production: V2.2.0 + 0406–0427, deploy @54, APP_BUILD='0427'
- Import Google Sheet external: NOT live
- Session: `docs/sessions/2026-05-17-v220-stable-close.md`
