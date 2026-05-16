# Alina Lavoro — Checkpoint (ripartenza)

Ultimo aggiornamento: 2026-05-16 (task 0404) — V2.2.0 patched source deployed @33. Patch batch 0399–0403 live. Session: `docs/sessions/2026-05-16-v220-patched-source-deploy.md`. Canonical Level-2 memory is `docs/LLMS.md` + `docs/wiki/current-state.md`; entries below preserved from 2026-05-13 compression and superseded by the wiki for state-reading.

## Latest Completed Useful Tasks

- **0404** — V2.2.0 patched source deploy (deploy, 2026-05-16)
- **0403** — V2.2.0 frontend fix + UI polish (frontend-only patch, 2026-05-16)
- **0402** — V2.2.0 design token polish pass 1 (frontend-only, 2026-05-16)
- **0401** — V2.2.0 startup boot placeholder (frontend-only, 2026-05-16)
- **0400** — V2.2.0 month detail day-label + today-badge fix (frontend-only, 2026-05-16)
- **0399** — V2.2.0 blank-screen-on-resume fix (frontend-only, 2026-05-16)
- **0390** — V2.2.0 deploy @31 (deploy, 2026-05-16)
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

- **App:** V2.2.0 patched deployed @33 (2026-05-16); patch batch 0399–0403 live; last stable tag is still `v2.1.1-stable` (v2.2.0-stable pending user test)
- **Earlier baseline (pre-V2.0):** V1.9.2 on main, tag v1.9.2-stable, deploy @24
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
