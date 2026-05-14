# Context Budget Policy — LLM Wiki V3.1

**Status:** active token/context policy

## Rule

Do not generate monolithic prompts when the same rules can be referenced from repository templates.

A future implementer prompt should contain:
- canonical/template references;
- verified current state;
- task delta;
- task-specific constraints;
- expected result.

It should not repeat hundreds of lines of boilerplate already present in the repo.

## Budget tiers

| Tier | Use | Guidance |
|---|---|---|
| Minimal | Task file already exists | Reference task file + standard templates |
| Delta | Fresh facts only in chat | Add only those facts |
| Full | No template exists or task is unusual | Use once, then consolidate repeated parts |

## Mandatory reductions

- Use `docs/LLMS.md` and `docs/wiki/current-state.md` before large fallback files.
- Do not read `docs/PROJECT_STATE.md` or `docs/CHECKPOINT.md` by default.
- Do not paste repeated git workflow, security rules, or final report format if templates cover them.
- Do not duplicate bilingual blocks.
- Before creating a new guidance doc, apply the Measure-First Rule in `docs/wiki/token-efficiency.md`.

## Prompt Size Guard

If a prompt exceeds ~80–100 lines, justify it or trim it before sending.

Trim by:
- using Template Pack + `TASK DELTA`;
- deleting repeated boilerplate;
- referencing existing rules;
- moving only reusable missing rules into existing docs.

## Exception

Long prompts are allowed when fresh runtime evidence exists only in chat and must be preserved before documentation catches up.
