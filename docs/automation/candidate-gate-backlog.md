# Candidate Gate Backlog / Gate Queue Map

**Task:** 0147
**Date:** 2026-05-13
**Type:** docs-only / low-touch-loop planning
**Status:** active reference document — **updated batch 0182–0184 (2026-05-13): D-0180-A = 1 decided (task 0182); idempotency/state-store runtime gate open; runtime UI handoff created (task 0183); cross-references updated (task 0184); next: inspect n8n Data Store availability (inspection only, no node changes); workflow remains inactive; no Schedule Trigger; no token/chat id in repo**

---

## 1. Purpose

This document is a **candidate backlog** of possible future runtime gates for the Alina Lavoro low-touch stack. It ranks which gates may be worth considering later, so that the orchestrator (ChatGPT) and the user can choose the next gate **intentionally** rather than reactively.

This document:

- **does not open any gate**
- **does not create any Decision Packet**
- **does not add any pending entry to `docs/INBOX.md`**
- **does not authorize any runtime, app, deploy, tag, rollback, API, billing, or key action**

It is a **planning / navigation document only**. Each candidate listed here remains subject to the explicit manual gate process defined in tasks 0144 and 0146.

---

## 2. Relationship to tasks 0144 and 0146

The three documents form a complete gate decision toolchain. Each has a distinct role and must not be conflated with the others.

| Task | Document | Role |
|------|----------|------|
| 0144 | `docs/automation/runtime-gate-checklist-readiness-matrix.md` | **Determines WHETHER an action is gated.** Status of every component (✅ active / 🟡 gated / 🚫 blocked / ❌ deferred). |
| 0146 | `docs/automation/runtime-gate-decision-packet-playbook.md` | **Determines HOW to request a gate** through a Decision Packet (canonical 13-field format, 8-step lifecycle, anti-patterns). |
| 0147 | `docs/automation/candidate-gate-backlog.md` (this file) | **Ranks WHICH gates may be worth considering next**, with state and prioritization rationale. |

**Order of consultation:**

1. A proposed action arrives → consult **0144** (readiness matrix). If active → proceed without DP. If gated → stop.
2. If gated and the orchestrator/user is choosing what to do next → consult **0147** (this backlog) to see which candidate gates are worth proposing and in what order.
3. Once a specific candidate is chosen for a real proposal → consult **0146** (playbook) to formulate the Decision Packet correctly.

The backlog is the **planning input**; the matrix is the **status check**; the playbook is the **request template**. None of them, alone or combined, opens a gate. Only an explicit user response to a real Decision Packet in `docs/INBOX.md` opens a gate.

---

## 3. Gate candidate states

Each candidate in the backlog table is tagged with one of the following states. States describe **planning posture**, not authorization.

| State | Meaning |
|-------|---------|
| **candidate** | A plausible future gate; design exists or could be drafted; not ranked as next. |
| **recommended next** | The candidate the orchestrator would propose first if the user decides to open a new gate. **Not authorization** — still requires a real DP and INBOX decision. |
| **deferred** | The candidate cannot meaningfully proceed until a prerequisite candidate succeeds (e.g. sandbox depends on dry-run). |
| **blocked** | The candidate is held by a higher-level constraint (e.g. Gate 7 not opened, Cursor reset window). |
| **not recommended** | The candidate exists conceptually but is discouraged by current project policy (e.g. provider API, new billing). Listed for completeness, not for promotion. |
| **superseded** | A previously considered candidate that has been replaced by a different design or rolled into another candidate. Kept in this list only for traceability. |

State changes are made through this document only — never through INBOX automation, never as a side effect of another task.

---

## 4. Prioritization criteria

Candidates are ranked using the following criteria, applied together. No single criterion is sufficient; the recommendation is the one that performs well across most criteria.

