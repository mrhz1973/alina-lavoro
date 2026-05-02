# Alina Lavoro — Roadmap

## Stato attuale

App personale per registrazione ore di lavoro di Alina.

Stack:
- Google Apps Script come backend.
- Google Sheet come database.
- HTML/CSS/JavaScript come frontend.
- GitHub per versionamento.
- Cursor come ambiente di sviluppo.
- clasp per sincronizzazione futura con Google Apps Script.

## Struttura repository

- `gas-current/`
  - Snapshot dello script Apps Script attualmente deployato.
  - Solo lettura.
  - Non modificare.

- `src/backend/Code.gs`
  - Backend Apps Script da modificare.

- `src/frontend/Index.html`
  - Frontend app da modificare.

- `appsscript.json`
  - Manifest Apps Script.

- `docs/`
  - Documentazione di progetto.

## Regola principale

Non modificare `gas-current/`.

Tutte le modifiche devono essere fatte in `src/`.

## V1.5 — Obiettivo

Applicare solo fix critici.

Non aggiungere:
- calendario;
- grafici;
- service worker;
- nuove funzionalità;
- refactor estetico;
- librerie esterne.

## V1.5 — Bug critici

1. Fix `newShift(date)` in `Index.html`: usare `data: date`, non shorthand `data`.
2. Fix `eliminaTurniFuturi()`: confrontare Date con Date, non stringhe.
3. Aggiungere backup automatico prima di operazioni distruttive.
4. Aggiungere protezione Lice contro doppio tap / doppio salvataggio.
5. Rimuovere vecchia funzione `importaStoricoDaFoglio1`.
6. Correggere Home che mostra “Lavoro terminato alle 00:00” per righe vuote.
7. Aggiungere funzione manuale `pulisciTurniVuoti()` con backup.

## V1.6 — Rinviato

Compatibilità Android vecchio:
- rimozione o fallback CSS `color-mix()`;
- verifica sintassi JS moderna;
- eventuale downgrade per WebView vecchia.

## V2 — Rinviato

Nuove funzionalità:
- vista calendario;
- report testuali;
- grafici ore/giorni/stipendi;
- riepilogo annuale;
- miglioramento UI.
