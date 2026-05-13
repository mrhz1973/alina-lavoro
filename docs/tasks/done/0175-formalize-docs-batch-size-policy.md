# Task 0175 — Formalize Docs Batch Size Policy

- Project: Alina Lavoro
- Type: docs-only
- Priority: normal
- Deploy: no
- Status: done

## Objective

Record the user-approved batching policy in canonical rule documents so that all future orchestrator prompts and implementer runs follow consistent batch-size limits.

## Done status

**Completed by:** Claude Code (local), supervised
**Completion date:** 2026-05-13
**Completion commit:** see session `docs/sessions/2026-05-13-post-telegram-hardening-cleanup-batch.md`

**Evidence:**
- `docs/ORCHESTRATOR_RULES.md` — batch size policy section added in Agent-facing operational summary
- `docs/AI_RULES.md` — batch size rule added in Working mode section
- `docs/WORKFLOW.md` — batch size note added
- `docs/wiki/token-efficiency.md` — compact batch-size pointer added
- `docs/LLMS.md` — compact pointer added

**Policy recorded:**
- docs-only pure: up to 6 sub-tasks per batch
- docs + Decision Packet: up to 5 sub-tasks per batch
- docs + small technical design: up to 4 sub-tasks per batch
- runtime / n8n UI / credentials / Telegram / Schedule / app / deploy / tag / rollback: 1 step only

**Clarifications recorded:**
- Batch limits are maximums, not targets
- If a batch becomes ambiguous, split it
- Runtime portions must be single-step and separately gated
- Selective staging and path allowlists remain mandatory
- User decisions must not be invented to fill a batch
- Pending Decision Packets remain pending until explicit user response

**Scope confirmed:**
- docs-only ✅
- Batch-size policy formalized in rule documents ✅
- Runtime remains one step only ✅
- User decisions must not be invented ✅
- No runtime ✅
