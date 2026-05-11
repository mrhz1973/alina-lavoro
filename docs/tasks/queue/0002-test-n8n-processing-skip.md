# Task — Test n8n processing skip true path

- Project: Alina Lavoro
- Type: test
- Priority: low
- Status: queued
- Created by: ChatGPT orchestrator
- Deploy: no

## Objective

Verificare che il workflow n8n `TEST - GitHub list Alina task queue`, dopo l'introduzione dello skip dei task già presenti in `processing`, selezioni correttamente un nuovo task libero in `docs/tasks/queue`.

## Requirements

- Non modificare codice applicativo.
- Non modificare Apps Script.
- Non fare deploy.
- Non creare tag.
- Non toccare `gas-current/`.
- Il workflow deve saltare `0001-test-n8n-task.md` perché ha già il relativo prompt in `docs/tasks/processing`.
- Il workflow deve selezionare questo nuovo task `0002-test-n8n-processing-skip.md` perché non ha ancora un prompt corrispondente in `docs/tasks/processing`.

## Expected output

Alla prossima esecuzione manuale di n8n, il workflow deve produrre/aggiornare:

- `docs/tasks/processing/0002-test-n8n-processing-skip-cursor-prompt.md`
- `docs/sessions/automation-0002-test-n8n-processing-skip.md`

senza modificare l'app Alina.
