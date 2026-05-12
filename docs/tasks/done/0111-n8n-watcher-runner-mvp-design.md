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
- Trigger MVP scelto e motivato: polling timer n8n (porta 5678 non pubblica → webhook non praticabile)
- Ruoli e componenti definiti con matrice ownership
- Flusso runner documentale descritto per due opzioni (Anthropic API via n8n / Claude Code CLI)
- Gate manuali obbligatori elencati esplicitamente
- Scope MVP definito: solo task docs-only con `Deploy: no`
- 8 rischi e relative mitigazioni documentati
- Sequenza di implementazione futura raccomandata (task 0112/0113/0114)
- Allineamento runbook.md Fase 2 + Fase 3 verificato

**Outcome:** design MVP watcher + runner documentale completato; nessuna modifica runtime, app, deploy, tag o rollback.
