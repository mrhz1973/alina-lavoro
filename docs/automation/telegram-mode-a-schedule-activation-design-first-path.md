# Telegram Mode A — Schedule Activation Design-First Path

**Task:** 0216
**Date:** 2026-05-14
**Type:** docs-only / design / template-first preparation
**Authorization:** D-0213-A = 3 (defer schedule activation; design safer path first)
**Status:** active reference document. No runtime. No n8n UI. No Schedule Trigger activation.

---

## A. Purpose

Move from the validated duplicate-skip baseline to a future Schedule Trigger activation of Telegram Mode A in a way that:

- avoids wrong workflow activation;
- avoids duplicate notifications;
- preserves Telegram Mode A as **notification-only**;
- keeps INBOX decisions **human-only**;
- keeps the queue reader workflow untouched;
- keeps every step explicitly gated by a Decision Packet.

This document is the **planning artefact** the user explicitly requested by selecting `D-0213-A = 3`. It does not authorize any runtime action.

---

## B. Current validated baseline

- **D-0209-A = 1** decided/applied/completed with result `fully pinned duplicate skip succeeded` (2026-05-14, recorded in task 0211).
- Validated principle: `same idempotency_key already present in alina_telegram_notifier_state => skip path, no Telegram, no new row`.
- Validation was performed on the **fully-pinned TEST-only harness** `TEST - Alina Telegram notifier FULLY PINNED HARNESS ONLY` (`active=false`, Manual Trigger only). The harness is **not** the workflow that should be scheduled.
- The **production-like Telegram notifier** remains manual-only / inactive.
- The **queue reader** workflow is separate and unrelated to Telegram Mode A; it must not be modified by this path.
- Data Table target: `alina_telegram_notifier_state`.

---

## C. Why activation is not immediate

- Schedule activation introduces recurring runtime behaviour; once enabled, ticks fire without further user action.
- The exact target workflow (production-like notifier, not the harness) must be unambiguously identified.
- The idempotency / state-store path must be confirmed inside the target workflow (not just in the harness).
- The first scheduled tick must be **manually observed** for correctness and absence of duplicate notifications.
- A wrong workflow activation (e.g. scheduling the harness, or scheduling a partially-pinned variant) is a concrete and recent risk (cf. D-0197-A partial pinning / dynamic reference leakage).
- Telegram Mode A must remain **notification-only**; nothing in the activation path may introduce INBOX-answering behaviour.

---

## D. Safer staged path

A multi-stage sequence, each stage explicitly gated:

| Stage | Description | Gate |
|------|-------------|------|
| 1 | Docs-only design and status update (this document + batch 0215–0218). | Already covered by `D-0213-A = 3`. No runtime. |
| 2 | Controlled n8n UI **readiness inspection only** of the intended Telegram notifier workflow. | New Pending Decision Packet `D-0217-A`. No Execute, no Schedule. |
| 3 | If inspection succeeds, create/adjust a **template-first** importable workflow (or a checklist-backed activation plan) for the production-like notifier. | Future docs-only batch. No runtime. |
| 4 | Controlled Schedule Trigger activation on the intended workflow, at a conservative interval, with an explicit first-tick observation plan. | Future Decision Packet (separate from `D-0217-A`). |
| 5 | Observe first scheduled tick **manually**. Record outcome. | Manual gate. |
| 6 | Record result: keep active, or disable and report, depending on outcome. | Docs-only follow-up. |

Each stage may produce its own batch of docs-only tasks. No stage may collapse into the next without an explicit Decision Packet.

---

## E. Readiness inspection scope (Stage 2)

The next narrower gate (`D-0217-A`) authorizes inspection only. It must **not** activate any schedule. Inspection scope:

- Open **only** the intended Telegram notifier workflow (the production-like notifier, not the harness).
- Do not open or modify the queue reader workflow.
- Confirm workflow **name** and purpose.
- Confirm `active=false` **before any action**.
- Confirm **no Schedule Trigger** is currently active.
- Confirm **idempotency / state-store nodes** exist and are wired (load → decide → store).
- Confirm Data Table target is `alina_telegram_notifier_state`.
- Confirm the duplicate-skip principle (validated under D-0209-A) is recorded in docs.
- Confirm the Telegram node is **notification-only** (text send), no message-handling / inbound listening.
- Confirm there is **no INBOX-answering logic** anywhere in the workflow.
- Confirm the queue reader workflow is **untouched**.
- Stop and report findings.

If any item cannot be confirmed, stop and report. Do not proceed to template-first / activation stages.

---

## F. Activation criteria (Stage 4 prerequisites)

Before any future activation gate may be opened, all of the following must hold:

