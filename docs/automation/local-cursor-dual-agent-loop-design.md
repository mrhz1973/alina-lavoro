# Local Cursor Dual-Agent Loop Design

**Date:** 2026-05-13
**Task:** 0140-local-cursor-dual-agent-loop-design
**Type:** low-touch-loop-docs-only
**Status:** completed (docs-only design)

---

## 1. Executive Summary

This document formalizes the **Local Cursor Dual-Agent Loop** as the target architecture for the low-touch/no-api/local-first automation workstream. It also documents a **temporary 10-day fallback plan** because Cursor is not fully usable right now.

The target architecture is:

```
GitHub queue
  → n8n listener / dispatcher
  → Ollama/qwen (router + classifier + risk scorer + prompt compressor)
  → Cursor Agent 1: IMPLEMENTER (dedicated branch)
  → Cursor Agent 2: REVIEWER / ORCHESTRATOR-LITE (review branch diff + checks)
  → Telegram human gate / Decision Inbox
  → ChatGPT web (high-level supervisor, on-demand, no API)
  → User (decision authority — merge, deploy, tag, rollback, gates)
```

**Key constraints enforced across all phases:**
- ZERO provider APIs
- ZERO new billing
- ZERO new LLM API keys
- ChatGPT = web/on-demand only
- Local AI = Ollama/local models only
- Human decisions remain human

**Temporary constraint (approx. 10 days):** Cursor is not fully usable. For this period, Claude Code is the main supervised fallback. Windsurf/Cascade is the backup. The Dual-Agent Loop is the target to design and prepare, not to execute immediately.

---

## 2. Relationship to Task 0139 — Auto-Aggio Prompt-Generation Handshake

Task 0139 (`docs/automation/auto-aggio-prompt-generation-handshake-design.md`) clarified that "aggio" is not only a status refresh but a full **prompt-generation handshake**:

1. ChatGPT performs post-check (reads GitHub)
2. Identifies decisions required or not
3. If no decisions: generates next implementer prompt immediately
4. If decisions: produces Decision Packet and stops

The Dual-Agent Loop **feeds directly into this handshake**:

- After Agent 2 (Reviewer) completes its review, the result is committed and pushed to the branch.
- n8n detects the push and notifies the user (Telegram or future bridge).
- User writes "aggio" (or future bridge writes it automatically).
- ChatGPT performs post-check: reads branch diff, verifies Agent 1 and Agent 2 outputs, checks for Decision Packet patterns.
- If post-check passes with no decisions: ChatGPT generates the next task prompt (next iteration of the loop).
- If post-check finds a decision needed (merge approval, cleanup, risk detected): ChatGPT produces Decision Packet.

**Dependency:** the Auto-Aggio handshake is the "return path" of the Dual-Agent Loop. The loop does not complete until ChatGPT performs post-check and either generates the next prompt or issues a Decision Packet.

---

## 3. Relationship to Task 0135 — Cursor CLI Force-Mode Implementer Bridge

Task 0135 (`docs/automation/cursor-cli-force-mode-implementer-bridge-design.md`) defined:

- Architecture: `GitHub queue → n8n/script → Ollama JSON router → Cursor CLI force-mode → dedicated branch → push → ChatGPT post-check`
- Dedicated branch pattern: `ai/<task-id>-<slug>`
- No automatic merge to main
- Ollama as classifier/router/compressor only
- Cursor CLI feasibility gate: if CURSOR_API_KEY or new billing required → STOP

**Task 0140 extends task 0135 by:**

| 0135 Defines | 0140 Adds |
|---|---|
| Single Cursor agent (implementer) | Second Cursor agent (reviewer / orchestrator-lite) |
| Cursor executes and pushes branch | Reviewer reads branch diff, runs checks, prepares review output |
| ChatGPT does post-check on demand | Reviewer reduces ChatGPT post-check workload for routine tasks |
| Ollama classifies and compresses | Ollama also suggests which tasks are safe for dual-agent routing vs human-required |
| Dedicated branch mandatory | Branch policy extended: reviewer works on same branch, commits review summary |

The dual-agent extension does NOT replace 0135 architecture; it is a layer on top of it. The 0135 branching model, Ollama JSON schema, and task class taxonomy (A/B/C/D/E) remain canonical.

---

## 4. Temporary 10-Day Fallback Plan

Cursor is not fully usable for approximately 10 days. During this window:

