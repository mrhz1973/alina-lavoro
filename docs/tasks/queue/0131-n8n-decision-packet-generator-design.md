# Task — n8n Decision Packet Generator Design

## Metadata

- ID: 0131-n8n-decision-packet-generator-design
- Project: Alina Lavoro
- Type: low-touch-loop-docs-only
- Priority: normal
- Status: queued
- Created by: Orchestrator
- Deploy: no
- Runtime: no
- App changes: no
- Manual gate: required before any future runtime, n8n runtime, VPS, deploy, tag, rollback, API key, login, GitHub Actions, runner automatico

## Origine

Task successivo nella roadmap low-touch, confermato in:
- `docs/automation/autonomous-low-touch-loop-design.md` (task 0128) — sequenza 0129–0133 proposta
- `docs/PROJECT_STATE.md` e `docs/CHECKPOINT.md` — ordine roadmap: **0131 → 0132 → 0133**
- Decisione D-0128-A risolta (Auto-Aggio prima); 0130 completato (Auto-Aggio Design); 0129 completato (INBOX Design)

## Prerequisiti

- Task 0127 completato: Decision Packet Format canonico (`docs/automation/decision-packet-format.md`)
- Task 0128 completato: Autonomous Low-Touch Loop Design (`docs/automation/autonomous-low-touch-loop-design.md`)
- Task 0129 completato: Human Decision Inbox Design (`docs/automation/human-decision-inbox-design.md`)
- Task 0130 completato: Auto-Aggio Design (`docs/automation/auto-aggio-design.md`)
- Regola lifecycle attiva: creazione task = queue + sessione; PROJECT_STATE/CHECKPOINT solo al completamento
- Criterio permanente attivo: "Quante micro-interazioni umane elimina?"

## Contesto Strategico

Il sistema low-touch ha ora:
- **Decision Packet Format** canonico (13 campi, kind strutturale, esempi)
- **Auto-Aggio** progettato: rileva stato GitHub, riduce scrittura "aggio" manuale
- **Human Decision Inbox**: luogo unico file-based per decisioni vere (Opzione A: `docs/INBOX.md`)

Il componente mancante è il **generatore** di Decision Packet. Oggi i Decision Packet vengono emessi manualmente dall'orchestratore quando rileva una scelta reale. Il generatore progettato in questo task sarà il workflow/logica (inizialmente documentale, futuro n8n) che:

1. riceve uno stato ambiguo o una segnalazione dall'implementatore;
2. valuta se esiste davvero una decisione da prendere;
3. assembla il Decision Packet Markdown conforme al formato canonico;
4. lo accoda in `docs/INBOX.md` o lo invia all'orchestratore.

**Criterio obbligatorio:** quante micro-interazioni umane elimina ciascuna soluzione proposta?

## Scopo del Task

Progettare il generatore n8n di Decision Packet: componente/workflow documentale che, a partire da uno stato ambiguo o da una decisione reale rilevata, produce un Decision Packet Markdown conforme al formato canonico (13 campi) e lo colloca nel posto corretto del sistema low-touch.

## Output da Produrre (alla futura esecuzione)

1. **docs/automation/n8n-decision-packet-generator-design.md** — documento di progettazione
2. **docs/sessions/2026-05-12-n8n-decision-packet-generator-design.md** (o sessione datata equivalente)
3. **docs/tasks/done/0131-n8n-decision-packet-generator-design.md** — done marker
4. **docs/PROJECT_STATE.md** (aggiornamento solo al completamento)
5. **docs/CHECKPOINT.md** (aggiornamento solo al completamento)

## Aree di Progettazione Richieste

### 1. Definizione del generatore

- Cosa è il "Decision Packet Generator" nel contesto del progetto
- Differenza tra emissione manuale (orchestratore) e emissione automatica (generatore)
- Perimetro: cosa entra, cosa il generatore deve rifiutare
- Relazione con Auto-Aggio (che rileva lo stato) e INBOX (che ospita il Decision Packet)

### 2. Input del generatore

- Segnale dall'implementatore nel riepilogo finale (`gate reale segnalato: sì`)
- Pattern rilevati da Auto-Aggio nello stato GitHub (ambiguità, task failed, stato anomalo)
- Richiesta diretta dell'orchestratore (trigger manuale)
- Formato degli input attesi (strutturato vs. testo libero)

### 3. Trigger logici

| Trigger | Condizione | Azione generatore |
|---------|-----------|------------------|
| Implementatore segnala gate reale | Riepilogo con `gate: sì` | Genera DP |
| Auto-Aggio rileva stato ambiguo | Task in processing > timeout senza done | Genera DP recovery |
| Task failed | `docs/tasks/failed/{task}.md` creato | Genera DP retry/abort |
| Orchestratore richiede decisione | Trigger manuale | Genera DP da template |
| Stato normale completato | Done marker + sessione | NON genera DP (silenzioso) |

