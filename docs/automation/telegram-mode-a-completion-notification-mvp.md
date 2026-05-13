# Telegram Mode A — Completion Notification MVP

**Task:** 0161
**Date:** 2026-05-13
**Type:** docs-only scaffolding
**Authorization:** D-0157-A = 1 (task 0159, 2026-05-13)

---

## 1. Purpose

This document pins docs-only scaffolding for the Telegram Mode A completion notification MVP.

It is based on `D-0157-A = 1` (recorded task 0159) and the task 0160 plan. It does not implement Telegram. It does not authorize secret storage in the repo. It does not create a Telegram bot, token, or chat id. No runtime is activated by this document.

The goal is to fix the MVP scope, message template, trigger model, idempotency key, credential boundary, test sequence, and stop conditions so that a future implementation task can proceed without ambiguity.

---

## 2. Current posture

| Item | State |
|------|-------|
| Decision recorded | `D-0157-A = 1` (task 0159, 2026-05-13) |
| Gate posture | Open for future narrow implementation only |
| Telegram bot | Does not exist |
| Telegram token | Does not exist / not stored anywhere |
| Telegram chat id | Not known / not stored |
| Telegram runtime | Not implemented |
| n8n Telegram node | Not created |
| INBOX pending | 0 (as of task 0159) |
| Browser Bridge | Sandbox-only (`tools/browser-bridge-sandbox/`); project-chat deferred (`D-0154-A = 2`) |
| Gate 7 | Closed (Ollama + Cursor CLI not opened) |
| Provider API LLM | Forbidden by default |
| New LLM billing | Forbidden by default |

No Telegram artifacts exist in the repository.

---

## 3. MVP boundary

The MVP is authorized to do exactly and only this:

After a supervised implementer task is marked done (i.e. when `docs/tasks/done/{task}.md` appears on `main`), send **one** Telegram message to a single private chat id.

The message body must include:
- project name (`Alina Lavoro`)
- task id / task slug
- commit hash (short: first 7 chars)
- optional INBOX pending count (number of entries under `## Pending` in `docs/INBOX.md`; render `0` on read failure — do not fail the notification)
- the fixed instruction string: `scrivi aggio per post-check` (verbatim)

Idempotency: `(task_id, commit_hash)` — same pair must not trigger a second message.

Rate-limit: maximum 4 messages per rolling hour; fail closed when exceeded.

The MVP must not go beyond this list without a new Decision Packet.

---

## 4. Explicit non-goals

The MVP must not:

- answer INBOX in any way
- write any `D-NNNN-X = N` response
- create decisions
- execute project actions (no clasp push, no tag, no rollback, no merge)
- open or drive a browser (no Browser Bridge usage)
- use Ollama or any local LLM
- use Cursor CLI / headless / dual-agent
- modify `src/**`, `gas-current/**`, `appsscript.json`, `package.json`, `.github/workflows/**`
- call provider AI APIs (OpenAI, Anthropic, OpenRouter, etc.)
- introduce any new LLM billing or recurring cost
- log or expose the Telegram bot token, chat id, or any secret anywhere in the repo or in commit messages
- be promoted to Mode B / Mode C behavior without a new Decision Packet

---

## 5. Recommended architecture

**Option A — n8n-only notification workflow (recommended)**

A new dedicated n8n workflow (`TEST - Alina task completion Telegram notifier`) that:

- runs on the existing Schedule Trigger cadence (5 min, Europe/Berlin) with a Manual Trigger copy alongside
- lists `docs/tasks/done/` via the existing GitHub credential
- detects new done markers since last run via n8n static-data key (persistent; keyed by `(task_id, commit_hash)`)
- fetches commit metadata via GitHub API to obtain `commit_hash`
- reads `docs/INBOX.md` for pending count (read-only; renders `0` on failure)
- assembles the message string per §7
- sends via the n8n Telegram node using the stored credential
- writes idempotency state into n8n static data keyed by `(task_id, commit_hash)`

**Rules:**

- this is a new sibling workflow — do NOT modify the existing `TEST - GitHub list Alina task queue` queue reader
- the Manual Trigger version must exist for end-to-end validation before the Schedule Trigger is enabled
- no deletion from `done/`, `queue/`, `processing/`, or `failed/` directories
- no write to `docs/INBOX.md`
- each n8n workflow change requires explicit step-by-step user supervision (PRIORITÀ 0); this document does not authorize any n8n runtime modification

**Why Option A over Option B (local script):**

Option B (a local Python script under `tools/`) would require the user to keep a permanent local process running on the Windows workstation, which partially defeats the low-touch objective. Option A reuses the existing n8n + GitHub credential, mirrors the one-workflow-per-concern pattern already in use, and avoids a permanent local process dependency.

---

## 6. Credential boundary

