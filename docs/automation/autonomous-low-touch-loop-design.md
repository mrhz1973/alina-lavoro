# Autonomous Low-Touch Loop Design — Fase Low-Touch

**Data:** 2026-05-12  
**Task:** 0128-autonomous-low-touch-loop-design  
**Tipo:** low-touch-loop-docs-only  
**Stato:** completato

---

## Executive Summary

Il loop autonomo asincrono a basso touch è l'architettura che riduce progressivamente le micro-interazioni meccaniche dell'utente: copiare prompt, incollare prompt, avviare implementatori, scrivere "aggio", tradurre tra orchestratore e implementatore. Il design si articola in 3 livelli di maturità (A: manuale-supervisionata con Decision Packet, B: MVP low-touch, C: futuro semi-autonomo) e definisce cosa può essere automatico, cosa deve restare gate umano, e un primo MVP realistico senza runtime immediato.

**Criterio permanente per ogni componente:** "Quante micro-interazioni umane elimina?"

---

## Contesto

- Task 0127 completato: Decision Packet Format canonico in `docs/automation/decision-packet-format.md`
- Fase strategica corrente: low-touch loop
- Modalità operativa baseline: manuale-supervisionata (decisione 0124 confermata da 0126)
- Implementatore principale: Claude Code locale; riserva: Windsurf/Cascade; Cursor sospeso fino al reset
- n8n: queue reader / prompt generator / session tracker già operativo
- App Alina V1.9.2 stabile, fuori scope

---

## Obiettivo

Progettare il flusso target:

```
GitHub → n8n → classifier/planner → implementatore → Decision Packet → utente
```

Obiettivo operativo: l'utente esegue solo:
- A. scelte con numero/parola corta (Decision Packet)
- B. prove fisiche realmente necessarie

---

## Principi del Loop

1. **GitHub è fonte di verità** — tutto passa dal repo
2. **Asincronicità** — il loop non richiede presenza dell'utente per avanzare
3. **Micro-interazioni eliminate** — ogni componente deve ridurre azioni meccaniche umane
4. **Gate manuali permanenti** — le operazioni rischiose restano sempre manuali
5. **Fallback graceful** — se il loop fallisce, torna alla modalità manuale senza perdita di stato
6. **Decision Packet come interfaccia** — l'utente interagisce solo tramite decisioni strutturate
7. **Nessun runner automatico ora** — il design è docs-only; l'attivazione richiede task runtime-gated separati

---

## Architettura Target

