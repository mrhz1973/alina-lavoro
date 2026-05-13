# Browser Bridge Sandbox — Hardening / Manual Verification Plan

**Task:** 0156
**Date:** 2026-05-13
**Type:** docs-only — no runtime, no project-chat, no gate change

---

## 1. Purpose

This document is a **docs-only** hardening and manual verification plan for
the already implemented Browser Bridge dry-run and sandbox phases.

It does **not** authorize project-chat write.
It does **not** reopen or supersede D-0154-A.
It does **not** execute any runtime.
It does **not** create, modify, or call any script.

Use this as a readiness reference if the user later revisits the project-chat
Decision Packet.

---

## 2. Current status

| Phase | Status | Task |
|-------|--------|------|
| Dry-run | ✅ Implemented | 0150 — `tools/browser-bridge-dry-run/browser-bridge-dry-run.py` |
| Sandbox | ✅ Implemented | 0153 — `tools/browser-bridge-sandbox/browser-bridge-sandbox.py` + `sandbox.html` |
| Project-chat write | 🔵 **Deferred** | D-0154-A = 2 decided in task 0155 |
| INBOX | 0 pending decisions | — |

Browser Bridge is currently at **sandbox-only state**.
No project-chat automation exists or is authorized.

---

## 3. Safety boundary

### Allowed (when explicitly invoked by user)

- Running `tools/browser-bridge-dry-run/browser-bridge-dry-run.py` with `--message aggio`.
- Running `tools/browser-bridge-sandbox/browser-bridge-sandbox.py` with `--message aggio` and `--no-open` or allowing local browser open to `file://…/sandbox.html`.
- Inspecting `.local/browser-bridge-dry-run/dry-run-output.jsonl`.
- Inspecting `.local/browser-bridge-sandbox/sandbox-output.jsonl`.
- Inspecting `.local/browser-bridge-sandbox/sandbox-page-state.json`.

### Forbidden (hard constraints, no exceptions)

- Writing to the real ChatGPT / Claude.ai project chat.
- Reading or answering `docs/INBOX.md` from any bridge.
- Writing any `D-NNNN-X = N` response via automation.
- Sending arbitrary text (any message other than the literal `aggio`).
- Hidden or background browser automation.
- Targeting any external URL or hostname.
- API key, provider API, billing.
- n8n runtime modification.
- Telegram configuration.
- Ollama install or model pull.
- Cursor CLI/headless execution.
- Gate 7 activation.
- App source modification (`src/**`).
- Apps Script deploy, tag, rollback.

---

## 4. Manual verification checklist

Run these steps manually only when desired. None are mandatory now.

### 4.1 Static inspection (no execution)

- [ ] Read `tools/browser-bridge-dry-run/README.md` — confirm allowed command, output paths, gate status.
- [ ] Read `tools/browser-bridge-sandbox/README.md` — confirm allowed command, `--no-open` flag, safety boundary, gate status.
- [ ] Read `tools/browser-bridge-dry-run/browser-bridge-dry-run.py` — confirm:
  - no network call;
  - no browser launch;
  - only `aggio` allowed;
  - `D-` and `=` rejected;
  - idempotency and rate-limit present;
  - output path is `.local/browser-bridge-dry-run/` only.
- [ ] Read `tools/browser-bridge-sandbox/browser-bridge-sandbox.py` — confirm:
  - no external URL;
  - `FORBIDDEN_TARGET_STRINGS` present and populated;
  - `file://` scheme enforced;
  - target hard-coded to `sandbox.html`;
  - only `aggio` allowed;
  - `D-` and `=` rejected;
  - idempotency and rate-limit present;
  - fail-closed on validation error;
  - `--no-open` flag present.
- [ ] Read `tools/browser-bridge-sandbox/sandbox.html` — confirm:
  - no external script/stylesheet/font/image;
  - no `fetch`, XHR, beacon, or websocket;
  - no form targeting an external site;
  - no real ChatGPT / Claude.ai URL.

### 4.2 Help-only check (no side effects)

```
python tools/browser-bridge-dry-run/browser-bridge-dry-run.py --help
python tools/browser-bridge-sandbox/browser-bridge-sandbox.py --help
```

Expected: usage text displayed, no file written, exit 0.

### 4.3 Optional safe sandbox run (local evidence only)

```
python tools/browser-bridge-sandbox/browser-bridge-sandbox.py \
  --task-id manual-check \
  --commit-hash hardening-plan \
  --message aggio \
  --no-open
```

Expected:
- one JSONL record appended (or skipped as duplicate if already run with same key);
- state JSON written;
- all safety flags `false`;
- exit 0.

**Do not** run without `--no-open` unless you explicitly want to open a local
browser window. The launched URL would be `file://…/sandbox.html` only.

### 4.4 Optional evidence inspection

```
type .local\browser-bridge-sandbox\sandbox-output.jsonl
type .local\browser-bridge-sandbox\sandbox-page-state.json
```

