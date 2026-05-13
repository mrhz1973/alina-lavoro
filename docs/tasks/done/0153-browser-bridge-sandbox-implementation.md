# Task 0153 — Browser Bridge Sandbox Implementation

- Project: Alina Lavoro
- Type: automation-tools
- Priority: normal
- Status: done
- Deploy: no
- Created: 2026-05-13
- Completed: 2026-05-13

## Objective

Implement the local Browser Bridge sandbox launcher
(`tools/browser-bridge-sandbox/browser-bridge-sandbox.py`) and the static
local sandbox surface (`tools/browser-bridge-sandbox/sandbox.html`).

The sandbox phase is the second concrete step of the Browser Bridge path
(dry-run → sandbox → project chat). Its scope is fully isolated:

- Python stdlib only
- target exclusively `tools/browser-bridge-sandbox/sandbox.html` via `file://`
- optional `webbrowser.open(file_url)` only (with `--no-open` to skip)
- writes only under `.local/browser-bridge-sandbox/`
- never touches the real ChatGPT / Claude.ai project chat
- never reads or answers `docs/INBOX.md`

Authorization: D-0151-A = 1 (recorded task 0152). Opens sandbox phase only.
Project-chat phase remains a separate future gate.

## Done status

**Completed by:** Claude Code (local)
**Completion date:** 2026-05-13
**Completion commit:** (see session)
**Session:** `docs/sessions/2026-05-13-browser-bridge-sandbox-implementation.md`

### Files created

| File | Role |
|------|------|
| `tools/browser-bridge-sandbox/browser-bridge-sandbox.py` | Main sandbox launcher |
| `tools/browser-bridge-sandbox/sandbox.html` | Static local throwaway sandbox surface |
| `tools/browser-bridge-sandbox/README.md` | Usage, constraints, gate status |
| `.local/browser-bridge-sandbox/sandbox-output.jsonl` | Sandbox evidence (append-only JSONL) |
| `.local/browser-bridge-sandbox/sandbox-page-state.json` | Last-known sandbox state snapshot |
| `docs/tasks/done/0153-browser-bridge-sandbox-implementation.md` | This done marker |
| `docs/sessions/2026-05-13-browser-bridge-sandbox-implementation.md` | Session record |

### Files updated

| File | Change |
|------|--------|
| `docs/LLMS.md` | Last completed → 0153; Browser Bridge Sandbox row updated to implemented |
| `docs/wiki/current-state.md` | Last completed → 0153 |
| `docs/automation/candidate-gate-backlog.md` | Candidate B: sandbox implemented (no-open) — local file only, no project chat, no INBOX |

### Commands run

```
python tools/browser-bridge-sandbox/browser-bridge-sandbox.py --help
python tools/browser-bridge-sandbox/browser-bridge-sandbox.py --task-id 0153 --commit-hash sandbox-no-open --message aggio --no-open
python tools/browser-bridge-sandbox/browser-bridge-sandbox.py --task-id 0153 --commit-hash sandbox-no-open --message aggio --no-open
python tools/browser-bridge-sandbox/browser-bridge-sandbox.py --task-id 0153 --commit-hash sandbox-invalid --message "D-0151-A = 1" --no-open
```

### Check results

| Check | Result |
|-------|--------|
| `--help` | OK — usage, constraints, sandbox scope, `--no-open` flag all shown |
| Valid `--no-open` sandbox run | OK — one JSONL record + state JSON written |
| Duplicate `--no-open` sandbox run | OK — `SKIP: duplicate record (idempotency_key=0153\|sandbox-no-open\|aggio\|sandbox)`; no second record appended |
| Invalid message `D-0151-A = 1` | OK — exit 1, `ERROR: Message must not contain 'D-'`; no record appended |
| Optional browser-open run | **Skipped intentionally** — automated implementer context; opening a browser would disrupt the user. `--no-open` evidence is the validated sandbox proof. The launcher supports the open path via `webbrowser.open(file_url)` and was code-tested via `--help` and target validation, but no actual browser window was opened by this task. |
| `git diff --check` | Clean |
| Forbidden paths touched | None |
| `package.json` | Unchanged |
| `appsscript.json` | Unchanged |
| `.github/workflows/` | Unchanged |
| Third-party browser automation deps | None (no Playwright, Selenium, AutoHotkey, browser extension, DesktopCtl) |
| External URLs in script | None — only `file://` to local `sandbox.html` |
| External URLs in `sandbox.html` | None — no external script, stylesheet, font, image, fetch, XHR, beacon, or websocket |
| Provider API / billing | None |
| n8n / Ollama / Telegram / Cursor / Gate 7 | Not touched |
| App source (`src/**`) | Not touched |
| Deploy / tag / rollback | Not performed |
| Sandbox-only confirmed | ✓ |
| Project-chat phase remains gated | ✓ |
| INBOX read | ✓ false |
| INBOX answered | ✓ false |

### JSONL record fields (verified)

| Field | Value |
|-------|-------|
| `mode` | `sandbox` |
| `target` | `local_sandbox_file_only` |
| `sandbox_file` | `tools/browser-bridge-sandbox/sandbox.html` |
| `browser_context` | `throwaway_local_file` |
| `browser_open_attempted` | `false` (this validated run; `--no-open`) |
| `browser_open_result` | `skipped` |
| `project_chat_used` | `false` |
| `chatgpt_or_claude_used` | `false` |
| `inbox_read` | `false` |
| `inbox_answered` | `false` |
| `network_used` | `false` |
| `external_url_used` | `false` |

### Constraints honored

- Python stdlib only (`argparse`, `datetime`, `json`, `os`, `sys`, `webbrowser`)
- No third-party packages, no `package.json` change
- No real ChatGPT / Claude.ai page opened or referenced
- Forbidden target substrings rejected at validation (`chatgpt.com`, `chat.openai.com`, `claude.ai`, `openai.com`, `anthropic.com`)
- Only `file://` scheme allowed
- Target hard-coded to `tools/browser-bridge-sandbox/sandbox.html`
- Does not read `docs/INBOX.md`
- Does not answer any Decision Packet
- Does not write any `D-NNNN-X = N` response
- Allowed message: exactly `aggio`
- Rejects messages containing `D-` or `=`
- Rejects messages over 20 chars
- Idempotency: `(task_id, commit_hash, message, mode)`
- Rate limit: 4 successful sandbox records per rolling hour
- Malformed JSONL lines: skipped with warning, no crash
- Fail closed on any validation error — no network/API/real-chat fallback
- No n8n runtime modification
- No Telegram configuration
- No Ollama installation
- No Cursor CLI/headless execution
- No API key creation
- No provider API
- No billing
- No Gate 7 opening
- No app source modification
- No deploy / tag / rollback

### Authorization mapping

- D-0151-A = 1 (task 0152) opens **sandbox phase only**.
- This task implements the sandbox launcher and surface within that authorization.
- Project-chat phase requires a separate future Decision Packet and a separate INBOX response.