```
┌─────────────────────────────────────────────────────────────────┐
│  GITHUB (fonte di verità)                                        │
│  docs/tasks/queue/     → task in attesa                         │
│  docs/tasks/processing/ → task in esecuzione                    │
│  docs/tasks/done/      → task completati                        │
│  docs/tasks/failed/    → task falliti                           │
│  docs/sessions/        → log sessioni                           │
│  docs/INBOX.md (futuro) → Decision Packet in attesa risposta    │
└────────────────────┬────────────────────────────────────────────┘
                     │ polling / webhook
┌────────────────────▼────────────────────────────────────────────┐
│  n8n                                                             │
│  - queue reader (operativo)                                      │
│  - schedule polling (operativo)                                  │
│  - session tracker                                               │
│  - prompt generator                                              │
│  - futuro: Decision Packet generator                             │
│  - futuro: auto-aggio trigger                                    │
└──────────┬──────────────────────┬───────────────────────────────┘
           │                      │
┌──────────▼──────────┐  ┌────────▼────────────────────────────── ┐
│  ChatGPT            │  │  Classifier/Planner (futuro)            │
│  orchestratore      │  │  - Ollama locale zero-API               │
│  - lettura GitHub   │  │  - triage metadata sintetici            │
│  - generazione DP   │  │  - suggerimento implementatore          │
│  - decisioni        │  │  - fase: futuro                         │
│  - review layer     │  └─────────────────────────────────────────┘
└──────────┬──────────┘
           │
┌──────────▼──────────────────────────────────────────────────────┐
│  Implementatori supervisionati                                   │
│  - Claude Code locale (principale)                               │
│  - Windsurf/Cascade (riserva)                                    │
│  - Cursor post-reset (futuro)                                    │
│  - Cursor CLI (futuro runtime-gated)                             │
└──────────┬──────────────────────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────────────────┐
│  Decision Packet → Utente                                        │
│  - struttura canonica 13 campi                                   │
│  - risposta: numero / parola corta                               │
│  - futuro: INBOX.md per accodamento decisioni                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Flusso Step-by-Step

### Fase A — Attuale (manuale-supervisionata con Decision Packet)

1. **Utente/orchestratore crea task** in `docs/tasks/queue/`
2. **n8n legge queue** via polling, sposta in processing, genera sessione automation + prompt
3. **ChatGPT orchestratore** legge GitHub (`aggio`), prepara prompt implementatore
4. **Utente copia prompt** e lo passa all'implementatore (Claude Code / Windsurf)
5. **Implementatore esegue** e committà su GitHub
6. **Utente scrive `aggio`** per segnalare completamento
7. **ChatGPT legge GitHub**, genera Decision Packet se serve scelta
8. **Utente risponde** con numero/parola corta

**Micro-interazioni ancora presenti:** 4, 6 (copia/incolla prompt, aggio manuale)

---

### Fase B — MVP Low-Touch (obiettivo prossimo)

1. **Task in queue** (invariato)
2. **n8n legge queue**, sposta in processing, genera sessione + prompt (invariato)
3. **n8n genera draft Decision Packet** quando il task richiede scelta
4. **ChatGPT completa o valida il Decision Packet** (diventa review layer, non generatore)
5. **Decision Packet pubblicato in INBOX.md** o notifica canale dedicato
6. **Utente risponde** con numero/parola corta (invariato — è gate intentionale)
7. **n8n / ChatGPT** attiva implementatore selezionato
8. **Implementatore esegue** e committà su GitHub
9. **n8n rileva commit/push**, aggiorna stato automaticamente
10. **`aggio` eliminato** — lo stato viene aggiornato senza richiesta manuale

**Micro-interazioni eliminate:** copia/incolla prompt, aggio manuale  
**Gate residui intentionali:** risposta utente a Decision Packet, test fisici

---

### Fase C — Futuro Semi-Autonomo

1. **Trigger automatico** (GitHub webhook o schedule n8n)
2. **Classifier/planner (Ollama)** analizza task, suggerisce tipo + implementatore
3. **n8n genera Decision Packet** (se serve scelta) o avanza automaticamente (se task già classificato e non ambiguo)
4. **Utente risponde** solo se il Decision Packet richiede decisione reale
5. **Implementatore attivato automaticamente** (Cursor CLI o equivalente runtime-gated)
6. **Risultato committato**, stato aggiornato automaticamente
7. **Gate manuali** per app, deploy, tag, rollback, VPS, n8n runtime, API key, GitHub Actions

**Micro-interazioni eliminate:** avvio manuale implementatori, traduzione orchestratore/implementatore, triage task

---

## Componenti — Tabella Dettagliata

| Componente | Ruolo | Input | Output | Micro-interact. elim. | Rischio | Gate | Fase |
|---|---|---|---|---|---|---|---|
| **GitHub** | Fonte verità | Commit, push | Task queue, stato | Ricerca manuale stato | — | — | Ora |
| **n8n queue reader** | Lettura task | docs/tasks/queue/ | Processing, prompt, sessione | Avvio manuale scan | Webhook fallisce | — | Ora |
| **n8n prompt generator** | Generazione prompt | Task file + template | Cursor prompt | Copia/incolla prompt | Prompt incompleto | — | Ora |
| **n8n session tracker** | Log sessioni | Esecuzione task | docs/sessions/automation-*.md | — | Log incompleto | — | Ora |
| **ChatGPT orchestratore** | Strategia + review | GitHub (aggio) | Decision Packet, prompt | — | Contesto stale | — | Ora |
| **n8n Decision Packet gen.** | Draft DP automatico | Task + stato | Draft Decision Packet | Generazione manuale DP | DP incompleto | — | MVP |
| **INBOX.md** | Accodamento DP | Decision Packet | Risposta utente | Ricerca decisioni pendenti | — | — | MVP |
| **n8n auto-aggio trigger** | Sync stato auto | Commit GitHub | Stato aggiornato | Scrittura manuale aggio | Falso positivo | — | MVP |
| **Ollama classifier** | Triage task | Metadata task | Tipo + implementatore | Triage manuale | Errore classificazione | Runtime-gated | Futuro |
| **Cursor CLI** | Implementatore auto | Prompt file | Commit | Avvio manuale Cursor | Bug introdotto | Runtime-gated | Futuro |

---

## Livelli di Maturità

### A — Fase Attuale: Manuale-Supervisionata con Decision Packet

**Cosa c'è ora:**
- n8n queue reader + prompt generator + session tracker ✅
- Decision Packet Format canonico ✅
- ChatGPT come orchestratore principale ✅
- Claude Code / Windsurf come implementatori supervisionati ✅

**Cosa manca:**
- INBOX.md per accodamento decisioni
- Auto-aggio
- Avvio automatico implementatori

**Micro-interazioni ancora presenti:**
- Utente copia prompt da ChatGPT a implementatore
- Utente scrive "aggio" dopo ogni esecuzione

---

### B — MVP Low-Touch

**Obiettivo minimo funzionante:**
- n8n genera draft Decision Packet quando necessario
- INBOX.md o file equivalente raccoglie decisioni pendenti
- n8n rileva commit e aggiorna stato senza "aggio" manuale
- ChatGPT diventa review layer (valida DP, non lo genera da zero)
- Implementatori ancora avviati manualmente

**Micro-interazioni eliminate rispetto a Fase A:**
- Scrittura "aggio" manuale
- Generazione manuale Decision Packet

**Prerequisiti:**
- Task INBOX design (0129 proposto)
- Task auto-aggio design (0130 proposto)
- Task n8n Decision Packet generator design (0131 proposto)
- Nessun runtime aggiuntivo su VPS

---

### C — Futuro Semi-Autonomo

**Obiettivo:**
- Classifier/planner (Ollama) classifica e suggerisce implementatore
- Implementatori avviati automaticamente per task low-risk
- Utente interagisce solo tramite INBOX (decisioni) e test fisici
- Gate manuali permanenti per operazioni rischiose

**Prerequisiti:**
- Ollama feasibility (task proposto)
- Cursor CLI preflight (task 0129 proposto)
- Runtime-gated su VPS o locale

---

## Cosa Può Essere Automatico

- Lettura queue
- Deduplica processing/done/failed
- Generazione sessione automation
- Generazione prompt da template
- Generazione draft Decision Packet
- Aggiornamento INBOX
- Notifica decisione richiesta
- Classificazione metadata (futuro Ollama)
- Suggerimento implementatore (futuro Ollama)
- Rilevamento commit per auto-aggio

---

## Cosa Deve Restare Gate Umano

- Modifica app Alina
- Deploy Apps Script
- Tag git
- Rollback
- Modifica VPS
- Modifica n8n runtime
- Introduzione API key
- Introduzione login
- Introduzione GitHub Actions
- Costi ricorrenti nuovi
- Runner automatico su codice non revisionato
- Dati personali o credenziali
- Test fisico reale (Alina su telefono)

---

## Human Decision Inbox Futura

**Struttura logica:**

```markdown
# INBOX — Decision Packet in Attesa

