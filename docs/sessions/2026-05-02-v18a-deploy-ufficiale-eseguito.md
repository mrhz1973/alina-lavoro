# V1.8A — deploy ufficiale Apps Script eseguito

**Data:** 2026-05-02  
**Branch Git corrente:** `dev`  
**Versione `package.json`:** `1.8.0-a.1`

## Autorizzazione

`docs/sessions/2026-05-02-v18a-deploy-ufficiale-autorizzato.md`

## Comando eseguito

```bash
npm run deploy
```

Equivalente a: `npm run sync` + `clasp push` + `clasp deploy`.

## Output clasp (rilevante)

- Push: **3 file** (`appsscript.json`, `Code.gs`, `Index.html`) — log locale `Pushed 3 files at 12:13:51 AM`.
- Deploy: **`Deployed AKfycbzq7DhRw7XwTlNbfoLPt0Fo1B0bdCotdfLw6p8AH1Wl--FhJUqjJI7z4i_xZzkAOWDUag @8`**
- **Deployment ID:** `AKfycbzq7DhRw7XwTlNbfoLPt0Fo1B0bdCotdfLw6p8AH1Wl--FhJUqjJI7z4i_xZzkAOWDUag`
- **Revisione clasp:** `@8`
- **URL Web App (pattern standard Google Apps Script):**  
  `https://script.google.com/macros/s/AKfycbzq7DhRw7XwTlNbfoLPt0Fo1B0bdCotdfLw6p8AH1Wl--FhJUqjJI7z4i_xZzkAOWDUag/exec`
- **Warning/errori:** nessuno riportato in output.

## Conferme vincoli (al momento del deploy 2026-05-02)

- **Deploy ufficiale:** **riuscito** (vedi sopra).
- **Merge `dev` → `main`:** **non eseguito** in quel blocco (completato in data successiva; vedi sezione «Stato successivo»).
- **Tag stabile V1.8:** **non creato** in quel blocco (`v1.8.0-stable` creato il 2026-05-03).
- **`gas-current/`:** **non modificato** in quel blocco (aggiornato nella chiusura release 2026-05-03).

## Requisiti UI (preservati in sorgente, senza modifiche funzionali in questo blocco)

- Mesi: classi `.list-item--month` / `.list` come in `src/frontend/Index.html`.
- Nav inferiore: `.nav` `position:fixed` (mobile) come in sorgente; in HTML sono **4** tab (Home, Mesi, Note, Imp.); `docs/sessions/2026-05-02-v18a-deploy-ufficiale-autorizzato.md` allineato a questa UI (terminologia 4 tab).

## Stato successivo (2026-05-03)

Chiusura release Git: merge `dev` → `main`, tag **`v1.8.0-stable`**, allineamento `dev`, aggiornamento snapshot `gas-current/` e documentazione — `docs/sessions/2026-05-03-v18a-stabilizzazione-finale.md`.

## Prossimo passo consigliato (post-chiusura release)

1. Verifica occasionale URL `/exec` del deployment **@8** in console Apps Script.
2. Nuovi sviluppi su `dev` (es. issue #3).
