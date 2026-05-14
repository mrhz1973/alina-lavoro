# Session — AGENTS.md Pointer-Only and 6–8 Batch Priority

**Date:** 2026-05-14  
**Batch:** 0259–0266  
**Type:** docs-only  
**Implementer:** Claude Code (local)

---

## Why AGENTS.md was created pointer-only

AGENTS.md is a well-known convention for AI coding tools (Cursor, Windsurf, etc.) that look for a project entry point in the repository root. It was previously present in this repo with outdated content (referenced non-existent files like `docs/orchestrator/prompt-sequence-gate.md`).

The decision (D-0259-A = 1) was to replace it with a pointer-only version (~38 lines). This version:
- Provides the correct LLMS-first read order for any agent landing in the repo root.
- Points to the V3.1 routing docs and template pack.
- Mentions the Prompt Size Guard.
- States explicitly that PROJECT_STATE.md and CHECKPOINT.md are not default reads.
- Does not duplicate LLMS.md or canonical rules.

---

## Why AGENTS.md must remain compact

AGENTS.md is not a second LLMS.md. If it grows beyond ~40 lines, it begins competing with LLMS.md as the state source, creating two competing memories. The safety contract (task 0264) records that any growth should trigger the Prompt Size Guard.

---

## Why 6–8 docs-only batch priority was propagated project-wide

The previous max was 6. The user established 6–8 as the preferred target for coherent docs-only work. This change:
- Reduces unnecessary mid-batch confirmation requests.
- Reduces session overhead for orchestrators assembling related docs work.
- Is bounded: max 8, not unlimited; only for docs-only coherent work with no real decision pending.

The 6–8 guidance was written into ORCHESTRATOR_RULES.md, AI_RULES.md, WORKFLOW.md, multi-step-batch-planning-rules.md, v31-next-task-selection-rubric.md, v31-enforcement-checklist.md, and compact-task-creation-workflow.md.

---

## Why runtime/manual UI remains one step at a time

Increasing the docs-only batch size does not change the risk profile of runtime operations. n8n UI, Telegram send, Schedule change, deploy, tag, rollback, and manual user actions remain one step only. This is a safety boundary, not a convenience limit.

---

## Why no new runtime or tool workstream was opened

This batch is entirely docs-only. No n8n UI, no Telegram, no Schedule, no app changes, no provider API, no billing. The work is all within the docs/ tree (plus AGENTS.md at root). Telegram Mode A remains monitored in routine-check posture.

---

## Files created

- `AGENTS.md` (replaced)
- `docs/tasks/done/0259-record-d0259a-agents-pointer-only-decision.md`
- `docs/tasks/done/0260-create-agents-md-pointer-only.md`
- `docs/tasks/done/0261-update-v31-routing-after-agents-pointer.md`
- `docs/tasks/done/0262-propagate-six-to-eight-docs-only-batch-priority.md`
- `docs/tasks/done/0263-update-v31-examples-for-batch-priority.md`
- `docs/tasks/done/0264-record-agents-pointer-only-safety-contract.md`
- `docs/tasks/done/0265-record-batch-priority-safety-contract.md`
- `docs/tasks/done/0266-update-state-after-agents-pointer-and-batch-priority.md`
- `docs/sessions/2026-05-14-agents-pointer-and-six-to-eight-batch-priority.md` (this file)

## Files updated

- `docs/INBOX.md` — D-0259-A recorded in Decided
- `docs/ORCHESTRATOR_RULES.md` — batch size policy updated to 8
- `docs/AI_RULES.md` — batch size policy updated to 8
- `docs/WORKFLOW.md` — batch size policy updated to 8
- `docs/wiki/multi-step-batch-planning-rules.md` — batch size limits updated to 8
- `docs/wiki/v31-next-task-selection-rubric.md` — batch table updated to 8
- `docs/wiki/v31-enforcement-checklist.md` — section D updated
- `docs/wiki/compact-task-creation-workflow.md` — batch size table updated to 8
- `docs/wiki/token-efficiency.md` — AGENTS.md row + batch size rule updated
- `docs/wiki/prompt-routing.md` — AGENTS.md pointer note
- `docs/wiki/examples/v31-compact-workflow-cookbook.md` — Example 7 (6–8 batch) added
- `docs/LLMS.md` — Last completed = 0266; INBOX = 21 decided
- `docs/wiki/current-state.md` — Last completed = 0266
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
- No token/chat_id/secrets: ✅