## Pending

| ID | Kind | Titolo | Data | Raccomandazione | Scelta |
|---|---|---|---|---|---|
| D001 | automation | ... | 2026-05-12 | Opzione 2 | [ ] |

---

[Decision Packet D001 completo qui]
```

**Flusso:**
1. n8n o ChatGPT genera Decision Packet e lo aggiunge a INBOX.md
2. Utente apre INBOX.md (o riceve notifica)
3. Utente scrive la propria scelta (numero/parola corta)
4. n8n / ChatGPT legge la risposta e avanza il loop
5. INBOX.md aggiornato con stato "deciso" o "deferred"

**Compatibilità:** già definita nel Decision Packet Format (task 0127)

---

## Auto-Aggio Futuro

**Problema attuale:** l'utente deve scrivere "aggio" per segnalare che l'implementatore ha finito, così ChatGPT può rileggere GitHub.

**Soluzione MVP:**
- n8n polling su GitHub (già attivo): quando rileva un nuovo commit su `main` con messaggio che inizia con "docs:" o "feat:", aggiorna automaticamente il proprio stato
- ChatGPT viene notificato tramite canale dedicato (es. file `docs/STATUS.md` o webhook)
- L'utente non deve scrivere "aggio" per task la cui conclusione è visibile dal commit

**Casi in cui "aggio" resta utile:**
- Errore locale non committato
- Ambiguità sul risultato dell'implementatore
- Fallback manuale

---

## Riduzione Copia/Incolla Prompt

**Attuale:** ChatGPT genera prompt → utente copia → utente incolla in Claude Code / Windsurf

**MVP:** 
- n8n genera prompt in `docs/tasks/processing/` (già lo fa)
- Claude Code legge direttamente il file processing senza che l'utente lo copi
- Windsurf/Cascade può ricevere il file come context `@docs/tasks/processing/...`

**Futuro:**
- Cursor CLI legge direttamente il file processing e lo esegue senza intervento utente
- n8n attiva Cursor CLI via webhook dopo approvazione Decision Packet

---

## Riduzione Avvio Manuale Implementatori

**Attuale:** utente apre Claude Code / Windsurf e incolla il prompt

**MVP:**
- Nessuna automazione immediata — avvio manuale resta per ora
- Il prompt è già nel repo (docs/tasks/processing/), quindi l'utente deve solo aprire il file e applicarlo

**Futuro:**
- n8n o script locale attiva Claude Code CLI con il file processing come argomento
- Questo richiede task runtime-gated separato (Cursor CLI preflight o Claude Code CLI VPS con API key)

---

## Riduzione Traduzione Orchestratore/Implementatore

**Attuale:** ChatGPT genera prompt → utente traduce/adatta → implementatore riceve

**Soluzione adottata (già operativa):**
- Format task file-based (`docs/tasks/queue/`) elimina traduzione
- Template standardizzati (`docs/tasks/templates/`) eliminano disambiguazione
- n8n genera prompt direttamente dal template senza intervento utente
- Decision Packet elimina domande intermedie

**Residuo:** l'utente deve ancora consegnare il prompt all'implementatore (copia/incolla o apertura file)

---

## Ruolo di ChatGPT Orchestratore

**Oggi:**
- Legge GitHub (tramite "aggio" manuale)
- Genera prompt per implementatori
- Genera Decision Packet per scelte strategiche
- Coordina la sequenza di task

**MVP:**
- Diventa review layer: valida draft Decision Packet generati da n8n
- Legge GitHub tramite trigger automatici (riduzione "aggio" manuale)
- Concentra il lavoro su decisioni strategiche, non su coordinamento meccanico

**Futuro:**
- Ruolo ridotto a: revisione DP complessi, decisioni architetturali, approvazione gate rischiosi
- Il triage dei task e la classificazione sono delegati a Ollama/classifier

---

## Ruolo di n8n

**Già operativo:**
- Queue reader: legge `docs/tasks/queue/`, sposta in processing
- Schedule polling: ogni N minuti
- Session tracker: crea `docs/sessions/automation-*.md`
- Prompt generator: crea `docs/tasks/processing/*-cursor-prompt.md`

**MVP (da progettare nei task successivi):**
- Decision Packet generator: crea draft DP quando il task richiede scelta
- Auto-aggio trigger: rileva commit e aggiorna stato
- INBOX updater: aggiunge DP pendenti a INBOX.md

**Futuro:**
- Implementatore bridge: attiva implementatori via CLI dopo approvazione DP
- Notifica canale: segnala all'utente che c'è un DP in attesa

---

## Ruolo degli Implementatori

| Implementatore | Stato | Avvio | Input | Output | Micro-interaz. elim. | Fase |
|---|---|---|---|---|---|---|
| Claude Code locale | Attivo | Manuale | Prompt file | Commit | — | Ora |
| Windsurf/Cascade | Attivo (riserva) | Manuale | Context + prompt | Commit | — | Ora |
| Cursor | Sospeso | N/A | N/A | N/A | N/A | Post-reset |
| Cursor CLI | Futuro | Automatico | File processing | Commit | Avvio manuale | Runtime-gated |
| Claude Code CLI VPS | Bloccato | N/A | N/A | N/A | N/A | Bloccato no-login |

---

## Ruolo Futuro di Ollama

**Possibile contributo:**
- Classifier/planner locale zero-API
- Analizza metadata task (titolo, tipo, scope) e suggerisce: tipo corretto, implementatore, rischio
- Elimina triage manuale per task standard

**Prerequisiti:**
- Installazione locale Ollama (runtime-gated, task 0132 proposto)
- Test su metadata sintetici (non dati app Alina)
- Soglia qualità definita prima di affidare triage senza supervisione

**Micro-interazioni eliminate:** triage manuale task, scelta manuale implementatore per task standard

**Rischio:** errore di classificazione porta implementatore sbagliato → task fallisce → fallback manuale

---

## Primo MVP Realistico

**Definizione:** il primo loop funzionante senza runtime aggiuntivo, realizzabile con task docs-only.

**Componenti:**
1. Task file-based continua come fonte di verità (invariato)
2. n8n continua a generare processing/sessione/prompt (invariato)
3. ChatGPT usa GitHub per generare Decision Packet (invariato, ma standardizzato con format 0127)
4. **INBOX.md** raccoglie Decision Packet pendenti → utente risponde solo con numero/parola corta
5. **Auto-aggio**: n8n rileva commit e aggiorna stato → utente non scrive "aggio" per task standard
6. Nessun runner automatico ancora — implementatori avviati manualmente

**Cosa elimina:**
- Scrittura manuale "aggio" (per task standard con commit visibile)
- Ricerca manuale decisioni pendenti (tutte in INBOX.md)
- Generazione manuale Decision Packet (n8n genera draft)

**Cosa resta manuale:**
- Avvio implementatori (copia/incolla prompt o apertura file)
- Risposta a Decision Packet (gate intentionale)
- Test fisici

---

## Sequenza Task Successiva Proposta

| ID | Titolo | Tipo | Produce | Micro-interaz. elim. | Gate |
|---|---|---|---|---|---|
| **0129** | Human Decision Inbox Design | docs-only | docs/automation/human-decision-inbox-design.md | Ricerca decisioni pendenti | Nessuno |
| **0130** | Auto-Aggio Design | docs-only | docs/automation/auto-aggio-design.md | Scrittura manuale "aggio" | Nessuno |
| **0131** | n8n Decision Packet Generator Design | docs-only | docs/automation/n8n-decision-packet-generator.md | Generazione manuale DP | Nessuno |
| **0132** | Ollama Classifier/Planner Feasibility | docs-only | docs/automation/ollama-classifier-feasibility.md | Triage manuale task | Nessuno |
| **0133** | Cursor/Implementer Bridge Design | mixed/runtime-gated | docs/automation/implementer-bridge-design.md | Avvio manuale implementatori | Runtime-gated |

---

## Decision Packet Architetturale

Dal design emerge una scelta reale su quale componente del MVP sviluppare prima.

---

# Decision Packet — Priorità primo step MVP

**Decision ID:** D-0128-A  
**Kind:** automation  
**Data:** 2026-05-12

## Contesto

Il MVP low-touch richiede 3 componenti principali: INBOX.md per decisioni, auto-aggio per ridurre "aggio" manuale, n8n Decision Packet generator per draft automatici. Va scelto quale progettare per primo.

## Perché serve decisione

I 3 componenti sono interdipendenti ma il loro ordine di sviluppo influenza il valore percepito dall'utente. Progettare nel documento di design un'unica sequenza arbitraria senza scelta utente sarebbe una micro-interazione imposta.

## Opzioni

1. **INBOX.md prima** — progettare Human Decision Inbox (0129): raccoglie decisioni pendenti, utente risponde in un posto solo. Elimina: ricerca manuale DP. Prerequisito per: auto-aggio e DP generator.
2. **Auto-aggio prima** — progettare Auto-Aggio (0130): elimina scrittura manuale "aggio" per task standard con commit visibile. Elimina: azione meccanica più frequente.
3. **n8n DP Generator prima** — progettare Decision Packet Generator (0131): n8n genera draft DP automatici. Elimina: generazione manuale DP da parte di ChatGPT.

## Raccomandazione orchestratore

**Opzione 2 — Auto-aggio prima.** Il comando "aggio" è la micro-interazione più frequente e meccanica del loop attuale. Eliminarla o ridurla per i task standard ha impatto immediato sulla quantità di interazioni quotidiane dell'utente. INBOX e DP generator possono seguire in sequenza.

## Rischio principale

Opzione 2: auto-aggio richiede che n8n rilevi i commit in modo affidabile; se il polling fallisce, l'utente non sa che il task è completato senza scrivere "aggio". Serve fallback esplicito.

## Impatto

Su automazione: riduce azione meccanica più frequente. Su app Alina: nessun impatto. Su infra: n8n polling già attivo, nessuna installazione extra.

## Micro-interazioni umane eliminate

Opzione 2: elimina scrittura "aggio" per ogni task standard completato (stimato: 5–10 al giorno).

## Scelta richiesta

Scrivi: 1 / 2 / 3

## Cosa succede dopo la scelta

Se 1: creare task 0129 Human Decision Inbox Design. Se 2: creare task 0130 Auto-Aggio Design. Se 3: creare task 0131 n8n Decision Packet Generator Design.

## Cosa NON verrà fatto senza ulteriore gate

Nessuna implementazione runtime. Nessuna modifica n8n reale. Nessun deploy. Il passo successivo è solo docs-only design del componente scelto.

---

## Rischi e Fallback

| Rischio | Probabilità | Impatto | Fallback |
|---|---|---|---|
| n8n polling fallisce | Media | Alto | Scrittura manuale "aggio" (baseline Fase A) |
| Ollama classificazione errata | Alta | Medio | Triage manuale supervisionato |
| INBOX.md non letta | Bassa | Medio | Notifica canale separato |
| Implementatore CLI introduce bug | Media | Alto | Review manuale pre-merge, rollback a tag |
| ChatGPT contesto stale | Alta | Basso | "aggio" manuale come recovery |
| Decision Packet incompleto | Bassa | Basso | ChatGPT completa manualmente |

**Principio generale:** se un componente automatico fallisce, il loop torna alla Fase A (manuale-supervisionata) senza perdita di stato. GitHub è fonte di verità — tutto è recuperabile dai commit.

---

## Conclusione

Il design del loop autonomo asincrono a basso touch definisce 3 livelli di maturità, un MVP realistico senza runtime immediato, e una sequenza di 5 task successivi (0129–0133). Il criterio "quante micro-interazioni umane elimina?" è applicato a ogni componente. I gate manuali per operazioni rischiose sono preservati in tutti i livelli.

**Prossimo passo raccomandato:** rispondere al Decision Packet D-0128-A con 1, 2 o 3 per scegliere il primo componente del MVP da progettare.

---
**Decision Packet Format (task 0127) + Autonomous Low-Touch Loop Design (task 0128) — Foundation del low-touch loop completata**
