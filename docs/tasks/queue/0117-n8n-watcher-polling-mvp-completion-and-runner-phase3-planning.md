# Task — n8n watcher polling MVP completion and runner phase3 planning

## Metadata

- ID: 0117-n8n-watcher-polling-mvp-completion-and-runner-phase3-planning
- Project: Alina Lavoro
- Type: docs-only
- Priority: normal
- Status: queued
- Created by: Orchestrator
- Deploy: no

## Context

### Stato raggiunto (Fase 2 — watcher/polling MVP)

**Task 0115** (2026-05-12): Schedule Trigger aggiunto direttamente al queue reader
`TEST - GitHub list Alina task queue`; workflow pubblicato come `queue-reader-schedule-5min`;
polling automatico ogni 5 minuti (Europe/Berlin) operativo.

**Task 0116** (2026-05-12): ciclo `has_task:true` del polling automatico validato end-to-end:
- n8n ha selezionato il task 0116 come eleggibile entro 5 minuti dal push.
- Sessione automation e cursor prompt generati correttamente in `docs/tasks/processing/` e
  `docs/sessions/automation-*`.
- Run successivo ha saltato il task (skip su `processing/`, `has_task:false` silenzioso).
- Anti-doppio-run confermato.

**Conclusione:** la Fase 2 watcher/polling MVP è da considerare validata lato queue reader.
Il polling automatico funziona end-to-end per i cicli `has_task:false` e `has_task:true`.

### Stato corrente n8n

- Queue reader `TEST - GitHub list Alina task queue` pubblicato come `queue-reader-schedule-5min`,
  attivo, Schedule Trigger ogni 5 minuti.
- Manual Trigger e "When Executed by Another Workflow" presenti e invariati.
- Watcher separato `Alina watcher - Schedule queue reader`: esiste in n8n, non pubblicato,
  non attivo come polling.
- Nessun runner automatico (Claude Code CLI / Cursor CLI) attivo.
- App Alina V1.9.2 stabile e non toccata.

## Objective

Consolidare documentalmente il completamento della Fase 2 watcher/polling MVP e produrre un
documento di design/decisione per la Fase 3 runner documentale, senza attivare alcun runtime
automatico.

Il documento di output deve:

1. Dichiarare la Fase 2 watcher/polling MVP completata e validata.
2. Descrivere lo stato architetturale corrente (queue reader con Schedule Trigger, lifecycle
   queue/processing/done/failed validato, runner manuale/supervisionato invariato).
3. Definire le opzioni candidate per la Fase 3 runner documentale (almeno: opzione VPS
   Claude Code CLI, opzione Cursor CLI, opzione runner GitHub Actions, confronto rischi/costi).
4. Identificare i gate manuali e i prerequisiti tecnici prima di qualsiasi implementazione
   runtime della Fase 3.
5. Non implementare alcun runner automatico in questo task.

## Requirements

- Nessuna modifica a `src/**`.
- Nessuna modifica a `gas-current/**`.
- Nessuna modifica a `.gas/**`.
- Nessuna modifica a `appsscript.json`.
- Nessuna modifica a `package.json`.
- Nessun deploy Apps Script.
- Nessun tag.
- Nessun rollback.
- Nessun runner automatico Claude Code CLI / Cursor CLI attivato.
- Nessun export JSON n8n non redatto.
- Nessuna credenziale, token o URL raw sensibile.
- Gate manuale obbligatorio prima di qualsiasi implementazione runtime n8n/VPS/CLI.
- La Fase 3 runner documentale resta futura: questo task produce solo design/decisione.

## Expected output

- `docs/automation/n8n-watcher-polling-mvp-completion.md` (o path equivalente sotto `docs/automation/`)
  che dichiari la Fase 2 completata con evidenze (task 0115, 0116, commit n8n).
- `docs/automation/runner-phase3-design.md` (o path equivalente) con:
  - opzioni candidate per la Fase 3 runner documentale;
  - confronto rischi/costi/complessità per ciascuna opzione;
  - prerequisiti tecnici e gate manuali prima dell'implementazione;
  - scelta raccomandata con motivazione, o lista di domande da rispondere prima di scegliere.
- Aggiornamento `docs/PROJECT_STATE.md` e `docs/CHECKPOINT.md` per riflettere il completamento
  della Fase 2 e lo stato "design in corso" della Fase 3.

## Manual validation notes

Questo task è puramente documentale. L'output atteso è un documento di design/decisione
che l'orchestratore (ChatGPT) valuterà prima di autorizzare qualsiasi implementazione runtime
della Fase 3.

Gate manuale obbligatorio: l'orchestratore deve approvare il documento di design della Fase 3
prima di creare qualsiasi task di tipo `n8n-runtime-*` o `vps-*` che attivi un runner automatico.

## Done criteria

Il task 0117 sarà completato solo quando:

1. Esiste un documento che dichiara la Fase 2 completata con evidenze.
2. Esiste un documento di design per la Fase 3 runner documentale.
3. Il documento di design è stato approvato dall'orchestratore (gate manuale).
4. Esiste un done marker in `docs/tasks/done/0117-n8n-watcher-polling-mvp-completion-and-runner-phase3-planning.md`.
5. `PROJECT_STATE.md` e `CHECKPOINT.md` sono aggiornati.
6. Nessuna modifica app, deploy, tag, rollback o runner automatico.
