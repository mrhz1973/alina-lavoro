# V1.6.2 — deploy finale e tag `v1.6.2-stable`

**Data:** 2026-05-02  
**Branch:** `main`  
**Autorizzazioni:** deploy Apps Script esplicito da utente; nessuna modifica funzionale a `src/`.

## Deploy clasp

- Comando: `npm run deploy` (`sync` + `clasp push` + `clasp deploy`).
- Output locale (estratti): push 3 file (`Code.gs`, `Index.html`, `appsscript.json`); deploy completato con revisione indicata come `@6` nel log clasp.

## Git

- Tag annotato: **`v1.6.2-stable`** sul commit che aggiorna `docs/*`, `package.json` versione `1.6.2`.
- `gas-current/` non toccato.

## Controlli

- `node --check` su script inline estratto da `src/frontend/Index.html`: OK.
