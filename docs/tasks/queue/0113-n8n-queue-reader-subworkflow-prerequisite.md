# Task — n8n queue reader sub-workflow prerequisite

## Metadata

- ID: 0113-n8n-queue-reader-subworkflow-prerequisite
- Project: Alina Lavoro
- Type: n8n-runtime-prerequisite
- Priority: normal
- Status: queued
- Created by: Orchestrator
- Deploy: no

## Context

Task 0112 ha definito l'architettura Opzione B per il watcher n8n: workflow watcher separato (`Alina watcher - Schedule queue reader`) che chiama il queue reader `TEST - GitHub list Alina task queue` tramite Execute Sub-workflow, senza toccare il queue reader validato.

Durante la verifica runtime (2026-05-12), l'utente ha creato il nuovo workflow watcher (non pubblicato, non eseguito), aggiunto Manual Trigger e nodo Execute Sub-workflow, ma il nodo Execute Sub-workflow non trova / non elenca `TEST - GitHub list Alina task queue` tra le opzioni selezionabili. Compare invece un riferimento non desiderato.

**Causa probabile:** il queue reader ha solo il Manual Trigger. In n8n, perché un workflow sia selezionabile da Execute Sub-workflow, il workflow target deve esporre un trigger di tipo "When executed by another workflow" (o equivalente nella versione installata sul VPS).

**Stato attuale:**
- Workflow watcher `Alina watcher - Schedule queue reader`: creato in n8n, non pubblicato, non attivo, non eseguito.
- Queue reader `TEST - GitHub list Alina task queue`: non modificato, funzionante, trigger manuale validato.
- Nessun Schedule Trigger aggiunto.
- Nessuna modifica app, deploy, tag, rollback.

Dettaglio: `docs/automation/n8n-watcher-schedule-trigger-design.md` (Sezione 10), `docs/sessions/2026-05-12-n8n-watcher-schedule-trigger-design.md`.

## Objective

Analizzare e implementare in n8n il prerequisito che rende il queue reader `TEST - GitHub list Alina task queue` richiamabile dal nodo Execute Sub-workflow del workflow watcher, **senza rompere** il trigger manuale già validato.

Preferenza architetturale: **Opzione B1** — aggiungere al queue reader un secondo trigger "When executed by another workflow", mantenendo il Manual Trigger invariato.

## Procedura

### Step 1 — Analisi in n8n (solo lettura, nessuna modifica)

1. Aprire il workflow `TEST - GitHub list Alina task queue` in n8n (modalità edit, non eseguire).
2. Verificare la versione n8n installata: menu n8n → About, oppure log VPS / container.
3. Controllare se nella lista trigger disponibili compare "When executed by another workflow" (o "Execute Workflow Trigger", o equivalente).
4. Documentare: nome esatto del trigger disponibile, versione n8n.

### Step 2 — Scelta opzione (gate manuale obbligatorio)

Prima di modificare il runtime n8n, comunicare all'orchestratore:

- Versione n8n rilevata.
- Trigger disponibile per sub-workflow (nome esatto nella UI).
- Conferma che B1 è percorribile oppure proposta alternativa motivata (B2 o B3 da `docs/automation/n8n-watcher-schedule-trigger-design.md` Sezione 10).

Attendere approvazione esplicita prima di procedere con Step 3.

### Step 3 — Implementazione prerequisito (solo dopo gate)

Se B1 approvata:

1. Nel workflow `TEST - GitHub list Alina task queue`, aggiungere un nodo "When executed by another workflow" (o equivalente) **come secondo trigger**, senza rimuovere o modificare il Manual Trigger esistente.
2. Salvare il workflow (non pubblicare ancora).
3. Verificare che il Manual Trigger sia ancora presente e integro.

### Step 4 — Verifica selezionabilità

1. Nel workflow watcher `Alina watcher - Schedule queue reader`, aprire il nodo Execute Sub-workflow.
2. Verificare che `TEST - GitHub list Alina task queue` compaia ora tra le opzioni selezionabili.
3. Selezionare il queue reader nel nodo Execute Sub-workflow.
4. **Non eseguire** il workflow watcher ancora.
5. **Non aggiungere** il Schedule Trigger ancora.

### Step 5 — Test manuale del queue reader (regressione trigger manuale)

1. Eseguire il workflow `TEST - GitHub list Alina task queue` tramite il **Manual Trigger** (pulsante "Test workflow" o "Run manually").
2. Verificare che il comportamento sia identico ai test precedenti: `has_task: false` (coda vuota) o `has_task: true` con generazione prompt e sessione corretti.
3. Documentare l'esito.

### Step 6 — Pubblicazione queue reader aggiornato

Se Step 4 e Step 5 superati:

1. Pubblicare il workflow `TEST - GitHub list Alina task queue` aggiornato (con il trigger sub-workflow aggiunto).
2. Documentare la pubblicazione con data e versione.

### Step 7 — Sessione di validazione

Creare `docs/sessions/2026-05-NN-n8n-queue-reader-subworkflow-trigger-validation.md` con:

- Versione n8n rilevata.
- Trigger aggiunto (nome esatto).
- Esito test regressione Manual Trigger.
- Esito verifica selezionabilità da Execute Sub-workflow.
- Conferma queue reader pubblicato e funzionante.
- Conferma workflow watcher non pubblicato (Schedule Trigger non ancora attivo).
- Nessuna modifica app, deploy, tag, rollback.

## Output atteso

- `docs/sessions/2026-05-NN-n8n-queue-reader-subworkflow-trigger-validation.md` (creato)
- `docs/PROJECT_STATE.md` (aggiornato con esito task 0113)
- `docs/CHECKPOINT.md` (aggiornato)
- `docs/tasks/done/0113-n8n-queue-reader-subworkflow-prerequisite.md` (done marker)

## Vincoli

- Non modificare app Alina.
- Non modificare `src/**`, `gas-current/**`, `.gas/**`, `appsscript.json`, `package.json`.
- Non fare deploy Apps Script.
- Non creare tag.
- Non fare rollback.
- Non esportare JSON n8n non redatti.
- Non documentare token, credenziali o URL raw sensibili.
- Non modificare il queue reader **prima** del gate manuale esplicito (Step 2).
- Non aggiungere Schedule Trigger al workflow watcher in questo task (scope: solo prerequisito sub-workflow).
- Non implementare runner documentale automatico (fuori scope).
- Non pubblicare il workflow watcher in questo task.
- Non eseguire il workflow watcher in questo task.

## Allowed paths

- `docs/sessions/2026-05-NN-n8n-queue-reader-subworkflow-trigger-validation.md`
- `docs/PROJECT_STATE.md`
- `docs/CHECKPOINT.md`
- `docs/tasks/done/0113-n8n-queue-reader-subworkflow-prerequisite.md`

## Forbidden paths

- `src/**`
- `gas-current/**`
- `.gas/**`
- `appsscript.json`
- `package.json`
- Export n8n non redatti
- File contenenti credenziali o token

## Validazione futura (done criteria)

Il task 0113 sarà completato solo quando:

1. Queue reader `TEST - GitHub list Alina task queue` ancora eseguibile manualmente (regressione Manual Trigger assente).
2. Queue reader selezionabile da Execute Sub-workflow nel workflow watcher.
3. Workflow watcher (non pubblicato) può richiamare il queue reader in test manuale senza errori.
4. `has_task: false` resta silenzioso (nessun log rumoroso, nessuna scrittura GitHub).
5. Nessun runner automatico attivato.
6. Sessione di validazione creata e committata.
7. Done marker creato, commit selettivo, push eseguiti.
8. Nessuna modifica app, deploy, tag, rollback.
