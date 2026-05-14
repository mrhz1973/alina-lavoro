# Prompt Routing — LLM Wiki V3.1

**Status:** active routing rule

## Purpose

Reduce repeated boilerplate in implementer prompts and prevent stale-state propagation.

Use **Context Router + Template Pack + Task Delta** instead of long monolithic prompts whenever the required rules already exist in the repository.

## Routing order

1. Run `docs/wiki/task-id-preflight.md`.
2. Read `docs/LLMS.md`.
3. Read `docs/wiki/current-state.md`.
4. Read `docs/wiki/token-efficiency.md`.
5. Select only the templates needed from `docs/tasks/templates/`.
6. Add only the task-specific delta and fresh facts not yet in GitHub.

## Prompt shape

```text
@docs/roadmap.md
@AGENTS.md
@docs/wiki/task-id-preflight.md
@docs/wiki/prompt-routing.md
@docs/tasks/templates/implementer-standard.md
@docs/tasks/templates/<task-type>.md
@docs/tasks/templates/final-report-contract.md

TASK DELTA:
- Verified Last completed: XXXX
- Task ID: XXXX
- Goal: ...
- Allowed paths: ...
- Forbidden paths: ...
- Runtime: forbidden / gated
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

## Size and subtraction rules

- Prompts over ~80–100 lines must be justified or trimmed.
- Do not repeat git/security/final-report boilerplate already covered by templates.
- For new guidance docs, apply the New-doc gate in `docs/wiki/token-efficiency.md` (canonical home).

## Non-goals

- Do not hide runtime risk behind short prompts.
- Do not bypass INBOX decisions.
- Do not write to INBOX unless a real decision/gate exists.
- Do not create policy around policy.
