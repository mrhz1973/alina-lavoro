# Session — Creazione Task 0133: Ollama Classifier/Planner Feasibility (Post-Wiki)

**Data:** 2026-05-12  
**Tipo sessione:** task-creation-only (lifecycle rule)  
**Task creato:** `docs/tasks/queue/0133-ollama-classifier-planner-feasibility-post-wiki.md`

---

## Contesto

Sessione di sola creazione del task 0133 nella queue. Non vengono aggiornati `docs/PROJECT_STATE.md`, `docs/CHECKPOINT.md` né `docs/roadmap.md` — la regola lifecycle del progetto riserva quegli aggiornamenti al completamento del task.

Il task 0133 è il passo successivo nella roadmap low-touch, determinato direttamente dal completamento di task 0132 (LLM Wiki / Token Efficiency Design).

---

## Perché viene dopo 0132

Task 0132 ha creato il livello derivato AI-friendly (`docs/LLMS.md` + `docs/wiki/`) che cambia significativamente l'architettura del futuro classifier Ollama. La versione originale di questo task nella roadmap prevedeva semplicemente "Ollama Classifier/Planner Feasibility"; la riformulazione post-wiki è necessaria perché:

- Il classifier non deve più leggere `docs/PROJECT_STATE.md` completo (47k+ caratteri) come input standard
- Il classifier può leggere `docs/LLMS.md` (≤200 righe) + `docs/wiki/current-state.md` (≤100 righe) come input primario
- Questo riduce il contesto di input stimato da ~47k a ~3–4k caratteri per classificazione — cambiamento architetturale rilevante

Il nome 0133 è stato aggiornato a "Post-Wiki" per riflettere questa riformulazione.

---

## Relazione con LLMS.md e docs/wiki/

Il futuro documento di feasibility (`docs/automation/ollama-classifier-planner-feasibility-post-wiki.md`) — che verrà prodotto all'esecuzione del task 0133 — dovrà specificare esattamente come il classifier consuma il wiki layer:

- `docs/LLMS.md` come contesto di sistema (stato progetto, workstream, gate aperti) — input primario
- `docs/wiki/current-state.md` come snapshot corrente — input primario
- `docs/PROJECT_STATE.md` come fallback solo quando LLMS.md + wiki non bastano — mai come input standard
- Regola derivata: se il wiki è stale, il classifier produce output stale → il protocollo di aggiornamento wiki (task 0132) è prerequisito di affidabilità

---

## Perché feasibility docs-only e non runtime

Il task 0133 è `low-touch-loop-docs-only` per ragioni strutturali:

1. Non esiste ancora un modello locale selezionato e testato per questo use case
2. L'installazione di Ollama richiede un gate manuale esplicito (documentato nel task)
3. Il download di modelli LLM (~4–8 GB per modello 7B/8B) richiede gate hardware
4. Il primo test runtime richiede benchmark su dataset sintetico di task storici — lavoro separato
5. La feasibility docs-only permette di definire criteri, modelli candidati, hardware target, gate e architettura d'integrazione prima di qualsiasi installazione

Il task 0133 produce solo documentazione. Il primo task runtime-gated Ollama sarà un task separato successivo (es. "0134 Ollama Local Preflight Install"), da aprire solo dopo che la feasibility docs-only è stata completata e la raccomandazione è positiva.

---

## File creato in queue

**`docs/tasks/queue/0133-ollama-classifier-planner-feasibility-post-wiki.md`**

Il task specifica:
- Tipo: `low-touch-loop-docs-only`
- Priorità: normal
- Status: queued
- Deploy/Runtime/App changes: no
- Gate manuale obbligatorio prima di: Ollama install, model download, embeddings runtime, local service, VPS change, n8n runtime, API key, login, GitHub Actions, deploy, tag, rollback, runner automatico
- 10 aree di progettazione per il documento di feasibility
- Hardware documentato: MacBook Pro M2 (candidato per primo test), workstation AMD Ryzen 9 3900X + RTX 3060 12GB (AI locale più pesante), VPS IONOS (solo n8n, non LLM inference)
- Prerequisiti: task 0127–0132 completati, `docs/LLMS.md` e `docs/wiki/current-state.md` esistenti

---

## Vincoli rispettati

- Nessuna modifica a `docs/PROJECT_STATE.md` (lifecycle rule — solo al completamento)
- Nessuna modifica a `docs/CHECKPOINT.md` (lifecycle rule — solo al completamento)
- Nessuna modifica a `docs/roadmap.md` (lifecycle rule — solo al completamento)
- Nessuna installazione Ollama
- Nessun download modelli
- Nessuna creazione embeddings reali
- Nessun avvio servizi locali
- Nessuna modifica app Alina
- Nessuna modifica VPS / n8n runtime / GitHub Actions
- Nessun deploy, tag, rollback
- `docs/INBOX.md` NON creato
- `docs/history/PROJECT_LOG.md` NON creato

---

## Cosa non viene fatto ora

- Il documento di feasibility `docs/automation/ollama-classifier-planner-feasibility-post-wiki.md` NON viene creato in questa sessione — è l'output del task 0133 alla sua futura esecuzione
- Nessun test Ollama reale
- Nessun benchmark su dataset sintetico
- Nessuna valutazione modelli con test effettivi
- Nessuna modifica n8n per integrazione con classifier

---

## Prossimo comportamento atteso

Con il task 0133 ora in queue, al prossimo ciclo di polling n8n (ogni 5 minuti, Europe/Berlin), il queue reader `TEST - GitHub list Alina task queue` rileverà il file come task eleggibile e genererà automaticamente:
- `docs/tasks/processing/0133-ollama-classifier-planner-feasibility-post-wiki-cursor-prompt.md`
- `docs/sessions/automation-0133-ollama-classifier-planner-feasibility-post-wiki.md`

L'esecuzione effettiva del task richiede poi l'intervento manuale dell'implementatore (Claude Code o altro implementatore supervisionato) sul prompt generato.

---

**Sessione chiusa — task 0133 in queue, nessun runtime modificato, workspace clean.**
