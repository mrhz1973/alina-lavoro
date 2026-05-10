# Release **V1.8.7** — pagina **Mesi** raggruppati per anno — deploy Apps Script

**Data:** 2026-05-10

## Contesto

Dopo **V1.8.6** (griglia Mesi mobile + navbar stabile, deploy **`@17`**, test manuale OK), richiesta utente: rendere la lista **Mesi** più leggibile **raggruppando per anno**, senza calendario, senza tab complesse e senza backend.

## Contenuto release

- **`groupMonthsByYear_(items)`:** raggruppa elementi **consecutivi** per anno da `mese` (`YYYY-MM` → `YYYY`), ordine invariato (recente → vecchio).
- **DOM:** dopo la card titolo, wrapper **`div.months-by-year`**; per ogni anno: intestazione **`div.months-year-heading`** (anno localizzato IT/RU) + **`section.list.list--months`** come già in V1.8.6 (stessa griglia mobile).
- **`monthsDomMatches_`:** valida card + wrapper `.months-by-year`, conteggio **`.list-item--month`** === `itemCount`, almeno una `section.list.list--months` se `itemCount>0`.
- **CSS:** `.months-by-year`, `.months-year-heading` — compatto, colori `var(--muted)` / tema chiaro-scuro.
- **`buildMonthsViewSig_`:** invariata (dati piatti + lingua).
- Bump **`package.json`** / **`APP_VERSION`** → **1.8.7**.
- Backend: invariato.

## Deploy Windows

`npm run deploy` dalla shell predefinita può fallire su **sync** (`mkdir -p` / `cp` via **cmd**). Eseguito deploy con **Git Bash**: `mkdir -p .gas`, `cp` → `npx clasp push` → `npx clasp deploy`.

## Esito clasp

| Step | Note |
|------|------|
| Push + deploy **`@18`** | ID `AKfycbyKn_0bR-JkGIPx96cNooiEjeqxMa7Uqvn5Rsb61GhEvvDBC5lT8FPwX11egV4U0un-Uw` — **produzione documentata** (`APP_VERSION` **1.8.7**) |

## Rollback immediato precedente

- **V1.8.6 / `@17`:** `AKfycbwLxc6ilqVnKxP5G7OZ0sY7AOXQVKQDeteDqNs2gJN0WygQOmPSKhr0iXiCBdwolu90IQ` — tag **`v1.8.6-stable`**.

## Tag Git

- **`v1.8.7-stable`** sul commit di release.

## Snapshot `gas-current/`

Allineato a **V1.8.7** post-deploy (frontend aggiornato; backend invariato).

## Test manuale

**Test manuale utente su `/exec` @18: OK.**

Verificato dall’utente su deployment **`@18`**: pagina **Mesi** raggruppata **per anno** ok; **cambio lingua** ok; tap **mese** / **Stipendio** ok; **Home**, **Note**, **Impostazioni** ok; versione **1.8.7** in Impostazioni.
