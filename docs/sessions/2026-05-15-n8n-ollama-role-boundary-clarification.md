# Session — 0297 n8n / Ollama Role Boundary Clarification

**Date:** 2026-05-15
**Task:** 0297-n8n-ollama-role-boundary-clarification
**Branch:** main
**Repository:** mrhz1973/alina-lavoro
**Type:** docs-only

---

## Summary

Added §14 "n8n and Ollama role boundaries" to `docs/automation/dual-cli-orchestrator-lite-design.md`.

Key clarifications recorded:
- n8n = queue/scheduler/postman/supervised coordinator; cannot approve human gates
- Ollama/Qwen = router/classifier/risk scorer/prompt compressor; cannot authorize runtime or sensitive actions
- User remains sole gate authority for all sensitive actions
- ChatGPT-web is high-level supervisor for complex decisions
- Pipeline position reminder included

## Files modified

- `docs/automation/dual-cli-orchestrator-lite-design.md` — §14 added
- `docs/sessions/2026-05-15-n8n-ollama-role-boundary-clarification.md` — this file
- `docs/tasks/done/0297-n8n-ollama-role-boundary-clarification.md` — done marker

## No runtime / no app / no secrets

- No n8n, no workflow Execute, no Schedule change
- No Telegram send, no deploy, no tag, no rollback
- No provider API, billing, secrets, OAuth material

## Residual risks

None. Documentation update only.
