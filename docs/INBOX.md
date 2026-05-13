# INBOX — Human Decision Inbox

**Design:** `docs/automation/human-decision-inbox-design.md` (task 0129)
**Format:** `docs/automation/decision-packet-format.md` (task 0127)
**Created:** 2026-05-13 (task 0141)

---

## Purpose

INBOX contains **only real human decisions** that require a response.

**INBOX is NOT:**
- a status log
- a task completion feed
- a session automation archive
- a "all green" notification board

**INBOX IS:**
- the single place to find all pending decisions
- compatible with Decision Packet Format (13 canonical fields)
- readable immediately by ChatGPT (LLMS-first) and future n8n
- the archive of decided/deferred/superseded decisions

**INBOX does not bypass gates.** Writing a response here does NOT authorize:
- deploy, tag, rollback
- runtime changes (VPS, n8n, Ollama)
- app source modifications (`src/**`)
- API key creation or provider billing
- GitHub Actions
- physical tests on Alina's phone

Sensitive gates remain manual and require explicit separate authorization.

---

## Response Convention

Reply in chat or commit message using the short form:

| Form | Meaning |
|------|---------|
| `D-NNNN-X = 1` | Choose option 1 |
| `D-NNNN-X = 2` | Choose option 2 |
| `D-NNNN-X = defer` | Explicitly defer (move to Deferred) |
| `D-NNNN-X = skip` | No response (rare; signals disinterest) |
| `D-NNNN-X = retry` | Reformulate — options are insufficient |

ChatGPT records the response by moving the block from Pending to Decided and updating `response` and `decided_at`.

---

## Pending

No pending decisions.

---

## Decided

### D-0151-A — Open Browser Bridge sandbox gate

**inbox_status:** decided
**created_at:** 2026-05-13
**source_task:** 0151-browser-bridge-sandbox-gate-decision-packet
**source_document:** docs/automation/candidate-gate-backlog.md
**response:** 1
**decided_at:** 2026-05-13
**superseded_by:**
**archive_policy:** keep

---

**Decision ID:** D-0151-A
**Kind:** automation
**Data:** 2026-05-13

## Contesto

Task 0150 completed the Browser Bridge dry-run implementation.
The dry-run is local-file-only: it writes `aggio` to `.local/browser-bridge-dry-run/dry-run-output.jsonl`, rejects DP-like messages, uses idempotency and rate-limit controls, and does not use browser, network, ChatGPT / Claude.ai, or INBOX.
The next candidate in the phased Browser Bridge path is the **sandbox** phase: testing browser automation only against a throwaway/sandbox browser context, not the real project chat.

## Perché serve decisione

Sandbox introduces actual browser automation.
Even if it targets only a throwaway/sandbox browser context, it is a higher-risk runtime step than dry-run because it may open or control a browser.
Project rules require an explicit human gate before any browser automation or sandbox execution.

Without this decision, no Browser Bridge sandbox implementation prompt may be generated.

## Opzioni

1. **Open Browser Bridge sandbox gate only** — authorize a future implementation task for a sandbox-only browser automation test. The future task may target only a throwaway/sandbox browser context and may attempt to send only `aggio` there. It does not authorize the real project chat, INBOX reading, INBOX answering, n8n runtime changes, Telegram, Ollama, Cursor CLI, API keys, billing, app source, deploy, tag, or rollback.
2. **Defer Browser Bridge sandbox** — keep Browser Bridge at dry-run-only state; continue with docs-only planning, hardening, or another candidate gate later.
3. **Reject browser automation path for now** — keep dry-run as the terminal Browser Bridge implementation for now; sandbox and project-chat remain blocked until future explicit reconsideration.

## Raccomandazione orchestratore

Option 1, but only with narrow scope.
The dry-run has already validated message allowlist, idempotency, duplicate skip, invalid-message rejection, and local output evidence. Sandbox is the next logical validation step, but it must remain isolated from the real orchestration chat.
The future implementation prompt must require a throwaway/sandbox browser context, must forbid project-chat access, and must preserve the rule that Browser Bridge may only write `aggio` and must never read or answer INBOX.

## Rischio principale

The main risk is scope creep from sandbox browser automation toward real project-chat automation.
A sandbox test could be accidentally expanded to the actual ChatGPT / Claude.ai project chat if boundaries are not enforced.
The future implementation prompt must therefore explicitly separate sandbox from project-chat and must fail closed if no sandbox/throwaway context is available.

## Impatto

- App Alina: no impact.
- GitHub docs: only the INBOX decision is added now.
- Runtime: no runtime in this task; possible browser sandbox runtime only if Option 1 is later recorded as decided and a separate implementation task is generated.
- Browser Bridge: dry-run remains implemented; sandbox remains unimplemented until a future task.
- n8n: no impact.
- Telegram: no impact.
- Ollama / Gate 7: no impact.
- Cursor CLI / Gate 7: no impact.

