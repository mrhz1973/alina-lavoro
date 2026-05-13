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
| Last completed | **0135** — Cursor CLI Force-Mode Implementer Bridge Design (2026-05-13) — docs-only design completed; architecture target: GitHub queue → n8n/local script → Ollama qwen3:14b JSON router → Cursor force-mode → branch → ChatGPT web post-check → human merge; no runtime executed; future Cursor CLI force-mode preflight is runtime-gated |
| Next planned | No automatic runtime step; potential future docs-only local classifier wrapper / qwen-alina profile design, or docs/INBOX.md debt, only as separate task |
| Queue location | `docs/tasks/queue/` |

---

## Low-Touch Stack

| Component | Status | Document |
|-----------|--------|----------|
| n8n queue reader | ✅ Operational (5-min schedule, Europe/Berlin) | `docs/automation/n8n-workflows/queue-reader.md` |
| n8n schedule polling | ✅ Validated end-to-end | — |
| Decision Packet Format | ✅ Canonical | `docs/automation/decision-packet-format.md` |
| Human Decision Inbox design | ✅ Designed — `docs/INBOX.md` NOT created | `docs/automation/human-decision-inbox-design.md` |
| Auto-Aggio design | ✅ Designed (zero runtime, discipline) | `docs/automation/auto-aggio-design.md` |
| n8n DP Generator design | ✅ Designed | `docs/automation/n8n-decision-packet-generator-design.md` |
| LLM Wiki (this layer) | ✅ Active | `docs/wiki/` |
| Ollama Classifier/Planner | ✅ Feasibility done — preflight runtime-gated pending Gate 7 — **target: Windows workstation** (Ryzen 9 3900X / RTX 3060 12 GB); Mac M2 opzione secondaria | `docs/automation/ollama-classifier-planner-feasibility-post-wiki.md` |

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

- `docs/INBOX.md` not yet created → reserved for future mixed/runtime-gated task

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
