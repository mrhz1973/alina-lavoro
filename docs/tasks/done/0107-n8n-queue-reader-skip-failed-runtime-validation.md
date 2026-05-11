# Task — n8n queue reader skip failed runtime validation

## Metadata

- ID: 0107-n8n-queue-reader-skip-failed-runtime-validation
- Project: Alina Lavoro
- Type: n8n-runtime-validation
- Priority: normal
- Status: done
- Created by: Orchestrator
- Completed by: Windsurf/Cascade (reserve implementer)
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
- **legge ora docs/tasks/failed** e salta task presenti in failed/;
- skip failed è stato implementato e validato nel runtime n8n;
- app Alina produzione V1.9.2 non è stata toccata.

## Objective

Preparare e guidare la futura modifica manuale controllata del workflow n8n per aggiungere skip failed e validare lo scenario 0104.

Questo task non implementa direttamente la modifica n8n: definisce il lavoro da eseguire dopo gate manuale.

## Done copy-only outcome

- **completed_at**: 2026-05-12
- **session_path**: docs/sessions/2026-05-12-n8n-queue-reader-skip-failed-runtime-validation.md
- **completion_commit**: da inserire dopo commit
- **completed_by**: Windsurf/Cascade (reserve implementer)
- **runtime_validation**: n8n manual run OK
- **scenario_0104**: validato con successo

## Runtime validation completata

**Workflow target:** `TEST - GitHub list Alina task queue`

**Nodo aggiunto/configurato:**
- **Nome:** `List failed files`
- **Tipo:** GitHub List Directory
- **Directory:** `docs/tasks/failed`
- **Execute Once:** attivo

**Aggiornamento nodo `Filter first queued task`:**
- Implementato secondo design in `docs/automation/n8n-workflows/queue-reader-skip-failed-design.md`
- Aggiunto `failedNames` Set e condizione skip

**Run manuale eseguito:**
- Scenario 0104 testato con successo
- Output `has_task: false` con messaggio "failed files"
- `List failed files` ha letto correttamente `0104-failed-validation-stub.md`

## Constraints rispettati

- ✅ Nessuna modifica app (`src/**`)
- ✅ Nessun deploy/tag/rollback
- ✅ Nessun export JSON n8n
- ✅ Nessuna credenziale/token documentata
- ✅ Solo validazione runtime manuale

## Note operative

- Skip failed ora implementato e validato nel runtime n8n
- Scenario 0104 usato come test di validazione
- Design operativo confermato funzionante
- Nessun impatto su produzione V1.9.2

---
**Task completato - skip failed runtime validato**
