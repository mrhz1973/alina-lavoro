# Task — n8n watcher Schedule Trigger runtime activation

## Metadata

- ID: 0114-n8n-watcher-schedule-trigger-runtime-activation
- Project: Alina Lavoro
- Type: n8n-runtime-activation
- Priority: normal
- Status: queued
- Created by: Orchestrator
- Deploy: no

## Context

Task 0112 ha definito il design architetturale (Opzione B: workflow watcher separato).
Task 0113 ha validato il prerequisito B1: trigger "When Executed by Another Workflow" aggiunto al queue reader, queue reader richiamabile dal watcher tramite Execute Workflow, test manuale tutto verde.

**Stato attuale:**
- Workflow watcher `Alina watcher - Schedule queue reader`: esiste in n8n, configurato con Manual Trigger → Execute Workflow puntato al queue reader. **Non pubblicato. Nessun Schedule Trigger.**
- Queue reader `TEST - GitHub list Alina task queue`: ha Manual Trigger + trigger "When Executed by Another Workflow". Validato. Non modificato.
- Nessun polling automatico attivo.
- Nessun runner automatico.

Riferimenti: `docs/automation/n8n-watcher-schedule-trigger-design.md` (Sezioni 2–7), `docs/sessions/2026-05-12-n8n-queue-reader-subworkflow-trigger-validation.md`.

## Objective

Attivare il watcher n8n con Schedule Trigger ogni 5 minuti (timezone `Europe/Berlin`), verificare il comportamento `has_task:false` (coda vuota, silenzioso), e pubblicare il workflow watcher come polling automatico.

Il runner documentale automatico (Claude Code CLI / Cursor CLI sul VPS) resta **fuori scope**.

## Procedura

### Step 1 — Gate manuale (obbligatorio prima di qualsiasi modifica runtime)

Verificare in n8n:
1. Nessun workflow in esecuzione al momento della modifica.
2. Il workflow watcher `Alina watcher - Schedule queue reader` è aperto in modalità edit.
3. Il nodo Execute Workflow punta correttamente al queue reader (nessun errore visibile).

Comunicare all'orchestratore che il gate è pronto. Attendere conferma prima di Step 2.

### Step 2 — Aggiunta Schedule Trigger nel watcher

Nel workflow `Alina watcher - Schedule queue reader`:

1. Aggiungere un nodo **Schedule Trigger** con i seguenti parametri:
   - **Trigger interval:** Every X minutes
   - **Minutes between triggers:** 5
   - **Timezone:** `Europe/Berlin`
2. Collegare il nodo Schedule Trigger allo stesso flusso del Manual Trigger (entrambi devono puntare al nodo Execute Workflow).
3. **Non rimuovere** il Manual Trigger — deve restare disponibile per test manuali.
4. **Non pubblicare ancora** il workflow. Salvare solo.

### Step 3 — Test manuale pre-pubblicazione

Con il Schedule Trigger aggiunto ma il workflow non ancora pubblicato:

1. Eseguire il workflow tramite **Manual Trigger** (pulsante "Test workflow" in n8n).
2. Verificare che il flusso invochi correttamente il queue reader tramite Execute Workflow.
3. Verificare l'esito atteso: `has_task: false` (coda vuota) — silenzioso, nessuna scrittura GitHub, nessun log rumoroso.
4. Verificare che il Manual Trigger funzioni ancora correttamente (regressione assente).
5. Documentare l'esito prima di procedere.

Se il test manuale fallisce, **fermarsi** e non procedere con la pubblicazione. Riportare all'orchestratore l'errore e il punto di fallimento.

### Step 4 — Pubblicazione e attivazione polling

Solo se Step 3 superato:

1. Pubblicare il workflow watcher (`Publish` in n8n).
2. Attivare il workflow (toggle Active/On).
3. Attendere il primo tick del Schedule Trigger (entro 5 minuti).
4. Osservare il log n8n: verificare che il run automatico termini silenziosamente con `has_task: false`.

### Step 5 — Verifica ciclo has_task:false (polling attivo)

Dopo il primo tick automatico:

1. Controllare il log n8n: il run deve terminare senza errori.
2. Verificare che nessuna scrittura GitHub sia avvenuta (nessun commit da n8n su `docs/tasks/processing/` o `docs/sessions/`).
3. Verificare che il workflow non produca log rumorosi o notifiche indesiderate.

Se questo step è OK, il watcher MVP è operativo come polling passivo.

### Step 6 — (Opzionale / task successivo) Verifica ciclo has_task:true

La verifica con `has_task: true` (task docs-only controllato in coda) può avvenire:

- **In questo task**, solo se il gate manuale è superato e l'orchestratore approva esplicitamente, con un task docs-only di test minimale.
- **In un task successivo dedicato**, se si preferisce separare l'attivazione del polling dalla verifica end-to-end.

