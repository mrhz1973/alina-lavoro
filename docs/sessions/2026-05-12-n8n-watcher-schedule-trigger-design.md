# Sessione — n8n Watcher Schedule Trigger Design (Task 0112)

**Data:** 2026-05-12
**Task:** 0112-n8n-watcher-schedule-trigger-design
**Tipo:** n8n-watcher-design (docs-only)
**Runner:** Claude Code (manuale, supervisionato)

## Obiettivo

Produrre il documento di design per l'integrazione del Schedule Trigger n8n come watcher automatico del queue reader, allineato al design MVP (task 0111), al runbook Fase 2 e a permissions.md.

## File prodotti

| File | Operazione |
|------|-----------|
| `docs/automation/n8n-watcher-schedule-trigger-design.md` | Creato |
| `docs/sessions/2026-05-12-n8n-watcher-schedule-trigger-design.md` | Questo file |
| `docs/tasks/done/0112-n8n-watcher-schedule-trigger-design.md` | Creato (done marker) |
| `docs/PROJECT_STATE.md` | Aggiornato |
| `docs/CHECKPOINT.md` | Aggiornato |

## Scelte architetturali principali

- **Opzione B scelta:** workflow watcher separato (Schedule Trigger + Execute Workflow → queue reader). Il workflow `TEST - GitHub list Alina task queue` non viene modificato — zero rischio di regressione sul workflow già validato.
- **Intervallo:** ogni 5 minuti, fuso orario `Europe/Berlin`.
- **Overlap:** mitigato dallo skip `processing/` già nel queue reader — nessun lock aggiuntivo necessario per MVP.
- **has_task:false:** silenzioso, nessuna scrittura GitHub (comportamento invariato).
- **has_task:true:** prompt + sessione generati dal queue reader via GitHub API; flusso si ferma — runner NON automatico.
- **Runner:** fuori scope, in task 0113.
- **Gate manuale:** obbligatorio prima di qualsiasi modifica al runtime n8n.

## Controlli eseguiti

- Nessuna modifica a `src/**`, `gas-current/**`, `appsscript.json`, `package.json`.
- Solo path consentiti dal task toccati.
- Task type: docs-only / n8n-watcher-design; Deploy: no.

## Esito

**Completato.** Documento di design creato, done marker creato, documenti aggiornati.

## Prossimo passo

Task 0113 (futuro): runner documentale automatico — Claude Code CLI o Cursor CLI sul VPS (gate manuale prima del primo run non supervisionato).
