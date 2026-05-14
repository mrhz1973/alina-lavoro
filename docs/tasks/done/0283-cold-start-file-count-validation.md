# Task 0283 — Cold Start File Count Validation

**Date:** 2026-05-15
**Type:** docs-only
**Status:** done
**Branch:** main

## Goal

Measure whether the post-cleanup short-prompt flow actually reduced cold-start reading burden. Use line/file count as proxy. No new policy doc; no new tool.

## Measurement

Mandatory cold-start set for a standard docs-only task (per `AGENTS.md`, `implementer-standard.md`, `token-efficiency.md`):

| File | Lines | Scope |
|---|---|---|
| `AGENTS.md` | 43 | pointer-only |
| `docs/LLMS.md` | 135 | full |
| `docs/wiki/current-state.md` | 74 | full |
| `docs/wiki/token-efficiency.md` | 104 | full |
| `docs/wiki/task-id-preflight.md` | 34 | only before new task ID |
| `docs/wiki/prompt-routing.md` | 64 | full |
| `docs/wiki/template-pack-index.md` | 39 | full |
| `docs/tasks/templates/implementer-standard.md` | 43 | full |
| `docs/tasks/templates/docs-only-task.md` | 39 | task-type overlay |
| `docs/tasks/templates/final-report-contract.md` | 40 | full |
| `docs/COMMANDS.md` § Mandatory local preflight | ~17 | section only |

**Effective minimum cold-start ≈ 632 lines.** Full-file COMMANDS.md (213 lines) would push the total to ~828; the section-scoped pointer in `implementer-standard.md` already prevents that habit read.

## Habit-read check

Files commonly opened by habit but **not required** for a docs-only cold start:

- `docs/PROJECT_STATE.md` — already suppressed by `LLMS.md` "Do not read by default" rule.
- `docs/CHECKPOINT.md` — already suppressed.
- `docs/history/PROJECT_LOG.md` — already suppressed.
- `docs/sessions/*` — explicitly out of scope unless debugging a specific event.
- All overlay templates other than the task-type one — orchestrator-lite or implementer selects from `template-pack-index.md`; reading all 8 by habit is not required.
- `docs/automation/*` — not part of cold start unless the task is automation-specific.
- `docs/roadmap.md` — only when task needs roadmap context.

All habit reads listed are already suppressed by current pointer wording. No additional pointer fix required.

## Outcome

- Cleanup achieved a measurable reduction in mandatory cold-start reading versus the pre-cleanup pattern, where `PROJECT_STATE.md` + `CHECKPOINT.md` + full `COMMANDS.md` would have added hundreds of additional lines.
- No new measurement framework introduced.
- No file was edited beyond the standard state-doc bumps.

## Safety contract

- no n8n runtime;
- no n8n UI;
- no workflow Execute;
- no Telegram send;
- no Schedule activation;
- no app source changes;
- no deploy/tag/rollback;
- no provider API LLM;
- no new billing;
- no token/chat_id/credential/OAuth material/tokenized URL recorded.
