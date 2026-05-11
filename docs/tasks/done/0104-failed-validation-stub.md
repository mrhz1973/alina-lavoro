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

## Done status

- Completed by: Claude Code runner
- Completion commit: dec7f28
- Completed at: 2026-05-12
- Outcome: failed stub documentale creato in docs/tasks/failed/0104-failed-validation-stub.md con sezione ## Failed status; sessione docs/sessions/2026-05-12-failed-validation-stub.md creata; documenti automazione aggiornati minimalmente; nessuna modifica app, n8n runtime, deploy, tag o rollback
- Session: docs/sessions/2026-05-12-failed-validation-stub.md
- Notes:
  - Done marker creato per prevenire ri-selezione da queue reader (skip done validato; skip failed non ancora validato).
  - Failed stub in docs/tasks/failed/0104-failed-validation-stub.md è il marker documentale principale.
  - Queue file (docs/tasks/queue/0104-failed-validation-stub.md) intenzionalmente non cancellato.
  - No app changes.
  - No n8n runtime changes.
