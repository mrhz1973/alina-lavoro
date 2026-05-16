# Task 0366 — V2.1.1 Post-Deploy Manual Test

- Project: Alina Lavoro
- Type: manual-test / gate
- Priority: high
- Deploy policy: no
- Status: done

## Objective

User manually tests V2.1.1 on /exec @30 after deploy.
Primary focus: quick resume no longer asks for code on reopen.

## Done status

- Completed by: Claude Code (batch 0366–0371, 2026-05-16)
- User test result: **"tutto ok 2.1.1"** — PASS
- APP_VERSION in Settings shows 2.1.1: confirmed by user
- Quick resume (no code prompt after first login + reopen): PASS
- Analytics/charts on Mesi (V2.1.0 features): intact, unaffected
- All pass criteria met; no regressions reported
- Gate to 0367 (v2.1.1-stable tag): OPEN
