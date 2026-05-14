# Task 0273 — V3.1 Measure-First Subtraction Pass

**Date:** 2026-05-14
**Type:** docs-only / subtraction / measurement
**Status:** done

## Goal

Reduce V3.1 guidance bloat without adding new enforcement layers, tools, runtime, workflows, or new policy files.

## Task-ID preflight

- Last completed read from `docs/LLMS.md`: 0272.
- Proposed next ID: 0273.
- GitHub search for `0273`: no existing result before writing.
- GitHub state won over chat state where applicable.

## Measurement method

Used file and line count as a proxy. No local tokenizer was available through the GitHub connector.

Measured guidance set:

- `docs/LLMS.md`
- `docs/wiki/current-state.md`
- `docs/wiki/token-efficiency.md`
- `docs/wiki/prompt-routing.md`
- `docs/wiki/context-budget-policy.md`
- `docs/wiki/template-pack-index.md`
- `docs/wiki/task-id-preflight.md`
- `docs/wiki/examples/delta-based-prompt-example.md`
- selected `docs/tasks/templates/*`

## Approximate before/after

| Area | Before | After |
|---|---:|---:|
| Mandatory cold-start (`LLMS.md`, `current-state.md`, `token-efficiency.md`) | ~420 lines | ~290 lines |
| Core V3.1 routing files (`prompt-routing`, `context-budget`, `template-pack-index`, `task-id-preflight`) | ~210 lines | ~145 lines |
| Template pack subset touched | ~145 lines | ~94 lines |
| Total measured/touched guidance | ~775 lines | ~529 lines |

## Changes made

- `docs/LLMS.md`: compressed from long inline history into compact entry point; added explicit ~150-line compact constraint; added automation done criteria; kept future ideas future-only.
- `docs/wiki/current-state.md`: compressed history into current snapshot; added measurement table; clarified automation stable posture.
- `docs/wiki/token-efficiency.md`: consolidated Measure-First Rule, Prompt Size Guard, Docs ROI Gate, and Decision Packet discipline into one existing routing guide.
- `docs/wiki/prompt-routing.md`: reduced companion-doc boilerplate and moved size/subtraction rules inline.
- `docs/wiki/context-budget-policy.md`: replaced enforcement-checklist dependency with local compact Prompt Size Guard.
- `docs/wiki/template-pack-index.md`: shortened companion docs and maintenance rules.
- `docs/wiki/task-id-preflight.md`: shortened to the real guard.
- `docs/tasks/templates/docs-only-task.md`: changed ROI reference from separate enforcement checklist to existing token-efficiency guide.
- `docs/tasks/templates/inbox-decision-recording.md`: clarified that INBOX/DP is only for real human choices/gates; routine debug/status/inspection logs belong in task/session notes.

## Consolidations / duplications removed

- Long history duplicated in both `LLMS.md` and `current-state.md`.
- Prompt Size Guard no longer requires opening a separate enforcement checklist for the compact rule.
- Docs ROI Gate is reachable from `token-efficiency.md` instead of only a separate checklist.
- Decision Packet discipline clarified inside the existing INBOX template and token-efficiency guide.

## Not done intentionally

- No new enforcement/checklist file.
- No CLI Printing Press.
- No repo hygiene scanner.
- No local AI router.
- No browser bridge.
- No n8n UI.
- No runtime.
- No app changes.
- No deploy/tag/rollback.

## Connector note

An attempted update to `docs/tasks/templates/state-update-batch.md` was blocked by the GitHub connector safety filter. It was not forced. The main subtraction patch remains complete without it.

## Safety confirmation

Docs-only. No runtime. No n8n UI. No Execute. No Schedule change. No Telegram send. No app source change. No deploy/tag/rollback. No provider API. No billing. No secret values recorded.
