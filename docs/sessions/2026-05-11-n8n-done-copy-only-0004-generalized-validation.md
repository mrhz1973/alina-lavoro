# Sessione — n8n done copy-only 0004 generalized validation

## Data

2026-05-11

## Stato

Validazione manuale **OK** sul workflow generalizzato e sul task **0004**.

## Workflow

**`TEST - Mark Alina task done copy-only generalized`**

Workflow duplicato e generalizzato rispetto a **`TEST - Mark Alina task done copy-only`** (baseline hardcoded sul task **0003**, documentata in [`done-copy-only.md`](../automation/n8n-workflows/done-copy-only.md)).

## Scope

Solo documentazione di questa sessione e riferimento a file task/sessione/`done` già presenti su GitHub; **nessuna modifica** al codice applicativo Alina, **nessun** intervento sul grafo n8n da questa commit, **nessun** deploy/tag/`gas-current/`.

## Struttura nodi validata (reale)

```text
Manual Trigger
→ Set task input
→ Build dynamic paths
→ Get queue task
→ Build done copy content
→ Check done file exists
   └→ Error / Not Found → Create done file
→ Get automation session
→ Build updated session
→ Update automation session
```

Task di riferimento in **`docs/tasks/queue/0004-test-n8n-done-copy-only-generalized.md`**.

## Dettagli tecnici e correzioni applicate

### 1. `Set task input`

- `task_name = 0004-test-n8n-done-copy-only-generalized`

### 2. `Build dynamic paths`

Genera (verificato):

- `queue_path = docs/tasks/queue/0004-test-n8n-done-copy-only-generalized.md`
- `done_path = docs/tasks/done/0004-test-n8n-done-copy-only-generalized.md`
- `cursor_prompt_path = docs/tasks/processing/0004-test-n8n-done-copy-only-generalized-cursor-prompt.md`
- `session_path = docs/sessions/automation-0004-test-n8n-done-copy-only-generalized.md`

### 3. `Get queue task`

- In prima battuta l’espressione dinamica nel **File Path** non veniva valutata come atteso.
- Un **path fisso** è stato usato come **test diagnostico** (repo, credential, branch, file OK).
- **Correzione:** **File Path** in modalità **Expression** con:
  `{{ $('Build dynamic paths').item.json.queue_path }}`
- Esito: **lettura dinamica OK**.

### 4. `Build done copy content`

- Logica resa **dinamica**; usa i path prodotti da **`Build dynamic paths`**.
- Produce Markdown `done` con sezione **`## Done copy-only outcome`**.
- Nessun riferimento residuo hardcoded al task **0003**.

### 5. `Check done file exists`

- Nodo **GitHub / File / Get**.
- **File Path** (Expression):
  `{{ $('Build done copy content').item.json.done_path }}`
- Esito atteso alla **prima** esecuzione: **Not Found**.
- **Settings:** `Continue using error output`.
- Ramo **Error** collegato a **`Create done file`**.

### 6. `Create done file`

- Nodo **GitHub / File / Create**.
- Crea **`docs/tasks/done/0004-test-n8n-done-copy-only-generalized.md`**.
- Il vecchio nodo **`Update done file 0003`** (hardcoded) è stato **scollegato** perché generava errore nel flusso generalizzato.
- File `done` creato correttamente.

### 7. `Get automation session`

- Reso **dinamico**; legge **`docs/sessions/automation-0004-test-n8n-done-copy-only-generalized.md`**.

### 8. `Build updated session`

- Reso **dinamico**; aggiunge **`## Done copy-only outcome`** alla sessione.
- Rimuove (o sostituisce in modo controllato) un eventuale outcome precedente prima di appenderne uno nuovo.
- Nessun riferimento residuo a **0003**.

### 9. `Update automation session`

- Reso **dinamico**; aggiorna **`docs/sessions/automation-0004-test-n8n-done-copy-only-generalized.md`**.

## File verificati (GitHub)

- `docs/tasks/queue/0004-test-n8n-done-copy-only-generalized.md` (presente; **nessuna delete** da `queue`)
- `docs/tasks/processing/0004-test-n8n-done-copy-only-generalized-cursor-prompt.md` (contesto del task; non oggetto diretto di modifica da questo workflow nella validazione descritta)
- `docs/tasks/done/0004-test-n8n-done-copy-only-generalized.md` (creato; include task originale + **`## Done copy-only outcome`**)
- `docs/sessions/automation-0004-test-n8n-done-copy-only-generalized.md` (aggiornato; contiene **`## Done copy-only outcome`**)

## Esito

| Controllo | Esito |
|-----------|--------|
| Generalizzazione di base (input + path dinamici) | OK |
| Path dinamici coerenti con convenzione `{task}` | OK |
| File `done` creato | OK |
| Sessione automation aggiornata | OK |
| `queue` preservata (copy-only) | OK |
| Nessuna modifica app / deploy / tag / rollback | OK |

## Limiti residui (post-validazione)

- Il ramo **Success** di **`Check done file exists`** **non** è ancora collegato a un **`Update done file`** dinamico: alla **riesecuzione** il flusso può non essere **idempotente** come il workflow 0003 dopo la correzione Edit/upsert.
- Possono restare nel canvas **nodi legacy hardcoded 0003** da **ripulire** o sostituire con equivalenti dinamici.
- **Update** del file `done` **già esistente** non è ancora **validato** nel workflow generalizzato.
- **Non** gestisce **`failed`**.
- **Non** esegue **Cursor**.

## Prossimo passo consigliato

Implementare e validare il ramo **Success** di **`Check done file exists`** verso un nodo **`Update done file`** (path dinamico, update con `sha` / Edit idempotente), così il workflow generalizzato diventa **ri-eseguibile** anche per il task **0004** senza dipendere solo dal ramo **Create** su 404.

## Riferimenti

- [`done-copy-only-generalization.md`](../automation/n8n-workflows/done-copy-only-generalization.md)
- [`done-copy-only.md`](../automation/n8n-workflows/done-copy-only.md)
- [`done-failed-design.md`](../automation/n8n-workflows/done-failed-design.md)
- [`task-lifecycle.md`](../automation/n8n-workflows/task-lifecycle.md)
