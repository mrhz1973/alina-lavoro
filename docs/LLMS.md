# LLMS.md — Alina Lavoro Agent Entry Point

**For AI agents:** read this file first. It is derived memory (Level 2); canonical docs win on conflict.

**Compact constraint:** LLMS.md should stay below ~150 lines. If it grows beyond that, move older detail to `docs/wiki/current-state.md`, canonical docs, or `docs/history/PROJECT_LOG.md`. LLMS.md is an entry point, not a history file.

---

## Mandatory read order

1. `docs/LLMS.md`
2. `docs/wiki/current-state.md`
3. `docs/wiki/token-efficiency.md`
4. Assigned task file, if any
5. Only task-specific canonical docs

**Do not read by default:**
- `docs/PROJECT_STATE.md` — fallback/audit only; justify if opened.
- `docs/CHECKPOINT.md` — restart context only; justify if opened.
- `docs/history/PROJECT_LOG.md` — audit only.

---

## Current App State

| Field | Value |
|---|---|
| Version | **V1.9.2** |
| Tag | `v1.9.2-stable` |
| Branch | **main** (`dev` legacy/inactive) |
| Apps Script deploy | **@24** |
| Last manual test | OK 2026-05-10 (`/exec @24`, Redmi 9C NFC) |
| App scope | Stable — not in active work scope |

Constraint: do not return to app work until the automation/watcher/runner/low-touch workstream is closed, or the user explicitly requests it.

---

## Active Workstream

**automation / watcher / runner / low-touch**

Current posture: **monitoring and reduction**, not expansion. Telegram Mode A is active and stable-after-fix; avoid new runtime or new tooling unless it demonstrably removes user friction.

---

## Task State

| State | Info |
|---|---|
| Last completed | **0273** — V3.1 Measure-First Subtraction Pass (2026-05-14): docs-only; measured cold-start guidance size using file/line proxy; compressed LLMS.md/current-state.md; consolidated Prompt Size Guard and cold-start measurement into existing routing docs; clarified Decision Packet discipline; kept future ideas future-only; no runtime, no n8n, no app, no secrets. |
| Previous | **0272** — Anti-bureaucracy Docs ROI rule enforced (batch 0267–0272): Docs ROI Gate added/propagated; new docs that only add files to read are regressions; AGENTS.md remains pointer-only; CLI Printing Press remains future-only; Telegram Mode A stable-after-fix; INBOX 0 pending. |
| Queue location | `docs/tasks/queue/` |

---

## Low-Touch Stack Snapshot

| Component | Status | Pointer |
|---|---|---|
| n8n queue reader | Operational, scheduled polling validated | `docs/automation/n8n-workflows/queue-reader.md` |
| Telegram Mode A | **Active scheduled notification-only**, stable-after-fix | `docs/automation/telegram-mode-a-post-activation-monitoring-checklist.md` |
| INBOX | Active; **0 pending**, 21 decided, 1 superseded | `docs/INBOX.md` |
| Decision Packet format | Canonical for real decisions/gates only | `docs/automation/decision-packet-format.md` |
| LLM Wiki V3.1 | Active, but must stay subtractive/measure-first | `docs/wiki/` |
| Template Pack | Active; use core + task overlay + final report | `docs/tasks/templates/` |
| AGENTS.md | Pointer-only root entry | `AGENTS.md` |

---

## Automation Done Criteria

The automation phase is **sufficiently stable** when:
- Telegram Mode A is active and monitored;
- INBOX pending count is manageable;
- template-first policy is stable;
- no new runtime is required to remove current friction.

After that point, every new automation workstream must prove which manual friction it eliminates before it is opened.

---

## Future / Low Priority — Not Active Workstreams

- CLI Printing Press
- repo hygiene scanner/report-only
- local AI router / Ollama integration beyond documented feasibility
- browser bridge
- dual-agent loop
- VPS backup plan, n8n health check, INBOX auto-read, GitHub write automation

All remain gated/future unless the user explicitly opens them.

---

## Open Gates

Require explicit manual gate before action:
runtime, VPS/n8n UI, workflow import/export/Execute, Telegram send, Schedule change, provider API, billing, API key, login, GitHub Actions, deploy, tag, rollback, app source changes (`src/**`), secrets, OAuth material, real chat IDs, physical tests.

Provider APIs are out of scope by default. ChatGPT = web/on-demand; Claude Code/Cursor/Windsurf = supervised tools; Local AI = Ollama/local models.

---

## Implementers

| Implementer | Status |
|---|---|
| Claude Code local | Principal supervised implementer |
| Windsurf/Cascade | Backup supervised implementer |
| Cursor | Suspended until reset |

---

## Quick Navigation

| Need | Read |
|---|---|
| State snapshot | `docs/wiki/current-state.md` |
| Token/routing rules | `docs/wiki/token-efficiency.md` |
| Task ID guard | `docs/wiki/task-id-preflight.md` |
| Prompt routing | `docs/wiki/prompt-routing.md` |
| Templates | `docs/wiki/template-pack-index.md`, then specific `docs/tasks/templates/*` |
| Orchestrator rules | `docs/ORCHESTRATOR_RULES.md` |
| Implementer rules | `docs/AI_RULES.md` |
| Workflow | `docs/WORKFLOW.md` |
| Commands | `docs/COMMANDS.md` |
| Roadmap | `docs/roadmap.md` |

---

## Update Rule

Update this file at task completion, but keep it compact. Move history out; keep only current state, latest task, active gates, and pointers.
