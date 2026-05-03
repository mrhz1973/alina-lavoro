# Alina Lavoro - Project State

Ultimo aggiornamento: 2026-05-03 — adozione workflow **main-only** (`docs/sessions/2026-05-03-main-only-workflow.md`). Produzione invariata: **V1.8.1**, deploy **`@9`**, tag **`v1.8.1-stable`**.

## Stato reale

- **Branch operativo unico `main`:** release **V1.8.1** (`package.json` **1.8.1**, `APP_VERSION` **1.8.1** in Impostazioni). Tutti i nuovi sviluppi partono da qui.
- **Branch `dev`:** **legacy/inattivo** (non usato per lavoro corrente; può restare sul remoto e restare allineato a `main` senza ruolo operativo).
- **Tag Git stabili:** **`v1.8.1-stable`** (release corrente); **`v1.8.0-stable`** (V1.8.0 / V1.8A); **`v1.6.2-stable`**; **`v1.5-stable`** (rollback storico).
- **Apps Script:** deployment ufficiale clasp **`@9`** — `docs/sessions/2026-05-03-v181-versione-ui-release.md` (precedente produzione V1.8A: **`@8`** in `docs/sessions/2026-05-02-v18a-deploy-ufficiale-eseguito.md`).
- **`gas-current/`:** snapshot aggiornato dopo deploy **@9** (diff Git su `Index.html` rispetto allo snapshot precedente; `Codice.js` / `appsscript.json` già allineati).
- `docs/ORCHESTRATOR_RULES.md`, `docs/STREAMLINED_WORKFLOW.md`: workflow orchestratore/implementatore e workflow snello.

### Cronologia sintetica

- V1.6.2 → V1.8.0 (V1.8A): Mesi via DOM, deploy **@8**, tag `v1.8.0-stable`.
- **V1.8.1:** issue **#3** (riga versione in Impostazioni); integrazione su `main`, `npm run deploy` → **`@9`**, tag **`v1.8.1-stable`**, snapshot `gas-current/` (storico include anche merge da branch `dev` prima del passaggio main-only).

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
- **V1.8.1:** release corrente su **`main`**, tag **`v1.8.1-stable`**; deploy **@9**; issue **#3** in produzione.

## Rischi aperti

- Mesi: possibili ottimizzazioni future (virtualizzazione); non bloccanti se il test resta OK.
- Android vecchio: monitorare su dispositivo reale se necessario.

## Prossimo passo consigliato

1. Verifica manuale URL **`/exec`** del deployment **@9** e riga versione in Impostazioni.
2. Lavoro nuovo su **`main`** dopo `git pull origin main` (es. roadmap V1.8B).
