# Task — n8n queue reader direct Schedule Trigger runtime activation

## Metadata

- ID: 0115-n8n-queue-reader-direct-schedule-trigger-runtime-activation
- Project: Alina Lavoro
- Type: n8n-runtime-activation
- Priority: normal
- Status: done
- Created by: Orchestrator
- Deploy: no

## Done status

- Completed by: utente (runtime n8n manuale) + Claude Code (documentazione)
- Completion date: 2026-05-12
- Session: `docs/sessions/2026-05-12-n8n-queue-reader-direct-schedule-trigger-validation.md`

### Evidence

1. Schedule Trigger aggiunto al queue reader `TEST - GitHub list Alina task queue` — intervallo 5 minuti, timezone `Europe/Berlin`. **Verificato.**
2. Manual Trigger e "When Executed by Another Workflow" ancora presenti nel queue reader. **Verificato.**
3. Nodo Execute Workflow inverso (residuo spurio — puntava al watcher) trovato nel queue reader e rimosso. Grafo ripristinato correttamente: tre trigger puliti → `List files`. **Verificato.**
4. Test manuale pre-pubblicazione superato — comportamento identico ai test precedenti (`has_task:false` silenzioso). **Verificato.**
5. Queue reader pubblicato come versione `queue-reader-schedule-5min` e attivato. **Verificato.**
6. Primo tick automatico osservato: `has_task:false` silenzioso, nessuna scrittura GitHub. **Verificato.**
7. Nessun runner automatico attivato. **Verificato.**
8. Nessuna modifica app Alina, nessun deploy, nessun tag, nessun rollback. **Verificato.**

### Stato dopo il task

- **Queue reader** `TEST - GitHub list Alina task queue`: attivo come polling automatico ogni 5 minuti.
- **Watcher** `Alina watcher - Schedule queue reader`: esiste in n8n, non pubblicato, non attivo come polling.
- Polling automatico operativo. Runner supervisionato/manuale invariato.
