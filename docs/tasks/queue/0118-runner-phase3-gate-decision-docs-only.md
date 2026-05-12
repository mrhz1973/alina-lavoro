# Task — Runner Phase 3: Gate Decision (docs-only)

## Metadata

- ID: 0118-runner-phase3-gate-decision-docs-only
- Project: Alina Lavoro
- Type: docs-only
- Priority: normal
- Status: queued
- Created by: Orchestrator
- Deploy: no

## Context

La Fase 2 watcher/polling MVP è completata e validata (task 0115 e 0116). Il documento
di design della Fase 3 runner documentale è in `docs/automation/runner-phase3-design.md`
(task 0117, completato 2026-05-12).

Il documento `runner-phase3-design.md` identifica cinque domande gate che l'orchestratore
deve rispondere prima di qualsiasi implementazione runtime della Fase 3:

1. Scope task runner
2. Frequenza attesa
3. Supervisione post-run
4. Gestione errori
5. Autenticazione CLI / API key

Questo task produce un documento di decisione che fissa le risposte dell'orchestratore
a questi cinque gate, senza implementare alcun runtime automatico.

## Objective

Creare `docs/automation/runner-phase3-gate-decision.md` con le risposte gate
dell'orchestratore, stabilendo i vincoli operativi per la Fase 3 prima di qualsiasi
task di tipo `vps-runner-setup` o `n8n-runner-setup`.

## Requirements

Risposta ai cinque gate (vedi sezione Decisioni gate).

Vincoli assoluti da ripetere nel documento di decisione:

- Non autorizzare ancora installazione Claude Code CLI sul VPS.
- Non configurare API key Anthropic sul VPS.
- Non creare workflow GitHub Actions per runner automatico.
- Non attivare runner automatico di nessun tipo.
- Non modificare SSH exec o accessi VPS oltre a quelli già documentati.
- Non modificare app Alina.
- Non fare deploy Apps Script.
- Non creare tag di release.
- Non fare rollback.

Il documento di decisione deve anche specificare:

- L'opzione raccomandata per la Fase 3 (Opzione A o Opzione C da `runner-phase3-design.md`).
- Il prossimo task dopo 0118: deve essere ancora design/preflight, non runtime pieno.
- Il perimetro allowlist dei path che il runner potrà toccare.

## Decisioni gate (risposta orchestratore)

### Gate 1 — Scope task runner

**Decisione:** solo task `docs-only`.

Allowlist path per il runner:
- `docs/tasks/queue/`
- `docs/tasks/processing/`
- `docs/tasks/done/`
- `docs/tasks/failed/`
- `docs/sessions/`
- `docs/PROJECT_STATE.md`
- `docs/CHECKPOINT.md`

Denylist assoluta (mai toccabile dal runner automatico):
- `src/**`
- `gas-current/**`
- `.gas/**`
- `appsscript.json`
- `package.json`
- `.clasp.json`
- `.github/workflows/**` (salvo approvazione esplicita separata per Opzione C)
- Qualsiasi file con credenziali, token o chiavi

### Gate 2 — Frequenza attesa

**Decisione:** bassa/media — al massimo pochi task docs-only al giorno (ordine di grandezza:
2-5 task/giorno nei picchi, normalmente meno).

Limite operativo: introdurre un rate limit nel design del runner (es. max N task consecutivi
per run, pausa tra esecuzioni). Niente loop automatici non controllati.

Il costo token Anthropic con Opzione A deve essere monitorato. Prima dell'attivazione
automatica, stimare il costo medio per task docs-only e approvare un budget mensile.

### Gate 3 — Supervisione post-run

**Decisione:** Fase 3A — runner supervisionato con dry-run o commit controllato.

Non attivare il pieno fire-and-forget finché non viene validato almeno un task dummy
end-to-end in modalità supervisionata.

Sequenza obbligatoria per la Fase 3A:
1. Runner esegue il task in modalità dry-run (nessun commit automatico) o con commit su
   branch separato per review.
2. Revisione manuale dell'output prima del merge su `main`.
3. Solo dopo la validazione di almeno 3 task supervisionati: valutare direct commit su `main`.

