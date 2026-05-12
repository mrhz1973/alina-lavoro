# Task — n8n watcher Schedule Trigger design

## Metadata

- ID: 0112-n8n-watcher-schedule-trigger-design
- Project: Alina Lavoro
- Type: n8n-watcher-design
- Priority: normal
- Status: done
- Created by: Orchestrator
- Deploy: no

## Done status

- Completed by: Claude Code runner (manuale, supervisionato)
- Completion date: 2026-05-12
- Session: `docs/sessions/2026-05-12-n8n-watcher-schedule-trigger-design.md`
- Output: `docs/automation/n8n-watcher-schedule-trigger-design.md`

### Evidence

- Documento di design creato con opzione B (workflow separato) scelta e motivata.
- Schedule Trigger configurato: ogni 5 minuti, Europe/Berlin, overlap mitigato da skip processing.
- has_task:false e has_task:true descritti.
- Runner escluso dallo scope (→ task 0113).
- Gate manuale obbligatorio prima dell'implementazione runtime definito.
- Validazione futura pianificata.
- Allineamento a n8n-watcher-runner-mvp-design.md, runbook Fase 2, permissions.md verificato.
- Nessuna modifica a runtime n8n, app Alina, src/, gas-current/.
