# Task — Test n8n done copy-only generalized

- Project: Alina Lavoro
- Type: test
- Priority: low
- Status: queued
- Created by: ChatGPT orchestrator
- Deploy: no

## Objective

Preparare un task di test per validare la versione generalizzata del workflow n8n `done copy-only`, usando path dinamici derivati da `task_name` o `queue_path`.

## Requirements

- Non modificare codice applicativo.
- Non modificare Apps Script.
- Non fare deploy.
- Non creare tag.
- Non toccare `gas-current/`.
- Non cancellare file da `docs/tasks/queue`.
- Il futuro workflow generalizzato dovrà derivare dinamicamente:
  - queue_path
  - done_path
  - cursor_prompt_path
  - session_path
- Il futuro workflow generalizzato dovrà creare o aggiornare la copia in `docs/tasks/done`.
- La copia `done` dovrà conservare il contenuto del task originale.
- La copia `done` dovrà aggiungere una sezione `Done copy-only outcome`.
- La sessione automation dovrà essere aggiornata con l'esito `done`.
- Il test deve seguire il design in `docs/automation/n8n-workflows/done-copy-only-generalization.md`.

## Expected output

In una futura simulazione n8n generalizzata, questo task dovrà produrre:

- `docs/tasks/processing/0004-test-n8n-done-copy-only-generalized-cursor-prompt.md`
- `docs/sessions/automation-0004-test-n8n-done-copy-only-generalized.md`
- `docs/tasks/done/0004-test-n8n-done-copy-only-generalized.md`

Il file originale dovrà restare in:

- `docs/tasks/queue/0004-test-n8n-done-copy-only-generalized.md`

Nessuna delete da `queue`.
Nessuna modifica app.
