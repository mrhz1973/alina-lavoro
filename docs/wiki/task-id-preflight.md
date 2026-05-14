# Task ID Preflight

**Task:** 0232
**Date:** 2026-05-14
**Type:** policy / LLM Wiki V3.1
**Status:** active rule

This document defines the mandatory task-ID guard for future orchestrator and implementer work.

## Purpose

Prevent stale prompts, duplicate task IDs, and accidental writes below the current project state.

## Mandatory preflight

Before assigning any new task ID:

1. Read `docs/LLMS.md` from `main`.
2. Extract `Last completed`.
3. Check the proposed task ID against `Last completed`.
4. If needed, check whether the proposed marker already exists under `docs/tasks/done/`.
5. Check `docs/tasks/queue/`, `docs/tasks/processing/`, and `docs/tasks/failed/` only when the task touches the queue lifecycle or when the ID is ambiguous.
6. If the proposed ID is lower than or equal to `Last completed`, stop.
7. If the proposed ID already exists in `docs/tasks/done/`, stop.
8. If prompt state conflicts with GitHub state, use GitHub as source of truth and do not propagate the stale state.
9. Do not write to `docs/INBOX.md` unless a real human decision is required.

## ID selection rule

Use the next free numeric ID after `Last completed`.

Example: if `Last completed = 0231`, use `0232` unless `0232` already exists.

## Stop conditions

Stop before writing if:

- the repository is not `mrhz1973/alina-lavoro`;
- the branch is not `main`;
- the task ID already exists;
- the prompt asserts a runtime state contradicted by GitHub;
- the requested task would require runtime without an explicit gate;
- the task would record secrets, real Chat IDs, tokens, credentials, OAuth material, or tokenized URLs.

## Relation to LLM Wiki V3.1

Task-ID Preflight is the first guard in the Prompt Template + Delta Router pattern. It must run before generating a long prompt, creating a task, or writing state docs.
