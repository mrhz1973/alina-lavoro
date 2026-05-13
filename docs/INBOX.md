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

### D-0148-A — Open Browser Bridge dry-run gate

**inbox_status:** pending
**created_at:** 2026-05-13
**source_task:** 0148-browser-bridge-dry-run-gate-decision-packet
**source_document:** docs/automation/candidate-gate-backlog.md
**response:**
**decided_at:**
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

---

## Decided

_No decided decisions yet._

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
