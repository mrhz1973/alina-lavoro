# Sessione — Creazione Task 0118: Runner Phase 3 Gate Decision

**Data:** 2026-05-12
**Tipo:** docs-only
**Task creato:** `docs/tasks/queue/0118-runner-phase3-gate-decision-docs-only.md`

## Contesto

A seguito del completamento del task 0117 (Fase 2 watcher/polling MVP dichiarata chiusa;
documento design Fase 3 in `docs/automation/runner-phase3-design.md`), l'orchestratore
ha fornito le risposte ai cinque gate identificati nel documento di design.

Il task 0118 fissa documentalmente queste risposte gate prima di qualsiasi implementazione
runtime della Fase 3.

## Decisioni gate registrate nel task 0118

| Gate | Decisione |
|------|-----------|
| Scope | Solo task `docs-only`; allowlist path esplicita; denylist assoluta su `src/**` e credenziali |
| Frequenza | Bassa/media (2-5 task/giorno nei picchi); rate limit da progettare; budget token da approvare |
| Supervisione | Fase 3A supervisionata: dry-run o commit su branch separato; almeno 3 task validati prima di direct commit |
| Gestione errori | Failed tracciato in `docs/tasks/failed/`; sessione errore; no retry automatico; manual review |
| API key | Chiave dedicata Anthropic; mai nel repo; segreto solo n8n/VPS; approvazione costo prima del runtime |

## Opzione confermata

Opzione A — Claude Code CLI sul VPS: raccomandata. Opzione C — GitHub Actions: alternativa.
Nessuna installazione CLI autorizzata in questo task.

## File creati

- `docs/tasks/queue/0118-runner-phase3-gate-decision-docs-only.md`
- `docs/sessions/2026-05-12-create-task-0118-runner-phase3-gate-decision.md` (questo file)

## File aggiornati

- `docs/PROJECT_STATE.md`
- `docs/CHECKPOINT.md`

## Prossimo passo

Il runner n8n selezionerà il task 0118 al prossimo tick del polling automatico.
Il task 0118 produrrà `docs/automation/runner-phase3-gate-decision.md` con le risposte
gate formali. Il task successivo dopo 0118 deve essere ancora design/preflight,
non runtime pieno.

## Stato invariato

- App Alina V1.9.2 stabile, Apps Script @24, non toccata.
- n8n runtime non modificato.
- Runner automatico non attivo.
- VPS non modificato.
- Nessun deploy, tag, rollback.
