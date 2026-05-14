# Session — Anti-Bureaucracy Docs ROI Rule (batch 0267–0272)

**Date:** 2026-05-14
**Tasks:** 0267–0272
**Type:** docs-only batch
**Implementer:** Claude Code (local)

## Goal

Make the anti-bureaucracy rule explicit: every new document must reduce token usage, user time, ambiguity, repeated errors, or manual work. If it only adds another file to read, it is a regression.

## Work performed

### Task 0267 — Core rule anchored
- `docs/ORCHESTRATOR_RULES.md`: Docs ROI Gate compact note added to agent-facing operational summary (after LLM Wiki V3.1 block).

### Task 0268 — V3.1 Enforcement updated
- `docs/wiki/v31-enforcement-checklist.md`: Section F (Docs ROI Gate) added.
  - 5-question gate table (token usage / user time / ambiguity / repeated errors / future manual work).
  - "A new document that only adds another file to read is a regression."
  - "Do not create policy around policy."
  - Permanent constraints table: LLMS.md, PROJECT_STATE.md/CHECKPOINT.md, INBOX, Prompt Size Guard, AGENTS.md, CLI Printing Press, repo hygiene scanner.

### Task 0269 — Task creation and batch rules updated
- `docs/wiki/compact-task-creation-workflow.md`: Docs ROI Gate note added to Step 4 (before task delta template).
- `docs/wiki/multi-step-batch-planning-rules.md`: Anti-pattern row added (creating policy-around-policy doc = regression).
- `docs/wiki/v31-next-task-selection-rubric.md`: "What NOT to do" row added (creating doc without ROI justification).

### Task 0270 — Templates updated
- `docs/tasks/templates/docs-only-task.md`: ROI Gate added to Mandatory preflight.
- `docs/tasks/templates/state-update-batch.md`: Docs ROI Gate section added (standard state targets exempt).

### Task 0271 — Token-efficiency and no-new-tool stance propagated
- `docs/wiki/context-budget-policy.md`: Mandatory reductions bullet added.
- `docs/wiki/prompt-routing.md`: Non-goals entry added.
- `docs/AI_RULES.md`: Docs ROI Gate section added.
- `docs/WORKFLOW.md`: Docs ROI Gate section added.

### Task 0272 — State docs updated
- `docs/LLMS.md`: Last completed = 0272.
- `docs/wiki/current-state.md`: Last completed = 0272.
- `docs/roadmap.md`: Anti-Bureaucracy Docs ROI Rule paragraph added.
- Done markers created: 0267–0272.
- This session note created.

## Checks

- Task-ID preflight: Last completed was 0266; 0267 is next valid ID. ✅
- No src/** changes. ✅
- No n8n runtime. ✅
- No workflow Execute. ✅
- No Schedule change. ✅
- No Telegram send. ✅
- No app source changes. ✅
- No deploy/tag/rollback. ✅
- No provider API LLM. ✅
- No new billing. ✅
- No token/chat_id/secrets. ✅
- AGENTS.md remains pointer-only. ✅
- CLI Printing Press remains future/low-priority only. ✅
- Telegram Mode A remains active stable-after-fix. ✅
- INBOX pending = 0. ✅

## Files modified

Existing docs updated (10):
- `docs/wiki/v31-enforcement-checklist.md`
- `docs/wiki/context-budget-policy.md`
- `docs/wiki/compact-task-creation-workflow.md`
- `docs/wiki/multi-step-batch-planning-rules.md`
- `docs/wiki/v31-next-task-selection-rubric.md`
- `docs/wiki/prompt-routing.md`
- `docs/tasks/templates/docs-only-task.md`
- `docs/tasks/templates/state-update-batch.md`
- `docs/ORCHESTRATOR_RULES.md`
- `docs/AI_RULES.md`
- `docs/WORKFLOW.md`
- `docs/LLMS.md`
- `docs/wiki/current-state.md`
- `docs/roadmap.md`

New files created (7):
- `docs/tasks/done/0267-add-anti-bureaucracy-docs-roi-rule.md`
- `docs/tasks/done/0268-update-v31-enforcement-with-docs-roi-check.md`
- `docs/tasks/done/0269-update-task-creation-and-batch-rules-with-roi-gate.md`
- `docs/tasks/done/0270-update-templates-with-docs-roi-reminder.md`
- `docs/tasks/done/0271-record-no-new-tool-no-runtime-token-efficiency-stance.md`
- `docs/tasks/done/0272-update-state-after-anti-bureaucracy-docs-roi-rule.md`
- `docs/sessions/2026-05-14-anti-bureaucracy-docs-roi-rule.md` (this file)

## Commit hash

See git log after push.
