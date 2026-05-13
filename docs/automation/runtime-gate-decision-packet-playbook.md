# Runtime Gate Decision Packet Playbook / Gate Request Playbook

**Task:** 0146
**Date:** 2026-05-13
**Type:** docs-only / low-touch-loop design
**Status:** active reference document

---

## 1. Purpose

This playbook defines **how future runtime gate requests are written and reviewed**, using the project's canonical Decision Packet Format and the Human Decision Inbox.

This document **does not open any gate**. It only standardizes the request artifact (a Decision Packet) and the lifecycle (proposed action → gate check → DP → human decision → recorded response) that any future runtime activation MUST go through.

It applies to every implementer (Claude Code, Cursor, Windsurf/Cascade, future n8n classifier/planner) and to the orchestrator (ChatGPT).

**This task (0146) performs no runtime action. No INBOX pending decision is added. No gate is opened.**

---

## 2. Relationship to task 0144

The two documents are complementary and must be used together:

| Document | Purpose |
|----------|---------|
| `docs/automation/runtime-gate-checklist-readiness-matrix.md` (task 0144) | **Determines whether a gate is required** for a proposed action — readiness, status, scope per component. |
| `docs/automation/runtime-gate-decision-packet-playbook.md` (this file, task 0146) | **Determines how to formulate the gate request** once a gate is required — the Decision Packet template, the lifecycle, the anti-patterns. |

**Rule of engagement:**

1. Before any action that may touch runtime, app, deploy, tag, rollback, API, billing, or keys → **consult the readiness matrix (0144)** first.
2. If the matrix marks the action as 🟡 (gated), 🚫 (blocked), or ❌ (deferred) → **stop implementation** and apply this playbook (0146) to build a Decision Packet.
3. If the matrix marks the action as ✅ (active, no gate) → proceed without a Decision Packet.

The readiness matrix is the **input** of this playbook. The Decision Packet is the **output**.

---

## 3. Gate request lifecycle

Every runtime gate request follows this lifecycle. Each step must complete before the next.

```
[1] proposed action detected
       │
       ▼
[2] check readiness matrix (docs/automation/runtime-gate-checklist-readiness-matrix.md)
       │
       ├── ✅ active → proceed without gate (no DP)
       │
       └── 🟡 / 🚫 / ❌ → gated → continue lifecycle
              │
              ▼
[3] stop implementation
       │  - implementer must not partially activate
       │  - implementer must not "prepare runtime" pre-emptively
       │
       ▼
[4] create Decision Packet
       │  - use canonical Decision Packet Format (docs/automation/decision-packet-format.md)
       │  - use a gate-specific variant (Section 6 of this playbook)
       │  - include the 13 canonical DP fields + INBOX header fields
       │
       ▼
[5] place pending decision in docs/INBOX.md
       │  - only if a real decision is required
       │  - never as a status update, log, or "all green" notification
       │  - never for already-authorized docs-only tasks
       │
       ▼
[6] user responds intentionally
       │  - response form: D-NNNN-X = N | defer | skip | retry
       │  - user reads the DP in the orchestrator chat and answers manually
       │  - no automated agent may answer
       │
       ▼
[7] orchestrator records response
       │  - move block from Pending → Decided
       │  - set response and decided_at fields
       │  - commit docs/INBOX.md selectively
       │
       ▼
[8] implementer receives runtime prompt
       │  - only after response is recorded
       │  - prompt references the recorded decision (D-NNNN-X)
       │  - runtime remains forbidden until step 7 has produced a Decided record
```

**Until step 7 has recorded a response, runtime remains forbidden.** No implementer, no agent, no automation may bypass this lifecycle.

---

## 4. Categories requiring a gate request

A Decision Packet is required before any action falling into the following categories. The list is non-exhaustive — when in doubt, treat the action as gated.

