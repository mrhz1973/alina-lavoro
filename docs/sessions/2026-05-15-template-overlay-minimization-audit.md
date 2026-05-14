# Session 2026-05-15 — Template Overlay Minimization Audit (task 0281)

**Repository:** `mrhz1973/alina-lavoro`
**Branch:** `main`
**Task ID:** 0281
**Type:** docs-only

## Preflight

- `git status` clean; branch `main`; up to date with `origin/main` (after 0280 push).
- Verified `Last completed = 0280` in `docs/LLMS.md`. Next free ID = 0281. Confirmed 0281 absent from `docs/tasks/done/`.
- Read all 8 templates in `docs/tasks/templates/` (V3.1 pack).
- Read `docs/wiki/template-pack-index.md`.
- `docs/PROJECT_STATE.md` and `docs/CHECKPOINT.md` not opened.

## Audit method

For each overlay, identified content that was either:
1. duplicate of `implementer-standard.md` (preflight steps, git rules, permanent prohibitions, token/credential lists);
2. duplicate of `final-report-contract.md` (already always referenced by pointer — no duplication found there);
3. genuinely task-type-specific (kept intact).

## Files modified

- `docs/tasks/templates/docs-only-task.md` — 45 → 39 lines.
- `docs/tasks/templates/runtime-gated-task.md` — restructured with Base rules pointer; removed duplicate sensitive-constraint token list.
- `docs/tasks/templates/state-update-batch.md` — 57 → 55 lines; preflight and forbidden lists compressed.
- `docs/tasks/templates/inbox-decision-recording.md` — Base rules pointer added; forbidden reduced to INBOX specifics.
- `docs/tasks/templates/n8n-template-first-task.md` — 46 → 41 lines; Base rules pointer added; n8n-specific template safety items kept.
- `docs/tasks/templates/n8n-ui-supervised-cleanup.md` — Base rules pointer added; forbidden reduced to UI-cleanup specific.
- `docs/tasks/templates/implementer-standard.md` and `final-report-contract.md` — unchanged (canonical bases).
- `docs/wiki/template-pack-index.md` — unchanged (already mentions "use core + task overlay + final report").

## Result

Each overlay is now visibly task-type-specific. Shared rules live only in `implementer-standard.md`. No template was collapsed into a universal monster. No template was deleted. 8 active overlays preserved.

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
- no token/chat_id/secrets recorded.

## Residual risks

None. Overlays still cross-reference `implementer-standard.md` and `final-report-contract.md` correctly via the V3.1 prompt shape in `docs/wiki/prompt-routing.md`.

## Next micro-step

Continue chain with task 0282 — Orchestrator-lite readiness audit.
