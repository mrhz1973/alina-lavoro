# Task — n8n watcher Schedule Trigger design

## Metadata

- ID: 0112-n8n-watcher-schedule-trigger-design
- Project: Alina Lavoro
- Type: n8n-watcher-design
- Priority: normal
- Status: queued
- Created by: Orchestrator
- Deploy: no

## Context

Task 0111 ha definito il design MVP watcher + runner documentale:

- Trigger scelto: Schedule Trigger n8n ogni 5 minuti (polling).
- Nessun webhook GitHub pubblico.
- Nessuna porta n8n pubblica (binding 127.0.0.1:5678, accesso solo via tunnel SSH).
- Queue reader esistente (`TEST - GitHub list Alina task queue`) già validato: skip processing, done, failed; has_task:true dopo skip failed validato.
- Runner MVP: supervisionato/manuale; n8n prepara prompt e sessione; utente/orchestratore esegue Claude Code o Cursor localmente.
- Nessuna API LLM come runner predefinito.

Serve ora progettare come integrare lo Schedule Trigger nel workflow n8n esistente o in un workflow separato, prima di qualsiasi modifica al runtime.

## Objective

Produrre un documento di design per l'integrazione del Schedule Trigger n8n come watcher, allineato a:
- `docs/automation/n8n-watcher-runner-mvp-design.md` (Sezione 2)
- `docs/automation/runbook.md` (Fase 2)
- `docs/automation/permissions.md`

## Output atteso da questo task

Un documento di design in:

```
docs/automation/n8n-watcher-schedule-trigger-design.md
```

Il documento deve coprire:

### 1. Architettura watcher MVP

Descrivere come il Schedule Trigger si integra con il workflow `TEST - GitHub list Alina task queue`:

- **Opzione A:** Schedule Trigger aggiunto come trigger alternativo nello stesso workflow del queue reader.
- **Opzione B:** Workflow separato con Schedule Trigger che chiama il queue reader tramite Execute Workflow o webhook interno.

Valutare e scegliere l'opzione, motivandola in base a:
- semplicità di configurazione in n8n Community Edition;
- isolamento tra watcher e queue reader (manutenibilità);
- comportamento in caso di errore;
- impatto sul workflow già validato.

### 2. Configurazione Schedule Trigger

Specificare:

- Intervallo: ogni 5 minuti (configurabile).
- Fuso orario: Europe/Berlin (allineato alla variabile `GENERIC_TIMEZONE` del container).
- Comportamento quando il workflow è già in esecuzione (overlap protection).
- Comportamento in caso di errore nel queue reader: log, nessun retry automatico senza gate.

### 3. Gestione has_task:false

Quando il queue reader restituisce `has_task: false`:

- Il flusso termina silenziosamente al nodo `No queued task / already processing`.
- Nessun log rumoroso, nessuna notifica, nessuna scrittura su GitHub.
- Comportamento già validato nei test precedenti — il design deve confermarlo invariato.

### 4. Gestione has_task:true

Quando il queue reader restituisce `has_task: true`:

- Il flusso genera prompt in `docs/tasks/processing/` e sessione in `docs/sessions/`.
- Il runner NON viene eseguito automaticamente: il flusso si ferma dopo la generazione del prompt.
- Nessuna doppia esecuzione: skip su `processing/{task}-cursor-prompt.md` già garantito dal queue reader.
- L'utente/orchestratore riceve il segnale tramite commit GitHub visibile e/o log di sessione.

### 5. Runner non incluso

Questo task riguarda solo il watcher (Schedule Trigger + queue reader).

Il runner documentale automatico (Claude Code CLI / Cursor CLI) è in scope del task 0113 futuro. Non progettare né implementare il runner in questo documento.

### 6. Gate manuale obbligatorio prima dell'implementazione runtime

Prima di modificare il runtime n8n (aggiungere Schedule Trigger, creare nuovo workflow, attivare polling):

- L'utente deve confermare gate manuale esplicito.
- Verificare che nessun workflow n8n sia in esecuzione al momento della modifica.
- Il design deve essere rivisto e approvato dall'orchestratore prima dell'implementazione.

### 7. Validazione manuale futura

Dopo l'implementazione del Schedule Trigger:

- Eseguire almeno un ciclo completo manuale osservando il log n8n.
- Verificare che has_task:false non generi log rumorosi.
- Verificare che has_task:true generi prompt e sessione correttamente.
- Verificare assenza di doppia esecuzione su task già in processing.
- Documentare l'esito in una sessione dedicata.

### 8. Done criteria del design

Il documento di design è completo quando:

- Opzione architetturale scelta e motivata (A o B).
- Configurazione Schedule Trigger specificata.
- Gestione has_task:false descritta.
- Gestione has_task:true descritta.
- Runner escluso esplicitamente dallo scope.
- Gate manuale prima dell'implementazione definito.
- Validazione futura pianificata.
- Allineamento a design MVP (0111), runbook Fase 2 e permissions.md verificato.

## Vincoli

- Non modificare app Alina.
- Non modificare src/**.
- Non modificare gas-current/**.
- Non modificare .gas/**.
- Non modificare appsscript.json.
- Non fare deploy Apps Script.
- Non creare tag.
- Non fare rollback.
- Non modificare workflow n8n runtime.
- Non esportare JSON n8n.
- Non documentare token, credenziali o URL raw sensibili.
- Non implementare Schedule Trigger: questo task produce solo il documento di design.
- Non progettare il runner documentale automatico: è in scope di task 0113.

## Allowed paths

- docs/automation/n8n-watcher-schedule-trigger-design.md (output principale)
- docs/PROJECT_STATE.md
- docs/CHECKPOINT.md
- docs/sessions/2026-05-12-n8n-watcher-schedule-trigger-design.md
- docs/tasks/done/0112-n8n-watcher-schedule-trigger-design.md

## Forbidden paths

- src/**
- gas-current/**
- .gas/**
- appsscript.json
- package.json
- export n8n non redatti
- file contenenti credenziali o token

## Done criteria futuro

Il task 0112 sarà completato solo quando:
- docs/automation/n8n-watcher-schedule-trigger-design.md creato e completo;
- architettura watcher definita con scelta motivata;
- Schedule Trigger configurato (intervallo, fuso orario, overlap, errori);
- gestione has_task:false e has_task:true descritte;
- runner escluso dallo scope;
- gate manuale e validazione futura pianificati;
- done marker creato;
- commit selettivo e push eseguiti;
- nessun impatto su app Alina o runtime n8n.
