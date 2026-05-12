# Task — n8n watcher runner MVP design

## Metadata

- ID: 0111-n8n-watcher-runner-mvp-design
- Project: Alina Lavoro
- Type: n8n-runner-design
- Priority: normal
- Status: queued
- Created by: Orchestrator
- Deploy: no

## Context

Workstream attivo: automazione watcher/runner.

Stato infrastruttura al momento di questo task:

- Queue reader n8n validato: skip processing, done, failed; ramo has_task:true validato.
- VPS IONOS: Ubuntu 24.04.4 LTS, n8n in Docker (container root-n8n-1), binding 127.0.0.1:5678, tunnel SSH operativo.
- Template Cursor in repo: docs/tasks/templates/cursor-prompt-default.md.
- Claude Code runner documentale: validato su task 0102.

Manca ancora il componente watcher (trigger/polling su queue) e il runner automatico (che esegue Claude Code o Cursor CLI senza intervento manuale per ogni task).

## Objective

Produrre un documento di design MVP per i due componenti mancanti:

1. **Watcher n8n (Fase 2 runbook):** trigger o polling che rileva un nuovo task in docs/tasks/queue/ e avvia il runner.
2. **Runner documentale (Fase 3 runbook):** esecuzione automatica del prompt Cursor/Claude Code a partire dal task in coda, con commit selettivo e push.

Il design deve essere pragmatico, adatto al VPS attuale (n8n Community Edition, Docker, tunnel SSH), e privo di dipendenze esterne non già presenti.

## Output atteso da questo task

Un documento di design in:

```
docs/automation/n8n-watcher-runner-mvp-design.md
```

Il documento deve coprire:

### 1. Ruoli e componenti MVP

Definire chiaramente:

- **Watcher:** chi/cosa rileva un nuovo task in queue/ (n8n polling GitHub o webhook push).
- **Queue reader:** workflow n8n già esistente (TEST - GitHub list Alina task queue) — già validato.
- **Runner documentale:** processo (script VPS, n8n Code node, Cursor CLI, Claude Code CLI) che esegue il prompt generato dal queue reader.
- **Implementatore umano/AI:** chi è responsabile di ogni fase e quando è necessaria supervisione.

### 2. Trigger MVP scelto

Valutare e scegliere tra:

- **Polling timer n8n:** trigger periodico (es. ogni N minuti) che chiama il queue reader.
- **Webhook GitHub push:** n8n riceve notifica push e filtra se tocca docs/tasks/queue/.

Motivare la scelta per il VPS attuale (semplicità, nessun port 5678 pubblico, tunnel SSH).

### 3. Runner documentale MVP

Definire il flusso minimo:

1. n8n (o script VPS) riceve segnale dal watcher.
2. Queue reader seleziona il primo task eleggibile.
3. Prompt Cursor generato e committato in docs/tasks/processing/.
4. Runner esegue il prompt (Claude Code CLI o equivalente).
5. Commit selettivo + push del risultato su main.
6. Transizione task: done marker o failed marker.

Specificare quale componente esegue ogni passo e se richiede supervisione.

### 4. Gate manuali obbligatori

Elencare esplicitamente cosa il runner MVP **non può** fare senza conferma umana:

- Nessun deploy Apps Script.
- Nessun tag di release.
- Nessun rollback.
- Nessuna cancellazione di file applicativi.
- Nessuna modifica a src/**, gas-current/**, appsscript.json, package.json.
- Nessuna credenziale committata.
- Nessun export JSON n8n non redatto.
- Nessun fire-and-forget su operazioni irreversibili.

### 5. Scope MVP (solo docs-only)

Il runner MVP opera solo su task di tipo docs-only o equivalente basso rischio, secondo docs/automation/permissions.md:

- Crea/aggiorna file sotto docs/.
- Commit selettivo su path consentiti dal task.
- Push su main.
- Nessuna modifica src/** senza task frontend esplicito.

### 6. Rischi e mitigazioni

Documentare i rischi principali e le mitigazioni:

- Doppia esecuzione (mitigata da skip processing nel queue reader).
- Push race tra n8n e runner (mitigata da git pull --rebase).
- Runner che fallisce silenziosamente (mitigata da failed marker esplicito).
- Credenziali esposte (mitigate da nessun segreto in repo, credential solo in n8n).

### 7. Done criteria del design

Il documento di design è completo quando:

- Tutti i componenti sono definiti con owner e responsabilità.
- Il trigger MVP è scelto e motivato.
- Il flusso runner documentale è tracciato passo per passo.
- I gate manuali sono elencati esplicitamente.
- I rischi principali sono coperti.
- Il design è allineato a docs/automation/runbook.md (Fase 2 e Fase 3) e docs/automation/permissions.md.

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
- Non implementare watcher o runner: questo task produce solo il documento di design.

## Allowed paths

- docs/automation/n8n-watcher-runner-mvp-design.md (output principale)
- docs/PROJECT_STATE.md
- docs/CHECKPOINT.md
- docs/tasks/done/0111-n8n-watcher-runner-mvp-design.md

## Forbidden paths

- src/**
- gas-current/**
- .gas/**
- appsscript.json
- package.json
- export n8n non redatti
- file contenenti credenziali o token

## Done criteria futuro

Il task 0111 sarà completato solo quando:
- docs/automation/n8n-watcher-runner-mvp-design.md creato e completo;
- tutti i componenti MVP definiti con owner;
- trigger scelto e motivato;
- flusso runner documentale tracciato;
- gate manuali elencati;
- rischi coperti;
- allineamento runbook.md e permissions.md verificato;
- done marker creato;
- commit selettivo e push eseguiti;
- nessun impatto su app Alina.
