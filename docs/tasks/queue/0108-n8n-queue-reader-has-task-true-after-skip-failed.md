# Task — n8n queue reader has_task true after skip failed

## Metadata

- ID: 0108-n8n-queue-reader-has-task-true-after-skip-failed
- Project: Alina Lavoro
- Type: n8n-runtime-validation-planning
- Priority: normal
- Status: queued
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

## Objective

Preparare la futura validazione manuale n8n del ramo has_task:true dopo l'introduzione dello skip failed.

Il test dovrà verificare che un nuovo task in docs/tasks/queue/, senza corrispondenti file in processing/, done/ o failed/, venga selezionato dal queue reader.

## Runtime gate obbligatorio

Prima di toccare n8n runtime, l'operatore deve confermare esplicitamente il gate manuale.

Questo task non autorizza modifiche runtime automatiche, deploy, tag, rollback o modifiche app.

## Scope previsto per futura validazione manuale

Dopo gate manuale esplicito:

1. Creare o usare un task di test dedicato in docs/tasks/queue/.
2. Verificare che non esistano marker corrispondenti in:
   - docs/tasks/processing/
   - docs/tasks/done/
   - docs/tasks/failed/
3. Aprire n8n via tunnel locale.
4. Aprire workflow TEST - GitHub list Alina task queue.
5. Eseguire il workflow manualmente.
6. Verificare output Filter first queued task:
   - has_task: true
   - task_name coerente con il task di test
   - task_path in docs/tasks/queue/
7. Verificare che il ramo true prosegua correttamente verso generazione prompt/sessione come già validato nei test precedenti.
8. Non dichiarare validazione completata prima di output reale verificato.

## Vincoli

- Non modificare app.
- Non fare deploy Apps Script.
- Non creare tag.
- Non fare rollback.
- Non cancellare file da queue/.
- Non creare export JSON n8n non redatti.
- Non documentare token, credenziali o URL raw sensibili.
- Non mischiare questo test con modifiche al workflow runtime, salvo gate manuale separato.

## Allowed paths per la futura chiusura dopo validazione reale

Solo dopo validazione reale:

- docs/sessions/2026-05-12-n8n-queue-reader-has-task-true-after-skip-failed.md
- docs/automation/n8n-workflows/queue-reader.md
- docs/PROJECT_STATE.md
- docs/CHECKPOINT.md
- docs/tasks/done/0108-n8n-queue-reader-has-task-true-after-skip-failed.md

## Forbidden paths

- src/**
- gas-current/**
- .gas/**
- appsscript.json
- package.json
- export n8n non redatti
- file contenenti credenziali o token

## Done criteria futuro

Il task 0108 sarà completato solo quando:

- il test manuale n8n has_task:true sarà eseguito;
- output reale sarà verificato;
- documentazione sarà aggiornata;
- done marker sarà creato;
- commit selettivo e push saranno eseguiti;
- nessun deploy/tag/rollback sarà eseguito;
- app non sarà toccata.