| Category | Examples |
|----------|----------|
| **VPS / n8n runtime modification** | New workflow, enable/disable workflow, schedule change, new node, webhook, VPS config (nginx, firewall, systemd, cron), SSH session, n8n credentials change |
| **Telegram runtime** | Bot creation, bot token storage, chat ID configuration, first message, n8n Telegram node activation |
| **Browser Bridge runtime** | Dry-run activation, sandbox activation, project chat activation, any browser automation execution |
| **Ollama runtime / Gate 7** | Ollama install, model pull (e.g. `qwen3:8b`), embeddings runtime, inference endpoint exposure, classifier/planner first run |
| **Cursor CLI / headless runner / Gate 7** | Cursor headless execution, Agent 1/Agent 2 dual-agent loop activation, fire-and-forget Cursor run from n8n or VPS |
| **App source modification (`src/**`)** | Any change to `src/backend/Code.gs`, `src/frontend/Index.html`, `gas-current/**`, Google Sheet structure, new external library |
| **Apps Script deploy** | Any `clasp push`, deploy @N+1, Apps Script publish |
| **Release tag** | `git tag`, `git push --tags`, stable tag creation, pre-release tag |
| **Rollback** | Any reset to prior stable tag, `git revert` on production, restore from backup |
| **GitHub Actions** | Any `.github/workflows/**` change, new workflow, new secret, new runner |
| **Provider API** | Any call to OpenAI API, Anthropic API, OpenRouter, hosted AI provider, third-party LLM |
| **API key (any provider)** | Creation, storage, configuration, rotation of API key for any provider |
| **New billing / recurring cost** | Any paid subscription, per-call billing, new storage cost, new domain, new managed service |

The readiness matrix (0144) is the source of truth for status of each category. This playbook governs the **request format** once the matrix flags a gate.

---

## 5. Decision Packet — minimum fields

Use the canonical Decision Packet Format (`docs/automation/decision-packet-format.md`) with **all 13 fields in canonical order**, plus INBOX header fields when the DP is placed in `docs/INBOX.md`.

The block below is the minimum template that every runtime gate Decision Packet MUST follow.

```markdown
### D-NNNN-X — [short title — name the gate and the action]

**inbox_status:** pending
**created_at:** YYYY-MM-DD
**source_task:** NNNN-slug
**source_document:** docs/automation/{topic}.md
**response:**
**decided_at:**
**superseded_by:**
**archive_policy:** keep

---

**Decision ID:** D-NNNN-X
**Kind:** automation | infra | meta | alina-feature
**Data:** YYYY-MM-DD

## Contesto

[2–4 lines: what runtime component, what state today, why this gate now]

## Perché serve decisione

[what would change at runtime / why the system cannot proceed without an explicit human choice]

## Opzioni

1. **[option 1 — usually: open the gate, narrow scope]** — [what is authorized and what is not]
2. **[option 2 — usually: defer / smaller scope]** — [what changes vs. option 1]
3. **[option 3 — usually: do not open the gate]** — [no-op fallback]

## Raccomandazione orchestratore

[recommended option with brief, factual reason]

## Rischio principale

[the single biggest risk of the recommended option — runtime exposure, irreversibility, cost, security]

## Impatto

Su app Alina / automazione / infra / roadmap: [who/what is impacted; explicit "no impact on app source" when applicable]

## Micro-interazioni umane eliminate

[how many micro-interactions does the recommended option eliminate? If zero, state it explicitly — runtime gates often do not eliminate micro-interactions, they enable a new capability]

## Scelta richiesta

Scrivi: `D-NNNN-X = N` (option number) oppure `D-NNNN-X = defer` / `D-NNNN-X = skip`

## Cosa succede dopo la scelta

[the next implementer prompt that will be generated; what file/runtime is touched; what the implementer will and will not do]

## Cosa NON verrà fatto senza ulteriore gate

[explicit permanent gates that this DP does NOT open — always include: no deploy, no tag, no rollback, no app source, no API key, no provider API, no billing, no INBOX automated resolution, no Gate 7 (unless this DP IS the Gate 7 request)]
```

**Field ordering is invariant.** `Kind` is field 2, always immediately after `Decision ID`. Do not reorder.

---

## 6. Gate-specific template variants

