# Compact Implementer Prompt Workflow — LLM Wiki V3.1

**Task:** 0237 (introduced)
**Date:** 2026-05-14
**Type:** workflow / implementer guide
**Status:** active rule

## Purpose

Define how future implementer prompts are generated using V3.1. Prevent monolithic prompts that repeat boilerplate already in the repository templates.

---

## Recommended compact prompt shape

```text
@docs/roadmap.md
@docs/wiki/task-id-preflight.md
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

Expected result:
- <file A> created/updated: <what changes>
- docs/tasks/done/XXXX-<slug>.md created
- docs/sessions/YYYY-MM-DD-<slug>.md created
- docs/LLMS.md and docs/wiki/current-state.md: Last completed = XXXX

No runtime. No src/. No deploy/tag/rollback. No secrets.
```

Total prompt: ~15–25 lines instead of 200+.

---

## Required @ references (minimum)

Always include:

| Reference | Why |
|---|---|
| `@docs/roadmap.md` | Workstream context — what is the active focus |
| `@docs/wiki/task-id-preflight.md` | Task-ID guard — prevents stale IDs |
| `@docs/tasks/templates/implementer-standard.md` | Role, GitHub-first rules, forbidden actions |
| `@docs/tasks/templates/<task-type>.md` | Task-type-specific contract |
| `@docs/tasks/templates/final-report-contract.md` | Mandatory final report format |

Optional (add only if needed for this task):

| Reference | When to add |
|---|---|
| `@docs/wiki/prompt-routing.md` | When routing logic must be explicitly reviewed |
| `@docs/wiki/context-budget-policy.md` | When a budget decision is part of the task |
| `@docs/INBOX.md` | Only when a real DP response must be recorded |
| `@docs/automation/<design-doc>.md` | Only when the task targets that specific design |

---

## TASK DELTA format

The delta must contain only what is NOT already in the templates:

| Field | Content |
|---|---|
| Repository | `mrhz1973/alina-lavoro` (always explicit) |
| Task | Task ID(s) for this batch |
| Verified Last completed | From `docs/LLMS.md` on `main` — prevents stale state |
| Goal | One sentence per task (or short numbered list for batch) |
| Allowed paths | Explicit list of allowed file paths |
| Expected result | List of files to create/modify and what changes |
| Forbidden | Repeat only task-specific constraints not covered by templates |

Do NOT include in the delta:

| Do not include | Reason |
|---|---|
| Full git workflow steps | Already in `implementer-standard.md` |
| Security constraints | Already in `implementer-standard.md` and task-type template |
| Final report format | Covered by `final-report-contract.md` |
| `@docs/PROJECT_STATE.md` | Fallback only — never default |
| `@docs/CHECKPOINT.md` | Restart context only — never default |
| Repeated boilerplate from prior prompts | Templates cover it |
| Full INBOX history | Only if a new DP is introduced |

---

## How to choose templates

Use the routing table from `docs/wiki/prompt-routing.md`:

| Work type | Template |
|---|---|
| Standard docs-only | `docs/tasks/templates/docs-only-task.md` |
| Runtime-gated task | `docs/tasks/templates/runtime-gated-task.md` |
| INBOX decision recording | `docs/tasks/templates/inbox-decision-recording.md` |
| n8n JSON/template work | `docs/tasks/templates/n8n-template-first-task.md` |
| n8n supervised cleanup | `docs/tasks/templates/n8n-ui-supervised-cleanup.md` |
| State update batch | `docs/tasks/templates/state-update-batch.md` |

For a batch that spans multiple types, include only the templates that apply. Two templates max is typical; three if the batch genuinely spans runtime + docs + DP.

---

## Fresh chat-only facts

If fresh runtime evidence exists only in the current conversation and has not yet been committed to GitHub, include it in the delta under a clearly labeled section:

```text
Fresh facts (not yet on GitHub):
- <fact 1>
- <fact 2>
```

This is the exception that allows a longer delta. Once committed, these facts are no longer "chat-only" and should not be repeated in the next prompt.

---

## When a full prompt is still allowed

Full prompts (200+ lines) are allowed when:

- No repo template covers the required rules (new task type never seen before).
- Fresh runtime evidence in chat must be preserved before documentation catches up.
- The implementer is Cursor or Windsurf/Cascade and the context is complex enough that template references alone are insufficient.

In this case: use the full prompt once, then extract repeated parts into a template afterward.

---

## Implementer-specific notes

### Claude Code

- Compact / delta preferred.
- Claude Code reads GitHub autonomously; long prompts waste session context.
- If the task file already exists in `docs/tasks/queue/`, a minimal prompt is sufficient:

```text
Execute task docs/tasks/queue/<task>.md.
Apply CLAUDE.md, docs/ORCHESTRATOR_RULES.md, docs/AI_RULES.md, docs/WORKFLOW.md, and docs/COMMANDS.md.
Close with selective commit and push per workflow.
```

- Use Sonnet for ordinary tasks. Use Opus only for complex planning or architectural decisions.

### Windsurf / Cascade

- Can be more explicit, but still reference templates rather than repeating their content.
- Include the same @ references plus any doc that Windsurf needs explicitly pointed to.
- Do not omit `final-report-contract.md` — Windsurf does not infer report format automatically.

### Cursor

- Prompt must be fully self-contained inside the block.
- All operational context inside the block; outside only: MODALITÀ line, real decisions, real gates.
- Still use template @ references to reduce repetition.
- Do not repeat security rules, git workflow, or final report format that are already in templates.

---

## Prompt size guard

Before sending any prompt that exceeds ~80–100 lines, apply the enforcement checklist:
→ `docs/wiki/v31-enforcement-checklist.md`

---

## Related documents

- `docs/wiki/task-id-preflight.md`
- `docs/wiki/prompt-routing.md`
- `docs/wiki/context-budget-policy.md`
- `docs/wiki/compact-task-creation-workflow.md`
- `docs/wiki/v31-enforcement-checklist.md`
- `docs/wiki/examples/delta-based-prompt-example.md`
- `docs/wiki/examples/v31-compact-workflow-cookbook.md`