### 4. Mapping verso i 13 campi canonici

Il generatore deve mappare l'input verso il template Decision Packet Format (`docs/automation/decision-packet-format.md`):

| Campo | Fonte input | Note |
|-------|------------|------|
| 1. Decision ID | Auto-incrementale (`D-NNNN`) | Sequenza da controllare |
| 2. kind | Classificatore trigger | `automation` / `infra` / `alina-feature` / `meta` |
| 3. Titolo breve | Estratto dal contesto | ≤ 60 caratteri |
| 4. Contesto | Stato GitHub / riepilogo implementatore | Sintetico |
| 5. Perché serve decisione | Motivazione trigger | Esplicita |
| 6. Opzioni (max 3–5) | Template per tipo trigger | Con micro-interazioni eliminate |
| 7. Raccomandazione orchestratore | Logica del generatore | Sempre presente |
| 8. Rischio principale | Per tipo trigger | Template |
| 9. Impatto | Su workstream / roadmap | |
| 10. Micro-interazioni eliminate | Calcolo per opzione | Criterio permanente |
| 11. Scelta richiesta | Formula standard | `D-NNNN-A = N` |
| 12. Cosa succede dopo | Per opzione | |
| 13. Cosa NON senza gate | Lista esplicita | Gate permanenti |

- Il campo `kind` resta **indicatore strutturale**, non domanda all'utente.
- Il generatore deve includere sempre la lista "Cosa NON senza gate" con i gate permanenti del progetto.

### 5. Relazione con Auto-Aggio

- Auto-Aggio rileva lo stato GitHub e segnala anomalie
- Il generatore riceve la segnalazione di Auto-Aggio come input strutturato
- Auto-Aggio non decide da solo se serve un DP: delega al generatore la valutazione
- Flusso: Auto-Aggio → stato anomalo → generatore → valuta → DP (se necessario) → INBOX

### 6. Relazione con futura INBOX (`docs/INBOX.md`)

- Il generatore produce il DP in formato Markdown
- Il DP viene accodato nella sezione `## Pending` di `docs/INBOX.md`
- La creazione di `docs/INBOX.md` è riservata a task futuro mixed/runtime-gated
- In questa fase docs-only: progettare il formato di output del generatore compatibile con INBOX futura

### 7. Comportamento quando NON serve una decisione

Il generatore deve avere un filtro anti-rumore esplicito:

- Non genera DP per task standard completati correttamente
- Non genera DP per task docs-only già determinati senza ambiguità
- Non genera DP per errori tecnici minori risolvibili autonomamente dall'implementatore
- Non genera DP se l'orchestratore può decidere da solo (raccomandazione univoca, nessuna alternativa reale)
- Principio: meno DP = meno micro-interazioni = rispetto del criterio permanente

### 8. Comportamento quando serve gate manuale (gate permanenti)

Per i gate permanenti del progetto il generatore:
- Genera SEMPRE un DP (mai silenzioso su gate permanenti)
- Blocca il loop fino a risposta utente
- Non propone "procedere" come default

Gate permanenti invariati:
- runtime n8n, VPS runtime
- modifiche app Alina (`src/**`)
- deploy Apps Script
- tag git
- rollback
- API key, login
- GitHub Actions
- costi ricorrenti nuovi
- runner automatico
- dati personali, credenziali, OAuth material
- test fisico reale (Alina su telefono)

### 9. Failure modes del generatore

| Rischio | Probabilità | Impatto | Mitigazione |
|---------|------------|---------|-------------|
| Falso positivo: DP non necessario | Media | Medio (micro-interazione sprecata) | Filtro anti-rumore esplicito |
| Falso negativo: decisione mancata | Bassa | Alto (loop bloccato o errato) | Fallback manuale orchestratore |
| Mapping incompleto ai 13 campi | Media | Medio (DP malformato) | Template + validazione |
| Loop infinito (DP → decisione → DP) | Bassa | Alto | Regola: un solo DP per stato |
| Stato ambiguo non classificabile | Media | Medio | Fallback "aggio" manuale |
| Creazione DP su gate già noto | Media | Basso | Deduplica per stato/trigger |

### 10. Anti-rumore / anti-falso positivo

- Regola: un solo DP attivo per stesso trigger/stato (nessun duplicato)
- Regola: DP non generato se orchestratore ha già decisione univoca
- Regola: threshold temporale (non generare DP se il trigger è risolto entro N minuti)
- Regola: silenzio attivo per task standard normali (log interno, nessuna notifica)
- Regola: DP solo quando ci sono ≥ 2 opzioni reali per l'utente

