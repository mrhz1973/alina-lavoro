# Runtime Gate Checklist — Readiness Matrix

**Task:** 0144
**Date:** 2026-05-13
**Type:** docs-only / low-touch-loop design
**Status:** active reference document

---

## Purpose

This document is the single reference for which runtime components in the Alina Lavoro low-touch stack are:

- currently active and operational,
- designed but not yet active (gate required before activation), or
- permanently forbidden without an explicit future manual gate.

It is used by the orchestrator (ChatGPT), the implementer (Claude Code, Cursor, Windsurf), and future n8n classifier/planner to determine whether a proposed action requires a gate decision before execution.

---

## Scope

This document covers all runtime components mentioned in `docs/LLMS.md` (Low-Touch Stack table) and all gate categories defined in `docs/ORCHESTRATOR_RULES.md` (sensitive gates list).

It does **not** authorize any runtime action. Presence here under "designed, not yet active" means the design is done — not that activation is permitted.

---

## Gate Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Active and operational — no gate needed for this function |
| 🟡 | Designed, not yet active — explicit manual gate required before first activation |
| 🔵 | Design pending — deferred to future task |
| 🚫 | Blocked / permanently requires explicit manual gate — never automatic |
| ❌ | Explicitly deferred — do not open gate without clear workstream decision |

---

## Readiness Matrix

| Component | Status | Gate required | Gate owner | Activation-forbidden actions |
|-----------|--------|--------------|------------|------------------------------|
| **docs-only tasks** | ✅ | None | — | Touching forbidden paths (`src/**`, `gas-current/**`, etc.) |
| **n8n queue reader (schedule + read)** | ✅ | None (already operational) | — | Modifying n8n workflows |
| **Decision Packet format** | ✅ | None (docs canonical) | — | Runtime DP delivery |
| **Human Decision Inbox (`docs/INBOX.md`)** | ✅ | None (file exists) | — | Automated resolution of INBOX items |
| **Auto-Aggio (discipline)** | ✅ | None (docs canonical) | — | Scheduled auto-push without supervision |
| **LLM Wiki (`docs/wiki/`)** | ✅ | None (docs active) | — | — |
| **VPS / n8n runtime modifications** | 🟡 | Explicit manual gate (each change) | User | Any new n8n node, workflow enable/disable, schedule change, webhook, VPS config |
| **Telegram notification** | 🟡 | Explicit manual gate | User | Bot token setup, webhook registration, any Telegram API call, n8n Telegram node activation |
| **Local Browser Bridge** | 🟡 | Explicit manual gate (MVP dry-run first) | User | Any browser automation, any write to Claude.ai, any action beyond "aggio" |
| **Ollama / local AI runtime** | 🟡 | Explicit manual gate (Gate 7) | User | Ollama install, model pull, embeddings runtime, inference API, any local model execution |
| **Cursor CLI / headless runner** | 🟡 | Explicit manual gate (Gate 7) | User | Any automated/headless Cursor execution, CLI fire-and-forget |
| **n8n DP Generator** | 🟡 | Explicit manual gate | User | Any n8n node generating Decision Packets in production |
| **Ollama Classifier / Planner** | 🟡 | Explicit manual gate (Gate 7) | User | Classifier inference, planner inference, any model call |
| **Local Cursor Dual-Agent Loop** | 🟡 | Explicit manual gate | User | Agent 1 + Agent 2 automated loop activation |
| **Automatic runner (fire-and-forget)** | 🚫 | Explicit manual gate | User | Any fully automated task execution without human-in-loop |
| **Alina app (`src/**`)** | 🚫 | Explicit manual gate | User | Any `src/**` edit outside explicit app task |
| **Apps Script deploy** | 🚫 | Explicit manual gate (always) | User | Any `clasp push`, deploy @N+1, Apps Script publish |
| **Release tag** | 🚫 | Explicit manual gate (always) | User | `git tag`, `git push --tags`, any stable tag creation |
| **Rollback** | 🚫 | Explicit manual gate (always) | User | `git reset --hard`, `git revert` on production, restore from stable tag |
| **GitHub Actions** | 🚫 | Explicit manual gate | User | Any `.github/workflows/**` change or new workflow |
| **API key (any provider)** | 🚫 | Explicit manual gate (permanently forbidden by default) | User | OpenAI API key, Anthropic API key, any third-party hosted LLM API key |
| **Provider LLM calls (API)** | 🚫 | Explicit manual gate (permanently forbidden by default) | User | Any call to OpenAI API, Anthropic API, OpenRouter, or hosted AI provider |
| **New billing / recurring costs** | 🚫 | Explicit manual gate (permanently forbidden by default) | User | Any new paid subscription, new service with per-call billing, new storage billing |
| **VPS login / SSH access** | 🚫 | Explicit manual gate | User | Any automated VPS login, SSH key addition |

