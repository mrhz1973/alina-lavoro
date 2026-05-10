# Task — [Titolo breve]

## Metadata

| Campo | Valore |
|--------|--------|
| **ID** | TASK-YYYY-MM-DD-short-name |
| **Progetto** | Alina Lavoro |
| **Tipo** | docs / frontend / backend / release / mixed |
| **Priorità** | low / normal / high |
| **Creato** | YYYY-MM-DD |
| **Owner orchestratore** | ChatGPT / utente |
| **Branch target** | `main` |

## Context

- Stato produzione atteso al momento della creazione del task (versione, deploy, tag se rilevanti).
- Perché questo task esiste; dipendenze da altri task o issue.

## Objective

- Risultato misurabile in 1–5 bullet.

## Files allowed

Elenco esplicito di path o glob consentiti. Esempi:

- `docs/**/*.md`
- `src/frontend/Index.html`

Se vuoto e non è un task “solo docs”, specificare nella sezione Constraints.

## Files forbidden

Elenco esplicito di path da **non** toccare salvo diversa autorizzazione scritta nel task.

- `src/backend/Code.gs` (se non autorizzato)
- `package.json` / `gas-current/` (se non autorizzato)
- `.clasp.json`, segreti, `.env`

## Requirements

- Requisiti funzionali o editoriali.

## Constraints

- Vincoli di compatibilità (WebView, lingua, non rompere tab navbar, ecc.).
- Workflow Git: **no** `git add .`; commit selettivo.

## Checks

- Comandi o verifiche obbligatorie prima del commit (riferimento a `docs/COMMANDS.md` se frontend).

## Deploy policy

Una tra:

- **none** — nessun deploy Apps Script.
- **manual** — deploy solo dopo review umana.
- **allowed-with-gate** — deploy consentito solo se il task include bump/versione e checklist release documentata.

## Expected output

- File modificati attesi.
- Eventuale nuovo file sessione in `docs/sessions/`.
- Messaggio commit suggerito.

## Manual test gate

- **required** / **not required**
- Se **required**: elenco smoke test (es. `/exec`, lingua IT/RU, tab Home/Mesi).