### 11. Path documentali futuri

Il design deve chiarire quali path vengono toccati in fase docs-only e quali in runtime-gated:

| Fase | Path | Tipo |
|------|------|------|
| Docs-only (questo task) | `docs/automation/n8n-decision-packet-generator-design.md` | Progettazione |
| Mixed/runtime-gated futuro | `docs/INBOX.md` | Creazione e popolamento |
| Runtime-gated futuro | Workflow n8n DP Generator | Implementazione |
| Runtime-gated futuro | Integrazione Auto-Aggio ↔ DP Generator | Integrazione |

### 12. Criteri di sicurezza

- Il generatore non deve mai scrivere in `src/**`, `gas-current/**`, `.gas/**`
- Il generatore non deve mai includere token, API key, URL raw sensibili nel DP
- Il DP deve contenere solo contesto decisionale, mai dati personali o credenziali
- Il generatore non deve mai attivare deploy, tag, rollback autonomamente

### 13. Confini tra docs-only e runtime-gated

| Componente | Fase | Gate |
|-----------|------|------|
| Progettazione formato DP | Docs-only | No gate runtime |
| Template DP per tipo trigger | Docs-only | No gate runtime |
| Logica classificazione trigger | Docs-only | No gate runtime |
| Implementazione nodo n8n | Runtime-gated | Gate manuale esplicito |
| Scrittura su `docs/INBOX.md` | Mixed/runtime-gated | Gate leggero |
| Notifica utente (es. Telegram) | Runtime-gated | Gate esplicito |

## Struttura del Documento Futuro Richiesta

Il documento `docs/automation/n8n-decision-packet-generator-design.md` deve contenere:

1. **Architettura target del generatore** (relazione con Auto-Aggio e INBOX)
2. **Flusso step-by-step** (dal trigger al DP in INBOX)
3. **Tabella trigger → azione** (con condizioni e output)
4. **Mapping 13 campi** (dettaglio fonte → campo)
5. **Filtro anti-rumore** (regole esplicite "quando NON generare")
6. **Gate permanenti** (lista e comportamento)
7. **Failure modes** (tabella rischio → mitigazione)
8. **Micro-interazioni eliminate** (quantificazione per scenario)
9. **Confini docs-only vs runtime-gated** (tabella)
10. **MVP documentale** (cosa è realizzabile senza runtime)
11. **Eventuale Decision Packet** (se emerge scelta reale tra alternative architetturali)

## Uso del Decision Packet Format

Se durante la progettazione emerge una scelta architetturale con ≥ 2 opzioni reali, il task futuro deve emettere un Decision Packet conforme a `docs/automation/decision-packet-format.md`:
- Campo `kind` in posizione 2: `automation`
- Criterio "micro-interazioni umane eliminate" obbligatorio
- Massimo 3–5 opzioni
- Raccomandazione esplicita

## Ordine Roadmap Successivo a 0131

Dopo il completamento di 0131, l'ordine atteso è:

1. **0132** — Ollama Classifier/Planner Feasibility
2. **0133** — Cursor/Implementer Bridge Design

**Nota:** cambi d'ordine solo tramite Decision Packet (kind: `meta` o `automation`).

## Allowed Paths (futura esecuzione)

- `docs/automation/n8n-decision-packet-generator-design.md`
- `docs/sessions/2026-05-12-n8n-decision-packet-generator-design.md` (o datata equivalente)
- `docs/tasks/done/0131-n8n-decision-packet-generator-design.md`
- `docs/PROJECT_STATE.md` (solo al completamento)
- `docs/CHECKPOINT.md` (solo al completamento)
- Aggiornamenti coerenti a documenti correlati già esistenti in `docs/automation/` (solo se docs-only e necessari)

## Forbidden Paths (sempre)

- `src/**`
- `gas-current/**`
- `.gas/**`
- `appsscript.json`
- `package.json`
- `.clasp.json`
- `.github/workflows/**`
- `docs/INBOX.md` (riservato a task futuro mixed/runtime-gated)
- `docs/history/**` (riservato a task futuro compattazione)
- export JSON n8n non redatti
- file con credenziali, token, chiavi, OAuth material, sessioni locali o URL raw sensibili

## Note Operative

- Nessuna azione runtime in questo step
- Nessuna modifica app Alina
- Nessuna modifica VPS / n8n runtime / GitHub Actions
- Il documento futuro è progettazione docs-only: nessun runner automatico attivato
- L'implementazione effettiva del generatore in n8n richiede task runtime-gated separato
- `docs/INBOX.md` NON viene creato in questo task

---
**Task creato — n8n Decision Packet Generator Design in attesa di esecuzione**
