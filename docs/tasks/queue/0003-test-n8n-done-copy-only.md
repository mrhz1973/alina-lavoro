# Task — Test n8n done copy-only

- Project: Alina Lavoro
- Type: test
- Priority: low
- Status: queued
- Created by: ChatGPT orchestrator
- Deploy: no

## Objective

Preparare un task di test per la futura simulazione della chiusura `done` in modalità copy-only, senza cancellare il file originale da `docs/tasks/queue`.

## Requirements

- Non modificare codice applicativo.
- Non modificare Apps Script.
- Non fare deploy.
- Non creare tag.
- Non toccare `gas-current/`.
- Non cancellare file da `docs/tasks/queue`.
- Il futuro workflow di chiusura dovrà creare una copia in `docs/tasks/done`.
- La copia `done` dovrà conservare il contenuto del task originale.
- La copia `done` dovrà aggiungere metadata o sezione di chiusura con:
  - status: done
  - completed_at
  - cursor_prompt_path
  - session_path
  - outcome: copy-only validation
- La sessione automation dovrà essere aggiornata con l'esito `done` quando il blocco sarà implementato.

## Expected output

In una futura simulazione n8n, questo task dovrà produrre:

- `docs/tasks/processing/0003-test-n8n-done-copy-only-cursor-prompt.md`
- `docs/sessions/automation-0003-test-n8n-done-copy-only.md`
- `docs/tasks/done/0003-test-n8n-done-copy-only.md`

Il file originale dovrà restare in:

- `docs/tasks/queue/0003-test-n8n-done-copy-only.md`

Nessuna delete da `queue`.
Nessuna modifica app.
