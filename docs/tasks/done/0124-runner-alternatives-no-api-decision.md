# Task — Runner Alternatives No-API Decision

## Metadata

- ID: 0124-runner-alternatives-no-api-decision
- Project: Alina Lavoro
- Type: runner-decision-docs-only
- Priority: normal
- Status: **done**
- Created by: Orchestrator
- Completed by: Windsurf/Cascade (implementatore di riserva/supervisionato)
- Deploy: no
- Runtime: no

## Riferimenti

- **Task queue:** `docs/tasks/queue/0124-runner-alternatives-no-api-decision.md`
- **Prompt n8n (evidenza automation, incompleto):** `docs/tasks/processing/0124-runner-alternatives-no-api-decision-cursor-prompt.md`
- **Sessione automation n8n:** `docs/sessions/automation-0124-runner-alternatives-no-api-decision.md`
- **Documento decisionale:** `docs/automation/runner-alternatives-no-api-decision.md`
- **Sessione manuale:** `docs/sessions/2026-05-12-runner-alternatives-no-api-decision.md`

## Gate Ricevuto

> "Autorizzo l'esecuzione del task 0124 runner alternatives no-API decision, solo docs-only, nessun runtime."

## Esito

**Decisione Fase 3A documentata.** Documento `docs/automation/runner-alternatives-no-api-decision.md` creato con:

- 6 alternative confrontate (A/B/C/D/E/F)
- Criteri di valutazione standardizzati (11 criteri)
- Matrice comparativa
- Raccomandazione chiara

## Raccomandazione Finale

| Termine | Azione |
|---------|--------|
| **Breve termine** | Restare in modalità manuale-supervisionata (Opzione F) |
| **Implementatore principale** | Claude Code locale supervisionato (Opzione A) |
| **Riserva** | Windsurf/Cascade supervisionato (Opzione B) |
| **n8n** | Queue reader / prompt generator / session tracker — NON runner |
| **Cursor CLI** | Rinviato al reset (~10 giorni) con task preflight separato (Opzione C) |
| **Codex CLI** | Task documentale separato prima di qualsiasi azione (Opzione D) |
| **Claude CLI VPS** | Non raccomandato finché resta vincolo no-API-key (Opzione E) |

## Gate Futuri Proposti (non creati)

- 0125 Codex CLI / ChatGPT Plus feasibility check (docs-only)
- Task Cursor CLI preflight post-reset
- Task consolidamento workflow manuale-supervisionato

## Conferme di Non-Interferenza

- ✅ **Decisione solo documentale** — nessun runtime autorizzato
- ✅ **Nessuna API key configurata** — presupposto no-API-key rispettato
- ✅ **Nessun login Claude** — nessun tentativo di autenticazione
- ✅ **Nessuna modifica n8n runtime** — container n8n invariato
- ✅ **Nessuna modifica VPS** — VPS non toccato
- ✅ **Nessun CLI eseguito** — Claude CLI, Cursor CLI, Codex CLI non eseguiti
- ✅ **Nessuna GitHub Action creata** — nessun workflow automatico
- ✅ **Nessun deploy/tag/rollback** — codice invariato
- ✅ **Nessun runner automatico attivato** — flusso supervisionato/manuale confermato
- ✅ **App Alina V1.9.2 non toccata** — stabile

---
**Task 0124 completato — Decisione Fase 3A documentata: breve termine manuale-supervisionato**
