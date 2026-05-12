# Task — Human Decision Inbox Design

## Metadata

- ID: 0129-human-decision-inbox-design
- Project: Alina Lavoro
- Type: low-touch-loop-docs-only
- Priority: high
- Status: queued
- Created by: Orchestrator
- Deploy: no
- Runtime: no
- Manual gate: required before any future runtime, installazione, login, API key, VPS, n8n, GitHub Actions, deploy, tag, rollback o runner automatico

## Origine

Prossimo passo determinato dopo il completamento di:
- Task 0127 (Decision Packet Format)
- Task 0128 (Autonomous Low-Touch Loop Design)
- Task 0130 (Auto-Aggio Design)

Ordine roadmap confermato in `docs/automation/auto-aggio-design.md` e `docs/tasks/done/0130-auto-aggio-design.md`.

## Prerequisiti

- Decision Packet Format canonico (`docs/automation/decision-packet-format.md`)
- Autonomous Low-Touch Loop Design (`docs/automation/autonomous-low-touch-loop-design.md`)
- Auto-Aggio Design (`docs/automation/auto-aggio-design.md`)
- Regola lifecycle attiva: creazione task = queue + sessione; PROJECT_STATE/CHECKPOINT solo al completamento
- Criterio permanente attivo: "Quante micro-interazioni umane elimina?"

## Contesto Strategico

Nel flusso attuale, le decisioni che richiedono l'utente sono **disperse**: alcune in chat con ChatGPT, altre in commit GitHub, altre in sessioni manuali, altre in prompt n8n, altre in messaggi di canale. L'utente deve cercare attivamente "cosa devo decidere?" — questa è una micro-interazione invisibile ma costante.

La **Human Decision Inbox** è il luogo unico, file-based, dove il progetto accoda le decisioni che richiedono davvero intervento dell'utente. È il complemento di Auto-Aggio: Auto-Aggio decide quando una notifica è necessaria; INBOX decide dove la notifica va a vivere.

## Scopo del Task

Progettare la Human Decision Inbox: struttura, formato, regole di accodamento, integrazione con Decision Packet Format, Auto-Aggio e n8n. Esclusivamente progettazione documentale, senza modifiche runtime e senza creare il file INBOX effettivo.

**Criterio obbligatorio:** quante micro-interazioni umane elimina ciascuna scelta architetturale?

## Output da Produrre (solo alla futura esecuzione con gate separato)

1. **docs/automation/human-decision-inbox-design.md** — documento di progettazione
2. **docs/sessions/2026-05-12-human-decision-inbox-design.md** (o sessione datata equivalente)
3. **docs/tasks/done/0129-human-decision-inbox-design.md** — done marker
4. **docs/PROJECT_STATE.md** (aggiornamento solo al completamento)
5. **docs/CHECKPOINT.md** (aggiornamento solo al completamento)

**NOTA:** in questo task NON si crea `docs/INBOX.md` o file equivalente. Si progetta solo.

## Aree di Progettazione Richieste

### 1. Definizione di Human Decision Inbox

- Cosa significa nel contesto del progetto Alina Lavoro
- Differenza tra INBOX e log generico (sessioni, commit, automation)
- Confine: cosa va in INBOX, cosa NON va

### 2. Scelta della struttura file-based

Valutare e proporre:
- **Opzione A:** singolo file `docs/INBOX.md` con sezioni Pending / Decided / Deferred / Superseded
- **Opzione B:** directory `docs/inbox/` con un file per decisione (es. `D-NNNN-X.md`) + indice
- **Opzione C:** altra struttura (es. `docs/automation/inbox/` con pending/archive subdirs)

Se emerge una scelta reale tra alternative, **produrre Decision Packet** secondo `docs/automation/decision-packet-format.md`.

### 3. Accodamento Decision Packet pendenti

- Come un Decision Packet emesso (da ChatGPT o n8n) viene aggiunto alla INBOX
- Formato di accodamento: copia integrale del DP, riferimento, oppure entrambi
- Ordine: cronologico, per priorità, per kind
- Limite: quanti DP pendenti possono coesistere prima di essere considerati congestione

### 4. Schema di stato delle decisioni

Stati minimi:
- **pending** — DP emesso, in attesa di risposta
- **decided** — utente ha risposto; opzione scelta registrata
- **deferred** — utente ha rimandato esplicitamente; richiede follow-up
- **superseded** — DP sostituito da altro DP successivo (es. cambio contesto)

Per ogni stato definire: indicatore visibile, transizioni ammesse, archiviazione.

### 5. Risposta utente con numero o parola corta

- Formato risposta: `D-NNNN-X = 2`, oppure `2`, oppure parola corta convenzionale
- Dove viene scritta la risposta: file INBOX, file separato `docs/INBOX-RESPONSES.md`, commit message, altro
- Come si distingue una risposta da rumore (commenti, draft)

### 6. Lettura risposta da parte del sistema

- Come ChatGPT (livello immediato) riconosce la risposta
- Come n8n (livello automatizzato futuro) la legge
- Come si trasforma una risposta in azione (es. creazione task successivo)
- Compatibilità con Auto-Aggio: la risposta è un evento che Auto-Aggio rileva

### 7. Evitare rumore e notifiche inutili

- Solo decisioni vere in INBOX
- Niente status update, niente progress log, niente sessioni di automation
- Soglia: se in dubbio, non accodare
- Distinzione INBOX (decisioni richieste) vs futuro `docs/STATUS.md` (stato passivo)

