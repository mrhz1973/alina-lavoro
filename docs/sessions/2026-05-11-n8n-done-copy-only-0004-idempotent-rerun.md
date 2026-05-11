# Sessione — n8n done copy-only 0004 idempotent rerun

## Data

2026-05-11

## Stato

Rerun **idempotente OK** sul workflow generalizzato e sul task **0004**.

## Workflow

**`TEST - Mark Alina task done copy-only generalized`**

Prima validazione del ramo **Error / Not Found → Create done file** e dei path dinamici: [`2026-05-11-n8n-done-copy-only-0004-generalized-validation.md`](./2026-05-11-n8n-done-copy-only-0004-generalized-validation.md). Questa sessione documenta la **seconda fase**: ramo **Success** → **`Update done file`** e **riesecuzione completa** senza errori.

## Scope

Solo **documentazione** dell’esito osservato su n8n/GitHub; **nessuna modifica** al codice applicativo Alina, **nessun** intervento sul grafo da questo commit, **nessun** deploy/tag/`gas-current/`.

## Struttura nodi validata (reale, con idempotenza)

```text
Manual Trigger
→ Set task input
→ Build dynamic paths
→ Get queue task
→ Build done copy content
→ Check done file exists
   ├→ Success / file esiste → Update done file
   └→ Error / Not Found    → Create done file
→ Get automation session
→ Build updated session
→ Update automation session
```

I rami **Success** (Edit) e **Error / Not Found** (Create) **convergono** verso **`Get automation session`** dopo aver assicurato che il file `done` esista e sia allineato al contenuto costruito.

*(Struttura successiva con **`Verify done file`** tra write e sessione: vedi [`2026-05-11-n8n-done-copy-only-0004-verify-done.md`](./2026-05-11-n8n-done-copy-only-0004-verify-done.md).)*

- Aggiunto e collegato il nodo **`Update done file`** sul ramo **Success** di **`Check done file exists`**.
- Configurazione **`Update done file`**:
  - **Nodo:** GitHub
  - **Resource:** File
  - **Operation:** Edit
  - **File Path** dinamico (Expression) da output di **`Build done copy content`** (es. campo `done_path` coerente con il path calcolato).
  - **File Content** dinamico da **`Build done copy content`** (Markdown aggiornato con sezione outcome).
- **`Update done file`** collegato a **`Get automation session`** (stesso tail del ramo Create).
- **Rimosso** il nodo legacy hardcoded **`Update done file 0003`** dal flusso generalizzato.
- **Riesecuzione** del workflow completa: esito **tutti i nodi verdi**.

## Esito del rerun (task 0004)

Poiché **`docs/tasks/done/0004-test-n8n-done-copy-only-generalized.md`** esisteva già dopo la prima validazione:

- **`Check done file exists`** ha preso il ramo **Success** (file trovato).
- **`Update done file`** ha **aggiornato** il file `done` tramite **Edit** (idempotenza rispetto al solo **Create** sul path già occupato).
- **`Get automation session`** ha letto **`docs/sessions/automation-0004-test-n8n-done-copy-only-generalized.md`**.
- **`Build updated session`** ha ricostruito la sezione **`## Done copy-only outcome`** (logica di sostituzione/append controllata come da design del flusso).
- **`Update automation session`** ha **aggiornato** la sessione **0004**.

Durante questo rerun **non** è stato attraversato il nodo **`Create done file`**. **Nessuna delete** da `docs/tasks/queue/`. **Nessuna** modifica app, deploy o tag.

## File verificati (coerenza attesa)

- `docs/tasks/queue/0004-test-n8n-done-copy-only-generalized.md` (sempre presente)
- `docs/tasks/done/0004-test-n8n-done-copy-only-generalized.md` (aggiornato via Edit)
- `docs/sessions/automation-0004-test-n8n-done-copy-only-generalized.md` (aggiornato)

Il prompt in `docs/tasks/processing/0004-test-n8n-done-copy-only-generalized-cursor-prompt.md` resta il contesto di riferimento del task; non è necessariamente riscritto da questo workflow.

## Limiti residui

- **Failed** e **Cursor** restano fuori scope.
- **Race** tra esecuzioni concorrenti sullo stesso `task_name`: mitigare con runner unico o lock (come da `done-copy-only-generalization.md`).
- **Successiva evoluzione:** nodo **`Verify done file`** (GET post-write su `done_path`) aggiunto e validato — vedi [`2026-05-11-n8n-done-copy-only-0004-verify-done.md`](./2026-05-11-n8n-done-copy-only-0004-verify-done.md).

## Prossimo passo consigliato

Valutare **skip in queue reader** se esiste già `docs/tasks/done/{task}.md` (o sezione di chiusura in sessione), come anticipato in [`done-copy-only-generalization.md`](../automation/n8n-workflows/done-copy-only-generalization.md) insieme a [`task-lifecycle.md`](../automation/n8n-workflows/task-lifecycle.md), **prima** di automatizzare chiusure su task non di test.

## Riferimenti

- [`done-copy-only-generalization.md`](../automation/n8n-workflows/done-copy-only-generalization.md)
- [`done-copy-only.md`](../automation/n8n-workflows/done-copy-only.md)
- [`2026-05-11-n8n-done-copy-only-0004-generalized-validation.md`](./2026-05-11-n8n-done-copy-only-0004-generalized-validation.md)
- [`2026-05-11-n8n-done-copy-only-0004-verify-done.md`](./2026-05-11-n8n-done-copy-only-0004-verify-done.md) (GET post-write successivo alla fase documentata in questa sessione)
