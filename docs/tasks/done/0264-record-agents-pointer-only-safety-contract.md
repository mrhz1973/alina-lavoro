# Done — Task 0264

## Done status

**Task:** 0264  
**Slug:** record-agents-pointer-only-safety-contract  
**Completed by:** Claude Code (local)  
**Date:** 2026-05-14  
**Batch:** 0259–0266

## AGENTS.md pointer-only safety contract

- AGENTS.md must remain pointer-only (~30–40 lines).
- It must not grow into duplicated memory or become a second LLMS.md.
- Future edits must preserve the ~30–40 line target unless explicitly justified.
- If AGENTS.md grows beyond ~40 lines, apply the Prompt Size Guard (`docs/wiki/v31-enforcement-checklist.md`) and reduce it.
- AGENTS.md must always point to LLMS.md as the real state entry point — it must never replace LLMS.md.
- AGENTS.md must not duplicate:
  - LLMS.md content
  - ORCHESTRATOR_RULES.md rules
  - AI_RULES.md rules
  - WORKFLOW.md rules
- AGENTS.md must never contain: tokens, secrets, chat IDs, OAuth material, credentials, or runtime authorization.
- Any expansion of AGENTS.md that adds new rules (not just pointers) requires an explicit task and justification.

## Confirmations

- Safety contract recorded: ✅
- No runtime: ✅
- No secrets: ✅
