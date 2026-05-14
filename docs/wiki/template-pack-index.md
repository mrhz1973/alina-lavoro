# Template Pack Index — LLM Wiki V3.1

**Status:** active template index

## Purpose

Index reusable task templates so prompts can stay short and delta-based.

## Core templates

| Template | Purpose |
|---|---|
| `docs/tasks/templates/implementer-standard.md` | Standard implementer role, GitHub-first rules, forbidden actions |
| `docs/tasks/templates/docs-only-task.md` | Docs-only task contract |
| `docs/tasks/templates/runtime-gated-task.md` | Runtime/UI gate contract |
| `docs/tasks/templates/inbox-decision-recording.md` | INBOX decision recording contract |
| `docs/tasks/templates/n8n-template-first-task.md` | n8n template-first / JSON-first task contract |
| `docs/tasks/templates/n8n-ui-supervised-cleanup.md` | Step-by-step supervised n8n UI cleanup contract |
| `docs/tasks/templates/state-update-batch.md` | State/wiki/roadmap/session update contract |
| `docs/tasks/templates/final-report-contract.md` | Required final report format |

## Usage

Reference only the templates needed for the task, then provide a small `TASK DELTA`.

Do not include every template by habit.

## Companion workflow docs

| Document | Purpose |
|---|---|
| `docs/wiki/compact-task-creation-workflow.md` | How the orchestrator creates tasks |
| `docs/wiki/compact-implementer-prompt-workflow.md` | How to generate compact prompts |
| `docs/wiki/multi-step-batch-planning-rules.md` | Batch vs single-task rules |
| `docs/wiki/examples/v31-compact-workflow-cookbook.md` | Practical examples |

## Maintenance

Extract a new template only when a block repeats more than twice **and** the Docs ROI Gate is satisfied. Otherwise update an existing template or delete duplication.
