# Alina Lavoro - Project State

Ultimo aggiornamento: 2026-05-10 — produzione **V1.8.9** (pagina **Mesi**: fix toggle anni — classe **`.months-year-panel--collapsed`** + **`toggleMonthsYear_`**; anno più recente aperto di default) su **`main`**; Apps Script deployment **`@20`**; tag **`v1.8.9-stable`**. Deploy **Windows** con **Git Bash** per `sync` + `clasp` se `npm run deploy` fallisce su **cmd**. **Rollback immediato:** **`@19`** / **`v1.8.8-stable`** (bug toggle V1.8.8) oppure **`@18`** / **`v1.8.7-stable`**. **Test manuale utente su `/exec` @20:** da fare. Sessione: `docs/sessions/2026-05-10-v189-fix-months-year-toggle-deploy.md`. Workflow **main-only**.

## Stato reale

- **Branch operativo unico `main`:** release codice **V1.8.9** (`package.json` **1.8.9**, `APP_VERSION` **1.8.9** in Impostazioni). Tutti i nuovi sviluppi partono da qui.
- **Branch `dev`:** **legacy/inattivo** (non usato per lavoro corrente; può restare sul remoto e restare allineato a `main` senza ruolo operativo).
- **Tag Git stabili:** **`v1.8.9-stable`** (release corrente codice / snapshot); **`v1.8.8-stable`** (V1.8.8 / deploy **`@19`** — toggle anni non affidabile su alcuni client); **`v1.8.7-stable`** (V1.8.7 / deploy **`@18`**); **`v1.8.6-stable`** … **`v1.5-stable`** (storico).
- **Apps Script (live):** deployment **clasp `@20`** (V1.8.9) — ID: `AKfycbxxbOtZmmcflqyrToKXo_bR6MaK4pupI-fkDrGRmZsC2vSnjQajmwMNePmg26ji-XY8og`. Dettagli: `docs/sessions/2026-05-10-v189-fix-months-year-toggle-deploy.md`. Rollback precedente documentato: **`@19`** (V1.8.8) — `AKfycbyzsTI8uaRJDGyiNrmm6jQRGjNyI80kE_Z4W7qwBLcbwKt6wp-coqsmlcG-cXUAJYtKlg`; **`@18`** (V1.8.7) — `AKfycbyKn_0bR-JkGIPx96cNooiEjeqxMa7Uqvn5Rsb61GhEvvDBC5lT8FPwX11egV4U0un-Uw`. URL Web App **`/exec`**: allineare al deployment corrente in Apps Script.
- **`gas-current/`:** snapshot allineato a **V1.8.9** (`src` + `appsscript.json`); solo lettura / tracciamento, non sorgente primaria.
- `docs/ORCHESTRATOR_RULES.md`, `docs/STREAMLINED_WORKFLOW.md`: workflow orchestratore/implementatore e workflow snello.

### Cronologia sintetica

- V1.6.2 → V1.8.0 (V1.8A): Mesi via DOM, deploy **@8**, tag `v1.8.0-stable`.
- **V1.8.1:** issue **#3** (riga versione in Impostazioni); deploy **`@9`**, tag **`v1.8.1-stable`** …
- **V1.8.2:** issue **#5** (arrotondamento Inizio/Fine); tag **`v1.8.2-stable`**; deploy **`@10`** — `docs/sessions/2026-05-05-v182-arrotondamento-orari-release.md`.
- **V1.8.3:** V1.8B — firma/cache `renderMonths()` (**`fc9ac43`**) + bump **1.8.3**; deploy **`@12`**; tag **`v1.8.3-stable`** — `docs/sessions/2026-05-10-v183-v18b-months-rerender-deploy.md`.
- **V1.8.4:** fix **`dismissSalaryReminder`** (**`beb277a`**) + bump **1.8.4**; deploy **`@14`**; tag **`v1.8.4-stable`** — `docs/sessions/2026-05-10-v184-fix-salary-reminder-later-deploy.md`.
- **V1.8.5:** CSS mobile righe Mesi più compatte; bump **1.8.5**; deploy **`@15`**; tag **`v1.8.5-stable`** — `docs/sessions/2026-05-10-v185-months-mobile-compact-deploy.md`.
- **V1.8.7:** Mesi per anno (heading + sezioni); bump **1.8.7**; deploy **`@18`**; tag **`v1.8.7-stable`** — `docs/sessions/2026-05-10-v187-months-by-year-deploy.md`.
- **V1.8.8:** anni Mesi collassabili (disclosure custom); bump **1.8.8**; deploy **`@19`**; tag **`v1.8.8-stable`** — `docs/sessions/2026-05-10-v188-months-year-collapse-deploy.md`.
- **V1.8.9:** fix toggle anni Mesi (classe collapsed + `toggleMonthsYear_`); bump **1.8.9**; deploy **`@20`**; tag **`v1.8.9-stable`** — `docs/sessions/2026-05-10-v189-fix-months-year-toggle-deploy.md`.

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
- **V1.8.4:** tag **`v1.8.4-stable`**; fix promemoria stipendio «Più tardi»; deploy clasp **`@14`** (`AKfycbx-PVHZvRait-KwBfLzc6pWfuMltRN9s0WiJMZN9p71hoK32Bmw9N62ICQod8JIAJVV4Q`).
- **V1.8.5:** tag **`v1.8.5-stable`**; righe Mesi compatte su mobile (CSS); deploy clasp **`@15`** (`AKfycbwCCxFZUQUjp8RslSt4jPMnxS1vOM7JORGkvaEn20YdSlEzoB-WnETsiR_b2RYKZ8vc9Q`).
- **V1.8.6:** tag **`v1.8.6-stable`**; fix Mesi mobile (griglia + navbar); deploy clasp **`@17`** (`AKfycbwLxc6ilqVnKxP5G7OZ0sY7AOXQVKQDeteDqNs2gJN0WygQOmPSKhr0iXiCBdwolu90IQ`).
- **V1.8.7:** tag **`v1.8.7-stable`**; Mesi per anno; deploy clasp **`@18`** (`AKfycbyKn_0bR-JkGIPx96cNooiEjeqxMa7Uqvn5Rsb61GhEvvDBC5lT8FPwX11egV4U0un-Uw`).
- **V1.8.9:** tag **`v1.8.9-stable`**; fix toggle anni Mesi; deploy clasp **`@20`** (`AKfycbxxbOtZmmcflqyrToKXo_bR6MaK4pupI-fkDrGRmZsC2vSnjQajmwMNePmg26ji-XY8og`).
- **V1.8.8:** tag **`v1.8.8-stable`**; anni collassabili (bug toggle su alcuni client); deploy clasp **`@19`** (`AKfycbyzsTI8uaRJDGyiNrmm6jQRGjNyI80kE_Z4W7qwBLcbwKt6wp-coqsmlcG-cXUAJYtKlg`).

## Rischi aperti

- Mesi: possibili ottimizzazioni future (virtualizzazione).
- Android vecchio: monitorare su dispositivo reale quando disponibile.
- Rollback: **`@19`** (V1.8.8) / tag **`v1.8.8-stable`**, **`@18`** (V1.8.7) / tag **`v1.8.7-stable`**, **`@17`** / **`v1.8.6-stable`**, o gestione deployment in Apps Script.

## Prossimo passo consigliato

1. **Test manuale utente su `/exec`** del deployment **`@20`** (V1.8.9): toggle anni Mesi + smoke generale.
2. Lavoro nuovo su **`main`** dopo `git pull origin main`.
