# Task — n8n reads Cursor prompt template from repo

## Metadata

- ID: 0101-n8n-read-cursor-prompt-template-from-repo
- Project: Alina Lavoro
- Type: n8n-docs
- Priority: normal
- Status: queued
- Created by: Orchestrator
- Deploy: no

## Context

Il task 0100 ha introdotto in repository il template documentale:

- `docs/tasks/templates/cursor-prompt-default.md`

Il workflow n8n `TEST - GitHub list Alina task queue` usa ancora testo hardcoded nel nodo Code `Build Cursor prompt`.

Questo task prepara il passo successivo: modificare il workflow n8n, in modo controllato e passo-passo, affinché il template venga letto dal repository e poi riempito con le variabili del task.

## Objective

Aggiornare il workflow n8n `TEST - GitHub list Alina task queue` per leggere il file:

- `docs/tasks/templates/cursor-prompt-default.md`

e usare quel contenuto come base del prompt Cursor, sostituendo i segnaposto:

- `{{task_source_path}}`
- `{{project}}`
- `{{type}}`
- `{{priority}}`
- `{{deploy_policy}}`
- `{{objective}}`
- `{{requirements}}`
- `{{expected_output}}`

## Files allowed

- docs/automation/n8n-workflows/queue-reader.md
- docs/automation/n8n-workflows/queue-reader-ai-friendly-template.md
- docs/sessions/2026-05-11-task-0101-n8n-read-cursor-prompt-template.md
- eventuali aggiornamenti minimi a docs/PROJECT_STATE.md e docs/CHECKPOINT.md

## Files forbidden

- src/**
- gas-current/**
- .gas/**
- appsscript.json
- package.json
- export JSON n8n non redatti
- docs/tasks/templates/cursor-prompt-default.md, salvo correzioni minime necessarie e motivate

## Requirements

- Non modificare app Alina.
- Non fare deploy.
- Non creare tag.
- Non cancellare file da `docs/tasks/queue`.
- Non toccare workflow n8n non target.
- Procedere passo passo in n8n.
- Leggere il template da repo prima di `Build Cursor prompt`, oppure inserire un nodo equivalente che renda disponibile il contenuto del template al nodo di build.
- Sostituire i segnaposto mantenendo la struttura del template.
- Mantenere invariati i campi già validati: `task_name`, `task_path`, `cursor_prompt_path`, `session_path`, `next_action`.
- Dopo la modifica, fare un test con un task controllato e verificare che il prompt generato sia identico nella struttura al template, con variabili compilate.

## Constraints

- Nessuna modifica al codice applicativo.
- Nessun deploy Apps Script.
- Nessun tag o rollback.
- Nessuna delete da queue.
- Nessun export JSON n8n committato.
- Commit selettivo, no git add .
- Lavoro su branch main.

## Checks

- Test n8n manuale sul workflow target.
- Verifica visiva del prompt generato.
- `git diff --check` per la documentazione.
- `git status --short`.

## Deploy policy

none

## Expected output

- Workflow n8n target aggiornato manualmente e validato.
- Documentazione aggiornata in `docs/automation/n8n-workflows/`.
- Sessione dedicata in `docs/sessions/`.
- Nessuna modifica app.
- Nessun deploy/tag.
- Nessuna delete da queue.
- Riepilogo finale standard con hash commit e stato Git.

## Manual test gate

required: validazione manuale in n8n del prompt generato dal template letto dal repo.
