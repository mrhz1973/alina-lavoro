# Session — V3.1 Enforcement and Future Optimization Backlog

**Date:** 2026-05-14  
**Batch:** 0254–0258  
**Type:** docs-only  
**Implementer:** Claude Code (local)

---

## Why V3.1 enforcement was added

LLM Wiki V3.1 was operational since task 0232 (2026-05-14), but there was no explicit rule preventing future prompts from regressing to the monolithic pattern. Without a mandatory checklist, a future orchestrator or implementer session could drift back to 200-line prompts that repeat boilerplate already covered by the template pack.

The V3.1 Enforcement Checklist (`docs/wiki/v31-enforcement-checklist.md`) makes the compact prompt pattern the enforced default, not just a recommendation.

---

## Why a prompt-size guard is needed

The template pack and delta-based pattern reduce prompt size from ~200+ lines to ~15–25 lines for ordinary docs-only tasks. However, no explicit "stop and check" rule existed for prompts that grew beyond ~80–100 lines.

The Prompt Size Guard provides a concrete checklist: if a prompt is too long, it must pass the guard before being sent. The guard identifies exactly which categories of content can be removed (git workflow, security rules, history, bilingual blocks, PROJECT_STATE.md / CHECKPOINT.md content) versus which are justified exceptions (fresh runtime evidence, unusual risk).

---

## Why no new runtime, tool, or workstream was opened

Telegram Mode A is stable-after-fix and in routine-check posture. The correct next step is low-cost docs-only work that reduces future wasted effort, not opening new runtime workstreams.

Opening a new CLI tool, runtime gate, or external service integration would add complexity without a clear immediate return. The V3.1 enforcement work has direct ROI: every future prompt that avoids monolithic format saves context tokens and reduces session errors.

---

## Why CLI Printing Press is future/low-priority only

The concept is sound but premature. V3.1 enforcement must be in place first so the template pack is stable and well-tested. Then, if a CLI generator would materially reduce orchestrator burden, it can be considered in a future explicit gate with proper constraints.

Creating the CLI now would add a new tool dependency, test surface, and potential drift from the template pack as it evolves. The idea is preserved in `docs/automation/future-cli-printing-press-idea.md` with mandatory constraints.

---

## Why AGENTS.md was not created now

AGENTS.md (a pointer-only file for AI agents in the repository root) would be useful for some CI/CD and AI tool conventions, but it is not an urgent need. LLMS.md already serves as the entry point for all agents in this project.

If AGENTS.md is created in a future explicit task, it must be pointer-only (~30–40 lines), must not duplicate LLMS.md or canonical rules, and must be created via an explicit task, not implicitly.

---

## Files created

- `docs/wiki/v31-enforcement-checklist.md` (task 0254)
- `docs/tasks/done/0254-create-v31-enforcement-prompt-size-guard.md`
- `docs/tasks/done/0255-update-v31-routing-token-efficiency-enforcement.md`
- `docs/automation/future-cli-printing-press-idea.md` (task 0256/0257)
- `docs/tasks/done/0256-record-agents-pointer-only-and-repo-hygiene-deferred-rules.md`
- `docs/tasks/done/0257-record-cli-printing-press-future-low-priority-idea.md`
- `docs/tasks/done/0258-update-state-after-v31-enforcement-and-future-optimization-backlog.md`
- `docs/sessions/2026-05-14-v31-enforcement-and-future-optimization-backlog.md` (this file)

## Files updated

- `docs/wiki/token-efficiency.md` — navigation row for enforcement checklist
- `docs/wiki/prompt-routing.md` — enforcement checklist pointer
- `docs/wiki/context-budget-policy.md` — enforcement checklist reference
- `docs/wiki/template-pack-index.md` — enforcement checklist in companion docs
- `docs/wiki/compact-implementer-prompt-workflow.md` — Prompt Size Guard reference
- `docs/wiki/compact-task-creation-workflow.md` — enforcement checklist reference
- `docs/LLMS.md` — Last completed = 0258
- `docs/wiki/current-state.md` — Last completed = 0258
- `docs/roadmap.md` — compact batch note

---

## Confirmations

- No runtime: ✅
- No n8n UI: ✅
- No workflow Execute: ✅
- No Schedule change: ✅
- No Telegram send: ✅
- No app source changes: ✅
- No deploy/tag/rollback: ✅
- No provider API LLM: ✅
- No new billing: ✅
- No token/chat_id/secrets recorded: ✅
