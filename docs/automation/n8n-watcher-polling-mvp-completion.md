# Fase 2 — Watcher/Polling MVP: Completamento e Validazione

**Data di chiusura:** 2026-05-12
**Status:** Completata e validata

## Dichiarazione di completamento

La **Fase 2 watcher/polling MVP** del progetto di automazione Alina Lavoro è da considerare
**completata e validata**. Il queue reader n8n è operativo come polling automatico end-to-end.

## Evidenze di validazione

### Task 0115 — Attivazione Schedule Trigger (2026-05-12)

- Schedule Trigger aggiunto direttamente al workflow `TEST - GitHub list Alina task queue`.
- Intervallo: ogni 5 minuti. Timezone: `Europe/Berlin`.
- Workflow pubblicato come versione `queue-reader-schedule-5min` e attivato.
- Nodo Execute Workflow inverso spurio rimosso; grafo ripristinato — tre trigger puliti → `List files`.
- **Primo tick automatico validato:** `has_task:false` silenzioso, nessuna scrittura GitHub.
- Manual Trigger e "When Executed by Another Workflow" mantenuti invariati.
- Sessione: `docs/sessions/2026-05-12-n8n-queue-reader-direct-schedule-trigger-validation.md`

### Task 0116 — Validazione ciclo has_task:true (2026-05-12)

Task docs-only minimale (`0116-n8n-queue-reader-has-task-true-scheduled-polling-validation.md`)
pushato in `docs/tasks/queue/` per testare il ramo `has_task:true`.

| Artefatto generato da n8n | Commit | Timestamp |
|---------------------------|--------|-----------|
| Sessione automation | `bbef5d7` | 2026-05-12 05:50:53 +0200 |
| Cursor prompt in processing | `cb75002` | 2026-05-12 05:50:54 +0200 |

- **Ciclo `has_task:true`:** n8n ha selezionato il task entro 5 minuti dal push. **OK**
- **File generati:** sessione automation e cursor prompt coerenti con il task. **OK**
- **Anti-doppio-run:** run successivi hanno saltato il task (skip su `processing/`,
  `has_task:false` silenzioso). **OK**
- **Nessun runner automatico attivato.** Nessuna modifica app. **OK**
- Sessione: `docs/sessions/2026-05-12-n8n-queue-reader-has-task-true-scheduled-polling-validation.md`

## Stato architetturale corrente

### Queue reader

- **Workflow n8n:** `TEST - GitHub list Alina task queue`
- **Versione pubblicata:** `queue-reader-schedule-5min`
- **Trigger attivi:**
  - Schedule Trigger — ogni 5 minuti, Europe/Berlin (attivo come polling automatico)
  - Manual Trigger — invariato
  - When Executed by Another Workflow — invariato
- **Flusso principale:** tutti i trigger → `List files` → `List processing files` →
  `List done files` → `List failed files` → `Filter first queued task` → IF has_task

### Lifecycle task validato end-to-end

| Stato | Cartella | Skip nel queue reader | Validato |
|-------|----------|-----------------------|----------|
| In coda | `docs/tasks/queue/` | — (eleggibile) | ✓ |
| In elaborazione | `docs/tasks/processing/` | skip se `{task}-cursor-prompt.md` esiste | ✓ |
| Completato | `docs/tasks/done/` | skip se `{task}.md` esiste | ✓ |
| Fallito | `docs/tasks/failed/` | skip se `{task}.md` esiste | ✓ |

### Runner

- **Runner automatico:** non attivo. Nessun Claude Code CLI / Cursor CLI sul VPS.
- **Runner corrente:** supervisionato/manuale — n8n genera il cursor prompt, l'utente o
  l'orchestratore esegue Claude Code localmente.
- **App Alina V1.9.2:** stabile, deploy `@24`, tag `v1.9.2-stable`. Non toccata.

### Watcher separato

- `Alina watcher - Schedule queue reader`: esiste in n8n, non pubblicato, non attivo come polling.
- Il queue reader con Schedule Trigger integrato ha reso il watcher separato non necessario
  per la fase corrente.

## Criteri Fase 2 soddisfatti

| Criterio | Status |
|----------|--------|
| Trigger automatico operativo (Schedule Trigger) | ✓ completato (task 0115) |
| Ciclo `has_task:false` silenzioso | ✓ validato (task 0115) |
| Ciclo `has_task:true` → genera processing + sessione | ✓ validato (task 0116) |
| Anti-doppio-run su `processing/` | ✓ validato (task 0116) |
| Skip su `done/` | ✓ validato (task 0103, 0116) |
| Skip su `failed/` | ✓ validato (task 0107) |
| Nessun runner automatico attivato | ✓ (invariato) |
| Nessuna modifica app Alina | ✓ (invariato) |

## Prossimo passo: Fase 3

La Fase 3 runner documentale è futura. Il documento di design è in
`docs/automation/runner-phase3-design.md`.

**Gate manuale obbligatorio:** l'orchestratore deve approvare il design della Fase 3 prima
di qualsiasi implementazione runtime.
