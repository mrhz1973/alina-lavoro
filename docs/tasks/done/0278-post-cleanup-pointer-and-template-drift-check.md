# Task 0278 — Post-Cleanup Pointer and Template Drift Check

## Done status

- **Task ID:** 0278
- **Slug:** post-cleanup-pointer-and-template-drift-check
- **Completed by:** Claude Code (Opus 4.7)
- **Completion date:** 2026-05-15
- **Completion commit:** (see session note)

## Summary

Docs-only follow-on to task 0277. Audited the V3.1 guidance surface (AGENTS.md, LLMS.md, current-state.md, token-efficiency.md, prompt-routing.md, all 8 implementer templates, COMMANDS.md, roadmap.md) for residual pointer and ownership drift after the 0277 cleanup. Fixed three drift items. No new guidance documents created.

## Interventions completed

1. **AGENTS.md** — Re-attributed the Docs ROI Gate / New-doc gate pointer to `docs/wiki/token-efficiency.md` (canonical home) and removed the misattribution from the `docs/wiki/prompt-routing.md` line. The prompt-routing line now reads "prompt shape, template selection table, Prompt Size Guard" only.
2. **docs/wiki/prompt-routing.md** — Trimmed the two duplicate "Before adding new guidance docs..." / "A new document that only adds another file to read..." bullets from the "Size and subtraction rules" section. Replaced with a single pointer to the New-doc gate canonical home in `token-efficiency.md`.
3. **docs/roadmap.md** — Removed the stale "NOW · Complete docs guidance redundancy cleanup; fix pointers; no new guidance docs" row from the post-cleanup roadmap table (closed by 0277 + 0278). Updated "Verify cold-start is lighter after cleanup" trigger from "After 0277" to "After 0278".

## Audit items checked with no change required

- AGENTS.md pointer-only constraint (43 lines) — within budget; no rewrite needed.
- token-efficiency.md vs prompt-routing.md ownership — once intervention 2 was applied, the split is clean: token-efficiency owns navigation + New-doc gate; prompt-routing owns prompt shape + template selection + Prompt Size Guard.
- Final report consistency — all 7 task-overlay templates (`docs-only-task`, `runtime-gated-task`, `inbox-decision-recording`, `n8n-template-first-task`, `n8n-ui-supervised-cleanup`, `state-update-batch`, and `implementer-standard`) point to `final-report-contract.md` without duplicating it.
- Local clone preflight — `COMMANDS.md` § "Mandatory local preflight" remains the canonical command block; `implementer-standard.md` keeps only a compact pointer plus three behavioral rules.
- Line budgets — `LLMS.md` 135/150 lines; `current-state.md` 74/100 lines; templates 40–56 lines each; `prompt-routing.md` reduced from 65 to 63 lines; `token-efficiency.md` 104 lines.
- PROJECT_STATE.md / CHECKPOINT.md fallback discipline — no default-read instruction in any of the audited files; all mentions correctly framed as fallback/audit only or appear inside intentional "old style (avoid)" examples.
- Future / meta-tool freeze — CLI Printing Press, repo hygiene scanner, local AI router, browser bridge, dual-agent loop remain LATER/gated only in `LLMS.md`, `current-state.md`, and `roadmap.md`.
- Roadmap compactness — post-cleanup table reduced from 18 to 17 rows (the stale NOW row removed); the rest of `roadmap.md` is product roadmap history and was left untouched per "trim obvious duplication only" scope.

## Confirmation

- No runtime.
- No n8n UI.
- No workflow Execute.
- No Telegram send.
- No Schedule activation.
- No app source changes (`src/**`).
- No deploy/tag/rollback.
- No provider API.
- No billing.
- No secrets / token / chat_id / OAuth material.
- No new guidance documents created.
- No `docs/PROJECT_STATE.md` or `docs/CHECKPOINT.md` opened or modified.
