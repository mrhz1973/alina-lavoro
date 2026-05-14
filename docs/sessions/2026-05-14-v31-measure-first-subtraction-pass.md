# Session — V3.1 Measure-First Subtraction Pass

**Date:** 2026-05-14
**Task:** 0273
**Mode:** direct GitHub docs-only patch

## Context

The project solved the monolithic prompt problem but risked the opposite failure mode: too many guidance files, duplicated policies, and meta-work around meta-work. This session performed a subtractive, measurable V3.1 pass.

## Read protocol

Read through LLMS-first routing:

1. `docs/LLMS.md`
2. `docs/wiki/current-state.md`
3. `docs/wiki/token-efficiency.md`
4. `docs/wiki/prompt-routing.md`
5. `docs/wiki/context-budget-policy.md`
6. `docs/wiki/template-pack-index.md`
7. `docs/wiki/task-id-preflight.md`
8. `docs/wiki/examples/delta-based-prompt-example.md`
9. selected `docs/tasks/templates/*`
10. selected operational docs from the previous `aggio` pass

`docs/PROJECT_STATE.md` and `docs/CHECKPOINT.md` were not opened.

## Task-ID preflight

- Last completed: 0272.
- Next task selected: 0273.
- Search for 0273 returned no existing result before writing.

## Measurement

No token counter was available through the GitHub connector, so file/line count was used as proxy.

Approximate result:

| Area | Before | After |
|---|---:|---:|
| Mandatory cold-start (`LLMS.md`, `current-state.md`, `token-efficiency.md`) | ~420 lines | ~290 lines |
| Core V3.1 routing files (`prompt-routing`, `context-budget`, `template-pack-index`, `task-id-preflight`) | ~210 lines | ~145 lines |
| Template pack subset touched | ~145 lines | ~94 lines |
| Total measured/touched guidance | ~775 lines | ~529 lines |

## Files changed

- `docs/LLMS.md`
- `docs/wiki/current-state.md`
- `docs/wiki/token-efficiency.md`
- `docs/wiki/prompt-routing.md`
- `docs/wiki/context-budget-policy.md`
- `docs/wiki/template-pack-index.md`
- `docs/wiki/task-id-preflight.md`
- `docs/tasks/templates/docs-only-task.md`
- `docs/tasks/templates/inbox-decision-recording.md`
- `docs/tasks/done/0273-v31-measure-first-subtraction-pass.md`
- `docs/sessions/2026-05-14-v31-measure-first-subtraction-pass.md`

## Files intentionally not created

- No new enforcement checklist.
- No new policy layer.
- No new runtime/workflow/tool file.

## Duplications removed / consolidated

- Long task history duplicated in both `LLMS.md` and `current-state.md` was replaced by compact current-state summaries.
- Prompt Size Guard moved into existing `token-efficiency.md`, `prompt-routing.md`, and `context-budget-policy.md` instead of requiring another checklist read.
- Docs ROI Gate and Measure-First Rule consolidated in `token-efficiency.md`.
- Decision Packet discipline clarified in `token-efficiency.md` and `inbox-decision-recording.md`.
- Future ideas explicitly kept future-only, not active workstreams.

## Blocked connector action

An attempted update to `docs/tasks/templates/state-update-batch.md` was blocked by the GitHub connector safety filter. It was not retried or forced. The patch still met the success criteria through the other consolidations.

## Safety confirmation

No runtime. No n8n UI. No workflow Execute. No Telegram send. No Schedule change. No app source changes. No deploy/tag/rollback. No provider API. No billing. No secrets, real chat IDs, tokens, OAuth material, or tokenized URLs recorded.

## Result

V3.1 remains active, but the entry and routing layer is more compact and measure-first. LLMS.md is constrained as an entry point rather than a second PROJECT_STATE.md. INBOX/DP discipline is clearer: decisions only, not routine status logging.