---

## Hard Constraints (permanent)

These constraints apply at all times, regardless of task type, component status, or orchestrator/implementer.

### 1. No API provider LLM

No OpenAI API, Anthropic API, OpenRouter, or hosted provider AI calls.

- **ChatGPT** = web/on-demand orchestration only. Not OpenAI API.
- **Claude Code** = supervised local usage only. Not Anthropic API.
- **Local AI** = Ollama / local models only (runtime-gated).

Any provider API / hosted AI call / API key / billing / recurring cost is **out of scope by default**. A future explicit manual gate is required before any such component can be considered.

### 2. No new billing

No new paid services, no new subscriptions, no new per-call billing, no new storage costs. Any service with recurring costs requires an explicit manual gate with cost impact acknowledged by the user.

### 3. No new API keys

No API key creation, no API key configuration, no storing API keys in the repository, in n8n, or on the VPS. This applies to all providers (Telegram Bot API, GitHub fine-grained tokens beyond current scope, OpenAI, Anthropic, etc.).

New API keys (e.g., a Telegram bot token for a future notification system) require an explicit manual gate where the key and its scope are explicitly approved.

### 4. Browser bridge must not answer INBOX decisions

The Local Browser Bridge (`docs/automation/local-browser-bridge-preflight-design.md`) is a write-only automation tool. Its only permitted action is writing `aggio` into the Claude.ai / ChatGPT web UI.

The bridge **must never**:
- read `docs/INBOX.md` to determine what to write,
- include Decision Packet identifiers (`D-NNNN-X`) in its output,
- simulate a user response to a pending Decision Packet,
- take any action that constitutes answering an INBOX decision.

INBOX decisions require explicit human review. The user reads the Decision Packet in the orchestrator chat and responds manually with `D-NNNN-X = N`. No automated agent may substitute for this.

### 5. App / deploy / tag / rollback require explicit manual gate (always)

- **App source (`src/**`):** do not touch without an explicit app task authorized by the user. The current stable version is **V1.9.2 / @24**. The automation workstream does not touch the app.
- **Apps Script deploy:** requires `clasp push` + deploy, which is always a manual gate. No automated deploy from n8n, runner, or CI.
- **Release tag:** `git tag` and `git push --tags` require explicit manual gate. Tags are permanent references; an accidental tag is hard to retract cleanly.
- **Rollback:** any rollback to a prior stable tag (e.g., `v1.9.1-stable`) requires explicit manual gate with the rollback reason stated. Never automated.

---

## Per-Component Gate Checklist

### docs-only work

- Gate: **none**
- Implementer: Claude Code / Cursor / Windsurf
- Allowed paths: `docs/**` (except VPS/runtime config files)
- Forbidden paths: `src/**`, `gas-current/**`, `.gas/**`, `appsscript.json`, `package.json`, `.github/**`
- Commit style: selective (`git add <file>` — never `git add .`)
- Push: always to `main`

---

### n8n / VPS runtime

- Gate: **explicit manual gate per modification**
- Current state: schedule polling active (5 min, Europe/Berlin); queue reader operational and validated
- Requires gate:
  - enabling or disabling any n8n workflow
  - adding a new n8n node or connection
  - changing schedule intervals
  - adding a webhook
  - VPS config changes (nginx, firewall, systemd, cron)
  - any SSH or VPS terminal action by runner
