# Prompt Routing — LLM Wiki V3.1

**Task:** 0232
**Date:** 2026-05-14
**Type:** prompt policy / router
**Status:** active rule

## Purpose

Reduce repeated boilerplate in implementer prompts and prevent stale-state propagation.

Future prompts should use a **Context Router + Template Pack + Task Delta** pattern instead of long monolithic prompts whenever the required rules already exist in the repository.

## Routing order

1. Run `docs/wiki/task-id-preflight.md`.
2. Read `docs/LLMS.md`.
3. Read `docs/wiki/current-state.md`.
4. Read `docs/wiki/token-efficiency.md`.
5. Select the minimum needed templates from `docs/tasks/templates/`.
6. Add only the task-specific delta.
7. Add only task-specific constraints not already covered by templates.

## Prompt shape

Preferred future prompt shape:

```text
@docs/roadmap.md
@docs/wiki/task-id-preflight.md
@docs/tasks/templates/implementer-standard.md
@docs/tasks/templates/<task-type>.md
@docs/tasks/templates/final-report-contract.md

TASK DELTA:
- Verified Last completed: XXXX
- Task ID: XXXX
- Goal: ...
- Runtime: forbidden / gated
- Secrets: forbidden
- Expected result: ...
```

## Router decisions

| Work type | Template |
|---|---|
| Standard docs-only | `docs/tasks/templates/docs-only-task.md` |
| Runtime-gated task | `docs/tasks/templates/runtime-gated-task.md` |
| INBOX decision recording | `docs/tasks/templates/inbox-decision-recording.md` |
| n8n JSON/template work | `docs/tasks/templates/n8n-template-first-task.md` |
| n8n supervised cleanup | `docs/tasks/templates/n8n-ui-supervised-cleanup.md` |
| State update batch | `docs/tasks/templates/state-update-batch.md` |
| Final report | `docs/tasks/templates/final-report-contract.md` |

## Companion workflow documents (batch 0236–0240)

For complete orchestrator guidance on applying this routing:

| Question | Document |
|---|---|
| How to create tasks (task-ID preflight + batch rules)? | `docs/wiki/compact-task-creation-workflow.md` |
| How to write compact implementer prompts? | `docs/wiki/compact-implementer-prompt-workflow.md` |
| When to batch vs single task? | `docs/wiki/multi-step-batch-planning-rules.md` |
| Practical examples for all task types? | `docs/wiki/examples/v31-compact-workflow-cookbook.md` |

## Non-goals

- Do not remove necessary gate details.
- Do not hide runtime risk behind short prompts.
- Do not use templates to bypass INBOX decisions.
- Do not write to INBOX unless a real decision is required.
