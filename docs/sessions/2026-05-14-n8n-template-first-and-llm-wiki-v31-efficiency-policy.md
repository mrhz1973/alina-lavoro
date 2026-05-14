# Session — n8n template-first and LLM Wiki V3.1 efficiency policy

**Date:** 2026-05-14
**Task:** 0232
**Type:** direct GitHub docs-only policy patch

## Why this policy was imposed

The user explicitly required a correction to the orchestration workflow after repeated time loss caused by long manual n8n/Telegram checks and oversized implementer prompts.

The project had already proven that known n8n workflows can often be represented as importable JSON templates. Therefore, manual node-by-node reconstruction must no longer be the default when a safe template can be generated.

## Why Claude Code / Windsurf / Cursor were excluded

The user instructed that, for this patch, no external implementer should be used and no implementer prompt should be generated. The patch was therefore applied directly to GitHub as docs-only policy work.

## Why no runtime was performed

This task only formalizes policy and templates. It does not require n8n UI, workflow import, Execute, Telegram send, Schedule activation, app changes, deploy, tag, rollback, provider API, or billing.

## Policy result

The repository now includes:

- Task-ID Preflight guard;
- Prompt Routing policy for LLM Wiki V3.1;
- Context Budget policy;
- Template Pack index;
- standard implementer template;
- n8n template-first task template;
- final report contract;
- done marker for task 0232.

## How to use in future tasks

Future prompts should be short and reference repository templates rather than repeating the same boilerplate.

Preferred structure:

```text
@docs/roadmap.md
@docs/wiki/task-id-preflight.md
@docs/tasks/templates/implementer-standard.md
@docs/tasks/templates/n8n-template-first-task.md
@docs/tasks/templates/final-report-contract.md

TASK DELTA:
- Verified Last completed: XXXX
- Task ID: XXXX
- Goal: ...
- Runtime: forbidden / gated
- Secrets: forbidden
- Expected result: ...
```

## Current-state caveat

The user prompt contained an older expected state around `Last completed = 0226` and Telegram Mode A manual-only/inactive. GitHub preflight showed this was obsolete: current state is `Last completed = 0231` and Telegram Mode A is active scheduled notification-only. The obsolete state was not propagated.

## Safety confirmation

No runtime. No n8n UI. No workflow Execute. No Telegram send. No Schedule activation. No template import. No token. No real Chat ID. No credential secret. No provider API LLM. No new billing. No app source change. No deploy, tag, or rollback.
