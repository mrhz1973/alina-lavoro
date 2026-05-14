# Telegram Mode A — Schedule Activation Supervision Checklist

**Task:** 0222
**Date:** 2026-05-14
**Type:** docs-only / operational checklist
**Authorization:** This checklist is docs-only. It does not authorize any activation. Activation requires `D-0221-A = 1` explicit user decision before any step below is executed.
**Status:** created — not yet executed. Pending D-0221-A decision.

---

## Purpose

This checklist defines the supervised procedure for a future D-0221-A = 1 Schedule Trigger activation run of Telegram Mode A. It must be executed step-by-step with explicit observation at each stage.

---

## Pre-checks (before any n8n UI action)

- [ ] Confirm current branch is `main` and GitHub is up to date.
- [ ] Confirm D-0221-A = 1 has been explicitly decided by the user and recorded in `docs/INBOX.md`.
- [ ] Confirm no pending D-NNNN-A decision blocks this activation.
- [ ] Confirm no conflicting Schedule Trigger is currently active in any workflow.
- [ ] Read `docs/automation/telegram-mode-a-schedule-activation-design-first-path.md` Stage 2 inspection result to confirm readiness.
- [ ] Confirm `docs/INBOX.md` has no stale Pending entries that require human resolution first.

---

## Allowed workflow

**Exactly one workflow may be opened:**

> `TEST - Alina task completion Telegram notifier`

---

## Forbidden workflows (must not be opened or modified)

- `TEST - GitHub list Alina task queue` (queue reader — must not be touched)
- `TEST - Alina Telegram notifier FULLY PINNED HARNESS ONLY` (test-only harness — do not activate)
- `TEST - Mark Alina task done copy-only generalized` (separate workflow — do not touch)
- Any other workflow not listed above

---

## Required active/inactive state checks

- [ ] Open only `TEST - Alina task completion Telegram notifier`.
- [ ] Confirm workflow is currently inactive (`active = false`) before making any change.
- [ ] Confirm no Schedule Trigger is currently enabled in this workflow.
- [ ] Confirm no Execute is in progress.

---

## Schedule Trigger settings to record (without secrets)

Record the following after adding/enabling the Schedule Trigger — **do not record real Chat ID, Telegram token, credential export, or OAuth material:**

| Field | Value to record |
|-------|----------------|
| Trigger interval | e.g. "every 5 minutes" or "aligned with existing cadence" |
| Timezone | e.g. Europe/Berlin |
| Active status after change | active or inactive |
| Workflow name | `TEST - Alina task completion Telegram notifier` |
| Time of activation | ISO timestamp |

**Do not record:**
- Real Chat ID
- Telegram bot token
- Any credential value
- Exported workflow JSON containing secrets
- Tokenized download URLs

---

## Activation steps (D-0221-A = 1 scope only)

1. Open `TEST - Alina task completion Telegram notifier`.
2. Confirm inactive and no Schedule Trigger present.
3. Add or enable one conservative Schedule Trigger.
   - Use conservative interval (preferably 5 min Europe/Berlin or aligned with existing queue reader cadence).
4. Save the workflow.
5. Confirm the workflow becomes active (or activate it if n8n requires separate activation step).
6. **Do not press Execute manually** unless a separate gate explicitly authorizes it.
7. Wait for the first scheduled tick to fire.
8. Observe the first tick output in n8n UI manually.

---

## First scheduled tick observation

- [ ] Observe exactly the first scheduled tick in n8n UI.
- [ ] Record: did a Telegram notification arrive?
- [ ] If a Telegram notification arrived: was it for a task_id not previously notified? (send — expected for new tasks)
- [ ] If a Telegram notification arrived for an already-notified task: **stop** (unexpected duplicate — abort criteria applies).
- [ ] If no Telegram notification (duplicate-skip path): confirm `Store notification state` was not triggered for an already-seen key.
- [ ] After observing the first tick: report results before further ticks.

---

## Expected outcomes

| Scenario | Expected result |
|----------|----------------|
| Latest done task has a new idempotency_key (not previously sent) | TRUE branch: Telegram notification sent, new row in `alina_telegram_notifier_state`. |
| Latest done task has an already-sent idempotency_key | FALSE branch: no Telegram, no new row (duplicate-skip). |
| `idempotency_key` is missing | `fail_closed` path: no Telegram, no state write. |

---

## Abort criteria — stop and report immediately if any of the following

- Telegram notification arrives for an already-seen idempotency_key (duplicate send).
- Multiple Telegram notifications arrive in rapid succession unexpectedly.
- Wrong workflow was opened or activated (e.g. queue reader or harness).
- INBOX-answering or `D-NNNN-X = N` text appears in any Telegram message.
- Any credential, token, or Chat ID is accidentally visible in a commit, doc, or chat message.
- Schedule Trigger fires before first-tick observation is complete.
- Any unexpected error node fires and cannot be explained.
- The workflow becomes permanently active in a way the user cannot easily disable.

**On abort:** disable the Schedule Trigger, record the failure, write a session note. Do not retry without a new Decision Packet.

---

## What to report back

After first-tick observation:

1. First tick outcome: `schedule activation succeeded` or `schedule activation failed / aborted`
2. Telegram notification(s) received: yes / no / description
3. Duplicate-skip behavior observed: yes / no / not applicable
4. `alina_telegram_notifier_state` new rows: count and description
5. Workflow active/inactive status after activation
6. Any anomalies or unexpected behavior
7. Cleanup candidates addressed or still pending

---

## What NOT to record

- Real Chat ID — never record in any doc, commit, or prompt
- Telegram bot token
- Any OAuth material
- Exported credential secret
- Workflow JSON containing real secrets
- Tokenized download URLs from n8n or GitHub UI

---

## Hard constraints (permanent)

- Telegram Mode A must remain **notification-only** throughout and after activation.
- Telegram must **NOT answer INBOX** and must not write any `D-NNNN-X = N` response.
- Queue reader workflow must remain **untouched**.
- Manual Execute must not be triggered unless a separate gate explicitly authorizes it.
- App Alina (V1.9.2) remains out of scope — no src/deploy/tag/rollback.
- No provider API LLM (no OpenAI, Anthropic, OpenRouter).
- No new API keys or billing.

---

## Related documents

- `docs/automation/telegram-mode-a-schedule-activation-design-first-path.md`
- `docs/INBOX.md` — D-0221-A (Pending)
- `docs/automation/telegram-idempotency-runtime-ui-handoff.md`
- `docs/automation/telegram-notifier-idempotency-implementation-checklist.md`
- `docs/automation/candidate-gate-backlog.md` — Candidate D
- `docs/ORCHESTRATOR_RULES.md` — PRIORITY 0 (step-by-step), PRIORITY 0B (template-first)
