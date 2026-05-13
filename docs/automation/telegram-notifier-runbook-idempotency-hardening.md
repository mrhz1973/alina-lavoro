# Telegram Notifier — Runbook and Idempotency Hardening

**Task:** 0172 (created) / cross-referenced by batch 0177–0181 (2026-05-13)
**Date:** 2026-05-13
**Type:** docs-only / pre-schedule-activation hardening
**Authorization:** D-0171-A = 3 (schedule deferred; hardening required before any Schedule Trigger)
**Status:** active reference document — D-0173-A = 3 decided (task 0177); D-0180-A pending runtime gate for idempotency implementation

**Cross-references (added 2026-05-13, batch 0177–0181; updated batch 0182–0184; updated batch 0185–0187):**
- Idempotency/state-store implementation design: `docs/automation/telegram-notifier-idempotency-state-store-implementation-design.md` (task 0178)
- Implementation checklist: `docs/automation/telegram-notifier-idempotency-implementation-checklist.md` (task 0179)
- Runtime gate: D-0180-A = 1 decided (task 0182, 2026-05-13) — idempotency/state-store runtime gate opened
- Runtime UI handoff: `docs/automation/telegram-idempotency-runtime-ui-handoff.md` (task 0183)
- **Implementation status (2026-05-14):** Data Table `alina_telegram_notifier_state` implemented by user; one send/write test succeeded; **duplicate-skip validation pending** (D-0187-A — `docs/INBOX.md`); no Schedule Trigger; schedule activation checklist (§13) not yet complete

---

## 1. Purpose

Telegram Mode A (`TEST - Alina task completion Telegram notifier`) has passed one manual test by user report (task 0170). The workflow is not automatic. No Schedule Trigger is active.

This document defines the minimum hardening requirements before any Schedule Trigger or automatic notification activation is considered. It must be read by any future implementer or orchestrator before requesting or opening a schedule activation gate.

No runtime is performed by this document. No n8n UI action. No Telegram message. No Schedule Trigger. No workflow JSON export/import.

---

## 2. Current validated state

| Item | State |
|------|-------|
| Telegram bot | Exists by user report (task 0164) |
| n8n credential `telegram_alina_notifier` | Exists and connection test OK by user report (task 0164) |
| Workflow skeleton | Created by user report (task 0166); Manual Trigger → List done files → Pick latest done file → Get done file → Build notification payload |
| Telegram node | Added by user report (task 0168); credential by name: `telegram_alina_notifier`; text: `{{ $json.telegram_message }}`; chat id in n8n UI only |
| One manual test | Succeeded by user report (task 0170) under D-0169-A = 1 |
| Workflow status | Inactive / not automatic |
| Schedule Trigger | Not active, not present |
| Token/chat id in repo | None — secret boundary enforced |
| Provider API LLM | Forbidden by default |

---

## 3. Permanent boundaries

Telegram Mode A is **notification-only**. It must never, in any future implementation:

- answer INBOX (`docs/INBOX.md`)
- write any `D-NNNN-X = N` response
- trigger Browser Bridge
- modify app sources (`src/**`, `gas-current/**`, `appsscript.json`)
- perform deploy, tag, or rollback
- use any provider API LLM (OpenAI, Anthropic, OpenRouter, etc.)
- introduce any new LLM billing or recurring cost
- expose Telegram bot token or chat id in repo, docs, session files, commit messages, AI chat, or console logs
- modify the existing queue reader workflow (`TEST - GitHub list Alina task queue`)
- operate as a control plane — notification only, no commands issued

---

## 4. Workflow runtime intent

When a Schedule Trigger is eventually activated (only after an explicit future gate), the intended behavior is:

- poll `docs/tasks/done/` periodically via the existing GitHub credential
- detect whether a new done task exists that has **not yet been notified**
- if new: send exactly one Telegram message per unique done file key
- if no new: skip silently
- never modify `queue/`, `processing/`, `failed/`, or `done/` directories
- never write to `docs/INBOX.md`
- remain a **sibling workflow** — the existing queue reader is never touched

The workflow must not be a fork or modification of `TEST - GitHub list Alina task queue`.

---

## 5. Idempotency model

**Recommended idempotency key:**

```
(done_file_path, done_file_sha)
```

Using the GitHub file SHA where available provides the strongest signal: it changes when the file content changes (e.g. after amend), which avoids silent re-notification edge cases.

**Fallback (if SHA is unavailable):**

```
(task_id, short_commit_hash)
```

Where `task_id` = basename of the done file without `.md`, and `short_commit_hash` = first 7 characters of the commit hash that last modified the file.

**Rules:**

- do not rely solely on `task_id` if the done file can be amended after initial creation
- do not rely solely on "latest file name" without storing the last-notified key in a persistent state store
- the idempotency key must be stored persistently across workflow executions
- if the key cannot be computed or stored, fail closed — do not send

---

## 6. Suggested n8n state store options

| Option | Notes | Recommendation |
|--------|-------|---------------|
| **n8n Data Store / Data Table** | Persistent per-workflow key/value store; survives n8n restart if on disk; clean API | **Recommended first choice** if available in this n8n instance |
| **n8n static data** (`$getWorkflowStaticData('global')`) | Simple persistent key/value on n8n instance; survives executions but may reset on workflow reimport | Acceptable fallback if Data Store is unavailable |
| **GitHub marker file** (`docs/automation/telegram-notify-state.md` or similar) | Repo-based state; survives n8n wipe; adds repo noise; risk of accidental secret inclusion | **Deferred design** — not default; requires a separate explicit gate before use |
| **In-memory only** | Reset on workflow stop/restart; unsafe for idempotency | Not acceptable |