| # | Criterion | Direction |
|---|-----------|-----------|
| 1 | **Safety / reversibility** | Higher is better. Can the candidate be undone cleanly? |
| 2 | **No new billing** | Required. Any candidate that introduces recurring cost is not recommended by default. |
| 3 | **No provider API** | Required. Any candidate that depends on hosted AI is not recommended by default. |
| 4 | **No new API key** | Strongly preferred. Candidates that require a new key are penalized. |
| 5 | **Value to low-touch loop** | Higher is better. Does the candidate move the autonomous loop forward? |
| 6 | **Human micro-interactions removed** | Higher is better. Aligned with the `Micro-interazioni umane eliminate` orchestrator criterion. |
| 7 | **Implementation complexity** | Lower is better. Simpler candidates can be piloted faster. |
| 8 | **Runtime blast radius** | Lower is better. Local, file-only candidates beat full-runtime candidates. |
| 9 | **Observability / rollback clarity** | Higher is better. Can the user see what happened and undo it? |
| 10 | **Compatibility with current Cursor limitation period** | Required. The Cursor reset/limitation window means Cursor-dependent candidates are deferred. |
| 11 | **Does not touch app / deploy / tag / rollback** | Required. The app (V1.9.2 / @24) is out of scope for the automation workstream. |

A candidate is a strong "recommended next" only when it scores well on criteria 1, 5, 6, 7, 8, 9 **and** does not violate any of the required criteria (2, 3, 10, 11).

---

## 5. Candidate backlog table

The table below lists candidate gates currently visible from the design corpus. Order in the table is **not** priority order; the `State` column and Section 6 (recommended next) carry the ranking.

