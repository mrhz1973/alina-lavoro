# Telegram Mode A — Post-Activation Monitoring and Disable Checklist

**Task:** 0229
**Date:** 2026-05-14
**Type:** docs-only / operational monitoring reference
**Status:** active — Telegram Mode A schedule is now active as of 2026-05-14 (batch 0227–0231).

---

## 1. Active workflow

| Field | Value |
|-------|-------|
| Workflow name | `TEST - Alina task completion Telegram notifier` |
| Schedule interval | Every 5 minutes |
| Manual Trigger | Retained alongside Schedule Trigger |
| Workflow status | Active (as of 2026-05-14, batch 0227–0231) |
| First scheduled tick | success — Telegram arrived (2026-05-14) |
| Authorization basis | D-0221-A = 3 cleanup-first + conditional follow-on activation intent |

---

## 2. Expected behavior

| Scenario | Expected result |
|----------|----------------|
| New unnotified done task present | TRUE branch: one Telegram notification sent → `Store notification state` writes one new row in `alina_telegram_notifier_state` |
| Already-notified done task | FALSE branch (duplicate-skip): no Telegram → no new row in `alina_telegram_notifier_state` |
| `idempotency_key` cannot be computed | fail-closed: no Telegram, no state write |
| State store unavailable | fail-closed: no Telegram, no state write |
| No done tasks found | workflow ends silently, no Telegram |

Duplicate-skip is conclusively validated on the fully-pinned harness (D-0209-A, 2026-05-14). Validated principle: same `idempotency_key` already present in `alina_telegram_notifier_state` ⇒ skip path, no Telegram, no new row.

---

## 3. What to watch

| Item | Watch for |
|------|-----------|
| Duplicate Telegrams | Same task notified more than once — indicates idempotency failure |
| Failed scheduled executions | n8n execution log shows errors or workflow did not trigger |
| `Store notification state` errors | State write failures; could cause re-sends on next tick |
| Wrong workflow activation | Check that only `TEST - Alina task completion Telegram notifier` is active |
| Telegram content | Confirm messages remain notification-only; no INBOX-answering text |
| Unexpected schedule frequency | Confirm interval remains 5 minutes; no unintended double-trigger |
| Queue reader status | Must remain untouched; any change to `TEST - GitHub list Alina task queue` is a stop condition |

---

## 3b. Diagnostic: silent success with no Telegram (latest-done selection staleness)

**Pattern:** workflow executions show Succeeded but no new Telegram notifications arrive.

Diagnostic steps:

1. Open a recent succeeded execution in n8n UI.
2. Check `Pick latest done file` output — note the `task_id` value.
3. Compare against `Last completed` in `docs/LLMS.md`.
4. If `task_id` is **lower than** `Last completed`:
   - The selection logic is stale or order-dependent.
   - Inspect the `Pick latest done file` Code node.
   - Ensure it uses numeric sort descending (highest task ID), not order-dependent selection like `files[files.length - 1]`.
5. If `task_id` matches `Last completed` but still no Telegram:
   - Check `Decide send or skip` — if FALSE, the task was already notified (correct duplicate-skip).
   - Check `alina_telegram_notifier_state` for a row with the current idempotency key.

**Reference:** `docs/automation/telegram-mode-a-latest-done-selection-fix.md`

---

## 4. Immediate abort / disable criteria

Stop and disable immediately and report if any of the following is observed:

- Repeated duplicate Telegram notifications (same task notified more than once).
- Telegram message appears to answer INBOX or contains any `D-NNNN-X = N` text.
- Queue reader workflow (`TEST - GitHub list Alina task queue`) is modified accidentally.
- Wrong workflow is found active (e.g. harness `TEST - Alina Telegram notifier FULLY PINNED HARNESS ONLY`).
- Any secret (Chat ID, token, credential secret) is exposed in any doc, commit, or chat.
- Unexpected schedule frequency (more frequent than every 5 minutes without explicit change).
- Any error or anomaly that cannot be immediately explained and is reproducible.
- Any INBOX-answering or automated `D-NNNN-X` response produced by the workflow.

---

## 5. Disable procedure concept

To disable Telegram Mode A immediately:

1. Open `TEST - Alina task completion Telegram notifier` in n8n UI.
2. Either:
   - Turn the workflow to **Inactive** (disables all triggers including Schedule), or
   - Disable / delete the Schedule Trigger node only (keeps Manual Trigger available).
3. Confirm the workflow is inactive or the Schedule Trigger is disabled.
4. Report the disable action in docs (session note or task) before making any further changes.

Do not re-enable without recording the incident and the reason in docs first.

---

## 6. Documentation rule

Any incident must be recorded in docs before further activation changes:

- Create a session note in `docs/sessions/YYYY-MM-DD-telegram-mode-a-incident.md`.
- Record: what was observed, when, what was disabled, current state.
- Do not re-activate without an explicit orchestrator decision and INBOX entry (new Decision Packet if warranted).

---

## 7. Security rules

- Real Chat ID must remain only inside the n8n UI. Never record in docs, chat, commits, or session files.
- Telegram bot token must never appear in any doc, commit, or prompt.
- No credential export from n8n.
- No tokenized download URLs in docs.

---

## 8. Permanent constraints (always in force)

- Telegram Mode A is **notification-only**. It must never answer INBOX.
- Telegram must NOT write any `D-NNNN-X = N` response.
- Queue reader workflow must remain untouched.
- App Alina (V1.9.2) is out of scope — no src/deploy/tag/rollback.
- No provider API LLM. No new API keys. No new billing.

---

## 9. References

- `docs/automation/telegram-mode-a-post-activation-stabilization-plan.md` — **stabilization plan (task 0241, 2026-05-14): observation window, anomaly conditions, stable posture**
- `docs/automation/next-low-touch-runtime-gate-backlog.md` — next candidate gates after Mode A activation
- `docs/automation/telegram-mode-a-schedule-activation-supervision-checklist.md` — original supervision checklist
- `docs/automation/telegram-mode-a-pre-schedule-cleanup-plan.md` — cleanup plan (closed)
- `docs/automation/telegram-idempotency-runtime-ui-handoff.md`
- `docs/automation/telegram-notifier-runbook-idempotency-hardening.md`
- `docs/INBOX.md` — D-0221-A = 3 decided
- `docs/tasks/done/0228-record-controlled-telegram-mode-a-schedule-activation-success.md`

---

*Docs-only. No runtime by implementer. Monitoring is a user-supervised activity.*
