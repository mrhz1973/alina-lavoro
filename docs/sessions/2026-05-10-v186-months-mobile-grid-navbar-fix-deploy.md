# Release **V1.8.6** — fix Mesi mobile (griglia + navbar) — deploy Apps Script

**Data:** 2026-05-10

## Bug V1.8.5 (test utente NON OK)

- Pagina **Mesi** su mobile: lista ancora **una sola colonna** (nessun layout a griglia); solo padding/font più stretti.
- **Navbar inferiore** spesso **coperta dal contenuto** o non percepita come sempre visibile fino a scroll in fondo — causato da **`padding-bottom` insufficiente** su `.app` rispetto all’ingombro reale della barra + safe-area, e da **`z-index` troppo basso** rispetto ad alcuni layer di rendering su WebView / iframe Apps Script.

## Contenuto release

- **CSS mobile (`max-width: 899px`):**
  - Variabile **`--nav-stack-h`** + **`padding-bottom`** aumentato su **`.app`**: `calc(var(--nav-stack-h) + 36px + env(safe-area-inset-bottom))` per liberare spazio sotto il contenuto.
  - **`.nav`**: `z-index: 9999`, `pointer-events: auto`; toast mobile `z-index: 10001` così resta sopra la barra.
  - **`modal-backdrop`** su mobile: `z-index: 10050` così modali restano **sopra** la navbar (dopo deploy **`@16`** la modale restava sotto).
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
| Push + deploy **`@16`** | ID `AKfycbwkI2a_dzmrO_c8kt0KO16uOl2V_lep-WwSLDMNyvopxSpWF78hR3zew6fbmBiVx8RNRg` — superseded (modale sotto navbar su mobile) |
| Push + deploy **`@17`** | ID `AKfycbwLxc6ilqVnKxP5G7OZ0sY7AOXQVKQDeteDqNs2gJN0WygQOmPSKhr0iXiCBdwolu90IQ` — **produzione documentata** (`APP_VERSION` **1.8.6**); fix **`modal-backdrop`** `z-index` sopra la navbar |

## Rollback immediato precedente

- **V1.8.5 / `@15`:** `AKfycbwCCxFZUQUjp8RslSt4jPMnxS1vOM7JORGkvaEn20YdSlEzoB-WnETsiR_b2RYKZ8vc9Q` — tag **`v1.8.5-stable`** (bug Mesi/navbar noto).

## Tag Git

- **`v1.8.6-stable`** sul commit di release.

## Snapshot `gas-current/`

Allineato a **V1.8.6** post-deploy.

## Test manuale

**Test manuale utente su `/exec` @17: OK.**

Verificato dall’utente su deployment **`@17`**: pagina **Mesi** ok (layout/navbar); resto dell’app come previsto (**Home**, **Note**, **Impostazioni**, **Inizio/Fine** / issue **#5**, ecc.). Versione **1.8.6** in Impostazioni.

**Evoluzione futura desiderata (non implementata):** suddividere la pagina **Mesi** in **schede o sezioni per anno** per navigare meglio quando i mesi sono molti — tracciata in `docs/roadmap.md` (V1.8B+ / fuori calendario V2).
