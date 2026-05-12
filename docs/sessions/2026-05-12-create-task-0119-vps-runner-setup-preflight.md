# Sessione — Creazione Task 0119: VPS Runner Setup Preflight

**Data:** 2026-05-12
**Tipo:** docs-only
**Task creato:** `docs/tasks/queue/0119-vps-runner-setup-preflight-docs-only.md`

## Contesto

A seguito del completamento del task 0118 (decision gate Fase 3 approvate,
`docs/automation/runner-phase3-gate-decision.md`), il prossimo passo indicato è un
task di preflight puro: design teorico, checklist, stime di costo e rischi — senza
toccare VPS, n8n runtime, CLI o API key.

## Task creato

Il task 0119 richiede la produzione di `docs/automation/vps-runner-setup-preflight.md`
con dieci sezioni:

1. Compatibilità Claude Code CLI con Ubuntu 24.04.4 LTS (teorica).
2. Checklist comandi read-only futuri (non eseguiti ora).
3. Stima costo token per task docs-only tipo.
4. Proposta budget mensile e soglie di stop.
5. Design nodo SSH exec n8n (solo su carta).
6. Allowlist path runner.
7. Denylist assoluta.
8. Piano Fase 3A supervisionata.
9. Rischi e mitigazioni.
10. Criteri per il task successivo (read-only check prima di installazione).

## Stato invariato

- App Alina V1.9.2 stabile, Apps Script @24, non toccata.
- n8n runtime non modificato.
- Runner automatico non attivo.
- VPS non modificato.
- Nessun deploy, tag, rollback, CLI, API key.
