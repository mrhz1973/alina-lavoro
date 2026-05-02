# Alina Lavoro - Project State

Ultimo aggiornamento: 2026-05-02

## Stato reale

- Branch operativo: `dev`.
- Branch stabile: `main`.
- Tag rollback disponibile: `v1.5-stable`.
- `dev` e avanti rispetto a `main`.
- `dev` contiene la serie V1.6, V1.6.1 e V1.6.2.
- V1.6.2 e stata pushata su Apps Script.
- Il deployment ufficiale V1.6.2 e stato aggiornato dall'utente.
- Il test su URL di test V1.6.2 e risultato corretto per il layout mobile verticale.
- Il test finale sull'URL ufficiale `/exec` e stato confermato OK dall'utente.
- Il workflow orchestratore/implementatore e stato formalizzato: l'orchestratore legge GitHub, Cursor/Agent aggiorna GitHub a fine blocco.

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
- `npm run aggio`: fotografia locale del repository, usata dall'implementatore.
- `npm run checkpoint`: genera checkpoint locale, da chiudere con commit/push se usato.
- `npm run finito -- "Messaggio" file1 file2`: chiude un blocco con commit e push selettivo.

## Regole operative correnti

- **Implementatore:** all'inizio di un blocco `git pull` poi `npm run aggio`; a fine blocco aggiornare i doc se serve, commit selettivo e **sempre** push (l'orchestratore legge solo GitHub).
- Lavorare su `dev`.
- Non modificare `gas-current/`.
- Modificare i sorgenti reali in `src/`.
- Non fare deploy senza test e conferma esplicita.
- Evitare `git add .`; usare sempre `git add <file specifici>`.
- Ogni blocco deve avere piano, implementazione, test e riepilogo.
- GitHub e la fonte di verita dell'orchestratore.
- Cursor/Agent, come implementatore, deve aggiornare GitHub a fine blocco o sessione anche se l'utente non scrive esplicitamente `finito`.

## Stato versioni

- V1.5: stabile, taggata come `v1.5-stable`.
- V1.6: ottimizzazione mobile verticale e performance iniziale.
- V1.6.1: forzatura layout verticale sotto 900px.
- V1.6.2: fix viewport Apps Script con `HtmlService.addMetaTag` e fallback portrait; test URL di test OK; deployment ufficiale `/exec` OK.

## Rischi aperti

- La pagina Mesi usa ancora `innerHTML` completo: se resta lenta, trattare in V1.8 con strategia rendering diversa.
- Verificare il comportamento reale su Android vecchio quando disponibile.
- Valutare merge `dev -> main` solo dopo ulteriore conferma di stabilita.

## Prossimo passo consigliato

1. Usare `aggio` dall'orchestratore per ricostruire lo stato da GitHub.
2. Quando Cursor conclude blocchi futuri, deve aggiornare documenti/checkpoint se necessario, fare commit e push.
3. Valutare merge `dev -> main` solo quando V1.6.2 e considerata stabile.