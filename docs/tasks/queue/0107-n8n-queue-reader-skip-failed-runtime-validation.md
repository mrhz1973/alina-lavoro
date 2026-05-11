# Task — n8n queue reader skip failed runtime validation

## Metadata

- ID: 0107-n8n-queue-reader-skip-failed-runtime-validation
- Project: Alina Lavoro
- Type: n8n-runtime-validation
- Priority: normal
- Status: queued
- Created by: Orchestrator
- Deploy: no

## Context

Task 0104 ha creato uno stub documentale failed intenzionale:

- docs/tasks/failed/0104-failed-validation-stub.md
- docs/tasks/done/0104-failed-validation-stub.md
- docs/sessions/2026-05-12-failed-validation-stub.md

Task 0106 ha creato il design operativo per aggiungere lo skip failed al queue reader:

- docs/automation/n8n-workflows/queue-reader-skip-failed-design.md

Stato reale attuale:

- il workflow n8n target è TEST - GitHub list Alina task queue;
- il queue reader legge già docs/tasks/queue;
- legge già docs/tasks/processing;
- legge già docs/tasks/done;
- salta task già presenti in processing;
- salta task già presenti in done;
- NON legge ancora docs/tasks/failed come condizione di skip;
- skip failed NON è ancora implementato né validato nel runtime n8n;
- app Alina produzione V1.9.2 non deve essere toccata.

## Objective

Preparare e guidare la futura modifica manuale controllata del workflow n8n per aggiungere skip failed e validare lo scenario 0104.

Questo task non implementa direttamente la modifica n8n: definisce il lavoro da eseguire dopo gate manuale.

## Runtime gate obbligatorio

Prima di toccare n8n runtime, l'operatore deve confermare esplicitamente il gate manuale.

Il task non autorizza modifiche runtime automatiche, deploy, tag, rollback o modifiche app.

## Scope previsto per la futura validazione manuale

Dopo gate manuale esplicito:

1. Aprire n8n via tunnel locale.
2. Aprire il workflow TEST - GitHub list Alina task queue.
3. Aggiungere il nodo List failed files.
4. Configurarlo come GitHub List Directory su:
   docs/tasks/failed
5. Impostare Execute Once.
6. Aggiornare il nodo Filter first queued task secondo:
   docs/automation/n8n-workflows/queue-reader-skip-failed-design.md
7. Testare lo scenario 0104.
8. Verificare che 0104 venga saltato perché presente in failed/.
9. Verificare il ramo false/no_action.
10. Dichiarare skip failed validato solo dopo run n8n riuscito e output verificato.

Non mischiare in questo task un test has_task true con task nuovo senza marker. Se serve quel test, creare un task separato futuro.

## Allowed paths per la futura chiusura dopo validazione reale

Solo dopo validazione reale n8n:

- docs/sessions/2026-05-12-n8n-queue-reader-skip-failed-runtime-validation.md
- docs/automation/n8n-workflows/queue-reader.md
- docs/automation/n8n-workflows/lifecycle-ownership.md
- docs/PROJECT_STATE.md
- docs/CHECKPOINT.md
- docs/tasks/done/0107-n8n-queue-reader-skip-failed-runtime-validation.md

## Forbidden paths

- src/**
- gas-current/**
- .gas/**
- appsscript.json
- package.json
- qualunque file contenente credenziali
- export n8n non redatti

## Done criteria del task 0107

Il task 0107 sarà considerato completato solo quando:

- skip failed sarà implementato nel workflow runtime n8n;
- run manuale su scenario 0104 sarà completato;
- output sarà verificato;
- documentazione sarà aggiornata;
- done marker sarà creato;
- commit selettivo e push saranno eseguiti;
- nessun deploy/tag/rollback sarà eseguito;
- app non sarà toccata.

## Note operative

Il design fonte è:

docs/automation/n8n-workflows/queue-reader-skip-failed-design.md

Lo skip failed non deve essere dichiarato validato prima di un run reale n8n riuscito.

---
