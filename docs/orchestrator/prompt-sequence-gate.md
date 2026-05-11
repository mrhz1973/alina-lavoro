# Orchestrator Rule — Prompt Sequence Gate

Status: canonical rule
Date: 2026-05-12
Project: Alina Lavoro

## Rule

Before preparing any new Claude Code / Cursor operational prompt, the orchestrator must verify that the previous prompt cycle has been completed and checked with `aggio`.

## Required behavior

If the orchestrator has already given the user a Claude Code / Cursor prompt and the user has not yet returned with `aggio`, the orchestrator must not prepare another operational prompt.

The orchestrator may answer questions or clarify the previous prompt, but must not advance to a new implementation prompt until GitHub has been checked after the previous run.

## Correct response when a prompt cycle is still open

Use a short blocker response, for example:

```text
Prima verifico il risultato del prompt precedente: quando Claude Code/Cursor finisce, scrivi `aggio`.
```

## Rationale

Preparing prompts before the previous execution is verified wastes tokens and time, and can generate obsolete instructions because GitHub state may already have changed.

## Scope

This rule applies to:

- Claude Code prompts;
- Cursor/Agent prompts;
- Codex prompts;
- n8n/manual automation prompts when the previous human-in-the-loop step is not closed.

This rule does not block ordinary explanations, diagnostics, or answers that do not create a new operational prompt.
