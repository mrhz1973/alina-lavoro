# Docs-Only Task Template

**Status:** active template

## When to use

Use for tasks that touch only documentation, task markers, session notes, wiki docs, or design docs. No `src/` changes, no n8n UI, no runtime.

## Mandatory preflight

- Run `docs/wiki/task-id-preflight.md`.
- Confirm branch is `main`.
- Confirm working tree is clean or contains only allowed modifications.
- Read `docs/LLMS.md` → `docs/wiki/current-state.md` → `docs/wiki/token-efficiency.md`.
- Do not read `docs/PROJECT_STATE.md` or `docs/CHECKPOINT.md` by default.
- If creating a new guidance doc beyond done/session markers, apply the Measure-First Rule and Docs ROI Gate in `docs/wiki/token-efficiency.md`.

## Allowed paths

- `docs/**`
- `docs/tasks/done/` for done marker
- `docs/sessions/` for session note
- `docs/wiki/` for state/routing updates

## Forbidden actions

- No `src/**` changes.
- No `git add .`.
- No deploy, tag, rollback.
- No n8n runtime, n8n UI, workflow Execute.
- No Telegram send, Schedule activation.
- No provider API LLM.
- No new billing.
- No token, real chat_id, credential secret, OAuth material, or tokenized URL.
- No changes to `gas-current/`.

## Expected output

- Docs changes committed selectively.
- Done marker created when this is a tracked task: `docs/tasks/done/<task-id>-<slug>.md`.
- Session note created when this is a tracked task: `docs/sessions/YYYY-MM-DD-<slug>.md`.
- State docs updated if project state changed.
- **Both done marker and session note pushed to GitHub** so the orchestrator can read the result via `aggio` without user copy/paste.
- Final report per `docs/tasks/templates/final-report-contract.md`.
