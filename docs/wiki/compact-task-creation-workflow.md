# Compact Task Creation Workflow — LLM Wiki V3.1

**Task:** 0236 (introduced)
**Date:** 2026-05-14
**Type:** workflow / orchestration guide
**Status:** active rule

## Purpose

Define how the orchestrator creates future tasks using V3.1 templates without monolithic prompts, without unnecessary confirmations, and without default reads of PROJECT_STATE.md or CHECKPOINT.md.

---

## Step 1 — Task-ID preflight (mandatory)

Before assigning any task ID:

1. Read `docs/LLMS.md` → extract `Last completed`.
2. Use `Last completed + 1` as the next ID (unless that ID already exists in `docs/tasks/done/`).
3. If the proposed ID ≤ Last completed → stop.
4. If the proposed ID already exists in `docs/tasks/done/` → stop.

---

## Step 2 — Choose batch vs single task

### When to batch

Create a coherent batch when:

- All sub-tasks are docs-only and no real decision is pending between them.
- The sub-tasks are a natural sequence (e.g. create design doc → update state docs).
- No runtime, VPS, n8n UI, Telegram, Schedule, or user manual action is needed in any sub-task.
- No Decision Packet is required between sub-tasks (gate appears → stop and open DP instead).

### When to create a single task

Create a single task when:

- The sub-task touches runtime, n8n UI, a manual user action, or a sensitive gate.
- The outcome of step N is needed to decide step N+1.
- A real decision is pending (pending DP → wait for user response before next task).

### Batch size limits (maximum, not target)

| Batch type | Max sub-tasks |
|---|---|
| docs-only pure | 6 |
| docs + Decision Packet | 5 |
| docs + small technical design | 4 |
| runtime / n8n UI / credentials / Telegram / Schedule / app / deploy / tag / rollback | **1 step only** |

Do not invent work to fill a batch. Split if ambiguous. If any sub-task touches runtime or secrets, that portion is single-step and separately gated.

---

## Step 3 — No unnecessary confirmations

**Rule:** if there is no real decision and the next step is a determined docs-only continuation, batch the coherent sub-tasks instead of asking confirmation.

- Do not ask «vuoi?», «procedo?», «vai?», «andiamo avanti?» for determined docs-only work.
- Do not transform into a decision what is already decided by the roadmap, queue task, or prior orchestrator output.
- The absence of a real choice = operational consent to proceed.

**Asking unnecessary confirmations is an operational error.**

Gate that always require explicit user decision:
runtime · VPS runtime · n8n runtime · Alina app changes · deploy Apps Script · tag · rollback · API key · login · GitHub Actions · new recurring costs · automatic runner · sensitive data / credentials / secrets / OAuth · real physical test

---

## Step 4 — Compose the task delta

Use the minimum delta for each task. Do not repeat boilerplate already in templates.

```text
@docs/wiki/task-id-preflight.md
@docs/tasks/templates/implementer-standard.md
@docs/tasks/templates/<task-type>.md
@docs/tasks/templates/final-report-contract.md

TASK DELTA:

Repository: mrhz1973/alina-lavoro
Task: XXXX
Verified Last completed: XXXX

Goal:
<one sentence>

Allowed paths:
- docs/ only (or specific files)

Expected result:
- <file A> created/updated
- docs/tasks/done/XXXX-<slug>.md created
- docs/sessions/YYYY-MM-DD-<slug>.md created
- docs/LLMS.md and docs/wiki/current-state.md: Last completed = XXXX

No runtime. No src/. No deploy/tag/rollback. No secrets.
```

If the batch contains multiple task IDs, include all task IDs and expected files in the delta.

---

## Step 5 — Runtime / manual action = one step only

If the task involves runtime, n8n UI, or a manual user action in n8n/VPS/browser/terminal/Apps Script:

- Provide one step only.
- Wait for the user's outcome before the next step.
- Do not anticipate subsequent steps while a manual action is open.
- If the user confirms, provide the next single step.

---

## Step 6 — INBOX rule

Do not write to `docs/INBOX.md` unless a real human decision is required.

A real decision means: two or more non-equivalent options, and the user must choose before the work can continue. Docs-only continuation does not qualify.

---

## Step 7 — Close with commit and push

Every task batch closes with:

- selective `git add <files>` (never `git add .`);
- `git commit -m "<message>"`;
- `git push origin main`;
- final report per `docs/tasks/templates/final-report-contract.md`.

---

## Quick reference: task type → template

| Work type | Template |
|---|---|
| Docs-only | `docs/tasks/templates/docs-only-task.md` |
| Runtime-gated | `docs/tasks/templates/runtime-gated-task.md` |
| INBOX decision recording | `docs/tasks/templates/inbox-decision-recording.md` |
| n8n JSON/template work | `docs/tasks/templates/n8n-template-first-task.md` |
| n8n supervised cleanup | `docs/tasks/templates/n8n-ui-supervised-cleanup.md` |
| State update batch | `docs/tasks/templates/state-update-batch.md` |
| Final report | `docs/tasks/templates/final-report-contract.md` |

---

## Related documents

- `docs/wiki/task-id-preflight.md` — task-ID guard
- `docs/wiki/prompt-routing.md` — context router
- `docs/wiki/context-budget-policy.md` — budget policy
- `docs/wiki/multi-step-batch-planning-rules.md` — batch planning rules
- `docs/wiki/v31-enforcement-checklist.md` — Prompt Size Guard (apply if prompt >~80–100 lines)
- `docs/wiki/examples/delta-based-prompt-example.md` — example prompts
- `docs/wiki/examples/v31-compact-workflow-cookbook.md` — practical cookbook
