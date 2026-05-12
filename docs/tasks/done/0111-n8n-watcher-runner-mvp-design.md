# Task — n8n watcher runner MVP design

## Metadata

- ID: 0111-n8n-watcher-runner-mvp-design
- Project: Alina Lavoro
- Type: n8n-runner-design
- Priority: normal
- Status: done
- Created by: Orchestrator
- Deploy: no

## Done status

- Completed by: Claude Code
- Completion date: 2026-05-12
- Session: docs/sessions/2026-05-12-n8n-watcher-runner-mvp-design.md

**Evidence:**

- Documento di design creato: `docs/automation/n8n-watcher-runner-mvp-design.md`
- Trigger MVP scelto e motivato: polling timer n8n ogni 5 minuti (porta 5678 non pubblica → webhook non praticabile)
- Ruoli e componenti definiti con matrice ownership
- Runner MVP: supervisionato/manuale — n8n genera prompt, utente/orchestratore esegue Claude Code o Cursor localmente
- Runner futuro: Claude Code CLI o Cursor CLI sul VPS
- API LLM (Anthropic/OpenAI): scartate come runner predefinito; valutabili in futuro solo tramite provider economici, task non sensibili, gate manuale
- Gate manuali obbligatori elencati esplicitamente
- Scope MVP definito: solo task docs-only con `Deploy: no`
- 8 rischi e relative mitigazioni documentati
- Sequenza di implementazione futura raccomandata (task 0112/0113/0114)
- Allineamento runbook.md Fase 2 + Fase 3 verificato

**Outcome:** design MVP watcher + runner documentale completato; nessuna modifica runtime, app, deploy, tag o rollback.