| # | Candidate | Category | State | Why this state | Must remain gated? |
|---|-----------|----------|-------|----------------|---------------------|
| A | **Browser Bridge dry-run** (local script writes to a local test file, no browser) | local runtime | **dry-run implemented** — task 0150 completed (2026-05-13); `tools/browser-bridge-dry-run/browser-bridge-dry-run.py`; writes only to `.local/browser-bridge-dry-run/dry-run-output.jsonl`; no browser; no ChatGPT/Claude.ai write; no INBOX read/answer; no network; Decision Packet `D-0148-A = 1` (task 0149) opened the gate. Sandbox (B) is the natural next phase — requires user intent and a new DP. | Dry-run phase complete. Sandbox phase still gated. | Yes |
| B | **Browser Bridge sandbox** (script runs against a throwaway browser session) | browser bridge runtime | **sandbox implemented** — `D-0151-A = 1` decided (task 0152, 2026-05-13); task 0153 (2026-05-13) created `tools/browser-bridge-sandbox/browser-bridge-sandbox.py` + `sandbox.html`; target exclusively local `file://` to `tools/browser-bridge-sandbox/sandbox.html`; throwaway context only; allowed message: `aggio`; `--no-open` validated (duplicate skip, invalid-message rejection verified); forbidden substrings rejected (`chatgpt.com`, `chat.openai.com`, `claude.ai`, `openai.com`, `anthropic.com`); no real ChatGPT/Claude.ai; no project chat; no INBOX read/answer; no external network/API/billing/key; no n8n/Telegram/Ollama/Cursor; project-chat phase (C) remains separate future gate | Sandbox phase complete (local file only). Project-chat (C) remains deferred. | Yes |
| C | **Browser Bridge project chat write `aggio` only** (script writes "aggio" to actual Claude.ai / ChatGPT) | browser bridge runtime | **deferred** — `D-0154-A = 2` decided (task 0155, 2026-05-13); project-chat write deferred; Browser Bridge remains sandbox-only for now; gate is NOT open; no implementation authorized; future reconsideration requires a new or reopened Decision Packet and explicit user response; **Must never answer INBOX** (Hard Constraint #4); cannot read or answer any `D-NNNN-X` decision. | Yes |
| D | **Telegram notifier Mode A — completion notification MVP** (bot creation, token in n8n vault, task completion notification) | Telegram runtime | **Single manual test succeeded (task 0170). D-0173-A = 3 decided (task 0177): schedule deferred; implement idempotency first. Idempotency/state-store design created (task 0178). Implementation checklist created (task 0179). D-0180-A = 1 decided (task 0182, 2026-05-13): idempotency/state-store runtime gate open. Runtime UI handoff created (task 0183): `docs/automation/telegram-idempotency-runtime-ui-handoff.md`. Next: inspect n8n Data Store/Data Table availability (inspection only, no node changes yet).** Credential prerequisite complete (task 0164). Workflow `TEST - Alina task completion Telegram notifier` inactive / not automatic. No Schedule Trigger. No token/chat id in repo. Queue reader untouched. Schedule activation remains a separate later gate. MVP design: `docs/automation/telegram-mode-a-completion-notification-mvp.md`. Runbook: `docs/automation/telegram-notifier-runbook-idempotency-hardening.md`. Telegram must not answer INBOX; must not write any `D-NNNN-X = N` response; must not use Browser Bridge / Ollama / Cursor; must not touch app/deploy/tag/rollback. | Yes |
| E | **n8n-to-local-bridge trigger** (n8n calls into local bridge endpoint when a task completes) | n8n + local runtime integration | **deferred** | Cannot proceed until Bridge dry-run/sandbox exists. Requires a local listener and an n8n outbound action — larger blast radius. | Yes |
| F | **Ollama install** (Ollama installed on Windows workstation, no model pulled) | local AI runtime | **candidate** (Gate 7 sub-gate) | Reversible, local-only, no provider API, no billing. Requires explicit Gate 7 opening. Source: `docs/automation/ollama-classifier-planner-feasibility-post-wiki.md`. | Yes |
| G | **Ollama model pull / local classifier first run** (e.g. `qwen3:8b` or `qwen3:14b`) | local AI runtime | **deferred** | Cannot proceed until Ollama install gate (F) is open. Several GB of download per model. | Yes |
| H | **Cursor CLI / headless single-agent** (Cursor CLI in force-mode for already-approved prompts) | implementer runtime | **deferred** | Held by current Cursor limitation window. Part of Gate 7 (Cursor side). Source: `docs/automation/cursor-cli-force-mode-implementer-bridge-design.md`. | Yes |
| I | **Cursor dual-agent loop** (Agent 1 Implementer + Agent 2 Reviewer) | implementer runtime | **deferred** | Cannot proceed until Cursor CLI / headless pilot (H) succeeds and the Cursor reset window closes. Source: `docs/automation/local-cursor-dual-agent-loop-design.md`. | Yes |
| J | **n8n Decision Packet Generator runtime** (n8n nodes generating real DPs into `docs/INBOX.md`) | n8n runtime modification | **candidate** (after playbook is stable) | Playbook (0146) defines the DP format. Generator runtime adds nodes to n8n — explicit manual gate per modification. Source: `docs/automation/n8n-decision-packet-generator-design.md`. | Yes |
| K | **n8n workflow modification / new node** (any new workflow or node beyond the current queue reader) | VPS / n8n runtime modification | **candidate** (only when exact node list and trigger are known) | Each change is a separate gate. Vague proposals must be rejected (anti-pattern #8 from 0146). | Yes |
| L | **Provider API / API key / billing** (OpenAI API, Anthropic API, OpenRouter, any hosted AI, any paid subscription) | permanently forbidden by default | **not recommended** | Permanently forbidden by default per Hard Constraints #1, #2, #3 of the readiness matrix. Zero-API architecture remains the project default. | Yes (and discouraged) |
| M | **App source modification** (`src/backend/Code.gs`, `src/frontend/Index.html`, Google Sheet structure) | app gate | **deferred** | Out of current workstream. App is stable V1.9.2 / @24; automation workstream does not touch the app. | Yes |
| N | **Apps Script deploy / tag / rollback** (`clasp push`, `git tag`, restore from stable tag) | always-manual app / release gate | **deferred** | Out of scope unless app work resumes. Each action is always a manual gate — never automated from n8n, runner, or CI. | Yes |

---

## 6. Recommended next gate candidate

**Candidate A (Browser Bridge dry-run) is implemented** (task 0150, 2026-05-13).

**Candidate B (Browser Bridge sandbox) is implemented** (task 0153, 2026-05-13) under authorization `D-0151-A = 1` (task 0152).
- Local-file-only sandbox surface (`tools/browser-bridge-sandbox/sandbox.html`).
- Launcher (`tools/browser-bridge-sandbox/browser-bridge-sandbox.py`) targets only `file://` for that surface.
- `--no-open` mode validated (idempotency skip, invalid-message rejection).
- No real ChatGPT/Claude.ai opened.
- No project chat used. No INBOX read or answered.
- No external network. No API key. No billing. No n8n / Telegram / Ollama / Cursor change.

**Candidate C (Browser Bridge project-chat write) is deferred** — `D-0154-A = 2` decided (task 0155, 2026-05-13). Browser Bridge remains sandbox-only for now. No project-chat implementation is authorized. Task 0156 (2026-05-13) added `docs/automation/browser-bridge-sandbox-hardening-plan.md` as a readiness reference for future reconsideration. Future reconsideration requires a new or reopened Decision Packet and an explicit user response. Project-chat cannot read or answer INBOX. Anti-creep rules intact. No runtime next step without new decision.

**Candidate D (Telegram Mode A completion notification MVP) — D-0180-A = 1 decided (task 0182, 2026-05-13).** All prior gates decided: `D-0157-A = 1` + `D-0163-A = 1` + `D-0165-A = 1` + `D-0167-A = 1` + `D-0169-A = 1` + `D-0171-A = 3` + `D-0173-A = 3` + `D-0180-A = 1`. Manual test succeeded (task 0170). Idempotency/state-store design ready (task 0178). Implementation checklist ready (task 0179). Runtime UI handoff created (task 0183): `docs/automation/telegram-idempotency-runtime-ui-handoff.md`. **Idempotency/state-store runtime gate is open.** Next: inspect n8n Data Store/Data Table availability (inspection only — do not add nodes until result is known). Workflow remains inactive / not automatic. No Schedule Trigger. No token/chat id in repo. Queue reader untouched. Schedule activation remains a separate later gate after idempotency is implemented and validated. Runbook: `docs/automation/telegram-notifier-runbook-idempotency-hardening.md`. Design: `docs/automation/telegram-notifier-idempotency-state-store-implementation-design.md`. Checklist: `docs/automation/telegram-notifier-idempotency-implementation-checklist.md`. No provider API LLM. No new billing. Telegram must not answer INBOX or execute project actions.

---

## 7. Explicit non-decisions

This document does NOT decide any of the following:

- ❌ Open Gate 7 (Ollama install + Cursor CLI activation)
- ❌ Install Ollama on any machine
- ❌ Pull any Ollama model
- ❌ Run Cursor CLI or Cursor headless
- ❌ Activate Cursor dual-agent loop
- ❌ Configure Telegram bot, store any token, or send any Telegram message
- ❌ Create any API key for any provider
- ❌ Introduce any new recurring cost or paid subscription
- ❌ Modify any n8n runtime (workflow, node, schedule, webhook, credential)
- ❌ Modify any VPS configuration
- ❌ Touch `src/**`, `gas-current/**`, `appsscript.json`, `package.json`, or `.github/workflows/**`
- ❌ Deploy Apps Script (`clasp push`, `npm run deploy`)
- ❌ Create any tag (`git tag`, `git push --tags`)
- ❌ Roll back to any prior stable tag
- ❌ Execute the Browser Bridge sandbox (B) or project-chat (C) phases
- ❌ Generate any runtime prompt
- ❌ Add any pending Decision Packet to `docs/INBOX.md`

Every item above remains subject to the gate process defined by tasks 0144 (readiness matrix) and 0146 (playbook).

---

## 8. Anti-creep rules

The candidate backlog has been seen before in other projects as an unintentional path to runtime drift. The following anti-creep rules apply permanently to this document.

| # | Rule |
|---|------|
| 1 | **Candidate backlog is not authorization.** Appearing in the table at any state (including `recommended next`) does not authorize execution. |
| 2 | **Ranking is not approval.** A higher-priority position relative to other candidates does not constitute an approval. |
| 3 | **`recommended next` is not a gate opening.** It is the orchestrator's proposal for what to discuss first — nothing more. |
| 4 | **No runtime prompt may be generated from this document alone.** Generating an implementer prompt for any candidate requires the full 0146 lifecycle (DP in INBOX → user response → recorded decision). |
| 5 | **Every runtime candidate still needs a real Decision Packet and a recorded INBOX decision.** The example DPs in the 0146 playbook (`D-EXAMPLE-*`) are documentation, not requests. |
| 6 | **No bundling.** A "recommended next" of B does not bring C, or any related candidate along with it. Each gate is a separate DP. |
| 7 | **No Obsidian shortcut.** A note in a personal Obsidian vault (see 0145) does not change any candidate's state or substitute for an INBOX decision. |
| 8 | **No silent state change.** Changing a candidate's state in this table requires an explicit task or an explicit orchestrator decision recorded in a session file. |

An implementer or agent that detects any anti-creep violation MUST stop, report the violation, and refuse to proceed until the violation is removed.

---

## 9. Update protocol

This backlog is a living planning document. Update it when, and only when, one of the following occurs.

| Trigger | Update |
|---------|--------|
| A gate has been **opened** (user responded with a non-defer option to a real DP) | Move the corresponding candidate from `recommended next` / `candidate` / `deferred` to a new state reflecting the partial activation (e.g. note in the row that dry-run is active, while sandbox remains `deferred`). |
| A gate has been **rejected** (user responded with `defer` or `skip`, or explicitly closed the gate) | Update the row's notes; the state may remain `candidate` or move to `deferred` depending on user intent. Do not silently re-promote. |
| A runtime **pilot succeeds** (e.g. Bridge dry-run validated) | Update the affected candidate (mark phase complete) and re-evaluate downstream candidates' `deferred` state (e.g. sandbox may move from `deferred` to `recommended next` after the user decides). Do not auto-promote — promotion still requires user intent. |
| A runtime **pilot fails** | Update the affected candidate with the failure note; downstream candidates remain `deferred` and may move to `blocked`. |
| **Cursor becomes available again** (reset / limitation window closes) | Re-evaluate candidates H and I; they may move from `deferred` to `candidate` or `recommended next`. |
| A **new candidate** is designed (new docs-only design task) | Add a row with state `candidate` and link the source document. |
| A **candidate becomes obsolete** | Move to `superseded` with a one-line reason; keep the row for traceability. |
| **0144 matrix or 0146 playbook changes** | Re-read both documents and verify that this backlog is consistent. Update where necessary. |

**Update discipline:** never update this backlog as a side effect of an unrelated task. A backlog change is either explicit in a task prompt or explicit in an orchestrator session — never implicit.

---

## References

| Document | Role |
|----------|------|
| `docs/automation/runtime-gate-checklist-readiness-matrix.md` | Task 0144 — readiness matrix (determines whether a gate is required) |
| `docs/automation/runtime-gate-decision-packet-playbook.md` | Task 0146 — playbook (determines how to request a gate) |
| `docs/automation/local-browser-bridge-preflight-design.md` | Browser Bridge design (candidates A, B, C) |
| `docs/automation/telegram-browser-bridge-trigger-coordination-design.md` | Telegram + Bridge coordination (candidate D and E) |
| `docs/automation/ollama-classifier-planner-feasibility-post-wiki.md` | Ollama feasibility (candidates F, G) — Gate 7 input |
| `docs/automation/cursor-cli-force-mode-implementer-bridge-design.md` | Cursor CLI / force-mode design (candidate H) — Gate 7 input |
| `docs/automation/local-cursor-dual-agent-loop-design.md` | Cursor dual-agent loop design (candidate I) — Gate 7 input |
| `docs/automation/n8n-decision-packet-generator-design.md` | n8n DP Generator design (candidate J) |
| `docs/automation/n8n-workflows/queue-reader.md` | Current operational n8n workflow (baseline for candidate K) |
| `docs/INBOX.md` | Human Decision Inbox (where real DPs are placed) |
| `docs/ORCHESTRATOR_RULES.md` | Sensitive gates list (authoritative) |
| `docs/AI_RULES.md` | Implementer rules, no provider APIs by default |
| `tools/browser-bridge-dry-run/README.md` | Browser Bridge dry-run tool (candidate A — implemented task 0150) |
| `tools/browser-bridge-sandbox/README.md` | Browser Bridge sandbox tool (candidate B — implemented task 0153) |

---

*This document is docs-only. It does not open any gate, does not create any Decision Packet, and does not add any pending INBOX entry. All runtime activations remain subject to the explicit manual gates defined in tasks 0144 and 0146.*
