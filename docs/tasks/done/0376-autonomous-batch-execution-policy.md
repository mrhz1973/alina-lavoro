# Task 0376 — Autonomous Batch Execution Policy

- Project: Alina Lavoro
- Type: docs / policy
- Priority: normal
- Deploy policy: no
- Status: done

## Done status

- Completed by: Claude Code (batch 0372–0377, 2026-05-16)
- Added section to docs/COMMANDS.md: "Comandi sicuri — nessuna conferma richiesta"
- Section defines: auto-proceed commands (git status/diff/log, grep, node --check, cp, ls, diff)
- Section defines: always-gate commands (deploy, clasp push/deploy, reset, clean, force push, tag, rollback, secrets)
- Canonical gate rule: docs/ORCHESTRATOR_RULES.md PRIORITÀ 0A
