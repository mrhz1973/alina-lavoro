# Template Pack Index — LLM Wiki V3.1

**Task:** 0232
**Date:** 2026-05-14
**Type:** template index
**Status:** active rule

## Purpose

Index reusable task templates so future prompts can be short and delta-based.

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

A future prompt should reference only the templates needed for the task and then provide a small `TASK DELTA`.

## Companion workflow docs (batch 0236–0240)

These are not templates but complement the template pack:

| Document | Purpose |
|---|---|
| `docs/wiki/compact-task-creation-workflow.md` | How the orchestrator creates tasks using templates |
| `docs/wiki/compact-implementer-prompt-workflow.md` | How to generate compact implementer prompts |
| `docs/wiki/multi-step-batch-planning-rules.md` | When to batch vs single task; batch size rules |
| `docs/wiki/examples/v31-compact-workflow-cookbook.md` | Practical examples for all common task types |
| `docs/wiki/v31-enforcement-checklist.md` | **Prompt Size Guard** — apply when a prompt exceeds ~80–100 lines |

## Maintenance

When a prompt repeats a block more than twice, extract it into a template and add it here.