### 8. Integrazione Auto-Aggio

- Auto-Aggio rileva DP nei documenti prodotti dai task → li accoda automaticamente in INBOX
- Auto-Aggio rileva risposta utente in INBOX → segnala completamento decisione
- Auto-Aggio NON bypassa gate manuali, anche se la risposta sembra univoca

### 9. Integrazione Decision Packet Format

- Ogni elemento INBOX deve **usare o referenziare** il Decision Packet Format canonico
- Campo `kind` (alina-feature / automation / infra / meta) deve restare visibile nella **stessa posizione** del DP (posizione 2, dopo Decision ID)
- Decision ID resta riferimento canonico
- Compatibilità retroattiva: DP già emessi (es. D-0128-A) possono essere migrati in INBOX

### 10. Gate manuali permanenti

INBOX **non bypassa mai**:
- Modifica app Alina, deploy, tag, rollback
- Modifica VPS, n8n runtime
- Introduzione API key, login, GitHub Actions
- Costi ricorrenti nuovi
- Runner automatico
- Test fisico reale
- Dati personali / credenziali

Per questi, anche con risposta utente in INBOX, serve gate esplicito separato (Decision Packet con `kind: infra` o conferma manuale).

### 11. Storico decisioni

- Decisioni `decided` / `deferred` / `superseded` non devono confondere quelle `pending`
- Strategia archiviazione:
  - In-place con sezione separata
  - Archive file separato (es. `docs/INBOX-ARCHIVE.md` o `docs/inbox/archive/`)
  - Cronologia leggibile per audit
- Retention: tutte le decisioni restano tracciabili (no deletion)

### 12. Evitare dati sensibili o credenziali

- Mai documentare in INBOX: token, credenziali, OAuth material, sessioni locali, URL raw con query/token, download_url sensibili
- Se un DP riguarda credenziali, in INBOX va solo il riferimento all'azione, non i dati
- Linee guida esplicite per redazione

## Struttura del Documento Futuro Richiesta

Il documento `docs/automation/human-decision-inbox-design.md` deve contenere:

1. **Architettura file-based della inbox** (file singolo / directory / altra struttura)
2. **Template Markdown** dell'elemento INBOX (basato su Decision Packet Format)
3. **Schema di stato** (pending / decided / deferred / superseded) con transizioni
4. **Regole di accodamento** (chi accoda, quando, in che formato)
5. **Regole di archiviazione** (quando, dove, come)
6. **Compatibilità con Auto-Aggio** (rilevamento DP, lettura risposta)
7. **Compatibilità con n8n** (cosa può fare ora, cosa richiede runtime futuro)
8. **Compatibilità con Decision Packet Format** (riferimento canonico, campo kind)
9. **Micro-interazioni eliminate** (lista quantificata)
10. **Rischi e fallback** (cosa fallisce, come si recupera)
11. **MVP proposto** (cosa è realizzabile subito senza runtime; cosa richiede task runtime-gated futuro)
12. **Eventuale Decision Packet** se emerge scelta reale tra alternative architetturali (es. opzione A/B/C struttura)

## Requisiti Specifici

- INBOX contiene **solo decisioni vere**, non log generici
- Ogni elemento usa o referenzia il **Decision Packet Format**
- Campo `kind` resta visibile nella **stessa posizione** del DP
- Utente risponde con **numero o parola corta**
- Decisioni già prese **archiviate o marcate** senza confondere quelle pendenti
- Nessuna automazione runtime in questo task
- **Non creare** `docs/INBOX.md` (o equivalente) in questo task; il task 0129 progetta soltanto
- Se emerge scelta reale tra formati, **produrre Decision Packet**

## Uso del Decision Packet Format

Il task futuro deve usare il Decision Packet Format (`docs/automation/decision-packet-format.md`) per ogni scelta architetturale che richieda decisione umana, con:
- Campo `kind` in posizione 2 (per questo task: `automation`)
- Criterio "micro-interazioni umane eliminate"
- Massimo 3–5 opzioni
- Raccomandazione esplicita orchestratore

## Ordine Roadmap Successivo a 0129

Dopo il completamento di 0129, l'ordine atteso resta:

1. **0131** — n8n Decision Packet Generator Design
2. **0132** — Ollama Classifier/Planner Feasibility
3. **0133** — Cursor/Implementer Bridge Design

**Disciplina:** eventuali cambi futuri di quest'ordine devono passare da **Decision Packet** (kind: `meta` o `automation`), non da commenti liberi in chat.

## Allowed Paths (futura esecuzione)

- docs/automation/human-decision-inbox-design.md
- docs/sessions/2026-05-12-human-decision-inbox-design.md (o datata equivalente)
- docs/tasks/done/0129-human-decision-inbox-design.md
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
- file con credenziali, token, chiavi, OAuth material, sessioni locali, download_url sensibili o URL raw con query/token
- creazione effettiva di `docs/INBOX.md` o file equivalente (riservata a task successivo runtime/mixed gate)

## Note Operative

- Nessuna azione runtime in questo step
- Nessuna modifica app Alina
- Nessuna modifica VPS/n8n/GitHub Actions
- Il documento futuro è progettazione docs-only: nessun runner automatico attivato
- L'attivazione effettiva della INBOX (creazione file + integrazione n8n) richiederà task runtime-gated o mixed separato con gate manuale esplicito
- INBOX deve preservare gate manuali permanenti per operazioni rischiose

---
**Task creato — Human Decision Inbox Design in attesa di gate manuale per esecuzione**