- Target workflow identified unambiguously by name.
- Idempotency path present and wired in the target workflow (not only in the harness).
- D-0209-A duplicate-skip validation recorded in docs (already true).
- Schedule interval chosen conservatively (e.g. aligned with the existing low-touch cadence such as 5 minutes Europe/Berlin, unless docs specify otherwise).
- First-tick observation plan written: when, who watches, expected outcome (duplicate-skip on already-notified `done` markers, no duplicate Telegram).
- Abort criteria written (see Section G).
- No secrets exported. No tokenized URLs. No credentials in repo/docs/chat.
- No provider API LLM involvement.

---

## G. Abort criteria

Stop the path and report immediately if any of the following is observed:

- Target workflow ambiguous or multiple candidates with the same intent.
- Any missing idempotency / state-store node in the target workflow.
- Telegram node configured (or extensible) to answer INBOX.
- An existing **active** Schedule Trigger is found unexpectedly.
- Wrong workflow opened by mistake (e.g. queue reader, or harness instead of production-like notifier).
- Credentials or secrets appear in any export or in any UI copy that could be committed.
- Data Table target unclear or not `alina_telegram_notifier_state`.
- The n8n UI differs materially from this document or from `docs/automation/telegram-idempotency-runtime-ui-handoff.md`.

Abort means: leave state untouched, do not commit anything sensitive, write a session report.

---

## H. Template-first policy applied here

Canonical reference: `docs/ORCHESTRATOR_RULES.md` — PRIORITY 0B; `docs/AI_RULES.md` — n8n template-first.

- Prefer a sanitized **importable JSON template** or a **checklist-backed import path** for the production-like Telegram notifier whenever feasible.
- If the existing production-like workflow cannot be safely templated without exposing secrets, use a **readiness checklist first** (Stage 2) and reach template-first compliance afterwards.
- Templates must be **inactive by default** (`active: false`) and contain **no real secrets** (no Telegram bot token, no real chat id, no OAuth material, no API key, no credential secret export, no tokenized URL).
- Credential names and chat id in templates are placeholders (e.g. `REPLACE_WITH_*`); real values are bound inside n8n only.
- Any import, inspection, or activation remains a **runtime / UI gate**, with its own Decision Packet.

---

## I. Non-authorizations

This document explicitly does **not** authorize:

- No Schedule Trigger activation.
- No Execute of any workflow.
- No Telegram send / test.
- No workflow import / export.
- No token / chat id / password / OAuth material in repo / docs / chat.
- No queue reader changes.
- No app / `src/**` changes, deploy, tag, rollback.
- No provider API LLM (no OpenAI, Anthropic, OpenRouter, hosted provider AI).
- No new API keys.
- No new billing.
- No automatic INBOX response by Telegram or any other channel.
- No second duplicate-skip validation run.

---

## Stage 2 — Inspection result (D-0217-A = 1, 2026-05-14)

**D-0217-A = 1 decided/applied/completed** (2026-05-14, batch 0219–0223, task 0219).

**Inspection result:** succeeded.

| Item | Finding |
|------|---------|
| Target workflow | `TEST - Alina task completion Telegram notifier` |
| Workflow active at inspection | No (inactive) |
| Schedule Trigger visible | No |
| Idempotency/state-store path | Present and wired: Load → Normalize → Decide → (TRUE) Build → Send → Store |
| Data Table target | `alina_telegram_notifier_state` ✅ |
| Telegram node | Notification-only confirmed ✅ |
| No INBOX-answering logic | Confirmed ✅ |
| Reply Markup | None ✅ |
| Queue reader | Untouched ✅ |
| Execute | Not pressed ✅ |
| Telegram send | Not sent ✅ |
| Schedule Trigger | Not added/enabled ✅ |
| Workflow import/export | Not performed ✅ |
| Real Chat ID | Visible in n8n UI; not recorded ✅ |

**Minor cleanup candidates (non-blocking):**
1. Stale `D-0165-A` wording in `Build notification payload` scope_note.
2. `short_hash` mapped to empty string in `Store notification state`.

**No Schedule Trigger was authorized or activated by this inspection.**

Stage 3 (template-first activation plan) is superseded by the supervision checklist approach (`docs/automation/telegram-mode-a-schedule-activation-supervision-checklist.md`, task 0222). Stage 4 activation is gated by D-0221-A (Pending).

---

## Related documents

- `docs/automation/telegram-idempotency-runtime-ui-handoff.md`
- `docs/automation/telegram-fully-pinned-validation-harness-design.md`
- `docs/automation/telegram-notifier-runbook-idempotency-hardening.md`
- `docs/automation/telegram-notifier-idempotency-implementation-checklist.md`
- `docs/automation/telegram-mode-a-schedule-activation-supervision-checklist.md`
- `docs/automation/n8n-workflows/templates/telegram-fully-pinned-validation-harness.template.md`
- `docs/automation/candidate-gate-backlog.md`
- `docs/INBOX.md` (D-0209-A decided/applied; D-0213-A decided = 3; D-0217-A decided = 1; D-0221-A pending)
