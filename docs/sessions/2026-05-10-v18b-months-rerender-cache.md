# V1.8B — micro-step: riduzione re-render pagina **Mesi**

**Data:** 2026-05-10

## Obiettivo

Evitare la ricostruzione completa del DOM della tab **Mesi** quando `render()` viene richiamato senza cambiamenti nei dati visibili (stesso riepilogo, stessa lingua).

## Implementazione

- File: `src/frontend/Index.html`
- Variabile in closure: `monthsViewSig`
- Helper: `buildMonthsViewSig_(items)` — firma da `state.config.lingua`, conteggio righe e campi allineati a `buildMonthsListSection_` (`mese`, `giorni`, `minuti`, `ore_label`, `stimato`, `stipendio_reale`, `differenza`)
- Helper: `monthsDomMatches_(root, itemCount)` — verifica struttura card Mesi + `section.list` (lista vuota vs righe `.list-item--month`) per non riusare cache su DOM di altre pagine
- `renderMonths()`: early return se firma e DOM coerenti; altrimenti flusso precedente e aggiornamento `monthsViewSig` a render completato

## Deploy

**Nessun** deploy Apps Script in questo blocco: produzione documentata resta **V1.8.2** / clasp **`@10`** fino a release/deploy successivo.

## Versione / tag

Nessun bump `APP_VERSION` / `package.json` e nessun tag stabile in questo blocco.
