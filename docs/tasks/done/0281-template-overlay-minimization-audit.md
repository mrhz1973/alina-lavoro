# Task 0281 — Template Overlay Minimization Audit

**Date:** 2026-05-15
**Type:** docs-only
**Status:** done
**Branch:** main

## Goal

Audit active task templates for repeated boilerplate already covered by `implementer-standard.md` and `final-report-contract.md`. Remove duplicated wording, keep each overlay short and useful, and require each overlay to rely on `implementer-standard.md` for shared rules.

## Findings

Duplication patterns found across the V3.1 template pack:

- "No token, real chat_id, credential secret, OAuth material, or tokenized URL" — repeated in ~5 overlays despite already living in `implementer-standard.md` § Permanent prohibitions.
- "Mandatory preflight" — full-block duplication of task-ID guard + branch check + LLMS→current-state→token-efficiency reads in ~3 overlays.
- "No deploy/tag/rollback", "No `git add .`", "No provider API LLM", "No new billing" — repeated across 4+ overlays.

`implementer-standard.md` already covers all of these. `final-report-contract.md` is referenced by every overlay as a pointer (no duplication).

## Changes applied

Added a uniform "Base rules" pointer block in each overlay that points to `implementer-standard.md` for shared preflight / prohibitions / git rules / final-report persistence. Kept all task-type-unique content intact.

- `docs/tasks/templates/docs-only-task.md`: replaced full "Mandatory preflight" duplicate and verbose "Forbidden actions" block with a Base rules pointer + docs-only-specific additions (ROI gate, src/gas-current/n8n forbidden).
- `docs/tasks/templates/runtime-gated-task.md`: replaced duplicate "Mandatory preflight" with pointer + runtime-gated additions (Decision Packet reference, decision = 1 not pending). Removed duplicate token list under "Sensitive constraints".
- `docs/tasks/templates/state-update-batch.md`: replaced duplicate "Mandatory preflight" with pointer + state-update specific stale-scan addition. Compressed "Forbidden" to state-update specifics, removed duplicate token / git / billing list.
- `docs/tasks/templates/inbox-decision-recording.md`: added Base rules pointer; reduced "Forbidden" to INBOX-specific items (do not mark DP decided without user confirmation; do not invent a DP).
- `docs/tasks/templates/n8n-template-first-task.md`: added Base rules pointer; reduced "Template safety requirements" to n8n-template-specific items (`active=false`, no Schedule Trigger, no INBOX-answering node, no Browser Bridge write, no queue reader modification, placeholder credentials).
- `docs/tasks/templates/n8n-ui-supervised-cleanup.md`: added Base rules pointer; reduced "Forbidden" to n8n-UI-cleanup-specific (do not declare cleanup complete until operator confirms save).
- `docs/tasks/templates/implementer-standard.md` and `docs/tasks/templates/final-report-contract.md` and `docs/wiki/template-pack-index.md`: no changes needed — they are the canonical bases and already pointed at correctly.

## No deletions

No template was deleted. The Template Pack still has 8 active templates plus older pre-V3.1 templates in the same directory (untouched).

## Checks

- `git status` before edits: clean on `main`.
- Edits limited to `docs/tasks/templates/*.md` allowed paths.
- No `src/**`, `gas-current/**`, app source, n8n runtime, or deploy touched.

## Safety contract

- no runtime;
- no n8n UI;
- no workflow Execute;
- no Telegram send;
- no Schedule activation;
- no app source changes;
- no deploy/tag/rollback;
- no provider API LLM;
- no new billing;
- no token / chat_id / credential / OAuth material / tokenized URL recorded.

## Outcome

Each V3.1 overlay is now visibly task-type-specific. Shared rules live only in `implementer-standard.md` and `final-report-contract.md`. No template was collapsed into a universal monster; each retains its unique purpose.
