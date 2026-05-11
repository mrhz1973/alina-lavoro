# Sessione — n8n done copy-only 0003 validation

## Data

2026-05-11

## Stato

Validazione **manuale OK**.

## Workflow n8n

**`TEST - Mark Alina task done copy-only`**

Documentazione operativa: [`docs/automation/n8n-workflows/done-copy-only.md`](../automation/n8n-workflows/done-copy-only.md).

## Esito

- File **done** creato/aggiornato: `docs/tasks/done/0003-test-n8n-done-copy-only.md` (copia con sezione `## Done copy-only outcome`).
- **Sessione automation** aggiornata: `docs/sessions/automation-0003-test-n8n-done-copy-only.md` (stessa sezione outcome).
- File in **queue** preservato: `docs/tasks/queue/0003-test-n8n-done-copy-only.md` (nessuna delete).
- Nessuna modifica a codice applicativo, deploy, tag, `gas-current/`.

## Problema incontrato

Il nodo inizialmente denominato **`Create done file 0003`** falliva alla **riesecuzione** perché il file in `docs/tasks/done/` **esisteva già** (comportamento non idempotente per “solo create”).

## Correzione

Passaggio a operazione di **Edit** (update con `sha` / upsert) e naming concettuale **`Update done file 0003`** per garantire **idempotenza** sul file `done`.

## File verificati

- `docs/tasks/queue/0003-test-n8n-done-copy-only.md`
- `docs/tasks/done/0003-test-n8n-done-copy-only.md`
- `docs/sessions/automation-0003-test-n8n-done-copy-only.md`

## Rischi residui

- Workflow ancora **hardcoded** sul task 0003; serve **generalizzazione** per altri task.
- Il task **resta in queue** per scelta prudente: il queue reader o altri flussi potrebbero ancora “vederlo” se non si introduce filtro esplicito (es. skip se esiste copia `done` o flag nel task).
- `done` da solo **non** sostituisce gate umani o regole di selezione avanzate.

## Prossimo passo consigliato

Progettare la **generalizzazione dinamica** del workflow done copy-only (parametri o convenzione nomi file) e allinearla a [`done-failed-design.md`](../automation/n8n-workflows/done-failed-design.md) / [`task-lifecycle.md`](../automation/n8n-workflows/task-lifecycle.md).
