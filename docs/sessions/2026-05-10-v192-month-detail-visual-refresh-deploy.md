# Sessione 2026-05-10 — V1.9.2 Dettaglio mese più visivo (deploy)

## Release

- **Versione:** **1.9.2** (`package.json`, `APP_VERSION` in `src/frontend/Index.html`).
- **Branch:** `main`.

## Deploy Apps Script

- **Comando:** sincronizzazione `mkdir -p .gas && cp …` in **Git Bash**, poi `npx clasp push && npx clasp deploy --description 'V1.9.2 month detail visuals'`.
- **Deployment:** **`@24`**.
- **ID deployment:** `AKfycbyIkaQqS-Dce0tfdxyfjdnEEE_xSb3Ys3KdeGL9xiX652QfgfAFRRBSvmuLXdPqQhaXSg`.
- **Rollback precedente:** **V1.9.1** — **`@23`** — ID `AKfycbxvuOGtltO32umfM4XgfL1nWTbmzWZ7mnl4f6tsFkkT5yj0qF6OXdBY9tHTDXpUj3WsRg`; tag **`v1.9.1-stable`**. Precedente **V1.9.0** — **`@22`**.

## Backend e Sheet

- **`src/backend/Code.gs`:** nessuna modifica.
- Struttura **Google Sheet:** nessuna modifica.
- **Librerie:** nessuna.
- **Canvas / SVG complessi:** nessuno.

## Funzionalità (UI Dettaglio mese)

- Sotto l’header del mese, **riepilogo** in stile **Home** (`section.grid` + `div.metric`): **totale ore mese**, **totale stimato mese** (etichetta **stimato** in `.small`), **stipendio reale (mese)** solo se `summary.stipendio_reale` è presente (nessuna terza metrica “vuota” se manca).
- **Giorni lavorati:** card `month-detail-day` con data in evidenza, righe separate per **ore** e **stimato (giorno)**.
- **Barra orizzontale** leggera per giorno: minuti del giorno rispetto al **massimo** tra i giorni lavorati del mese; nessuna barra se `maxDayMins <= 0` (mese senza giorni in lista).
- **Footer** duplicato (vecchio `month-detail-summary` in coda) **rimosso**; i totali restano nel riepilogo superiore.
- Eredità **V1.9.1:** navigazione `monthDetail`, **Indietro**, **Stipendio** nascosto sul mese corrente in **Mesi**, toggle anni, **Home** / **Note** / **Impostazioni** invariati a livello di struttura.

## `gas-current/`

- Snapshot post-deploy allineato a **V1.9.2**; solo tracciamento, non sorgente di sviluppo.

## Test manuale

- **Esito:** **OK** (2026-05-10) su **`/exec`** deployment **`@24`** (Web App). Versione **1.9.2** confermata in Impostazioni.
- **Verifiche confermate:**
  - Layout **Dettaglio mese** (metriche in alto, card giorno, barre ore proporzionali) OK.
  - Pulsante **Indietro** OK.
  - **Stipendio** assente sul **mese corrente** e presente sui **mesi precedenti** OK.
  - Smoke **Home** / **Note** / **Impostazioni** OK.
  - **Xiaomi Redmi 9C NFC:** incluso nel test — OK.
- **Verifiche consigliate** (copertura estesa opzionale): più giorni / un giorno / mese vuoto; con e senza **stipendio reale** mensile in summary; **IT** / **RU**; toggle anni.

## Controlli eseguiti (implementazione)

- Controlli frontend standard (`docs/COMMANDS.md`): `git diff --check`; estrazione script inline + `node --check`; `grep` operatori moderni (nessun match atteso); `data-page` navbar (4 tab); `git diff` su `src/backend/Code.gs` vuoto.
