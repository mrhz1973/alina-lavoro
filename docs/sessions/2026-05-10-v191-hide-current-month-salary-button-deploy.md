# Sessione 2026-05-10 — V1.9.1 Nascondere «Stipendio» sul mese corrente (deploy)

## Release

- **Versione:** **1.9.1** (`package.json`, `APP_VERSION` in `src/frontend/Index.html`).
- **Branch:** `main`.

## Deploy Apps Script

- **Comando:** sincronizzazione `mkdir -p .gas && cp …` in **Git Bash**, poi `npx clasp push && npx clasp deploy` (su Windows `npm run deploy` può fallire sullo script `sync` via **cmd**).
- **Deployment:** **`@23`**.
- **ID deployment:** `AKfycbxvuOGtltO32umfM4XgfL1nWTbmzWZ7mnl4f6tsFkkT5yj0qF6OXdBY9tHTDXpUj3WsRg`.
- **Rollback precedente:** **V1.9.0** — **`@22`** — ID `AKfycbyisd4Dd_8XxBU6-ZcjF6qm6K_d4x4YsIRSXCZyeBm4nNjZgfg_X34rdh_KUJ9nV2ULRA`; tag **`v1.9.0-stable`**.

## Backend e Sheet

- **`src/backend/Code.gs`:** nessuna modifica.
- Struttura **Google Sheet:** nessuna modifica.

## Funzionalità

- Nella pagina **Mesi**, il pulsante **«Stipendio»** sulla card di ogni mese viene renderizzato solo se **`isSalaryMonthEditable_(monthKey)`** è vero.
- **Regola MVP V1.9.1:** confronto tra `YYYY-MM` del mese della card e **`currentMonth()`** (data locale). Il pulsante è **nascosto** per il **mese corrente** e per eventuali mesi **futuri** (`monthKey > currentMonth`, ordinamento lessicografico ISO); **visibile** per i **mesi precedenti** (chiusi).
- Il pulsante **«Dettaglio»** resta **sempre** visibile su tutte le card.
- **`buildMonthsViewSig_`:** è stato aggiunto **`currentMonth()`** nella firma (`parts.push(currentMonth())` dopo la lingua) così che al cambio di mese calendario la cache **`monthsViewSig`** / **`renderMonths`** si invalidi e il DOM dei pulsanti resti coerente senza dipendere solo dai dati `summaries`.

## `gas-current/`

- Snapshot post-deploy allineato a **V1.9.1**; solo tracciamento, non sorgente di sviluppo.

## Test manuale

- **Gate:** verifica su **`/exec`** deployment **`@23`** — mese corrente senza **Stipendio**, mesi precedenti con **Stipendio**, **Dettaglio** ovunque, toggle anni, lingue, Home/Note/Impostazioni (incluso **Redmi 9C NFC** se disponibile).

## Controlli eseguiti (implementazione)

- Controlli frontend standard (`docs/COMMANDS.md`): `git diff --check`; estrazione script inline + `node --check`; `grep` `?.` / `??` / `||=` (nessun match); `data-page` navbar (4 tab); `git diff` su `src/backend/Code.gs` vuoto.
