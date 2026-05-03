# Issue #3 — versione visibile nell’app (UI)

**Data:** 2026-05-03  
**Branch:** `dev`  
**Deploy Apps Script:** nessuno in questo blocco (produzione resta **@8**).

## Obiettivo

Mostrare all’utente quale versione dell’app sta usando, in modo discreto.

## Implementazione

- File: `src/frontend/Index.html` (solo frontend).
- Costante **`APP_VERSION = '1.8.0'`** con commento: allineare a `package.json` ad ogni bump semver.
- Posizione: pagina **Impostazioni**, sotto il pulsante «Salva», sopra il credito autore.
- Testo: `${app_version_label}: ${APP_VERSION} · Apps Script` (etichetta i18n IT/RU).
- CSS minimi: `.app-version`, `.credit` (testo credit coerente con `t('about_credit')` per lingua attiva).

## Controlli

- `docs/COMMANDS.md`: `git diff --check`, estrazione `<script>` + `node --check`, `grep` operatori moderni (nessun match atteso).

## Issue GitHub

Chiusura issue: tentare `gh issue close 3` da ambiente autenticato; in alternativa chiudere manualmente su GitHub con link a questo file.
