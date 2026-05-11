# Sessione — n8n queue reader 0002 validation

## Data

2026-05-11

## Stato

Validazione manuale completa **OK**.

## Workflow

`TEST - GitHub list Alina task queue`

## Scope

Solo workflow n8n e file task / documentazione nel repository; **nessuna modifica** al codice applicativo Alina.

## File coinvolti

- `docs/tasks/queue/0002-test-n8n-processing-skip.md`
- `docs/tasks/processing/0002-test-n8n-processing-skip-cursor-prompt.md`
- `docs/sessions/automation-0002-test-n8n-processing-skip.md`

(Riferimento implicito anche a `docs/tasks/queue/0001-test-n8n-task.md` e al relativo prompt già presente in `docs/tasks/processing/` per lo scenario di skip.)

## Test 1 — ramo `true`

È stato creato il task di test **`0002-test-n8n-processing-skip.md`** in `docs/tasks/queue/`, poi eseguita **manualmente** la prima esecuzione del workflow n8n.

Esito osservato:

- **`0001-test-n8n-task.md`** è stato **saltato** perché esisteva già il prompt corrispondente in `docs/tasks/processing/`.
- **`0002-test-n8n-processing-skip.md`** è stato **selezionato** come primo task in coda **senza** prompt in `processing`.
- n8n ha **creato** (commit su GitHub):
  - `docs/tasks/processing/0002-test-n8n-processing-skip-cursor-prompt.md`
  - `docs/sessions/automation-0002-test-n8n-processing-skip.md`
- Il prompt generato riporta **`Task source: docs/tasks/queue/0002-test-n8n-processing-skip.md`**.
- La sessione automation indica **`prompt generated, Cursor not executed yet`**.
- Nessuna modifica all’app, nessun deploy, nessun tag, nessuna modifica a `gas-current/`.

## Test 2 — ramo `false`

È stata eseguita una **seconda** esecuzione manuale dello stesso workflow.

Esito osservato:

- **`0001-test-n8n-task.md`**: ancora **saltato** (già coperto da prompt in `processing`).
- **`0002-test-n8n-processing-skip.md`**: **saltato** perché il prompt **`0002-test-n8n-processing-skip-cursor-prompt.md`** è ora presente in `processing`.
- Nessun altro task `.md` libero in `docs/tasks/queue`.
- Il flusso ha preso il ramo **`false`** di **`IF has queued task`**.
- Il nodo Code **`No queued task / already processing`** ha emesso output con **`status: no_action`** (nessuna azione GitHub).
- **Nessun** prompt rigenerato o riscritto; **nessuna** sessione aggiornata in quel run.
- Nessuna modifica all’app.

## Esito complessivo

| Aspetto | Esito |
|---------|--------|
| Skip anti-doppio-run (presenza `{task}-cursor-prompt.md` in `processing`) | Confermato |
| Ramo **`true`** (selezione del primo task libero dopo skip su `0001`) | Confermato |
| Ramo **`false`** + terminatore `No queued task / already processing` | Confermato |
| Assenza di **doppia esecuzione** sullo stesso task (nessun doppio aggiornamento prompt/sessione al secondo run) | Confermato |
| Nessuna modifica app / deploy / tag / rollback | Confermato |

## Rischi residui

- Il lifecycle **`done` / `failed`** e lo **spostamento** fisico dei task restano **non implementati** nel workflow (solo design in `task-lifecycle.md`).
- I task restano **fisicamente** in `docs/tasks/queue/` anche dopo generazione del prompt; serve un **passo futuro** prudente per archiviazione, marcatura strutturata o move verso `done`/`failed` senza cancellazioni premature.

## Prossimo passo consigliato

Progettare e, quando maturo, implementare con cautela la transizione **`queue` → `done` / `failed`** (pattern create → verify → delete) **oppure** una **marcatura metadata** (`picked_at`, `processed_at`, stato in sessione o front matter) prima di introdurre move distruttivi.

## Riferimenti

- `docs/automation/n8n-workflows/queue-reader.md`
- `docs/automation/n8n-workflows/task-lifecycle.md`
- `docs/sessions/2026-05-11-n8n-queue-reader-processing-skip.md`
