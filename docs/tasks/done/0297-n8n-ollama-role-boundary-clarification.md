# Task 0297 — n8n / Ollama Role Boundary Clarification

- Project: Alina Lavoro
- Type: docs-only
- Priority: normal
- Deploy: no

## Goal

Clarify in the dual CLI design that n8n and Ollama/Qwen are coordination/classification layers, not decision-makers.

## Done status

- Completed by: Claude Code (supervised implementer)
- Completion date: 2026-05-15
- Completion commit: (see push below)
- Session: `docs/sessions/2026-05-15-n8n-ollama-role-boundary-clarification.md`

## Result

§14 added to `docs/automation/dual-cli-orchestrator-lite-design.md`:
- n8n: queue/scheduler/postman — cannot approve gates
- Ollama/Qwen: router/classifier — cannot authorize runtime/sensitive actions
- User: sole gate authority
- ChatGPT-web: high-level supervisor for complex decisions
- Pipeline position reminder

No n8n files touched. No runtime. Dual CLI remains LATER/GATED.
