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

---

## Done copy-only outcome

- status: done
- outcome: copy-only validation
- completed_at: 2026-05-11T02:50:56.630Z
- original_queue_path: docs/tasks/queue/0003-test-n8n-done-copy-only.md
- cursor_prompt_path: docs/tasks/processing/0003-test-n8n-done-copy-only-cursor-prompt.md
- session_path: docs/sessions/automation-0003-test-n8n-done-copy-only.md
- source_sha: 01e111589fb7f8f2511936d6c12b9c5164bee007

## Notes

- This file was created as a copy-only done validation.
- The original task remains in docs/tasks/queue.
- No queue delete was performed.
- No application code was modified.
- No Apps Script deploy was executed.
- No tag was created.