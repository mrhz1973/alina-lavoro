---
- Project: Alina Lavoro
- Type: deploy fix
- Status: done
- Deploy: yes (@48 in-place)
---

# Task 0421 — Live build mismatch fix (Build 0420)

## Done status

- Completed by: Claude Code (task 0421, 2026-05-17)
- Deploy: @48 (in-place, URL unchanged, ID: AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ)
- Session: docs/sessions/2026-05-17-live-build-mismatch-0421.md
- APP_BUILD: '0420'

## Evidence

- Source: `APP_BUILD='0420'` in both `src/frontend/Index.html` and `.gas/Index.html` ✓
- `clasp push`: "Skipping push" (code already in Apps Script HEAD) ✓
- `clasp deploy --deploymentId` → `@48` (created new version, same URL) ✓
- `clasp deployments` confirms: `@48 - V2.2.0 build 0420 fix redeploy` ✓

## Root cause

Task 0420 deployed @47 but the live endpoint served Build 0419. Likely: the `clasp deploy --deploymentId` in task 0420 created version @47 from a prior HEAD state or the version pointer was stale. Re-running the in-place deploy with the explicit deployment ID created @48 and updated the live endpoint.

## Pending after close

- 0391: post-deploy phone test for @48
- 0392: stable tag after test pass
