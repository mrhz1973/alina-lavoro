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

## Runtime Discovery (2026-05-12, post-design)

Dopo la pubblicazione del design, l'utente ha eseguito una verifica manuale in n8n.

**Azioni eseguite:**
- Creato nuovo workflow `Alina watcher - Schedule queue reader` (non pubblicato, non eseguito).
- Aggiunto Manual Trigger e nodo Execute Sub-workflow.
- Tentata la selezione del queue reader `TEST - GitHub list Alina task queue` nel nodo Execute Sub-workflow.

**Osservazione:** il queue reader non compare come opzione selezionabile. Compare invece un riferimento non desiderato (`My Sub-Workflow 1`). Il workflow watcher è rimasto non pubblicato; Schedule Trigger non aggiunto; queue reader non modificato; nessuna modifica app/deploy/tag.

**Interpretazione:** il workflow `TEST - GitHub list Alina task queue` ha solo il Manual Trigger e non è configurato come sub-workflow richiamabile. In n8n, il nodo Execute Sub-workflow richiede che il target esponga un trigger "When executed by another workflow".

**Conseguenza:** Opzione B resta l'architettura desiderabile, ma richiede un prerequisito di configurazione nel runtime n8n prima di essere implementabile. Il design rimane valido come obiettivo. Dettaglio e opzioni di risoluzione documentati in `docs/automation/n8n-watcher-schedule-trigger-design.md` (Sezione 10).

**Documentazione aggiornata:** `docs/automation/n8n-watcher-schedule-trigger-design.md` (Sezione 10 aggiunta), `docs/PROJECT_STATE.md`, `docs/CHECKPOINT.md`, `docs/tasks/done/0112-n8n-watcher-schedule-trigger-design.md`.

## Prossimo passo

Task separato per analizzare il prerequisito sub-workflow (verificare versione n8n, scegliere tra B1/B2/B3, implementare con gate manuale). Solo dopo: creazione workflow watcher. Task 0113 (runner documentale) rimane successivo al completamento del watcher.
