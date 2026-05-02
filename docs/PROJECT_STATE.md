# Alina Lavoro - Project State

Ultimo aggiornamento: 2026-05-02 — V1.8A avviata su `dev` (Mesi via DOM)

## Stato reale

- Branch operativo: `dev`.
- Branch stabile: `main`.
- Tag rollback disponibile: `v1.5-stable` (storico V1.5).
- Riferimento Git stabile V1.6.2: tag annotato **`v1.6.2-stable`** (stesso commit di questo aggiornamento documentale su `main`, dopo deploy finale).
- V1.6.2 e stata validata dall'utente con test dichiarato perfetto.
- Merge controllato `dev -> main` eseguito tramite PR GitHub #1.
- `main` contiene ora la V1.6.2 come stato stabile corrente.
- Dopo il merge, `dev` resta branch operativo per i prossimi sviluppi.
- V1.6.2 e su Google Apps Script; **deploy finale** eseguito dall'implementatore con `npm run deploy` (2026-05-02, autorizzazione esplicita utente), allineato a `main`.
- Deployment Web App precedente era gia stato aggiornato dall'utente; questo passaggio registra il deploy ufficiale di chiusura stabilizzazione da repo `main`.
- Il test su URL di test V1.6.2 e risultato corretto per il layout mobile verticale.
- Il test finale sull'URL ufficiale `/exec` e stato confermato OK dall'utente.
- Ulteriore validazione utente successiva: test V1.6.2 dichiarato perfetto; nessun problema segnalato nel test eseguito.
- Il workflow orchestratore/implementatore e stato formalizzato: l'orchestratore legge GitHub, Cursor/Agent aggiorna GitHub a fine blocco.
- `docs/ORCHESTRATOR_RULES.md` contiene le regole prioritarie per questa chat e per le nuove chat che leggono GitHub.
- **V1.8A (in corso su `dev`):** alleggerimento iniziale pagina Mesi — lista costruita con DOM invece di un solo `innerHTML` per tutte le righe; vedi `docs/roadmap.md` sezione V1.8. Riferimento produzione resta **`v1.6.2-stable`** / `main` fino a nuova release.

## Stack

- Backend: Google Apps Script.
- Database: Google Sheet.
- Frontend: HTML, CSS, JavaScript in `src/frontend/Index.html`.
- Versionamento: Git e GitHub.
- Ambiente operativo: Cursor.
- Sincronizzazione Apps Script: `clasp` tramite npm scripts.

## File principali

- `docs/ORCHESTRATOR_RULES.md`: regole prioritarie orchestratore / nuove chat.
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
- Per `aggio` e ripartenze di nuove chat, leggere prima `docs/ORCHESTRATOR_RULES.md`.
- Lavorare su `dev`.
- Non modificare `gas-current/`.
- Modificare i sorgenti reali in `src/`.
- Non fare deploy senza test e conferma esplicita.
- Evitare `git add .`; usare sempre `git add <file specifici>`.
- Ogni blocco deve avere piano, implementazione, test e riepilogo.
- GitHub e la fonte di verita dell'orchestratore.
- Cursor/Agent, come implementatore, deve aggiornare GitHub a fine blocco o sessione anche se l'utente non scrive esplicitamente `finito`.

## Stato versioni

- V1.5: stabile storica, taggata come `v1.5-stable`.
- V1.6: ottimizzazione mobile verticale e performance iniziale.
- V1.6.1: forzatura layout verticale sotto 900px.
- V1.6.2: fix viewport Apps Script con `HtmlService.addMetaTag` e fallback portrait; test URL di test OK; deployment ufficiale `/exec` OK; ulteriore test utente dichiarato perfetto; promossa su `main` tramite PR #1.
- V1.8A: avvio su `dev` — performance Mesi (primo step: DOM per lista righe).

## Rischi aperti

- Pagina Mesi: dopo V1.8A restano possibili ottimizzazioni (virtualizzazione, meno re-render); misurare su Android vecchio reale.
- Verificare il comportamento reale su Android vecchio quando disponibile, se non gia incluso nel test utente dichiarato perfetto.

## Prossimo passo consigliato

1. Test manuale su `dev`: tab Mesi, stipendio da riga, cambio lingua, molti mesi in lista.
2. Continuare V1.8 su `dev` (eventuale V1.8B) prima di merge verso `main`.
3. Riferimento stabile produzione: `v1.6.2-stable` / `main` fino a nuova release concordata.
