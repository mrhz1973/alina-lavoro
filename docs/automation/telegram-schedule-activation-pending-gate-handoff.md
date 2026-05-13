# Telegram Schedule Activation — Pending Gate Handoff

**Task:** 0176
**Date:** 2026-05-13
**Type:** docs-only / gate handoff
**Status:** active — D-0173-A is pending; no decision made

---

## 1. Purpose

This document prevents accidental schedule activation and accidental decision recording for D-0173-A.

D-0173-A (`docs/INBOX.md` — Pending) is the Decision Packet for Telegram notifier schedule activation. It has not been decided. No implementer or orchestrator may act as if it were decided.

This handoff exists so that any future agent, orchestrator, or implementer reading the project state understands:
- what is authorized (nothing runtime for this gate);
- what is not authorized (schedule activation, repeated tests, automatic decisions);
- what the safe next action is after an explicit user response.

---

## 2. Current state

| Item | State |
|------|-------|
| Telegram Mode A manual test | Succeeded by user report (task 0170, 2026-05-13) |
| Workflow `TEST - Alina task completion Telegram notifier` | Inactive / not automatic |
| Schedule Trigger | Not active, not present |
| Runbook / idempotency hardening | Exists: `docs/automation/telegram-notifier-runbook-idempotency-hardening.md` (task 0172) |
| Idempotency state-store in n8n | Not yet implemented |
| Token / chat id in repo | None — secret boundary enforced |
| D-0173-A | **PENDING** — no response recorded |
| Queue reader workflow | Untouched; not to be modified |
| Provider API LLM | Forbidden by default |
| Billing | No new billing |

---

## 3. Pending decision

**D-0173-A** — Authorize Telegram notifier schedule activation after hardening

Located in `docs/INBOX.md` — `## Pending` section.

The user has not yet responded. The orchestrator must not record a response on behalf of the user.

### Options (for reference — not decided)

1. Open a narrow schedule activation implementation gate — only after idempotency/state-store path is explicitly present and validated in n8n.
2. Keep Telegram notifier manual-only — no Schedule Trigger; use Manual Trigger only.
3. Defer schedule activation and add an intermediate idempotency/state-store implementation task first.

### Orchestrator recommendation (not a decision)

Option 3 if the idempotency state-store is not yet implemented in n8n (current state: not implemented).
Option 1 only after the state-store/idempotency path is explicitly present, implemented, and validated.

The recommendation is informational only. It does not constitute a decision. The user must select an option explicitly.

---

## 4. What is NOT authorized

Until D-0173-A is explicitly decided by the user:

- No Schedule Trigger activation
- No automatic notifications
- No repeated test messages (D-0169-A = 1 authorized exactly one test, already consumed)
- No modification of the existing queue reader workflow
- No workflow JSON export/import with secrets
- No token or chat id in repo/docs/AI chat/logs
- No automatic INBOX responses of any kind
- No automatic `D-NNNN-X = N` writing by any system
- No idempotency state-store runtime implementation (requires separate task after gate)
- No provider API LLM
- No new billing
- No app/deploy/tag/rollback

---

## 5. Safe next action after explicit user response

### If D-0173-A = 1 (open schedule activation gate)

1. **Verify first:** confirm that the idempotency/state-store path is already implemented and validated in n8n.
2. **If not implemented:** stop. Do not activate schedule. Create the idempotency/state-store implementation task first, then return to this gate.
3. **If implemented:** proceed with step-by-step user-supervised n8n UI steps to enable the Schedule Trigger. One step at a time (PRIORITÀ 0). Observe the first scheduled run manually before leaving unattended.
4. **Checklist reference:** `docs/automation/telegram-notifier-runbook-idempotency-hardening.md` — Section 13 (schedule activation checklist).

### If D-0173-A = 2 (manual-only)

1. Record the decision in `docs/INBOX.md`.
2. Update state docs: workflow remains manual-trigger only; no Schedule Trigger.
3. No further runtime action needed.

### If D-0173-A = 3 (defer; implement idempotency first)

1. Record the decision in `docs/INBOX.md`.
2. Create a new docs-then-runtime task for idempotency/state-store implementation in n8n.
3. No schedule activation until the state-store task is complete and a new gate is decided.

---

## 6. Stop conditions

Stop immediately and report if any of the following occurs:

- Any document says the Schedule Trigger is active when it is not
- Any workflow activation occurs without explicit D-0173-A decision
- Any duplicate Telegram message is observed
- Any Telegram bot token or chat id appears in repo/docs/AI chat/logs
- Any INBOX decision is auto-written by any system
- Any `D-0173-A = N` is recorded without an explicit user response in chat or commit message
- The existing queue reader (`TEST - GitHub list Alina task queue`) is touched unexpectedly
- Any schedule activation step is taken without the idempotency/state-store being in place (if option 1 is chosen)

---

## Cross-references

| Document | Relationship |
|----------|-------------|
| `docs/INBOX.md` | D-0173-A pending Decision Packet lives here |
| `docs/automation/telegram-notifier-runbook-idempotency-hardening.md` | Pre-schedule hardening requirements; schedule activation checklist |
| `docs/automation/telegram-mode-a-completion-notification-mvp.md` | Full Telegram Mode A design and phase history |
| `docs/automation/candidate-gate-backlog.md` | Candidate D current state |
| `docs/automation/telegram-browser-bridge-trigger-coordination-design.md` | Mode A / Mode B / Mode C coordination design |

---

*This document is docs-only. No runtime was performed. No Telegram message. No Schedule Trigger. No workflow JSON. No token or chat id. D-0173-A remains pending. Task 0176, 2026-05-13.*
