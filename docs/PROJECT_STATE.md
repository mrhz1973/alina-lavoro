# Alina Lavoro - Project State

Ultimo aggiornamento: 2026-05-02

## Stato reale

- Branch operativo: `dev`.
- Branch stabile: `main`.
- Tag rollback disponibile: `v1.5-stable`.
- `dev` e avanti rispetto a `main`.
- `dev` contiene la serie V1.6, V1.6.1 e V1.6.2.
- V1.6.2 e stata pushata su Apps Script e il deployment ufficiale e stato aggiornato dall'utente.
- Il test su URL di test V1.6.2 e risultato corretto per il layout mobile verticale.
- Test finale sull'URL ufficiale `/exec`: da confermare esplicitamente se non gia fatto.

## Stack

- Backend: Google Apps Script.
- Database: Google Sheet.
- Frontend: HTML, CSS, JavaScript in `src/frontend/Index.html`.
- Versionamento: Git e GitHub.
- Ambiente operativo: Cursor.
- Sincronizzazione Apps Script: `clasp` tramite npm scripts.

## File principali

- `src/backend/Code.gs`: backend Apps Script.
- `src/frontend/Index.html`: frontend Web App.
- `appsscript.json`: manifest Apps Script.
- `gas-current/`: snapshot read-only del codice storico/deployato.
- `docs/roadmap.md`: roadmap prodotto/tecnica.
- `docs/CHECKPOINT.md`: memoria sintetica per ripartenza chat.
- `docs/AI_RULES.md`: regole per AI/Cursor/Agent.
- `docs/WORKFLOW.md`: workflow operativo.
- `docs/COMMANDS.md`: comandi standard.

## Comandi npm disponibili

- `npm run sync`: copia i sorgenti in `.gas/`.
- `npm run push`: esegue sync e `clasp push`.
- `npm run deploy`: esegue sync, `clasp push` e `clasp deploy`.

## Regole operative correnti

- Lavorare su `dev`.
- Non modificare `gas-current/`.
- Modificare i sorgenti reali in `src/`.
- Non fare deploy senza test e conferma esplicita.
- Evitare `git add .`; usare sempre `git add <file specifici>`.
- Ogni blocco deve avere piano, implementazione, test e riepilogo.

## Stato versioni

- V1.5: stabile, taggata come `v1.5-stable`.
- V1.6: ottimizzazione mobile verticale e performance iniziale.
- V1.6.1: forzatura layout verticale sotto 900px.
- V1.6.2: fix viewport Apps Script con `HtmlService.addMetaTag` e fallback portrait.

## Rischi aperti

- La pagina Mesi usa ancora `innerHTML` completo: se resta lenta, trattare in V1.8 con strategia rendering diversa.
- Verificare il comportamento reale su Android vecchio.
- Confermare esplicitamente il test finale su URL ufficiale `/exec` dopo deploy V1.6.2.

## Prossimo passo consigliato

1. Confermare test sull'URL ufficiale `/exec`.
2. Usare il comando conversazionale `finito` per chiudere il blocco e aggiornare checkpoint/sessione.
3. In seguito valutare merge `dev -> main` solo quando V1.6.2 e considerata stabile.