# Alina Lavoro - Project State

Ultimo aggiornamento: 2026-05-03 — issue **#3** (versione in UI) su **`dev`**: riga versione in Impostazioni; `APP_VERSION` in frontend; deploy **@8** invariato fino a nuovo rilascio.

## Stato reale

- **Branch stabile `main`:** contiene la release **V1.8.0** (V1.8A: Mesi via DOM, stesso albero di `src` del deploy **@8**).
- **Branch operativo `dev`:** può contenere micro-step dopo **`main`** (es. issue **#3** versione in UI); verificare `git log main..dev` prima del merge.
- **Tag Git stabili:** **`v1.8.0-stable`** (release corrente); **`v1.6.2-stable`** (V1.6.2); **`v1.5-stable`** (rollback storico pre-V1.6).
- **`package.json`:** **1.8.0** (allineato alla release Git stabile).
- **Apps Script:** deployment ufficiale **V1.8A** clasp **`@8`** — dettagli in `docs/sessions/2026-05-02-v18a-deploy-ufficiale-eseguito.md`.
- **`gas-current/`:** snapshot aggiornato in questo blocco da `src/backend/Code.gs` → `Codice.js`, `src/frontend/Index.html`, `appsscript.json`, coerente con codice V1.8.0 / deploy @8 (solo documentazione archivistica; non è la fonte di sviluppo).
- `docs/ORCHESTRATOR_RULES.md`, `docs/STREAMLINED_WORKFLOW.md`: workflow orchestratore/implementatore e workflow snello.

### Cronologia sintetica

- V1.6.2: stabile su `main`, poi tag `v1.6.2-stable`; test utente perfetto; deploy finale documentato.
- V1.8A: sviluppo su `dev`; validazione tecnica e manuale OK; `npm run push` + `npm run deploy` → **@8**; merge `dev` → `main` (fast-forward, 2026-05-03); tag **`v1.8.0-stable`**.

## Stack

- Backend: Google Apps Script.
- Database: Google Sheet.
- Frontend: HTML, CSS, JavaScript in `src/frontend/Index.html`.
- Versionamento: Git e GitHub.
- Ambiente operativo: Cursor.
- Sincronizzazione Apps Script: `clasp` tramite npm scripts.

## File principali

- `docs/ORCHESTRATOR_RULES.md`: regole prioritarie orchestratore / nuove chat.
- `docs/STREAMLINED_WORKFLOW.md`: workflow snello.
- `src/backend/Code.gs`: backend Apps Script.
- `src/frontend/Index.html`: frontend Web App.
- `appsscript.json`: manifest Apps Script.
- `gas-current/`: snapshot read-only del codice deployato (non modificare come sorgente primaria).
- `docs/roadmap.md`, `docs/CHECKPOINT.md`, `docs/COMMANDS.md`, `docs/WORKFLOW.md`, `docs/AI_RULES.md`.

## Comandi npm disponibili

- `npm run sync`: copia i sorgenti in `.gas/`.
- `npm run push`: esegue sync e `clasp push`.
- `npm run deploy`: esegue sync, `clasp push` e `clasp deploy`.
- `npm run aggio`: fotografia locale del repository.
- `npm run checkpoint`: genera checkpoint locale.
- `npm run finito -- "Messaggio" file1 file2`: chiusura blocco con commit selettivo.

## Regole operative correnti

- **Implementatore:** `git pull`, `npm run aggio`; fine blocco: doc + commit selettivo + push.
- Nuovi sviluppi: branch **`dev`** (poi merge controllato verso `main` quando stabile).
- Non modificare `gas-current/` come area di sviluppo (solo snapshot).
- Modifiche applicative in `src/`.
- Deploy solo con conferma esplicita.
- Mai `git add .` senza eccezione documentata.

## Stato versioni

- V1.5: storica, tag `v1.5-stable`.
- V1.6.x: mobile verticale; V1.6.2 tag `v1.6.2-stable`.
- **V1.8.0 (V1.8A):** release corrente su `main`/`dev`, tag **`v1.8.0-stable`**; deploy Apps Script **@8**.

## Rischi aperti

- Mesi: possibili ottimizzazioni future (virtualizzazione); non bloccanti se il test resta OK.
- Android vecchio: monitorare su dispositivo reale se necessario.

## Prossimo passo consigliato

1. Verifica manuale in Impostazioni su build da `dev`; chiudere issue **#3** su GitHub; merge `dev` → `main` e deploy se pianificato dall’orchestratore.
2. Eventuale V1.8B (roadmap) su `dev` prima della prossima release maggiore.
