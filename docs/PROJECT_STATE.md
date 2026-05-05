# Alina Lavoro - Project State

Ultimo aggiornamento: 2026-05-05 — micro-release **V1.8.2** su **`main`** (issue **#5** + bump versione + snapshot `gas-current/` + tag **`v1.8.2-stable`**). Sessione: `docs/sessions/2026-05-05-v182-arrotondamento-orari-release.md`. **Deploy clasp** in questa sessione **non** eseguito dall’ambiente automatizzato (manca `.clasp.json` / credenziali): l’ultimo deployment **registrato** in produzione resta **`@9`** (V1.8.1) **fino a** `clasp deploy` da macchina configurata; dopo il deploy aggiornare questo file con il nuovo ID (es. `@10`). Workflow **main-only**.

## Stato reale

- **Branch operativo unico `main`:** release codice **V1.8.2** (`package.json` **1.8.2**, `APP_VERSION` **1.8.2** in Impostazioni). Tutti i nuovi sviluppi partono da qui.
- **Branch `dev`:** **legacy/inattivo** (non usato per lavoro corrente; può restare sul remoto e restare allineato a `main` senza ruolo operativo).
- **Tag Git stabili:** **`v1.8.2-stable`** (release corrente codice / snapshot); **`v1.8.1-stable`** (V1.8.1 / deploy **@9**); **`v1.8.0-stable`**; **`v1.6.2-stable`**; **`v1.5-stable`** (rollback storico).
- **Apps Script (live):** ultimo ID **documentato** in produzione **`@9`** (V1.8.1) — `docs/sessions/2026-05-03-v181-versione-ui-release.md`. Dopo deploy V1.8.2 da macchina locale, sostituire con il nuovo deployment ID e URL **/exec** (vedi sessione V1.8.2).
- **`gas-current/`:** snapshot allineato a **V1.8.2** (`src` + `appsscript.json`); solo lettura / tracciamento, non sorgente primaria.
- `docs/ORCHESTRATOR_RULES.md`, `docs/STREAMLINED_WORKFLOW.md`: workflow orchestratore/implementatore e workflow snello.

### Cronologia sintetica

- V1.6.2 → V1.8.0 (V1.8A): Mesi via DOM, deploy **@8**, tag `v1.8.0-stable`.
- **V1.8.1:** issue **#3** (riga versione in Impostazioni); integrazione su `main`, `npm run deploy` → **`@9`**, tag **`v1.8.1-stable`**, snapshot `gas-current/` (storico include anche merge da branch `dev` prima del passaggio main-only).
- **V1.8.2:** issue **#5** (arrotondamento Inizio/Fine a 5 min); tag **`v1.8.2-stable`**; snapshot `gas-current/`; deploy clasp **da completare** su macchina con `.clasp.json` (vedi `docs/sessions/2026-05-05-v182-arrotondamento-orari-release.md`).

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
- **V1.8.2:** tag **`v1.8.2-stable`**; issue **#5** nel codice su **`main`**; **aggiornare** questa sezione con il nuovo deployment dopo `clasp deploy`.

## Rischi aperti

- Mesi: possibili ottimizzazioni future (virtualizzazione); non bloccanti se il test resta OK.
- Android vecchio: monitorare su dispositivo reale se necessario.
- Finché il deploy V1.8.2 non è eseguito, **/exec** può restare sul deployment **@9** (V1.8.1).

## Prossimo passo consigliato

1. **`clasp deploy`** da macchina con `.clasp.json` e credenziali; aggiornare `PROJECT_STATE` con il nuovo deployment ID e URL **/exec**.
2. Test manuale su **/exec**: issue **#5** + versione **1.8.2** in Impostazioni.
3. Lavoro nuovo su **`main`** dopo `git pull origin main` (es. roadmap V1.8B).
