# Release **V1.8.9** — fix toggle anni pagina **Mesi** — deploy Apps Script

**Data:** 2026-05-10

## Contesto

Su **V1.8.8** (deploy **`@19`**) il collasso/espansione degli anni in **Mesi** risultava **non funzionante** al tap su intestazione/freccia su alcuni client (es. Android/WebView vecchie): il toggle impostava `hidden` sul pannello ma il CSS **`.months-year-panel { display: block }`** poteva prevalere sul comportamento nativo di `[hidden]`, lasciando il contenuto visibile.

## Contenuto release

- **`toggleMonthsYear_(btn)`:** trova il pannello con `btn.nextElementSibling`, alterna classe **`.months-year-panel--collapsed`**, aggiorna **`aria-expanded`** e indicatore **▾** / **▸**.
- **CSS:** **`.months-year-panel.months-year-panel--collapsed { display: none }`** accanto a **`display: block`** sul pannello aperto.
- **`buildMonthsYearBlock_`:** stato iniziale senza `hidden`; anni precedenti con **`months-year-panel--collapsed`**; listener **`addEventListener('click', …)`** con **`preventDefault`**.
- **Touch/stacking:** **`.months-year-toggle`** con **`position: relative; z-index: 1`** (riduce rischi di overlay che rubano il tap).
- **`monthsViewSig` / `buildMonthsViewSig_`:** invariati al toggle (solo DOM locale).
- Bump **`package.json`** / **`APP_VERSION`** → **1.8.9**.
- Backend / Sheet: invariati.

## Deploy Windows

**Git Bash:** `mkdir -p .gas`, `cp`, `npx clasp push`, `npx clasp deploy`.

## Esito clasp

| Step | Note |
|------|------|
| Push + deploy **`@20`** | ID `AKfycbxxbOtZmmcflqyrToKXo_bR6MaK4pupI-fkDrGRmZsC2vSnjQajmwMNePmg26ji-XY8og` — **produzione documentata** (`APP_VERSION` **1.8.9**) |

## Rollback immediato precedente

- **V1.8.8 / `@19`:** `AKfycbyzsTI8uaRJDGyiNrmm6jQRGjNyI80kE_Z4W7qwBLcbwKt6wp-coqsmlcG-cXUAJYtKlg` — tag **`v1.8.8-stable`**.
- **V1.8.7 / `@18`:** `AKfycbyKn_0bR-JkGIPx96cNooiEjeqxMa7Uqvn5Rsb61GhEvvDBC5lT8FPwX11egV4U0un-Uw` — tag **`v1.8.7-stable`**.

## Tag Git

- **`v1.8.9-stable`** sul commit di release.

## Snapshot `gas-current/`

Allineato a **V1.8.9** post-deploy.

## Test manuale

**Aggiornamento post-test:** eseguito su **`/exec`** del deployment **`@20`** — **OK**.

| Voce | Esito |
|------|--------|
| Toggle anni (collasso/espansione) | OK |
| Tap su freccia e su intestazione anno | OK |
| Anno più recente aperto di default | OK |
| Tap mese / **Stipendio** | OK |
| Smoke generale (Home, Note, Impostazioni, navbar, lingua) | OK |
