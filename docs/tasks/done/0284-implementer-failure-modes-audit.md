# Task 0284 — Implementer Failure Modes Audit

**Date:** 2026-05-15
**Type:** docs-only
**Status:** done
**Branch:** main

## Goal

Verify that the standard implementer flow handles the main failure modes without requiring user copy/paste or unsafe git actions.

## Audit table

| Failure mode | Handled by | Status |
|---|---|---|
| Wrong repository path | `task-id-preflight.md` stop conditions; `implementer-standard.md` § Local clone preflight; `COMMANDS.md` § Mandatory local preflight | Covered |
| Wrong branch | Same three files (explicit "If not, stop and report") | Covered |
| Dirty working tree | `implementer-standard.md`: "If dirty tree: do not pull, reset, stash, or delete. Run `git diff --stat` and `git diff --check`, then stop and report." Mirrored in `COMMANDS.md` | Covered |
| Local clone behind `origin/main` | `implementer-standard.md` + `COMMANDS.md`: "If clean: run `git pull origin main`..." | Covered |
| Task ID already exists | `task-id-preflight.md` stop condition: "proposed ID already exists in docs/tasks/done/" | Covered |
| Forbidden path touched | `implementer-standard.md` permanent prohibitions; per-template "Allowed paths"; `AI_RULES.md` "stop only for scope drift" | Covered |
| Runtime gate encountered | `implementer-standard.md` permanent prohibitions; `AI_RULES.md` sensitive-gate list; `runtime-gated-task.md` step-by-step rule | Covered |
| Final report left only in terminal/chat | `implementer-standard.md` § Final report persistence; `final-report-contract.md` opening rule | Covered |
| Push rejected | `implementer-standard.md` Git rules — **one-line addition this task**: "do not force-push or skip hooks; stop, report, wait" | Covered (added this task) |
| `PROJECT_STATE.md` / `CHECKPOINT.md` read by default | `LLMS.md`, `token-efficiency.md`, `implementer-standard.md`, `docs-only-task.md`, `state-update-batch.md`, `AGENTS.md`, `CLAUDE.md` all say "Do not read by default" | Covered |

## Pointer fix applied

Added a single line to `docs/tasks/templates/implementer-standard.md` § Git rules:

> If `git push` is rejected (non-fast-forward, hook failure, network), do **not** force-push or skip hooks. Stop, report the rejection reason, and wait for instructions.

No new troubleshooting guide created. No long failure-mode table added to canonical docs (this audit-level table lives in the done marker only).

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

## Outcome

All ten failure modes are now explicitly covered by existing files. The one previously implicit gap (push rejected) is now a single-line rule in `implementer-standard.md`.