### Gate 4 — Gestione errori

**Decisione:** fallimento tracciato obbligatoriamente.

Comportamento in caso di errore runner:
- Creare `docs/tasks/failed/{task}.md` con `failure_reason` e timestamp.
- Creare sessione errore in `docs/sessions/` con dettaglio dell'errore.
- Non cancellare mai il file da `queue/`.
- Notifica: semplice scrittura in `docs/tasks/failed/` (leggibile via n8n o GitHub).
- Manual review obbligatoria prima di qualsiasi retry.
- Nessun retry automatico senza approvazione orchestratore.

### Gate 5 — API key / Autenticazione CLI

**Decisione:** chiave dedicata.

- Usare una API key Anthropic dedicata per il runner VPS, separata dall'account personale.
- La chiave non deve mai comparire nel repo GitHub (né in chiaro, né codificata).
- La chiave deve essere configurata come segreto in n8n/VPS esclusivamente.
- Costo e limiti della chiave dedicata devono essere approvati esplicitamente prima del
  runtime automatico.
- Prima di configurare la chiave: approvazione esplicita dell'orchestratore nel task
  `vps-runner-setup` (non in questo task docs-only).

## Opzione raccomandata

**Opzione A — Claude Code CLI sul VPS** resta la scelta raccomandata per il design della
Fase 3, per i motivi già documentati in `runner-phase3-design.md`:

- VPS già operativo (IONOS, Docker n8n, Ubuntu 24.04.4 LTS).
- SSH già usato per manutenzione.
- Claude Code CLI è lo stesso tool usato manualmente dal runner supervisionato.
- Delta di implementazione limitato rispetto all'infrastruttura attuale.

**Opzione C — GitHub Actions** resta alternativa valida se il VPS diventa instabile o
se si vuole evitare la gestione di un processo long-running sul VPS.

Non procedere ancora all'installazione. Il prossimo task deve essere ancora design/preflight.

## Expected output

- `docs/automation/runner-phase3-gate-decision.md` con le risposte ai cinque gate.
- Aggiornamento `docs/PROJECT_STATE.md`: indicare task 0118 creato e decision gate in corso.
- Aggiornamento `docs/CHECKPOINT.md`: prossimo passo = task di design/preflight post-0118.
- Sessione opzionale: `docs/sessions/2026-05-12-create-task-0118-runner-phase3-gate-decision.md`.

## Scope (allowed paths)

- `docs/automation/runner-phase3-gate-decision.md` (da creare)
- `docs/PROJECT_STATE.md`
- `docs/CHECKPOINT.md`
- `docs/sessions/2026-05-12-create-task-0118-runner-phase3-gate-decision.md` (opzionale)

## Forbidden paths

- `src/**`
- `gas-current/**`
- `.gas/**`
- `appsscript.json`
- `package.json`
- `.clasp.json`
- Export JSON n8n non redatti
- File con credenziali, token o URL raw sensibili

## Constraints

- Docs-only. Nessuna modifica app Alina.
- Nessuna modifica n8n runtime.
- Nessuna installazione Claude Code CLI.
- Nessuna configurazione API key.
- Nessuna modifica VPS oltre a documentazione.
- Nessun deploy Apps Script.
- Nessun tag di release.
- Nessun rollback.
- Nessun `git add .`
- Non cancellare file da queue/, processing/, done/ o failed/.
- Non attivare runner automatico.

## Checks

- `git diff --check`
- `git diff --stat` deve mostrare solo path sotto `docs/`

## Deploy policy

none

## Manual test gate

not required

## Done criteria

1. Esiste `docs/automation/runner-phase3-gate-decision.md` con risposte ai cinque gate.
2. `docs/PROJECT_STATE.md` e `docs/CHECKPOINT.md` aggiornati.
3. Nessuna modifica app, n8n runtime, VPS, CLI, API key, deploy, tag, rollback o runner automatico.
4. Done marker in `docs/tasks/done/0118-runner-phase3-gate-decision-docs-only.md`.
