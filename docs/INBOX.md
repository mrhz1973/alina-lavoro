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
