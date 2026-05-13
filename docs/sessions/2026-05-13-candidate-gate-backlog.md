# Session — Task 0147 Candidate Gate Backlog / Gate Queue Map

**Date:** 2026-05-13
**Task ID:** 0147
**Type:** low-touch-loop-docs-only
**Implementer:** Claude Code (supervised, local)
**Branch:** main
**Status:** completed

---

## Objective

Create a docs-only backlog/map of future candidate runtime gates, ordered by readiness and usefulness, without opening any gate and without adding any pending INBOX decision. The backlog provides the orchestrator with a navigation aid to choose the next gate intentionally, rather than reactively.

---

## Why a candidate backlog is needed now

Tasks 0144 and 0146 closed two of the three questions an orchestrator faces when handling a runtime proposal:

1. **0144 — readiness matrix** — answers *"is this action gated?"* (status of each component).
2. **0146 — playbook** — answers *"how do I request a gate?"* (DP format and lifecycle).

A third question remained open: *"of all the gates that could be opened, which one should we consider next?"* Without an answer, the orchestrator either picks reactively (last topic raised in chat wins) or asks the user to choose with no preranking.

Task 0147 closes that gap with a **planning document**. It ranks visible candidates by safety, reversibility, blast radius, and value to the low-touch loop, and explicitly designates a "recommended next" candidate — Browser Bridge dry-run — while preserving every existing constraint:

- The recommendation is not authorization.
- The backlog does not open any gate.
- No INBOX pending decision is added.
- No Decision Packet is created.

---

## What the document defines

The backlog (`docs/automation/candidate-gate-backlog.md`) establishes:

| Section | Content |
|---------|---------|
| 1. Purpose | Planning/navigation only; no gate opened, no DP created, no INBOX entry. |
| 2. Relationship to 0144 and 0146 | Matrix = whether; playbook = how; backlog = which next. Order of consultation. |
| 3. Gate candidate states | 6 states: candidate, recommended next, deferred, blocked, not recommended, superseded. |
| 4. Prioritization criteria | 11 criteria (safety/reversibility, no billing, no provider API, no new API key, value to loop, micro-interactions, complexity, blast radius, observability, Cursor compatibility, no app/deploy/tag/rollback). |
| 5. Candidate backlog table | 14 candidates A–N covering Browser Bridge phases, Telegram, n8n-bridge trigger, Ollama install/pull, Cursor CLI / dual-agent, n8n DP generator, n8n workflow mod, provider API, app source, deploy/tag/rollback. |
| 6. Recommended next candidate | Browser Bridge dry-run, with rationale, plus an explicit reminder that recommendation ≠ authorization. |
| 7. Explicit non-decisions | Comprehensive list of what this document does NOT decide. |
| 8. Anti-creep rules | 8 explicit rules preventing the backlog from being misused as authorization. |
| 9. Update protocol | Triggers (gate opened/rejected, pilot succeeds/fails, Cursor available, new candidate designed, candidate obsolete) and discipline (no silent state changes, no side-effect updates). |

---

## Why "recommended next" is Browser Bridge dry-run

Three filters drove the selection:

1. **Required criteria (must pass):** no provider API, no new billing, no impact on app/deploy/tag/rollback, compatible with the Cursor limitation window. Browser Bridge dry-run passes all four trivially — it writes to a local file, with no browser, no remote dependency, no app touchpoint, no Cursor dependency.
2. **High-weight criteria (preferred):** narrow blast radius (local script, deletable), high observability (single local log file), reversible (no persistent runtime state), value to the low-touch loop (first concrete step in the Auto-Aggio activation chain).
3. **No new API key:** Telegram Mode A introduces a bot token. Bridge dry-run introduces nothing of the sort. This is the decisive differentiator that places Telegram as `candidate` rather than `recommended next`.

Gate 7 components (Ollama install, Cursor CLI) are deferred until the orchestrator/user is ready to open Gate 7 as a coherent block. They were not selected because the Cursor limitation window is still open and because Gate 7 is structurally larger than a Browser Bridge dry-run.

---

## Why no INBOX pending decision was added

Task 0147 is a planning task that ranks candidates. It does not itself request any runtime activation. No real decision is required from the user as part of this task.

INBOX rules (from `docs/INBOX.md` Anti-Noise Rules):
- "If no real decision is needed, do not enqueue."
- "Only real Decision Packets or genuine human decisions."

Adding a DP just to demonstrate "let's open Browser Bridge dry-run" would violate these rules **and** anti-pattern #3 from the 0146 playbook ("Saying 'all green' when a gate is actually required" — and its symmetric form, raising an INBOX request without a decision being needed yet). The backlog itself signals readiness; the user decides when to convert a candidate into a real DP.

`docs/INBOX.md` was therefore read but not modified.

---

## Why the backlog uses non-`D-EXAMPLE-*` references

The playbook (0146) Section 6 example DPs use `D-EXAMPLE-Telegram`, `D-EXAMPLE-Bridge-DryRun`, etc., as reserved IDs to mark them as documentation. The backlog references the **candidates** by letter (A–N), not by `D-EXAMPLE-*` ID, to avoid the impression that those reserved IDs are being promoted to anything more than playbook examples.

When a real DP is eventually drafted for, say, candidate A, its ID will use the source task slug of the new task (e.g. `D-NNNN-X` where `NNNN` is the future task number), as specified by the playbook. The reserved `D-EXAMPLE-*` IDs remain documentation-only.

---

## Files read

