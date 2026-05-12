# Sessione — n8n Queue Reader Sub-workflow Trigger Validation (Task 0113)

**Data:** 2026-05-12
**Task:** 0113-n8n-queue-reader-subworkflow-prerequisite
**Tipo:** n8n-runtime-prerequisite
**Runner:** utente (verifica manuale in n8n)

## Obiettivo

Validare il prerequisito B1: aggiungere al queue reader il trigger "When Executed by Another Workflow" senza rompere il Manual Trigger esistente, e verificare che il workflow watcher possa richiamare il queue reader tramite Execute Workflow.

## Azioni eseguite in n8n

### Queue reader — `TEST - GitHub list Alina task queue`

- Aggiunto un secondo trigger: **"When Executed by Another Workflow"**.
- Modalità input: **Accept all data**.
- Il trigger ricevente è collegato allo stesso primo nodo del queue reader: **List files**.
- Il Manual Trigger esistente è rimasto presente e invariato.

### Workflow watcher — `Alina watcher - Schedule queue reader`

- Configurato: **Manual Trigger → Execute Workflow**.
- Il nodo Execute Workflow punta al queue reader tramite Workflow ID interno n8n.
- Il nodo Execute Workflow non mostra errori o triangoli rossi.

## Test manuale eseguito

- Il workflow watcher è stato eseguito manualmente.
- Esito: **tutto verde**.
- Nessun errore nei nodi.

## Verifica done criteria (task 0113)

| Criterio | Esito |
|----------|-------|
| Queue reader eseguibile manualmente (Manual Trigger) | **OK** — trigger manuale presente e intatto |
| Queue reader selezionabile da Execute Workflow nel watcher | **OK** — Workflow ID configurato, nessun errore |
| Watcher richiama queue reader in test manuale senza errori | **OK** — test manuale tutto verde |
| `has_task: false` silenzioso | **N/A** — non verificato in questo ciclo; comportamento già validato nei task precedenti (0108) e invariato |
| Nessun runner automatico attivato | **OK** — nessun Schedule Trigger aggiunto |
| Watcher non pubblicato come polling automatico | **OK** — watcher non attivato |

## Cosa NON è stato fatto

- Nessun Schedule Trigger aggiunto al watcher.
- Nessuna pubblicazione/attivazione del watcher come polling automatico.
- Nessun runner automatico (Claude Code CLI / Cursor CLI) — fuori scope.
- Nessuna modifica app Alina, src/**, gas-current/**, .gas/**, appsscript.json, package.json.
- Nessun deploy Apps Script.
- Nessun tag.
- Nessun rollback.
- Nessun export JSON n8n.

## Stato post-task 0113

- Il prerequisito B1 è validato: queue reader richiamabile da Execute Workflow del watcher.
- Il trigger manuale del queue reader resta disponibile per run manuali.
- Il watcher esiste in n8n ma non è attivo come polling (nessun Schedule Trigger, non pubblicato).
- L'architettura Opzione B del design 0112 è ora implementabile.

## Prossimo passo

**Non** il runner documentale automatico (Claude Code CLI / Cursor CLI) — quello resta fuori scope e futuro.

Il prossimo passo corretto è un task dedicato per attivare il watcher con **Schedule Trigger** ogni 5 minuti, con gate manuale separato, secondo il design in `docs/automation/n8n-watcher-schedule-trigger-design.md` (Sezioni 2–7).

Sequenza corretta:
1. Task 0114 (prossimo): attivare il watcher con Schedule Trigger — gate manuale, test ciclo has_task:false, test ciclo has_task:true.
2. Task futuro: runner documentale automatico (Claude Code CLI / Cursor CLI sul VPS).
