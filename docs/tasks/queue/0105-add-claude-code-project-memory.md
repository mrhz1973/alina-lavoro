# Task — Add Claude Code project memory

## Metadata

- ID: 0105-add-claude-code-project-memory
- Project: Alina Lavoro
- Type: docs-only
- Priority: normal
- Status: queued
- Created by: Orchestrator
- Deploy: no

## Context

Claude Code sta compattando spesso la conversazione. Questo è normale quando il contesto cresce, ma aumenta il rischio che istruzioni date solo in chat vengano perse o sintetizzate male.

Il progetto Alina Lavoro usa GitHub come fonte di verità e ha già documenti canonici per orchestratore, workflow, comandi e stato progetto.

Serve rendere Claude Code più stabile dopo il compacting creando un file root `CLAUDE.md` breve, versionato e non duplicativo, che punti ai documenti canonici e includa istruzioni compatte da preservare dopo ogni compact.

## Objective

Creare un file root `CLAUDE.md` per il progetto Alina Lavoro.

Il file deve:
- essere breve;
- non duplicare interamente i documenti canonici;
- puntare ai documenti canonici con riferimenti `@docs/...`;
- ricordare a Claude Code che ChatGPT è orchestratore e GitHub è fonte di verità;
- definire regole dure di sicurezza;
- includere una sezione `Compact Instructions`;
- ridurre il rischio di perdita istruzioni dopo compacting.

## Files allowed for future execution

- CLAUDE.md
- docs/CHECKPOINT.md
- docs/PROJECT_STATE.md
- docs/sessions/2026-05-12-add-claude-code-project-memory.md
- docs/tasks/done/0105-add-claude-code-project-memory.md

## Files forbidden for future execution

- src/**
- gas-current/**
- .gas/**
- appsscript.json
- package.json
- docs/tasks/failed/**
- workflow n8n runtime
- export JSON n8n
- deploy Apps Script
- tag Git
- rollback

## Requirements for future execution

Creare `CLAUDE.md` nella root del repository con contenuto simile a questo, adattandolo solo se necessario:

```md
# Claude Code — Alina Lavoro

You are the temporary local implementer for the Alina Lavoro project.

GitHub is the source of truth.
ChatGPT is the orchestrator.
Claude Code implements only the current micro-step.

## Required reading at session start

Read these files before acting:

- @docs/ORCHESTRATOR_RULES.md
- @docs/PROJECT_STATE.md
- @docs/CHECKPOINT.md
- @docs/WORKFLOW.md
- @docs/AI_RULES.md
- @docs/COMMANDS.md
- @docs/roadmap.md

When working on automation tasks, also read:

- @docs/tasks/README.md
- @docs/automation/n8n-workflows/lifecycle-ownership.md
- @docs/automation/n8n-workflows/queue-reader.md
- @docs/automation/n8n-workflows/done-failed-design.md

## Hard rules

- Work only on branch main.
- dev is legacy/inactive.
- Never use git add .
- Do not modify gas-current/ as source.
- Do not deploy, tag, or rollback unless explicitly requested.
- Do not modify src/** unless the current task explicitly allows it.
- For docs-only tasks, touch only allowed docs paths.
- Always commit selectively and push at the end of a completed block.
- Always report commit hash, checks, final git status --short, and whether the workspace is clean.

## Compact Instructions

After compacting, preserve:

- Current task ID and objective.
- Allowed and forbidden paths.
- Whether the task is docs-only or app-related.
- Branch: main.
- Latest relevant commit hash.
- Files already modified.
- Checks already executed.
- Any open risks or manual gates.
- Never infer deploy/tag/rollback permission from prior conversation.
- Re-read the required project documents if unsure.
```

## Constraints

- Questo task è solo preparazione della creazione di CLAUDE.md.
- CLAUDE.md non viene creato in questo task file; viene creato quando il task viene eseguito.
- Nessun deploy.
- Nessun tag.
- Nessun rollback.
- Nessuna modifica app.
- Nessun fire-and-forget.

## Checks for this task creation

- git diff --check
- git diff --stat
- git status --short
- nessun file in docs/tasks/done/
- nessun file in docs/tasks/failed/
- nessuna modifica app
- nessuna modifica n8n runtime

## Deploy policy

none

## Expected output

- Task 0105 creato in queue.
- CLAUDE.md non ancora creato.
- Nessun file in failed o done creato.
- Nessuna modifica n8n runtime.
- Nessuna modifica app.
- Commit selettivo e push su main.

## Manual test gate

not required for task creation.
