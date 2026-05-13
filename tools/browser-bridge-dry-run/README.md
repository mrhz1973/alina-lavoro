# Browser Bridge — Dry-Run

**Status:** dry-run only — local file only.
**Gate:** D-0148-A = 1 (recorded task 0149). This gate opens the dry-run only.
**Sandbox and project-chat remain separate future gates.**

---

## What this tool does

A local Python script that validates browser-bridge mechanics without any browser,
network, ChatGPT / Claude.ai write, or INBOX interaction.

It writes a JSONL record to `.local/browser-bridge-dry-run/dry-run-output.jsonl`
with all safety flags set to `false`.

---

## What this tool does NOT do

- Does not open a browser.
- Does not automate a browser (no Playwright, Selenium, AutoHotkey, GUI automation).
- Does not write to ChatGPT / Claude.ai.
- Does not read `docs/INBOX.md`.
- Does not answer any Decision Packet.
- Does not use the network.
- Does not call any provider API.
- Does not create tokens or API keys.
- Does not modify n8n, Telegram, Ollama, or Cursor.
- Does not deploy, tag, or rollback.
- Does not modify app source (`src/**`).

---

## Allowed command

```
python tools/browser-bridge-dry-run/browser-bridge-dry-run.py \
  --task-id <TASK_ID> \
  --commit-hash <COMMIT_HASH_OR_LABEL> \
  --message aggio
```

Only `--message aggio` is allowed. All other messages are rejected.

---

## Output file

`.local/browser-bridge-dry-run/dry-run-output.jsonl`

Each successful write appends one JSON line with these fields:

| Field | Value |
|-------|-------|
| `timestamp_utc` | ISO 8601 UTC timestamp |
| `task_id` | value of `--task-id` |
| `commit_hash` | value of `--commit-hash` |
| `message` | `aggio` |
| `idempotency_key` | `task_id\|commit_hash\|message` |
| `mode` | `dry_run` |
| `target` | `local_file_only` |
| `browser_used` | `false` |
| `inbox_read` | `false` |
| `inbox_answered` | `false` |
| `network_used` | `false` |

---

## Validation rules

| Rule | Detail |
|------|--------|
| Allowed messages | `aggio` only |
| Max message length | 20 chars |
| Rejected patterns | Contains `D-` or `=` (DP-like syntax rejected) |
| Idempotency | Skips duplicate `(task_id, commit_hash, message)` triplet |
| Rate limit | Max 4 successful writes per rolling hour |

---

## Exit codes

| Code | Meaning |
|------|---------|
| 0 | Record written OK or skipped as duplicate |
| 1 | Validation error or rate limit exceeded |

---

## Sandbox and project-chat gates

Sending `aggio` to an actual ChatGPT sandbox or project chat requires a separate
future gate. This tool must not be expanded without a new explicit gate decision.

---

## Dependencies

Python standard library only. No third-party packages required.
Tested with Python 3.11+.

---

## Technical context

Design context: `docs/automation/cursor-cli-force-mode-implementer-bridge-design.md`
Decision: D-0148-A = 1 (recorded in task 0149)
Candidate next gates: `docs/automation/candidate-gate-backlog.md`
