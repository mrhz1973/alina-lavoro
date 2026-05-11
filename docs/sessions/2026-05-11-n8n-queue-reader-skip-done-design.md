# Sessione — n8n queue reader skip `done` (design documentale)

## Data

2026-05-11

## Obiettivo

Documentare il **micro-step** successivo per il workflow n8n **`TEST - GitHub list Alina task queue`**: estendere lo **skip** del queue reader in modo che un task in `docs/tasks/queue/` venga ignorato non solo se esiste `docs/tasks/processing/{task}-cursor-prompt.md`, ma anche se esiste **`docs/tasks/done/{task}.md`**, allineando il comportamento al contratto descritto in **`done-copy-only-generalization.md`** (task che restano in coda dopo copy-only **done** non devono essere riselezionati per nuovi prompt).

## File modificati

- `docs/automation/n8n-workflows/queue-reader.md`
- `docs/automation/n8n-workflows/queue-reader-ai-friendly-template.md`
- `docs/automation/n8n-workflows/done-copy-only-generalization.md` (aggiornamento minimo: interazione queue reader + riferimenti / prossimo passo)
- `docs/sessions/2026-05-11-n8n-queue-reader-skip-done-design.md` (questo file)

## Cosa è stato documentato

- Stato e **scopo** del queue reader: lettura anche di **`docs/tasks/done/`**; filtro sul **primo** `.md` in coda **senza** prompt in `processing` **né** file omonimo in `done`.
- **Grafo nodi**: nodo **List done files** dopo **List processing files**, prima di **Filter first queued task**; filtro aggiornato; **nessuna delete** da `queue`.
- **Regole operative** e **contratto** incrociato con **`done-copy-only-generalization.md`**.
- Template **AI-friendly**: placeholder **`DONE_PATH`**, struttura nodi con **List done files**, pseudo-code del filtro (escludere `.gitkeep`, ordinamento, skip doppio).

## Cosa NON è stato fatto

- **Nessuna** modifica al codice applicativo Alina (`src/`, `Index.html`, `Code.gs`, ecc.).
- **Nessuna** modifica a workflow n8n **reali** nell’istanza operativa (solo specifica in repository).
- **Nessun** deploy Apps Script, **nessun** tag Git, **nessun** tocco a `gas-current/`.
- **Nessuna** validazione end-to-end in n8n del nuovo ramo **`done`** (non eseguita in questa sessione).

## Rischio residuo

Fino a quando il workflow n8n **non** viene aggiornato e testato, i task con file già presente in **`docs/tasks/done/`** ma ancora in **`docs/tasks/queue/`** possono continuare a essere **eleggibili** dal reader attuale (solo skip **processing** oggi validato). Dopo l’implementazione, restano da considerare **race** tra lettura liste e commit esterni, e coerenza dei **basename** `{task}` tra cartelle.

## Prossimo passo operativo

**Implementare e testare in n8n** il nodo **List done files** (`docs/tasks/done`), aggiornare il **Code** `Filter first queued task` (o equivalente) secondo `queue-reader.md` e `queue-reader-ai-friendly-template.md`, poi documentare una sessione di **validazione** con casi controllati (solo `done`, solo `processing`, entrambi, nessuno).

## Riferimenti

- [`docs/automation/n8n-workflows/queue-reader.md`](../automation/n8n-workflows/queue-reader.md)
- [`docs/automation/n8n-workflows/queue-reader-ai-friendly-template.md`](../automation/n8n-workflows/queue-reader-ai-friendly-template.md)
- [`docs/automation/n8n-workflows/done-copy-only-generalization.md`](../automation/n8n-workflows/done-copy-only-generalization.md)
- [`docs/automation/n8n-workflows/task-lifecycle.md`](../automation/n8n-workflows/task-lifecycle.md)
- [`docs/sessions/2026-05-11-n8n-queue-reader-processing-skip.md`](./2026-05-11-n8n-queue-reader-processing-skip.md)
