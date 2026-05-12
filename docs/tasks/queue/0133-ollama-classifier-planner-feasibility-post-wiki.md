# Task — Ollama Classifier/Planner Feasibility (Post-Wiki)

## Metadata

- ID: 0133-ollama-classifier-planner-feasibility-post-wiki
- Project: Alina Lavoro
- Type: low-touch-loop-docs-only
- Priority: normal
- Status: queued
- Created by: Orchestrator
- Deploy: no
- Runtime: no
- App changes: no
- Manual gate: required before any future Ollama install, model download, embeddings runtime, local service, VPS change, n8n runtime, API key, login, GitHub Actions, deploy, tag, rollback, runner automatico

## Origine

Task successivo nella roadmap low-touch, riformulato dopo il completamento di:
- Task 0132 — LLM Wiki / Token Efficiency Design

La roadmap originale prevedeva semplicemente "Ollama Classifier/Planner Feasibility". La riformulazione post-wiki è necessaria perché ora esiste uno strato derivato AI-friendly che cambia il design del classifier: invece di leggere PROJECT_STATE.md completo (47k+ caratteri), Ollama dovrà leggere `docs/LLMS.md` + `docs/wiki/current-state.md` come input primario.

Questo cambia significativamente l'architettura del classifier e il suo costo per token, rendendo più conveniente l'approccio rispetto alla versione pre-wiki.

Riferimenti diretti:
- `docs/automation/local-llm-wiki-token-efficiency-design.md` — sezione 8 (piano futuro Ollama/hardware)
- `docs/automation/autonomous-low-touch-loop-design.md` — sezione "Ruolo futuro di Ollama"
- `docs/LLMS.md` — strato derivato che Ollama consumerà come input

## Prerequisiti

- Task 0127 completato: Decision Packet Format canonico
- Task 0128 completato: Autonomous Low-Touch Loop Design
- Task 0129 completato: Human Decision Inbox Design
- Task 0130 completato: Auto-Aggio Design
- Task 0131 completato: n8n Decision Packet Generator Design
- Task 0132 completato: LLM Wiki / Token Efficiency Design (**prerequisito diretto**)
- `docs/LLMS.md` esistente come input primario per il futuro classifier
- `docs/wiki/current-state.md` esistente come input secondario
- Regola lifecycle attiva: creazione task = queue + sessione; PROJECT_STATE/CHECKPOINT solo al completamento
- Criterio permanente attivo: "Quante micro-interazioni umane elimina?"

## Contesto Strategico

Il sistema low-touch ha ora:
- **n8n queue reader + polling automatico** operativi (5 min, Europe/Berlin)
- **Decision Packet Format** canonico (13 campi)
- **Human Decision Inbox** progettata (`docs/INBOX.md` non ancora creata)
- **Auto-Aggio** progettato (disciplina lettura GitHub, zero runtime)
- **n8n Decision Packet Generator** progettato
- **LLM Wiki** attiva (`docs/LLMS.md` + `docs/wiki/`) ← **nuovo**

Il passo successivo nella roadmap verso la Fase C (semi-autonoma) è valutare se un modello LLM locale zero-API (Ollama) possa diventare il **classifier/planner** del loop, ricevendo come input la wiki sintetica invece dei documenti canonici completi.

**Obiettivo preciso:**
- non sostituire ChatGPT orchestratore;
- non sostituire GitHub come fonte di verità;
- aggiungere un livello di classificazione automatica locale che riduca le micro-interazioni di triage per task standard.

**Criterio permanente applicato:** quante micro-interazioni umane elimina il classifier Ollama?

## Scopo del Task

Valutare in modalità **docs-only** se Ollama locale può diventare classifier/planner zero-API per il low-touch loop, usando come base lo strato LLM Wiki appena creato.

Il documento di feasibility deve stabilire:
1. Se la qualità attesa è sufficiente per use case specifici.
2. Quale hardware usare per primo test.
3. Quali modelli sono candidati realistici.
4. Come si integra con wiki + n8n + Decision Packet.
5. Quali gate sono richiesti prima dell'attivazione runtime.

