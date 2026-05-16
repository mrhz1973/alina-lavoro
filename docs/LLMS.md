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
| Source version | **V2.2.0 + patch 2026-05-16** (batch 0399–0403; deployed @33) |
| Production version | **V2.2.0 patched** (deployed 2026-05-16 @33) |
| Tag | **`v2.1.1-stable`** (last stable; v2.2.0-stable pending user test) |
| Branch | **main** (`dev` legacy/inactive) |
| Apps Script deploy | **@33** (V2.2.0 patched live; same deployment ID as @31) |
| Last manual test | **PASS** (0366, V2.1.1) — V2.2.0 patched test pending |
| App scope | **V2.2.0 · no-login direct start · patch deployed @33 · awaiting manual user test** |

---

## Active Workstream

**V2.2.0 patched deployed (task 0404, 2026-05-16):** patch batch 0399–0403 deployed to Apps Script @33. Fixes live: blank-screen-on-resume fix, "Oggi" badge, boot placeholder, UI tokens, day-card readability. Same deployment ID as @31 (URL unchanged). Awaiting manual user test before v2.2.0-stable tag.

Automation (watcher/runner/low-touch): **baseline stable / monitor** — Telegram Mode A active and stable-after-fix.

---

## Task State

| State | Info |
|---|---|
| Last completed | **0404** — V2.2.0 patched source deploy (2026-05-16): patch deployed @33. |
| Batch completed | 0366–0371 (stable close), 0372–0377 (cleanup + autonomy), 0378–0383 (validation), 0384–0390 (V2.2.0 no-login), 0399–0403 (V2.2.0 frontend fix + polish), 0404 (V2.2.0 deploy patch) |
| Queue | **0391** (post-deploy test — covers V2.2.0 patched @33), **0392** (stable tag). Next gate: manual user test PASS before v2.2.0-stable tag. |
| Superseded | `docs/tasks/queue/0363-v21-stable-tag.md` (superseded by 0367) |

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

| Implementer | Status | CLI capability |
|---|---|---|
| Claude Code | Principal supervised implementer (current) | Confirmed — batch/non-interactive |
| Cursor | **Future dual-agent target** (Agent 1 + Agent 2); suspended until reset | Interactive-only (v3.3.30; `agent` subcommand interactive) |
| Windsurf/Cascade | Fallback supervised tool; not an active verification target | CLI present, no agent mode (v1.110.1) |
| Antigravity | Fallback supervised tool; not an active verification target | Partially confirmed (`chat --mode agent` v1.107.0; headless unverified) |

Cursor-first decision: `docs/automation/dual-cli-orchestrator-lite-design.md` §1c · CLI capability matrix: §1b

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
