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

## Failed status

- failed_at: 2026-05-12
- failed_by: Claude Code runner
- failure_reason: validation stub only; failed lifecycle marker created intentionally to document the expected failed-file format; this is not a real failure
- session_path: docs/sessions/2026-05-12-failed-validation-stub.md
- evidence: docs/tasks/queue/0104-failed-validation-stub.md — task originale in queue; docs/automation/n8n-workflows/lifecycle-ownership.md — formato atteso documentato
- retry_policy: do not retry by deleting this file unless explicitly instructed; future retry should use a new retry task or an explicit orchestrator decision
- notes:
  - Queue file (docs/tasks/queue/0104-failed-validation-stub.md) retained intentionally; no delete from queue.
  - No app changes, no n8n runtime changes, no deploy, no tag, no rollback.
  - Skip failed NOT validated in queue reader: this file alone does NOT prevent re-selection by the current queue reader.
  - docs/tasks/done/0104-failed-validation-stub.md created separately to prevent queue reader re-selection until skip-failed is implemented and validated.
