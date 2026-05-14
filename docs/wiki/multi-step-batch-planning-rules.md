# Multi-Step Batch Planning Rules — LLM Wiki V3.1

**Task:** 0238 (introduced)
**Date:** 2026-05-14
**Type:** workflow / planning rules
**Status:** active rule

## Purpose

Formalize the rule that determined docs-only continuations should use coherent multi-step batches rather than one tiny task per confirmation. Complement the batch-size limits with planning guidance for when and how to group sub-tasks.

---

## Core rule

**When no real decision is pending and all sub-tasks are docs-only, batch them into a coherent set — do not split into individual tasks just to ask confirmation between each one.**

Splitting determined docs-only work into one-task-per-confirmation loops is:
- an operational error (PRIORITY 0A — no unnecessary confirmations);
- a waste of user time;
- equivalent to asking «vai?» repeatedly.

---

## When to batch multiple sub-tasks

Batch when ALL of the following are true:

1. All sub-tasks are docs-only (no runtime, no n8n UI, no user manual action).
2. No real decision is pending between sub-tasks (no gate to open, no DP required between steps).
3. The sub-tasks form a natural sequence (design → state update, or multiple related wiki additions).
4. No sub-task touches sensitive gates (deploy, tag, rollback, API key, credentials, app source).
5. The batch stays within the allowed size limits.

---

## Batch size limits (maximum, not target)

| Batch type | Max sub-tasks |
|---|---|
| docs-only pure | **8** (prefer 6–8; lower when fewer meaningful units exist; do not exceed 8 without explicit reason) |
| docs + Decision Packet | 5 |
| docs + small technical design | 4 |
| runtime / n8n UI / credentials / Telegram / Schedule / app / deploy / tag / rollback | **1 step only** |

Limits are maximums. Prefer 6–8 for docs-only coherent work. Use fewer if the scope is naturally smaller. Split if ambiguous. Do not invent tasks to fill a batch.

---

## Rules

### Do not reduce every docs-only continuation to one tiny task

If the orchestrator has a clear sequence of 3–4 docs-only updates to make (e.g. create a wiki page, update LLMS.md, update current-state.md, update roadmap.md), these belong in one batch, not four separate confirmation loops.

### Do not invent work to fill a batch

If the natural batch is 2 sub-tasks, create 2. Do not add cosmetic sub-tasks to reach 6.

### Do not mix runtime and docs-only in the same unsafely broad batch

If a batch contains both docs-only and runtime steps, the runtime portion must be:
- extracted into its own single-step task;
- separately gated with a Decision Packet.

The docs-only portion can proceed independently.

### If the user already gave a conditional decision, encode it as a sequence

If the user said «if X succeeds, do Y next», encode the full sequence in the batch:
- sub-task 1: step X;
- sub-task 2: step Y (conditional on X success);

Do not re-ask «shall we do Y?» when X succeeds — the decision was already made.

### If a gate appears mid-batch, stop and open a Decision Packet

If an unexpected gate appears while executing a batch:
- stop at the gate;
- open a DP with the specific question;
- do not continue the remaining batch until the DP is resolved.

The remaining sub-tasks after the gate remain in the queue and resume after the DP is decided.

---

## Anti-patterns to avoid

| Anti-pattern | Why it is wrong |
|---|---|
| «Shall I create the next wiki file?» after each file | Unnecessary confirmation; breaks operational flow |
| Splitting a 3-file state update into 3 separate tasks | Creates 3× the overhead with no real decision between them |
| Including runtime and docs in one task without gating the runtime | Mixes risk profiles; runtime must be single-step |
| Asking «proceed?» at the end of a docs-only batch final report | The batch is done; no confirmation needed unless a new gate appears |
| Creating an INBOX entry for a docs-only continuation | INBOX is for real decisions only |
| Creating a new policy doc that only restates existing rules | Regression — update the existing rule instead; apply Docs ROI Gate (`v31-enforcement-checklist.md` § F) |

---

## Decision Packet rule (brief)

Open a Decision Packet (write to `docs/INBOX.md`) only when:

- Two or more non-equivalent options exist.
- The user must choose before work can continue.
- The outcome of the choice changes which subsequent tasks are created.

Docs-only continuation, state updates, and wiki additions do not require DPs.

---

## Related documents

- `docs/ORCHESTRATOR_RULES.md` — PRIORITY 0A (no unnecessary confirmations)
- `docs/wiki/compact-task-creation-workflow.md`
- `docs/wiki/compact-implementer-prompt-workflow.md`
- `docs/wiki/task-id-preflight.md`
- `docs/wiki/examples/v31-compact-workflow-cookbook.md`