The following variants are **examples and templates only**. None of them represents a real pending decision. Do not copy them into `docs/INBOX.md` unless a real decision is required by an active task.

The Decision ID `D-EXAMPLE-X` is reserved for documentation; real DPs use the source task slug.

### 6.1 Telegram notifier gate (example)

```markdown
### D-EXAMPLE-Telegram — Activate Telegram notifier (Mode A)

**Decision ID:** D-EXAMPLE-Telegram
**Kind:** automation
**Data:** YYYY-MM-DD

## Contesto
Telegram notifier is designed (Mode A, see telegram-browser-bridge-trigger-coordination-design.md) but not active. The bot does not exist; no token is stored. The readiness matrix marks Telegram as 🟡 gated.

## Perché serve decisione
Sending the first Telegram message requires: bot creation, bot token, chat ID, n8n Telegram node. Each is a runtime change with a permanent API key footprint.

## Opzioni
1. **Create bot + store token in n8n only + send test message** — minimum viable: one bot, one chat ID, token in n8n credential vault only, no commit.
2. **Defer Telegram, use INBOX-only notification** — no new runtime; rely on user reading docs/INBOX.md.
3. **Do not introduce Telegram** — keep INBOX-only permanently.

## Raccomandazione orchestratore
Option 2 — defer. INBOX is sufficient for current decision volume.

## Rischio principale
Option 1: API key footprint, bot token must be rotated if leaked; one more runtime channel to monitor.

## Impatto
Automation: adds notification channel. App Alina: no impact. Infra: n8n credential vault entry. Roadmap: opens Telegram workstream.

## Micro-interazioni umane eliminate
Option 1: ~2/week (no longer need to open GitHub to check INBOX). Option 2: 0.

## Scelta richiesta
Scrivi: `D-EXAMPLE-Telegram = N`

## Cosa succede dopo la scelta
If 1: implementer prompt for bot creation + n8n node config + first test message. If 2: stay on INBOX. If 3: close Telegram workstream.

## Cosa NON verrà fatto senza ulteriore gate
No bot token commit to repo, no deploy, no tag, no rollback, no app source, no provider LLM API, no billing. Telegram bridge must not answer INBOX.
```

### 6.2 Browser Bridge dry-run gate (example)

```markdown
### D-EXAMPLE-Bridge-DryRun — Activate Browser Bridge dry-run

**Decision ID:** D-EXAMPLE-Bridge-DryRun
**Kind:** automation
**Data:** YYYY-MM-DD

## Contesto
Browser Bridge is designed (local-browser-bridge-preflight-design.md). MVP path is 3-phase: dry-run → sandbox → project chat. Currently no phase is active. Bridge writes "aggio" only.

## Perché serve decisione
Dry-run is the first runtime phase. It writes to a local test file without any browser. Even this phase modifies the local filesystem and changes runtime state.

## Opzioni
1. **Activate dry-run only** — local script, no browser, output to a local file. Sandbox and project chat remain gated.
2. **Defer Bridge entirely** — no runtime.

## Raccomandazione orchestratore
Option 1 — narrow scope, dry-run is the safest first step and validates the trigger pipeline.

## Rischio principale
Option 1: script execution introduces a new local automation surface; idempotency key must be implemented before sandbox phase.

## Impatto
Automation: adds a write-only local trigger. App Alina: no impact. Infra: no n8n change.

## Micro-interazioni umane eliminate
0 in dry-run phase. ~1/day after project chat phase (no longer manually typing "aggio").

## Scelta richiesta
Scrivi: `D-EXAMPLE-Bridge-DryRun = N`

## Cosa succede dopo la scelta
If 1: implementer prompt for dry-run script + idempotency key + rate-limit check. Sandbox is a separate later DP. If 2: Bridge stays designed-only.

## Cosa NON verrà fatto senza ulteriore gate
No browser execution, no Claude.ai write, no INBOX read, no INBOX response, no deploy, no API key, no provider API, no billing. Sandbox and project chat phases are separate future gates.
```

### 6.3 Ollama install / model pull gate (example — Gate 7 component)

