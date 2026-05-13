# Cursor CLI Force-Mode Implementer Bridge Design Session

**Date:** 2026-05-13  
**Task:** 0135 — Cursor CLI Force-Mode Implementer Bridge Design  
**Type:** low-touch-loop-docs-only  
**Status:** completed (docs-only design)  
**Implementer:** Windsurf / Cascade

---

## Purpose

Document the completion of the docs-only architecture design for the Cursor CLI force-mode implementer bridge (task 0135). This formalizes the low-touch/no-api/local-first architecture direction chosen by the user.

---

## Why This Architecture Was Formalized

The user explicitly requested formalization of the new low-touch/no-api/local-first architecture direction:

```
GitHub queue → n8n or local script → Ollama qwen3:14b JSON router/classifier/risk scorer/prompt compressor → Cursor CLI / Cursor Agent in FORCE MODE → mandatory dedicated branch → checks → commit + push branch → ChatGPT web post-checks GitHub on demand → user approves merge / rejects / asks cleanup
```

This direction is fundamental for the project. It is not a generic idea or side note. It must become an explicit architecture workstream under automation / watcher / runner / low-touch.

---

## Files Created/Modified

### Created
- `docs/automation/cursor-cli-force-mode-implementer-bridge-design.md` — Canonical design document
- `docs/tasks/done/0135-cursor-cli-force-mode-implementer-bridge-design.md` — Done marker
- `docs/sessions/2026-05-13-cursor-cli-force-mode-implementer-bridge-design.md` — This session report

### Modified
- `docs/roadmap.md` — Added compact entry under Automation / Orchestrator Hub
- `docs/LLMS.md` — Updated task state
- `docs/wiki/current-state.md` — Updated task state

---

## Decision Recorded

### Key Architectural Decisions

1. **Cursor force-mode is the target execution mode**
   - Cursor must modify files directly, not only propose patches
   - Propose-only is acceptable only for debug/fallback

2. **Dedicated branch is mandatory**
   - Pattern: `ai/<task-id>-<slug>`
   - No long-running automatic work directly on main
   - main remains stable operational branch

3. **No automatic merge to main**
   - Merge to main remains human decision
   - Human merge decision only after ChatGPT web post-check

4. **ChatGPT web post-check is explicitly on-demand and no-API**
   - ChatGPT reads GitHub on demand
   - No OpenAI API
   - Post-checks branch, commits, diff, forbidden paths, scope, tests, risks

5. **Ollama qwen3:14b is classifier/router/compressor only, not implementer**
   - Allowed: router, classifier, prompt compressor, task risk scorer, model recommendation, Decision Packet draft helper, LLMS/wiki summarizer
   - Forbidden: shell execution, file modification, deploy, replacing Cursor/Claude/Windsurf, autonomous main implementer, unsupervised runner, source of truth

6. **Cursor CLI API-key/billing requirement is a future gate**
   - If Cursor CLI/headless force mode requires CURSOR_API_KEY, separate API key, new billing, provider API, or recurring cost, STOP the workflow
   - This must be verified in a future runtime-gated Cursor CLI preflight task

---

## Risks

### Identified Risks

| Risk | Mitigation |
|------|------------|
| Cursor CLI requires API key/billing | Future runtime-gated preflight will verify; if required, workflow stops |
| Cursor force-mode modifies forbidden files | Post-check forbidden paths scan; reject branch if violation |
| Cursor commits on main instead of branch | Post-check branch name validation; reject if on main |
| Ollama classification errors | Fallback to manual triage; Ollama is advisory, not authoritative |
| Branch merge conflicts | Manual conflict resolution before merge |
| ChatGPT post-check misses file drift | Manual review by user as final gate |

### What Remains Human

- Merge to main
- Deploy
- Tag
- Rollback
- Runtime
- App source changes
- Provider/API/billing decisions
- Sensitive gates
- Physical tests

---

## Future Gates

### Before Cursor CLI Force-Mode Execution

A separate runtime-gated preflight task is required to verify:
- Cursor CLI force-mode works with existing local login
- No CURSOR_API_KEY is required
- No new billing is introduced
- No provider API is required
- Branch creation, modification, commit, push works
- Force-mode execution on a harmless docs-only task

### Before n8n/Ollama Integration

A separate explicit manual gate is required for:
- n8n runtime modifications
- n8n/Ollama integration
- Any automation that calls Ollama HTTP API from n8n

---

## No Runtime / No API / No Integration Confirmation

This design task is docs-only. No runtime was executed:

- No Cursor CLI executed
- No Ollama executed
- No nvidia-smi executed
- No n8n runtime modified
- No API/provider/billing introduced
- No app source changes
- No deploy/tag/rollback
- No Modelfile/custom model created
- No embeddings/vector DB created
- ZERO API policy remains intact

---

## Roadmap Stages

1. **Docs-only design now** (this task 0135) — ✅ Completed
2. **Cursor CLI force-mode feasibility check, runtime-gated** (future task)
3. **Branch-only dry run with harmless docs-only task** (future task)
4. **ChatGPT web post-check procedure** (future task)
5. **Optional n8n/local script router integration** (future task, runtime-gated)
6. **Optional qwen-alina profile / classifier wrapper design** (future task, docs-only)
7. **No automatic merge until separately authorized** (permanent rule)

---

## Conclusion

The Cursor CLI force-mode implementer bridge design is now documented as the canonical architecture for the low-touch/no-api/local-first implementer bridge. The key architectural decisions are formalized, and the future gates are clearly defined.

**Prossimo passo raccomandato:** Future runtime-gated Cursor CLI force-mode feasibility check (stage 2), or docs-only classifier wrapper/qwen-alina profile design (stage 6), depending on user preference.

---

**Session completed — docs-only design documented, no runtime executed, no integration authorized**
