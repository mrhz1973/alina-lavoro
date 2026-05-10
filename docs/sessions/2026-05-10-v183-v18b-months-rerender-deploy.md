# Release **V1.8.3** — V1.8B (cache/firma pagina **Mesi**) — deploy Apps Script

**Data:** 2026-05-10

## Contesto

- Commit funzionale V1.8B: **`fc9ac43`** (`perf: avoid redundant months rerender`) già su **`main`**.
- Questo blocco: bump **`package.json` / `APP_VERSION` → 1.8.3**, deploy ufficiale, snapshot `gas-current/`, tag **`v1.8.3-stable`**, documentazione.

## Deploy Windows

Comandi (PowerShell, radice repo): copia in **`.gas/`** da `src/` + `appsscript.json`, poi:

- `npx.cmd clasp push`
- `npx.cmd clasp deploy --description "..."`

## Esito clasp

| Step | Esito |
|------|--------|
| Push (primo giro, codice pre-bump UI) | **OK** — 3 file |
| Deploy **@11** | ID `AKfycbyP6bnxV_PzDFcAlGCJC4YhZf_8Xpoy0lwDjxzC2I5ZT3nSLg-9CYINtwG5l2MGcYMfcw` — *superseded*: stesso codice V1.8B ma **`APP_VERSION` ancora 1.8.2** |
| Push (secondo giro, dopo bump **1.8.3**) | **OK** — 3 file |
| Deploy **@12** (produzione documentata) | ID `AKfycbwp39AN4DPH4BXikfemvF7G6yUdObnYro63nC3fqvUcn9G5XxzWyXD91AR2H8pfV9WDaw` |

**Produzione corrente:** clasp **`@12`** — allineare URL Web App **`/exec`** al deployment corrente in Apps Script.

## Rollback

- **V1.8.2 / `@10`:** `AKfycbz3TwCw8XjyUY4dfydoxDf-fztIDiq0EEPi84HBiahangwj318Sw5XULSARXSVwF38I_Q` — tag **`v1.8.2-stable`**.

## Tag Git

- **`v1.8.3-stable`** sul commit di release (bump + doc + snapshot).

## Test manuale

**Da fare** su **`/exec`** del deployment **`@12`**: versione **1.8.3** in Impostazioni; tab **Mesi** operativa; comportamento Inizio/Fine (issue **#5**) invariato; dopo sync/azioni che richiamano `render()` senza cambio dati, assenza di glitch evidenti sulla lista mesi.

## Backend

Invariato (`src/backend/Code.gs`).