- Who approves: user (via orchestrator chat)
- References: `docs/automation/n8n-workflows/queue-reader.md`, `docs/automation/n8n-workflows/lifecycle-ownership.md`

---

### Telegram notification

- Gate: **explicit manual gate**
- Current state: designed (Mode A in `docs/automation/telegram-browser-bridge-trigger-coordination-design.md`) — not yet active
- Requires gate:
  - creating or registering a Telegram bot
  - obtaining or storing a bot token
  - configuring chat ID or group
  - adding n8n Telegram node
  - sending first test message
- Hard constraint: no API key (Telegram bot token) without explicit gate
- References: `docs/automation/telegram-browser-bridge-trigger-coordination-design.md`

---

### Local Browser Bridge

- Gate: **explicit manual gate (MVP path: dry-run → sandbox → project chat)**
- Current state: designed (`docs/automation/local-browser-bridge-preflight-design.md`) — not yet active
- Requires gate (in order):
  1. Dry-run gate (script writes to a local test file; no browser)
  2. Sandbox gate (script runs against a throwaway browser session)
  3. Project chat gate (script writes "aggio" to actual Claude.ai / ChatGPT)
- Hard constraints:
  - writes `aggio` only — nothing else
  - must not read or respond to `docs/INBOX.md`
  - must not simulate user decisions
  - rate limit: 4 executions/hour (from design)
  - idempotency key `(task_id, commit_hash)` must be implemented before production use
- References: `docs/automation/local-browser-bridge-preflight-design.md`

---

### Ollama / local AI runtime

- Gate: **Gate 7 — explicit manual gate**
- Current state: feasibility done (`docs/automation/ollama-classifier-planner-feasibility-post-wiki.md`) — not yet installed
- Target hardware: Windows workstation (Ryzen 9 3900X / RTX 3060 12 GB); Mac M2 secondary option
- Requires gate (in order):
  1. Ollama install gate (user authorizes install on workstation)
  2. Model pull gate (user authorizes specific model download, e.g., qwen3:8b)
  3. Embeddings runtime gate (user authorizes embedding service if needed)
  4. Inference API gate (user authorizes local API endpoint exposure)
- Hard constraints:
  - local models only (Ollama) — no provider API
  - no cloud inference fallback without separate gate
  - no model download without explicit gate (size and model name stated)
- References: `docs/automation/ollama-classifier-planner-feasibility-post-wiki.md`

---

### Cursor CLI / headless runner

- Gate: **Gate 7 — explicit manual gate**
- Current state: supervised local usage; Cursor suspended until reset (`docs/LLMS.md`)
- Requires gate:
  - any automated / CLI / headless Cursor execution
  - Cursor Agent 1 (Implementer) + Agent 2 (Reviewer) dual-agent loop activation
  - any fire-and-forget Cursor run triggered by n8n or VPS
- Hard constraints:
  - Cursor suspended until reset is resolved
  - dual-agent loop (`docs/automation/local-cursor-dual-agent-loop-design.md`) is design-only until Gate 7
  - fallback: Claude Code (supervised) or Windsurf (supervised)
- References: `docs/automation/local-cursor-dual-agent-loop-design.md`

---

### Alina app / deploy / tag / rollback

- Gate: **always manual gate** (even if workstream is otherwise open)
- Current state: V1.9.2 stable, @24, test OK 2026-05-10 — not in active work scope
- Requires gate for any of:
  - `src/backend/Code.gs` edit
  - `src/frontend/Index.html` edit
  - `gas-current/**` copy/update
  - `clasp push` / Apps Script deploy
  - `git tag` / stable tag creation
  - rollback to any prior stable tag
  - Google Sheet structural changes
  - new external library introduction
- Hard constraints:
  - do not return to app work until automation workstream is closed or user explicitly requests
  - stable tags for rollback: `v1.9.1-stable` (@23), `v1.9.0-stable` (@22), `v1.8.10-stable` (@21)
  - never automated deploy from n8n, runner, or CI

