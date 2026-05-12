# Sessione — Completamento Fase 2 watcher/polling MVP e design Fase 3 runner (Task 0117)

**Data:** 2026-05-12
**Task:** 0117-n8n-watcher-polling-mvp-completion-and-runner-phase3-planning
**Tipo:** docs-only (completato)
**Runner:** Claude Code

## Obiettivo

Consolidare documentalmente il completamento della Fase 2 watcher/polling MVP e produrre
il documento di design/decisione per la Fase 3 runner documentale, senza attivare alcun
runtime automatico.

## Stato iniziale

- Task 0115 completato: polling automatico attivato nel queue reader (`queue-reader-schedule-5min`).
- Task 0116 completato: ciclo `has_task:true` validato end-to-end (n8n → processing → skip anti-doppio-run).
- n8n aveva generato il cursor prompt per il task 0117 (commit `54e5410`, 2026-05-12 04:15 UTC).
- Nessun documento di completamento Fase 2 né documento di design Fase 3 esistenti.

## File prodotti

### 1. Documento di completamento Fase 2

**Path:** `docs/automation/n8n-watcher-polling-mvp-completion.md`

Contenuto:
- Dichiarazione formale di completamento della Fase 2 watcher/polling MVP.
- Evidenze: task 0115 (Schedule Trigger, primo tick `has_task:false`), task 0116
  (`has_task:true` → processing + sessione, commit `bbef5d7` e `cb75002`; anti-doppio-run).
- Stato architetturale corrente: queue reader `queue-reader-schedule-5min` con tre trigger
  (Schedule, Manual, When Executed by Another Workflow).
- Lifecycle task validato end-to-end (queue → processing → done → failed, tutti gli skip).
- Runner corrente: supervisionato/manuale. App Alina V1.9.2 non toccata.

### 2. Documento di design Fase 3 runner documentale

**Path:** `docs/automation/runner-phase3-design.md`

Contenuto:
- Contesto e obiettivo Fase 3 (esecuzione automatica task `docs-only` senza intervento umano).
- Quattro opzioni candidate:
  - **A — Claude Code CLI sul VPS** (SSH exec da n8n) — **raccomandata**
  - B — Cursor CLI sul VPS (headless) — non prioritaria
  - C — GitHub Actions runner — alternativa valida
  - D — Runner manuale (stato attuale) — invariato nella fase corrente
- Confronto rischi/costi/complessità per ciascuna opzione.
- Cinque domande gate per l'orchestratore (scope, frequenza, supervisione post-run,
  gestione errori, API key dedicata).
- Prerequisiti tecnici minimi per Opzione A.
- Gate manuali permanenti (deploy, tag, rollback, backend, Sheet, credenziali).
- Prossimo passo: orchestratore risponde alle domande gate, approva opzione, poi si crea
  task di tipo `n8n-runner-setup` o `vps-runner-setup`.

### 3. Done marker

**Path:** `docs/tasks/done/0117-n8n-watcher-polling-mvp-completion-and-runner-phase3-planning.md`

Creato con evidenze, riferimenti a tutti i file prodotti, stato dopo il task.

## Conferma vincoli

- Nessuna modifica a `src/**`. **OK**
- Nessuna modifica a `gas-current/**`. **OK**
- Nessuna modifica a `.gas/**`. **OK**
- Nessuna modifica a `appsscript.json`. **OK**
- Nessuna modifica a `package.json`. **OK**
- Nessun deploy Apps Script. **OK**
- Nessun tag. **OK**
- Nessun rollback. **OK**
- Nessun runner automatico Claude Code CLI / Cursor CLI attivato. **OK**
- Nessun export JSON n8n. **OK**
- Nessuna credenziale, token o URL raw sensibile. **OK**
- App Alina V1.9.2 stabile e non toccata. **OK**
- Fase 3 runner documentale: solo design prodotto, non implementata. **OK**

## Prossimo passo

L'orchestratore deve rispondere alle cinque domande gate in `docs/automation/runner-phase3-design.md`
prima di autorizzare qualsiasi task di tipo `n8n-runner-setup` o `vps-runner-setup` per
l'implementazione della Fase 3 runner documentale.
