# Telegram Notifier — Idempotency State-Store Implementation Design

**Task:** 0178
**Date:** 2026-05-13
**Type:** docs-only / pre-runtime implementation design
**Authorization prerequisite:** D-0180-A must be decided before any n8n UI implementation step
**Status:** design only — no runtime performed — **D-0180-A = 1 decided (task 0182, 2026-05-13); idempotency/state-store runtime gate is now open**

**Gate update (task 0182, 2026-05-13):** D-0180-A = 1 recorded. Implementation authorized.

**Implementation update (task 0185, 2026-05-14):** User implemented Data Table path. Data Table `alina_telegram_notifier_state` created with all columns from §6 schema. Idempotency nodes implemented per §3 target shape. IF condition corrected to `{{ $json.notification_state_decision === "send" }}`. One manual send/write test succeeded by user report.  
**Duplicate-skip validation update (batch 0188–0190, 2026-05-14):** D-0187-A = 1 decided — exactly one duplicate-skip validation run authorized. Runtime handoff: `docs/automation/telegram-duplicate-skip-validation-runtime-handoff.md`.  
**Validation outcome (batch 0191–0193, 2026-05-14):** D-0187-A consumed, result INCONCLUSIVE. Validation run used task 0190 as latest done file (different from original test), generating new idempotency key. Workflow correctly executed send/store for new key. Duplicate-skip logic not tested. D-0193-A pending for retry against same 0190 key.  
**Retry outcome (batch 0194–0198, 2026-05-14):** D-0193-A applied (= 1) per the user's prior conditional order; one manual run executed; TRUE branch / Telegram arrived. Classification: INCONCLUSIVE / likely new-key send due to latest-done drift, NOT a confirmed idempotency bug. D-0193-A consumed. **D-0197-A pending** for one pinned-file duplicate-skip validation run.  
**Pinned-file requirement (§10 clarification):** Same-key validation cannot be reliably performed with dynamic "Pick latest done file" while docs-only batches keep adding new done files. Pinned input `(done_file_path, done_file_sha)` is required. Design: `docs/automation/telegram-pinned-file-duplicate-skip-validation-design.md`.

---

## 1. Purpose

This document designs the future n8n runtime implementation of idempotency and state-store logic for the Telegram Mode A completion notification workflow.

No runtime is performed by this document. No n8n UI action. No Telegram message. No Schedule Trigger. All n8n runtime implementation steps require a separate explicit gate (currently D-0180-A — pending).

This design exists so that when D-0180-A is opened, the implementer has a clear, safe path to follow.

---

## 2. Current preconditions

| Item | State |
|------|-------|
| Telegram manual test | Succeeded by user report (task 0170) |
| Workflow `TEST - Alina task completion Telegram notifier` | Inactive — no Schedule Trigger |
| Idempotency state-store in n8n | Not yet implemented |
| Runbook | Exists: `docs/automation/telegram-notifier-runbook-idempotency-hardening.md` |
| Implementation checklist | Exists: `docs/automation/telegram-notifier-idempotency-implementation-checklist.md` |
| D-0173-A | Decided = 3 (schedule deferred; implement idempotency first) |
| D-0180-A | **Pending** — runtime implementation gate for idempotency/state-store |
| Schedule activation gate | Not open; requires separate gate after idempotency validated |

---

## 3. Target workflow shape

### Current workflow

```
Manual Trigger
→ List done files          (GitHub API: docs/tasks/done/)
→ Pick latest done file    (filter and select)
→ Get done file            (GitHub API: read file content + sha)
→ Build notification payload  (assemble message string)
→ Telegram                 (send message)
```

### Target workflow after idempotency implementation

```
Manual Trigger
→ List done files                  (GitHub API: docs/tasks/done/)
→ Pick latest done file            (filter and select candidate)
→ Get done file                    (GitHub API: read file content + sha)
→ Build notification payload       (assemble message string)
→ Build idempotency key            (compute key from file path + sha)
→ Load notification state          (query n8n Data Store / static data)
→ Decide: send or skip             (IF key exists in state → skip; else → send)
  ├─ IF duplicate (key found):
  │    → Log skip: duplicate
  │    → END (no Telegram send)
  └─ IF new (key not found):
       → Telegram                  (send message)
       → IF send success:
       │    → Store notification state (write key + metadata to Data Store)
       │    → Log: sent
       └─ IF send fail:
            → Log: failed (no state written)
            → Fail closed (no retry in this execution)
```