- `docs/LLMS.md` (via CLAUDE.md context)
- `docs/wiki/current-state.md` (via CLAUDE.md context)
- `docs/wiki/token-efficiency.md` (via CLAUDE.md context + targeted re-read for navigation map update)
- `docs/INBOX.md`
- `docs/automation/runtime-gate-checklist-readiness-matrix.md`
- `docs/automation/runtime-gate-decision-packet-playbook.md`
- `docs/automation/local-browser-bridge-preflight-design.md` (header only — sufficient for candidate context)
- `docs/ORCHESTRATOR_RULES.md` (via CLAUDE.md context)
- `docs/AI_RULES.md` (via CLAUDE.md context)
- `docs/WORKFLOW.md` (via CLAUDE.md context)
- `docs/tasks/README.md` (via CLAUDE.md context)
- `docs/automation/n8n-workflows/lifecycle-ownership.md` (via CLAUDE.md context)
- `docs/automation/n8n-workflows/queue-reader.md` (via CLAUDE.md context)
- `docs/automation/n8n-workflows/done-failed-design.md` (via CLAUDE.md context)
- `docs/tasks/done/0146-runtime-gate-decision-packet-playbook.md` (for done-marker format reference)
- `docs/sessions/2026-05-13-runtime-gate-decision-packet-playbook.md` (for session format reference)
- `docs/roadmap.md` (header only — for cross-reference to recent automation history)

`docs/automation/telegram-browser-bridge-trigger-coordination-design.md`, `docs/automation/ollama-classifier-planner-feasibility-post-wiki.md`, `docs/automation/local-cursor-dual-agent-loop-design.md`, and `docs/automation/n8n-decision-packet-generator-design.md` were referenced via the readiness matrix (0144) and playbook (0146) summaries; their full content was not reopened because the matrix and playbook already provide the canonical gate-relevant facts. This is consistent with the LLMS-first / token-efficiency routing rules.

`docs/COMMANDS.md` was not read: the task is docs-only and does not touch `src/frontend/Index.html`, so the standard frontend checks listed in COMMANDS.md are not applicable.

`docs/PROJECT_STATE.md` and `docs/CHECKPOINT.md` were not read (LLMS-first routing — LLMS.md + wiki provided sufficient context; no justification to open them).

---

## Files created

| File | Role |
|------|------|
| `docs/automation/candidate-gate-backlog.md` | Main reference document — candidate gate backlog and gate queue map |
| `docs/tasks/done/0147-candidate-gate-backlog.md` | Done marker |
| `docs/sessions/2026-05-13-candidate-gate-backlog.md` | This session report |

## Files updated

| File | Change |
|------|--------|
| `docs/LLMS.md` | Last completed updated to 0147; Low-Touch Stack updated with candidate backlog entry |
| `docs/wiki/current-state.md` | Last completed updated to 0147 |
| `docs/wiki/token-efficiency.md` | Navigation pointer added: "Candidate gate backlog / which gate might be next?" |

`docs/roadmap.md` was not updated. The current top-of-roadmap paragraph already summarizes the full automation arc up to 0143; 0144, 0145, 0146 were not added as separate paragraphs either, so adding 0147 alone would be inconsistent. A future consolidated roadmap update can capture 0144 → 0147 together.

---

## Checks executed

- `git branch --show-current` → `main`
- `git status --short` (initial) → workspace clean (only untracked `.claude/`, unrelated)
- `git stash list` → empty
- `git diff --check` (final) → no whitespace errors
- `git status --short` (final) → expected docs files only
- Diff reviewed: no forbidden paths (`src/`, `gas-current/`, `.gas/`, `appsscript.json`, `package.json`, `.github/workflows/`) touched
- Verified the backlog references both 0144 readiness matrix and 0146 playbook in Section 2 and the References table
- Verified Browser Bridge cannot answer INBOX (Section 5 candidate C row; preserved Hard Constraint #4)
- Verified Gate 7 remains closed (Section 5 candidates F/G/H/I marked `candidate (Gate 7 sub-gate)` or `deferred`; Section 7)
- Verified provider API remains not recommended / blocked by default (Section 5 candidate L marked `not recommended`; Section 7)
- Verified `recommended next` is not treated as authorization (Section 6 explicit statement; Section 8 anti-creep rules #1, #2, #3)
- Verified no INBOX pending decision was added (`docs/INBOX.md` unchanged)

---

## What remains future / runtime-gated

All gated components in the readiness matrix remain gated. The backlog re-states their status but does not change it:

- Telegram notification — gate not yet requested (backlog state: `candidate`)
- Local Browser Bridge dry-run — gate not yet requested (backlog state: `recommended next`, **not authorization**)
- Local Browser Bridge sandbox — `deferred` until dry-run succeeds
- Local Browser Bridge project chat — `deferred` until sandbox succeeds
- n8n-to-local-bridge trigger — `deferred` until Bridge dry-run/sandbox exists
- Ollama runtime — Gate 7 not yet opened (backlog states `candidate` Gate 7 sub-gate)
- Cursor CLI headless — Gate 7 not yet opened, `deferred` until Cursor reset window closes
- Cursor dual-agent loop — `deferred` until Cursor CLI pilot succeeds
- n8n DP Generator runtime — `candidate` after playbook stable
- n8n workflow modification — `candidate` only when exact node list and trigger are known
- Provider API / API key / billing — `not recommended` (permanently forbidden by default)
- App source / deploy / tag / rollback — `deferred` (out of current workstream / always manual)

---

## Confirmations

- No runtime executed
- No browser automation executed
- No n8n executed
- No Telegram configured
- No Cursor executed (headless or otherwise)
- No Ollama installed or pulled
- No app source modified
- No deploy / tag / rollback
- No API key created or stored
- No provider API used
- No billing introduced
- No merge performed
- No INBOX pending decision added (no real decision required by this task)
- No gate opened
- Gate 7 remains closed
- Browser Bridge remains unable to answer INBOX

**Commit hash:** (see git log after push)