## Micro-interazioni umane eliminate

0 immediately.
If later implemented and validated, sandbox is a prerequisite toward a future project-chat bridge that may reduce the need for the user to manually type `aggio` after task completion. This decision alone does not eliminate micro-interactions.

## Scelta richiesta

Scrivi: `D-0151-A = 1` per aprire solo il gate Browser Bridge sandbox.
Scrivi: `D-0151-A = 2` per rimandare.
Scrivi: `D-0151-A = 3` per respingere per ora il percorso browser automation.
In alternativa: `D-0151-A = defer`, `D-0151-A = skip`, oppure `D-0151-A = retry`.

## Cosa succede dopo la scelta

If `D-0151-A = 1` is recorded in `docs/INBOX.md`, the orchestrator may generate a future implementer prompt for a narrow sandbox implementation task. That future task must be sandbox-only, must not touch the real project chat, and must not read or answer INBOX.
If `D-0151-A = 2` or `defer`, Browser Bridge remains dry-run-only and no sandbox runtime prompt is generated.
If `D-0151-A = 3` or `skip`, the browser automation path remains blocked until explicitly reconsidered.
If `D-0151-A = retry`, the orchestrator reformulates the Decision Packet.

## Cosa NON verrà fatto senza ulteriore gate

This decision does not authorize:
- project-chat Browser Bridge phase;
- writing to the real ChatGPT / Claude.ai project chat;
- answering INBOX;
- reading INBOX from the bridge;
- writing any `D-NNNN-X = N` response;
- Telegram configuration;
- n8n runtime modification;
- Ollama install or model pull;
- Cursor CLI/headless execution;
- Gate 7;
- provider API;
- API key creation;
- billing;
- app source modification;
- Apps Script deploy;
- tag;
- rollback.

Even if Option 1 is approved, the project-chat Browser Bridge phase remains a separate future gate.

## Decision outcome

Recorded by task 0152 on 2026-05-13: user response `D-0151-A = 1`.
This opens the Browser Bridge **sandbox gate only**, authorizing a future narrow sandbox implementation task.
The future task must target only a throwaway/sandbox browser context, may attempt to send only `aggio`, and must fail closed if no sandbox context is available.
No sandbox has been implemented. No browser automation has been executed. No runtime has been activated.
This decision does not authorize:
- project-chat Browser Bridge phase or writing to the real ChatGPT / Claude.ai project chat;
- INBOX read or answer from the bridge;
- n8n runtime modification; Telegram; Ollama; Cursor CLI; Gate 7; provider API; API key; billing;
- app source modification; Apps Script deploy; tag; rollback.
A separate future task/prompt is required to implement the sandbox.
Project-chat phase remains a separate future gate.

---

### D-0148-A — Open Browser Bridge dry-run gate

**inbox_status:** decided
**created_at:** 2026-05-13
**source_task:** 0148-browser-bridge-dry-run-gate-decision-packet
**source_document:** docs/automation/candidate-gate-backlog.md
**response:** 1
**decided_at:** 2026-05-13
**superseded_by:**
**archive_policy:** keep

---

**Decision ID:** D-0148-A
**Kind:** automation
**Data:** 2026-05-13

## Contesto

Task 0147 created the Candidate Gate Backlog and ranked **Browser Bridge dry-run** as the recommended next gate candidate.
The Browser Bridge design defines a phased path: dry-run → sandbox → project chat.
This decision concerns only the **dry-run** phase: a local test that writes to a local test file, with no browser and no ChatGPT / Claude.ai write.

## Perché serve decisione

Even though dry-run is the safest first phase, it is still a runtime step because it would create and execute local automation logic later.
The project rules require an explicit human gate before any runtime activation.
Without this decision, no Browser Bridge dry-run implementation prompt may be generated.

## Opzioni

1. **Open Browser Bridge dry-run gate only** — authorize a future implementation task that creates a local dry-run script writing only to a local test file. No browser, no ChatGPT / Claude.ai write, no INBOX read, no INBOX response, no n8n runtime change.
2. **Defer Browser Bridge dry-run** — keep Browser Bridge fully design-only; continue with docs-only planning or another candidate gate later.
3. **Reject Browser Bridge path for now** — keep all Browser Bridge phases blocked until a future explicit reconsideration.

## Raccomandazione orchestratore

Option 1.
It is the narrowest and most reversible runtime-adjacent step: local file output only, no browser, no API key, no billing, no provider API, no app impact, and no n8n modification.
It validates the future Auto-Aggio trigger path without touching the actual ChatGPT / Claude.ai project chat.

## Rischio principale

Even a dry-run introduces a local automation surface. The risk is small but real: a future script could be expanded incorrectly if scope controls are not enforced.
The implementation prompt must therefore keep the output to a local test file only and must explicitly forbid browser automation, INBOX decisions, API keys, billing, app changes, deploy, tag, rollback, and n8n runtime changes.

