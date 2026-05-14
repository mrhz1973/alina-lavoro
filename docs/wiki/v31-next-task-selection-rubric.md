# V3.1 Next Task Selection Rubric

**Task:** 0244 (introduced)
**Date:** 2026-05-14
**Type:** workflow / orchestration guide
**Status:** active rule

## Purpose

Define how the orchestrator chooses the next task using V3.1 discipline. Prevents unnecessary INBOX entries, unnecessary confirmations, and missed gates.

---

## Decision tree

### 1. Are there pending INBOX decisions?

Check `docs/INBOX.md` → Pending section.

- **Yes** → surface the pending DP to the user before creating any new task. Do not create a new batch until the DP is decided.
- **No** → proceed to step 2.

---

### 2. Is there a runtime anomaly or monitoring incident?

Check Telegram Mode A status, any open incidents.

- **Yes** → stop new task creation; handle the incident (disable workflow, record incident, await orchestrator decision).
- **No** → proceed to step 3.

---

### 3. Is the next work docs-only with no real decision pending?

- **Yes** → batch coherent sub-tasks up to the policy limit (see below). Do not ask confirmation.
- **No, requires runtime or user manual action** → proceed to step 4.
- **No, a real decision is needed** → proceed to step 5.

**Batch up to limit:**

| Batch type | Max sub-tasks |
|---|---|
| docs-only pure | **8** (prefer 6–8; lower when fewer meaningful units exist) |
| docs + Decision Packet | 5 |
| docs + small technical design | 4 |
| runtime / n8n UI / credentials / Telegram / Schedule / app / deploy / tag / rollback | 1 step only |

---

### 4. Does the next step require runtime or user manual action (n8n UI, VPS, browser, terminal)?

- **Yes** → provide one step only. Wait for the user's outcome. Do not anticipate subsequent steps while the manual action is open.
- After user confirms → re-enter this rubric for the next step.

---

### 5. Does a real decision need to be made?

A real decision means: two or more non-equivalent options exist, and the user must choose before work can continue.

- **Yes** → create a Decision Packet; write it to `docs/INBOX.md` (Pending section). Present the DP to the user. Wait for response.
- **No** → the work is determined; proceed under step 3.

---

### 6. Are state docs stale?

Check `docs/LLMS.md` → Last completed. If the state docs lag behind completed work, a state consolidation batch is appropriate.

- **Stale** → run a state update batch (use `docs/tasks/templates/state-update-batch.md`).
- **Current** → proceed with next content task.

---

### 7. Did the user already give a conditional intent?

If the user previously said «if X succeeds, do Y» and X has now succeeded:

- Encode the continuation as a sequence in the current batch.
- Do not re-ask «shall we do Y?» — the decision was already made.
- If X failed → open a DP or report the failure; do not silently skip Y.

---

## Summary table

| Condition | Action |
|---|---|
| INBOX has pending DP | Surface DP first; no new batch |
| Runtime anomaly / incident | Handle incident; no new task |
| Docs-only, no decision pending | Batch coherent sub-tasks (up to limit); no confirmation needed |
| Runtime / manual user action needed | One step only; wait for outcome |
| Real decision needed (2+ non-equivalent options) | Create DP → write to INBOX → wait |
| State docs stale | State consolidation batch first |
| User gave conditional intent, condition met | Encode as sequence; do not re-confirm |
| No work to do | Report current status; do not invent tasks |

---

## What NOT to do

| Anti-pattern | Why wrong |
|---|---|
| Ask «shall I proceed?» for determined docs-only work | Operational error (PRIORITY 0A) |
| Create an INBOX entry for docs-only continuation | INBOX is for real decisions only |
| Provide multiple runtime steps in one message | Runtime must be one step at a time |
| Skip the pending DP to do docs work first | Pending decisions must be surfaced before new work |
| Invent tasks to fill a batch | Do not pad; batch is a maximum, not a target |
| Re-ask a conditional decision that was already given | If condition met, encode as sequence |
| Open a gate without a real DP and INBOX decision | Anti-creep rule; never from backlog alone |
| Create a new doc without ROI justification | Regression; adds another file to read without reducing token/time/ambiguity/errors/manual work — apply Docs ROI Gate |

---

## Related documents

- `docs/ORCHESTRATOR_RULES.md` — PRIORITY 0A (no unnecessary confirmations)
- `docs/wiki/compact-task-creation-workflow.md`
- `docs/wiki/multi-step-batch-planning-rules.md`
- `docs/automation/candidate-gate-backlog.md`
- `docs/automation/next-low-touch-runtime-gate-backlog.md`
- `docs/INBOX.md` — pending decisions (always check first)
