# Task 0395 — Authorized Commit and Push Autonomy

- Project: Alina Lavoro
- Type: docs
- Priority: high
- Deploy: no

## Objective

Document and enforce the rule that Claude Code must commit and push autonomously when a task authorizes it, without asking for confirmation at each git step.

## Rule to document

When a task prompt includes any of the following signals, Claude Code treats commit + push as authorized and executes them without confirmation:
- "commit selettivo e push"
- "chiudi secondo workflow"
- "commit ... push"
- "deploy autorizzato"
- "Commit message: ..."
- Task file has a `## Commit message` section

When none of these signals are present, Claude Code may still commit and push for docs-only tasks as a normal close step per `docs/WORKFLOW.md` — no confirmation needed unless a sensitive gate applies.

## Deliverable

- Add a "Commit and push autonomy" subsection to `docs/AI_RULES.md`
- Session note in `docs/sessions/`

## Allowed paths

- `docs/AI_RULES.md`
- `docs/sessions/YYYY-MM-DD-*.md`

## Commit message

`docs: document authorized commit and push autonomy for Claude Code`
