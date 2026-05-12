# Task — LLM Wiki / Token Efficiency Design

## Metadata

- ID: 0132-llm-wiki-token-efficiency-design
- Project: Alina Lavoro
- Type: low-touch-loop-docs-only
- Priority: high
- Status: queued
- Created by: Orchestrator
- Deploy: no
- Runtime: no
- App changes: no
- Manual gate: required before any future runtime, Ollama install, embeddings runtime, VPS changes, n8n runtime, API key, login, GitHub Actions, deploy, tag, rollback, runner automatico

## Origine

Task successivo nella roadmap low-touch, in sostituzione diretta di "0132 Ollama Classifier/Planner Feasibility" originariamente proposto in:
- `docs/automation/autonomous-low-touch-loop-design.md` (task 0128)

Priorità riformulata: **token efficiency prima di runtime Ollama**. La lettura ripetuta di `docs/PROJECT_STATE.md` (47+ k caratteri) e dei documenti canonici è la micro-interazione più costosa per tutti gli agenti (ChatGPT, Claude Code, Cursor, Windsurf, futuri agenti n8n). Ridurre questo costo non richiede installazioni: richiede progettare una struttura di memoria sintetica derivata.

Debito tecnico correlato registrato in:
- `docs/sessions/2026-05-12-register-project-state-compaction-debt.md`
- `docs/CHECKPOINT.md` — sezione «Debiti tecnici documentali»
- `docs/PROJECT_STATE.md` — «Rischi aperti»

## Prerequisiti

- Task 0127 completato: Decision Packet Format canonico
- Task 0128 completato: Autonomous Low-Touch Loop Design
- Task 0129 completato: Human Decision Inbox Design
- Task 0130 completato: Auto-Aggio Design
- Task 0131 completato: n8n Decision Packet Generator Design
- Regola lifecycle attiva: creazione task = queue + sessione; PROJECT_STATE/CHECKPOINT solo al completamento
- Criterio permanente attivo: "Quante micro-interazioni umane elimina?"
- Debito tecnico registrato: `docs/PROJECT_STATE.md` > 47 k char → warning performance Claude Code / Windsurf / Cursor

## Contesto Strategico

Il sistema low-touch ha ora:
- **Decision Packet Format** canonico (13 campi)
- **Human Decision Inbox** progettata (Opzione A: `docs/INBOX.md`, non ancora creata)
- **Auto-Aggio** progettato (disciplina lettura GitHub, zero runtime)
- **n8n Decision Packet Generator** progettato (componente logico Auto-Aggio → DP Generator → INBOX)
- **n8n queue reader + polling automatico** operativi

Il collo di bottiglia attuale non è il runtime: è la **larghezza del contesto** che ogni agente deve caricare per ricostruire lo stato. Ogni sessione Claude Code / Cursor / Windsurf carica:
- `docs/PROJECT_STATE.md` (47+ k char, warning attivo)
- `docs/CHECKPOINT.md` (lungo, storico inline)
- `docs/ORCHESTRATOR_RULES.md`
- `docs/AI_RULES.md`
- `docs/WORKFLOW.md`
- `docs/COMMANDS.md`

Questo equivale a **decine di migliaia di token per sessione**, ripetuti a ogni agente, a ogni task, a ogni lettura di stato. Ridurre questo costo con una struttura di memoria sintetica derivata è il passo più ad alto impatto prima di qualsiasi runtime Ollama.

**Criterio permanente applicato:** quante micro-interazioni (e quanti token) elimina la wiki sintetica rispetto alla lettura completa?

## Principio Fondamentale

- **GitHub e i documenti canonici restano fonte di verità** (invariabile).
- `docs/LLMS.md` e `docs/wiki/` sono **memoria derivata**: versione compressa e AI-friendly per ridurre token.
- Se wiki e documenti canonici divergono, **vincono sempre i documenti canonici**.
- La wiki non sostituisce i canonici: li integra con un livello di accesso più rapido.

## Scopo del Task

Progettare uno strato "LLM Wiki / Local AI Livello 2" orientato alla **token efficiency**, non al runtime. Il design deve definire:

