# Task — Test n8n queue reader true branch

- Project: Alina Lavoro
- Type: test
- Priority: low
- Status: queued
- Created by: ChatGPT orchestrator
- Deploy: no

## Objective

Preparare un task di test realmente eleggibile per validare il ramo `has_task: true` del workflow n8n `TEST - GitHub list Alina task queue` dopo l’implementazione dello skip combinato `processing` + `done`.

## Requirements

- Non modificare codice applicativo.
- Non modificare Apps Script.
- Non fare deploy.
- Non creare tag.
- Non toccare `gas-current/`.
- Non cancellare file da `docs/tasks/queue`.
- Questo task deve restare privo di file omonimo in `docs/tasks/processing/`.
- Questo task deve restare privo di file omonimo in `docs/tasks/done/`.

## Expected output

Al prossimo run del workflow n8n `TEST - GitHub list Alina task queue`, questo task dovrebbe essere selezionato come primo task eleggibile e produrre:

- `has_task: true`
- `task_name: 0005-test-n8n-queue-reader-true-branch.md`
- `task_path: docs/tasks/queue/0005-test-n8n-queue-reader-true-branch.md`

Il workflow n8n potrà poi generare il prompt Cursor e la sessione automation come da logica già esistente.
