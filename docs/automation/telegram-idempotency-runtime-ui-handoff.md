# Telegram Idempotency Runtime UI Handoff

**Task:** 0183
**Date:** 2026-05-13
**Type:** docs-only / runtime handoff document
**Authorization:** D-0180-A = 1 (recorded task 0182, 2026-05-13)
**Status:** ✅ **Implementation complete + duplicate-skip conclusively validated + readiness inspection succeeded + D-0221-A = 3 decided (cleanup-first path) + cleanup completed + Schedule Trigger activation succeeded (batch 0227–0231, 2026-05-14) — Telegram Mode A is now active scheduled notification-only** — Data Table path implemented; **D-0187-A**, **D-0193-A**, **D-0197-A** consumed; **D-0202-A SUPERSEDED by D-0206-A**; **D-0206-A = 1 decided/applied** (`import/inspection ok` 2026-05-14); **D-0209-A = 1 decided/applied/completed** (`fully pinned duplicate skip succeeded` 2026-05-14): duplicate-skip conclusively validated on the fully-pinned harness; validated principle: `same idempotency_key already present in alina_telegram_notifier_state => skip path, no Telegram, no new row`. **D-0213-A = 3 decided** (2026-05-14, batch 0215–0218): schedule activation **deferred**; design-first path opened at `docs/automation/telegram-mode-a-schedule-activation-design-first-path.md`. **D-0217-A = 1 decided/applied/completed** (2026-05-14, batch 0219–0223, task 0219): readiness inspection succeeded — target workflow `TEST - Alina task completion Telegram notifier` confirmed inactive, no Schedule Trigger, idempotency path wired, Data Table `alina_telegram_notifier_state` confirmed, Telegram notification-only, no INBOX-answering logic, queue reader untouched. **D-0221-A = 3 decided** (2026-05-14, batch 0224–0226, task 0224): cleanup-first path selected; user conditional follow-on activation intent recorded (intent does NOT activate; does NOT authorize Execute); cleanup plan: `docs/automation/telegram-mode-a-pre-schedule-cleanup-plan.md`; supervision checklist for post-cleanup activation: `docs/automation/telegram-mode-a-schedule-activation-supervision-checklist.md`. Original production-like Telegram notifier remains manual-only/inactive. Template `docs/automation/n8n-workflows/templates/telegram-fully-pinned-validation-harness.template.json` + companion `.md`; original design at `docs/automation/telegram-fully-pinned-validation-harness-design.md`.

**Implementation update (task 0185, 2026-05-14):** User implemented idempotency/state-store logic per this handoff. Data Table `alina_telegram_notifier_state` created. Implemented node chain:
```
Manual Trigger → List done files → Pick latest done file → Get done file
→ Build idempotency key → Load notification state → Normalize notification state
→ Decide send or skip → true → Build notification payload → Send a text message
→ Store notification state
```
IF condition: `{{ $json.notification_state_decision === "send" }}`. One manual send/write test succeeded. Workflow remains inactive/manual-only. No Schedule Trigger. Next: resolve D-0187-A for duplicate-skip validation.

**Schedule activation update (batch 0227–0231, 2026-05-14):** D-0221-A = 3 cleanup-first path completed. Cleanup performed in n8n UI (task 0227): (1) `Build notification payload` scope_note updated to current neutral wording; (2) `Store notification state` short_hash mapping updated to `{{ $('Build notification payload').first().json.short_hash }}`. No Execute during cleanup. No new risk found. Conditional follow-on activation intent applied. Schedule Trigger added (every 5 minutes; Schedule Trigger → List done files; Manual Trigger retained). Workflow activated. First scheduled tick result: **success / Telegram arrived**. Telegram Mode A is now **active scheduled notification-only automation**. Telegram does not answer INBOX. Queue reader untouched. No manual Execute pressed. No secrets recorded. Monitoring: `docs/automation/telegram-mode-a-post-activation-monitoring-checklist.md`.

---

## 1. Purpose

D-0180-A = 1 was recorded on 2026-05-13 (task 0182). This opens the idempotency/state-store runtime implementation gate for workflow `TEST - Alina task completion Telegram notifier`.

This document is the handoff for the future one-step-at-a-time n8n UI implementation supervised by ChatGPT. It provides the safe starting sequence, scope boundaries, stop conditions, and the recommended first runtime micro-step.

**This document itself is docs-only.** No n8n UI action is taken by creating this document. No Telegram message is sent. No runtime is performed.

---

## 2. Current workflow

**Workflow name:** `TEST - Alina task completion Telegram notifier`

**Current known node chain (by user report, task 0168):**

```
Manual Trigger
→ List done files
→ Pick latest done file
→ Get done file
→ Build notification payload
→ Telegram
```

**Workflow status:** Inactive — no Schedule Trigger present or enabled.