```markdown
### D-EXAMPLE-Ollama — Open Gate 7 (Ollama install + first model pull)

**Decision ID:** D-EXAMPLE-Ollama
**Kind:** infra
**Data:** YYYY-MM-DD

## Contesto
Ollama is feasibility-validated (ollama-classifier-planner-feasibility-post-wiki.md). Target hardware: Windows workstation (Ryzen 9 3900X / RTX 3060 12 GB). No install yet. Gate 7 is the explicit manual gate covering Ollama install + Cursor CLI activation. Gate 7 is not yet opened.

## Perché serve decisione
Ollama install introduces a local runtime; the first model pull (e.g. `qwen3:8b`) downloads ~5 GB and exposes a local inference endpoint. Both are reversible but are runtime state changes.

## Opzioni
1. **Open Gate 7 — Ollama install + qwen3:8b pull only** — Ollama installed on Windows workstation, one model pulled, inference endpoint local-only (no exposure). Cursor CLI remains separately gated within Gate 7.
2. **Open Gate 7 — Ollama install only, no model pull yet** — install only; model pull is a separate future DP.
3. **Defer Gate 7** — Ollama and Cursor CLI remain blocked.

## Raccomandazione orchestratore
Option 2 — install only first, model pull as a separate narrow gate. Maximum reversibility.

## Rischio principale
Option 1: 5 GB download, inference endpoint exposed locally; if firewall is misconfigured, endpoint becomes reachable.

## Impatto
Infra: local runtime added on Windows workstation. App Alina: no impact. Automation: enables future classifier/planner workstream.

## Micro-interazioni umane eliminate
0 immediately. Future: classifier/planner could eliminate manual task triage (~3–5/day) once active.

## Scelta richiesta
Scrivi: `D-EXAMPLE-Ollama = N`

## Cosa succede dopo la scelta
If 1: implementer prompt for install + qwen3:8b pull + endpoint check. If 2: implementer prompt for install only; model pull DP later. If 3: Gate 7 stays closed.

## Cosa NON verrà fatto senza ulteriore gate
No Cursor CLI activation (separate even within Gate 7), no provider API, no billing, no API key, no deploy, no app source, no n8n runtime change, no model use for production decisions without separate gate.
```

### 6.4 Cursor CLI / headless gate (example — Gate 7 component)

```markdown
### D-EXAMPLE-CursorCLI — Activate Cursor CLI headless (Gate 7 sub-gate)

**Decision ID:** D-EXAMPLE-CursorCLI
**Kind:** automation
**Data:** YYYY-MM-DD

## Contesto
Cursor is currently suspended pending reset. The dual-agent loop (local-cursor-dual-agent-loop-design.md) is design-only. Cursor CLI / headless runner is part of Gate 7.

## Perché serve decisione
Headless Cursor execution removes human-in-the-loop on implementer prompts; even one fire-and-forget run is a runtime change.

## Opzioni
1. **Activate Cursor CLI headless** — single-agent headless mode for prompts already approved via INBOX.
2. **Activate dual-agent loop (Agent 1 + Agent 2)** — full loop with implementer + reviewer agents.
3. **Defer Cursor CLI** — stay on supervised Claude Code as principal implementer.

## Raccomandazione orchestratore
Option 3 — defer until Cursor reset is resolved and a separate supervised pilot is run.

## Rischio principale
Option 1/2: removes supervision; an erroneous prompt could touch forbidden paths or attempt deploy.

## Impatto
Automation: new headless implementer. App Alina: no impact (still gated). Roadmap: shifts implementer principal.

## Micro-interazioni umane eliminate
Option 1: ~5/week (no manual prompt copy/paste). Option 2: ~10/week.

## Scelta richiesta
Scrivi: `D-EXAMPLE-CursorCLI = N`

## Cosa succede dopo la scelta
If 1 or 2: a separate DP for first headless task scope is required; this DP only opens the runtime capability. If 3: Cursor CLI stays blocked.

## Cosa NON verrà fatto senza ulteriore gate
No deploy, no tag, no rollback, no app source, no provider API, no API key, no billing. Each first headless task scope is a separate DP.
```

