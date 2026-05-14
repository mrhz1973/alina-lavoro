# Task ID Preflight

**Status:** active guard

## Purpose

Prevent stale prompts, duplicate task IDs, and accidental writes below current GitHub state.

## Mandatory preflight

Before assigning any new task ID:

1. Read `docs/LLMS.md` from `main`.
2. Extract `Last completed`.
3. Use the next free numeric ID after `Last completed`.
4. Search `docs/tasks/done/` for the proposed ID.
5. Check `docs/tasks/queue/`, `docs/tasks/processing/`, and `docs/tasks/failed/` only if the ID is ambiguous or the task touches lifecycle handling.
6. If prompt state conflicts with GitHub state, GitHub wins.

## Stop conditions

Stop before writing if:

- repository is not `mrhz1973/alina-lavoro`;
- branch/ref is not `main`;
- proposed ID ≤ `Last completed`;
- proposed ID already exists in `docs/tasks/done/`;
- requested work requires runtime without explicit gate;
- requested work would record secrets, real chat IDs, tokens, credentials, OAuth material, or tokenized URLs;
- requested work writes to `docs/INBOX.md` without a real human decision/gate.

## Example

If `Last completed = 0272`, use `0273` unless `0273` already exists.
