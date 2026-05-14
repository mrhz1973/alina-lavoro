# Context Budget Policy — LLM Wiki V3.1

**Task:** 0232
**Date:** 2026-05-14
**Type:** token/context policy
**Status:** active rule

## Purpose

Keep orchestrator and implementer context small, accurate, and GitHub-grounded.

## Rule

Do not generate monolithic prompts when the same rules can be referenced from repository templates.

A future implementer prompt should contain:

- references to canonical files and templates;
- verified current state;
- task delta;
- task-specific constraints;
- expected result.

It should not repeat hundreds of lines of boilerplate already present in the repo.

## Budget tiers

| Tier | Use | Guidance |
|---|---|---|
| Minimal | Task file already exists | Reference task file + standard templates |
| Delta | State or runtime facts just collected in chat | Add only the fresh facts that are not yet in GitHub |
| Full | No repo template exists yet or task is unusual | Use full prompt once, then convert repeated parts into templates |

## Mandatory reductions

- Use `docs/LLMS.md` and `docs/wiki/current-state.md` before large fallback files.
- Do not read `docs/PROJECT_STATE.md` or `docs/CHECKPOINT.md` by default.
- Do not paste repeated git workflow, security rules, or final report format if a template can cover them.
- Do not duplicate bilingual blocks.
- Use technical English for agent-facing templates and Italian for final user summaries.
- Before creating a new document: apply the Docs ROI Gate — at least one must apply (reduces token usage / user time / ambiguity / repeated errors / future manual work). A new doc that only adds another file to read is a regression. Full gate: `docs/wiki/v31-enforcement-checklist.md` § F.

## Exception

Long prompts are still allowed when fresh runtime evidence exists only in chat and must be preserved before documentation catches up.

## Enforcement

If a future prompt exceeds ~80–100 lines, apply the Prompt Size Guard before sending:
→ `docs/wiki/v31-enforcement-checklist.md`
