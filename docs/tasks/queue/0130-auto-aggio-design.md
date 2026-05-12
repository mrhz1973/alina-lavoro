# Task — Auto-Aggio Design

## Metadata

- ID: 0130-auto-aggio-design
- Project: Alina Lavoro
- Type: low-touch-loop-docs-only
- Priority: high
- Status: queued
- Created by: Orchestrator
- Deploy: no
- Runtime: no
- Manual gate: required before any future runtime, installazione, login, API key, VPS, n8n, GitHub Actions, deploy, tag, rollback o runner automatico

## Origine

Decisione utente **D-0128-A = 2** (vedi `docs/automation/autonomous-low-touch-loop-design.md`):
- Opzione 2 scelta: **Auto-Aggio prima** del MVP low-touch
- Motivazione: "aggio" è la micro-interazione più frequente del flusso attuale; eliminarla per task standard ha impatto immediato sulla quantità di interazioni quotidiane dell'utente

## Prerequisiti

- Task 0127 completato: Decision Packet Format canonico (`docs/automation/decision-packet-format.md`)
- Task 0128 completato: Autonomous Low-Touch Loop Design (`docs/automation/autonomous-low-touch-loop-design.md`)
- Regola lifecycle attiva: creazione task = queue + sessione; PROJECT_STATE/CHECKPOINT solo al completamento
- Criterio permanente attivo: "Quante micro-interazioni umane elimina?"

## Contesto Strategico

Nel flusso attuale, l'utente deve scrivere **"aggio"** dopo ogni esecuzione di task standard per segnalare che l'implementatore ha finito e ChatGPT può rileggere GitHub. Questa è la micro-interazione più frequente del loop:

- Frequenza stimata: 5–10 volte al giorno
- Carattere: meccanico, ripetitivo, senza contenuto decisionale
- Già verificabile da GitHub: il commit/push c'è ed è leggibile

**Auto-Aggio** è il meccanismo che sostituisce progressivamente questa richiesta manuale con rilevamento automatico dello stato da GitHub/n8n quando un task standard viene completato con commit/push visibile.

## Scopo del Task

Progettare il meccanismo Auto-Aggio: come ridurre/eliminare la scrittura manuale "aggio" mantenendo affidabilità del loop e fallback manuale quando serve.

**Criterio obbligatorio:** quante micro-interazioni umane elimina ciascuna soluzione proposta?

## Output da Produrre (solo alla futura esecuzione con gate separato)

1. **docs/automation/auto-aggio-design.md** — documento di progettazione
2. **docs/sessions/2026-05-12-auto-aggio-design.md** (o sessione datata equivalente)
3. **docs/tasks/done/0130-auto-aggio-design.md** — done marker
4. **docs/PROJECT_STATE.md** (aggiornamento solo al completamento)
5. **docs/CHECKPOINT.md** (aggiornamento solo al completamento)

## Aree di Progettazione Richieste

### 1. Definizione di "Auto-Aggio"

- Cosa significa Auto-Aggio nel contesto del progetto Alina Lavoro
- Differenza tra "aggio" manuale e Auto-Aggio
- Perimetro: cosa rientra, cosa resta manuale

### 2. Eventi GitHub che possono sostituire "aggio" manuale

- Commit su `main` con messaggio convenzionale (es. `docs:`, `feat:`, `fix:`)
- Push completato
- Apertura/chiusura PR
- Creazione/spostamento file in `docs/tasks/done/`
- Aggiunta sessione in `docs/sessions/`
- Stato workflow n8n (queue → processing → done/failed)

### 3. Come n8n può rilevare commit/push/task done

- Polling già esistente su queue (estensione possibile)
- Webhook GitHub (richiede gate runtime separato)
- Lettura periodica di `docs/tasks/done/` e `docs/sessions/`
- Confronto stato precedente vs corrente

### 4. Distinguere stati

| Stato | Indicatori | Azione |
|---|---|---|
| Completato | done marker + sessione + commit | Auto-aggio + notifica passiva |
| Fallito | failed marker + sessione errore | Notifica attiva + Decision Packet recovery |
| Incompleto | processing senza done dopo timeout | Notifica attiva + check manuale |
| Ambiguo | commit ma nessun marker | Fallback "aggio" manuale |

### 5. Quando "aggio" manuale resta necessario (fallback)

- Errore locale non committato
- Lavoro in Plan Mode senza commit
- Ambiguità sul risultato dell'implementatore
- Task con scope non standard
- Task con gate manuale espresso (deploy, tag, rollback, modifica app, VPS)
- Stato n8n non sincronizzato

### 6. Come evitare falsi positivi

- Verificare presenza done marker, non solo commit generico
- Distinguere commit di automation (n8n) da commit di completamento task
- Soglia di silenzio prima di considerare un task chiuso (es. nessun commit per N minuti dopo done marker)
- Verifica integrità: done marker → riferimento sessione → riferimento documento prodotto

