# Telegram Notifier — Idempotency Implementation Checklist

**Task:** 0179
**Date:** 2026-05-13
**Type:** docs-only / pre-runtime implementation checklist
**Authorization prerequisite:** D-0180-A must be decided (opened) before any n8n UI implementation step
**Status:** checklist only — no runtime performed — **D-0180-A = 1 decided (task 0182, 2026-05-13); this checklist is now active for one-step-at-a-time supervised implementation**

**Gate update (task 0182, 2026-05-13):** D-0180-A = 1 recorded. Checklist activated.

**Implementation update (task 0185, 2026-05-14):** Sections 3.1–3.10 completed by user report. Data Table path chosen (§3.2: Data Store available). All nodes implemented per checklist. IF condition corrected to `{{ $json.notification_state_decision === "send" }}`. One send/write test succeeded (§6, partial). Duplicate-skip validation (§6 full) pending — D-0187-A in `docs/INBOX.md`. Fail-closed validation (§7) not yet performed. Secret hygiene (§8) maintained — no token/chat id in repo. Schedule activation still excluded and separately gated.

---

## 1. Purpose

This checklist provides a step-by-step guide for the future n8n runtime implementation of idempotency and state-store logic in the Telegram Mode A completion notification workflow.

**This checklist is docs-only. It does not authorize runtime.** Every n8n UI step listed below requires D-0180-A or another explicit gate before execution. No step in this checklist may be executed without prior explicit user decision.

No Schedule Trigger is included in this checklist. Schedule activation is a separate gate after idempotency is implemented and validated.

Design reference: `docs/automation/telegram-notifier-idempotency-state-store-implementation-design.md`

---

## 2. Pre-runtime checklist

Before touching n8n:

- [ ] D-0180-A has been responded to with option 1 (gate open) and recorded in `docs/INBOX.md`
- [ ] `docs/automation/telegram-notifier-idempotency-state-store-implementation-design.md` has been read in full
- [ ] `docs/automation/telegram-notifier-runbook-idempotency-hardening.md` permanent boundaries re-read
- [ ] Workflow `TEST - Alina task completion Telegram notifier` confirmed inactive in n8n UI
- [ ] No Schedule Trigger is active in the workflow
- [ ] n8n instance version checked — note whether n8n Data Store node is available
- [ ] Queue reader workflow (`TEST - GitHub list Alina task queue`) confirmed untouched — it must not be modified
- [ ] Working branch: `main`; `git pull origin main` executed
- [ ] No token or chat id in the open editor or clipboard that could be committed
- [ ] User is physically present at the n8n UI (PRIORITÀ 0 — one step at a time)

---

## 3. n8n UI implementation checklist

Each step must be confirmed complete before the next step begins. Do not batch multiple steps.

### Step 3.1 — Verify existing workflow topology

- [ ] Open `TEST - Alina task completion Telegram notifier` in n8n
- [ ] Confirm current node chain matches:
  - Manual Trigger → List done files → Pick latest done file → Get done file → Build notification payload → Telegram
- [ ] Note the exact node names for reference
- [ ] Do not change any existing node at this point

### Step 3.2 — Check n8n Data Store availability

- [ ] In n8n node library, search for "Data Store" or "Data Table"
- [ ] If available: proceed to Step 3.3 (Data Store path)
- [ ] If not available: proceed to Step 3.3b (Static Data fallback path)
- [ ] Document which path was chosen in the session file

### Step 3.3 (Data Store path) — Add idempotency key computation node

- [ ] After `Get done file`, add a Code / Function node named `Build idempotency key`
- [ ] Implement key computation logic (see design §4):
  - primary: `done_file_path + "::" + done_file_sha`
  - fallback: `task_id + "::" + short_hash`
  - fail closed if neither can be computed
- [ ] Verify output fields: `idempotency_key`, `key_source` (`primary` / `fallback` / `error`)
- [ ] Do not execute yet

### Step 3.3b (Static Data fallback path) — Add idempotency key computation node

- [ ] After `Get done file`, add a Code / Function node named `Build idempotency key`
- [ ] Same key logic as above
- [ ] Do not execute yet

### Step 3.4 — Add state lookup node

**Data Store path:**

- [ ] Add Data Store node named `Load notification state`
- [ ] Operation: get item by key = `{{ $json.idempotency_key }}`
- [ ] If item exists: output `{ state_found: true }`
- [ ] If item not found: output `{ state_found: false }`
- [ ] Add error-handling branch: if Data Store unavailable → fail closed (no send)

**Static Data fallback path:**

- [ ] Add Code node named `Load notification state`
- [ ] Logic: `const state = $getWorkflowStaticData('global'); const key = $json.idempotency_key; const found = !!state[key];`
- [ ] Output `{ state_found: found }`

### Step 3.5 — Add IF node for send/skip decision

- [ ] Add IF node named `Decide: send or skip`
- [ ] Condition: `{{ $json.state_found }}` is `false` → true branch = send; false branch = skip
- [ ] True branch (new key): proceeds to Telegram node
- [ ] False branch (duplicate key): proceeds to skip logger

### Step 3.6 — Add skip logger

- [ ] On the false branch (duplicate), add Code / Set node named `Log skip: duplicate`
- [ ] Log: `{ decision: "skipped_duplicate", key: "...", reason: "already sent" }` (no token, no chat id)
- [ ] This branch ends here — no Telegram send

### Step 3.7 — Move Telegram node to true branch

- [ ] Reconnect the existing Telegram node to be on the true branch of the IF node
- [ ] Verify Telegram node still uses credential by name: `telegram_alina_notifier`
- [ ] Verify text expression: `{{ $json.telegram_message }}`
- [ ] Do not change chat id configuration

### Step 3.8 — Add success state-write node

