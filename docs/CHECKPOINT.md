# Alina Lavoro — Checkpoint (ripartenza)

Ultimo aggiornamento: 2026-05-13 — **State compression completed** (docs-only, 2026-05-13): PROJECT_STATE.md and CHECKPOINT.md physically compressed; long historical content moved to `docs/history/PROJECT_LOG.md` (audit-only); files reduced from >47k chars to compact current state; LLMS-first routing preserved; no runtime/app/deploy/tag/rollback changes; session: `docs/sessions/2026-05-13-state-compression-checkpoint-slimming.md`.

## Latest Completed Useful Tasks

- **0117** — Phase 2 watcher/polling MVP completion (docs-only, 2026-05-12)
- **0116** — n8n queue reader scheduled polling validation (n8n runtime, 2026-05-12)
- **0115** — n8n queue reader direct schedule trigger activation (n8n runtime, 2026-05-12)
- **0113** — n8n queue reader sub-workflow trigger validation (n8n runtime, 2026-05-12)
- **0112** — n8n watcher schedule trigger design (docs-only, 2026-05-12)
- **0111** — n8n watcher/runner MVP design (docs-only, 2026-05-12)
- **0110** — VPS n8n bind localhost hardening (VPS runtime, 2026-05-12)
- **0109** — VPS n8n maintenance check (VPS runtime, 2026-05-12)
- **0108** — n8n queue reader has_task:true after skip failed (n8n runtime, 2026-05-12)
- **0107** — n8n queue reader skip failed runtime validation (n8n runtime, 2026-05-12)
- **0106** — n8n queue reader skip failed design (docs-only, 2026-05-12)
- **0105** — CLAUDE.md created (docs-only, 2026-05-12)

## Current Safe Assumptions

- **App stable:** V1.9.2 on main, tag v1.9.2-stable, deploy @24
- **Branch:** main only (dev legacy/inactive)
- **n8n queue reader:** Operational with 5-minute schedule, skip done/processing/failed validated
- **VPS:** Ubuntu 24.04.4 LTS, n8n in Docker, binding 127.0.0.1:5678 hardened
- **LLMS-first routing:** Active - agents must read LLMS.md → wiki/current-state.md → wiki/token-efficiency.md first
- **Workstream:** automation watcher/runner active, app changes suspended

## Next Micro-Step

**Gate 7 → task 0134 Windows Ollama Local Preflight Install (runtime-gated)**
Target: Windows workstation (Ryzen 9 3900X / RTX 3060 12 GB); Mac M2 secondary option.

## Risks/Gates

- Ollama install, embeddings runtime, VPS changes
- n8n runtime modifications
- API key, login, GitHub Actions
- deploy Apps Script, tag, rollback, runner automatico
- app Alina source modifications (`src/**`)

## Files to Read Next

- `docs/automation/runner-phase3-design.md` — Gate questions for orchestrator
- `docs/automation/ollama-classifier-planner-feasibility-post-wiki.md` — Pre-flight requirements
- `docs/tasks/queue/` — Check for new tasks after gate decision

## History Pointer

Long historical content moved to `docs/history/PROJECT_LOG.md` (audit-only, not default read material).
