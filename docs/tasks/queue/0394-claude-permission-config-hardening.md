# Task 0394 — Claude Code Permission Config Hardening

- Project: Alina Lavoro
- Type: docs
- Priority: high
- Deploy: no

## Objective

Harden the Claude Code permission configuration so that read-only and standard project operations are pre-authorized and do not trigger permission prompts during sessions.

## Work

Review and update `.claude/settings.json` (or equivalent Claude Code config) to:
- Pre-authorize read-only bash commands: `git status`, `git diff`, `git log`, `git branch`, `git remote`, `git rev-parse`, `git --no-pager log`, `grep`, `node --check`, `ls`, `cat` on project files
- Pre-authorize file reads on all project paths
- Pre-authorize `git add <specific files>` and `git commit` for docs and src changes
- Pre-authorize `git push origin main`
- Pre-authorize `npx clasp push` and `npx clasp deploy` (guarded by task-level authorization, not config-level block)
- Document which operations remain gated (reset, force push, delete, secrets)

If `.claude/settings.json` does not exist, create it with appropriate structure.

## Allowed paths

- `.claude/settings.json`
- `.claude/settings.local.json` (if needed)
- `docs/sessions/YYYY-MM-DD-*.md`

## Commit message

`docs: harden Claude Code permission config for project autonomy`
