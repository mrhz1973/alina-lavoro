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

### Runtime discovery / implementation caveat (2026-05-12)

Verifica manuale n8n eseguita dall'utente dopo la pubblicazione del design: il nodo Execute Sub-workflow non trova il queue reader `TEST - GitHub list Alina task queue` (il workflow manca del trigger "When executed by another workflow"). L'Opzione B rimane l'architettura desiderabile, ma richiede un task preparatorio per aggiungere il trigger sub-workflow al queue reader (o scegliere alternativa documentata). Il design in `docs/automation/n8n-watcher-schedule-trigger-design.md` è stato aggiornato con la Sezione 10 che documenta il caveat e le opzioni di risoluzione. Il task 0112 rimane done come design; l'implementazione runtime è in scope di task successivi.
