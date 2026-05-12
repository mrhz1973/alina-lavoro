# Sessione — Creazione task 0131 n8n Decision Packet Generator Design (2026-05-12)

## Titolo

Creazione task in queue: 0131 — n8n Decision Packet Generator Design

## Tipo sessione

Creazione task docs-only — lifecycle rule: solo queue + sessione; PROJECT_STATE/CHECKPOINT non aggiornati.

## Task creato

`docs/tasks/queue/0131-n8n-decision-packet-generator-design.md`

- ID: `0131-n8n-decision-packet-generator-design`
- Tipo: `low-touch-loop-docs-only`
- Priorità: normale
- Stato: queued
- Deploy: no
- Runtime: no
- App changes: no
- Manual gate: required before any future runtime, n8n runtime, VPS, deploy, tag, rollback, API key, login, GitHub Actions, runner automatico

## Contesto

Task successivo nella roadmap low-touch, confermato in:
- `docs/automation/autonomous-low-touch-loop-design.md` (task 0128) — sequenza 0129–0133 proposta
- `docs/PROJECT_STATE.md` e `docs/CHECKPOINT.md` — ordine roadmap: **0131 → 0132 → 0133**
- Decisione D-0128-A risolta (Auto-Aggio prima); 0130 completato (Auto-Aggio Design); 0129 completato (INBOX Design)

Prerequisiti soddisfatti:
- Task 0127 completato: `docs/automation/decision-packet-format.md`
- Task 0128 completato: `docs/automation/autonomous-low-touch-loop-design.md`
- Task 0129 completato: `docs/automation/human-decision-inbox-design.md`
- Task 0130 completato: `docs/automation/auto-aggio-design.md`

## Scopo del task 0131

Progettare il generatore n8n di Decision Packet: componente/workflow documentale che, a partire da uno stato ambiguo o da una decisione reale rilevata, produce un Decision Packet Markdown conforme al formato canonico (13 campi) e lo colloca nel posto corretto del sistema low-touch.

## Aree di progettazione incluse nel task file

1. Definizione del generatore (perimetro, differenza manuale vs automatico)
2. Input del generatore (segnali implementatore, Auto-Aggio, trigger manuale)
3. Trigger logici (tabella: trigger → condizione → azione generatore)
4. Mapping verso i 13 campi canonici (tabella: campo → fonte input)
5. Relazione con Auto-Aggio
6. Relazione con INBOX futura (`docs/INBOX.md`)
7. Comportamento quando NON serve una decisione (filtro anti-rumore)
8. Comportamento quando serve gate manuale (gate permanenti)
9. Failure modes (tabella: rischio → probabilità → impatto → mitigazione)
10. Anti-rumore / anti-falso positivo (5 regole esplicite)
11. Path documentali futuri (tabella: fase → path → tipo)
12. Criteri di sicurezza
13. Confini docs-only vs runtime-gated (tabella)

## Output atteso alla futura esecuzione del task 0131

1. `docs/automation/n8n-decision-packet-generator-design.md` — documento di progettazione
2. `docs/sessions/2026-05-12-n8n-decision-packet-generator-design.md` (o datata equivalente)
3. `docs/tasks/done/0131-n8n-decision-packet-generator-design.md` — done marker
4. `docs/PROJECT_STATE.md` (aggiornamento solo al completamento)
5. `docs/CHECKPOINT.md` (aggiornamento solo al completamento)

## Ordine roadmap successivo a 0131

1. **0132** — Ollama Classifier/Planner Feasibility
2. **0133** — Cursor/Implementer Bridge Design

Cambi d'ordine solo tramite Decision Packet (kind: `meta` o `automation`).

## Conferma scope sessione corrente

- Nessun runtime modificato.
- Nessuna installazione CLI esterna.
- Nessun login, API key, VPS, n8n runtime, GitHub Actions.
- Nessun runner automatico.
- Nessun deploy, tag, rollback.
- Nessuna modifica app Alina (`src/**`, `gas-current/**`).
- `docs/INBOX.md` NON creato.
- `docs/PROJECT_STATE.md` NON aggiornato (lifecycle rule: solo al completamento del task).
- `docs/CHECKPOINT.md` NON aggiornato (lifecycle rule: solo al completamento del task).
- App **V1.9.2** stabile su `main`, tag `v1.9.2-stable`, deploy `@24`.

## File creati in questa sessione

| File | Tipo |
|------|------|
| `docs/tasks/queue/0131-n8n-decision-packet-generator-design.md` | Task queue |
| `docs/sessions/2026-05-12-create-task-0131-n8n-decision-packet-generator-design.md` | Questa sessione |
