# INBOX Decision Recording Template

**Status:** active template

## When to use

Use only when a real human decision has been made or must be recorded:

- a Pending Decision Packet answer from the user;
- a gate decision for runtime, n8n UI, Execute, Schedule, credentials, Telegram send, app changes, deploy, tag, rollback, provider API, billing, secrets, or another irreversible/sensitive action;
- a superseded/deferred decision that changes the decision state.

Do **not** use for:
- routine all-green status;
- debug notes;
- inconclusive retries without a new human choice;
- inspection-ok or validation-ok logs;
- automated actions that do not require user authorization.

Put those in task/session notes instead.

## Recording rules

1. Confirm the Decision Packet ID from `docs/INBOX.md` Pending.
2. Confirm the user's explicit answer.
3. Move the entry from Pending to Decided, Deferred, or Superseded.
4. Record result and decided_at.
5. Update counts.
6. Do not invent decisions. If no user answer exists, leave DP pending.

## New Decision Packet creation rules

Create a new DP only if:
- a real sensitive/irreversible action is about to be authorized;
- the user must choose between non-equivalent paths;
- a runtime gate is about to open.

Do not create a DP for docs-only work, routine state updates, or actions already authorized in scope.

## Required state updates

After recording a decision:
- `docs/INBOX.md`;
- `docs/LLMS.md` INBOX summary if counts changed;
- `docs/wiki/current-state.md` if counts or major gate state changed;
- done marker and session note when tracked.

## Forbidden

- No token, real chat_id, credential secret, OAuth material, or tokenized URL.
- Do not mark a DP as decided without explicit user confirmation.

## Final report

Per `docs/tasks/templates/final-report-contract.md`.
