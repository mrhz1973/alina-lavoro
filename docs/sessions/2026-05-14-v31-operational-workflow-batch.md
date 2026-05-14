# Session — V3.1 Operational Workflow Batch (0236–0240)

**Date:** 2026-05-14
**Tasks:** 0236–0240
**Type:** docs-only batch
**Branch:** main
**Implementer:** Claude Code (local)

## Summary

Batch 0236–0240 operationalizes LLM Wiki V3.1 by adding the workflow layer that turns "templates exist" into a practical compact orchestration workflow.

## Files created

| File | Task |
|---|---|
| `docs/wiki/compact-task-creation-workflow.md` | 0236 |
| `docs/wiki/compact-implementer-prompt-workflow.md` | 0237 |
| `docs/wiki/multi-step-batch-planning-rules.md` | 0238 |
| `docs/wiki/examples/v31-compact-workflow-cookbook.md` | 0239 |
| `docs/tasks/done/0236-create-v31-compact-task-creation-workflow.md` | 0236 |
| `docs/tasks/done/0237-create-v31-compact-implementer-prompt-workflow.md` | 0237 |
| `docs/tasks/done/0238-create-v31-multi-step-batch-planning-rules.md` | 0238 |
| `docs/tasks/done/0239-create-v31-compact-workflow-cookbook.md` | 0239 |
| `docs/tasks/done/0240-update-state-after-v31-operational-workflow-batch.md` | 0240 |
| `docs/sessions/2026-05-14-v31-operational-workflow-batch.md` | 0240 (this file) |

## Files updated

| File | Change |
|---|---|
| `docs/LLMS.md` | Last completed = 0240; new wiki files in LLM Wiki row |
| `docs/wiki/current-state.md` | Last completed = 0240 |
| `docs/wiki/token-efficiency.md` | Navigation rows added for new wiki files |
| `docs/wiki/template-pack-index.md` | Note added about compact workflow docs |
| `docs/wiki/prompt-routing.md` | Step 3 and routing note updated |
| `docs/roadmap.md` | Compact note added in automation section |

## What was built

**0236 — Compact task creation workflow**
Defines how the orchestrator creates future tasks: task-ID preflight, batch vs single task decision, no-confirmations rule (PRIORITY 0A), TASK DELTA format, runtime one-step rule, INBOX discipline.

**0237 — Compact implementer prompt workflow**
Defines compact prompt shape and TASK DELTA format for implementers. Required @ references, template selection guide, fresh-facts handling, when full prompts are still allowed, Claude Code / Windsurf / Cursor notes.

**0238 — Multi-step batch planning rules**
Formalizes that determined docs-only continuations should use coherent batches. Documents conditions for batching, batch size limits, anti-patterns (splitting determined work into confirmation loops), conditional-decision-as-sequence rule, and DP gate rule.

**0239 — Compact workflow cookbook**
Practical 7-example reference: docs-only state update, INBOX decision recording, n8n template-first task, n8n UI supervised cleanup, post-runtime recording, multi-step batch, and bad vs good V3.1 prompt comparison.

**0240 — State update**
State docs updated to Last completed = 0240. LLM Wiki V3.1 is now fully operational with workflow layer.

## Runtime actions

None. Docs-only batch.
No n8n UI. No workflow Execute. No Telegram send. No Schedule change.
No app source changes. No deploy/tag/rollback. No provider API LLM. No new billing. No secrets.

## LLM Wiki V3.1 — final component list after this batch

| Component | File |
|---|---|
| Task-ID Guard | `docs/wiki/task-id-preflight.md` |
| Prompt Routing | `docs/wiki/prompt-routing.md` |
| Context Budget Policy | `docs/wiki/context-budget-policy.md` |
| Template Pack Index | `docs/wiki/template-pack-index.md` |
| Delta-based prompt example | `docs/wiki/examples/delta-based-prompt-example.md` |
| Compact task creation workflow | `docs/wiki/compact-task-creation-workflow.md` |
| Compact implementer prompt workflow | `docs/wiki/compact-implementer-prompt-workflow.md` |
| Multi-step batch planning rules | `docs/wiki/multi-step-batch-planning-rules.md` |
| Compact workflow cookbook | `docs/wiki/examples/v31-compact-workflow-cookbook.md` |

## Telegram Mode A

Remains active — scheduled notification-only, `TEST - Alina task completion Telegram notifier`, every 5 minutes. Not touched by this batch.

## INBOX

0 pending. 20 decided. No new DP introduced.
