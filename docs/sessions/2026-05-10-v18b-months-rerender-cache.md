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

Deploy ufficiale e bump **1.8.3** in sessione successiva: `docs/sessions/2026-05-10-v183-v18b-months-rerender-deploy.md` (produzione **`@12`**).

## Versione / tag

Il bump **1.8.3** e il tag **`v1.8.3-stable`** sono applicati nel commit di release documentato nella sessione deploy sopra.
