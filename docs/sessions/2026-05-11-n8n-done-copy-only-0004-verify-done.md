# Sessione — n8n done copy-only 0004 verify done

## Data

2026-05-11

## Stato

**Verify done OK** — nodo **`Verify done file`** aggiunto e validato nel workflow generalizzato sul task **0004**.

## Workflow

**`TEST - Mark Alina task done copy-only generalized`**

Contesto idempotente **Create/Edit**: [`2026-05-11-n8n-done-copy-only-0004-idempotent-rerun.md`](./2026-05-11-n8n-done-copy-only-0004-idempotent-rerun.md).

## Struttura validata (con `Verify done file`)

```text
Check done file exists
├→ Success → Update done file → Verify done file
└→ Error   → Create done file → Verify done file
→ Get automation session
→ Build updated session
→ Update automation session
```

### Configurazione `Verify done file`

| Impostazione | Valore |
|----------------|--------|
| **Nodo** | GitHub |
| **Resource** | File |
| **Operation** | Get |
| **File Path** (Expression) | `{{ $('Build done copy content').item.json.done_path }}` |
| **Branch / Reference** | `main` |

## Validazione (esecuzione reale)

- Workflow eseguito **completo**; tutti i nodi **verdi**.
- Il file **`docs/tasks/done/0004-test-n8n-done-copy-only-generalized.md`** esisteva già: percorso **Success** → **`Update done file`** (Edit) → **`Verify done file`** (GET di conferma sullo stesso path).
- **`Verify done file`** ha riletto correttamente `docs/tasks/done/0004-test-n8n-done-copy-only-generalized.md`.
- **`Get automation session`**, **`Build updated session`**, **`Update automation session`** hanno completato la catena su `docs/sessions/automation-0004-test-n8n-done-copy-only-generalized.md`.
- **Nessuna delete** da `docs/tasks/queue/`.
- **Nessuna** modifica app, **nessun** deploy, **nessun** tag.

## File verificati

- `docs/tasks/done/0004-test-n8n-done-copy-only-generalized.md`
- `docs/sessions/automation-0004-test-n8n-done-copy-only-generalized.md`
- `docs/tasks/queue/0004-test-n8n-done-copy-only-generalized.md` (preservato in coda)

### Contenuto atteso del `done` (controllo su GitHub)

Il file `done` contiene ancora:

- il **task originale**;
- la sezione **`## Done copy-only outcome`**;
- `status: done`;
- `outcome: copy-only generalized validation`;
- **path** coerenti verso queue, processing e sessione.

## Esito

| Aspetto | Esito |
|---------|--------|
| Workflow generalizzato con **create/update** + **verify** post-write | OK |
| **Idempotenza** di base (Success → Update senza Create) | Confermata |
| **Controllo** GET dopo write | Aggiunto e OK |
| **Pronto** per progettare **skip** nel queue reader se esiste già `done` | Sì |

## Limiti residui

- Input ancora **manuale** tramite **`Set task input`** (`task_name`).
- Il workflow **non** gestisce **`failed`**.
- **Non** esegue **Cursor**.
- **Non** è ancora collegato automaticamente al **queue reader**.
- Il **queue reader** **non** salta ancora i task in base alla presenza di **`docs/tasks/done/{task}.md`**.

## Prossimo passo consigliato

**Progettare e implementare** lo **skip** nel queue reader quando esiste già **`docs/tasks/done/{task}.md`** (coordinato con [`done-copy-only-generalization.md`](../automation/n8n-workflows/done-copy-only-generalization.md) e [`task-lifecycle.md`](../automation/n8n-workflows/task-lifecycle.md)).

## Riferimenti

- [`done-copy-only-generalization.md`](../automation/n8n-workflows/done-copy-only-generalization.md)
- [`2026-05-11-n8n-done-copy-only-0004-generalized-validation.md`](./2026-05-11-n8n-done-copy-only-0004-generalized-validation.md)
- [`2026-05-11-n8n-done-copy-only-0004-idempotent-rerun.md`](./2026-05-11-n8n-done-copy-only-0004-idempotent-rerun.md)
