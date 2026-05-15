# Session — 0291 Cursor CLI Local Capability Verification

**Date:** 2026-05-15
**Task:** 0291-cursor-cli-local-capability-verification
**Branch:** main
**Repository:** mrhz1973/alina-lavoro
**Type:** docs-only capability probe

---

## Commands used

```
where cursor        → C:\Program Files\cursor\resources\app\bin\cursor (and .cmd)
where Cursor        → same paths
where cursor-agent  → not found
cursor --version    → 3.3.30
cursor --help       → standard editor flags + "agent" subcommand listed
cursor agent --help → returns generic editor help (no agent-specific flags documented)
```

## Findings

| Check | Result |
|---|---|
| Binary present | **Yes** — `C:\Program Files\cursor\resources\app\bin\cursor` (and `.cmd`) |
| Version | **3.3.30** |
| `agent` subcommand | **Present** — listed in help as "Start the Cursor agent in your terminal" |
| Headless / batch mode | **Not confirmed** — `cursor agent` is interactive terminal mode |
| Suitable for unattended automation | **No** — interactive-only; no headless/batch flags observed |

## Capability verdict

**Partially present / interactive-only.** Cursor CLI binary exists and returns a version. It has an `agent` subcommand that starts an interactive terminal agent. No headless, no-input, batch, or force-mode flags were observed. Cursor is not suitable for unattended runtime automation as-is. The `agent` mode requires user interaction.

Status for §1b: **Unverified for runtime automation** (CLI present but interactive-only; headless capability not confirmed).

## Files modified

- `docs/automation/dual-cli-orchestrator-lite-design.md` — §1b Cursor row updated (see task notes; actual update done in task 0294 matrix consolidation)
- `docs/sessions/2026-05-15-cursor-cli-local-capability-verification.md` — this file
- `docs/tasks/done/0291-cursor-cli-local-capability-verification.md` — done marker

## Checks run

- `where`, `--version`, `--help` only (non-mutating local commands)
- No Cursor task launched
- No files modified by Cursor

## No runtime / no app / no secrets

- No n8n, no workflow Execute, no Schedule change
- No Telegram send
- No app source changes (`src/**`)
- No deploy, tag, rollback
- No provider API, billing, secrets, OAuth material

## Residual risks

None. Capability probe only; no changes to tooling or automation state.

## Next micro-step

Task 0292 — Windsurf/Cascade CLI local capability verification.