### 7. Riepilogo automatico post-task

Quando Auto-Aggio rileva un task completato, deve generare un riepilogo conciso:
- Task ID e titolo
- File modificati
- Hash commit
- Documenti prodotti (con link)
- Decision Packet emessi (se presenti)
- Prossimo passo suggerito
- Eventuali rischi/note dall'implementatore

### 8. Notifica utente solo per decisioni vere

- Nessuna notifica per task standard completati senza decisione
- Notifica per: nuovo Decision Packet emesso, task fallito, task ambiguo, gate manuale richiesto
- Canale notifica: da progettare (file `docs/STATUS.md`, INBOX.md, oppure altro)

### 9. Compatibilità con Decision Packet Format

- Auto-Aggio non sostituisce il Decision Packet
- Quando l'implementatore emette un Decision Packet, Auto-Aggio lo rileva e lo segnala
- Decision Packet pendenti possono essere accodati in INBOX.md (componente futuro 0129)

### 10. Preservare gate manuali permanenti

Auto-Aggio NON deve mai bypassare:
- Modifica app Alina
- Deploy Apps Script
- Tag git
- Rollback
- Modifica VPS
- Modifica n8n runtime
- Introduzione API key / login / GitHub Actions
- Costi ricorrenti nuovi

Per questi, anche se il commit è visibile, il loop deve fermarsi e richiedere conferma esplicita.

### 11. Nessuna modifica n8n runtime in questo task docs-only

Il task 0130 è esclusivamente progettazione documentale. L'implementazione effettiva di Auto-Aggio in n8n richiederà task runtime-gated separato con gate manuale esplicito.

## Struttura del Documento Futuro Richiesta

Il documento `docs/automation/auto-aggio-design.md` deve contenere:

1. **Architettura target Auto-Aggio**
2. **Flusso step-by-step** (dal commit dell'implementatore al riepilogo automatico)
3. **Fonti di verità GitHub da leggere** (queue, processing, done, failed, sessioni)
4. **Stati possibili** (tabella stato → indicatori → azione)
5. **Failure modes** (tabella rischio → probabilità → impatto → mitigazione)
6. **Fallback manuale** (quando "aggio" resta necessario)
7. **Micro-interazioni eliminate** (lista quantificata)
8. **Rischi** (analisi dettagliata)
9. **Proposta MVP** (cosa è realizzabile senza runtime aggiuntivo / cosa richiede runtime-gated)
10. **Eventuale Decision Packet** (se emerge una scelta reale tra alternative)

## Uso del Decision Packet Format

Il task futuro deve usare il Decision Packet Format (da `docs/automation/decision-packet-format.md`) per ogni scelta architetturale che richieda decisione umana, includendo:
- Campo `kind` in posizione 2 (per questo task: `automation`)
- Criterio "micro-interazioni umane eliminate"
- Massimo 3–5 opzioni
- Raccomandazione esplicita dell'orchestratore

## Ordine Roadmap Successivo a 0130

Dopo il completamento di 0130, l'ordine atteso dei task del MVP low-touch è:

1. **0129** — Human Decision Inbox Design
2. **0131** — n8n Decision Packet Generator Design
3. **0132** — Ollama Classifier/Planner Feasibility
4. **0133** — Cursor/Implementer Bridge Design

**Nota:** se in futuro emerge una ragione per cambiare quest'ordine, la proposta deve essere presentata tramite **Decision Packet** (formato canonico, kind: `meta` o `automation`), **non** come commento libero in chat. Questo preserva la disciplina low-touch e la tracciabilità delle decisioni architetturali.

## Allowed Paths (futura esecuzione)

- docs/automation/auto-aggio-design.md
- docs/sessions/2026-05-12-auto-aggio-design.md (o datata equivalente)
- docs/tasks/done/0130-auto-aggio-design.md
- docs/PROJECT_STATE.md (solo al completamento)
- docs/CHECKPOINT.md (solo al completamento)

## Forbidden Paths (sempre)

- src/**
- gas-current/**
- .gas/**
- appsscript.json
- package.json
- .clasp.json
- .github/workflows/**
- docs/automation/n8n-workflows/**
- docs/tasks/queue/**
- docs/tasks/processing/**
- docs/tasks/failed/**
- export JSON n8n non redatti
- file con credenziali, token, chiavi, OAuth material, sessioni locali o URL raw sensibili

## Note Operative

- Nessuna azione runtime in questo step
- Nessuna modifica app Alina
- Nessuna modifica VPS/n8n/GitHub Actions
- Il documento futuro è progettazione docs-only: nessun runner automatico attivato
- L'attivazione effettiva di Auto-Aggio in n8n richiede task runtime-gated separato con gate manuale esplicito
- Auto-Aggio deve preservare i gate manuali permanenti per operazioni rischiose

---
**Task creato — Auto-Aggio Design in attesa di gate manuale per esecuzione**