| Rule | Detail |
|------|--------|
| Storage | Telegram bot token and chat id must be stored only as n8n credentials on the existing VPS n8n instance (suggested name: `telegram_alina_notifier`) |
| No repo write | Token and chat id must never be committed to the repo — not in session files, task files, INBOX entries, commit messages, docs, or exported workflow JSON |
| No console log | Token and chat id must never appear in n8n node `console.log` or sticky notes |
| Redaction gate | Any n8n workflow JSON export, if produced and committed, must be fully redacted of credentials, URLs with token query strings, and real chat ids before commit |
| Pre-push check | Before any push touching docs for the future implementation task: `git diff --cached | grep -E "[0-9]{8,}:[A-Za-z0-9_-]{30,}"` must return no match |
| Session reference | Session files must reference the credential by name only (e.g. `credential: telegram_alina_notifier`) — never by token value |
| Credential creation | Bot creation and n8n credential creation are **manual user steps** — Claude Code must not and cannot perform them |

---

## 7. Message template

Pinned MVP message (plain text, single line):

```
Alina Lavoro · task {task_id_or_slug} done · commit {short_hash} · INBOX pending: {N} · scrivi aggio per post-check
```

Substitution rules:

| Placeholder | Value |
|-------------|-------|
| `{task_id_or_slug}` | File name without `.md` (e.g. `0161-telegram-mode-a-mvp-scaffolding`) |
| `{short_hash}` | First 7 characters of the commit hash that created/updated `done/{task}.md` |
| `{N}` | Count of `### D-` entries under `## Pending` in `docs/INBOX.md`; render `0` if file unreadable or pending section empty |

Message rules:

- no Markdown formatting (avoid `_`, `*`, `[`, `]` that Telegram interprets)
- no secrets or credentials in any field
- no URLs with token query strings
- no `D-NNNN-X = N` directive
- no arbitrary commands addressed at any system other than the human user
- the suffix `scrivi aggio per post-check` is mandatory and verbatim

---

## 8. Trigger and idempotency

| Rule | Detail |
|------|--------|
| Trigger source | New file appearance under `docs/tasks/done/{task}.md` on `main` |
| Trigger exclusions | `docs/tasks/processing/`, `docs/tasks/failed/`, `docs/tasks/queue/` — never trigger on these |
| No file deletion | The workflow must not delete any file from any task directory |
| Idempotency key | `(task_id, commit_hash)` stored in n8n static data |
| Duplicate skip | If key already in notified set, skip silently |
| Rate limit | Maximum 4 messages per rolling hour; fail closed when exceeded |
| Telegram 429 | Fail closed; log failure; do not retry within the same rolling window |
| Credential failure | Fail closed; log; do not silence |
| Stable window | After done marker appears, wait for commit propagation (≥ 60 s) before triggering |
| Re-commit guard | If a done marker is re-committed with a new commit hash, re-fire is allowed but must be logged and flagged to the user in the audit log |

---

## 9. Testing ladder

Run in order; stop at first failure.

| Step | Description | Runtime needed |
|------|-------------|----------------|
| 1 | Static/docs review: verify this doc and future implementation prompt match the plan | None |
| 2 | Credential presence check (no-print): confirm `telegram_alina_notifier` exists in n8n UI; use n8n built-in "test connection"; token never printed | n8n UI (user) |
| 3 | Dry-run message rendering: a temporary n8n Function/Code node outputs the rendered string given synthetic `{task_id, commit_hash, pending_count}`; Telegram send node disconnected for this step | n8n UI (user) |
| 4 | Single controlled manual send: fire Manual Trigger with a known recent done task; verify exactly one message arrives in the private test chat | n8n UI (user) + phone |
| 5 | Idempotency test: re-fire Manual Trigger for the same `(task_id, commit_hash)`; confirm no duplicate message is sent | n8n UI (user) |
| 6 | Schedule quiet-cycle test: enable Schedule Trigger; observe one full 5-minute cycle with no new done markers; confirm zero messages sent | n8n UI (user) |
| 7 | Negative path — processing: add a fake file to `processing/` only; confirm no notification | n8n UI (user) |
| 8 | Negative path — failed: add a fake file to `failed/` only; confirm no notification | n8n UI (user) |
| 9 | INBOX-answer static guard: confirm no node writes to `docs/INBOX.md`; review workflow definition manually | Static (user) |

Steps 2–9 require explicit user approval at each step (PRIORITÀ 0 — n8n UI operation). No step is fire-and-forget.

---

## 10. Rollback / disable

| Action | How |
|--------|-----|
| Soft disable | In n8n, set the Schedule Trigger node to Inactive and the workflow to Inactive |
| Credential disable | In n8n, disable or remove the `telegram_alina_notifier` credential |
| Bot kill switch (external) | Revoke the bot token via BotFather; any pending send returns 401 and fails closed |
| Workflow delete | Delete the notifier workflow entirely from n8n; no repo change required |
| Audit retention | Do not delete done markers or session files after disabling; they are audit history |
| App rollback | Not involved; the MVP touches no `src/**`, `gas-current/**`, or `appsscript.json` |

---

## 11. Observability

Allowed to log (in n8n execution history, on the VPS — not in the repo):

- timestamp (UTC)
- task id / slug
- commit hash (short and full)
- rendered message without secrets
- send result code (HTTP 200 or failure code)
- sent vs skipped (skip reason: duplicate / rate-limit)
- INBOX pending count used in the message

