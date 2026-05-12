# Task — Autonomous Low-Touch Loop Design

## Metadata

- ID: 0128-autonomous-low-touch-loop-design
- Project: Alina Lavoro
- Type: low-touch-loop-docs-only
- Priority: high
- Status: queued
- Created by: Orchestrator
- Deploy: no
- Runtime: no
- Manual gate: required before any future runtime, installazione, login, API key, VPS, n8n, GitHub Actions, deploy, tag, rollback o runner automatico

## Prerequisiti

- Task 0127 completato: Decision Packet Format canonico disponibile in `docs/automation/decision-packet-format.md`
- Regola lifecycle attiva: creazione task = queue + sessione; PROJECT_STATE/CHECKPOINT solo al completamento
- Criterio permanente attivo: "Quante micro-interazioni umane elimina?"

## Contesto Strategico

Il task 0127 ha definito il formato del Decision Packet — il pacchetto decisionale che il loop deve presentare all'utente. Il passo successivo è progettare il loop stesso: l'architettura del sistema autonomo asincrono a basso touch che elimina le micro-interazioni meccaniche dell'utente.

Micro-interazioni da eliminare:
- ❌ Copiare prompt
- ❌ Incollare prompt
- ❌ Avviare implementatori
- ❌ Scrivere "aggio"
- ❌ Tradurre fra orchestratore e implementatore

L'utente deve restare responsabile solo di:
- ✅ A. Scegliere fra opzioni proposte con numero o parola corta
- ✅ B. Eseguire prove fisiche realmente necessarie

## Scopo del Task

Progettare il loop autonomo asincrono a basso touch, partendo dal Decision Packet Format già definito, con l'obiettivo di ridurre le micro-interazioni umane dell'utente.

Criterio obbligatorio per ogni componente proposto: **quante micro-interazioni umane elimina?**

## Output da Produrre (solo alla futura esecuzione con gate separato)

1. **docs/automation/autonomous-low-touch-loop-design.md** — documento di progettazione architetturale
2. **docs/sessions/2026-05-12-autonomous-low-touch-loop-design.md** (o sessione datata equivalente)
3. **docs/tasks/done/0128-autonomous-low-touch-loop-design.md** — done marker
4. **docs/PROJECT_STATE.md** (aggiornamento solo al completamento)
5. **docs/CHECKPOINT.md** (aggiornamento solo al completamento)

## Aree di Progettazione Richieste

### 1. Flusso principale

Progettare il flusso end-to-end:

```
GitHub → n8n → classifier/planner → implementatore → Decision Packet → utente
```

Con dettaglio su:
- Trigger: come il loop si attiva (webhook GitHub, schedule n8n, manuale)
- Lettura task queue da GitHub
- Routing verso implementatore corretto
- Generazione Decision Packet se serve scelta umana
- Aggiornamento stato (queue → processing → done/failed)
- Notifica utente

### 2. Ruolo di ChatGPT orchestratore

- Come e quando interviene
- Cosa decide autonomamente
- Cosa porta all'utente come Decision Packet
- Come viene sostituito/affiancato da componenti automatici nel tempo
- Compatibilità con "aggio" e futuro auto-aggio

### 3. Ruolo di n8n

- Queue reader (già operativo)
- Session tracker
- Generatore eventi (webhook, schedule)
- Generatore Decision Packet automatici
- Inoltro task a implementatori
- Tracking stato processing/done/failed

### 4. Ruolo degli implementatori supervisionati

- Claude Code: quando usarlo, come riceve task, come riporta risultato
- Windsurf/Cascade: quando usarlo come riserva
- Cursor: quando tornerà operativo post-reset, ruolo atteso
- Come ridurre il bisogno di avvio manuale
- Come ridurre il bisogno di copia/incolla prompt

### 5. Ruolo futuro possibile di Ollama