### 6.5 n8n workflow modification gate (example)

```markdown
### D-EXAMPLE-n8nMod — Add n8n workflow X

**Decision ID:** D-EXAMPLE-n8nMod
**Kind:** automation
**Data:** YYYY-MM-DD

## Contesto
n8n queue reader is active. Schedule polling validated. Adding a new workflow / enabling an existing one / adding a node is a runtime change per the readiness matrix.

## Perché serve decisione
Each n8n runtime modification introduces a new automation surface and a new potential failure mode. Must be explicit.

## Opzioni
1. **Add workflow X (narrow scope)** — exact node list, exact triggers, exact GitHub credentials reused (no new credentials).
2. **Add workflow X (broader scope)** — includes a new trigger or new credential.
3. **Defer** — no workflow change.

## Raccomandazione orchestratore
Option 1 — narrow scope.

## Rischio principale
Option 1: new workflow may collide with queue reader on concurrent runs; serialization must be verified.

## Impatto
Automation: new workflow. App Alina: no impact. Infra: n8n state change.

## Micro-interazioni umane eliminate
[count specific micro-interactions removed]

## Scelta richiesta
Scrivi: `D-EXAMPLE-n8nMod = N`

## Cosa succede dopo la scelta
If 1: implementer prompt for n8n manual configuration step-by-step (PRIORITÀ 0 n8n discipline applies). If 2: re-scope first. If 3: no change.

## Cosa NON verrà fatto senza ulteriore gate
No new credential without separate gate, no webhook without separate gate, no schedule change without separate gate, no deploy, no app source change.
```

### 6.6 App deploy / tag / rollback gate (example — always-manual gate)

```markdown
### D-EXAMPLE-AppDeploy — Apps Script deploy @N+1

**Decision ID:** D-EXAMPLE-AppDeploy
**Kind:** alina-feature
**Data:** YYYY-MM-DD

## Contesto
Current stable: V1.9.2 / @24. App is not in active work scope; the automation workstream does not touch app source. Deploy is an always-manual gate.

## Perché serve decisione
Apps Script deploy publishes a new @N+1; rollback requires either a previous stable tag or a new deploy. Always intentional.

## Opzioni
1. **Deploy now (V1.x.y → V1.x.(y+1))** — clasp push + new deployment + manual physical test on Alina's phone.
2. **Defer deploy** — keep @24.
3. **Roll back to a previous stable** — explicit rollback target tag.

## Raccomandazione orchestratore
Option 2 — defer (default while automation workstream is open).

## Rischio principale
Option 1: regression on physical device; option 3: data semantics drift.

## Impatto
App Alina: production change. Automation: no impact. Infra: no impact.

## Micro-interazioni umane eliminate
0 — deploy never eliminates micro-interactions; it is always a human-validated release event.

## Scelta richiesta
Scrivi: `D-EXAMPLE-AppDeploy = N`

## Cosa succede dopo la scelta
If 1: implementer prompt for `clasp push` step-by-step + manual test gate on Redmi 9C NFC. If 2: no change. If 3: separate rollback DP with explicit tag.

## Cosa NON verrà fatto senza ulteriore gate
No automated deploy (always manual), no tag creation as side effect (tag is a separate DP), no rollback as side effect, no commit to `gas-current/` as source (read-only snapshot).
```

### 6.7 Provider API / API key / billing gate (example — permanently forbidden by default)

