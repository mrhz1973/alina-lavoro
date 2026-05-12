# Sessione — LLM Wiki / Token Efficiency Design (2026-05-12)

**Data:** 2026-05-12  
**Task:** 0132-llm-wiki-token-efficiency-design  
**Tipo:** low-touch-loop-docs-only  
**Stato:** completato

---

## Contesto

Task 0131 (n8n Decision Packet Generator Design) completato. La roadmap originale prevedeva "0132 Ollama Classifier/Planner Feasibility" come passo successivo. Prima di arrivare a runtime Ollama, è stata identificata una priorità più urgente e ad impatto più alto: ridurre il consumo di token e le letture ripetute per tutti gli agenti che operano sul progetto.

Il progetto aveva accumulato:
- `docs/PROJECT_STATE.md` > 47 k caratteri — warning performance attivo in Claude Code.
- Più documenti canonici caricati integralmente a ogni avvio agente.
- Nessuno strato di memoria sintetica derivata AI-friendly per ridurre il carico di contesto.

---

## Risultato

Strato LLM Wiki / Local AI Level 2 progettato e implementato in docs-only.

**Principio invariante:** GitHub e i documenti canonici restano fonte di verità. La wiki è memoria derivata. Se wiki e canonici divergono, vincono i canonici.

---

## File Creati

| File | Scopo | Linee |
|------|-------|-------|
| `docs/automation/local-llm-wiki-token-efficiency-design.md` | Design document completo (13 sezioni) | ~250 |
| `docs/LLMS.md` | Entry point compatto per agenti | ≤ 200 |
| `docs/wiki/README.md` | Indice wiki con gerarchia memoria | ~40 |
| `docs/wiki/current-state.md` | Snapshot stato corrente | ≤ 100 |
| `docs/wiki/token-efficiency.md` | Guida navigazione per agenti | ~80 |

---

## File Aggiornati

| File | Modifica |
|------|----------|
| `CLAUDE.md` | Aggiunta riga: "Per fast context, leggi docs/LLMS.md prima" in required reading |
| `docs/PROJECT_STATE.md` | Aggiornamento "Ultimo aggiornamento" con completamento task 0132 |
| `docs/CHECKPOINT.md` | Aggiornamento con completamento task 0132 |
| `docs/roadmap.md` | Aggiornamento sezione Automation con wiki completata |

---

## Design Highlights

### Gerarchia memoria (4 livelli)

| Livello | File | Autorità |
|---------|------|----------|
| 0 — Regole | ORCHESTRATOR_RULES.md, AI_RULES.md, WORKFLOW.md, COMMANDS.md | Canonici permanenti |
| 1 — Stato | PROJECT_STATE.md, CHECKPOINT.md | Canonici — stato autorevole |
| 2 — Wiki | LLMS.md, docs/wiki/ | Derivati — accesso veloce |
| 3 — Futuro | Ollama / embeddings | Runtime-gated, non ora |

### Stima token risparmiati

| Scenario | Risparmio stimato |
|----------|-----------------|
| Agente legge stato per nuovo task | ~70–80% |
| ChatGPT ricostruisce stato dopo aggio | ~50–60% |
| Claude Code start sessione | ~40–50% |
| n8n genera prompt da template | ~30–40% |

### Piano futuro hardware (non attivato)

- **MacBook Pro M2** → orchestratore always-on, Ollama 7B/8B
- **RTX 3060 12GB** → AI locale più pesante, fino a 14B
- **VPS IONOS** → n8n runtime, non LLM inference

---

## Decision Packet

Non emesso. L'architettura è univocamente determinata dai vincoli attuali (docs-only, zero runtime, compatibilità con lo stack low-touch esistente). Non emerge scelta reale tra alternative equivalenti.

---

## Vincoli Rispettati

- Nessun runtime modificato.
- Nessuna app Alina modificata.
- Nessun VPS, n8n runtime, GitHub Actions, runner automatico.
- Nessuna installazione Ollama.
- Nessuna creazione embeddings reali.
- Nessun deploy, tag, rollback.
- `docs/INBOX.md` NON creato.
- `docs/history/PROJECT_LOG.md` NON creato.

---

## Prossimo Passo

Ollama Classifier/Planner Feasibility — riformulato post-wiki.  
Il wiki layer fornisce la base di contesto compatto che il futuro classifier Ollama consumerà.

---
**Sessione task 0132 completata. Workspace pulito atteso.**