## Impatto

- App Alina: no impact.
- GitHub docs: only the INBOX decision is added now.
- Runtime: no runtime in this task; possible runtime only if Option 1 is later recorded as decided.
- n8n: no impact.
- Telegram: no impact.
- Ollama / Gate 7: no impact.
- Cursor CLI / Gate 7: no impact.

## Micro-interazioni umane eliminate

0 immediately.
If later implemented and then advanced through sandbox/project-chat gates, the Browser Bridge path may reduce the need for the user to manually type `aggio` after future task completions. This decision alone does not eliminate micro-interactions.

## Scelta richiesta

Scrivi: `D-0148-A = 1` per aprire solo il gate Browser Bridge dry-run.
Scrivi: `D-0148-A = 2` per rimandare.
Scrivi: `D-0148-A = 3` per respingere il percorso Browser Bridge per ora.
In alternativa: `D-0148-A = defer`, `D-0148-A = skip`, oppure `D-0148-A = retry`.

## Cosa succede dopo la scelta

If `D-0148-A = 1` is recorded in `docs/INBOX.md`, the orchestrator may generate a future implementer prompt for a narrow dry-run implementation task. That future task may create a local script that writes only to a local test file and includes idempotency/rate-limit/logging checks.
If `D-0148-A = 2` or `defer`, Browser Bridge remains design-only and no runtime prompt is generated.
If `D-0148-A = 3` or `skip`, the Browser Bridge path remains blocked until explicitly reconsidered.
If `D-0148-A = retry`, the orchestrator reformulates the Decision Packet.

## Cosa NON verrà fatto senza ulteriore gate

This decision does not authorize:
- browser automation;
- writing to ChatGPT / Claude.ai;
- answering INBOX;
- reading INBOX from the bridge;
- Telegram configuration;
- n8n runtime modification;
- Ollama install or model pull;
- Cursor CLI/headless execution;
- Gate 7;
- provider API;
- API key creation;
- billing;
- app source modification;
- Apps Script deploy;
- tag;
- rollback.

Even if Option 1 is approved, sandbox and project-chat Browser Bridge phases remain separate future gates.

## Decision outcome

Recorded by task 0149 on 2026-05-13: user response `D-0148-A = 1`.
This response opens the Browser Bridge **dry-run gate only**, authorizing a future narrow implementation task with the strict scope described above.
A separate future task/prompt is required to implement the dry-run. No runtime has been executed by this decision: it is a recorded authorization, not an activation.
Sandbox and project-chat Browser Bridge phases remain separate future gates. Browser Bridge still cannot answer INBOX (Hard Constraint #4 preserved). Gate 7 remains closed.

---

## Deferred

_No deferred decisions._

---

## Superseded

_No superseded decisions._

---

## Template — Future Decision Packet

Use this block when adding a new decision. Preserve field order.

```markdown
### D-NNNN-X — [short title]

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
**Kind:** alina-feature | automation | infra | meta
**Data:** YYYY-MM-DD

## Contesto

[2–4 lines minimum context]

## Perché serve decisione

[what changed / why a choice is needed now]

## Opzioni

1. **[option 1]** — [brief description]
2. **[option 2]** — [brief description]
3. **[option 3]** — [brief description]

## Raccomandazione orchestratore

[recommended option with brief reason]

## Rischio principale

[key risk of the recommended option]

## Impatto

[who/what is impacted]

## Micro-interazioni umane eliminate

[how many micro-interactions does this option eliminate?]

## Scelta richiesta

Scrivi: `D-NNNN-X = N` (option number) or `D-NNNN-X = defer` / `D-NNNN-X = skip`

## Cosa succede dopo la scelta

[next step after user responds]

## Cosa NON verrà fatto senza ulteriore gate

[explicit permanent gates — no deploy, no runtime, no API key, etc.]
```

---

## Archive Policy

| Status | Default policy | Notes |
|--------|---------------|-------|
| `pending` | N/A — never archive | Stays until responded |
| `decided` | `keep` | Perpetual audit of resolved decisions |
| `deferred` | `manual` | Review periodically; rotate if obsolete |
| `superseded` | `keep` | Traceable history with `superseded_by` |

If `## Pending` exceeds 5 items, signal as congestion (Auto-Aggio rule).
If file grows excessively, propose rotation to `docs/INBOX-ARCHIVE.md` via dedicated Decision Packet.

---

## Anti-Noise Rules

1. Only real Decision Packets or genuine human decisions.
2. No generic logs (sessions, commits, automation events).
3. No status updates ("task completed", "all green").
4. No standard completed tasks — Auto-Aggio handles those silently.
5. No automation session files (those live in `docs/sessions/automation-*`).
6. No duplicate entries — each DP enters once; updates = state transitions.
7. If no real decision is needed, do not enqueue.
8. Never include tokens, credentials, OAuth material, sensitive personal data.
