# Windows Ollama Local Preflight Task Created

**Date:** 2026-05-13  
**Task:** 0134-windows-ollama-local-preflight  
**Type:** runtime-gated-preflight (docs-only preparation)  
**Status:** queued  
**Implementer:** Windsurf / Cascade

---

## Summary

Created docs-only preparation task for Windows Ollama Local Preflight. This task is explicitly marked as runtime-gated and does NOT authorize any runtime execution. The future runtime preflight requires an explicit manual gate from the user before any Ollama installation, model download, or execution.

---

## Files Created

- `docs/tasks/queue/0134-windows-ollama-local-preflight.md` — Complete task file with:
  - Metadata (type: runtime-gated-preflight, scope: local-ai/low-touch/no-api)
  - No-API default architecture policy statement
  - Objective and non-goals
  - Required preflight checklist (future runtime execution)
  - Safety gates
  - Forbidden actions
  - Expected final report for future runtime execution
  - Success criteria
  - Failure criteria
  - Rollback/cleanup note
  - Explicit statement that this queued task does not authorize runtime execution

---

## Files Modified

- `docs/roadmap.md` — Updated to reflect task 0134 is now queued (docs-only preparation completed)
- `docs/LLMS.md` — Updated task state to reflect task 0134 is queued
- `docs/wiki/current-state.md` — Updated task state to reflect task 0134 is queued

---

## Key Policy Statements Included

The task file explicitly includes the No-API default architecture policy:

> No provider APIs are part of the default architecture. ChatGPT means ChatGPT web/on-demand orchestration, not OpenAI API. Claude Code means supervised Claude Code usage, not Anthropic API. Local AI means Ollama/local models. Any provider API, API key, hosted AI call, billing setup, or recurring cost requires an explicit future manual gate and is out of scope by default.

---

## Target Machine

- **OS:** Windows
- **CPU:** AMD Ryzen 9 3900X
- **RAM:** 32 GB
- **GPU:** NVIDIA RTX 3060 12 GB VRAM

---

## Future Runtime Preflight Scope

The future runtime preflight (when explicitly gated) will include:

1. Confirm Windows workstation specs
2. Confirm NVIDIA driver / CUDA availability
3. Confirm Ollama not installed or installed state
4. Install Ollama (only after explicit manual gate)
5. Pull one small local model (only after explicit manual gate)
   - Preferred: Qwen 2.5 7B or equivalent current local 7B class model
   - Alternative: Qwen 3 8B if already considered appropriate by existing docs
6. Run a tiny local classification prompt
7. Verify no API calls
8. Verify no cloud billing
9. Verify no n8n provider API node
10. Verify no sensitive data in prompt
11. Document hardware/latency/quality result
12. Stop if performance, safety, or quality is poor

---

## What This Task Does NOT Authorize

This docs-only preparation task does NOT authorize:

- Ollama installation
- Model download
- Model execution
- Any runtime changes
- Any service startup
- Any n8n runtime modifications
- Any API configuration
- Any API key creation
- Any provider API usage
- Any billing setup
- Any recurring cost creation

The future runtime preflight execution requires an **explicit future manual gate** from the user.

---

## Validation

- ✅ Branch confirmed as main
- ✅ Workspace status checked (dirty with line ending changes only, safe to proceed)
- ✅ Mandatory files read (LLMS.md, wiki files, ORCHESTRATOR_RULES.md, AI_RULES.md, WORKFLOW.md, COMMANDS.md, ollama-classifier-planner-feasibility-post-wiki.md, autonomous-low-touch-loop-design.md, auto-aggio-design.md)
- ✅ Task file created with complete metadata and policy statements
- ✅ No-API default architecture policy included
- ✅ Explicit statement that runtime execution is gated
- ✅ No runtime/app/deploy/tag/rollback/dependency files touched
- ✅ No provider API / API key / billing / recurring cost introduced

---

## Next Steps

The task is now queued in `docs/tasks/queue/0134-windows-ollama-local-preflight.md`. The user must explicitly open the gate for runtime execution when ready to proceed with the actual preflight on the Windows workstation.

---

**Session completed — task queued, runtime execution requires explicit manual gate**
