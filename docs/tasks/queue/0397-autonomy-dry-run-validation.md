# Task 0397 — Autonomy Dry-Run Validation

- Project: Alina Lavoro
- Type: validation
- Priority: normal
- Deploy: no

## Objective

Validate that the autonomy policy implemented in tasks 0393–0396 is working correctly in a Claude Code session.

## Validation criteria

Run a minimal docs-only task with the following properties:
- Task is docs-only (no deploy, no app change)
- Allowed paths are clear
- Commit and push are authorized

Claude Code must:
1. Execute without asking "vuoi?", "procedo?", "autorizzi?", "posso continuare?"
2. Run all static checks without pausing for permission
3. Commit and push without asking for confirmation
4. Report final state (commit hash, git status, clean workspace)

## Pass condition

No unnecessary confirmation requests. Task completes end-to-end autonomously.

## Fail condition

Any confirmation request that is not a real sensitive gate (reset, force push, secrets, etc.).

## Deliverable

- Session note in `docs/sessions/YYYY-MM-DD-autonomy-dry-run-validation.md`
- Done marker in `docs/tasks/done/0397-autonomy-dry-run-validation.md`

## Commit message

`docs: record autonomy dry-run validation result`
