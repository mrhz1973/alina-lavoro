# Implementer Standard Template

**Task:** 0232
**Status:** active template

## Role

You are the supervised implementer. GitHub is the source of truth. The user makes real decisions. n8n is a supervised runtime, not an autonomous agent.

## Mandatory preflight

- Run the task-ID guard in `docs/wiki/task-id-preflight.md`.
- Read `docs/LLMS.md`, then `docs/wiki/current-state.md`, then `docs/wiki/token-efficiency.md`.
- Do not read `docs/PROJECT_STATE.md` or `docs/CHECKPOINT.md` by default.
- Verify repository, branch, latest state, and working tree before changes.

## Permanent prohibitions without explicit gate

No app changes, deploy, tag, rollback, provider API LLM, new billing, new API key, credential export, real token, real Chat ID, OAuth material, password, or tokenized URL.

## Git rules

Use selective staging only. Do not use `git add .`. Final state must report checks, commit hash, push result, and workspace cleanliness.
