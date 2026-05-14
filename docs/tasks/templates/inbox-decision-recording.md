# INBOX Decision Recording Template

**Task:** 0234 (introduced)
**Status:** active template

## When to use

Use when a human decision has been made and needs to be recorded:
- A Decision Packet (D-NNNN-A) answer received from the user (option 1, 2, or 3).
- The outcome of a runtime gate (success, failure, inconclusive).
- A superseded or deferred decision that needs to be marked.

Do NOT use for:
- Logging all-green status or routine events that require no human decision.
- Creating a new INBOX entry unless a real new decision point exists.
- Recording automated actions that don't require user authorization.

## Decision Packet recording rules

1. Confirm the Decision Packet ID from `docs/INBOX.md` (section: Pending).
2. Confirm the user's explicit answer: option 1, 2, or 3.
3. Move the entry from Pending to Decided in `docs/INBOX.md`.
4. Record outcome: `D-NNNN-A = N` where N is the user's answer.
5. Add result/notes (e.g. success criterion met, inconclusive, partial).
6. Update INBOX pending count and decided count.
7. Do not invent decisions. If no user answer exists, leave DP as pending.

## New Decision Packet creation rules

Only create a new DP if:
- A real irreversible or sensitive action is about to be authorized.
- The user must choose between two or more non-equivalent paths.
- A runtime gate is about to open for the first time.

Do not create a DP for:
- Docs-only changes with no real choice.
- Actions already authorized by a prior gate in scope.
- Routine state updates.

## Required state doc updates

After recording a decision:
- `docs/INBOX.md` — move entry, update counts.
- `docs/LLMS.md` — update INBOX state in Human Decision Inbox row.
- `docs/wiki/current-state.md` — update INBOX counts + DP row if significant.
- Done marker: `docs/tasks/done/<task-id>-<slug>.md`.
- Session note: `docs/sessions/YYYY-MM-DD-<slug>.md`.

## Forbidden

- No token, real chat_id, credential secret, or OAuth material in INBOX entries.
- Do not mark a DP as decided without explicit user confirmation.
- Do not create a new DP to record an automated success that required no user choice.