| Role | Assigned to | Mode |
|------|-------------|------|
| Main implementer | Claude Code (local) | Supervised, manual prompt delivery |
| Backup implementer | Windsurf/Cascade | Supervised, manual prompt delivery |
| Target future implementer | Cursor (both agents) | Not active — design phase only |
| Orchestrator | ChatGPT web | On-demand, no API |
| Classifier/compressor (advisory) | Ollama qwen3:14b | Advisory, JSON output only |
| Human gate | User | All sensitive decisions |

**What changes during the fallback window:**
- Docs-only tasks continue as normal using Claude Code.
- No Cursor CLI is triggered.
- No dual-agent loop is activated.
- n8n queue reader continues operating.
- Ollama can assist Claude Code sessions via manual copy of its JSON output (not automated).

**What does NOT change:**
- Branch-on-main policy: even during fallback, significant automation design or multi-file docs work should use a named branch if practical, though Claude Code supervised work on main remains allowed for docs-only tasks per existing rules.
- All gate rules remain identical.
- Decision Packet protocol remains active.
- ZERO API policy remains intact.

**When Cursor returns:**
- Execute Cursor CLI force-mode feasibility preflight (runtime-gated task, separate gate required).
- If feasibility passes: activate Agent 1 (Implementer) on first harmless docs-only task.
- Later: activate Agent 2 (Reviewer) after Agent 1 is stable.
- No automatic merge until both agents validated separately.

---

## 5. Architecture Components

### 5.1 n8n Listener / Dispatcher

| Property | Value |
|---|---|
| Host | VPS (127.0.0.1:5678, hardened Docker) |
| Trigger | Schedule (5-min polling) or future GitHub webhook |
| Role | Reads task queue; skips done/processing/failed; dispatches eligible task |
| Output | Task metadata + compact context to Ollama input |
| Current status | Operational (queue reader validated) |

### 5.2 Ollama/qwen Router

| Property | Value |
|---|---|
| Host | Windows workstation (Ryzen 9 3900X / RTX 3060 12 GB) |
| Model | qwen3:14b (validated locally 2026-05-13) |
| Input | Compact task metadata + LLMS/wiki summary (≤6–10k chars) |
| Output | JSON: task_class, risk_level, branch_name, allowed/forbidden paths, cursor_mode, recommended_cursor_model, can_force_execute, prompt_for_cursor, confidence |
| Role | Route task to correct implementer pipeline |

### 5.3 Ollama/qwen Classifier

Subfunction of the router. Assigns task class from the 0135 taxonomy:

| Class | Description |
|---|---|
| A | Routine docs-only — auto-executable by Cursor Agent 1 |
| B | Medium docs/workflow/wiki — auto-executable with normal model |
| C | Delicate architecture — auto-executable with strong model + human review before merge |
| D | App code — STOP, human gate required |
| E | Runtime/deploy/tag/rollback/API/security — STOP, human gate required |

### 5.4 Ollama/qwen Risk Scorer

Subfunction of the router. Assigns risk level:

| Level | Meaning |
|---|---|
| low | Safe to auto-execute; Agent 1 proceeds |
| medium | Proceed with heightened review; Agent 2 review mandatory |
| high | Human review before any merge; Decision Packet required |
| blocked | STOP; do not execute; Decision Packet with explicit user approval required |

### 5.5 Ollama/qwen Prompt Compressor

Subfunction of the router. Compresses the full task context into a compact Cursor-ready prompt:

- Reads LLMS.md + task file + minimal canonical context
- Produces compressed prompt ≤2–4k chars
- Includes: branch name, allowed paths, forbidden paths, objective, checks, commit message template, final report format
- Does NOT include: full PROJECT_STATE.md, full session history, full canonical docs

### 5.6 Future Cursor Agent 1 — IMPLEMENTER

| Property | Value |
|---|---|
| Mode | Force-mode (modifies files directly) |
| Branch | Dedicated: `ai/<task-id>-<slug>` or `work/<task-id>-<slug>` |
| Input | Compressed prompt from Ollama compressor |
| Actions | Modify allowed files, run checks, commit, push branch |
| Forbidden | Merge to main, deploy, tag, rollback, touch forbidden paths, create API keys |
| Status | Future — requires Cursor CLI feasibility preflight (runtime-gated, separate gate) |

### 5.7 Future Cursor Agent 2 — REVIEWER / ORCHESTRATOR-LITE

| Property | Value |
|---|---|
| Mode | Read-only on branch; writes review summary only |
| Branch | Same branch as Agent 1 |
| Input | Branch diff + allowed paths list + risk level from Ollama |
| Actions | Read diff, run static checks, verify no forbidden paths touched, verify commit message, produce structured review output |
| Output | Review summary committed to branch: pass/fail/issues, recommended action |
| Role | Reduces ChatGPT post-check workload; surface issues before human review |
| Forbidden | Merge to main, modify app source, deploy, tag, rollback, create API keys, overrule human decisions |
| Status | Future — activates only after Agent 1 is stable and validated |