No automatic behavior is active. The workflow can only be triggered manually by the user in the n8n UI.

---

## 3. Scope authorized by D-0180-A = 1

The following implementation elements are authorized for future one-step-at-a-time user-supervised n8n UI work:

- Idempotency key computation (new Code node after `Get done file`)
- State-store lookup (Data Store node or Code node with static data)
- Send/skip IF branch (`Decide: send or skip`)
- State write only after successful Telegram send
- Fail-closed paths for all error conditions

**Workflow posture:** manual-trigger only throughout this implementation phase. No Schedule Trigger is added.

---

## 4. Scope not authorized by D-0180-A = 1

The following remain explicitly outside this gate:

- Schedule Trigger — not authorized; separate future gate required
- Automatic notifications — not authorized
- Queue reader modification (`TEST - GitHub list Alina task queue`) — must not be touched
- Workflow JSON export/import — not authorized
- Telegram bot token or chat id in repo/docs/AI chat — forbidden
- Provider API LLM (OpenAI, Anthropic, OpenRouter, etc.) — forbidden by default
- New billing or recurring costs — forbidden by default
- App/deploy/tag/rollback — out of scope
- Automatic INBOX responses — forbidden
- Automatic `D-NNNN-X = N` writing — forbidden

---

## 5. Next n8n UI phase — one step at a time

**PRIORITÀ 0 applies throughout.** Each step must be completed, reported, and confirmed before the next step begins. No anticipation of subsequent steps.

Safe starting sequence:

1. **Open** `TEST - Alina task completion Telegram notifier` in n8n UI.
2. **Confirm** workflow is inactive (no green "Active" toggle).
3. **Confirm** no Schedule Trigger node is present.
4. **Note** the exact current node names for reference.
5. **Do not change any existing node yet.**
6. **Inspect** n8n node library: search for "Data Store" or "Data Table".
7. **Stop and report** which state-store option exists:
   - Report: `Data Store available` or `Data Store not available`

This is the first and only micro-step for the first runtime session. No nodes are added yet.

After the state-store availability is confirmed, the next supervised step can be planned according to the implementation checklist (`docs/automation/telegram-notifier-idempotency-implementation-checklist.md`).

---

## 6. Preferred state-store path

| Option | Recommendation |
|--------|---------------|
| n8n Data Store / Data Table | **First choice** — check availability first |
| n8n workflow static data (`$getWorkflowStaticData`) | Acceptable fallback if Data Store unavailable |
| GitHub marker file | Not authorized — requires separate future gate |
| In-memory only | Not acceptable — resets on restart |

**Design reference:** `docs/automation/telegram-notifier-idempotency-state-store-implementation-design.md` (task 0178)

---

## 7. Stop conditions

Stop immediately, disable workflow if active, and do not continue without a new explicit decision if any of the following is observed:

- A Schedule Trigger node appears or is enabled
- The workflow is set to Active
- The queue reader workflow (`TEST - GitHub list Alina task queue`) is opened for editing
- A Telegram message is sent unexpectedly
- A Telegram bot token or numeric chat id appears in any n8n screenshot, sticky note, or Code node
- A workflow JSON is exported (even without credentials)
- Any INBOX response is written automatically by any mechanism
- Any `D-NNNN-X = N` string is produced automatically
- Any provider API, API key, or new billing surface is introduced

---

## 8. First runtime micro-step recommendation

> **Do this and nothing more in the first runtime session:**
>
> 1. Open `TEST - Alina task completion Telegram notifier` in n8n.
> 2. Do not edit any node.
> 3. Confirm the workflow is inactive and has no Schedule Trigger.
> 4. Search the n8n node library for "Data Store" or "Data Table".
> 5. Report: `Data Store available` or `Data Store not available`.
> 6. Close the workflow without saving any changes.

This inspection-only step has zero risk. It produces the information needed to choose between Data Store and static data fallback paths before adding any nodes.

---

## 9. Full implementation reference

For the complete step-by-step implementation checklist after Data Store availability is confirmed:

→ `docs/automation/telegram-notifier-idempotency-implementation-checklist.md` (task 0179)

For the full design (key model, state-store schema, send/skip algorithm, failure modes):

→ `docs/automation/telegram-notifier-idempotency-state-store-implementation-design.md` (task 0178)

For permanent boundaries and schedule activation requirements:

→ `docs/automation/telegram-notifier-runbook-idempotency-hardening.md` (task 0172)

For duplicate-skip validation runtime handoff (D-0187-A = 1):

→ `docs/automation/telegram-duplicate-skip-validation-runtime-handoff.md` (batch 0188–0190)

---

*This document is docs-only. No runtime was performed. No n8n UI action. No Telegram message. No Schedule Trigger. No token or chat id in repo. Authorization: D-0180-A = 1 (task 0182, 2026-05-13).*
