# Session — 2026-05-15 — Minimal Branch Policy for Dual CLI (Task 0304)

- Repository: `C:\Users\mrhz\Documents\AI\GitHub\Alina Lavoro\alina-lavoro`
- Branch: `main`
- Task ID: 0304
- Type: docs-only

## Files modified

- `docs/automation/dual-cli-orchestrator-lite-design.md` — added §20 "Minimal branch policy for dual CLI"

## Result

- Current main-only workflow preserved
- Future policy: docs-only on `main`; runtime/high-risk requires dedicated branch or explicit DP
- Branch naming restricted to ASCII (threat T2 mitigation)
- No force-push, no automated merge, no PR opening without explicit user gate
- Branch policy change itself is a sensitive gate

## Constraints honored

- docs-only · no branch created · no PR opened · no workflow change · no runtime

## Next micro-step

Task 0305 — Ollama classifier output contract.
