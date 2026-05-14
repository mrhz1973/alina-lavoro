# AGENTS.md — Alina Lavoro Agent Entry Point

This file is pointer-only. Do not duplicate project rules here.
For full state, read `docs/LLMS.md`.

---

## Read first (mandatory order)

1. `docs/LLMS.md` — compact state + task info (≤150 lines)
2. `docs/wiki/current-state.md` — state snapshot (≤100 lines)
3. `docs/wiki/token-efficiency.md` — navigation rules and what NOT to read

## For task routing

- `docs/wiki/task-id-preflight.md` — run before assigning any task ID
- `docs/wiki/prompt-routing.md` — template selection table + Prompt Size Guard + Docs ROI Gate
- `docs/wiki/template-pack-index.md` — all available implementer templates

## Local clone preflight

`docs/tasks/templates/implementer-standard.md` § Local clone preflight · `docs/COMMANDS.md` § Mandatory local preflight

## Use templates

`docs/tasks/templates/` — implementer-standard, docs-only-task, state-update-batch, runtime-gated-task, final-report-contract, and others

## Do NOT read by default

- `docs/PROJECT_STATE.md` — fallback/audit only; justify in final report if opened
- `docs/CHECKPOINT.md` — restart context only; justify in final report if opened

## Hard gate reminder

No runtime, n8n UI, workflow Execute, Schedule change, Telegram send, deploy, tag, rollback, provider API, billing, secrets, or app source changes (`src/**`) without an explicit gate.

## Batch reminder

Docs-only coherent work: prefer batches of 6–8 sub-tasks when safe and meaningful. Do not invent tasks to fill a batch. Runtime / manual UI: one step at a time.

## Canonical rules

`docs/ORCHESTRATOR_RULES.md` · `docs/AI_RULES.md` · `docs/WORKFLOW.md`
