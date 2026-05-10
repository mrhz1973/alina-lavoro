# Release **V1.8.6** — fix Mesi mobile (griglia + navbar) — deploy Apps Script

**Data:** 2026-05-10

## Bug V1.8.5 (test utente NON OK)

- Pagina **Mesi** su mobile: lista ancora **una sola colonna** (nessun layout a griglia); solo padding/font più stretti.
- **Navbar inferiore** spesso **coperta dal contenuto** o non percepita come sempre visibile fino a scroll in fondo — causato da **`padding-bottom` insufficiente** su `.app` rispetto all’ingombro reale della barra + safe-area, e da **`z-index` troppo basso** rispetto ad alcuni layer di rendering su WebView / iframe Apps Script.

## Contenuto release

- **CSS mobile (`max-width: 899px`):**
  - Variabile **`--nav-stack-h`** + **`padding-bottom`** aumentato su **`.app`**: `calc(var(--nav-stack-h) + 36px + env(safe-area-inset-bottom))` per liberare spazio sotto il contenuto.
  - **`.nav`**: `z-index: 9999`, `pointer-events: auto`; toast mobile `z-index: 10001` così resta sopra la barra.
  - **`#content`**: `padding-bottom: 12px` aggiuntivo.
- **Griglia Mesi (solo dove serve):**
  - Lista mesi con classi **`list list--months`** (JS); su mobile **`grid-template-columns: repeat(2, minmax(0, 1fr))`**, `min-width: 0` sulle card per evitare overflow.
  - **`@media (max-width: 360px)`**: una colonna (schermi stretti).
  - Desktop (`≥900px`): griglia a due colonne **non** forzata (comportamento lista a colonna singola come prima).
- **`monthsDomMatches_`**: richiede anche **`list--months`** sul contenitore lista coerente con il DOM atteso.
- Bump **`package.json`** / **`APP_VERSION`** → **1.8.6**.
- Backend: invariato.

## Deploy Windows

Stesso approccio della V1.8.5: **Git Bash** per `mkdir -p` / `cp` + `npx clasp push` + `npx clasp deploy` se `npm run sync` fallisce su `cmd`.

## Esito clasp

| Step | Note |
|------|------|
| Push + deploy **`@16`** | ID `AKfycbwkI2a_dzmrO_c8kt0KO16uOl2V_lep-WwSLDMNyvopxSpWF78hR3zew6fbmBiVx8RNRg` — **produzione documentata** (`APP_VERSION` **1.8.6**) |

## Rollback immediato precedente

- **V1.8.5 / `@15`:** `AKfycbwCCxFZUQUjp8RslSt4jPMnxS1vOM7JORGkvaEn20YdSlEzoB-WnETsiR_b2RYKZ8vc9Q` — tag **`v1.8.5-stable`** (bug Mesi/navbar noto).

## Tag Git

- **`v1.8.6-stable`** sul commit di release.

## Snapshot `gas-current/`

Allineato a **V1.8.6** post-deploy.

## Test manuale

**Da fare** su **`/exec`** del deployment **`@16`**:

- **Mesi** su mobile: **due colonne** quando larghezza > 360px; **una colonna** su schermo molto stretto; nessun overflow orizzontale; leggibilità OK.
- **Navbar** sempre **visibile e cliccabile** sulla tab Mesi **senza** dover scrollare in fondo; contenuto non finisce sotto la barra.
- Impostazioni: **1.8.6**; smoke Home / Note / **Inizio-Fine** (#5).
