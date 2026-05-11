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

Creare `CLAUDE.md` nella root del repository con contenuto simile a questo, adattandolo solo se necessario.

## Constraints

- Questo task è solo preparazione della creazione di CLAUDE.md.
- CLAUDE.md non viene creato in questo task file; viene creato quando il task viene eseguito.
- Nessun deploy.
- Nessun tag.
- Nessun rollback.
- Nessuna modifica app.
- Nessun fire-and-forget.

## Deploy policy

none

## Done status

- Completed by: Claude Code runner
- Completion commit: (see below — da aggiornare dopo commit)
- Completion message: docs: add claude code project memory CLAUDE.md
- Completed at: 2026-05-12
- Outcome: CLAUDE.md creato nella root; sessione documentale creata; nessuna modifica app
- Session: docs/sessions/2026-05-12-add-claude-code-project-memory.md
- Notes:
  - Copy-only done marker.
  - Queue file intentionally retained.
  - No app changes.
  - No n8n runtime changes.
  - No deploy, tag or rollback.