In ogni caso, il task docs-only di test deve essere:
- Tipo `docs-only`, `Deploy: no`.
- Allowed paths limitati a `docs/**`.
- Gate manuale prima dell'esecuzione del prompt generato.

### Step 7 — Sessione di validazione

Creare `docs/sessions/2026-05-NN-n8n-watcher-schedule-trigger-runtime-activation.md` con:

- Parametri Schedule Trigger configurati (intervallo, timezone).
- Esito test manuale pre-pubblicazione.
- Esito primo tick automatico (has_task:false silenzioso).
- Conferma watcher pubblicato e attivo.
- Conferma Manual Trigger ancora disponibile.
- Conferma nessun runner automatico attivato.
- Conferma nessuna modifica app, deploy, tag, rollback.

## Output atteso

- `docs/sessions/2026-05-NN-n8n-watcher-schedule-trigger-runtime-activation.md` (creato)
- `docs/PROJECT_STATE.md` (aggiornato)
- `docs/CHECKPOINT.md` (aggiornato)
- `docs/tasks/done/0114-n8n-watcher-schedule-trigger-runtime-activation.md` (done marker)

## Vincoli

- Non modificare app Alina.
- Non modificare `src/**`, `gas-current/**`, `.gas/**`, `appsscript.json`, `package.json`.
- Non fare deploy Apps Script.
- Non creare tag.
- Non fare rollback.
- Non esportare JSON n8n non redatti.
- Non documentare token, credenziali o URL raw sensibili con query string (Workflow ID interno n8n può essere omesso o redatto).
- Non modificare il queue reader `TEST - GitHub list Alina task queue` salvo correzioni strettamente necessarie e approvate.
- Non attivare runner automatico (Claude Code CLI / Cursor CLI).
- Non pubblicare il workflow watcher prima del test manuale Step 3.
- Gate manuale obbligatorio prima di Step 2.

## Allowed paths

- `docs/sessions/2026-05-NN-n8n-watcher-schedule-trigger-runtime-activation.md`
- `docs/PROJECT_STATE.md`
- `docs/CHECKPOINT.md`
- `docs/tasks/done/0114-n8n-watcher-schedule-trigger-runtime-activation.md`

## Forbidden paths

- `src/**`
- `gas-current/**`
- `.gas/**`
- `appsscript.json`
- `package.json`
- Export n8n non redatti
- File contenenti credenziali o token

## Runtime Blocker (2026-05-12)

**Stato:** bloccato in fase Publish. Task in sospeso in attesa di scelta architetturale.

### Azioni eseguite prima del blocco

- Schedule Trigger aggiunto al watcher (5 min, Europe/Berlin). Manual Trigger invariato.
- Test manuale watcher post-aggiunta Schedule Trigger: **tutto verde**.

### Blocco

- Tentativo di pubblicare il watcher → errore: il queue reader non è pubblicato e n8n richiede che i sub-workflow siano pubblicati prima del parent.
- Tentativo di pubblicare il queue reader → risposta n8n: `This workflow has no trigger nodes that require publishing`.
- Deadlock UI: watcher non pubblicabile perché queue reader non pubblicato; queue reader non pubblicabile perché n8n non riconosce "When Executed by Another Workflow" come trigger che richiede pubblicazione.

In test manuale (Manual Trigger) tutto funziona. Il blocco riguarda esclusivamente la pubblicazione/attivazione come polling automatico.

### Opzioni di sblocco

| Opzione | Descrizione | Esito |
|---------|-------------|-------|
| **A** | Investigare versione n8n sul VPS: verificare se esiste modalità per rendere pubblicabile il queue reader | **Investigata (2026-05-12) — non risolutiva.** Nessuna impostazione UI trovata. `Define Below` scartato (duplicazione rischiosa). Vedi sezione "Opzione A — indagine UI read-only" in sessione. |
| **B** | Schedule Trigger direttamente nel queue reader (Opzione A del design 0112) | **Prossimo passo** — preparata come task 0115. |
| **C** | Altra alternativa sicura e documentata | Non perseguita. |

Sessione: `docs/sessions/2026-05-12-n8n-watcher-schedule-trigger-publish-blocked.md`.

## Done criteria

Il task 0114 sarà completato solo quando:

1. Schedule Trigger aggiunto al watcher con intervallo 5 minuti e timezone `Europe/Berlin`.
2. Manual Trigger del watcher ancora presente e funzionante.
3. Test manuale pre-pubblicazione superato (has_task:false silenzioso, nessun errore).
4. Workflow watcher pubblicato e attivo come polling automatico.
5. Almeno un tick automatico osservato con esito `has_task:false` silenzioso e nessuna scrittura GitHub.
6. Nessun runner automatico attivato.
7. Sessione di validazione creata e committata.
8. Done marker creato, commit selettivo, push eseguiti.
9. Nessuna modifica app, deploy, tag, rollback.
