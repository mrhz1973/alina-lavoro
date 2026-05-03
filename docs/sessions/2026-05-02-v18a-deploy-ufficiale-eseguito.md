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

## Conferme vincoli

- **Deploy ufficiale:** **riuscito** (vedi sopra).
- **Merge `dev` → `main`:** **non eseguito**.
- **Tag stabile V1.8:** **non creato**.
- **`gas-current/`:** **non modificato** (nessun commit nel repo su quella directory).

## Requisiti UI (preservati in sorgente, senza modifiche funzionali in questo blocco)

- Mesi: classi `.list-item--month` / `.list` come in `src/frontend/Index.html`.
- Nav inferiore: `.nav` `position:fixed` (mobile) come in sorgente; in HTML sono **4** tab (Home, Mesi, Note, Imp.); il documento di autorizzazione menziona «3 pulsanti» — verificare terminologia vs UI reale al prossimo affinamento doc.

## Prossimo passo consigliato

1. Orchestratore/utente: verificare l’URL `/exec` del deployment **@8** in produzione Google (gestione implementazioni in Apps Script).
2. Pianificare merge `dev` → `main` e tag Git stabile V1.8 **solo** con autorizzazione separata.
3. Opzionale: aggiornare snapshot `gas-current/` in un blocco dedicato (fuori da questo deploy).
