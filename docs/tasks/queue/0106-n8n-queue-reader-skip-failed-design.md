# Task — n8n queue reader skip failed design

## Metadata

- ID: 0106-n8n-queue-reader-skip-failed-design
- Project: Alina Lavoro
- Type: n8n-design
- Priority: normal
- Status: queued
- Created by: Orchestrator
- Deploy: no

## Context

Task 0104 ha creato uno stub documentale `failed` intenzionale:

- `docs/tasks/failed/0104-failed-validation-stub.md`
- `docs/tasks/done/0104-failed-validation-stub.md`
- `docs/sessions/2026-05-12-failed-validation-stub.md`

Il formato `## Failed status` è ora documentato, ma lo skip `failed` nel queue reader n8n non è ancora implementato né validato.

Stato reale documentato:

- il queue reader attuale legge `docs/tasks/queue`;
- legge `docs/tasks/processing`;
- legge `docs/tasks/done`;
- salta task con prompt già in `processing`;
- salta task con marker già in `done`;
- NON legge ancora `docs/tasks/failed` come condizione di skip;
- lo skip `failed` deve essere progettato e poi validato in un micro-step manuale separato.

## Objective

Preparare la modifica controllata del workflow n8n `TEST - GitHub list Alina task queue` per aggiungere lo skip `failed`, senza eseguire subito la modifica runtime.

Questo task deve produrre una progettazione operativa chiara per il passo successivo manuale in n8n.

## Required design output

Quando eseguito, questo task deve creare o aggiornare documentazione che definisca:

1. Quale nodo n8n aggiungere o modificare per leggere `docs/tasks/failed`.
2. Come impostare `Execute Once` sul nuovo nodo, coerentemente con `List processing files` e `List done files`.
3. Come modificare il nodo `Filter first queued task` per costruire `failedNames`.
4. Come saltare un task se esiste `docs/tasks/failed/{task}.md`.
5. Come mantenere invariati gli skip già validati `processing` e `done`.
6. Come validare manualmente:
   - scenario 0104: deve essere saltato perché ha `done` e `failed` marker;
   - scenario futuro senza marker: deve restare eleggibile;
   - scenario nessun task eleggibile: ramo `false/no_action` atteso.
7. Come documentare esplicitamente che lo skip `failed` diventa validato solo dopo run n8n manuale riuscito.

## Files allowed for execution

- docs/automation/n8n-workflows/queue-reader-skip-failed-design.md
- docs/automation/n8n-workflows/queue-reader.md
- docs/automation/n8n-workflows/lifecycle-ownership.md
- docs/automation/n8n-workflows/done-failed-design.md
- docs/automation/n8n-workflows/task-lifecycle.md
- docs/CHECKPOINT.md
- docs/PROJECT_STATE.md
- docs/sessions/2026-05-12-n8n-queue-reader-skip-failed-design.md
- docs/tasks/done/0106-n8n-queue-reader-skip-failed-design.md

## Files forbidden for execution

- src/**
- gas-current/**
- .gas/**
- appsscript.json
- package.json
- docs/tasks/failed/**
- workflow n8n runtime
- export JSON n8n non redatto
- credenziali/token/URL raw con token
- deploy Apps Script
- tag Git
- rollback

## Constraints

- Questo task è design/documentazione soltanto.
- Non modificare n8n runtime in questo task.
- Non eseguire n8n in questo task.
- Non dichiarare lo skip failed validato.
- Non cancellare file da `queue/`.
- Non creare nuovi marker `failed/`.
- Usare commit selettivo, mai `git add .`.

## Expected output

- Documento design skip failed creato.
- Documenti correlati aggiornati in modo minimo.
- Task 0106 marcato done copy-only.
- Stato progetto/checkpoint aggiornati in modo minimo.
- Nessuna modifica app.
- Nessuna modifica n8n runtime.
- Nessun deploy/tag/rollback.

## Manual test gate

Not required for this design task.

Il test manuale n8n sarà un task successivo separato.
