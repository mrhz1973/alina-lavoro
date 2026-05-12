# Sessione — Creazione Task 0132: LLM Wiki / Token Efficiency Design (2026-05-12)

**Data:** 2026-05-12  
**Tipo:** creazione task docs-only  
**Task creato:** `docs/tasks/queue/0132-llm-wiki-token-efficiency-design.md`

---

## Contesto

Task 0131 (n8n Decision Packet Generator Design) completato. La roadmap originale prevedeva "0132 Ollama Classifier/Planner Feasibility" come passo successivo. Prima di arrivare a runtime Ollama, è emersa una priorità più urgente: ridurre il consumo di token e le letture ripetute per tutti gli agenti che operano sul progetto.

Il progetto ha accumulato:
- `docs/PROJECT_STATE.md` > 47 k caratteri — warning performance attivo in Claude Code, impatto probabile su Windsurf e Cursor a ogni sessione.
- Più documenti canonici letti integralmente a ogni avvio agente (ORCHESTRATOR_RULES, AI_RULES, WORKFLOW, COMMANDS, PROJECT_STATE, CHECKPOINT).
- Nessuno strato di memoria sintetica derivata AI-friendly per ridurre il carico di contesto.

Il debito tecnico legato alla dimensione di PROJECT_STATE era già stato registrato in `docs/sessions/2026-05-12-register-project-state-compaction-debt.md`.

---

## Perché la Priorità è Token Efficiency e Non Runtime

L'idea originale "Ollama Classifier/Planner Feasibility" puntava a ridurre micro-interazioni nel flusso di triage task. Ma il costo maggiore non è il triage: è la larghezza del contesto che ogni agente carica a ogni sessione.

**Prima di installare Ollama**, il progetto ha bisogno di:
1. Un entry point compatto (`docs/LLMS.md`) che gli agenti possano leggere invece di PROJECT_STATE intero.
2. Una wiki sintetica (`docs/wiki/`) con memoria derivata AI-friendly.
3. Un protocollo di aggiornamento che mantenga la wiki sincronizzata senza micro-interazioni aggiuntive.

**Stima qualitativa dell'impatto:**
- Oggi: agente legge PROJECT_STATE (47k+) + CHECKPOINT + regole = decine di migliaia di token per sessione, ripetuti a ogni task.
- Dopo: agente legge LLMS.md (≤ 200 righe) + wiki sintetica + canonici solo se necessario = risparmio stimato ~70–80% per sessione standard.

Questo impatto è immediato, zero-runtime, applicabile a ChatGPT orchestratore, Claude Code, Cursor, Windsurf e futuri agenti n8n. Ollama porta valore aggiuntivo dopo.

---

## Relazione con Debito Tecnico PROJECT_STATE

La compattazione di `docs/PROJECT_STATE.md` (debito tecnico registrato) e la creazione della wiki sono **complementari ma distinte**:

| Approccio | Cosa risolve | Quando |
|-----------|-------------|--------|
| Wiki (questo task 0132) | Riduce la necessità di leggere PROJECT_STATE spesso | Ora — docs-only |
| Compattazione PROJECT_STATE | Riduce la dimensione del file quando viene letto | Task futuro docs-only separato |

La wiki può essere creata prima della compattazione: riduce il problema senza attendere il task di compattazione. I due task convergono verso lo stesso obiettivo ma hanno scope diverso e non si bloccano a vicenda.

---

## Principio Fondamentale Registrato

GitHub e i documenti canonici restano **fonte di verità**. La wiki (`docs/LLMS.md`, `docs/wiki/`) è **memoria derivata**: versione compressa e AI-friendly per ridurre token.

**Regola di priorità:** se wiki e documenti canonici divergono, **vincono sempre i documenti canonici**.

---

## Relazione con Roadmap Low-Touch

Il task 0132 si inserisce nella sequenza low-touch come:

```
0131 (DP Generator Design) completato
→ 0132 (LLM Wiki / Token Efficiency Design) — questo task, ora in queue
→ Successivo: Ollama Classifier/Planner Feasibility (riformulato post-wiki)
→ Successivo: Implementer Bridge Design
→ Debito tecnico: Compattazione PROJECT_STATE (timing flessibile)
```

La riformulazione del task Ollama post-wiki è coerente: Ollama diventa più efficace quando il sistema ha già una wiki sintetica come base di contesto compatto per il classifier/planner.

---

## Hardware Documentato per Fase Futura

Il task 0132 dovrà documentare il hardware disponibile per la Fase C (runtime Ollama, non ora):
- **MacBook Pro M2** — orchestratore always-on leggero, Ollama 7B/8B sostenibile
- **Workstation RTX 3060 12GB** — capacità AI locale maggiore, modelli fino a 14B
- **VPS IONOS economica** — mantenerla per n8n, non ideale per LLM pesanti

Nessuna installazione in questo task: solo registrazione della direzione.

---

## File Creato in Queue

**`docs/tasks/queue/0132-llm-wiki-token-efficiency-design.md`**

Contenuto: task docs-only completo con metadata, contesto strategico, scopo, output richiesti, 12 aree di progettazione, allowed/forbidden paths, note operative.

---

## Vincoli Confermati

- Nessun runtime modificato.
- Nessuna app Alina modificata.
- Nessun VPS, n8n runtime, GitHub Actions, runner automatico.
- Nessuna installazione Ollama.
- Nessuna creazione embeddings reali.
- Nessun deploy, tag, rollback.
- `docs/LLMS.md` e `docs/wiki/` NON creati ora (riservati all'esecuzione del task 0132).
- `docs/INBOX.md` NON creato (riservato a task futuro mixed/runtime-gated).
- `docs/history/PROJECT_LOG.md` NON creato (riservato a task futuro compattazione).
- `docs/PROJECT_STATE.md` e `docs/CHECKPOINT.md` NON aggiornati in questo step (regola lifecycle: solo alla creazione del task si aggiornano queue + sessione).

---

## Cosa Non Viene Fatto Ora

- Il design completo (`docs/automation/local-llm-wiki-token-efficiency-design.md`) viene prodotto all'esecuzione del task, non ora.
- `docs/LLMS.md` viene creato all'esecuzione del task, non ora.
- `docs/wiki/` viene creata all'esecuzione del task, non ora.
- La compattazione di PROJECT_STATE è un task separato con timing diverso.
- L'installazione di Ollama è runtime-gated e richiede task preflight separato.

---

## Prossimo Comportamento Atteso

1. Il queue reader n8n rileverà `0132-llm-wiki-token-efficiency-design.md` nel prossimo polling.
2. n8n genererà il cursor prompt in `docs/tasks/processing/`.
3. L'implementatore (Claude Code locale, supervisionato) eseguirà il task producendo:
   - `docs/automation/local-llm-wiki-token-efficiency-design.md`
   - `docs/LLMS.md`
   - `docs/wiki/current-state.md`
   - `docs/wiki/token-efficiency.md`
   - sessione di completamento
   - done marker in `docs/tasks/done/`
   - aggiornamenti leggeri a PROJECT_STATE, CHECKPOINT, roadmap
4. `docs/PROJECT_STATE.md` e `docs/CHECKPOINT.md` verranno aggiornati **solo al completamento** del task 0132.

---

**Sessione di creazione task 0132 registrata. Nessun runtime. Nessuna modifica app. Workspace pulito atteso.**
