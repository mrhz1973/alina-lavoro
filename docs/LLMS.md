# LLMS.md — Alina Lavoro Agent Entry Point

**For AI agents:** read this file FIRST instead of docs/PROJECT_STATE.md.  
This file is derived memory (Level 2). Canonical sources always win.  
→ Design: docs/automation/local-llm-wiki-token-efficiency-design.md

**Mandatory read order:**
1. This file (`docs/LLMS.md`) — always first
2. `docs/wiki/current-state.md` — state snapshot
3. `docs/wiki/token-efficiency.md` — navigation rules
4. Assigned task file (if any)
5. Only task-specific canonical docs

**Do NOT read by default:**
- `docs/PROJECT_STATE.md` — large file; fallback/audit only; open only if this file + wiki cannot answer your question; justify in final report if you open it
- `docs/CHECKPOINT.md` — restart context only; open only when explicitly required; justify in final report if you open it
- Claude Code large-file warnings for these files may remain until a future physical compression task

---

## Current App State

| Field | Value |
|-------|-------|
| Version | **V1.9.2** |
| Tag | `v1.9.2-stable` |
| Branch | **main** (operational) — `dev` is legacy/inactive |
| Apps Script deploy | **@24** |
| Last manual test | OK 2026-05-10 (Redmi 9C NFC, /exec @24) |
| App scope | **Stable — not in active work scope** |

**Constraint:** do not return to Alina app work until watcher/runner/low-touch workstream is closed, or user explicitly requests it.

---

## Active Workstream

**automation / watcher / runner / low-touch**

Building the autonomous low-touch task loop:  
`GitHub → n8n → implementer → Decision Packet → user`

---

## Task State

| State | Info |
|-------|------|
| Last completed | **0190** — Update Duplicate-Skip Validation Cross-References (2026-05-14) — docs-only batch (0188–0190); 0188 recorded D-0187-A = 1 (authorize exactly one duplicate-skip validation run); 0189 created duplicate-skip runtime handoff; 0190 updated cross-references; duplicate-skip validation gate open for exactly one manual run; next step: one duplicate-skip validation execution; workflow remains inactive/manual-only; no Schedule Trigger; no token/chat id in repo; INBOX: 0 pending (unless other pending decisions exist), 12 decided; Gate 7 closed |
| Queue location | `docs/tasks/queue/` |

---

## Low-Touch Stack

| Component | Status | Document |
|-----------|--------|----------|
| n8n queue reader | ✅ Operational (5-min schedule, Europe/Berlin) | `docs/automation/n8n-workflows/queue-reader.md` |
| n8n schedule polling | ✅ Validated end-to-end | — |
| Decision Packet Format | ✅ Canonical | `docs/automation/decision-packet-format.md` |
| Human Decision Inbox | ✅ Designed + **MVP file created** — `docs/INBOX.md` active; **0 pending** (D-0187-A decided = 1); 12 decided: `D-0187-A` = 1 (duplicate-skip validation gate open), `D-0180-A` = 1 (idempotency/state-store gate open), `D-0173-A` = 3 (schedule deferred), `D-0171-A` = 3 (schedule deferred), `D-0169-A` = 1 (manual test), `D-0167-A` = 1 (Telegram node), `D-0165-A` = 1 (workflow creation), `D-0163-A` = 1 (credential gate), `D-0157-A` = 1 (Mode A MVP), `D-0154-A` = 2 (project-chat deferred), `D-0151-A` = 1 (sandbox gate), `D-0148-A` = 1 (dry-run gate) | `docs/automation/human-decision-inbox-design.md` |
| Auto-Aggio design | ✅ Designed (zero runtime, discipline) | `docs/automation/auto-aggio-design.md` |
| n8n DP Generator design | ✅ Designed | `docs/automation/n8n-decision-packet-generator-design.md` |
| LLM Wiki (this layer) | ✅ Active | `docs/wiki/` |
| Ollama Classifier/Planner | ✅ Feasibility done — preflight runtime-gated pending Gate 7 — **target: Windows workstation** (Ryzen 9 3900X / RTX 3060 12 GB); Mac M2 opzione secondaria | `docs/automation/ollama-classifier-planner-feasibility-post-wiki.md` |
| Local Cursor Dual-Agent Loop | ✅ Designed — Agent 1 Implementer + Agent 2 Reviewer; ~10-day fallback Claude Code/Windsurf; no runtime | `docs/automation/local-cursor-dual-agent-loop-design.md` |
| Local Browser Bridge Preflight | ✅ Designed — "automatic finger" writes only `aggio`; safety controls defined; MVP path (dry-run → sandbox → project chat); no runtime | `docs/automation/local-browser-bridge-preflight-design.md` |
| Telegram + Bridge Trigger Coordination | ✅ Designed — Mode A (Telegram-only, current primary), Mode B (Telegram+Bridge, future MVP), Mode C (deferred); idempotency key; INBOX-aware templates; no runtime | `docs/automation/telegram-browser-bridge-trigger-coordination-design.md` |
| Runtime Gate Checklist / Readiness Matrix | ✅ Created — 23 components mapped; 5 permanent hard constraints; Gate 7 defined (Ollama + Cursor CLI, not yet opened); no runtime | `docs/automation/runtime-gate-checklist-readiness-matrix.md` |
| Runtime Gate Decision Packet / Gate Request Playbook | ✅ Created — pairs with readiness matrix; 8-step gate lifecycle; 13 gated categories; 7 DP variants with `D-EXAMPLE-*` reserved IDs; 8 anti-patterns; no runtime | `docs/automation/runtime-gate-decision-packet-playbook.md` |
| Candidate Gate Backlog / Gate Queue Map | ✅ Created — A implemented (0150); B sandbox gate **open** (D-0151-A = 1, task 0152); C project-chat deferred; 14 candidates A–N; 8 anti-creep rules | `docs/automation/candidate-gate-backlog.md` |
| Browser Bridge Dry-Run | ✅ **Implemented** (task 0150) — `tools/browser-bridge-dry-run/browser-bridge-dry-run.py`; Python stdlib only; `aggio` only; idempotency + rate-limit; no browser/ChatGPT/INBOX/network | `tools/browser-bridge-dry-run/README.md` |
| Browser Bridge Sandbox | ✅ **Implemented** (task 0153) — `tools/browser-bridge-sandbox/browser-bridge-sandbox.py` + `sandbox.html`; Python stdlib only; local `file://` target only; throwaway context; `aggio` only; `--no-open` validated; no real ChatGPT/Claude.ai; no project chat; no INBOX | `tools/browser-bridge-sandbox/README.md` · `docs/automation/candidate-gate-backlog.md` |
| Telegram Notifier Idempotency Design | ✅ **Designed** (task 0178) — `docs/automation/telegram-notifier-idempotency-state-store-implementation-design.md`; key model, state-store options (Data Store / static data), send/skip algorithm, failure modes, observability; no runtime; **D-0180-A = 1 decided (task 0182)** | `docs/automation/telegram-notifier-idempotency-state-store-implementation-design.md` |
| Telegram Notifier Idempotency Checklist | ✅ **Created** (task 0179) — `docs/automation/telegram-notifier-idempotency-implementation-checklist.md`; step-by-step pre-runtime checklist; **D-0180-A = 1 decided — checklist active for one-step-at-a-time supervision** | `docs/automation/telegram-notifier-idempotency-implementation-checklist.md` |
| Telegram Idempotency Runtime UI Handoff | ✅ **Implemented** (task 0183 handoff → user 2026-05-14) — Data Table path chosen; `alina_telegram_notifier_state` created; idempotency nodes implemented; one send/write test succeeded; **D-0187-A = 1 decided** (batch 0188–0190); duplicate-skip validation gate open for exactly one manual run; runtime handoff: `docs/automation/telegram-duplicate-skip-validation-runtime-handoff.md` | `docs/automation/telegram-idempotency-runtime-ui-handoff.md` |

