# Frontend task — [Titolo breve]

## Metadata

| Campo | Valore |
|--------|--------|
| **ID** | FE-TASK-YYYY-MM-DD-short-name |
| **Tipo** | frontend |
| **File principale** | `src/frontend/Index.html` |

## Context

- Comportamento atteso lato UI; pagine/navbar coinvolte.

## Objective

- Modifiche mirate al frontend Web App (HTML/CSS/JS inline).

## Files allowed

- Tipicamente: `src/frontend/Index.html`
- Altri path solo se elencati qui.

## Files forbidden (default)

- `src/backend/Code.gs` — **vietato** salvo riga esplicita “Backend authorized: yes” firmata nel task.
- `package.json`, `gas-current/` — vietati salvo task di release dedicato.
- Nuove dipendenze npm / CDN — **vietate** salvo approvazione.

## Requirements

- Allineamento a `docs/AI_RULES.md` e `docs/COMMANDS.md`.

## Constraints — JavaScript legacy-safe

Nel codice nuovo o modificato evitare:

- optional chaining (`?.`)
- nullish coalescing (`??`)
- logical assignment (`||=`)

Niente **librerie esterne** aggiuntive senza approvazione.

## Checks (obbligatori)

Da `docs/COMMANDS.md`, adattando l’ambiente (Windows / Git Bash):

- `git diff --check`
- Estrazione script inline da `Index.html` + `node --check` sullo script estratto
- `grep` per operatori moderni vietati sul file frontend
- Verifica tab `data-page` navbar invariata salvo task lo richieda esplicitamente

## Deploy policy

- **none** — solo commit su `main`; nessun `clasp`.
- Se il task richiede deploy, usare invece `templates/release-task-template.md` o estendere questo task con sezione Deploy e bump versione.

## Expected output

- Diff leggibile; messaggio commit suggerito.

## Manual test gate

- **required** se il task influenza flussi utente (login, Home, Mesi, Dettaglio, Note, Impostazioni).
- Se è previsto deploy in blocco successivo, indicare “post-deploy” e piattaforma (es. Web App `/exec`, Redmi 9C NFC).
