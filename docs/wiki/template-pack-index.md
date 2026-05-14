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

## Maintenance

When a prompt repeats a block more than twice, extract it into a template and add it here.