```markdown
### D-EXAMPLE-ProviderAPI — Open provider API gate (one specific provider)

**Decision ID:** D-EXAMPLE-ProviderAPI
**Kind:** infra
**Data:** YYYY-MM-DD

## Contesto
Provider APIs (OpenAI API, Anthropic API, OpenRouter, hosted AI) are **permanently forbidden by default** per ORCHESTRATOR_RULES and readiness matrix Hard Constraint #1. ChatGPT = web/on-demand; Claude Code = supervised; Local AI = Ollama only.

## Perché serve decisione
Opening a provider API introduces: an API key, recurring cost, an external runtime dependency, and a data-exit point. All three (Hard Constraints #1, #2, #3) trigger simultaneously.

## Opzioni
1. **Open provider X for narrow case Y** — single endpoint, single use case, monthly budget cap stated, API key in n8n vault only.
2. **Defer** — stay zero-API.
3. **Forbid permanently** — close this gate request without opening.

## Raccomandazione orchestratore
Option 2 — defer. Project default is zero-API; Local AI (Ollama) is the planned alternative.

## Rischio principale
Option 1: recurring cost, API key footprint, data exit, vendor lock-in, prompt-injection / data-leak surface.

## Impatto
Infra: new external runtime. App Alina: no impact (unless explicitly scoped). Automation: new dependency. Roadmap: shifts default architecture.

## Micro-interazioni umane eliminate
[only quantify if the provider call replaces a manual step — otherwise state 0]

## Scelta richiesta
Scrivi: `D-EXAMPLE-ProviderAPI = N`

## Cosa succede dopo la scelta
If 1: separate DPs are required for (a) API key creation, (b) billing cap, (c) first call scope. This DP only opens the category gate. If 2: stay zero-API. If 3: close category permanently (Hard Constraint #1 reinforced).

## Cosa NON verrà fatto senza ulteriore gate
No automatic billing increase, no key rotation as side effect, no fallback to provider when Ollama fails (would re-open the gate silently), no deploy, no app source.
```

---

## 7. Anti-patterns (explicitly forbidden)

The following anti-patterns are **explicitly forbidden**. Implementer and orchestrator MUST reject any prompt or proposal that exhibits these patterns.

| # | Anti-pattern | Why forbidden |
|---|--------------|--------------|
| 1 | **Hiding runtime activation inside a docs-only task** | A docs-only task touches `docs/**`. Any runtime activation requires a separate gated task with explicit DP. Combining the two erases the gate boundary. |
| 2 | **Treating completed design as activation permission** | "Design done" ≠ "activation permitted". The readiness matrix (0144) is the source of truth for whether a design is gated. |
| 3 | **Saying "all green" when a gate is actually required** | INBOX is for real decisions, not "all green" status. A gated action with no DP is not green — it is blocked. |
| 4 | **Using Obsidian notes as official authorization** | Obsidian is an optional personal cockpit (see 0145, readiness matrix). It is **not** runtime, **not** automation, **not** source of truth. Decisions become official only when written to GitHub through INBOX. |
| 5 | **Letting Browser Bridge answer INBOX** | Hard Constraint #4. The bridge writes "aggio" only. It must never read INBOX, include `D-NNNN-X` identifiers in its output, or simulate a user response. INBOX is human-only. |
| 6 | **Using provider APIs or keys as a convenience fallback** | Hard Constraints #1/#2/#3. Provider APIs are forbidden by default. A "just this once" provider call is still a gated change requiring a DP. |
| 7 | **Auto-approving Gate 7** | Gate 7 (Ollama + Cursor CLI) is not yet opened. An implementer or agent may not assume Gate 7 is open just because Ollama feasibility is documented or because the user mentioned Ollama in passing. |
| 8 | **Combining multiple unrelated runtime gates in one vague decision** | One DP per gate. A DP like "open Telegram + Browser Bridge + Gate 7" is invalid — it bundles independent gates and prevents the user from approving narrowly. |

Implementer rule: when a prompt or proposal exhibits any anti-pattern above, **stop**, report the anti-pattern, and propose a corrected lifecycle.

---

## 8. Post-decision handling

After the user responds to a DP (step 6–7 in Section 3), the orchestrator must:

### 8.1 Record the user's chosen option

- Read response form: `D-NNNN-X = N`, `D-NNNN-X = defer`, `D-NNNN-X = skip`, or `D-NNNN-X = retry`.
- Update the DP block in `docs/INBOX.md`:
  - Set `response: N` (or `defer` / `skip` / `retry`).
  - Set `decided_at: YYYY-MM-DD`.
  - Set `inbox_status: decided` (or `deferred`, `superseded`, depending on response).
