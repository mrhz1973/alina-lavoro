# Docs-Only Task Template

**Status:** active template

## When to use

Use for tasks that touch only documentation, task markers, session notes, wiki docs, or design docs. No `src/` changes, no n8n UI, no runtime.

## Base rules

Shared preflight, prohibitions, git rules, and final-report persistence come from `docs/tasks/templates/implementer-standard.md`. This overlay only adds docs-only specifics.

## Docs-only additions to preflight

- If creating a new guidance doc beyond done/session markers, apply the New-doc / Docs ROI Gate in `docs/wiki/token-efficiency.md`.

## Allowed paths

- `docs/**`
- `docs/tasks/done/` for done marker
- `docs/sessions/` for session note
- `docs/wiki/` for state/routing updates

## Docs-only specific forbidden

- No `src/**` changes.
- No `gas-current/` changes.
- No n8n UI, workflow Execute, Telegram send, or Schedule activation.

(Other prohibitions — `git add .`, deploy/tag/rollback, provider API, billing, tokens/chat_id/credentials/OAuth/tokenized URLs — are in `implementer-standard.md`.)

## Expected output

- Docs changes committed selectively.
- Done marker created when this is a tracked task: `docs/tasks/done/<task-id>-<slug>.md`.
- Session note created when this is a tracked task: `docs/sessions/YYYY-MM-DD-<slug>.md`.
- State docs updated if project state changed.
- Done marker and session note pushed to GitHub so the orchestrator can read via `aggio`.
- Final report per `docs/tasks/templates/final-report-contract.md`.
