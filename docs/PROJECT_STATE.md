# Alina Lavoro - Project State

Ultimo aggiornamento: 2026-05-10 — produzione **V1.8.4** (fix promemoria stipendio **«Più tardi»** — commit **`beb277a`**) su **`main`**; Apps Script deployment **`@14`**; tag **`v1.8.4-stable`**. Deploy **Windows** (`npx.cmd clasp push` / `npx.cmd clasp deploy`). Deploy **`@13`** intermedio (fix incluso, UI **1.8.3**) superseded da **`@14`**. **Test manuale utente su `/exec` di `@14`:** da fare. Sessione deploy: `docs/sessions/2026-05-10-v184-fix-salary-reminder-later-deploy.md`. Workflow **main-only**.

## Stato reale

- **Branch operativo unico `main`:** release codice **V1.8.4** (`package.json` **1.8.4**, `APP_VERSION` **1.8.4** in Impostazioni). Tutti i nuovi sviluppi partono da qui.
- **Branch `dev`:** **legacy/inattivo** (non usato per lavoro corrente; può restare sul remoto e restare allineato a `main` senza ruolo operativo).
- **Tag Git stabili:** **`v1.8.4-stable`** (release corrente codice / snapshot); **`v1.8.3-stable`** (V1.8.3 / deploy **`@12`** rollback immediato precedente); **`v1.8.2-stable`** … **`v1.5-stable`** (storico).
- **Apps Script (live):** deployment **clasp `@14`** (V1.8.4) — ID: `AKfycbx-PVHZvRait-KwBfLzc6pWfuMltRN9s0WiJMZN9p71hoK32Bmw9N62ICQod8JIAJVV4Q`. Dettagli: `docs/sessions/2026-05-10-v184-fix-salary-reminder-later-deploy.md`. Rollback precedente documentato: **`@12`** (V1.8.3) — `AKfycbwp39AN4DPH4BXikfemvF7G6yUdObnYro63nC3fqvUcn9G5XxzWyXD91AR2H8pfV9WDaw`. URL Web App **`/exec`**: allineare al deployment corrente in Apps Script.
- **`gas-current/`:** snapshot allineato a **V1.8.4** (`src` + `appsscript.json`); solo lettura / tracciamento, non sorgente primaria.
- `docs/ORCHESTRATOR_RULES.md`, `docs/STREAMLINED_WORKFLOW.md`: workflow orchestratore/implementatore e workflow snello.

### Cronologia sintetica

- V1.6.2 → V1.8.0 (V1.8A): Mesi via DOM, deploy **@8**, tag `v1.8.0-stable`.
- **V1.8.1:** issue **#3** (riga versione in Impostazioni); deploy **`@9`**, tag **`v1.8.1-stable`** …
- **V1.8.2:** issue **#5** (arrotondamento Inizio/Fine); tag **`v1.8.2-stable`**; deploy **`@10`** — `docs/sessions/2026-05-05-v182-arrotondamento-orari-release.md`.
- **V1.8.3:** V1.8B — firma/cache `renderMonths()` (**`fc9ac43`**) + bump **1.8.3**; deploy **`@12`**; tag **`v1.8.3-stable`** — `docs/sessions/2026-05-10-v183-v18b-months-rerender-deploy.md`.
- **V1.8.4:** fix **`dismissSalaryReminder`** (**`beb277a`**) + bump **1.8.4**; deploy **`@14`**; tag **`v1.8.4-stable`** — `docs/sessions/2026-05-10-v184-fix-salary-reminder-later-deploy.md`.

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
- **V1.8.2:** tag **`v1.8.2-stable`**; issue **#5**; deploy clasp **`@10`**.
- **V1.8.3:** tag **`v1.8.3-stable`**; V1.8B (re-render Mesi); deploy clasp **`@12`**.
- **V1.8.4:** tag **`v1.8.4-stable`**; fix promemoria stipendio «Più tardi»; deploy clasp **`@14`** (ID sopra).

## Rischi aperti

- Mesi: possibili ottimizzazioni future (virtualizzazione); non bloccanti se il test resta OK.
- Android vecchio: monitorare su dispositivo reale al test su **`@14`**.
- Rollback: **`@12`** (V1.8.3) / tag **`v1.8.3-stable`** o gestione deployment in Apps Script.

## Prossimo passo consigliato

1. **Test manuale su `/exec`** del deployment **`@14`**: versione **1.8.4**; promemoria stipendio — **«Più tardi»** chiude il banner; **«Inserisci`** OK; smoke Home/Mesi/issue **#5**.
2. Lavoro nuovo su **`main`** dopo `git pull origin main`.
