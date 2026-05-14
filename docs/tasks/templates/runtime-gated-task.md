# Runtime-Gated Task Template

**Task:** 0234 (introduced)
**Status:** active template

## When to use

Use when a task involves any runtime action that requires explicit user authorization: n8n UI, n8n workflow Execute, Telegram send, Schedule activation, VPS terminal, deploy Apps Script, tag, rollback, app source changes, login, API key introduction, OAuth material, credential handling, or any action that cannot be reversed cleanly.

## Base rules

Shared preflight, prohibitions, git rules, and final-report persistence come from `docs/tasks/templates/implementer-standard.md`. This overlay only adds runtime-gated specifics.

## Runtime-gated additions to preflight

- Confirm which specific gate is being opened (reference the Decision Packet ID from `docs/INBOX.md`).
- Confirm the gate was explicitly decided (decision = 1, not pending).

## Step-by-step rule

Every runtime action in this task must be performed **one step at a time**.

- Give one step, wait for outcome before the next.
- If the step fails, ambiguous, or produces unexpected output: stop and report.
- Do not document the step as complete until the user confirms the outcome.

## Forbidden by default (require separate explicit gate)

- Execute not authorized by the current gate.
- Telegram send not authorized by the current gate.
- Schedule activation not authorized by the current gate.
- Import/export not authorized by the current gate.
- Any action outside the scope of the current Decision Packet.

## Runtime-gated specific constraints

- Runtime side effects (new rows, sent messages, activated workflows) must be explicitly described in the gate before executing.
- Any new recurring cost or billing requires its own gate before introduction.

(Token, real chat_id, credential, OAuth, tokenized URL prohibitions are in `implementer-standard.md`.)

## Expected output

- Runtime action performed per gate scope (no more, no less).
- Done marker created: `docs/tasks/done/<task-id>-<slug>.md`.
- Session note created: `docs/sessions/YYYY-MM-DD-<slug>.md`.
- State docs updated: `docs/LLMS.md` + `docs/wiki/current-state.md`.
- Final report per `docs/tasks/templates/final-report-contract.md`.