**Rules for the target shape:**

- do not modify the existing queue reader (`TEST - GitHub list Alina task queue`) — this is a sibling workflow
- the Manual Trigger must remain present for manual testing after implementation
- no Schedule Trigger is added in this implementation step
- no deletion from any `done/`, `queue/`, `processing/`, or `failed/` directory
- no write to `docs/INBOX.md`

---

## 4. Recommended idempotency key

**Primary key:**

```
(done_file_path, done_file_sha)
```

Where:
- `done_file_path` = the full path of the done file in the repository (e.g. `docs/tasks/done/0170-record-single-manual-telegram-test-success.md`)
- `done_file_sha` = the Git blob SHA of the file as returned by the GitHub List/Get file API (`sha` field)

**Why this key:** the GitHub blob SHA changes when the file content changes. Using the SHA prevents re-notification if a task ID is reused (unusual but possible) and detects re-commits of the same done file with different content.

**Fallback key (if SHA is unavailable):**

```
(task_id, short_commit_hash)
```

Where:
- `task_id` = basename of the done file without `.md`
- `short_commit_hash` = first 7 characters of the most recent commit hash touching that file (if obtainable from the API)

**Key computation rules:**

- if the primary SHA is present: use primary key
- if SHA is absent and fallback fields are complete: use fallback key
- if neither can be fully computed: **fail closed** — do not send
- the computed key must be a non-empty string deterministic from the done file state
- concatenate fields with a separator (`::` or `/`) to form the storage key string

---

## 5. n8n state-store options

### Option 1 — n8n Data Store / Data Table (recommended)

Available as a native n8n node in recent versions. Provides a key/value or row-based persistent store scoped to the n8n instance.

**Pros:**
- persistent across workflow executions and n8n restarts (if backed by disk)
- clean native API; no external dependencies
- no GitHub writes; no repo noise
- no secrets in stored data (only idempotency key + safe metadata)

**Cons:**
- may not be available in older n8n versions (check n8n instance version first)
- data may be lost if n8n is fully reinstalled without backup

**Recommended as first choice.** If unavailable, fall back to Option 2.

### Option 2 — Workflow static data (`$getWorkflowStaticData('global')`)

n8n's built-in mechanism to persist a JavaScript object across executions of the same workflow.

**Pros:**
- available in all n8n versions
- no external nodes required
- no GitHub writes

**Cons:**
- stored per-workflow; lost on workflow deletion or full JSON reimport
- limited scalability for large state objects (though minimal for this use case)
- may reset if the workflow is re-imported to fix a bug

**Acceptable as fallback** if Data Store is unavailable. Use a compact object keyed by idempotency key string.

### Option 3 — GitHub marker file (deferred design)

Writing a state file to the repository (e.g. `docs/automation/telegram-notify-state.json`) as a persistent record of sent notifications.

**Pros:**
- survives n8n reinstall
- auditable in git history

**Cons:**
- introduces repo writes from n8n automation (security/hygiene risk)
- risk of accidentally including secrets in committed state
- adds git noise to the automation workstream repo
- requires a separate explicit gate and design before use

**Not recommended as default. Requires a separate future explicit gate.**

---

## 6. Data schema

Minimal fields to store per sent notification. No token or chat id is stored.

| Field | Type | Description |
|-------|------|-------------|
| `idempotency_key` | string | The computed key (primary or fallback); used as the lookup key |
| `done_file_path` | string | Full repository path of the done file |
| `done_file_sha` | string | Git blob SHA of the done file at notification time; empty string if fallback used |
| `task_id` | string | Basename of done file without `.md` |
| `short_hash` | string | First 7 chars of relevant commit hash; empty string if unavailable |
| `notified_at` | string | ISO 8601 UTC timestamp of the successful send |
| `notification_status` | string | `sent` / `failed` / `skipped_duplicate` |
| `message_preview_safe` | string | Rendered message body without any secret; safe to store/log |
| `workflow_name` | string | Name of the notifier workflow at time of send |

