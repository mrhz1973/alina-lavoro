# Session — 0295 Dual CLI Task Packet Contract

**Date:** 2026-05-15
**Task:** 0295-dual-cli-task-packet-contract
**Branch:** main
**Repository:** mrhz1973/alina-lavoro
**Type:** docs-only design

---

## Summary

Added §12 "Task Packet contract" to `docs/automation/dual-cli-orchestrator-lite-design.md`.

The section defines the minimum 10-field shape of a Task Packet:
`task_id`, `goal`, `expected_previous_state`, `allowed_paths`, `forbidden_paths`, `runtime_gate_status`, `required_reads`, `stop_conditions`, `expected_outputs`, `final_report_paths`.

Design-only. Actual packet files, queues, and runners remain future/gated.

## Files modified

- `docs/automation/dual-cli-orchestrator-lite-design.md` — §12 added
- `docs/sessions/2026-05-15-dual-cli-task-packet-contract.md` — this file
- `docs/tasks/done/0295-dual-cli-task-packet-contract.md` — done marker

## No runtime / no app / no secrets

- No n8n, no workflow Execute, no Schedule change
- No Telegram send, no deploy, no tag, no rollback
- No provider API, billing, secrets, OAuth material

## Residual risks

None. Documentation update only.
