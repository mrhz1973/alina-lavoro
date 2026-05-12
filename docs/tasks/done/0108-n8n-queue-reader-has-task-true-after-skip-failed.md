# Task — n8n queue reader has_task true after skip failed

## Metadata

- ID: 0108-n8n-queue-reader-has-task-true-after-skip-failed
- Project: Alina Lavoro
- Type: n8n-runtime-validation-planning
- Priority: normal
- Status: done
- Created by: Orchestrator
- Deploy: no

## Context

Task 0107 ha validato runtime lo skip failed nel workflow n8n:

- Workflow: TEST - GitHub list Alina task queue
- Queue reader ora legge queue/, processing/, done/ e failed/
- Skip processing validato
- Skip done validato
- Skip failed validato con scenario 0104
- Sessione: docs/sessions/2026-05-12-n8n-queue-reader-skip-failed-runtime-validation.md

Dopo questa modifica serve un test separato per confermare che il ramo has_task:true continui a funzionare con un task nuovo privo di marker.

## Done status

- Completed by: Claude Code (documentazione) + n8n (runtime)
- Completion date: 2026-05-12
- Session: docs/sessions/2026-05-12-n8n-queue-reader-has-task-true-after-skip-failed.md
- Automation session: docs/sessions/automation-0108-n8n-queue-reader-has-task-true-after-skip-failed.md

**Evidence:**

- n8n primo run: `has_task: true` — task 0108 selezionato correttamente da queue
- Prompt Cursor generato in: `docs/tasks/processing/0108-n8n-queue-reader-has-task-true-after-skip-failed-cursor-prompt.md`
- n8n secondo run: `has_task: false` — skip processing anti-doppio-run confermato
- Nessuna regressione rilevata dopo introduzione skip failed

**Outcome:** ramo has_task:true validato; anti-doppio-run confermato; nessuna modifica app, nessun deploy/tag/rollback.