---

## VPS Status

Node.js v18.19.1 ✅ | npm 9.2.0 ✅ | Claude Code CLI 2.1.139 ✅  
Login blocked ❌ | API key ❌ | Runner automatico ❌  
n8n binding: 127.0.0.1:5678 (hardened)

---

## Implementers

| Implementer | Status |
|-------------|--------|
| Claude Code (local) | Principal — active |
| Windsurf/Cascade | Backup / supervised |
| Cursor | Suspended until reset |

---

## Agent Language

Use **technical English** for internal reasoning, prompts, JSON/YAML, classifier/planner, wiki content.

Use **Italian** for final user-facing summaries and orchestrator output.

Agent-facing operational rules (`docs/AI_RULES.md`, `docs/WORKFLOW.md`) are normalized in technical English.

→ Full rule: `docs/AI_RULES.md` — "Language policy for agents"

---

## Open Technical Debts

_No open technical debts. `docs/INBOX.md` created in task 0141 (2026-05-13)._

---

## Open Gates

The following require explicit manual gate before any action:

- Ollama install, embeddings runtime, VPS changes
- n8n runtime modifications
- API key, login, GitHub Actions
- deploy Apps Script, tag, rollback, runner automatico
- app Alina source modifications (`src/**`)
- **NO provider APIs by default** — ChatGPT = web/on-demand, Claude Code = supervised usage, Local AI = Ollama/local models; provider APIs / hosted AI calls / API keys / billing / recurring costs require explicit future manual gate and are out of scope by default

---

## App Rollback References

| Version | Tag | Deploy |
|---------|-----|--------|
| V1.9.1 | `v1.9.1-stable` | @23 |
| V1.9.0 | `v1.9.0-stable` | @22 |
| V1.8.10 | `v1.8.10-stable` | @21 |

Full history → `docs/PROJECT_STATE.md`

---

## Quick Navigation

| Need | Read |
|------|------|
| Full current state | `docs/PROJECT_STATE.md` |
| Restart context | `docs/CHECKPOINT.md` |
| Orchestrator rules (always read) | `docs/ORCHESTRATOR_RULES.md` |
| Implementer rules | `docs/AI_RULES.md` |
| Workflow | `docs/WORKFLOW.md` |
| Commands | `docs/COMMANDS.md` |
| Roadmap | `docs/roadmap.md` |
| Task queue | `docs/tasks/queue/` |
| n8n queue reader | `docs/automation/n8n-workflows/queue-reader.md` |
| Decision Packet format | `docs/automation/decision-packet-format.md` |
| Low-touch loop design | `docs/automation/autonomous-low-touch-loop-design.md` |
| Wiki state snapshot | `docs/wiki/current-state.md` |
| Token-efficient navigation | `docs/wiki/token-efficiency.md` |

---

**Rule:** this file is derived. If any content here conflicts with  
`docs/PROJECT_STATE.md`, `docs/ORCHESTRATOR_RULES.md`, or other Level 0/1  
canonical docs, the canonical docs are correct. Update this file at every  
task completion (same cadence as PROJECT_STATE).
