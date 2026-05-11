# Sessione — n8n queue reader 0003 validation

## Data

2026-05-11

## Stato

Validazione manuale **0003 OK** (comportamento atteso del queue reader; nessun file `done` richiesto in questa fase).

## Workflow

`TEST - GitHub list Alina task queue`

## Scope

Solo workflow n8n e file task / documentazione nel repository; **nessuna modifica** al codice applicativo Alina.

## File coinvolti

- `docs/tasks/queue/0003-test-n8n-done-copy-only.md`
- `docs/tasks/processing/0003-test-n8n-done-copy-only-cursor-prompt.md`
- `docs/sessions/automation-0003-test-n8n-done-copy-only.md`

(Per lo skip multi-task sono rilevanti anche `docs/tasks/queue/0001-test-n8n-task.md`, `docs/tasks/queue/0002-test-n8n-processing-skip.md` e i relativi prompt già presenti in `docs/tasks/processing/`.)

## Test

È stato creato il task **`0003-test-n8n-done-copy-only.md`** in `docs/tasks/queue/`, quindi eseguito **manualmente** il workflow n8n.

Comportamento osservato:

- **`0001-test-n8n-task.md`**: **saltato** (prompt già presente in `processing`).
- **`0002-test-n8n-processing-skip.md`**: **saltato** (prompt già presente in `processing`).
- **`0003-test-n8n-done-copy-only.md`**: **selezionato** come primo task in coda **senza** prompt in `processing`.

n8n ha **creato** su GitHub:

- `docs/tasks/processing/0003-test-n8n-done-copy-only-cursor-prompt.md`
- `docs/sessions/automation-0003-test-n8n-done-copy-only.md`

Il prompt generato riporta **`Task source: docs/tasks/queue/0003-test-n8n-done-copy-only.md`**. La sessione automation indica **`prompt generated, Cursor not executed yet`**.

**Non** è stato creato `docs/tasks/done/0003-test-n8n-done-copy-only.md`: comportamento **corretto** perché il workflow reale **non** implementa ancora la fase **`done` copy-only** descritta nel task e in `done-failed-design.md`.

## Esito

| Controllo | Esito |
|-----------|--------|
| Ramo **`true`** con **terzo** task in coda dopo skip su `0001` e `0002` | Confermato |
| Skip anti-doppio-run su `0001` e `0002` | Confermato |
| Prompt **0003** creato | Confermato |
| Sessione **0003** creata | Confermato |
| Nessun file in **`docs/tasks/done/`** per questo run | Atteso / OK |
| Nessuna modifica app, deploy, tag, rollback, `gas-current/` | Confermato |

## Rischi residui

- La chiusura **`done` in modalità copy-only** (file in `docs/tasks/done/` + metadata di chiusura + sessione con esito `done`) **non è ancora** nel workflow n8n reale.
- Il task **`0003`** resta **fisicamente** in `docs/tasks/queue/`; servirà un **blocco dedicato** (o workflow separato) per creare `docs/tasks/done/0003-test-n8n-done-copy-only.md` senza delete da `queue`, come da design.

## Prossimo passo consigliato

Progettare o implementare con cautela il **primo passo** che crei **`docs/tasks/done/0003-test-n8n-done-copy-only.md`** in modalità **copy-only** (contenuto originale + sezione/metadata di chiusura), **senza** rimuovere `docs/tasks/queue/0003-test-n8n-done-copy-only.md`, e aggiornare la sessione con esito **`done`** quando la logica sarà pronta.

## Riferimenti

- `docs/automation/n8n-workflows/queue-reader.md`
- `docs/automation/n8n-workflows/done-failed-design.md`
- `docs/sessions/2026-05-11-n8n-queue-reader-0002-validation.md`
