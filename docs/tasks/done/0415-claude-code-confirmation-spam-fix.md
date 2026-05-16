# Task 0415b — Claude Code Confirmation Spam Fix

- Project: Alina Lavoro
- Type: config-docs
- Priority: high
- Deploy: no

## Objective

Reduce Claude Code confirmation prompts for this repository by hardening `.claude/settings.local.json` and documenting the exact local workflow and fallback procedure.

## Allowed paths

- `.claude/settings.local.json`
- `docs/COMMANDS.md`
- `docs/AI_RULES.md`
- `docs/WORKFLOW.md`
- `docs/ORCHESTRATOR_RULES.md`
- `docs/LLMS.md`
- `docs/wiki/current-state.md`
- `docs/sessions/2026-05-16-claude-code-confirmation-spam-fix.md`
- `docs/tasks/done/0415-claude-code-confirmation-spam-fix.md`

## Done status

- Completed by: Claude Code (claude-sonnet-4-6)
- Completion date: 2026-05-16
- Completion commit: see git log
- Session: `docs/sessions/2026-05-16-claude-code-confirmation-spam-fix.md`

### Evidence

1. `.claude/settings.local.json`: deny rules added for git reset/clean/push --force; PowerShell patterns added
2. `docs/COMMANDS.md`: "Claude Code confirmation spam" section added with user guide and skip-permissions fallback
3. `docs/AI_RULES.md`, `docs/WORKFLOW.md`, `docs/ORCHESTRATOR_RULES.md`: compact notes added
4. `docs/LLMS.md`, `docs/wiki/current-state.md`: task state updated

### Gates confirmed

- Deploy: NOT executed
- Tag: NOT created
- Rollback: NOT executed
- App source (`src/**`): NOT modified
- Forbidden paths: NOT touched
