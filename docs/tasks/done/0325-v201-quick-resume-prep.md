# Task 0325 — V2.0.1 Quick Resume Prep

- Project: Alina Lavoro
- Type: app-finalization / UX
- Priority: normal
- Deploy policy: no (source prep only)

## Objective

Implement quick resume from local cache so startup feels faster when a saved access code + matching cached session exist. No removal of login mechanism.

## Done status

- Completed by: Claude Code (supervised)
- Date: 2026-05-15
- Session: `docs/sessions/2026-05-15-v201-quick-resume-prep.md`
- Files changed:
  - `src/frontend/Index.html` — APP_VERSION 2.0.1; quick resume helpers; DOMContentLoaded updated
  - `package.json` — version 2.0.1
  - `docs/LLMS.md` — state updated to V2.0.1 source prep
  - `docs/wiki/current-state.md` — state updated
  - `docs/roadmap.md` — Stato attuale updated
  - `docs/sessions/2026-05-15-v201-quick-resume-prep.md` — session note
  - `docs/tasks/done/0325-v201-quick-resume-prep.md` — this file
- Source files modified: `src/frontend/Index.html`, `package.json`
- Backend changed: No
- Deploy: No
- Tag: No
- Production: V2.0.0 @26 (unchanged)
- Stable tag: v2.0.0-stable (unchanged)
- Source target: V2.0.1 (awaiting manual test gate + deploy gate)

## Quick resume behavior

- If localStorage has LS_ACCESS + loadCache() returns object with matching accessCode → show app immediately from cache; run server bootstrap silently in background.
- All other startup paths unchanged.
- New helpers: tryQuickResumeFromCache_(), loginBackground_().
