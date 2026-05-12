# Session — Task 0133: Ollama Classifier/Planner Feasibility (Post-Wiki)

**Data:** 2026-05-12  
**Tipo sessione:** task-completion  
**Task:** 0133-ollama-classifier-planner-feasibility-post-wiki  
**Implementatore:** Claude Code (locale, supervisionato)

---

## File creati

- `docs/automation/ollama-classifier-planner-feasibility-post-wiki.md` — documento di feasibility completo (10 sezioni)
- `docs/sessions/2026-05-12-ollama-classifier-planner-feasibility-post-wiki.md` — questa sessione
- `docs/tasks/done/0133-ollama-classifier-planner-feasibility-post-wiki.md` — done marker

## File aggiornati

- `docs/PROJECT_STATE.md` — aggiornamento leggero: task 0133 completato
- `docs/CHECKPOINT.md` — aggiornamento leggero: task 0133 completato, prossimo passo aggiornato
- `docs/roadmap.md` — aggiornamento leggero: feasibility Ollama completata
- `docs/LLMS.md` — aggiornamento: task state (last: 0133, next: Ollama Preflight o Implementer Bridge)
- `docs/wiki/current-state.md` — aggiornamento: task state aggiornato

---

## Highlights del documento di feasibility

### Raccomandazione

**PROCEDERE** con futuro task preflight runtime-gated ("0134 Ollama Local Preflight Install"), solo dopo Gate 7 (conferma manuale utente esplicita con Decision Packet dedicato).

### Cambiamento chiave post-wiki

Il classifier legge ora ~6–10k caratteri (LLMS.md + wiki/current-state.md + task file) invece di 47k+ (PROJECT_STATE completo). Riduzione input: ~80%. Questo rende un modello 7B adeguato per qualità accettabile, e MacBook Pro M2 (16 GB RAM unificata) sufficiente come hardware per il primo test.

### Architettura classifier

- **FA:** classifica tipo task, stima rischio, identifica gate, suggerisce implementatore, genera prompt skeleton
- **NON FA:** non sostituisce ChatGPT orchestratore, non autorizza azioni, non è fonte di verità
- **Input primario:** LLMS.md + wiki/current-state.md + file task (PROJECT_STATE solo fallback)
- **Output:** 9 campi strutturati (task_type, risk_level, gates_required, recommended_implementer, needs_decision_packet, can_auto_proceed, needs_human, prompt_skeleton, confidence)

### Modello consigliato

Qwen 2.5 7B su MacBook Pro M2 — ottima instruction following, multilingue IT/RU, 7B sostenibile su M2 con RAM unificata.

### 7 gate prima dell'installazione

Qualità (benchmark ≥90%/95%), Sicurezza (no credenziali), Hardware (RAM/latenza), Policy (output = suggerimento), Isolamento (offline inference), Supervisione (dry-run 10 task), Conferma utente (Decision Packet).

### Decision Packet

Non emesso — architettura univocamente determinata dai vincoli; raccomandazione chiara senza scelta tra alternative reali. Il gate 7 (conferma utente) sarà il momento in cui emettere un Decision Packet per il preflight runtime-gated.

---

## Vincoli rispettati

- Nessuna installazione Ollama
- Nessun download modelli
- Nessuna creazione embeddings reali
- Nessun database vettoriale
- Nessun avvio servizi locali
- Nessuna modifica app Alina
- Nessuna modifica VPS / n8n runtime / GitHub Actions
- Nessun deploy, tag, rollback
- Nessuna API key, login, credenziale, OAuth material, runner automatico
- `docs/INBOX.md` NON creato
- `docs/history/PROJECT_LOG.md` NON creato
- Nessuna modifica a `src/**`, `gas-current/**`, `.gas/**`, `appsscript.json`, `package.json`, `.clasp.json`, `.github/workflows/**`

---

## Prossimo passo raccomandato

**Prima di aprire task 0134:** Gate 7 richiede conferma manuale utente esplicita tramite Decision Packet (kind: `automation`) che documenta: macchina target (MacBook Pro M2), modello scelto (Qwen 2.5 7B), scope preflight, rischi residui. Solo dopo risposta utente affermativa, aprire task 0134 come runtime-gated.

**Alternativa se Gate 7 non viene attivato ora:** continuare con Implementer Bridge Design (task successivo nella roadmap) e rimandare il preflight Ollama a quando la roadmap lo prevede esplicitamente.

---

**Sessione chiusa — task 0133 completato, nessun runtime modificato.**
