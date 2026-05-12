# Task — n8n queue reader has_task true scheduled polling validation

## Metadata

- ID: 0116-n8n-queue-reader-has-task-true-scheduled-polling-validation
- Project: Alina Lavoro
- Type: n8n-runtime-validation
- Priority: normal
- Status: queued
- Created by: Orchestrator
- Deploy: no

## Context

Task 0115 ha attivato il polling automatico direttamente nel queue reader `TEST - GitHub list Alina task queue`.

Stato corrente:
- Schedule Trigger ogni 5 minuti attivo nel queue reader.
- Workflow pubblicato come `queue-reader-schedule-5min`.
- Primo tick automatico validato con `has_task:false`.
- Manual Trigger e "When Executed by Another Workflow" mantenuti.
- Nessun runner automatico attivo.
- App Alina V1.9.2 stabile e non toccata.

Questo task serve a validare il ciclo `has_task:true` del polling automatico già attivo, usando un task docs-only minimale e controllato.

## Objective

Validare che il polling automatico del queue reader gestisca correttamente un task eleggibile (`has_task:true`), generando i file attesi in `docs/tasks/processing/` e/o `docs/sessions/automation-*`, senza modificare app, deploy, tag, rollback o runner automatico.

## Requirements

- Usare un task docs-only minimale.
- Nessuna modifica a `src/**`.
- Nessuna modifica a `gas-current/**`.
- Nessuna modifica a `.gas/**`.
- Nessuna modifica a `appsscript.json`.
- Nessuna modifica a `package.json`.
- Nessun deploy Apps Script.
- Nessun tag.
- Nessun rollback.
- Nessun runner automatico Claude Code CLI / Cursor CLI.
- Nessun export JSON n8n non redatto.
- Nessuna credenziale, token o URL raw sensibile.
- Gate manuale/orchestratore prima di considerare riuscita la validazione runtime.
- Il successo del test non deve essere dichiarato solo perché il file task viene creato: deve essere verificato dopo il polling n8n.

## Expected output

Dopo il polling automatico, verificare e documentare:

1. Il queue reader seleziona questo task come eleggibile (`has_task:true`).
2. Viene generato il prompt/sessione atteso in `docs/tasks/processing/` e/o `docs/sessions/automation-*`.
3. Un secondo run successivo non riprocessa il task grazie allo skip su `processing/`.
4. Nessuna modifica app.
5. Nessun deploy.
6. Nessun tag.
7. Nessun rollback.
8. Nessun runner automatico attivato.
9. Sessione di validazione creata.
10. Stato finale documentato in `PROJECT_STATE.md` e `CHECKPOINT.md`.

## Manual validation notes

Questo task è intenzionalmente posizionato in `queue/` per far scattare il polling automatico `has_task:true`.

L'orchestratore deve eseguire `aggio` dopo il push e verificare su GitHub se n8n ha creato i file di processing/sessione. L'esecuzione runtime resta supervisionata.

## Done criteria

Il task 0116 sarà completato solo quando:

1. n8n ha processato il task con `has_task:true`.
2. I file generati da n8n sono presenti e coerenti.
3. Il secondo run non riprocessa il task.
4. Esiste un done marker in `docs/tasks/done/0116-n8n-queue-reader-has-task-true-scheduled-polling-validation.md`.
5. `PROJECT_STATE.md` e `CHECKPOINT.md` sono aggiornati.
6. Nessuna modifica app, deploy, tag, rollback o runner automatico.
