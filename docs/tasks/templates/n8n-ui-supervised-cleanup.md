# n8n UI Supervised Cleanup Template

**Task:** 0234 (introduced)
**Status:** active template

## When to use

Use when a task requires a human operator to make targeted node edits in the n8n UI — for example: updating a stale expression, fixing a field mapping, correcting a credential reference, or removing a leftover debug node — without triggering workflow execution or activating schedules.

## Rule: one step at a time

Every cleanup step must be performed one at a time with the operator confirming the outcome before the next step.

## What this template authorizes

- Reading node configurations in n8n UI.
- Editing specific field values (expression, parameter, mapping) as listed in the task scope.
- Saving the edited workflow.
- Inspecting the workflow graph and node output fields.

## What this template does NOT authorize

Unless a separate explicit Decision Packet gate says otherwise:

- No workflow Execute.
- No Telegram send or test send.
- No Schedule Trigger activation.
- No workflow activation (`active=true`).
- No credential export or re-linking outside existing bindings.
- No template import or export.
- No queue reader modification.
- No app source change.
- No deploy/tag/rollback.

## Cleanup scope definition (fill per task)

The task prompt must explicitly list:
- which workflow to edit;
- which nodes to change;
- which fields to update;
- expected before/after values;
- what constitutes successful cleanup (observable in the node editor).

## Expected output

- n8n workflow saved with targeted edits only.
- No new runtime side effects.
- Done marker: `docs/tasks/done/<task-id>-<slug>.md`.
- Session note describing each edit, before/after values, and confirmation.
- State docs updated: `docs/LLMS.md` + `docs/wiki/current-state.md`.
- Final report per `docs/tasks/templates/final-report-contract.md`.

## Forbidden

- No token, real chat_id, credential secret, or OAuth material documented in repo or chat.
- Do not describe the cleanup as complete until the operator confirms the save.
