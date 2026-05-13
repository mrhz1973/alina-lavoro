# Browser Bridge — Sandbox

**Status:** sandbox only — local file only, throwaway browser context only.
**Gate:** D-0151-A = 1 (recorded task 0152). This gate opens the sandbox phase only.
**Project-chat remains a separate future gate.**

---

## Purpose

A local Python script that validates the browser-side mechanics of the
Browser Bridge in a fully isolated context.

The sandbox target is exclusively the local static file
`tools/browser-bridge-sandbox/sandbox.html`, opened (when not skipped) as a
`file://` URL in the system default browser as a throwaway context.

No real ChatGPT / Claude.ai surface is ever touched.
No external network is ever used.
The `docs/INBOX.md` file is never read or answered.

---

## What this tool does NOT do

- Does not open ChatGPT, Claude.ai, OpenAI, Anthropic, or any external site.
- Does not automate a real logged-in browser session.
- Does not access the real project chat.
- Does not read `docs/INBOX.md`.
- Does not answer any Decision Packet.
- Does not write any `D-NNNN-X = N` response.
- Does not perform any network request.
- Does not call any provider API.
- Does not create tokens or API keys.
- Does not configure or use Telegram.
- Does not modify n8n, Ollama, or Cursor.
- Does not deploy, tag, or rollback.
- Does not modify app source (`src/**`).
- Does not install third-party packages (Playwright, Selenium, AutoHotkey, etc.).

---

## Allowed command

```
python tools/browser-bridge-sandbox/browser-bridge-sandbox.py \
  --task-id <TASK_ID> \
  --commit-hash <COMMIT_HASH_OR_LABEL> \
  --message aggio
```

To run without opening any browser (writes evidence only):

```
python tools/browser-bridge-sandbox/browser-bridge-sandbox.py \
  --task-id <TASK_ID> \
  --commit-hash <COMMIT_HASH_OR_LABEL> \
  --message aggio \
  --no-open
```

Only `--message aggio` is allowed. Any other message is rejected with a
non-zero exit and no record is written.

---

## Output files

| Path | Role |
|------|------|
| `.local/browser-bridge-sandbox/sandbox-output.jsonl` | One JSONL line per successful sandbox record (append-only). |
| `.local/browser-bridge-sandbox/sandbox-page-state.json` | Last-known sandbox state snapshot (overwritten each successful run). |

Each successful JSONL record contains, among other fields:

| Field | Value |
|-------|-------|
| `mode` | `sandbox` |
| `target` | `local_sandbox_file_only` |
| `sandbox_file` | `tools/browser-bridge-sandbox/sandbox.html` |
| `browser_context` | `throwaway_local_file` |
| `browser_open_attempted` | `true` or `false` |
| `browser_open_result` | `opened`, `unavailable`, or `skipped` |
| `project_chat_used` | `false` |
| `chatgpt_or_claude_used` | `false` |
| `inbox_read` | `false` |
| `inbox_answered` | `false` |
| `network_used` | `false` |
| `external_url_used` | `false` |

---

## Safety rules

| Rule | Detail |
|------|--------|
| Allowed messages | `aggio` only |
| Max message length | 20 characters |
| Rejected patterns | Any message containing `D-` or `=` |
| Allowed URL scheme | `file://` only |
| Forbidden target substrings | `chatgpt.com`, `chat.openai.com`, `claude.ai`, `openai.com`, `anthropic.com` |
| Allowed sandbox target | `tools/browser-bridge-sandbox/sandbox.html` only |
| Idempotency | Skips duplicate `(task_id, commit_hash, message, mode)` |
| Rate limit | Max 4 successful sandbox records per rolling hour |
| Failure mode | Fail closed — no fallback to network, API, or real chat |

---

## Browser open behavior

The launcher may attempt to open the local sandbox HTML via
`webbrowser.open(file_url)`. The launched URL is always a `file://` path
that points at the static `sandbox.html` in this directory.

- If `--no-open` is passed, no browser is launched and the run records
  `browser_open_attempted: false`, `browser_open_result: skipped`.
- If the browser is not available or `webbrowser.open` returns false, the
  record carries `browser_open_result: unavailable`. The launcher never
  falls back to any external URL or real chat.

---

## Exit codes

| Code | Meaning |
|------|---------|
| 0 | Record written OK or skipped as duplicate. |
| 1 | Validation error, target validation error, or rate limit exceeded. No record written. |

---

## Gate boundaries

This tool is the sandbox phase only. It must not be expanded into a
project-chat tool, an INBOX reader, or an INBOX responder.

The next phase, if ever desired, is the Browser Bridge project chat write.
That phase requires a **separate Decision Packet** and an explicit user
response recorded in `docs/INBOX.md`. The project chat phase remains a
future gate that is not opened by D-0151-A.

---

## Dependencies

Python standard library only. No third-party packages required.
Tested with Python 3.11+.

---

## Technical context

| Document | Role |
|----------|------|
| `docs/automation/local-browser-bridge-preflight-design.md` | Phased Browser Bridge design (dry-run → sandbox → project chat) |
| `docs/automation/candidate-gate-backlog.md` | Candidate B = sandbox gate (opened by D-0151-A = 1) |
| `docs/INBOX.md` | Decision record: D-0151-A = 1 (Decided, 2026-05-13) |
| `tools/browser-bridge-dry-run/README.md` | Prior phase (dry-run) — already implemented in task 0150 |