Forbidden to log:

- Telegram bot token (full or partial)
- Telegram chat id
- session cookies
- URLs with token query strings
- any third-party secret or OAuth material

Optional: a daily summary session file `docs/sessions/automation-telegram-notify-{YYYY-MM-DD}.md` recording counts only (not message bodies, not chat ids).

---

## 12. Stop conditions

The future implementer must stop immediately and report — without executing — if any of the following occurs:

- Telegram bot token or chat id is not yet available in the n8n credential vault (user step pending)
- Credential path is missing or unclear; implementer is being asked to invent one
- Workspace is dirty with unrelated changes
- Uncertainty about which n8n workflow to touch; the queue reader (`TEST - GitHub list Alina task queue`) must not be modified
- Any step would require exposing a secret in the repo, docs, commit message, exported JSON, or console log
- Any temptation to make the workflow answer INBOX or compose a `D-NNNN-X = N` directive
- Any change to `src/**`, `gas-current/**`, `appsscript.json`, `package.json`, `.github/workflows/**`, or `tools/**` (unless a `tools/` subdirectory was explicitly authorized later for Option B)
- Any provider API key, hosted LLM call, or new billing surface is suggested or required
- Any deploy / tag / rollback is suggested or required
- The user has not granted explicit consent for the current n8n UI step (PRIORITÀ 0)

---

## 13. Next implementation phases

Task sequence (updated task 0167, 2026-05-13):

| Phase | Task | Type | Description |
|-------|------|------|-------------|
| Credential prerequisite guide | 0162 ✅ | docs-only | Credential prerequisite guide created: `docs/automation/telegram-mode-a-credential-prerequisite-guide.md` |
| Credential prerequisite gate | 0163 ✅ | docs-only | `D-0163-A = 1` recorded; manual credential prerequisite gate open |
| Manual credential prerequisite | 0164 ✅ | docs-only record | User reported: bot exists, `telegram_alina_notifier` credential in n8n tested OK, chat id saved privately; no token/chat id in repo |
| Workflow creation gate decision | 0165 ✅ | docs-only | `D-0165-A = 1` recorded; n8n notifier workflow creation gate open |
| Workflow skeleton creation | 0166 ✅ | docs-only record | User reported: workflow `TEST - Alina task completion Telegram notifier` created and saved; node chain: Manual Trigger → List done files → Pick latest done file → Get done file → Build notification payload; no Telegram node; no test message; no Schedule Trigger |
| Telegram node addition gate decision | 0167 ✅ | docs-only | `D-0167-A = 1` recorded; Telegram node addition gate open |
| Telegram node addition completion | 0168 ✅ | docs-only record | User reported: Telegram node added and saved; credential by name only (`telegram_alina_notifier`); text `{{ $json.telegram_message }}`; chat id entered in n8n UI only, not in repo; no test message; no Execute/Test; no Schedule Trigger |
| Single manual test message gate decision | 0169 ✅ | docs-only | `D-0169-A = 1` recorded; exactly one future manual test message gate open |
| Single manual test execution | TBD | n8n UI (user), once only | User executes workflow once manually; verifies one Telegram message arrives; reports result as text; workflow remains inactive; allowed by `D-0169-A = 1`; retry requires separate gate |
| Schedule activation + session record | TBD | n8n UI + docs-only | Enable Schedule Trigger after test succeeds; separately gated |

**Note:** `D-0169-A = 1` authorizes exactly one future manual test message. This task does not send the message. No Schedule Trigger activation is authorized. Chat id must not be recorded in repo/docs/AI chat.

**Critical files for future implementation tasks to read:**

- `docs/automation/telegram-browser-bridge-trigger-coordination-design.md` — canonical Telegram design (Mode A)
- `docs/automation/telegram-mode-a-completion-notification-mvp.md` — this file
- `docs/automation/n8n-workflows/queue-reader.md` — must not be modified; reference only for patterns
- `docs/automation/n8n-workflows/lifecycle-ownership.md` — two valid done patterns
- `docs/automation/runtime-gate-checklist-readiness-matrix.md` — Hard Constraints #1–5
- `docs/automation/runtime-gate-decision-packet-playbook.md` — 8-step lifecycle and anti-patterns
- `docs/automation/candidate-gate-backlog.md` — candidate D state
- `docs/INBOX.md` — read-only for pending count

---

---

## Credential prerequisite guide (task 0162 pointer)

A companion user-guided prerequisite guide exists at:

**`docs/automation/telegram-mode-a-credential-prerequisite-guide.md`** (task 0162, 2026-05-13)

It documents how a future human operator will create the Telegram bot, obtain the token, identify the chat id, and store both in the n8n credential vault — without committing secrets to the repository. Read that guide before beginning any future runtime task.

---

*This document is docs-only. No Telegram bot was created. No token was stored. No runtime was activated. No n8n workflow was modified. Authorization: D-0157-A = 1 (task 0159, 2026-05-13).*
