# Task 0422 — Live URL Still Serves 0419 — Forensic Audit + Root Cause Fix

- Project: Alina Lavoro
- Type: deploy-fix / forensic-audit
- Priority: urgent
- Status: done
- Deploy policy: yes (corrected clasp push + redeploy)

---

## Objective

Discover and fix why the live Web App URL was serving APP_BUILD='0419' after two previous attempts (task 0420 deploy @47, task 0421 redeploy @48) claimed to have deployed 0420.

---

## Done status

- Completed by: Claude Code (task 0422, 2026-05-17)
- Completion commit: see git log — "fix: forensic audit corrected clasp push — redeploy @49 (build 0420)"
- Session: `docs/sessions/2026-05-17-live-url-still-serves-0419.md`

**Findings:**
- Root cause: `clasp push` (without `--force`) was skipping when clasp thought no diff existed, but the remote had never actually received 0420 content.
- `clasp pull` confirmed remote HEAD had APP_BUILD='0419'.
- Stale `Code.js` artifact (from pull) removed from `.gas/` before push.
- `clasp push --force` succeeded: "Pushed 3 files".
- `clasp deploy --deploymentId` → @49 (same ID/URL).
- Second `clasp pull` verified remote now has APP_BUILD='0420'.

**Deploy result:**
- Apps Script version: @49
- Deployment ID: AKfycbxtG6_wflGYGuqWFjkVsrgGSWlQzcRvuR13VKsgNwsnHXbXSbpgPlS8UMuXDHM8FtHxRQ (unchanged)
- URL: unchanged
- Remote verified: APP_BUILD='0420' ✓
- Live terminal verification: not possible (Google auth required) — pending user phone test

**Gates confirmed:**
- No tag created ✓
- No rollback ✓
- 0391/0392 pending ✓