### 5.8 Telegram Human Gate

| Property | Value |
|---|---|
| Role | Notify user when branch is pushed and review summary is ready |
| Trigger | n8n on commit/push detected |
| Content | Task ID, branch name, Agent 2 review result (pass/fail/issues), link or reference to Decision Packet if needed |
| User action | Open ChatGPT, write "aggio", review Decision Packet if present |
| Status | Future — design only; no Telegram configuration in this task |

### 5.9 Decision Inbox / Decision Packet

| Property | Value |
|---|---|
| Format | Canonical (task 0127: `docs/automation/decision-packet-format.md`) |
| File | `docs/INBOX.md` (not yet created — future task) |
| Trigger | ChatGPT post-check identifies a real decision |
| Content | Structured decision request: options, recommendation, impact, gates |
| User action | Reply with number/short word |
| Status | Decision Packet format: done. INBOX.md: future |

### 5.10 ChatGPT Web — High-Level Supervisor

| Property | Value |
|---|---|
| Mode | Web/on-demand — no OpenAI API |
| Role | Post-check, strategic decisions, Decision Packet generation, aggio handshake |
| Trigger | User writes "aggio" or future bridge writes it automatically |
| Scope | Reads GitHub (LLMS-first routing), validates branch diff, approves/rejects loop |
| Not replaced by | Ollama (advisory only), Agent 2 (lite review only) |

---

## 6. Ollama Advisory-Only Role

Ollama (qwen3:14b, future qwen-alina:14b) is strictly advisory:

### Allowed
- Classify task type, risk, class
- Compress context for Cursor prompt
- Score risk level
- Draft routing/prompt suggestions for human review
- Draft Decision Packet helper output
- Summarize LLMS/wiki state

### Forbidden
- Make decisions for the user
- Modify files
- Execute shell commands
- Deploy, tag, rollback
- Replace ChatGPT as orchestrator
- Replace Cursor as implementer
- Act as source of truth (GitHub is source of truth)
- Call provider APIs
- Create API keys

**Principle:** If Ollama output is wrong or uncertain, the fallback is manual triage. Ollama is never authoritative; it is a compression and classification aid.

---

## 7. Cursor Model Routing Policy

| Scenario | Model | Rule |
|---|---|---|
| Routine / docs-only (Class A) | Cursor Auto | Default for most tasks |
| Medium docs / workflow (Class B) | Cursor Auto or medium | Auto preference |
| Delicate architecture (Class C) | Stronger model (e.g. GPT-4o in Cursor if included) | Only if available in current subscription |
| App code (Class D) | N/A — STOP | Human gate required |
| Runtime/deploy/security (Class E) | N/A — STOP | Human gate required |

**Billing gate (hard rule):** If using a stronger model (e.g. GPT-5.5, o3, or equivalent) inside Cursor requires:
- An extra API call
- A new API key (CURSOR_API_KEY or OpenAI API key)
- New provider billing
- Recurring costs
- A separate paid quota

→ **STOP the workflow immediately.** Issue a Decision Packet with the billing/API requirement. Do not proceed. Fallback to a lighter model already included in the current subscription, or to Claude Code.

This rule applies to both Agent 1 and Agent 2.

---

## 8. Dual-Agent Model

### Agent 1 — IMPLEMENTER

- Works on dedicated branch: `ai/<task-id>-<slug>`
- Receives compressed prompt from Ollama
- Modifies only allowed files
- Runs defined checks
- Commits with structured commit message
- Pushes branch
- Does NOT merge, deploy, tag, rollback

### Agent 2 — REVIEWER / ORCHESTRATOR-LITE

- Works on same branch (read-only for diff; write-only for review summary)
- Reads diff produced by Agent 1
- Runs static checks: forbidden paths, commit message format, allowed paths compliance, diff size
- Produces structured review output: `pass / fail / issues_found`
- Commits review summary to branch
- Pushes review commit
- Does NOT merge, deploy, tag, rollback, modify app source, create API keys

### ChatGPT Web — Strategic Supervisor

- Receives "aggio" signal
- Reads branch on GitHub
- Reads Agent 2 review summary
- Performs final post-check
- Generates Decision Packet if merge/cleanup/reject decision is needed
- Generates next task prompt if all clear
- Remains high-level decision layer, not replaced by Agent 2

### User — Decision Authority

- All merge decisions
- All deploy, tag, rollback decisions
- All sensitive gate decisions
- Physical tests (Alina app on phone)
- Any decision requiring human judgment