- Commit `docs/INBOX.md` selectively (`git add docs/INBOX.md`) with message: `docs: inbox D-NNNN-X = N`.

### 8.2 Move INBOX item from Pending to Decided

- Cut the block from `## Pending`.
- Paste into `## Decided` (or `## Deferred` / `## Superseded` per response).
- Preserve all 13 DP fields + INBOX header fields in canonical order.
- Do not reformat or summarize the block — it is the historical record.

### 8.3 Generate the next implementer prompt only after the decision is recorded

- The implementer prompt MUST reference the recorded decision: include `D-NNNN-X = N` in the prompt context.
- The prompt is generated only after `docs/INBOX.md` shows the block in `## Decided`.
- The prompt scope is the option the user chose, not a broader interpretation.
- If the user chose `defer`, no implementer prompt is generated; the gate remains closed.
- If the user chose `retry`, the orchestrator reformulates the DP with better options and accodes a new DP — the old block moves to `## Superseded` with `superseded_by` populated.

### 8.4 Keep app / deploy / tag / rollback as separate gates even if another gate was approved

A DP approval is **scoped to the DP**. Approving Gate 7 does not approve a deploy. Approving a Telegram gate does not approve an app source change. Each of the always-manual categories (app source, deploy, tag, rollback, GitHub Actions) requires its **own** DP, even when an earlier DP touches an adjacent area.

Example: if `D-EXAMPLE-Ollama = 2` opens Ollama install, this does **not** authorize:
- a model pull (separate DP),
- a Cursor CLI activation (separate DP within Gate 7),
- any deploy / tag / rollback (separate always-manual DPs),
- any app source change (separate always-manual DP),
- any provider API as fallback (Hard Constraint #1 — separate DP, blocked by default).

---

## 9. No-runtime confirmation

Task 0146 produces only documentation. It performs **no runtime action**.

| Action | Performed? |
|--------|-----------|
| Runtime activation | ❌ No |
| Browser automation | ❌ No |
| n8n runtime modification | ❌ No |
| Telegram configuration | ❌ No |
| Cursor headless execution | ❌ No |
| Ollama install or model pull | ❌ No |
| App source modification (`src/**`) | ❌ No |
| Apps Script deploy | ❌ No |
| Tag / rollback | ❌ No |
| API key created | ❌ No |
| Provider API used | ❌ No |
| Billing introduced | ❌ No |
| INBOX pending decision added | ❌ No (no real decision required by this task) |
| Gate 7 opened | ❌ No |

This playbook is a reference document. It will be consulted whenever a future gated action is proposed; it does not activate any component itself.

---

## References

| Document | Role |
|----------|------|
| `docs/automation/runtime-gate-checklist-readiness-matrix.md` | Task 0144 — determines whether a gate is required (input to this playbook) |
| `docs/automation/decision-packet-format.md` | Canonical Decision Packet Format (13 fields) |
| `docs/automation/human-decision-inbox-design.md` | INBOX design + INBOX header fields |
| `docs/INBOX.md` | Human Decision Inbox (MVP file) |
| `docs/ORCHESTRATOR_RULES.md` | Sensitive gates list (authoritative) |
| `docs/AI_RULES.md` | Implementer rules, no provider APIs by default |
| `docs/automation/local-browser-bridge-preflight-design.md` | Browser Bridge gate design |
| `docs/automation/telegram-browser-bridge-trigger-coordination-design.md` | Telegram + Bridge coordination |
| `docs/automation/ollama-classifier-planner-feasibility-post-wiki.md` | Gate 7 definition (Ollama side) |
| `docs/automation/local-cursor-dual-agent-loop-design.md` | Gate 7 definition (Cursor side) |

---

*This document is docs-only. It defines how to request future runtime gates; it does not open any gate. All runtime activations remain subject to the explicit manual gates defined in `docs/automation/runtime-gate-checklist-readiness-matrix.md` (task 0144).*
