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
| Last completed | **0253** — Record Telegram Mode A post-fix scheduled validation success (batch 0251–0253, 2026-05-14) — docs-only; first scheduled tick post-fix sent Telegram for task 0250 (new latest after docs batch 0246–0250); second scheduled tick duplicate-skipped 0250; **Telegram Mode A declared stable-after-fix**; latest-done selection fix validation complete; stabilization plan + monitoring checklist updated; INBOX: 0 pending, 20 decided; no implementer runtime. **Previous 0250** — Record Telegram Mode A latest-done selection fix and manual validation (batch 0246–0250, 2026-05-14) — docs-only; diagnosed and recorded `Pick latest done file` stale-selection bug (task 0246); recorded n8n fix (numeric sort by task ID, task 0247); recorded manual validation success: Telegram 0245 arrived (task 0248); updated stabilization plan + monitoring checklist with latest-done selection diagnostics (task 0249); created `docs/automation/telegram-mode-a-latest-done-selection-fix.md`; first scheduled tick post-fix is **pending observation**; Telegram Mode A not declared stable-after-fix yet; INBOX: 0 pending, 20 decided; no implementer runtime. **Previous 0245** — Prepare next low-touch runtime gate backlog (batch 0241–0245, 2026-05-14) — docs-only; created: `docs/automation/telegram-mode-a-post-activation-stabilization-plan.md`, `docs/automation/next-low-touch-runtime-gate-backlog.md`, `docs/wiki/v31-next-task-selection-rubric.md`; candidate-gate-backlog.md and monitoring checklist updated; Telegram Mode A remains active; INBOX: 0 pending, 20 decided; no runtime. **Previous 0240** — Operationalize LLM Wiki V3.1 workflow (batch 0236–0240, 2026-05-14) — docs-only; created: `docs/wiki/compact-task-creation-workflow.md`, `docs/wiki/compact-implementer-prompt-workflow.md`, `docs/wiki/multi-step-batch-planning-rules.md`, `docs/wiki/examples/v31-compact-workflow-cookbook.md`; V3.1 workflow layer complete; Telegram Mode A remains active; INBOX: 0 pending, 20 decided; no runtime. **Previous 0235** — Create first delta-based prompt example using V3.1 templates (2026-05-14) — docs-only; created `docs/wiki/examples/delta-based-prompt-example.md` with old-style vs V3.1 comparison, full template usage examples, task-ID guard reminder, and navigation entry; Telegram Mode A remains active; INBOX: 0 pending, 20 decided; no runtime. **Previous 0234** — Complete LLM Wiki V3.1 template pack (2026-05-14) — docs-only; created 5 missing templates: `docs-only-task.md`, `runtime-gated-task.md`, `inbox-decision-recording.md`, `n8n-ui-supervised-cleanup.md`, `state-update-batch.md`; Template Pack V3.1 now complete (all 8 templates); Telegram Mode A remains active; INBOX: 0 pending, 20 decided; no runtime. **Previous 0233** — Consolidate direct GitHub 0232 policy patch (2026-05-14) — docs-only; 0232 direct GitHub patch (no implementer) created LLM Wiki V3.1: `docs/wiki/task-id-preflight.md` (task-ID guard), `docs/wiki/prompt-routing.md` (context router), `docs/wiki/context-budget-policy.md` (budget rules), `docs/wiki/template-pack-index.md` (template index); implementer templates: `implementer-standard.md`, `n8n-template-first-task.md`, `final-report-contract.md`; 0233 consolidates state docs; Telegram Mode A remains active scheduled notification-only (first tick success / Telegram arrived 2026-05-14); INBOX: 0 pending, 20 decided; no runtime; no secrets. **Previous 0231** — Update state after Telegram Mode A schedule activation (2026-05-14) — docs-only batch (0227–0231); cleanup performed by user in n8n UI (task 0227): D-0165-A scope_note updated, short_hash mapping updated; no Execute during cleanup; conditional follow-on activation intent applied; Schedule Trigger activated on `TEST - Alina task completion Telegram notifier` (every 5 minutes; Schedule Trigger → List done files; Manual Trigger retained); workflow activated; first scheduled tick: success / Telegram arrived (task 0228); Telegram Mode A is now **active scheduled notification-only automation**; Telegram does not answer INBOX; D-0221-A = 3 remains decided (cleanup-first + conditional activation intent applied); duplicate-skip remains conclusively validated on fully-pinned harness (D-0209-A); D-0217-A/D-0213-A/D-0209-A/D-0206-A remain decided; D-0202-A remains superseded; App Alina remains stable V1.9.2 untouched; queue reader untouched; no secrets recorded; no provider API LLM; no new billing; INBOX: 0 pending, 1 superseded (D-0202-A), 20 decided; monitoring: `docs/automation/telegram-mode-a-post-activation-monitoring-checklist.md`; next valid operational posture: monitor active Telegram Mode A; disable/report on anomaly; otherwise no immediate decision pending; Gate 7 closed |
| Queue location | `docs/tasks/queue/` |

---

## Low-Touch Stack

