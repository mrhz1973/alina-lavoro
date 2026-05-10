# Release **V1.8.8** — pagina **Mesi**: anni **collassabili** (disclosure custom) — deploy Apps Script

**Data:** 2026-05-10

## Contesto

Dopo **V1.8.7** (Mesi raggruppati per anno, deploy **`@18`**, test manuale OK), micro-step per ridurre lo scroll: ogni anno è **espandibile/collassabile** con **`<button type="button">`** + pannello (`hidden`), **senza** `<details>`/`<summary>` (compatibilità WebView vecchie).

## Contenuto release

- **`buildMonthsYearBlock_(g, gi)`:** wrapper **`.months-year-block`**, bottone **`.months-year-toggle`** con etichetta anno + indicatore **▾** / **▸**, pannello **`.months-year-panel`** con **`section.list.list--months`** invariata.
- **Default:** anno più recente (`gi === 0`) **aperto** (`aria-expanded="true"`), anni precedenti **chiusi** (`hidden`).
- **Toggle:** solo sul DOM esistente → **non** modifica `monthsViewSig` / **`buildMonthsViewSig_`**.
- **`monthsDomMatches_`:** richiede `.months-year-block` e `lists.length === blocks.length` se `itemCount > 0`.
- **CSS:** touch target mobile rafforzato; nessuna animazione pesante.
- Bump **`package.json`** / **`APP_VERSION`** → **1.8.8**.
- Backend: invariato.

## Deploy Windows

Come per V1.8.7: **`npm run deploy`** può fallire sullo **sync** da **cmd**; eseguito **Git Bash**: `mkdir -p .gas`, `cp`, `npx clasp push`, `npx clasp deploy`.

## Esito clasp

| Step | Note |
|------|------|
| Push + deploy **`@19`** | ID `AKfycbyzsTI8uaRJDGyiNrmm6jQRGjNyI80kE_Z4W7qwBLcbwKt6wp-coqsmlcG-cXUAJYtKlg` — **produzione documentata** (`APP_VERSION` **1.8.8**) |

## Rollback immediato precedente

- **V1.8.7 / `@18`:** `AKfycbyKn_0bR-JkGIPx96cNooiEjeqxMa7Uqvn5Rsb61GhEvvDBC5lT8FPwX11egV4U0un-Uw` — tag **`v1.8.7-stable`**.

## Tag Git

- **`v1.8.8-stable`** sul commit di release.

## Snapshot `gas-current/`

Allineato a **V1.8.8** post-deploy.

## Test manuale

**Da fare** su **`/exec`** del deployment **`@19`**:

- **Mesi:** anni collassabili; anno recente aperto di default; tap intestazione apre/chiude; griglia mobile invariata; tap **Stipendio** su mese in panello aperto (e dopo apertura anno vecchio).
- Cambio **lingua** ricostruisce la pagina con default (recente aperto).
- **Home**, **Note**, **Impostazioni** mostrano **1.8.8**; navbar usabile.
