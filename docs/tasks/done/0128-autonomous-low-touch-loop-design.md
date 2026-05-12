# Task — Autonomous Low-Touch Loop Design

## Metadata

- ID: 0128-autonomous-low-touch-loop-design
- Project: Alina Lavoro
- Type: low-touch-loop-docs-only
- Priority: high
- Status: **done**
- Created by: Orchestrator
- Completed by: Windsurf/Cascade (implementatore di riserva/supervisionato)
- Deploy: no
- Runtime: no

## Riferimenti

- **Task queue:** `docs/tasks/queue/0128-autonomous-low-touch-loop-design.md`
- **Sessione automation n8n (evidenza):** `docs/sessions/automation-0128-autonomous-low-touch-loop-design.md`
- **Prompt n8n (evidenza automation, incompleto):** `docs/tasks/processing/0128-autonomous-low-touch-loop-design-cursor-prompt.md`
- **Documento design:** `docs/automation/autonomous-low-touch-loop-design.md`
- **Sessione manuale:** `docs/sessions/2026-05-12-autonomous-low-touch-loop-design.md`
- **Prerequisito:** `docs/tasks/done/0127-decision-packet-format.md`

## Gate Ricevuto

> "Autorizzo l'esecuzione del task 0128 Autonomous Low-Touch Loop Design, solo docs-only, nessun runtime, nessuna installazione, nessuna esecuzione CLI, nessun login, nessuna API key, nessuna modifica VPS/n8n/app, nessuna GitHub Actions."

## Sintesi Risultato

**Architettura target del low-touch loop progettata** con:
- Flusso `GitHub → n8n → classifier/planner → implementatore → Decision Packet → utente`
- 3 livelli di maturità (A: attuale, B: MVP, C: futuro semi-autonomo)
- Tabella componenti con micro-interazioni eliminate, rischi, gate, fase
- Sezioni su auto-aggio futuro, INBOX futura, riduzione copia/incolla/avvio/traduzione
- Decision Packet architetturale D-0128-A emesso (scelta: quale componente MVP progettare prima)
- Sequenza 5 task successivi proposta (0129–0133)

## MVP Raccomandato

**Senza runtime aggiuntivo:**
1. Task file-based continua come fonte (invariato)
2. n8n continua a generare processing/sessione/prompt (invariato)
3. ChatGPT genera Decision Packet standardizzato (format 0127)
4. INBOX.md raccoglie DP pendenti
5. Auto-aggio: n8n rileva commit → stato aggiornato senza "aggio" manuale
6. Implementatori ancora manuali

## Sequenza Task Successiva Proposta

| ID | Titolo | Tipo | Micro-interaz. elim. | Gate |
|---|---|---|---|---|
| 0129 | Human Decision Inbox Design | docs-only | Ricerca decisioni pendenti | Nessuno |
| 0130 | Auto-Aggio Design | docs-only | Scrittura manuale "aggio" | Nessuno |
| 0131 | n8n Decision Packet Generator Design | docs-only | Generazione manuale DP | Nessuno |
| 0132 | Ollama Classifier/Planner Feasibility | docs-only | Triage manuale task | Nessuno |
| 0133 | Cursor/Implementer Bridge Design | mixed/runtime-gated | Avvio manuale implementatori | Runtime-gated |

## Decision Packet Emesso

**D-0128-A** (Kind: automation) — Priorità primo step MVP:
- Opzione 1: INBOX.md prima (0129)
- **Opzione 2: Auto-aggio prima (0130) — RACCOMANDATO**
- Opzione 3: n8n DP Generator prima (0131)

Scelta richiesta: 1 / 2 / 3

## Conferme di Non-Interferenza

- ✅ **Nessun runtime eseguito**
- ✅ **Nessuna installazione**
- ✅ **Nessuna esecuzione CLI**
- ✅ **Nessun login**
- ✅ **Nessuna API key configurata**
- ✅ **Nessuna modifica VPS**
- ✅ **Nessuna modifica n8n runtime**
- ✅ **Nessuna GitHub Actions**
- ✅ **Nessun runner automatico attivato**
- ✅ **App Alina V1.9.2 non toccata**
- ✅ **Nessun deploy / tag / rollback**

---
**Task 0128 completato — Autonomous Low-Touch Loop Design definitivo; foundation low-touch loop completa (0127 + 0128)**
