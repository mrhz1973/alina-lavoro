# 0207 — Update project policy and state after template-first decision

- Project: Alina Lavoro
- Type: docs-only / state propagation
- Status: done
- Priority: normal
- Deploy: no
- Date: 2026-05-14

## Scope

Propagate the batch 0204–0208 outcomes into all canonical project state and policy documents.

## Files updated

- `docs/INBOX.md` — D-0202-A moved to Superseded with reason and forward pointer to D-0206-A; D-0206-A added as Pending; legacy `## Superseded` placeholder at bottom updated to point to the new entry.
- `docs/LLMS.md` — Last completed → 0207; Human Decision Inbox row updated (1 pending D-0206-A, 1 superseded D-0202-A); Telegram Idempotency Runtime UI Handoff row updated; two new Low-Touch Stack rows added (n8n Template-First Policy, Fully-Pinned n8n Harness Template).
- `docs/wiki/current-state.md` — Last updated → 2026-05-14 (batch 0204–0208); Telegram Mode A / INBOX State rows updated; INBOX pending/superseded counts updated; new rows for n8n template-first policy and fully-pinned template; Next step updated to D-0206-A.
- `docs/wiki/token-efficiency.md` — Pointer to fully-pinned template (`.md` + `.json`); new row "n8n template-first policy".
- `docs/ORCHESTRATOR_RULES.md` — New section **PRIORITÀ 0B — n8n template-first (priorità tempo e risultati)** with permitted/forbidden content rules and coexistence with PRIORITY 0 / 0A.
- `docs/AI_RULES.md` — New section **Implementer rule — n8n template-first (priority time and results)**.
- `docs/WORKFLOW.md` — New section **n8n template-first workflow (batch 0204–0208, 2026-05-14)** with 4-step gate lifecycle.
- `docs/automation/candidate-gate-backlog.md` — Status block updated to reflect template-first policy, D-0202-A superseded, D-0206-A pending.
- `docs/roadmap.md` — Telegram Mode A current-state paragraph rewritten to record priority shift, template-first policy, template artifact, D-0202-A supersession, D-0206-A pending, next step.
- `docs/automation/telegram-idempotency-runtime-ui-handoff.md` — Status line updated to reflect D-0202-A superseded by D-0206-A and pointer to template artifact.
- `docs/sessions/2026-05-14-n8n-template-first-policy-and-d0197a-not-successful.md` — Session note created.

## Required final state confirmed

- Last completed: **0207**.
- D-0197-A: decided/applied/executed, **not successful / inconclusive** due to partial pinning / dynamic reference leakage (recorded in prior batch 0199–0203 and reaffirmed here).
- D-0202-A: **superseded by D-0206-A** (template-first policy).
- D-0206-A: **pending** (import/inspection of fully-pinned n8n template, no Execute).
- New **n8n template-first policy** recorded across ORCHESTRATOR_RULES.md, AI_RULES.md, WORKFLOW.md, LLMS.md, wiki, roadmap, candidate-gate-backlog.
- Templates remain inactive by default; real secrets not committed or pasted.
- Telegram Mode A: manual-only / inactive.
- No Schedule Trigger active.
- No automatic notification active.
- No runtime Execute authorized.
- Duplicate-skip: not conclusively validated.
- Next valid step: D-0206-A import/inspection of fully-pinned TEST-only template, no Execute.

## Done status

- Completed by: Claude Code (implementer)
- Completion commit: this batch
- No runtime. No n8n UI. No Execute. No secrets committed.
