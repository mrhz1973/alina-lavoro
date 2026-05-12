# Sessione — Autonomous Low-Touch Loop Design

**Data:** 2026-05-12  
**Task:** 0128-autonomous-low-touch-loop-design  
**Tipo:** low-touch-loop-docs-only  
**Eseguito da:** Windsurf/Cascade (implementatore di riserva/supervisionato)  
**Stato:** completato

## Gate Utente Ricevuto

> "Autorizzo l'esecuzione del task 0128 Autonomous Low-Touch Loop Design, solo docs-only, nessun runtime, nessuna installazione, nessuna esecuzione CLI, nessun login, nessuna API key, nessuna modifica VPS/n8n/app, nessuna GitHub Actions."

## Nota sul Prompt n8n

Il prompt generato da n8n in `docs/tasks/processing/0128-autonomous-low-touch-loop-design-cursor-prompt.md` è incompleto nelle sezioni Objective/Requirements/Expected output. Utilizzato solo come evidenza automation, NON come istruzione operativa principale.

## File Creati / Modificati

1. **docs/automation/autonomous-low-touch-loop-design.md** (nuovo)
   - Architettura target con flusso `GitHub → n8n → classifier/planner → implementatore → Decision Packet → utente`
   - 3 livelli di maturità: A (attuale), B (MVP), C (futuro semi-autonomo)
   - Tabella componenti con micro-interazioni eliminate, rischi, gate, fase
   - Sezioni: auto-aggio futuro, INBOX futura, riduzione copia/incolla, riduzione avvio manuale, riduzione traduzione
   - Decision Packet architetturale D-0128-A (scelta: quale componente MVP progettare prima)
   - Sequenza task 0129–0133 proposta

2. **docs/sessions/2026-05-12-autonomous-low-touch-loop-design.md** (questo file)

3. **docs/tasks/done/0128-autonomous-low-touch-loop-design.md** (nuovo)

4. **docs/PROJECT_STATE.md** (aggiornato)

5. **docs/CHECKPOINT.md** (aggiornato)

## Sintesi del Design

**Architettura target:**
```
GitHub → n8n → classifier/planner → implementatore → Decision Packet → utente
```

**3 livelli di maturità:**
- **A (Ora):** manuale-supervisionata con Decision Packet — n8n queue reader + prompt generator + session tracker operativi; ChatGPT genera DP; implementatori avviati manualmente; "aggio" manuale
- **B (MVP):** n8n genera draft DP; INBOX.md raccoglie decisioni; auto-aggio elimina scrittura manuale "aggio"; implementatori ancora manuali
- **C (Futuro):** classifier/planner (Ollama); implementatori avviati automaticamente; utente solo per DP e test fisici

**Cosa può essere automatico:** lettura queue, generazione sessione/prompt, draft Decision Packet, aggiornamento INBOX, rilevamento commit per auto-aggio, classificazione metadata (futuro Ollama)

**Gate manuali permanenti:** modifica app Alina, deploy, tag, rollback, VPS, n8n runtime, API key, login, GitHub Actions, costi ricorrenti, runner automatico su codice non revisionato, test fisici

## MVP Proposto

**Senza runtime aggiuntivo:**
1. Task file-based continua come fonte (invariato)
2. n8n continua a generare processing/sessione/prompt (invariato)
3. ChatGPT usa GitHub per generare Decision Packet (standardizzato con format 0127)
4. **INBOX.md** raccoglie DP pendenti → utente risponde con numero/parola corta
5. **Auto-aggio**: n8n rileva commit → stato aggiornato senza aggio manuale
6. Implementatori ancora manuali

**Micro-interazioni eliminate dall'MVP:** scrittura manuale "aggio" (5–10 al giorno), ricerca manuale DP pendenti, generazione manuale DP

## Sequenza Task Successiva Proposta

| ID | Titolo | Tipo | Micro-interaz. elim. |
|---|---|---|---|
| 0129 | Human Decision Inbox Design | docs-only | Ricerca decisioni pendenti |
| 0130 | Auto-Aggio Design | docs-only | Scrittura manuale "aggio" |
| 0131 | n8n Decision Packet Generator Design | docs-only | Generazione manuale DP |
| 0132 | Ollama Classifier/Planner Feasibility | docs-only | Triage manuale task |
| 0133 | Cursor/Implementer Bridge Design | mixed/runtime-gated | Avvio manuale implementatori |

## Decision Packet Prodotto

**D-0128-A** (Kind: automation) — Priorità primo step MVP:
- **Opzione 1:** INBOX.md prima (0129)
- **Opzione 2:** Auto-aggio prima (0130) — **RACCOMANDATO**
- **Opzione 3:** n8n DP Generator prima (0131)

Scelta richiesta all'utente: 1 / 2 / 3

## Conferme di Non-Interferenza

- ✅ Nessun runtime eseguito
- ✅ Nessuna installazione
- ✅ Nessuna esecuzione CLI
- ✅ Nessun login
- ✅ Nessuna API key configurata
- ✅ Nessuna modifica VPS
- ✅ Nessuna modifica n8n runtime
- ✅ Nessuna GitHub Actions
- ✅ Nessun runner automatico attivato
- ✅ App Alina V1.9.2 non toccata
- ✅ Nessun deploy / tag / rollback

---
**Sessione completata — Autonomous Low-Touch Loop Design definito; Decision Packet D-0128-A emesso**