1. Struttura a livelli della memoria di progetto.
2. Formato e contenuto di `docs/LLMS.md` come entry point compatto per agenti.
3. Struttura di `docs/wiki/` come memoria derivata AI-friendly.
4. Protocollo di aggiornamento (chi aggiorna, quando, cosa vince).
5. Stima qualitativa di token risparmiati.
6. Piano futuro non-runtime per Ollama/embeddings (hardware disponibile).
7. Regola di non-duplicazione rispetto ai documenti canonici.

## Output da Produrre (alla futura esecuzione)

1. **docs/automation/local-llm-wiki-token-efficiency-design.md** — documento principale di progettazione
2. **docs/LLMS.md** — entry point compatto per agenti (prima versione)
3. **docs/wiki/current-state.md** — stato corrente sintetico AI-friendly
4. **docs/wiki/token-efficiency.md** — guida alla navigazione efficiente per agenti
5. **docs/wiki/README.md** — opzionale, se utile come indice wiki
6. **docs/sessions/** — sessione di completamento datata
7. **docs/tasks/done/0132-llm-wiki-token-efficiency-design.md** — done marker
8. **docs/PROJECT_STATE.md** — aggiornamento leggero solo al completamento
9. **docs/CHECKPOINT.md** — aggiornamento leggero solo al completamento
10. **docs/roadmap.md** — aggiornamento leggero solo al completamento

## Aree di Progettazione Richieste

### 1. Struttura a livelli

Il design deve definire chiaramente una gerarchia:

| Livello | Fonte | Scopo | Aggiornato da |
|---------|-------|-------|---------------|
| **Livello 0** | `docs/ORCHESTRATOR_RULES.md`, `docs/AI_RULES.md`, `docs/WORKFLOW.md`, `docs/COMMANDS.md` | Regole permanenti — canoniche | Orchestratore / task esplicito |
| **Livello 1** | `docs/PROJECT_STATE.md`, `docs/CHECKPOINT.md` | Stato progetto — autorevole | Implementatore a fine task |
| **Livello 2** | `docs/LLMS.md`, `docs/wiki/` | Memoria derivata AI-friendly — token-efficient | Derivato da Livello 0+1 a ogni task completato |
| **Livello 3 futuro** | Indice locale / embeddings / Ollama | Ricerca semantica locale zero-API | Runtime-gated, non ora |

### 2. Definizione di `docs/LLMS.md`

Il design deve specificare:
- `docs/LLMS.md` è l'entry point compatto per agenti: **≤ 200 righe**, punta ai documenti canonici.
- Deve contenere: versione app corrente, branch operativo, prossimo task, workstream attivo, gate aperti, puntatori a file canonici per ogni area.
- Non deve contenere storico inline.
- Non deve duplicare regole già in `docs/ORCHESTRATOR_RULES.md`.
- Deve essere generabile/aggiornabile a fine ogni task completato senza leggere l'intero PROJECT_STATE.

### 3. Struttura di `docs/wiki/`

Il design deve specificare:
- **`docs/wiki/current-state.md`**: snapshot sintetico dello stato corrente — versione app, branch, deploy, workstream attivo, task corrente, debiti aperti. Derivato da PROJECT_STATE. Massimo 100 righe.
- **`docs/wiki/token-efficiency.md`**: guida per agenti su quali file leggere per ogni tipo di domanda. Deve rispondere a: "Cosa leggere per X?" per tutti i casi d'uso comuni.
- **`docs/wiki/README.md`** (opzionale): indice della wiki con puntatori e note di navigazione.

Regole per ogni pagina wiki:
- Breve (≤ 150 righe per pagina).
- Orientata agli agenti, non agli umani.
- Rimanda sempre ai documenti canonici per dettaglio.
- Nessun blocco copiato da PROJECT_STATE.md.
- Nessuno storico inline.

### 4. Mappa di navigazione per domanda frequente

Il design deve proporre una mappa esplicita:

| Domanda | File primario | File secondario |
|---------|--------------|-----------------|
| Stato corrente app | `docs/LLMS.md` | `docs/wiki/current-state.md` |
| Workstream watcher/runner/low-touch | `docs/LLMS.md` | `docs/CHECKPOINT.md` |
| App stabile V1.9.2 | `docs/LLMS.md` | `docs/PROJECT_STATE.md` |
| Regole orchestratore | `docs/ORCHESTRATOR_RULES.md` | — |
| Task in queue | `docs/tasks/queue/` | `docs/LLMS.md` |
| Debiti tecnici | `docs/wiki/current-state.md` | `docs/PROJECT_STATE.md` |
| Workflow implementatore | `docs/WORKFLOW.md` | `docs/AI_RULES.md` |
| Comandi standard | `docs/COMMANDS.md` | — |
| n8n queue reader | `docs/automation/n8n-workflows/queue-reader.md` | — |
| Decision Packet Format | `docs/automation/decision-packet-format.md` | — |

### 5. Protocollo di aggiornamento

Il design deve definire:

- **Quando aggiornare `docs/LLMS.md`**: a ogni completamento di task, insieme a PROJECT_STATE e CHECKPOINT.
- **Quando aggiornare `docs/wiki/current-state.md`**: a ogni completamento di task rilevante (cambio stato app, cambio workstream, nuovo task avviato).
- **Chi vince in caso di conflitto**: documenti canonici (Livello 0 e 1) vincono sempre su wiki (Livello 2).
- **Come evitare duplicazione**: ogni pagina wiki deve contenere solo puntatori e sintesi ≤ 3 righe per area; il dettaglio resta sempre nel canonico.
- **Frequenza di aggiornamento**: uguale alla frequenza di aggiornamento PROJECT_STATE (= ogni task completato). Non più frequente, non meno frequente.

### 6. Stima qualitativa token risparmiati

Il design deve includere una stima qualitativa (non precisa) per scenario:

| Scenario | Prima (token stimati) | Dopo (token stimati) | Risparmio stimato |
|----------|----------------------|---------------------|------------------|
| Agente legge stato per nuovo task | PROJECT_STATE (47k+) + CHECKPOINT + regole | LLMS.md (≤200 righe) + wiki/current-state.md | ~70–80% |
| ChatGPT ricostruisce stato dopo `aggio` | PROJECT_STATE completo + canonici | LLMS.md + diff canonici se necessari | ~50–60% |
| Claude Code start sessione | PROJECT_STATE + CHECKPOINT + AI_RULES + WORKFLOW | LLMS.md + AI_RULES (invariato) | ~40–50% |
| n8n genera prompt da template | Template + context | LLMS.md come contesto minimale | ~30–40% |

### 7. Piano futuro non-runtime per Ollama/embeddings

Il design deve documentare la direzione futura senza attivare nulla ora:

**Hardware disponibile:**
- **MacBook Pro M2** — possibile orchestratore always-on leggero; modelli 7B/8B via Ollama sostenibili; ideale per planner/classifier a bassa latenza.
- **Workstation RTX 3060 12GB** — capacità maggiore per AI locale; modelli 14B possibili; ideale per task più pesanti (embedding generation, fine-tuning leggero).
- **VPS IONOS economica** — ottimale per n8n runtime; **non ideale** per LLM locali pesanti (CPU-only); mantenerla per automazione, non per inferenza AI.

**Modelli target per Fase C (futuro):**
- 7B/8B come default per classifier/planner: Llama 3.1 8B, Mistral 7B, Qwen2.5 7B.
- 14B solo se sostenibile su RTX 3060 (12GB VRAM): Qwen2.5 14B, Mistral 12B.
- Embeddings locali: nomic-embed-text, all-minilm via Ollama.
- Nessuna installazione ora — il design documenta solo direzione e hardware match.

**Prerequisiti per attivazione (tutti runtime-gated, non ora):**
- Task preflight Ollama locale (feasibility + test qualità su task sintetici)
- Task embeddings design (quale modello, quale store, quale query interface)
- Gate manuale esplicito prima di qualsiasi installazione

### 8. Regola di sicurezza wiki

Il design deve includere:
- Nessuna pagina wiki deve contenere dati personali, credenziali, token, API key, OAuth material.
- Nessuna pagina wiki deve contenere URL raw con parametri sensibili.
- Nessuna pagina wiki deve contenere storico deploy con ID sensibili.
- Le pagine wiki sono pubbliche come il resto del repo: trattarle come documenti pub.

### 9. Relazione con debito tecnico PROJECT_STATE

Il design deve chiarire la relazione con il debito tecnico registrato:
- La compattazione di `docs/PROJECT_STATE.md` (task futuro separato) è complementare ma distinta dalla wiki.
- La wiki riduce la **necessità di leggere** PROJECT_STATE spesso.
- La compattazione riduce la **dimensione** di PROJECT_STATE quando viene letto.
- Entrambi convergono verso lo stesso obiettivo (meno token, meno latenza per gli agenti) ma sono task separati con scope diverso.
- La wiki può essere creata **prima** della compattazione: riduce il problema senza risolvere il debito.

### 10. Preservazione roadmap low-touch

Il design deve confermare l'ordine successivo:
- **0131 completato** ✓ (n8n Decision Packet Generator Design)
- **0132** (questo task) → LLM Wiki / Token Efficiency Design
- **Successivo** → Ollama Classifier/Planner Feasibility (riformulato post-wiki)
- **Successivo** → Implementer Bridge Design
- **Debito tecnico** → Compattazione PROJECT_STATE (task docs-only separato, timing flessibile)

Cambi d'ordine solo tramite Decision Packet (kind: `meta` o `automation`).

### 11. MVP documentale immediato

Il design deve identificare cosa è realizzabile **subito** senza runtime:
- Creare `docs/LLMS.md` con entry point compatto (≤ 200 righe).
- Creare `docs/wiki/current-state.md` (≤ 100 righe, derivato da PROJECT_STATE).
- Creare `docs/wiki/token-efficiency.md` (mappa navigazione per domanda).
- Propagare l'indicazione "leggi LLMS.md prima" ai documenti di onboarding (CLAUDE.md, ORCHESTRATOR_RULES.md) — solo se coerente e non ridondante.
- Tutto senza installazioni, senza runtime, senza modifiche app.

### 12. Confini docs-only vs runtime-gated

| Componente | Fase | Gate |
|-----------|------|------|
| Design struttura wiki | Docs-only | No gate runtime |
| Creazione `docs/LLMS.md` | Docs-only | No gate runtime |
| Creazione `docs/wiki/*.md` | Docs-only | No gate runtime |
| Protocollo aggiornamento | Docs-only | No gate runtime |
| Installazione Ollama locale | Runtime-gated | Gate manuale esplicito |
| Embeddings locali | Runtime-gated | Gate manuale esplicito |
| Indice semantico locale | Runtime-gated | Gate manuale esplicito |
| Fine-tuning modelli | Runtime-gated | Gate manuale esplicito |

## Uso del Decision Packet Format

Se durante la progettazione emerge una scelta architetturale con ≥ 2 opzioni reali, il task futuro deve emettere un Decision Packet conforme a `docs/automation/decision-packet-format.md`:
- Campo `kind` in posizione 2: `automation` o `meta`
- Criterio "micro-interazioni umane eliminate" obbligatorio
- Massimo 3–5 opzioni
- Raccomandazione esplicita

## Allowed Paths (futura esecuzione)

- `docs/automation/local-llm-wiki-token-efficiency-design.md`
- `docs/LLMS.md`
- `docs/wiki/**`
- `docs/sessions/**`
- `docs/tasks/done/0132-llm-wiki-token-efficiency-design.md`
- `docs/PROJECT_STATE.md` solo al completamento
- `docs/CHECKPOINT.md` solo al completamento
- `docs/roadmap.md` solo al completamento
- Aggiornamenti leggeri docs-only coerenti a `ORCHESTRATOR_RULES.md`, `WORKFLOW.md`, `AI_RULES.md`, `COMMANDS.md` solo se necessari per rendere canonica la regola token-efficiency

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
- file con credenziali, token, API key, OAuth material, URL raw sensibili

## Note Operative

- Nessuna azione runtime in questo step
- Nessuna modifica app Alina
- Nessuna modifica VPS / n8n runtime / GitHub Actions
- Nessuna installazione Ollama
- Nessuna creazione embeddings reali
- Nessuna creazione database vettoriali
- Nessun deploy, tag, rollback
- `docs/INBOX.md` NON viene creato in questo task
- `docs/history/PROJECT_LOG.md` NON viene creato in questo task
- `docs/LLMS.md` e `docs/wiki/` verranno creati solo all'esecuzione del task, non ora

---
**Task creato — LLM Wiki / Token Efficiency Design in attesa di esecuzione**