- [ ] After the Telegram node (success path), add a state-write node named `Store notification state`
- [ ] **Data Store path:** Data Store put/create item with key = `{{ $json.idempotency_key }}`, value = full schema from design §6 (no token, no chat id)
- [ ] **Static Data fallback path:** Code node — `const state = $getWorkflowStaticData('global'); state[$json.idempotency_key] = { ... }; $setWorkflowStaticData('global', state);`
- [ ] This node must only execute AFTER successful Telegram send
- [ ] Add a failure path from Telegram node: if send fails → log error → do NOT write state

### Step 3.9 — Add failure logger

- [ ] On the Telegram node failure path, add Code / Set node named `Log send failure`
- [ ] Log: `{ decision: "failed", key: "...", reason: "telegram_send_error" }` (no token, no chat id)
- [ ] Do not write state on this path

### Step 3.10 — Wire fail-closed path for missing key

- [ ] From `Build idempotency key` node: if `key_source == "error"`, route to Code node named `Log fail closed: key computation`
- [ ] Log: `{ decision: "fail_closed", reason: "key_computation_failed" }`
- [ ] End here — no send

---

## 4. Node-by-node intended changes

Summary of all nodes to be added or modified:

| Node | Action | Position |
|------|--------|----------|
| `Build idempotency key` | Add new | After `Get done file` |
| `Load notification state` | Add new | After `Build idempotency key` (on success path) |
| `Decide: send or skip` | Add new | After `Load notification state` |
| `Log skip: duplicate` | Add new | False branch of `Decide` |
| `Telegram` (existing) | Move / reconnect | True branch of `Decide` |
| `Store notification state` | Add new | After `Telegram` success |
| `Log send failure` | Add new | After `Telegram` failure |
| `Log fail closed: key computation` | Add new | Error path from `Build idempotency key` |

**Nodes that must NOT be changed:**
- `List done files`
- `Pick latest done file`
- `Get done file`
- `Build notification payload`

**Workflows that must NOT be touched:**
- `TEST - GitHub list Alina task queue` (queue reader — sibling workflow)

---

## 5. Data Store / static data checklist

- [ ] Identify the state-store mechanism chosen (Data Store or static data)
- [ ] Confirm no secret fields are stored:
  - No bot token
  - No chat id
  - No credential value
  - No URL with token query string
- [ ] Confirm the idempotency key field is a safe non-secret string
- [ ] Confirm `message_preview_safe` does not contain secret substrings
- [ ] Confirm `workflow_name` is a literal string, not a dynamically resolved secret

---

## 6. Duplicate skip validation checklist

After state-write nodes are implemented (before any Schedule Trigger):

- [ ] Gate: confirm a separate test authorization is open (D-0180-A = 1 is sufficient for duplicate test if within the same gate scope)
- [ ] Fire Manual Trigger with a known recent done file
- [ ] Confirm one Telegram message arrives
- [ ] Confirm state is written to Data Store / static data
- [ ] Fire Manual Trigger again for the same done file
- [ ] Confirm NO second Telegram message arrives
- [ ] Confirm n8n execution log shows `skipped_duplicate`
- [ ] If duplicate message is received: stop immediately; disable Telegram node; investigate state-store logic

---

## 7. Fail-closed validation checklist

- [ ] Temporarily corrupt the idempotency key computation (set SHA to empty, task_id to empty) → verify `fail_closed: key_computation_failed` log; no Telegram send
- [ ] If using Data Store: temporarily disconnect Data Store node → verify `state_store_read_error` or similar; no send
- [ ] Restore to normal configuration after each negative test

---

## 8. Secret hygiene checklist

Before and after every n8n UI session:

- [ ] No bot token typed or pasted in any n8n Code node, Set node, or sticky note visible in session screenshots
- [ ] No chat id value in any node field visible in session screenshots
- [ ] No n8n workflow JSON exported with token values
- [ ] `git diff --cached | grep -E "[0-9]{8,}:[A-Za-z0-9_-]{30,}"` → no output (token-like check)
- [ ] No standalone numeric chat id committed
- [ ] No credential value in session files, commit messages, or docs

---

## 9. Post-implementation documentation checklist

After implementation (future, post D-0180-A):

- [ ] Session file created: `docs/sessions/YYYY-MM-DD-telegram-idempotency-implementation.md`
- [ ] Session file records: nodes added, state-store path chosen, validation steps completed
- [ ] `docs/automation/telegram-notifier-idempotency-state-store-implementation-design.md` updated with implementation notes
- [ ] `docs/INBOX.md` updated: D-0180-A recorded as decided
- [ ] `docs/LLMS.md`, `docs/wiki/current-state.md` updated
- [ ] Done marker created: `docs/tasks/done/NNNN-telegram-idempotency-implementation.md`
- [ ] Selective commit: only allowed paths; no `git add .`
- [ ] Push to main
- [ ] Next gate decision: return to schedule activation gate (D-0173-A successor) only after duplicate skip is validated

---

## 10. Stop conditions

Stop immediately and report if any of the following occurs:

- A Schedule Trigger is added or enabled (not authorized by this checklist)
- A second Telegram test message is authorized or sent beyond the validation steps
- Any bot token or chat id appears in n8n sticky note, Code node, session file, or commit
- The existing queue reader workflow is touched
- Any INBOX response is written automatically
- Any `D-NNNN-X = N` is recorded without an explicit user response
- State write occurs before a successful Telegram send (must be post-send only)
- The workflow is activated or published in n8n (must remain manual-trigger only through this implementation phase)
- Any provider API LLM or new billing is introduced

---

*This document is docs-only. No runtime was performed. No n8n UI action. No Telegram message. No Schedule Trigger. No token or chat id in repo. Authorization prerequisite: D-0180-A (pending as of task 0180, 2026-05-13).*
