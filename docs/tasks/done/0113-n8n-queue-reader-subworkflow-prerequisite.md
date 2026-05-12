# Task — n8n queue reader sub-workflow prerequisite

## Metadata

- ID: 0113-n8n-queue-reader-subworkflow-prerequisite
- Project: Alina Lavoro
- Type: n8n-runtime-prerequisite
- Priority: normal
- Status: done
- Created by: Orchestrator
- Deploy: no

## Done status

- Completed by: utente (verifica manuale in n8n)
- Completion date: 2026-05-12
- Session: `docs/sessions/2026-05-12-n8n-queue-reader-subworkflow-trigger-validation.md`

### Evidence

- Trigger "When Executed by Another Workflow" aggiunto al queue reader `TEST - GitHub list Alina task queue` come secondo trigger; collegato al nodo `List files`; modalità `Accept all data`.
- Manual Trigger del queue reader rimasto presente e invariato.
- Workflow watcher `Alina watcher - Schedule queue reader` configurato con Manual Trigger → Execute Workflow puntato al queue reader tramite Workflow ID interno n8n.
- Nodo Execute Workflow senza errori/triangoli rossi.
- Test manuale del watcher: tutto verde.
- Prerequisito B1 validato: queue reader richiamabile da Execute Workflow del watcher.
- Nessun Schedule Trigger aggiunto. Watcher non pubblicato/attivato come polling.
- Nessun runner automatico.
- Nessuna modifica app, src/**, gas-current/**, deploy, tag, rollback.
