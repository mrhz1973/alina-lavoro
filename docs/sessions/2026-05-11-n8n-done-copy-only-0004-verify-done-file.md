# Sessione — n8n done copy-only 0004 Verify done file

## Data

2026-05-11

## Stato

Validazione manuale **OK** del nodo **`Verify done file`** nel workflow generalizzato sul task **0004**.

## Workflow

**`TEST - Mark Alina task done copy-only generalized`**

Contesto precedente: idempotenza **Create/Edit** documentata in [`2026-05-11-n8n-done-copy-only-0004-idempotent-rerun.md`](./2026-05-11-n8n-done-copy-only-0004-idempotent-rerun.md).

## Scope

Solo **documentazione** dell’implementazione e dell’esito osservato in n8n; **nessuna modifica** al codice applicativo Alina, **nessun** deploy/tag/`gas-current/`.

## Nodo `Verify done file`

| Impostazione | Valore |
|----------------|--------|
| **Tipo** | GitHub |
| **Resource** | File |
| **Operation** | Get |
| **File Path** (Expression) | `{{ $('Build done copy content').item.json.done_path }}` |
| **Branch** | `main` |

Scopo: **GET** di conferma sul path `done` dopo **`Update done file`** o **`Create done file`**, prima di proseguire con lettura/aggiornamento sessione.

## Struttura validata (dopo modifica)

```text
Check done file exists
├→ Success → Update done file → Verify done file
└→ Error   → Create done file → Verify done file
→ Get automation session
→ Build updated session
→ Update automation session
```

I due rami (**Success** e **Error**) convergono su **`Verify done file`**, quindi sul tail comune **sessione** (coerente con la richiesta di verificare il `done` persistito prima degli update su `docs/sessions/`).

## Esito osservato

- Esecuzione manuale del workflow sul task **0004**: percorso completato con **esito positivo** (nodi verdi), incluso **`Verify done file`** su entrambe le strategie operative (in un run tipico post-idempotenza si attraversa **Success → Update → Verify**; il ramo **Create** resta disponibile per il primo bootstrap del file `done`).
- **Nessuna delete** da `docs/tasks/queue/`.
- **Nessuna** modifica app, deploy o tag.

## File di riferimento (GitHub)

- `docs/tasks/done/0004-test-n8n-done-copy-only-generalized.md` (oggetto del GET di verifica)
- `docs/sessions/automation-0004-test-n8n-done-copy-only-generalized.md` (aggiornata a valle, come da flusso esistente)

## Limiti residui

- Il nodo **Get** conferma presenza/path; **non** sostituisce un’**asserzione** automatica sul contenuto (es. presenza obbligatoria della sezione `## Done copy-only outcome`) salvo estensioni future in n8n.
- **Race** e **SHA** obsoleti restano mitigazioni da policy operative (runner unico, ecc.).

## Prossimo passo consigliato

Valutare **skip** nel queue reader quando esiste già `docs/tasks/done/{task}.md` (coerente con [`done-copy-only-generalization.md`](../automation/n8n-workflows/done-copy-only-generalization.md) e [`task-lifecycle.md`](../automation/n8n-workflows/task-lifecycle.md)).

## Riferimenti

- [`done-copy-only-generalization.md`](../automation/n8n-workflows/done-copy-only-generalization.md)
- [`2026-05-11-n8n-done-copy-only-0004-generalized-validation.md`](./2026-05-11-n8n-done-copy-only-0004-generalized-validation.md)
- [`2026-05-11-n8n-done-copy-only-0004-idempotent-rerun.md`](./2026-05-11-n8n-done-copy-only-0004-idempotent-rerun.md)
