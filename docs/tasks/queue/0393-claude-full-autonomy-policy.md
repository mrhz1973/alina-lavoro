# Task 0393 — Claude Code Full Autonomy Policy

- Project: Alina Lavoro
- Type: docs
- Priority: high
- Deploy: no

## Objective

Define and document the permanent autonomy policy for Claude Code in this project. The policy must be written into canonical docs (AI_RULES.md and/or CLAUDE.md) so that every future Claude Code session inherits it without needing to repeat instructions in each prompt.

## Policy to implement

### Proceed without confirmation for:
- All read-only / check commands: `git status`, `git diff`, `git log`, `git branch`, `git remote`, `git rev-parse`, `grep`, `node --check`, file reads, static validation
- File modifications within authorized paths: `src/frontend/Index.html`, `src/backend/Code.gs`, `docs/**`, `package.json`
- Commit and push when the task or prompt explicitly authorizes them
- Deploy (clasp push / clasp deploy) when the task or prompt explicitly authorizes it
- Tag creation when the task or prompt explicitly authorizes it

### Stop and require explicit user confirmation only for:
- `git reset --hard`, `git clean`, `git stash drop`, `git checkout -- .`
- `git push --force` or force push to any branch
- Deleting files outside the task scope
- Rollback of any kind
- Secrets, credentials, OAuth material, API keys
- Billing, provider API, cloud cost changes
- Cancelling or deleting existing Apps Script deployments
- Actions outside the authorized paths listed in the task

## Deliverable

- Update `docs/AI_RULES.md` with a permanent "Claude Code autonomy" section
- Optionally update `CLAUDE.md` with a compact reference
- Session note in `docs/sessions/`

## Allowed paths

- `docs/AI_RULES.md`
- `CLAUDE.md`
- `docs/sessions/YYYY-MM-DD-*.md`

## Commit message

`docs: add Claude Code full autonomy policy`
