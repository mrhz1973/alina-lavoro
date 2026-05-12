# Task — n8n queue reader direct Schedule Trigger runtime activation

## Metadata

- ID: 0115-n8n-queue-reader-direct-schedule-trigger-runtime-activation
- Project: Alina Lavoro
- Type: n8n-runtime-activation
- Priority: normal
- Status: queued
- Created by: Orchestrator
- Deploy: no

## Context

Task 0114 è bloccato: il watcher separato `Alina watcher - Schedule queue reader` non può essere pubblicato perché n8n richiede che il sub-workflow (queue reader) sia pubblicato, ma il queue reader non risulta pubblicabile ("This workflow has no trigger nodes that require publishing").

Opzione A investigata (2026-05-12): nessuna leva UI sicura per sbloccare il publish — impostazioni workflow del queue reader non espongono una voce per configurarlo come sub-workflow pubblicabile; il campo Source del nodo Execute Workflow mostra solo `Database` e `Define Below`; `Define Below` scartato (duplica il queue reader, rischio drift, export JSON non redatto).

**Decisione architetturale: Opzione B controllata.**

Aggiungere Schedule Trigger direttamente nel workflow `TEST - GitHub list Alina task queue`, mantenendo il Manual Trigger esistente e il trigger "When Executed by Another Workflow". Questa è l'Opzione A del design originale 0112, adottata per superare il vincolo di publish del watcher separato.

Il watcher separato `Alina watcher - Schedule queue reader` resta in n8n ma non viene pubblicato in questa fase.

Riferimenti: `docs/automation/n8n-watcher-schedule-trigger-design.md` (Sezione 1.1 Opzione A), `docs/sessions/2026-05-12-n8n-watcher-schedule-trigger-publish-blocked.md`.

## Objective

Aggiungere Schedule Trigger ogni 5 minuti direttamente nel workflow `TEST - GitHub list Alina task queue`, pubblicare il workflow, e verificare il comportamento `has_task:false` come primo ciclo automatico.

## Procedura

### Step 1 — Gate manuale (obbligatorio prima di qualsiasi modifica runtime)

1. Verificare che nessun workflow n8n sia in esecuzione al momento della modifica.
2. Aprire il workflow `TEST - GitHub list Alina task queue` in modalità edit.
3. Comunicare all'orchestratore che il gate è pronto. Attendere conferma prima di Step 2.

### Step 2 — Aggiunta Schedule Trigger nel queue reader

Nel workflow `TEST - GitHub list Alina task queue`:

1. Aggiungere un nodo **Schedule Trigger** con i seguenti parametri:
   - Intervallo: ogni 5 minuti.
   - Timezone: `Europe/Berlin` (o default istanza se il campo non è visibile / non modificabile).
2. Collegare il nodo Schedule Trigger allo stesso primo nodo già usato dagli altri trigger: **List files**.
3. **Non rimuovere** il Manual Trigger — deve restare disponibile per test manuali.
4. **Non rimuovere** il trigger "When Executed by Another Workflow" — salvo decisione futura separata motivata.
5. **Non pubblicare ancora** il workflow. Salvare solo.

### Step 3 — Test manuale pre-pubblicazione

Con il Schedule Trigger aggiunto ma il workflow non ancora pubblicato:

1. Eseguire il workflow tramite **Manual Trigger**.
2. Verificare che il comportamento sia identico ai test precedenti: `has_task: false` (coda vuota) silenzioso, oppure `has_task: true` con generazione prompt e sessione se c'è un task eleggibile.
3. Verificare che tutti i trigger (Manual, When Executed, Schedule) siano visibili e non mostrino errori.

Se il test manuale fallisce, **fermarsi** e non procedere con la pubblicazione. Riportare all'orchestratore l'errore.

### Step 4 — Pubblicazione del queue reader

Solo se Step 3 superato:

1. Cliccare **Publish** sul workflow `TEST - GitHub list Alina task queue`.
2. Verificare che la pubblicazione vada a buon fine (nessun errore — il queue reader ha ora un trigger Schedule che richiede pubblicazione).
3. Attivare il workflow (toggle Active/On).