**Non installare nulla. Non eseguire test reali. Solo progettazione docs-only.**

## Output da Produrre (alla futura esecuzione)

1. **docs/automation/ollama-classifier-planner-feasibility-post-wiki.md** — documento di feasibility
2. **docs/sessions/** — sessione di completamento datata
3. **docs/tasks/done/0133-ollama-classifier-planner-feasibility-post-wiki.md** — done marker
4. **docs/PROJECT_STATE.md** — aggiornamento leggero solo al completamento
5. **docs/CHECKPOINT.md** — aggiornamento leggero solo al completamento
6. **docs/roadmap.md** — aggiornamento leggero solo al completamento
7. **docs/LLMS.md** — aggiornamento leggero solo al completamento (se lo stato cambia)
8. **docs/wiki/current-state.md** — aggiornamento leggero solo al completamento

## Aree di Progettazione Richieste

### 1. Obiettivo reale del classifier Ollama

Il documento deve definire con precisione cosa fa e cosa NON fa il classifier:

**Fa:**
- classifica il tipo di task (docs-only, runtime-gated, mixed, app-change, ecc.)
- stima il rischio (basso/medio/alto)
- identifica i gate richiesti
- suggerisce l'implementatore più adatto (Claude Code, Windsurf, Cursor CLI futuro)
- indica se serve un Decision Packet
- genera un prompt skeleton per l'implementatore (draft, non definitivo)
- legge `docs/LLMS.md` e `docs/wiki/current-state.md` + task file come input

**NON fa:**
- non sostituisce ChatGPT orchestratore
- non prende decisioni finali su deploy/tag/rollback
- non legge `docs/PROJECT_STATE.md` completo come input primario
- non gestisce credenziali o dati sensibili
- non modifica file direttamente
- non è fonte di verità (i canonici vincono sempre)
- le sue risposte sono suggerimenti, non autorizzazioni

### 2. Input del classifier

Il documento deve specificare il set di input minimale:

| Input | Fonte | Priorità |
|-------|-------|----------|
| Stato sistema compatto | `docs/LLMS.md` | Primario |
| Snapshot stato corrente | `docs/wiki/current-state.md` | Primario |
| File task singolo | `docs/tasks/queue/{task}.md` | Primario |
| Metadata task estratti | da file task | Primario |
| Riepilogo Auto-Aggio | output Auto-Aggio se disponibile | Secondario |
| PROJECT_STATE.md completo | solo come fallback | Fallback |

Regola fondamentale: il classifier non deve mai caricare PROJECT_STATE.md come input standard. Se LLMS.md + wiki + task file non bastano, il fallback è il triage manuale dell'orchestratore, non il caricamento dell'intero PROJECT_STATE.

### 3. Output del classifier

Il documento deve specificare il formato dell'output atteso:

| Campo output | Tipo | Note |
|-------------|------|------|
| `task_type` | enum | docs-only / runtime-gated / mixed / app-change / vps-change |
| `risk_level` | enum | low / medium / high |
| `gates_required` | lista | gate permanenti rilevati nel task |
| `recommended_implementer` | string | Claude Code / Windsurf / Cursor / manual |
| `needs_decision_packet` | bool | se serve scelta utente |
| `can_auto_proceed` | bool | se task è docs-only determinato senza gate |
| `needs_human` | bool | se richiede intervento umano esplicito |
| `prompt_skeleton` | testo | bozza prompt implementatore (draft) |
| `confidence` | enum | high / medium / low |

Se `confidence` è `low`, il classifier deve indicare che il triage manuale è preferibile.

### 4. Modelli candidati

Il documento deve valutare i modelli in modo docs-only (senza test reali):

| Modello | Parametri | Hardware | Note |
|---------|-----------|----------|------|
| Llama 3.1 8B / 3.2 3B | 3B–8B | MacBook Pro M2 (default) | Meta, open weights, buon equilibrio velocità/qualità |
| Qwen 2.5 7B / Qwen 3 7B | 7B | MacBook Pro M2 | Alibaba, ottima instruction following, multilingue |
| Qwen 2.5 14B / Qwen 3 14B | 14B | RTX 3060 12GB | Solo se 12GB VRAM sufficienti (verificare) |
| Mistral 7B | 7B | MacBook Pro M2 | Veloce, europeo (privacy), buon instruction following |
| Phi-3 Mini | 3.8B | MacBook Pro M2 | Microsoft, molto leggero per classificazione semplice |

Modelli 7B/8B come default. 14B solo se RTX 3060 12GB li carica in VRAM senza offloading significativo.

### 5. Hardware disponibile

Il documento deve analizzare il match hardware/modello:

| Macchina | Specs rilevanti | Candidato per |
|----------|----------------|---------------|
| **MacBook Pro M2** | Apple Silicon, 16 GB RAM unificata, 1 TB SSD | Always-on leggero; Ollama 7B/8B sostenibile; bassa latenza per classificazione; candidato per primo test |
| **Workstation AMD Ryzen 9 3900X** | 32 GB RAM, RTX 3060 12 GB VRAM | AI locale più pesante; 14B possibile; embedding generation; non always-on ma disponibile |
| **VPS IONOS** | CPU-only, economica | n8n runtime — mantenerla per automazione; **non usare per LLM inference** |

**Raccomandazione hardware per primo test:** MacBook Pro M2 (always-on, unified memory favorisce modelli 7B senza VRAM limit, bassa latenza, non blocca workstation per lavoro).

### 6. Feasibility senza runtime

Il documento deve definire i criteri e i test futuri senza eseguirli ora:

**Criteri di qualità minimi (da verificare quando si installa):**
- Classificazione tipo task corretta ≥ 90% su campione sintetico di 20 task storici del progetto.
- Gate identification corretta ≥ 95% (falsi negativi su gate = rischio alto — errore non tollerabile).
- Confidence `low` quando il task è ambiguo — il classifier non deve fingere certezza.
- Latenza accettabile: ≤ 10 secondi per classificazione su MacBook Pro M2.
- Nessuna allucinazione di gate non esistenti (falsi positivi tollerabili, falsi negativi no).

**Benchmark sintetico futuro (da progettare in task separato):**
- Dataset: 20–30 task storici del progetto con classificazione umana nota.
- Metriche: precision / recall per ogni campo output.
- Test ambiente: MacBook Pro M2, Ollama, modello 7B/8B.
- Test automatizzato: script Python/shell che legge task, genera prompt, chiama Ollama, confronta output.

**Failure modes:**
| Rischio | Probabilità | Impatto | Fallback |
|---------|------------|---------|---------|
| Classifier sbaglia tipo task | Media | Medio | Triage manuale orchestratore |
| Classifier manca gate runtime | Bassa | **Alto** | Gate check manuale sempre — mai auto-proceed su runtime |
| Latenza troppo alta (> 30s) | Media | Basso | Skip classifier, triage manuale |
| Modello 14B non entra in VRAM | Media | Basso | Usare 7B come fallback |
| Ollama non disponibile (down) | Bassa | Basso | Triage manuale orchestratore come baseline |
| Output strutturalmente malformato | Media | Medio | Retry o fallback manuale |

**Fallback invariante:** se il classifier fallisce per qualsiasi motivo, il loop torna alla modalità manuale-supervisionata (Fase A) senza perdita di stato. GitHub è fonte di verità — tutto è recuperabile.

### 7. Gate prima dell'installazione

Il documento deve elencare i gate espliciti che devono essere superati prima di qualsiasi installazione Ollama:

1. **Gate qualità:** test su dataset sintetico con criteri minimi soddisfatti (task preflight separato).
2. **Gate sicurezza:** conferma che Ollama locale non accede a credenziali, token, dati app Alina, Google Sheet.
3. **Gate hardware:** verifica che il modello scelto giri sulla macchina target entro parametri accettabili.
4. **Gate policy:** conferma che l'output del classifier è trattato come suggerimento, non come autorizzazione.
5. **Gate isolamento:** Ollama non deve avere accesso a rete durante inference (operazione offline).
6. **Gate supervisione:** prima attivazione in modalità dry-run (output loggato, nessuna azione automatica).
7. **Gate utente:** conferma manuale esplicita prima di qualsiasi runtime Ollama.

### 8. Relazione con LLMS.md e docs/wiki/

Il documento deve chiarire come il classifier si integra con il wiki layer:

- Il classifier legge `docs/LLMS.md` come contesto di sistema (stato progetto, workstream, gate aperti).
- Il classifier legge `docs/wiki/current-state.md` per lo snapshot corrente.
- Il classifier non legge `docs/PROJECT_STATE.md` come input standard.
- Se LLMS.md e PROJECT_STATE.md divergono (wiki stale), il classifier può produrre output errati — ragione per cui l'aggiornamento del wiki a ogni task è critico.
- Le risposte del classifier sono suggerimenti derivati dalla wiki: se la wiki è stale, i suggerimenti possono essere stale. I canonici vincono sempre.

**Implicazione operativa:** il protocollo di aggiornamento wiki (definito in task 0132) è un prerequisito per l'affidabilità del classifier.

### 9. Relazione con n8n e il low-touch loop

Il documento deve definire come il classifier si inserisce nel flusso n8n futuro:

**Posizione nell'architettura:**
```
GitHub → n8n queue reader → [Ollama classifier] → n8n prompt generator → implementatore
```

**Flusso atteso (Fase C futura):**
1. n8n rileva nuovo task in queue.
2. n8n invia il task + LLMS.md + wiki/current-state.md al classifier Ollama.
3. Ollama restituisce classificazione + suggerimenti.
4. Se `can_auto_proceed: true` e `risk_level: low`: n8n genera prompt automaticamente.
5. Se `needs_decision_packet: true` o `risk_level: medium/high`: n8n genera Decision Packet per INBOX.
6. Umano risponde al Decision Packet se necessario.

**Nessuna modifica n8n runtime ora.** L'integrazione richiede task runtime-gated separato.

### 10. Raccomandazione finale

Il documento deve concludere con una raccomandazione esplicita:

**Se procedere:** indicare quale macchina candidato per il primo test, quale modello, quale task storico usare come primo benchmark, e quale task runtime-gated aprire come passo successivo (es. "0134 Ollama Local Preflight Install").

**Se non procedere:** indicare il motivo (qualità attesa insufficiente, hardware non adatto, timing non giusto) e il fallback (continuare con triage manuale orchestratore).

**Decision Packet:** se durante la feasibility emergono ≥ 2 opzioni reali sull'architettura del classifier, il task deve emettere un Decision Packet conforme a `docs/automation/decision-packet-format.md`.

## Uso del Decision Packet Format

Se durante la progettazione emerge una scelta architetturale con ≥ 2 opzioni reali, il task futuro deve emettere un Decision Packet:
- Campo `kind` in posizione 2: `automation`
- Criterio "micro-interazioni umane eliminate" obbligatorio
- Massimo 3–5 opzioni
- Raccomandazione esplicita

## Allowed Paths (futura esecuzione)

- `docs/automation/ollama-classifier-planner-feasibility-post-wiki.md`
- `docs/sessions/**`
- `docs/tasks/done/0133-ollama-classifier-planner-feasibility-post-wiki.md`
- `docs/PROJECT_STATE.md` solo al completamento
- `docs/CHECKPOINT.md` solo al completamento
- `docs/roadmap.md` solo al completamento
- `docs/LLMS.md` solo al completamento
- `docs/wiki/current-state.md` solo al completamento
- `docs/wiki/token-efficiency.md` solo se strettamente necessario per aggiornare la guida di navigazione

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
- Nessuna installazione Ollama, nessun download modelli
- Nessuna creazione embeddings reali
- Nessun avvio servizi locali
- Nessun deploy, tag, rollback
- `docs/INBOX.md` NON viene creato in questo task
- `docs/history/PROJECT_LOG.md` NON viene creato in questo task

---
**Task creato — Ollama Classifier/Planner Feasibility (Post-Wiki) in attesa di esecuzione**
