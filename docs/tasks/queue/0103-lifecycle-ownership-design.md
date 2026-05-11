# Task — Lifecycle ownership design

## Metadata

- ID: 0103-lifecycle-ownership-design
- Project: Alina Lavoro
- Type: docs-only
- Priority: normal
- Status: queued
- Created by: Orchestrator
- Deploy: no

## Context

0101 e 0102 sono completati e marcati done.

Premesse reali:
- skip done già validato empiricamente: dopo la creazione di docs/tasks/done/0102-update-docs-automation-state.md, n8n non ha riprocessato 0102;
- 0101 e 0102 sono done;
- due pattern done coesistono: ## Done status e ## Done copy-only outcome;
- failed handling non è ancora validato;
- Claude Code runner temporaneo non deve diventare fire-and-forget.

Il problema reale è documentare ownership e lifecycle queue → processing → done/failed, non re-implementare lo skip done.

## Objective

Creare una fonte canonica che definisca owner, condizioni e formati per processing, done e failed, armonizzando i pattern esistenti senza modificare retroattivamente i file done già scritti.

La validazione failed sarà un task separato successivo, non parte di 0103.

## Files allowed

- docs/automation/n8n-workflows/lifecycle-ownership.md
- docs/automation/n8n-workflows/task-lifecycle.md
- docs/automation/n8n-workflows/done-failed-design.md
- docs/automation/n8n-workflows/queue-reader.md
- docs/tasks/README.md
- docs/PROJECT_STATE.md
- docs/CHECKPOINT.md
- docs/sessions/2026-05-11-lifecycle-ownership-design.md

## Files forbidden

- src/**
- gas-current/**
- .gas/**
- appsscript.json
- package.json
- docs/tasks/done/**
- docs/tasks/failed/**
- export JSON n8n
- workflow n8n

## Requirements

- Creare docs/automation/n8n-workflows/lifecycle-ownership.md come fonte canonica.
- Documentare matrice owner per processing, done e failed.
- Documentare che ## Done status e ## Done copy-only outcome sono entrambi pattern validi.
- Documentare retry failed: rimuovere failed/{task}.md o creare nuovo task -retry-N.
- Aggiornare task-lifecycle.md, done-failed-design.md, queue-reader.md e tasks/README.md con link o note coerenti.
- Aggiornare PROJECT_STATE.md e CHECKPOINT.md.
- Creare sessione documentale 2026-05-11-lifecycle-ownership-design.md.

## Constraints

- Solo documentazione.
- Nessun workflow n8n modificato o eseguito.
- Nessuna validazione failed in questo task.
- Nessun file in docs/tasks/failed/.
- Non modificare file esistenti in docs/tasks/done/.
- Nessuna modifica al codice app.
- Nessun deploy Apps Script.
- Nessun tag Git.
- Nessun rollback.
- Non usare git add .
- Lavoro su branch main.
- git pull --rebase prima di ogni push.

## Checks

- git diff --check
- git diff --stat HEAD~1 deve mostrare solo path sotto docs/
- git status --short
- nessun file esistente in docs/tasks/done/ modificato
- nessun file scritto in docs/tasks/failed/

## Deploy policy

none

## Expected output

- lifecycle-ownership.md creato.
- documenti collegati aggiornati.
- PROJECT_STATE.md e CHECKPOINT.md aggiornati.
- sessione documentale creata.
- nessuna modifica app.
- nessun deploy/tag/rollback.
- commit selettivo e push solo dopo approvazione manuale.

## Manual test gate

not required
