# V3.1 Enforcement Checklist — Prompt Size Guard

**Task:** 0254 (introduced)
**Date:** 2026-05-14
**Type:** workflow / enforcement rule
**Status:** active rule

## Purpose

Make LLM Wiki V3.1 usage mandatory for future implementer prompts. Prevent regression to monolithic prompts that repeat boilerplate already covered by the template pack.

---

## A. Default implementer prompt pattern

Every future implementer prompt should use this shape:

```text
@docs/roadmap.md
@docs/wiki/task-id-preflight.md
@docs/wiki/prompt-routing.md
@docs/tasks/templates/implementer-standard.md
@docs/tasks/templates/<task-type>.md
@docs/tasks/templates/final-report-contract.md

TASK DELTA:

Repository: mrhz1973/alina-lavoro
Task: XXXX
Verified Last completed: XXXX (from docs/LLMS.md on main)

Goal:
<one sentence>

Allowed paths:
- docs/ only (or specific file list)

Forbidden paths:
- src/**
- gas-current/**
- (any other explicit restriction)

Runtime: forbidden / gated
Secrets: forbidden

Expected result:
- <file A> created/updated: <what changes>
- docs/tasks/done/XXXX-<slug>.md created
- docs/sessions/YYYY-MM-DD-<slug>.md created
- docs/LLMS.md and docs/wiki/current-state.md: Last completed = XXXX
```

Total target: ~15–25 lines. If the prompt reaches 80–100 lines, apply the Prompt Size Guard below.

---

## B. Prompt Size Guard

If a future implementer prompt exceeds ~80–100 lines, apply this checklist before sending:

| Check | Action |
|-------|--------|
| Is it repeating git workflow steps? | Remove — already in `implementer-standard.md` |
| Is it repeating security constraints? | Remove — already in templates |
| Is it repeating the final report format? | Remove — covered by `final-report-contract.md` |
| Does it include PROJECT_STATE.md content? | Remove unless fallback/audit use is explicitly justified |
| Does it include CHECKPOINT.md content? | Remove unless restart context is explicitly required |
| Does it include full INBOX history? | Remove unless the task is about INBOX |
| Does it have duplicated bilingual blocks? | Remove — one language per context |
| Does it paste history from prior prompts? | Remove — templates cover it |
| Does it include unnecessary history or context? | Remove — LLMS.md + wiki covers the state |

After applying the checklist:
- If the prompt is still >100 lines and the extra content cannot be removed: explicitly note why it must stay long (see exceptions below).
- Never silently accept a monolithic prompt without applying this checklist.

---

## C. Long prompt exceptions

A prompt above ~100 lines is allowed only when:

1. Fresh runtime evidence exists only in the current conversation and has not yet been committed to GitHub.
2. No suitable template exists yet for the task type (use the full prompt once, then extract a template afterward).
3. The task is unusually risky and requires explicit one-off constraints not covered by any existing template.

In all other cases: reduce to delta + template references.

---

## D. Batch and routing enforcement

| Rule | Standard |
|------|----------|
| Docs-only coherent work | Batch per `docs/wiki/multi-step-batch-planning-rules.md`; max 6 sub-tasks |
| Runtime/manual UI | One step at a time; wait for outcome |
| INBOX entries | Only for real human decisions with ≥2 non-equivalent options |
| Task-ID guard | Always run before assigning any new task ID |
| Template selection | Use routing table from `docs/wiki/prompt-routing.md` |
| PROJECT_STATE.md | Fallback/audit only; justify in final report if opened |
| CHECKPOINT.md | Restart context only; justify in final report if opened |

---

## E. Regression warning

If a future prompt looks like this, it is a regression:

```text
# LONG SYSTEM PROMPT
## Role
You are ...
## Git workflow
1. git checkout main
2. git pull ...
## Security rules
Never use git add .
...
[150+ lines of boilerplate]
```

Apply this checklist. Remove duplicated content. Reference templates instead.

---

## Related documents

- `docs/wiki/task-id-preflight.md` — task-ID guard
- `docs/wiki/prompt-routing.md` — context router and template selection table
- `docs/wiki/context-budget-policy.md` — budget tiers (minimal / delta / full)
- `docs/wiki/template-pack-index.md` — all available templates
- `docs/wiki/compact-implementer-prompt-workflow.md` — how to write compact prompts
- `docs/wiki/compact-task-creation-workflow.md` — how to create tasks using V3.1
- `docs/wiki/multi-step-batch-planning-rules.md` — when to batch vs single task
- `docs/wiki/examples/delta-based-prompt-example.md` — concrete before/after examples
