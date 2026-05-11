# Task — Failed validation stub

## Metadata

- ID: 0104-failed-validation-stub
- Project: Alina Lavoro
- Type: n8n-validation-planning
- Priority: normal
- Status: queued
- Created by: Orchestrator
- Deploy: no

## Context

Task 0103 ha creato la fonte canonica `docs/automation/n8n-workflows/lifecycle-ownership.md` e ha marcato done il task 0103 in modalità copy-only.

Stato reale:
- queue reader legge `docs/tasks/queue`;
- queue reader legge `docs/tasks/processing`;
- queue reader legge `docs/tasks/done`;
- skip `processing` validato;
- skip `done` validato;
- `docs/tasks/done/0103-lifecycle-ownership-design.md` esiste;
- failed handling è documentato ma non validato;
- il queue reader attuale non deve essere considerato capace di saltare `failed/{task}.md` finché non viene modificato e validato esplicitamente.

## Objective

Preparare una validazione manuale controllata del pattern `failed`, come task separato successivo al lifecycle ownership design.

La validazione dovrà dimostrare, in un micro-step futuro, come un task fallito viene tracciato in `docs/tasks/failed/{task}.md` con `failure_reason`, senza perdita dati e senza fire-and-forget.

## Intended future validation

Questo task, quando eseguito in un passaggio successivo, dovrà portare a:

1. definire il contenuto atteso di un file failed copy-only;
2. creare un file failed stub per un task di prova;
3. aggiornare una sessione di validazione;
4. verificare se il queue reader deve essere esteso per leggere `docs/tasks/failed`;
5. solo dopo modifica esplicita e validazione n8n, documentare lo skip failed come validato.

## Files allowed for future execution

- docs/tasks/failed/0104-failed-validation-stub.md
- docs/sessions/2026-05-11-failed-validation-stub.md
- docs/automation/n8n-workflows/lifecycle-ownership.md
- docs/automation/n8n-workflows/done-failed-design.md
- docs/automation/n8n-workflows/task-lifecycle.md
- docs/automation/n8n-workflows/queue-reader.md
- docs/CHECKPOINT.md
- docs/PROJECT_STATE.md

## Files forbidden for future execution

- src/**
- gas-current/**
- .gas/**
- appsscript.json
- package.json
- deploy Apps Script
- tag Git
- rollback
- export JSON n8n non redatto
- credenziali/token/URL raw con token

## Requirements for future execution

- Non cancellare file da `queue/`.
- Usare copy-only.
- Il file failed deve contenere una sezione `## Failed status`.
- Il file failed deve contenere almeno:
  - failed_at;
  - failed_by;
  - failure_reason;
  - session_path;
  - evidence;
  - retry_policy;
  - note che il file queue resta intenzionalmente presente.
- Nessun deploy.
- Nessun tag.
- Nessun rollback.
- Nessuna modifica app.
- Nessun fire-and-forget.

## Constraints

- Questo task è solo preparazione della validazione failed.
- La validazione failed non è parte della creazione di questo file.
- La modifica al workflow n8n, se necessaria, sarà un micro-step separato e manuale.
- Ogni passaggio n8n deve rispettare il vincolo passo passo di `docs/ORCHESTRATOR_RULES.md`.

## Checks for this task creation

- git diff --check
- git diff --stat
- git status --short
- nessun file sotto docs/tasks/failed/
- nessun file sotto docs/tasks/done/
- nessuna modifica app
- nessuna modifica n8n runtime

## Deploy policy

none

## Expected output

- Task 0104 creato in queue.
- Nessuna validazione failed eseguita.
- Nessun file in failed creato.
- Nessuna modifica n8n runtime.
- Nessuna modifica app.
- Commit selettivo e push su main.

## Manual test gate

not required for task creation.