**Recommendation:** use n8n-side state (Data Store or static data) first. GitHub writes for state should not be introduced without a separate explicit design and gate decision. Repo noise and secret risk increase with GitHub writes.

---

## 7. Duplicate prevention rules

Before sending any notification:

1. Compute idempotency key `K` for the current candidate done file.
2. Look up `K` in the state store.
3. If `K` is present in the state store: **skip** — no notification — log `skipped: duplicate`.
4. If `K` is absent: proceed to send.
5. If send **succeeds**: store `K` in the state store — log `sent`.
6. If send **fails**: do **not** store `K` — log `failed: telegram_error` — fail closed for this execution cycle.
7. If state store is **unavailable** (read or write): **fail closed** — do not send — log `failed: state_store_unavailable`.
8. If candidate key **cannot be parsed**: **fail closed** — do not send — log `failed: key_parse_error`.

**No exception to rule 7 or 8 is acceptable.** Sending without confirming state store write is not acceptable.

---

## 8. Message format

Pinned MVP message (plain text, single line):

```
Alina Lavoro · task {task_id_or_slug} done · commit {short_hash} · INBOX pending: {N} · scrivi aggio per post-check
```

| Placeholder | Value |
|-------------|-------|
| `{task_id_or_slug}` | Basename of done file without `.md` |
| `{short_hash}` | First 7 characters of commit hash |
| `{N}` | Count of `### D-` entries under `## Pending` in `docs/INBOX.md`; render `0` on read failure — do not fail the notification |

**Note:** the INBOX pending count read at notification time may be stale by a few minutes in a scheduled workflow. This is acceptable for the current MVP. If the pending count cannot be reliably read at schedule activation time, render `0` as fallback.

Message must not contain:
- Markdown formatting characters (`_`, `*`, `[`, `]`)
- any token, chat id, or credential value
- any `D-NNNN-X = N` directive
- any command addressed to any system other than the human user
- URLs with token query strings

---

## 9. Schedule recommendation

- **Start with a conservative interval:** 5 minutes (matching the existing queue reader), timezone Europe/Berlin.
- **Only after a separate future schedule activation gate** (currently pending as D-0173-A).
- Schedule must be **disabled by default** until the gate is explicitly opened.
- The first scheduled run after activation should be observed manually.
- Do not activate the Schedule Trigger and immediately leave unattended.

---

## 10. Observability

Allowed to log in n8n execution history (on VPS, not in repo):

- timestamp (UTC)
- task id / slug
- idempotency key used
- decision: `sent` / `skipped: duplicate` / `failed: <reason>`
- skip reason when applicable
- INBOX pending count used in the message
- send result code (HTTP 200 or failure code)

Forbidden to log:

- Telegram bot token (full or partial)
- Telegram chat id (numeric value)
- session cookies
- URLs with token query strings
- any other secret or OAuth material

No workflow JSON export/import should include credential values. If exported for documentation, redact all credentials before committing.

---

## 11. Stop conditions

Stop immediately and do not proceed with schedule activation (or any other runtime change) if any of the following is observed:

- duplicate Telegram message received
- state store key missing or unreadable after a successful send
- unexpected Telegram API error not handled by fail-closed path
- workflow sends without a valid manual or scheduled gate
- Telegram bot token or chat id appears in logs, docs, repo, or AI chat
- existing queue reader (`TEST - GitHub list Alina task queue`) is touched unexpectedly
- any schedule activation occurs without an explicit user decision and separate gate
- any INBOX entry is written by the notifier workflow
- any `D-NNNN-X = N` string is produced by the workflow

On any stop condition: disable the workflow immediately, document the incident, and do not resume without a new explicit decision.

---

## 12. Recovery / rollback

| Action | How |
|--------|-----|
| Soft disable | Set Schedule Trigger node to Inactive; set workflow to Inactive in n8n UI |
| Remove schedule | Delete Schedule Trigger node from workflow; keep Manual Trigger for manual testing |
| Credential disable | Disable or remove `telegram_alina_notifier` in n8n credentials UI |
| Bot kill switch | Revoke bot token via BotFather; any pending send returns 401 and fails closed |
| State store reset | If duplicate notifications occurred due to state store reset, clear and re-seed the state for current done files |
| Workflow delete | Delete notifier workflow from n8n entirely; queue reader is unaffected |
| Audit retention | Do not delete done markers, session files, or INBOX history after incident |
| App rollback | Not involved; this workflow touches no `src/**`, `gas-current/**`, or `appsscript.json` |

---

## 13. Schedule activation checklist

Before requesting a schedule activation gate (D-0173-A), the following must all be true:

- [ ] Manual test succeeded (done: task 0170)
- [ ] This runbook exists (done: task 0172)
- [ ] Idempotency key defined (`(done_file_path, done_file_sha)` or fallback)
- [ ] State store chosen and confirmed available in n8n instance
- [ ] Duplicate skip path designed and documented
- [ ] Failure path is fail-closed for all error conditions
- [ ] No secrets in repo (verified with `git diff --cached | grep -E "[0-9]{8,}:[A-Za-z0-9_-]{30,}"`)
- [ ] Separate Decision Packet (D-0173-A) approved by user
- [ ] Queue reader workflow confirmed untouched
- [ ] First scheduled execution will be observed manually before leaving unattended

---

**Pending gate handoff (task 0176, 2026-05-13):** D-0173-A is pending. Before any schedule activation, read: `docs/automation/telegram-schedule-activation-pending-gate-handoff.md`. Do not activate schedule or record D-0173-A without explicit user response.

*This document is docs-only. No runtime was performed. No n8n UI action. No Telegram message. No Schedule Trigger. No workflow JSON export/import. No token or chat id in repo. Authorization: D-0171-A = 3 (task 0171, 2026-05-13).*