**What is NOT stored:**
- Telegram bot token
- Telegram chat id
- session cookies
- URLs with token query strings
- any OAuth material

---

## 7. Send/skip algorithm

Pseudocode for the `Build idempotency key → Load → Decide → Send → Store` path:

```
candidate = latest done file from List done files
file_path = candidate.path
file_sha  = candidate.sha  (may be empty)

IF file_sha is not empty:
  key = file_path + "::" + file_sha   # primary key
ELSE IF task_id and short_hash are available:
  key = task_id + "::" + short_hash   # fallback key
ELSE:
  LOG "fail closed: idempotency key cannot be computed"
  STOP (no send)

state = lookup(key, state_store)

IF state exists:
  LOG "skip: duplicate — key=" + key
  STOP (no send)

# Key not found → proceed to send
result = send_telegram(message)

IF result.success:
  write(key, {
    idempotency_key: key,
    done_file_path: file_path,
    done_file_sha: file_sha,
    task_id: task_id,
    short_hash: short_hash,
    notified_at: utc_now(),
    notification_status: "sent",
    message_preview_safe: message,
    workflow_name: WORKFLOW_NAME
  }, state_store)
  LOG "sent: key=" + key
ELSE:
  LOG "failed: telegram_error — key=" + key + " — do not write state"
  STOP fail-closed

# State store unavailable at lookup or write:
# → fail closed; no send; log reason
```

---

## 8. Failure modes

| Failure | Response |
|---------|----------|
| State store unavailable at lookup | Fail closed; do not send; log `state_store_read_error` |
| State store unavailable at write | Do not retry; log `state_store_write_error`; key not recorded (may re-fire next cycle) |
| GitHub API failure (List done files) | Fail closed; no candidate; log error |
| GitHub API failure (Get done file) | Fail closed; key cannot be computed; log error |
| Malformed done file (no sha, no path) | Fail closed; key cannot be computed; log `malformed_candidate` |
| Missing SHA, fallback also incomplete | Fail closed; log `key_computation_failed` |
| Telegram send failure (non-429) | Do not write state; log failure; fail closed for this run |
| Telegram 429 (rate limit) | Do not write state; log `rate_limited`; fail closed; respect retry-after |
| Duplicate detected after state reset | Re-fire allowed but must be logged as `state_reset_resend`; user should be notified |
| Workflow accidentally scheduled without idempotency | Stop condition — disable schedule immediately |

---

## 9. Observability

### Allowed to log (n8n execution history, VPS — not in repo)

- timestamp (UTC)
- task id / slug
- idempotency key (safe, no secrets)
- decision: `sent` / `skipped_duplicate` / `failed: <reason>` / `fail_closed: <reason>`
- skip reason when applicable
- INBOX pending count used in the message
- send result HTTP code

### Forbidden to log

- Telegram bot token (full or partial)
- Telegram chat id (numeric value)
- session cookies
- URLs with token query strings
- any OAuth material or credential value

---

## 10. Manual validation path

After implementing idempotency in n8n (future, after D-0180-A is opened):

1. **Dry-run verification (preferred):** temporarily disconnect the Telegram node; fire Manual Trigger; verify idempotency key computation and state-store lookup/write logic is correct using n8n execution output only.
2. **Duplicate skip test (separately gated if needed):** fire Manual Trigger a second time for the same done file; confirm state is loaded and skip is logged — no second Telegram message.
3. **Only after these validations:** consider returning to schedule activation gate.

No Schedule Trigger is added during idempotency implementation step. Schedule activation is a separate gate after idempotency is validated.

---

## 11. Scope exclusions

This implementation design does not authorize:

- Schedule Trigger activation
- Queue reader modification
- GitHub writes for state (requires separate gate)
- Provider API LLM
- Billing
- App/deploy/tag/rollback
- Automatic INBOX responses
- Automatic `D-NNNN-X = N` writing
- Any repeated Telegram test message beyond what D-0180-A authorizes

---

*This document is docs-only. No runtime was performed. No n8n UI action. No Telegram message. No Schedule Trigger. No token or chat id in repo. Authorization prerequisite: D-0180-A (pending as of task 0180, 2026-05-13).*