---

## Gate 7 — Definition

**Gate 7** is the pending explicit manual gate covering:

1. Ollama install and runtime activation on the Windows workstation
2. Cursor CLI / headless mode activation for automated runs

Gate 7 is **not yet opened**. All Ollama and automated Cursor runtime actions are blocked until the user explicitly grants Gate 7 via the orchestrator chat.

Gate 7 does **not** include Telegram setup or Browser Bridge activation — those have separate independent gates.

---

## What n8n May Do Without Additional Gate

The following n8n actions are already validated and do not require a new gate, because the runtime configuration is already active:

| Action | Status |
|--------|--------|
| Schedule polling (5-min, Europe/Berlin) | ✅ Operational |
| Reading `docs/tasks/queue/` on GitHub | ✅ Operational |
| Reading `docs/tasks/processing/` on GitHub | ✅ Operational |
| Reading `docs/tasks/done/` on GitHub | ✅ Operational |
| Reading `docs/tasks/failed/` on GitHub | ✅ Operational |
| Filtering first eligible task | ✅ Operational |
| Generating Cursor prompt in `docs/tasks/processing/` | ✅ Operational |
| Creating/updating automation session in `docs/sessions/` | ✅ Operational |

The following n8n actions require a new explicit gate even though n8n runtime is active:

| Action | Gate required |
|--------|--------------|
| Adding new n8n workflow | Explicit manual gate |
| Enabling/disabling existing workflow | Explicit manual gate |
| Adding Telegram node | Explicit manual gate |
| Adding webhook receiver | Explicit manual gate |
| Modifying schedule interval | Explicit manual gate |
| Any write action beyond GitHub API calls already in use | Explicit manual gate |

---

## Readiness Summary

| Workstream area | Ready now | Requires gate | Permanently blocked |
|----------------|-----------|--------------|---------------------|
| docs-only tasks | ✅ | — | — |
| n8n queue reader (read + prompt generation) | ✅ | — | n8n runtime mods |
| Decision Packet format | ✅ | — | runtime DP delivery |
| Human Decision Inbox (file) | ✅ | — | automated INBOX resolution |
| VPS / n8n runtime modifications | — | Manual gate (each) | — |
| Telegram notification | — | Manual gate | — |
| Browser Bridge (MVP) | — | Manual gate (3-phase) | INBOX decisions |
| Ollama local runtime | — | Gate 7 | Provider LLM |
| Cursor CLI / headless | — | Gate 7 | Fire-and-forget |
| Alina app source | — | Manual gate (always) | Unauthorized src edit |
| Deploy / tag / rollback | — | Manual gate (always) | Automated deploy |
| API provider LLM calls | — | — | ✅ Permanently forbidden by default |
| New billing | — | — | ✅ Permanently forbidden by default |
| New API keys | — | — | ✅ Permanently forbidden by default |

---

## References

| Document | Role |
|---------|------|
| `docs/LLMS.md` | Low-Touch Stack status table |
| `docs/ORCHESTRATOR_RULES.md` | Sensitive gates list (authoritative) |
| `docs/AI_RULES.md` | Implementer rules, no provider APIs |
| `docs/INBOX.md` | Human Decision Inbox (INBOX decisions are human-only) |
| `docs/automation/local-browser-bridge-preflight-design.md` | Browser Bridge design and safety controls |
| `docs/automation/telegram-browser-bridge-trigger-coordination-design.md` | Telegram + Bridge coordination |
| `docs/automation/ollama-classifier-planner-feasibility-post-wiki.md` | Ollama feasibility and Gate 7 |
| `docs/automation/local-cursor-dual-agent-loop-design.md` | Cursor dual-agent loop design |
| `docs/automation/n8n-workflows/queue-reader.md` | n8n queue reader (operational) |
| `docs/automation/n8n-workflows/lifecycle-ownership.md` | Task lifecycle ownership |

---

*This document is docs-only. It does not activate any runtime component. All runtime activations require the explicit manual gates defined above.*
