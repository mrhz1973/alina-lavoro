# Sessione 2026-05-10 — V1.9.0 Dettaglio mese MVP lista (deploy)

## Release

- **Versione:** **1.9.0** (`package.json`, `APP_VERSION` in `src/frontend/Index.html`).
- **Branch:** `main`.
- **Commit:** **`1ea1da3`** (messaggio: `release: v1.9.0 month detail mvp`).
- **Tag stabile:** **`v1.9.0-stable`**.

## Deploy Apps Script

- **Comando:** sincronizzazione manuale `mkdir -p .gas && cp …` in **Git Bash**, poi `npx clasp push && npx clasp deploy` (su Windows `npm run deploy` può fallire perché `npm` invoca `cmd` per lo script `sync`).
- **Deployment:** **`@22`**.
- **ID deployment:** `AKfycbyisd4Dd_8XxBU6-ZcjF6qm6K_d4x4YsIRSXCZyeBm4nNjZgfg_X34rdh_KUJ9nV2ULRA`.
- **URL Web App:** suffisso **`/exec`** — aggiornare il bookmark sul telefono al deployment corrente in Apps Script.

## Rollback documentato

- **Precedente produzione:** **V1.8.10** — deploy **`@21`** — ID `AKfycbz0_8bE92ATlKeb2oaOrhqOwrUgyiEnw977libqBH5Swkiv2LMwdDK0EbJyo-h7Zpjw6A`; tag **`v1.8.10-stable`**.

## Funzionalità (MVP)

- Pagina interna **`monthDetail`** (`state.page === 'monthDetail'`, `state.detailMonth` = `YYYY-MM`).
- Ingresso dalla pagina **Mesi**: pulsante **«Dettaglio»** (ghost) per ogni card mese; **«Stipendio»** invariato.
- **Navbar:** sempre **4 tab**; su dettaglio mese la tab **Mesi** resta concettualmente attiva (`setPage` mappa `monthDetail` → evidenza `months`).
- Lista giorni: **solo giorni con minuti > 0** (nessun elenco di tutti i giorni vuoti del mese); nessuna griglia calendario 7 colonne.
- Aggregazione da **`state.shifts`**: filtro `data.slice(0,7) === monthKey`, somma minuti per `YYYY-MM-DD` (stessa logica minuti dell’app).
- Tariffa dettaglio: **`summary.tariffa_media`** del mese se presente; altrimenti **`localAverageRate`** (come Home/Mesi).
- Stime giornaliere: **sempre etichettate come stimato** (`estimated_day` / `estimated_short`); mai presentate come stipendio reale giornaliero.
- Totali footer: ore mese; totale stimato mese (preferenza **`summary.stimato`** se disponibile, altrimenti somma stime giornaliere); **stipendio reale mensile** solo se presente nel summary, etichettato **reale (mese)** — **nessuna ripartizione giornaliera** dello stipendio reale.

## Backend e Sheet

- **`src/backend/Code.gs`:** **nessuna modifica** in questo blocco.
- **Struttura Google Sheet:** **nessuna modifica**.

## `gas-current/`

- Snapshot post-deploy allineato a **V1.9.0** (`Codice.js` ← `src/backend/Code.gs`, `Index.html`, `appsscript.json`). Solo tracciamento; **non** usare come sorgente di sviluppo.

## Limitazione nota — banner Google Apps Script

- Sopra la Web App può comparire il messaggio (testo tipico): **«Questa applicazione è stata creata da un utente di Google Apps Script»**.
- È un **avviso esterno** inserito dalla piattaforma **Google Apps Script**, **non** parte del frontend Alina Lavoro.
- Può essere chiuso con **X** ma **può riapparire**; **non** è controllabile in modo stabile dall’app.
- **Non** va trattato come bug applicativo; **non** si tenta di nasconderlo via CSS/JS nel codice del progetto.

## Test manuale

- **Gate:** test manuale su **`/exec` deployment `@22`** da eseguire da parte dell’utente (flussi Mesi → Dettaglio → Indietro, Stipendio, toggle anni, IT/RU, mese con più turni nello stesso giorno, mese con stipendio reale, mese senza turni, regressioni Home/Note/Impostazioni).
- **Dispositivo target:** **Xiaomi Redmi 9C NFC** — verifica consigliata post-deploy.

## Controlli eseguiti (implementazione)

- `git diff --check`
- Estrazione script inline + `node --check`
- `grep` operatori `?.` / `??` / `||=` (nessun match sul nuovo codice nei pattern usati)
- Verifica `data-page` navbar (4 tab invariati)
- `git diff` su `src/backend/Code.gs` vuoto