**Chain of authority:** Ollama (advisory) → Agent 1 (execute) → Agent 2 (review) → ChatGPT (post-check + Decision Packet) → User (decision)

---

## 9. Branch Policy

| Rule | Value |
|---|---|
| Pattern | `ai/<task-id>-<slug>` or `work/<task-id>-<slug>` |
| Example | `ai/0140-local-cursor-dual-agent-loop-design` |
| Direct main modifications | Forbidden for automated Cursor loop |
| Automatic merge | Forbidden — always human decision |
| Branch lifecycle | create → Agent 1 executes → Agent 2 reviews → push → ChatGPT post-check → user decides merge or reject |
| Branch deletion | After merge (if approved) or after rejection |
| main protection | main remains stable; automated work only on dedicated branches |

**Fallback for current supervised work (Claude Code / Windsurf):** Supervised docs-only work on main continues as allowed per existing rules. The branch policy applies specifically to future automated Cursor loop execution.

---

## 10. Anti-Loop GitHub Guard

To prevent infinite loops, reprocessing, and ping-pong between agents:

### Detection Rules

| Condition | Check |
|---|---|
| Task already processing | `docs/tasks/processing/{task}-cursor-prompt.md` exists → skip |
| Task already done | `docs/tasks/done/{task}.md` exists → skip |
| Task already failed | `docs/tasks/failed/{task}.md` exists → skip |
| Branch already exists | Branch `ai/<task-id>-*` exists → skip or report conflict |
| Agent 2 review already committed | Review summary commit already on branch → do not re-review |

### Terminal States

| State | File | Meaning |
|---|---|---|
| `done` | `docs/tasks/done/{task}.md` | Task completed successfully |
| `failed` | `docs/tasks/failed/{task}.md` | Task failed; retry only via new task with `-retry-N` suffix |
| `decision_required` | Decision Packet in INBOX or ChatGPT | Task paused awaiting user decision |
| `blocked` | Decision Packet: risk=blocked | Task blocked; human review mandatory before any action |

### Ping-Pong Prevention

- Agent 1 commits exactly once per task execution.
- Agent 2 reviews exactly once per Agent 1 commit.
- If Agent 2 finds issues: do NOT trigger Agent 1 again automatically. Issue a Decision Packet: user decides whether to retry, abandon, or manually correct.
- Automatic retry is forbidden. Retry requires a new task with `-retry-N` suffix.
- Rate limit: maximum 1 loop execution per task ID per repository session.

---

## 11. Decision Packet Schema Integration

A Decision Packet (canonical format: `docs/automation/decision-packet-format.md`) is required when:

| Trigger | DP Kind |
|---|---|
| Merge branch to main requested | `automation` |
| Runtime gate detected (n8n, VPS, Ollama install) | `infra` |
| Deploy Apps Script requested | `automation` or `infra` |
| Git tag creation requested | `automation` |
| Rollback requested | `automation` |
| API key creation required | `infra` |
| Provider billing detected | `infra` |
| App source change (`src/**`) detected in diff | `alina-feature` or `automation` |
| Sensitive data or credentials touched | `infra` |
| Agent 2 reports `fail` or `issues_found` | `automation` |
| Risk level `high` or `blocked` from Ollama | `automation` |
| ChatGPT post-check finds out-of-scope changes | `automation` |
| User has not confirmed since last physical test | `alina-feature` (if app-related) |

### DP Schema (extended for dual-agent context)

```json
{
  "dp_id": "D-<task-id>-<seq>",
  "kind": "automation | infra | alina-feature | meta",
  "trigger": "merge | deploy | api-key | agent2-fail | blocked | ...",
  "task_id": "<task-id>",
  "branch": "ai/<task-id>-<slug>",
  "agent2_review_result": "pass | fail | issues_found",
  "agent2_issues": ["list of issues found"],
  "recommendation": "<orchestrator recommendation>",
  "options": [
    {"id": 1, "label": "approve merge", "description": "..."},
    {"id": 2, "label": "reject and delete branch", "description": "..."},
    {"id": 3, "label": "request cleanup", "description": "..."}
  ],
  "gates_required": ["merge", "deploy", "..."],
  "no_provider_api": true,
  "no_new_billing": true
}
```

---

## 12. No-API / No-Billing Policy

This is a hard architectural constraint, not a preference:

