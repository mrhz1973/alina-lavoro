# Alina Lavoro - Project State

Ultimo aggiornamento: 2026-05-10 — produzione **V1.8.2** su **`main`** (issue **#5** in produzione); Apps Script **clasp revision `@10`**; tag stabile **`v1.8.2-stable`**. Deploy eseguito manualmente su **Windows** (`npx.cmd clasp push` / `npx.cmd clasp deploy`). **Test manuale utente su `/exec`:** OK. Sessione: `docs/sessions/2026-05-05-v182-arrotondamento-orari-release.md`. Workflow **main-only**.

## Stato reale

- **Branch operativo unico `main`:** release codice **V1.8.2** (`package.json` **1.8.2**, `APP_VERSION` **1.8.2** in Impostazioni). Tutti i nuovi sviluppi partono da qui.
- **Branch `dev`:** **legacy/inattivo** (non usato per lavoro corrente; può restare sul remoto e restare allineato a `main` senza ruolo operativo).
- **Tag Git stabili:** **`v1.8.2-stable`** (release corrente codice / snapshot); **`v1.8.1-stable`** (V1.8.1 / deploy **@9**); **`v1.8.0-stable`**; **`v1.6.2-stable`**; **`v1.5-stable`** (rollback storico).
- **Apps Script (live):** deployment **clasp `@10`** (V1.8.2) — ID: `AKfycbz3TwCw8XjyUY4dfydoxDf-fztIDiq0EEPi84HBiahangwj318Sw5XULSARXSVwF38I_Q`. Dettagli ed esito deploy: `docs/sessions/2026-05-05-v182-arrotondamento-orari-release.md`. URL Web App **/exec**: aprire da Apps Script o dall’output clasp per il deployment corrente.
- **`gas-current/`:** snapshot allineato a **V1.8.2** (`src` + `appsscript.json`); solo lettura / tracciamento, non sorgente primaria.
- `docs/ORCHESTRATOR_RULES.md`, `docs/STREAMLINED_WORKFLOW.md`: workflow orchestratore/implementatore e workflow snello.

### Cronologia sintetica

- V1.6.2 → V1.8.0 (V1.8A): Mesi via DOM, deploy **@8**, tag `v1.8.0-stable`.
- **V1.8.1:** issue **#3** (riga versione in Impostazioni); integrazione su `main`, `npm run deploy` → **`@9`**, tag **`v1.8.1-stable`**, snapshot `gas-current/` (storico include anche merge da branch `dev` prima del passaggio main-only).
- **V1.8.2:** issue **#5** (arrotondamento Inizio/Fine a 5 min); tag **`v1.8.2-stable`**; snapshot `gas-current/`; deploy clasp **`@10`** su Windows (vedi `docs/sessions/2026-05-05-v182-arrotondamento-orari-release.md`).

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

- **Implementatore:** `git checkout main`, `git pull origin main`, `npm run aggio`; fine blocco: doc + commit selettivo + **`git push origin main`**.
- Nuovi sviluppi: solo su **`main`**. Nessun merge `dev` → `main` nel flusso ordinario.
- **Rollback:** tag stabili precedenti su `main` (vedi `docs/COMMANDS.md`).
- Non modificare `gas-current/` come area di sviluppo (solo snapshot post-deploy quando documentato).
- Modifiche applicative in `src/`.
- Deploy quando coerente col blocco (`docs/STREAMLINED_WORKFLOW.md` + prompt).
- Mai `git add .` senza eccezione documentata.

## Stato versioni

- V1.5: storica, tag `v1.5-stable`.
- V1.6.x: tag `v1.6.2-stable`.
- V1.8.0 (V1.8A): tag `v1.8.0-stable`; deploy storico **@8**.
- **V1.8.1:** tag **`v1.8.1-stable`**; deploy **@9**; issue **#3**.
- **V1.8.2:** tag **`v1.8.2-stable`**; issue **#5** in produzione; deploy clasp **`@10`** (ID sopra).

## Rischi aperti

- Mesi: possibili ottimizzazioni future (virtualizzazione); non bloccanti se il test resta OK.
- Android vecchio: monitorare su dispositivo reale se necessario.
- Rollback a **@9** (V1.8.1) possibile solo tramite gestione deployment in Apps Script se necessario.

## Prossimo passo consigliato

1. **Test manuale su `/exec`** del deployment **`@10`**: **superato** dall’utente (issue **#5**, versione **1.8.2** in Impostazioni).
2. Lavoro nuovo su **`main`** dopo `git pull origin main` (es. roadmap V1.8B / micro-step documentati).
