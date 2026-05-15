# Task 0293 — Antigravity CLI Local Capability Verification

- Project: Alina Lavoro
- Type: docs-only capability probe
- Priority: normal
- Deploy: no

## Goal

Verify whether Google Antigravity has a usable local CLI or command interface for future tool-agnostic implementer use.

## Done status

- Completed by: Claude Code (supervised implementer)
- Completion date: 2026-05-15
- Completion commit: (see push below)
- Session: `docs/sessions/2026-05-15-antigravity-cli-local-capability-verification.md`

## Result

**Partially confirmed — strongest CLI interface of the three.**

- Binary found: `C:\Users\mrhz\AppData\Local\Programs\Antigravity\bin\antigravity` (v1.107.0)
- `chat` subcommand: `antigravity chat [prompt] --mode agent/ask/edit`
- Stdin support: `echo prompt | antigravity chat -`
- No headless/no-GUI execution confirmed (likely opens UI window)
- No autonomous agent task launched (probe only)

§1b status: **Partially confirmed** (chat CLI present; headless not verified; supervised testing required before runtime use).
Dual CLI remains LATER/GATED.
