# Telegram Mode A — Post-Activation Stabilization Plan

**Task:** 0241 (introduced)
**Date:** 2026-05-14
**Type:** docs-only / operational reference
**Status:** active — supplements monitoring checklist

---

## 1. Active workflow

| Field | Value |
|-------|-------|
| Workflow name | `TEST - Alina task completion Telegram notifier` |
| Schedule interval | Every 5 minutes |
| Manual Trigger | Retained alongside Schedule Trigger |
| Workflow status | **Active** (2026-05-14, batch 0227–0231) |
| First scheduled tick | success — Telegram arrived (2026-05-14) |
| Authorization basis | D-0221-A = 3 cleanup-first + conditional follow-on activation intent |

---

## 2. Expected behavior (reference)

| Scenario | Expected result |
|----------|----------------|
| New unnotified done task present | TRUE branch: one Telegram notification → `Store notification state` writes one row |
| Already-notified done task | FALSE branch (duplicate-skip): no Telegram → no new row |
| `idempotency_key` cannot be computed | fail-closed: no Telegram, no state write |
| State store unavailable | fail-closed: no Telegram, no state write |
| No done tasks found | workflow ends silently, no Telegram |

Duplicate-skip is conclusively validated on the fully-pinned harness (D-0209-A, 2026-05-14).

---

## 3. Stabilization observation window

**Concept:** after initial activation, observe the workflow over a minimum window before considering the behavior stable.

Observation posture:

- Check the n8n execution log after 2–3 natural tick cycles (i.e. 10–15 minutes after activation).
- Confirm no error entries in execution history.
- Confirm no duplicate Telegram messages received.
- Confirm `alina_telegram_notifier_state` Data Table has only expected rows (one per notified task, no duplicates).
- Confirm the Schedule Trigger interval has not drifted.

**Stabilized state:** if the workflow runs for at least 3 full cycles without errors, duplicates, or anomalies, Mode A is considered stable and monitoring transitions from active-watch to routine-check.

---

## 4. Anomaly conditions

Stop and disable immediately if any of the following is observed:

| Anomaly | Action |
|---------|--------|
| Duplicate Telegram notifications (same task notified more than once) | Disable immediately; record incident |
| Failed scheduled executions (n8n execution log errors) | Investigate; disable if pattern is reproducible |
| `Store notification state` write errors | Investigate; could cause re-sends on next tick |
| Wrong workflow is active (e.g. harness `FULLY PINNED HARNESS ONLY`) | Disable wrong workflow immediately |
| Telegram message contains any INBOX-answering text (e.g. `D-NNNN-X = N`) | Disable immediately; security incident |
| Unexpected schedule frequency (more frequent than 5 min) | Disable; investigate schedule configuration |
| Any secret (Chat ID, token) appears in a doc, commit, or chat | Stop; contact admin; never record secrets |
| Queue reader workflow (`TEST - GitHub list Alina task queue`) modified accidentally | Revert and record incident |

---

## 5. Immediate abort procedure

1. Open `TEST - Alina task completion Telegram notifier` in n8n UI.
2. Either:
   - Set workflow to **Inactive** (disables all triggers), or
   - Disable the Schedule Trigger node only (keeps Manual Trigger available for diagnostics).
3. Confirm Schedule Trigger is no longer firing.
4. Record the incident in `docs/sessions/YYYY-MM-DD-telegram-mode-a-incident.md` before any further changes.

Do not re-enable without recording the incident and receiving an explicit orchestrator decision first.

---

## 6. Stable posture after observation window

Once Mode A is considered stable (Section 3):

- Monitor passively (no active watch needed every 5 minutes).
- Check execution log periodically or when a Telegram notification arrives.
- No changes to the workflow without a new Decision Packet.
- No new gates opened from this document.

---

## 7. Relationship to next-gate planning

Telegram Mode A stabilization is the **current operational posture**. Next runtime gates (Browser Bridge project-chat, Ollama preflight, etc.) remain future candidates. None are authorized from this document.

See: `docs/automation/next-low-touch-runtime-gate-backlog.md` for the candidate list.

---

## 8. Security rules (always in force)

- Real Chat ID must remain only inside the n8n UI. Never record in docs, chat, commits, or sessions.
- Telegram bot token must never appear in any doc, commit, or prompt.
- No credential export from n8n.
- No tokenized download URLs in any doc.

---

## 10. Latest done selection anomaly — resolved / pending scheduled observation

**Date:** 2026-05-14 (tasks 0246–0248)

After initial activation, scheduled executions succeeded but sent no new Telegram notifications. Root cause: `Pick latest done file` used order-dependent selection (`files[files.length - 1]`), which returned an older task (0232) instead of the actual latest task (0245).

**Resolution:**
- Node `Pick latest done file` was fixed in n8n UI by user under orchestrator supervision.
- Workflow was kept inactive during fix and validation.
- Fix: select highest numeric task ID from `docs/tasks/done/*.md` (sort descending by four-digit prefix).
- Node-level validation confirmed task_id 0245 selected correctly.
- One manual full execution performed: **Telegram 0245 arrived** (user report).

**Current status — RESOLVED (tasks 0251–0253, 2026-05-14):**
- Root cause resolved.
- Manual validation succeeded (Telegram 0245 arrived, task 0248).
- First scheduled tick post-fix: Telegram sent for **task 0250** (new latest done after docs batch 0246–0250 was committed between manual run and first tick). Correct behavior.
- Second scheduled tick post-fix: **duplicate-skip** for task 0250 (already notified). Correct behavior.
- **Telegram Mode A is declared stable-after-fix.**

Post-fix validation is complete. Mode A transitions from active-watch to routine-check posture (see Section 3).

See: `docs/automation/telegram-mode-a-latest-done-selection-fix.md`

---

## 9. References

- `docs/automation/telegram-mode-a-post-activation-monitoring-checklist.md` — operational disable checklist
- `docs/automation/telegram-idempotency-runtime-ui-handoff.md`
- `docs/INBOX.md` — D-0221-A = 3 decided
- `docs/tasks/done/0228-record-controlled-telegram-mode-a-schedule-activation-success.md`
- `docs/automation/candidate-gate-backlog.md` — candidate D row
- `docs/automation/next-low-touch-runtime-gate-backlog.md` — next candidate gates

---

*Docs-only. No runtime by implementer. Monitoring is a user-supervised activity.*
