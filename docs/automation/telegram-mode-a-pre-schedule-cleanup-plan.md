# Telegram Mode A — Pre-Schedule Cleanup Plan

**Task:** 0225
**Date:** 2026-05-14
**Type:** docs-only / cleanup planning before Schedule activation
**Authorization:** D-0221-A = 3 (decided/applied, task 0224). Cleanup-first path selected. Conditional follow-on activation intent recorded.
**Status:** ✅ **CLOSED / COMPLETED** — batch 0227–0231 (2026-05-14). Both cleanup candidates completed by user in n8n UI. Cleanup-first requirement from D-0221-A = 3 satisfied. Conditional follow-on activation intent applied. Schedule Trigger activation succeeded (task 0228). No new risk found during cleanup. No runtime by implementer.

---

## A. Purpose

Define the supervised cleanup-first path that must be completed before Telegram Mode A Schedule Trigger activation. The cleanup addresses the two non-blocking minor findings identified during the D-0217-A readiness inspection.

This document is **docs-only**. It does not perform any n8n UI action. Future cleanup work is runtime / UI action and must be supervised step-by-step.

---

## B. Cleanup candidates

### B.1. Build notification payload — stale `scope_note` wording

**Current (stale) wording (from D-0217-A inspection):**

> "D-0165-A allows workflow creation only. No Telegram test message authorized."

**Why stale:** D-0165-A only opened the workflow-creation gate. Since then, D-0167-A (Telegram node), D-0169-A (manual test), D-0180-A (idempotency runtime), D-0206-A (import), D-0209-A (Execute / duplicate-skip validation), and D-0217-A (readiness inspection) have all been decided. The phrase "No Telegram test message authorized" is no longer accurate — manual test sends have already happened under D-0169-A and D-0209-A.

**Replacement intent (example wording — exact text to be confirmed at the cleanup runtime step):**

> "Payload only. Telegram Mode A notification-only. No INBOX response, no decision writing, no Schedule Trigger activation by this node."

**Constraints:**
- The replacement must remain **descriptive only** (a `scope_note` field has no behavioural effect on the node).
- The replacement must not introduce real Chat ID, token, or credential names.
- The replacement must reaffirm the notification-only nature and the no-INBOX-answer constraint.

### B.2. Store notification state — `short_hash` empty mapping

**Observation from inspection:** `short_hash` is mapped to an empty string in `Store notification state`.

**Plan:**

1. Inspect whether `short_hash` should be populated:
   - from `Build notification payload` (if it emits a `short_hash` field), or
   - from `Normalize notification state` (e.g. truncated `done_file_sha`), or
   - from `Build idempotency key` (commit hash source).
2. If a safe upstream source exists, map `short_hash` to that source.
3. If no safe upstream source exists, document explicitly **why** leaving `short_hash` empty is acceptable (e.g. "field is descriptive only; primary idempotency key is `idempotency_key`; `short_hash` retained for future audit but currently unused").

**Constraints:**
- Do not introduce a new computation node just to populate `short_hash` unless trivially safe.
- Do not change the primary idempotency key logic — duplicate-skip is already conclusively validated under D-0209-A.

---

## C. Runtime nature

- The cleanup requires **n8n UI modification** and is therefore a **runtime/UI action**.
- This docs-only document **does not perform** the cleanup.
- The future orchestrator guidance must be **step-by-step**:
  - one cleanup change at a time;
  - confirm the workflow remains inactive after each change;
  - confirm no Schedule Trigger is accidentally added;
  - confirm no real secrets are exposed in any export, screenshot, or copy-paste.

---

## D. Activation sequencing (after cleanup)

The user's conditional follow-on activation intent (recorded in task 0224) means:

1. After both cleanup candidates are addressed (or explicitly documented as acceptable as-is).
2. After no new risk is found during the cleanup process.
3. **Proceed toward the controlled Schedule Trigger activation path** following `docs/automation/telegram-mode-a-schedule-activation-supervision-checklist.md` — **without asking the user the same strategic choice again**.

**However, the following safety steps remain mandatory and are not waived by the conditional intent:**

- Observe the first scheduled tick **manually**.
- Do not record real Chat ID, token, OAuth material, or credential export.
- Do not modify the queue reader.
- Do not press Execute manually unless a separate gate explicitly authorizes it.
- Telegram Mode A must remain **notification-only** and must not answer INBOX.
- If any unexpected duplicate notification or anomaly appears at the first tick: **stop, disable, report**.

---

## E. Non-authorizations

This document explicitly does **not** authorize:

- Schedule Trigger activation.
- Execute of any workflow.
- Telegram send / test.
- Workflow import / export.
- Queue reader modification.
- Provider API LLM (OpenAI, Anthropic, OpenRouter, hosted AI).
- New billing or recurring costs.
- New API keys.
- App / `src/**` changes, deploy, tag, rollback.
- Token, Chat ID, password, OAuth material, or credential export in repo / docs / chat.
- Automatic INBOX response by Telegram or any other channel.
- Automatic `D-NNNN-X = N` writing.

---

## F. Related documents

- `docs/INBOX.md` — D-0221-A decided / response = 3.
- `docs/automation/telegram-mode-a-schedule-activation-design-first-path.md` — Stage 2 inspection result (D-0217-A).
- `docs/automation/telegram-mode-a-schedule-activation-supervision-checklist.md` — supervised first-tick procedure (applies after cleanup).
- `docs/automation/telegram-idempotency-runtime-ui-handoff.md` — implementation status.
- `docs/automation/candidate-gate-backlog.md` — Candidate D state.
- `docs/tasks/done/0224-record-d0221a-cleanup-first-conditional-activation-intent.md` — formal record of D-0221-A = 3 plus conditional intent.
- `docs/ORCHESTRATOR_RULES.md` — PRIORITY 0 (step-by-step), PRIORITY 0A (no unnecessary confirmations), PRIORITY 0B (template-first).
