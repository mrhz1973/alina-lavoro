# Sessione — n8n Queue Reader Direct Schedule Trigger Validation (Task 0115)

**Data:** 2026-05-12
**Task:** 0115-n8n-queue-reader-direct-schedule-trigger-runtime-activation
**Tipo:** n8n-runtime-activation (completato)
**Runner:** utente (verifica manuale in n8n)

## Obiettivo

Aggiungere Schedule Trigger ogni 5 minuti direttamente nel workflow `TEST - GitHub list Alina task queue` (Opzione B controllata, dopo blocco publish task 0114), pubblicare il workflow e verificare il primo tick automatico `has_task:false` silenzioso.

## Contesto architetturale

Task 0114 bloccato: il watcher separato non poteva essere pubblicato perché n8n richiedeva che il sub-workflow (queue reader) fosse pubblicato, ma il queue reader non era pubblicabile ("This workflow has no trigger nodes that require publishing"). Opzione A investigata (2026-05-12) — nessuna leva UI trovata. Decisione: Opzione B controllata (Opzione A del design originale 0112) — Schedule Trigger direttamente nel queue reader.

## Azioni eseguite in n8n

### Step 1 — Gate manuale

- Nessun workflow n8n in esecuzione al momento delle modifiche.
- Workflow `TEST - GitHub list Alina task queue` aperto in modalità edit.

### Step 2 — Aggiunta Schedule Trigger

- Aggiunto nodo **Schedule Trigger** al workflow `TEST - GitHub list Alina task queue`.
  - Intervallo: ogni 5 minuti.
  - Timezone: `Europe/Berlin`.
- Il Manual Trigger è rimasto presente e invariato.
- Il trigger "When Executed by Another Workflow" è rimasto presente e invariato.
- Il nodo Schedule Trigger non mostrava errori dopo l'aggiunta.

### Scoperta — nodo Execute Workflow inverso nel queue reader

Durante l'ispezione del workflow prima della pubblicazione, è stato rilevato un nodo **Execute Workflow** spurio nel queue reader che puntava **al watcher** (`Alina watcher - Schedule queue reader`). Questo nodo era stato introdotto per errore in una sessione precedente e non era parte del design previsto.

**Azione:** il nodo Execute Workflow inverso è stato **rimosso** dal queue reader.

**Stato del grafo dopo la rimozione:** tre trigger puliti convergono sullo stesso nodo `List files`:
- Manual Trigger → List files
- When Executed by Another Workflow → List files
- Schedule Trigger → List files

### Step 3 — Test manuale pre-pubblicazione

- Eseguito il workflow tramite **Manual Trigger** dopo l'aggiunta del Schedule Trigger e la rimozione del nodo inverso.
- Esito: **tutto verde** — comportamento identico ai test precedenti.
- Nessun errore, nessuna scrittura GitHub, nessun log rumoroso.

### Step 4 — Pubblicazione del queue reader

- Cliccato **Publish** sul workflow `TEST - GitHub list Alina task queue`.
- Pubblicazione riuscita.
- Versione pubblicata: **`queue-reader-schedule-5min`**.
- Workflow attivato (toggle Active/On).

### Step 5 — Primo tick automatico

- Atteso il primo tick del Schedule Trigger.
- Esito: **successo** — il run automatico è terminato silenziosamente con `has_task:false`.
- Nessuna scrittura GitHub (nessun commit su `docs/tasks/processing/` o `docs/sessions/`).
- Nessun log rumoroso o notifiche indesiderate.

## Stato lasciato in n8n

- **Queue reader** `TEST - GitHub list Alina task queue`: Manual Trigger + "When Executed by Another Workflow" + Schedule Trigger (5 min, Europe/Berlin) — **pubblicato** come `queue-reader-schedule-5min`, **attivo** come polling automatico.
- **Watcher** `Alina watcher - Schedule queue reader`: Manual Trigger + Schedule Trigger (5 min, Europe/Berlin) + Execute Workflow → queue reader — **non pubblicato, non attivo come polling**. Il watcher esiste in n8n ma non partecipa al ciclo automatico in questa fase.
- Polling automatico attivo: queue reader con Schedule Trigger.
- Nessun runner automatico (Claude Code CLI / Cursor CLI).
- Nessuna modifica app Alina, nessuna modifica `src/**`, nessun deploy, nessun tag, nessun rollback.

## Conferma done criteria

1. Schedule Trigger aggiunto al queue reader con intervallo 5 minuti e timezone `Europe/Berlin`. **OK**
2. Manual Trigger e "When Executed by Another Workflow" ancora presenti nel queue reader. **OK**
3. Test manuale pre-pubblicazione superato (comportamento identico ai test precedenti). **OK**
4. Queue reader pubblicato e attivo con Schedule Trigger. **OK** (versione `queue-reader-schedule-5min`)
5. Almeno un tick automatico osservato con esito `has_task:false` silenzioso e nessuna scrittura GitHub. **OK**
6. Nessun runner automatico attivato. **OK**
7. Nessuna modifica app, deploy, tag, rollback. **OK**

## Nota architetturale

Il nodo Execute Workflow inverso trovato nel queue reader era un residuo di una sessione di esplorazione precedente (probabilmente task 0113 o sessione n8n di debug). La sua rimozione ha ripristinato il grafo al design corretto. Il watcher `Alina watcher - Schedule queue reader` resta in n8n con il suo Execute Workflow che punta al queue reader — questo è corretto e invariato; non è stato toccato.

## Prossimo passo consigliato

Validare il ciclo `has_task:true` con un task docs-only minimale di test in coda — da eseguire come task separato con gate manuale esplicito e approvazione dell'orchestratore. Il polling automatico è ora operativo e stabile per il ciclo `has_task:false`.
