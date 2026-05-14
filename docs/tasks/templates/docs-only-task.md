# Docs-Only Task Template

**Task:** 0234 (introduced)
**Status:** active template

## When to use

Use for tasks that touch only `docs/`, `docs/tasks/`, `docs/sessions/`, `docs/wiki/`, `docs/automation/` (design docs only), or `tools/` (read-only inspection). No `src/` changes, no n8n UI, no runtime of any kind.

## Mandatory preflight

- Run `docs/wiki/task-id-preflight.md`.
- Confirm branch is `main`.
- Confirm working tree is clean or contains only allowed modifications.
- Read `docs/LLMS.md` → `docs/wiki/current-state.md` → `docs/wiki/token-efficiency.md`.
- Do not read `docs/PROJECT_STATE.md` or `docs/CHECKPOINT.md` by default.

## Allowed paths

- `docs/**` (excluding `docs/PROJECT_STATE.md` and `docs/CHECKPOINT.md` as default reads)
- `docs/tasks/done/` (new done marker only)
- `docs/sessions/` (new session file only)
- `docs/wiki/` (state updates only)
- `tools/` (if task scope explicitly covers it)

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
- `docs/tasks/done/<task-id>-<slug>.md` created.
- `docs/sessions/YYYY-MM-DD-<slug>.md` created.
- State docs updated: `docs/LLMS.md` + `docs/wiki/current-state.md` (Last completed = this task ID).
- Final report per `docs/tasks/templates/final-report-contract.md`.
