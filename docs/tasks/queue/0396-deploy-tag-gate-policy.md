# Task 0396 — Deploy and Tag Gate Policy

- Project: Alina Lavoro
- Type: docs
- Priority: high
- Deploy: no

## Objective

Document the exact gate conditions for deploy and tag operations so that Claude Code can proceed autonomously when a prompt explicitly authorizes them, and stop cleanly when it does not.

## Policy to document

### Deploy (clasp push + clasp deploy) is authorized when:
- The task file has `Deploy: yes` in metadata, OR
- The prompt contains an explicit deploy instruction with deployment ID or description, OR
- The orchestrator prompt includes "deploy autorizzato" or equivalent

### Tag creation is authorized when:
- The task file or prompt explicitly says "crea tag stabile `vX.Y.Z-stable`", OR
- The orchestrator prompt explicitly names the tag to create

### Deploy and tag are NOT authorized when:
- The prompt or task is docs-only (`Deploy: no`)
- No explicit mention of deploy or tag exists
- The prompt says "non creare tag stabile" or "tag pending test utente"

### Never autonomous (always require explicit gate):
- Cancelling or deleting existing Apps Script deployments
- `git push --force`
- Rollback to previous tag
- Creating a new deployment slot (vs updating existing)

## Deliverable

- Add "Deploy and tag gate policy" subsection to `docs/AI_RULES.md`
- Session note in `docs/sessions/`

## Allowed paths

- `docs/AI_RULES.md`
- `docs/sessions/YYYY-MM-DD-*.md`

## Commit message

`docs: document deploy and tag gate policy for Claude Code autonomy`