| Component | Status | Document |
|-----------|--------|----------|
| n8n queue reader | ✅ Operational (5-min schedule, Europe/Berlin) | `docs/automation/n8n-workflows/queue-reader.md` |
| n8n schedule polling | ✅ Validated end-to-end | — |
| Decision Packet Format | ✅ Canonical | `docs/automation/decision-packet-format.md` |
| Human Decision Inbox | ✅ Designed + **MVP file created** — `docs/INBOX.md` active; **0 pending**; **1 superseded** (D-0202-A → D-0206-A, template-first policy); 20 decided: `D-0221-A` = 3 (cleanup-first path selected; conditional follow-on activation intent recorded, 2026-05-14), `D-0217-A` = 1 (readiness inspection succeeded, 2026-05-14), `D-0213-A` = 3 (schedule activation deferred; design-first path opened, 2026-05-14), `D-0209-A` = 1 (fully pinned duplicate skip succeeded, user report 2026-05-14), `D-0206-A` = 1 (import/inspection ok, user report 2026-05-14), `D-0197-A` = 1 (pinned validation, not successful / partial pinning), `D-0193-A` = 1 (retry, inconclusive / latest-done drift), `D-0187-A` = 1 (validation, inconclusive), `D-0180-A` = 1 (idempotency/state-store gate open), `D-0173-A` = 3 (schedule deferred), `D-0171-A` = 3 (schedule deferred), `D-0169-A` = 1 (manual test), `D-0167-A` = 1 (Telegram node), `D-0165-A` = 1 (workflow creation), `D-0163-A` = 1 (credential gate), `D-0157-A` = 1 (Mode A MVP), `D-0154-A` = 2 (project-chat deferred), `D-0151-A` = 1 (sandbox gate), `D-0148-A` = 1 (dry-run gate) | `docs/automation/human-decision-inbox-design.md` |
| Auto-Aggio design | ✅ Designed (zero runtime, discipline) | `docs/automation/auto-aggio-design.md` |
| n8n DP Generator design | ✅ Designed | `docs/automation/n8n-decision-packet-generator-design.md` |
| LLM Wiki (this layer) | ✅ Active — **V3.1** (batch 0232–0240, 2026-05-14): Task-ID Guard, Prompt Routing, Budget Policy, Template Pack Index, Delta-based prompt example, Compact task creation workflow, Compact implementer prompt workflow, Multi-step batch planning rules, Compact workflow cookbook; implementer templates in `docs/tasks/templates/` | `docs/wiki/` |
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
| Telegram Idempotency Runtime UI Handoff | ✅ **Implemented + duplicate-skip conclusively validated + readiness inspection succeeded + cleanup completed + Schedule Trigger activation succeeded — Telegram Mode A is now active scheduled notification-only** (batch 0227–0231, 2026-05-14) — Data Table path chosen; `alina_telegram_notifier_state` created; idempotency nodes implemented; **D-0187-A**, **D-0193-A**, **D-0197-A** consumed; **D-0202-A superseded**; **D-0206-A = 1 decided/applied** (import/inspection ok); **D-0209-A = 1 decided/applied/completed** (fully pinned duplicate skip succeeded); duplicate-skip **conclusively validated** on fully-pinned harness; **D-0213-A = 3 decided**; **D-0217-A = 1 decided/applied/completed** (readiness inspection succeeded); **D-0221-A = 3 decided** — cleanup-first path + conditional activation intent; cleanup completed (task 0227): scope_note updated, short_hash mapping updated; Schedule Trigger activated (every 5 minutes); first scheduled tick: **success / Telegram arrived** (task 0228); workflow `TEST - Alina task completion Telegram notifier` active; Telegram notification-only, does NOT answer INBOX; monitoring checklist: `docs/automation/telegram-mode-a-post-activation-monitoring-checklist.md` | `docs/automation/telegram-idempotency-runtime-ui-handoff.md` |
| n8n Template-First Policy | ✅ **Adopted** (batch 0204–0208, 2026-05-14) — priority TIME AND RESULTS; importable template preferred over manual node-by-node setup; manual = fallback; templates inactive by default, no real secrets, credential names/placeholders only | `docs/ORCHESTRATOR_RULES.md` · `docs/AI_RULES.md` · `docs/WORKFLOW.md` |
| Telegram Mode A Latest-Done Selection Fix | ✅ **Fixed + scheduled validation complete — stable-after-fix** (batch 0246–0253, 2026-05-14) — `Pick latest done file` bug fixed (numeric sort descending); manual validation: Telegram 0245 arrived; first scheduled tick: Telegram for task 0250 (new latest); second scheduled tick: duplicate-skip 0250; **Telegram Mode A declared stable-after-fix**; routine-check posture active; no implementer runtime; no secrets | `docs/automation/telegram-mode-a-latest-done-selection-fix.md` |
| Fully-Pinned n8n Harness Template | ✅ **Imported + Execute validated** (D-0206-A = 1, D-0209-A = 1, user report 2026-05-14, tasks 0208/0211) — workflow `TEST - Alina Telegram notifier FULLY PINNED HARNESS ONLY`; `active=false`; Manual Trigger only; no Schedule Trigger; `$json.*`-only downstream expressions; credential and chat_id bound inside n8n only; **D-0209-A = 1** result `fully pinned duplicate skip succeeded` — duplicate-skip conclusively validated; **D-0213-A = 3 decided** — schedule activation deferred; **D-0217-A = 1 decided** — readiness inspection succeeded; target workflow identified: `TEST - Alina task completion Telegram notifier`; **D-0221-A = 3 decided** — cleanup-first path; next step is supervised n8n UI cleanup (stale D-0165-A scope_note + short_hash empty); cleanup plan: `docs/automation/telegram-mode-a-pre-schedule-cleanup-plan.md`; supervision checklist for post-cleanup activation: `docs/automation/telegram-mode-a-schedule-activation-supervision-checklist.md` | `docs/automation/n8n-workflows/templates/telegram-fully-pinned-validation-harness.template.md` |

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