Verify every record has:
- `mode: sandbox`
- `target: local_sandbox_file_only`
- `browser_context: throwaway_local_file`
- `project_chat_used: false`
- `chatgpt_or_claude_used: false`
- `inbox_read: false`
- `inbox_answered: false`
- `network_used: false`
- `external_url_used: false`

### 4.5 Stop conditions

Stop immediately and do not continue if any of the following occur:

- A command tries to open a URL other than `file://…/sandbox.html`.
- Any record shows a safety flag set to `true`.
- Any error message mentions an external hostname.
- The script asks for credentials, tokens, or API keys.

---

## 5. Hardening checks for future implementers

Before any reconsideration of the project-chat Decision Packet, a future agent
or review should confirm that all of the following remain true.

| Check | Expected state |
|-------|---------------|
| No external URL in sandbox Python script | ✅ |
| No external URL in `sandbox.html` | ✅ |
| No forbidden hostname in `FORBIDDEN_TARGET_STRINGS` list is missing | ✅ (`chatgpt.com`, `chat.openai.com`, `claude.ai`, `openai.com`, `anthropic.com`) |
| `docs/INBOX.md` is not read or accessed by either script | ✅ |
| No browser profile or session persistence (no profile path in script) | ✅ |
| No credentials, tokens, or OAuth material in any script | ✅ |
| No network call in either script | ✅ |
| No arbitrary message capability (allowlist enforced) | ✅ |
| `aggio` allowlist preserved | ✅ |
| `D-` and `=` rejection preserved | ✅ |
| Idempotency key includes `mode` field | ✅ |
| Rate limit enforced (4 per rolling hour) | ✅ |
| Fail-closed on validation error (no record written) | ✅ |
| Target validation rejects non-sandbox HTML path | ✅ |
| `--no-open` flag present and tested | ✅ |
| All output written only under `.local/browser-bridge-sandbox/` | ✅ |

If any of these checks fail after a code change, the change must be reverted or
corrected before project-chat reconsideration proceeds.

---

## 6. Reconsideration criteria

A future project-chat Decision Packet could be reconsidered when **all** of the
following conditions are satisfied:

1. **User explicitly asks** — no implementation prompt may be generated without
   explicit user request via a new or reopened DP in `docs/INBOX.md`.
2. **Sandbox manual verification is satisfactory** — the checklist in Section 4
   has been run and passed by the user.
3. **Target chat selection can be visibly user-controlled** — the user can see
   exactly which browser tab or window the bridge will type into, before it acts.
4. **Bridge can still write only `aggio`** — the allowlist is enforced; no
   arbitrary text capability has been added.
5. **No INBOX read/answer** — Hard Constraint #4 is preserved; the bridge
   cannot read `docs/INBOX.md` and cannot write any `D-NNNN-X = N` response.
6. **No hidden background automation** — the bridge is visible to the user and
   requires active user confirmation or a clear opt-in step.
7. **Clear stop/abort procedure exists** — the user can kill the bridge at any
   point without side effects.

None of these conditions are currently met for project-chat (condition 1 alone
is currently unmet — no new DP has been created).

---

## 7. Anti-creep rules

| Rule |
|------|
| Sandbox implementation success is **not** authorization for project-chat write. |
| D-0154-A = 2 (deferral) is **not** a permanent rejection — it is an explicit deferral that can be reconsidered via a new DP. |
| Project-chat write requires a **new or reopened Decision Packet** in `docs/INBOX.md` and an explicit user response. |
| Docs-only hardening is **not** runtime permission. |
| A note in a personal Obsidian vault or any other external tool is **not** authorization. |
| A "quick test" in the real ChatGPT / Claude.ai chat is **not** allowed without a formal gate. |
| This plan does **not** move candidate C out of deferred state. |

---

## 8. Recommended current posture

- Keep Browser Bridge at **sandbox-only state**.
- Do not generate any project-chat implementation prompt.
- Use this hardening plan as a readiness reference if the user later revisits
  the project-chat Decision Packet.
- The next runtime action, if ever desired, is to create a new or reopened
  Decision Packet for project-chat write (`D-NNNN-A`) and wait for an explicit
  user response before generating any implementation prompt.

---

## References

| Document | Role |
|----------|------|
| `docs/automation/local-browser-bridge-preflight-design.md` | Phased Browser Bridge design |
| `docs/automation/candidate-gate-backlog.md` | Candidate C = project-chat (deferred) |
| `docs/INBOX.md` | D-0154-A decided (response: 2, deferred) |
| `tools/browser-bridge-dry-run/README.md` | Dry-run tool (task 0150) |
| `tools/browser-bridge-sandbox/README.md` | Sandbox tool (task 0153) |
| `docs/automation/runtime-gate-checklist-readiness-matrix.md` | Gate readiness matrix |
| `docs/automation/runtime-gate-decision-packet-playbook.md` | Gate DP playbook |
