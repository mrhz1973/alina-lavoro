# Sessione — task 0100 Cursor prompt template in repo

## Data

2026-05-11

## Task sorgente

- Queue: [`docs/tasks/queue/0100-cursor-prompt-template-in-repo.md`](../tasks/queue/0100-cursor-prompt-template-in-repo.md)
- ID: **0100-cursor-prompt-template-in-repo**

## Obiettivo

Introdurre in repository la **prima versione documentale** del template del prompt Cursor (layout allineato al nodo **Build Cursor prompt** n8n), con segnaposto `{{…}}` per le variabili sostituibili in futuro, **senza** modificare n8n né `docs/automation/n8n-workflows/*`.

## Esito

- Creato **`docs/tasks/templates/cursor-prompt-default.md`** con sezioni **Mandatory constraints**, **Final response required** e riga di riferimenti `@docs/*` come nei prompt generati (es. **0005**, **0100** in `processing`).
- Aggiornamenti minimi a **`docs/PROJECT_STATE.md`** e **`docs/CHECKPOINT.md`** (riferimento al template).
- Sessione Cursor: questo file.

## Non fatto in questo blocco

- Nessuna modifica al workflow n8n.
- Nessun export JSON n8n.
- Nessun deploy, tag, rollback.
- Nessuna modifica a `src/`, `gas-current/`, `.gas/`, `package.json`, `appsscript.json`.

## Prossimo passo (fuori scope immediato)

Task successivo: far leggere a n8n il template da repo al posto del testo hardcoded nel nodo **Build Cursor prompt**.
