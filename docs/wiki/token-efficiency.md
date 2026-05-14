# Wiki — Token Efficiency Navigation Guide

Use this guide to read only what is needed. Derived wiki first; canonical docs only when necessary.

---

## Minimum Read Protocol

1. `docs/LLMS.md` — compact entry point; keep below ~150 lines.
2. `docs/wiki/current-state.md` — current snapshot and measurement.
3. `docs/wiki/token-efficiency.md` — this file.
4. Assigned task file, if any.
5. Only task-specific canonical docs/templates.

Do **not** read by default:
- `docs/PROJECT_STATE.md` — fallback/audit only.
- `docs/CHECKPOINT.md` — restart context only.
- `docs/history/PROJECT_LOG.md` — audit only.
- `docs/sessions/*` — only for a specific incident.
- all `docs/automation/*` or all `docs/tasks/done/*`.

If these are opened, justify why in the final report.

---

## Measure-First Rule

Before adding a new guidance doc, measure the cold-start impact:

- mandatory files read;
- approximate line count, or token count if a local counter is available;
- what duplication the new text removes;
- whether an existing doc can be edited instead.

Prefer deletion, shortening, or consolidation over enforcement. A new guidance doc that only adds another file to read is a regression.

---

## Prompt Size Guard

Implementer prompts over ~80–100 lines must be justified or trimmed.

Trim by:
- removing duplicated boilerplate already covered by templates;
- using Template Pack + `TASK DELTA`;
- linking to `docs/tasks/templates/*`;
- moving persistent rules into existing docs only if they reduce future repetition.

Long prompts are allowed only when fresh runtime evidence exists in chat and is not yet in GitHub.

---

## Docs ROI Gate

Create a new document only if at least one applies:

1. reduces token usage;
2. reduces user time;
3. reduces ambiguity;
4. prevents repeated errors;
5. reduces future manual work.

If none apply, update or delete existing material instead.

---

## Decision Packet Discipline

Use Decision Packets only for real human choices or gates:

runtime, n8n UI, workflow import/export/Execute, Schedule, credentials, Telegram send, app changes, deploy, tag, rollback, provider API, billing, secrets, irreversible actions, or non-equivalent strategic options.

Do not use INBOX/DP for routine status, all-green notifications, debug notes, inconclusive retries, or inspection-ok logs unless a real human choice is required. Put those in task/session notes.

---

## V3.1 Routing Map

| Need | Read |
|---|---|
| Current state | `docs/LLMS.md` → `docs/wiki/current-state.md` |
| Task ID guard | `docs/wiki/task-id-preflight.md` |
| Prompt routing | `docs/wiki/prompt-routing.md` |
| Context budget | `docs/wiki/context-budget-policy.md` |
| Template list | `docs/wiki/template-pack-index.md` |
| Practical prompt example | `docs/wiki/examples/delta-based-prompt-example.md` |
| Orchestrator rules | `docs/ORCHESTRATOR_RULES.md` |
| Implementer rules | `docs/AI_RULES.md` |
| Workflow | `docs/WORKFLOW.md` |
| Commands | `docs/COMMANDS.md` |
| Pending decisions | `docs/INBOX.md` — pending section only |
| Roadmap | `docs/roadmap.md` |

---

## Template Use

Default implementer prompt:

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
- Runtime: forbidden / gated
- Expected result: ...
```

Use only the templates needed for the task. Do not include every template by habit.

---

## Language Efficiency

| Context | Language |
|---|---|
| Prompts, JSON/YAML, classifier/planner, wiki agent-facing | Technical English |
| Final summaries to user | Italian |
| Existing canonical docs | Keep current language; do not translate retroactively |

Avoid duplicated bilingual blocks.

---

## Update Protocol

| File | Trigger | Constraint |
|---|---|---|
| `docs/LLMS.md` | every task completion | compact entry point only |
| `docs/wiki/current-state.md` | every task completion | snapshot, not history |
| `docs/wiki/token-efficiency.md` | routing/measurement rule changes | targeted edit only |
| canonical docs | explicit task only | do not edit just to match wiki |

Canonicals win on conflict; update derived wiki to match them.