### Step 5 — Osservazione primo tick automatico

Dopo l'attivazione:

1. Attendere il primo tick del Schedule Trigger (entro 5 minuti).
2. Osservare il log n8n: il run automatico deve terminare silenziosamente con `has_task: false`.
3. Verificare che nessuna scrittura GitHub sia avvenuta (nessun commit da n8n su `docs/tasks/processing/` o `docs/sessions/`).
4. Verificare assenza di log rumorosi o notifiche indesiderate.

Se il primo tick automatico è OK, il queue reader con Schedule Trigger è operativo come polling automatico.

### Step 6 — (Opzionale / gate separato) Verifica ciclo has_task:true

La verifica con un task docs-only di test in coda può avvenire solo con gate manuale esplicito e approvazione dell'orchestratore, in questo task o in un task successivo dedicato.

### Step 7 — Sessione di validazione

Creare `docs/sessions/2026-05-NN-n8n-queue-reader-direct-schedule-trigger-validation.md` con:

- Conferma Schedule Trigger aggiunto (intervallo, timezone).
- Esito test manuale pre-pubblicazione.
- Esito pubblicazione queue reader.
- Esito primo tick automatico (has_task:false silenzioso, nessuna scrittura GitHub).
- Conferma Manual Trigger e "When Executed by Another Workflow" ancora presenti.
- Conferma nessun runner automatico attivato.
- Conferma nessuna modifica app, deploy, tag, rollback.

## Output atteso

- `docs/sessions/2026-05-NN-n8n-queue-reader-direct-schedule-trigger-validation.md` (creato)
- `docs/PROJECT_STATE.md` (aggiornato)
- `docs/CHECKPOINT.md` (aggiornato)
- `docs/tasks/done/0115-n8n-queue-reader-direct-schedule-trigger-runtime-activation.md` (done marker)

## Vincoli

- Non modificare app Alina.
- Non modificare `src/**`, `gas-current/**`, `.gas/**`, `appsscript.json`, `package.json`.
- Non fare deploy Apps Script.
- Non creare tag.
- Non fare rollback.
- Non esportare JSON n8n non redatti.
- Non documentare token, credenziali o URL raw sensibili.
- Non rimuovere il Manual Trigger del queue reader.
- Non rimuovere il trigger "When Executed by Another Workflow" (salvo decisione futura separata).
- Non usare `Define Below` nel nodo Execute Workflow (duplicazione rischiosa).
- Non attivare runner automatico (Claude Code CLI / Cursor CLI).
- Non pubblicare il queue reader prima del test manuale Step 3.
- Gate manuale obbligatorio prima di Step 2.

## Allowed paths

- `docs/sessions/2026-05-NN-n8n-queue-reader-direct-schedule-trigger-validation.md`
- `docs/PROJECT_STATE.md`
- `docs/CHECKPOINT.md`
- `docs/tasks/done/0115-n8n-queue-reader-direct-schedule-trigger-runtime-activation.md`

## Forbidden paths

- `src/**`
- `gas-current/**`
- `.gas/**`
- `appsscript.json`
- `package.json`
- Export n8n non redatti
- File contenenti credenziali o token

## Done criteria

Il task 0115 sarà completato solo quando:

1. Schedule Trigger aggiunto al queue reader con intervallo 5 minuti e timezone `Europe/Berlin` (o default istanza).
2. Manual Trigger e "When Executed by Another Workflow" ancora presenti nel queue reader.
3. Test manuale pre-pubblicazione superato (comportamento identico ai test precedenti).
4. Queue reader pubblicato e attivo con Schedule Trigger.
5. Almeno un tick automatico osservato con esito `has_task:false` silenzioso e nessuna scrittura GitHub.
6. Nessun runner automatico attivato.
7. Sessione di validazione creata e committata.
8. Done marker creato, commit selettivo, push eseguiti.
9. Nessuna modifica app, deploy, tag, rollback.
