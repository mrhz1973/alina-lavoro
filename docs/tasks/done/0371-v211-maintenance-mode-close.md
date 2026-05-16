# Task 0371 — V2.1.1 Maintenance-Mode Close Marker

- Project: Alina Lavoro
- Type: docs / release close
- Priority: normal
- Deploy policy: no
- Status: done

## Objective

Record V2.1.1 release as closed and project in maintenance-mode posture.

## Done status

- Completed by: Claude Code (batch 0366–0371, 2026-05-16)
- V2.1.1 release: CLOSED — deployed @30, tag `v2.1.1-stable`, test OK, gas-current updated, docs consistent
- Posture: maintenance-mode — monitor only; no app work unless user reports issue or explicitly requests
- Telegram Mode A: active scheduled notification-only, stable-after-fix
- INBOX: 0 pending, 21 decided
- Next action: none immediate; queue 0372 for future maintenance/feature review (optional)

## Release summary

| Item | Value |
|---|---|
| Version | V2.1.1 |
| Deploy | @30 (AKfycbyIkaQqS-Dce0tfdxyfjdnEEE_xSb3Ys3KdeGL9xiX652QfgfAFRRBSvmuLXdPqQhaXSg) |
| Tag | `v2.1.1-stable` |
| Test | PASS — "tutto ok 2.1.1" (2026-05-16) |
| Key fix | Quick resume persistence: `tryQuickResumeFromCache_` no longer requires `c.accessCode === savedCode` |
| Key feature | Analytics/charts collapsible card on Mesi (V2.1.0) |