- Come planner/classifier locale zero-API
- Quali task potrebbe gestire autonomamente
- Soglia qualità per affidamento senza supervisione umana
- Micro-interazioni eliminate se Ollama funziona come planner

### 6. Human Decision Inbox futura

- Struttura: file INBOX.md o equivalente
- Come vengono accodati i Decision Packet in attesa di risposta utente
- Come l'utente risponde (numero/parola corta)
- Come il sistema legge la risposta e avanza
- Compatibilità con n8n

### 7. Sostituzione progressiva del comando manuale "aggio"

- Come il sistema ottiene lo stato aggiornato senza che l'utente scriva "aggio"
- Trigger automatici per sincronizzazione stato
- Fallback: quando "aggio" manuale resta necessario

### 8. Riduzione copia/incolla prompt

- Come il sistema genera e consegna prompt agli implementatori senza intervento umano
- Ruolo di n8n nel generare prompt
- Ruolo di file template nel repo

### 9. Riduzione avvio manuale implementatori

- Come il sistema attiva implementatori senza che l'utente li avvii manualmente
- Ruolo di n8n nell'attivazione
- Gate manuali residui giustificati

### 10. Riduzione traduzione orchestratore/implementatore

- Come il formato task file-based (docs/tasks/queue/) elimina traduzione
- Come i template standardizzati eliminano disambiguazione
- Come il Decision Packet elimina domande intermedie

### 11. Gate permanenti da preservare

Anche nel loop completamente automatico, questi gate restano manuali:
- Modifiche app Alina
- Deploy
- Tag
- Rollback
- Modifiche VPS
- Modifiche n8n runtime
- Introduzione API key
- Introduzione login
- Introduzione runtime
- Introduzione GitHub Actions
- Costi ricorrenti nuovi

### 12. Fallback manuale

- Se il loop automatico fallisce, come torna alla modalità manuale supervisionata
- Come l'utente prende il controllo
- Come si documenta il fallback
- Come si riprende il loop dopo il fallback

## Struttura del Documento Futuro Richiesta

Il documento `docs/automation/autonomous-low-touch-loop-design.md` deve contenere:

1. **Architettura target** — diagramma/descrizione del sistema completo
2. **Flusso step-by-step** — sequenza operativa dettagliata
3. **Componenti minimi (MVP)** — cosa serve per il primo loop funzionante
4. **Componenti futuri** — cosa si aggiunge nelle fasi successive
5. **Confini docs-only / mixed / runtime-gated** — cosa si può fare ora, cosa richiede gate
6. **Cosa può essere automatico** — lista componenti automatizzabili
7. **Cosa deve restare gate umano** — lista gate permanenti e giustificazione
8. **Primo MVP realistico** — descrizione concreta del minimo funzionante
9. **Sequenza task successiva proposta** — task 0129, 0130, ecc.
10. **Rischi e fallback** — analisi rischi e strategie di fallback

## Uso del Decision Packet Format

Il task futuro deve usare il Decision Packet Format (da `docs/automation/decision-packet-format.md`) per ogni scelta architetturale che richieda decisione umana, includendo:
- Il campo `kind` in posizione 2 (per questo task: `automation`)
- Il criterio "micro-interazioni umane eliminate"
- Massimo 3–5 opzioni per Decision Packet
- Raccomandazione esplicita dell'orchestratore

## Allowed Paths (futura esecuzione)

- docs/automation/autonomous-low-touch-loop-design.md
- docs/sessions/2026-05-12-autonomous-low-touch-loop-design.md (o datata equivalente)
- docs/tasks/done/0128-autonomous-low-touch-loop-design.md
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
- Il loop autonomo effettivo richiederà task runtime-gated separati con gate manuali espliciti
- La progettazione deve essere realistica rispetto allo stato attuale: modalità manuale-supervisionata è la baseline (decisione 0124)

---
**Task creato — Autonomous Low-Touch Loop Design in attesa di gate manuale per esecuzione**