| Rule | Applies to |
|---|---|
| ZERO OpenAI API calls | All components |
| ZERO Anthropic API calls | All components |
| ZERO OpenRouter calls | All components |
| ZERO other provider LLM API calls | All components |
| ZERO new LLM API keys | All components |
| ZERO recurring LLM billing | All components |
| ChatGPT = web/on-demand only | Orchestrator |
| Claude Code = supervised tool (current subscription) | Implementer |
| Cursor = supervised tool (current subscription, no extra API key) | Implementer/Reviewer |
| Local AI = Ollama/local models only | Classifier/router/compressor |

**Billing gate enforcement:**
- If any component of the Dual-Agent Loop requires a new API key, provider API, or recurring billing → **STOP immediately**.
- Issue a Decision Packet categorized as `infra` with the billing/API requirement described.
- Do not activate that component until the user explicitly approves the new cost after reviewing the Decision Packet.

---

## 13. Immediate Next Roadmap

This design completes the **docs-only** phase for the Dual-Agent Loop. No runtime was activated.

### Next Possible Docs-Only Tasks

| Task | Description | Gate |
|---|---|---|
| Telegram notifier design | Design n8n-to-Telegram notification for task completion | No runtime gate — docs-only |
| Browser bridge preflight design | Design local browser bridge (AutoHotkey/Playwright) for writing "aggio" automatically | No runtime gate — docs-only |
| Decision Inbox concrete file design | Design `docs/INBOX.md` format and workflow | No runtime gate — docs-only |

### Next Runtime-Gated Tasks (require explicit manual gate)

| Task | Gate required |
|---|---|
| Cursor CLI force-mode feasibility preflight | Cursor CLI runtime gate |
| Telegram bot runtime setup | VPS / n8n runtime gate |
| Local browser bridge implementation | Local machine runtime gate |
| Ollama qwen-alina profile creation | Local Ollama runtime gate |

### Not Activated in This Task

- No Cursor execution
- No n8n runtime changes
- No Telegram configuration
- No Ollama execution
- No model download
- No API key
- No billing
- No deploy, tag, rollback
- No app source changes

---

## Micro-Interactions Eliminated by Target Architecture

| Interaction | Current | Eliminated by Dual-Agent |
|---|---|---|
| User copies prompt to implementer | Every task | ✅ Agent 1 receives prompt automatically |
| User writes "aggio" after each task | Every task | ✅ Telegram/bridge triggers aggio automatically |
| User identifies if Agent 1 made errors | Every merge | ✅ Agent 2 reviews before user sees result |
| ChatGPT manually reviews full diff | Every post-check | ✅ Agent 2 pre-filters; ChatGPT reviews summary |
| User chooses next task | Every loop | ✅ n8n queue drives next task automatically |
| User manually starts implementer | Every task | ✅ n8n activates Agent 1 after queue read |

**Gate residui intentionali (non eliminabili):**
- User approves merge (human authority)
- User responds to Decision Packet (human authority)
- User authorizes deploy/tag/rollback (human authority)
- User performs physical test on phone (physical gate)

---

## Failure Modes

| Failure | Detection | Mitigation |
|---|---|---|
| Agent 1 touches forbidden file | Agent 2 diff check | Reject branch, Decision Packet |
| Agent 1 commits on main | Post-check branch validation | Reject, manual cleanup |
| Agent 2 review is incorrect | ChatGPT post-check override | Manual review, user override |
| Ollama misclassifies task | Risk-level check fails post-review | Manual triage, adjust Ollama prompt |
| Ping-pong between agents | Anti-loop guard (one commit per agent per task) | Terminal state: decision_required |
| Model billing triggered unexpectedly | Billing gate (section 7) | STOP, Decision Packet |
| Cursor CLI requires API key | Feasibility gate (from 0135, section J) | STOP, Decision Packet |
| n8n dispatcher fails | Fallback to manual | Manual "aggio" and supervised Claude Code |
| Branch diverges from main | Merge conflict in post-check | Decision Packet: cleanup / rebase / reject |

---

## Conclusione

The Local Cursor Dual-Agent Loop formalizes the next step in the low-touch automation workstream:

- **Immediate:** Claude Code (main) + Windsurf (backup) as supervised fallbacks during ~10-day Cursor unavailability.
- **Near-term design:** Dual-agent model documented; branch policy, anti-loop guards, Decision Packet integration, and no-API policy all defined.
- **Future execution:** Cursor CLI feasibility preflight → Agent 1 dry run → Agent 2 integration → full loop activation.
- **Permanent constraints:** Human decisions remain human. No provider APIs. No new billing.

This design connects 0139 (Auto-Aggio handshake) + 0135 (Cursor CLI bridge) + 0128 (autonomous low-touch loop) into a cohesive target architecture.

**Task 0140 docs-only — completed 2026-05-13**
