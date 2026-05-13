# Telegram Schedule Activation — Pending Gate Handoff

**Task:** 0176 (created) / updated 0177–0181 (2026-05-13)
**Date:** 2026-05-13
**Type:** docs-only / gate handoff
**Status:** superseded by batch 0177–0181 — D-0173-A is now DECIDED = 3; D-0180-A is the current pending gate

---

## 1. Purpose

This document records the decision outcome for D-0173-A and hands off to the next pending gate (D-0180-A).

D-0173-A is now **DECIDED = 3** (task 0177, 2026-05-13). Schedule activation is deferred. The intermediate idempotency/state-store implementation path must be designed and gated first.

The current pending gate is **D-0180-A** — Open Telegram notifier idempotency/state-store runtime implementation gate (`docs/INBOX.md` — Pending).

This handoff now documents:
- D-0173-A outcome (decided = 3);
- what is authorized (docs-only design and checklist for idempotency);
- what is still not authorized (schedule activation, runtime, repeated tests);
- the new pending gate D-0180-A and its safe next action path.

---

## 2. Current state

| Item | State |
|------|-------|
| Telegram Mode A manual test | Succeeded by user report (task 0170, 2026-05-13) |
| Workflow `TEST - Alina task completion Telegram notifier` | Inactive / not automatic |
| Schedule Trigger | Not active, not present |
| Runbook / idempotency hardening | Exists: `docs/automation/telegram-notifier-runbook-idempotency-hardening.md` (task 0172) |
| Idempotency design | Exists: `docs/automation/telegram-notifier-idempotency-state-store-implementation-design.md` (task 0178) |
| Idempotency checklist | Exists: `docs/automation/telegram-notifier-idempotency-implementation-checklist.md` (task 0179) |
| Idempotency state-store in n8n | Not yet implemented |
| Token / chat id in repo | None — secret boundary enforced |
| D-0173-A | **DECIDED = 3** (task 0177, 2026-05-13) — schedule deferred; implement idempotency first |
| D-0180-A | **PENDING** — idempotency/state-store runtime implementation gate |
| Queue reader workflow | Untouched; not to be modified |
| Provider API LLM | Forbidden by default |
| Billing | No new billing |

---

## 3. Decision recorded — D-0173-A = 3

**D-0173-A** — Authorize Telegram notifier schedule activation after hardening

**Status:** DECIDED = 3 (task 0177, 2026-05-13)

User selected option 3: Defer schedule activation; implement idempotency/state-store first.

As a result of this decision (batch 0177–0181, 2026-05-13):
- Idempotency/state-store implementation design created: `docs/automation/telegram-notifier-idempotency-state-store-implementation-design.md` (task 0178).
- Implementation checklist created: `docs/automation/telegram-notifier-idempotency-implementation-checklist.md` (task 0179).
- New pending runtime gate created: D-0180-A (task 0180) — `docs/INBOX.md` — `## Pending`.

---

## 4. Current pending decision

**D-0180-A** — Open Telegram notifier idempotency/state-store runtime implementation gate

Located in `docs/INBOX.md` — `## Pending` section.

The user has not yet responded to D-0180-A. No implementer or orchestrator may act on D-0180-A as if it were decided.

### Options (for reference — not decided)

1. Open idempotency/state-store implementation gate only — step-by-step user-supervised n8n UI. No Schedule Trigger. No automatic notifications.
2. Keep design-only for now — no runtime.
3. Defer and refine design/checklist further — no runtime.

### Orchestrator recommendation (not a decision)

Option 1, but only as a narrow runtime gate for idempotency/state-store and duplicate-skip logic. Schedule remains separate.

The recommendation is informational only. It does not constitute a decision. The user must select an option explicitly.

---

## 5. What is NOT authorized

Until D-0180-A is explicitly decided by the user:

- No Schedule Trigger activation
- No automatic notifications
- No repeated test messages (D-0169-A = 1 authorized exactly one test, already consumed)
- No modification of the existing queue reader workflow
- No workflow JSON export/import with secrets
- No token or chat id in repo/docs/AI chat/logs
- No automatic INBOX responses of any kind
- No automatic `D-NNNN-X = N` writing by any system
- No idempotency state-store runtime implementation (requires D-0180-A to be decided first)
- No provider API LLM
- No new billing
- No app/deploy/tag/rollback

---

## 6. Safe next action after D-0180-A user response

### If D-0180-A = 1 (open idempotency/state-store gate)

1. Proceed step-by-step per `docs/automation/telegram-notifier-idempotency-implementation-checklist.md`.
2. One n8n UI step at a time (PRIORITÀ 0). No Schedule Trigger.
3. After idempotency is implemented and duplicate-skip validated, create a new Decision Packet for schedule activation.

### If D-0180-A = 2 (keep design-only)

1. Record the decision in `docs/INBOX.md`.
2. Idempotency design and checklist remain docs-only.
3. No n8n runtime modification.

### If D-0180-A = 3 (defer; refine design further)

1. Record the decision in `docs/INBOX.md`.
2. Refine design/checklist as requested.
3. Return to this gate after refinement.

---

## 7. Stop conditions

Stop immediately and report if any of the following occurs:

- Any document says the Schedule Trigger is active when it is not
- Any workflow activation occurs without explicit D-0180-A decision
- Any duplicate Telegram message is observed
- Any Telegram bot token or chat id appears in repo/docs/AI chat/logs
- Any INBOX decision is auto-written by any system
- Any `D-0180-A = N` is recorded without an explicit user response in chat or commit message
- The existing queue reader (`TEST - GitHub list Alina task queue`) is touched unexpectedly
- Any n8n runtime modification occurs before D-0180-A is decided

---

## Cross-references

| Document | Relationship |
|----------|-------------|
| `docs/INBOX.md` | D-0173-A decided = 3 (Decided section); D-0180-A pending (Pending section) |
| `docs/automation/telegram-notifier-runbook-idempotency-hardening.md` | Pre-schedule hardening requirements; schedule activation checklist |
| `docs/automation/telegram-notifier-idempotency-state-store-implementation-design.md` | Idempotency/state-store implementation design (task 0178) |
| `docs/automation/telegram-notifier-idempotency-implementation-checklist.md` | Implementation checklist (task 0179) |
| `docs/automation/telegram-mode-a-completion-notification-mvp.md` | Full Telegram Mode A design and phase history |
| `docs/automation/candidate-gate-backlog.md` | Candidate D current state |
| `docs/automation/telegram-browser-bridge-trigger-coordination-design.md` | Mode A / Mode B / Mode C coordination design |

---

*This document is docs-only. No runtime was performed. No Telegram message. No Schedule Trigger. No workflow JSON. No token or chat id. D-0173-A decided = 3. D-0180-A pending. Batch 0177–0181, 2026-05-13.*
