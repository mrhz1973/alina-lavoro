# Session — Claude Code Confirmation Spam Fix

**Date:** 2026-05-16
**Task:** 0415b — Claude Code confirmation spam mitigation
**Model:** Claude Sonnet 4.6
**Implementer:** Claude Code

---

## Problem

Claude Code was generating repeated confirmation prompts even for commands already authorized by the orchestrator prompt. The repo aggressive autonomy policy (task 0405) was not being reflected at the local tool permission layer.

## Changes made

### `.claude/settings.local.json`
- Added `deny` array: `git reset --hard*`, `git reset --soft*`, `git clean*`, `git push --force*`, `git push -f *`
- Added PowerShell patterns: `PowerShell(git *)`, `PowerShell(npm *)`, `PowerShell(npm.cmd *)`, `PowerShell(node *)`, `PowerShell(ls*)`, `PowerShell(dir*)`, `PowerShell(Get-Content *)`, `PowerShell(Get-ChildItem *)`, `PowerShell(Write-Output *)`, `PowerShell(Test-Path *)`, `PowerShell(Select-String *)`, `PowerShell(cat *)`
- Preserved all existing allow rules

### `docs/COMMANDS.md`
- Added section "Claude Code confirmation spam — user guide" with:
  - "Yes, and don't ask again" guidance for prompt-authorized commands
  - When to stop (dangerous commands list)
  - `--dangerously-skip-permissions` fallback documented

### `docs/AI_RULES.md`
- Added compact note: Claude Code permission prompts are tool friction; allowlist must be maintained; skip-permissions fallback reference

### `docs/WORKFLOW.md`
- Added compact note: local allowlist is maintained; deny rules block reset/clean/force-push; skip-permissions fallback for this repo only

### `docs/ORCHESTRATOR_RULES.md`
- Added compact note in agent-facing summary: local permission prompts are tool friction; allowlist + deny rules; fallback reference

### `docs/LLMS.md` / `docs/wiki/current-state.md`
- Updated task state to reflect 0415b completion

## Task numbering note

The orchestrator assigned this as task "0415" in the prompt title, but `docs/tasks/done/0415-deploy-0407-0413-for-phone-test.md` already exists. This session uses the label "0415b" to avoid collision. The done marker is at `docs/tasks/done/0415-claude-code-confirmation-spam-fix.md`.

## Validation

- `.claude/settings.local.json` valid JSON: YES
- `git diff --check`: clean
- Forbidden paths not touched: YES (src/**, gas-current/**, secrets)
- Deploy not executed: YES
- Tag not created: YES
- Rollback not executed: YES
- App source not modified: YES
