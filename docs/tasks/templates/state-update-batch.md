# State Update Batch Template

**Task:** 0234 (introduced)
**Status:** active template

## When to use

Use when a task's primary goal is updating state documentation to reflect completed work: LLMS.md, wiki/current-state.md, token-efficiency.md, roadmap.md, operational docs, done marker, and session note. Typically triggered after a batch of runtime or docs tasks that were completed but whose state docs were not yet updated.

## Mandatory preflight

- Run `docs/wiki/task-id-preflight.md`.
- Confirm branch is `main` and tree is clean.
- Read `docs/LLMS.md` → `docs/wiki/current-state.md` to identify what is stale.
- Do not read `docs/PROJECT_STATE.md` or `docs/CHECKPOINT.md` by default.

## Standard update targets

| File | What to update |
|------|---------------|
| `docs/LLMS.md` | `Last completed` row in Task State table; Low-Touch Stack if new component; INBOX counts if changed |
| `docs/wiki/current-state.md` | Header `last updated`, `Last completed` row, Telegram/INBOX state rows if changed |
| `docs/wiki/token-efficiency.md` | Navigation map — add entries for new docs/files introduced (targeted inserts only) |
| `docs/roadmap.md` | Compact note in Automation section for completed batch |
| Operational docs | ORCHESTRATOR_RULES.md / AI_RULES.md / WORKFLOW.md — compact bullet only if a new permanent rule was introduced |
| `docs/tasks/done/<id>-<slug>.md` | Done marker for this task |
| `docs/sessions/YYYY-MM-DD-<slug>.md` | Session note |

## Docs ROI Gate

If this state-update batch creates a new document (beyond the standard done marker and session note), confirm at least one ROI criterion applies before proceeding — see `docs/wiki/v31-enforcement-checklist.md` § F. Standard state updates (LLMS.md, current-state.md, roadmap.md, token-efficiency.md, done marker, session note) are always in scope and do not need ROI justification.

## Compact update rule

Do not rewrite docs wholesale. Apply targeted inserts or single-line updates.

- `Last completed` row: replace old ID with new; prepend `**Previous XXXX —` if the old content is long and must be preserved inline.
- Navigation map: add rows only; do not remove existing rows.
- Roadmap automation section: append a compact paragraph; do not restructure existing paragraphs.
- Operational docs: add a single bullet or line; do not rewrite sections.

## Forbidden

- No `src/**` changes.
- No `git add .`.
- No deploy, tag, rollback.
- No n8n runtime, Execute, Telegram send, Schedule change.
- No provider API LLM, no new billing.
- No token, real chat_id, credential secret, OAuth material.
- Do not read `docs/PROJECT_STATE.md` or `docs/CHECKPOINT.md` unless absolutely necessary (justify if opened).

## Expected output

- All stale state docs updated to reflect Last completed = this task ID.
- Done marker and session note created.
- Final report per `docs/tasks/templates/final-report-contract.md`.
