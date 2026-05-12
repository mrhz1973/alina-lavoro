# Alina Lavoro — Checkpoint (ripartenza)

Ultimo aggiornamento: 2026-05-11 — produzione **V1.9.2** ( **Dettaglio mese** più **visivo** — metriche, card, barre ore ); `APP_VERSION` **1.9.2**; Apps Script **clasp `@24`** — ID `AKfycbyIkaQqS-Dce0tfdxyfjdnEEE_xSb3Ys3KdeGL9xiX652QfgfAFRRBSvmuLXdPqQhaXSg`; tag **`v1.9.2-stable`**. Deploy Windows — **Git Bash** + `npx clasp` se `npm run deploy` fallisce (`docs/sessions/2026-05-10-v192-month-detail-visual-refresh-deploy.md`). **Rollback immediato:** **`v1.9.1-stable`** / **`@23`**. **Test manuale utente su `/exec` @24:** **OK** (2026-05-10): **1.9.2**; Dettaglio mese layout visivo; metriche in alto; card giorno; barre proporzionali; **Indietro** OK; **Stipendio** assente sul mese corrente e presente sui precedenti; smoke Home–Note–Impostazioni OK; **Xiaomi Redmi 9C NFC** incluso. **V1.9.1** su **`@23`:** **OK** (2026-05-10). Banner GAS «creato da un utente di Google Apps Script» = **limitazione piattaforma**, non bug app — vedi sessione. **Link Sheet vs Web App:** uso quotidiano sul cellulare = URL Web App **`/exec`**; il Google Sheet è solo database/amministrazione. Workflow **main-only**; **`aggio:win`** (`docs/COMMANDS.md`).

## Prossimo passo — automazione (pilota)

- **n8n queue reader:** skip **`done`** su **`TEST - GitHub list Alina task queue`** — **implementato e validato** in UI (2026-05-11); **ramo `has_task: true`** con **0005**; **primo docs-only 0100** con vincolo metadata in **formato lista** per **Classify task** (stessa sessione). Restano regressioni mirate / watcher MVP per `docs/automation/runbook.md`.
- **PR #7 mergiata** su `main` (2026-05-11): template `cursor-prompt-default.md` e documentazione sessione n8n in repo.
- **Task 0101** **completato** (tipo `n8n-docs`, commit `5f602f8`, 2026-05-11): n8n legge template dal repo; nodo `Get cursor prompt template` attivo; `Build Cursor prompt` usa contenuto decodificato — marcato done.
- **Task 0102** **completato** (tipo `docs-only`, commit `5b86b20` + cleanup `bca334d` + done `bfe85c3`, 2026-05-11): **primo test Claude Code runner docs-only** riuscito — sessione: `docs/sessions/2026-05-11-claude-code-runner-test-0102.md`.
- **n8n queue reader:** nessun task eleggibile — 0101/0102/0103 coperti da `processing/done` (`docs/tasks/done/0103-lifecycle-ownership-design.md` creato, 2026-05-11).
- **Task 0103** **completato** (tipo `docs-only`, 2026-05-11): `docs/automation/n8n-workflows/lifecycle-ownership.md` creato — fonte canonica per ownership queue → processing → done / failed; documenti collegati aggiornati; nessuna modifica app, n8n runtime, done/, failed/, deploy, tag.
- **Task 0105** **completato** (tipo `docs-only`, 2026-05-12): `CLAUDE.md` creato nella root — memoria progetto stabile per Claude Code post-compacting; sezione `Compact Instructions`; punta ai documenti canonici senza duplicarli.
- **Task 0104** **completato** (tipo `n8n-validation-planning`, 2026-05-12): failed stub documentale creato in `docs/tasks/failed/0104-failed-validation-stub.md` con sezione `## Failed status`; done marker in `docs/tasks/done/0104-failed-validation-stub.md`; documenti automazione aggiornati minimalmente; skip failed nel queue reader non ancora validato né implementato — sessione: `docs/sessions/2026-05-12-failed-validation-stub.md`.
- **Task 0106** **completato** (tipo `n8n-design`, 2026-05-12): design skip failed queue reader in `docs/automation/n8n-workflows/queue-reader-skip-failed-design.md`; documentazione lifecycle aggiornata per coerenza; nessuna modifica n8n runtime.
- **Task 0107** **completato** (tipo `n8n-runtime-validation`, 2026-05-12): validazione manuale n8n skip failed in `docs/sessions/2026-05-12-n8n-queue-reader-skip-failed-runtime-validation.md`; skip failed ora implementato e validato nel runtime n8n; scenario 0104 verificato; nessun impatto su app V1.9.2.
- **Task 0108** **completato** (tipo `n8n-runtime-validation-planning`, 2026-05-12): ramo `has_task:true` validato dopo skip failed — n8n ha selezionato correttamente task 0108, generato prompt Cursor e sessione automation; secondo run `has_task:false` (anti-doppio-run processing confermato); sessione `docs/sessions/2026-05-12-n8n-queue-reader-has-task-true-after-skip-failed.md`; nessun impatto su app V1.9.2.
- **Task 0109** **completato** (tipo `vps-maintenance-planning`, 2026-05-12): VPS IONOS verificato read-only — Ubuntu 24.04.4 LTS, n8n in Docker (container `root-n8n-1`, Up ~34h, `curl localhost:5678` HTTP 200); 4 pacchetti libheif aggiornabili non urgenti, non applicati; no reboot required; ufw inattivo; rischio futuro documentato (binding n8n su `0.0.0.0:5678` — da vincolare a `127.0.0.1` in task separato); nessuna modifica runtime/app; sessione: `docs/sessions/2026-05-12-vps-n8n-maintenance-check.md`.
- **Task 0110** **completato** (tipo `vps-hardening-planning`, 2026-05-12): binding Docker n8n ristretto da `0.0.0.0:5678` a `127.0.0.1:5678` — compose `/root/docker-compose.yaml`, backup creato, `docker compose up -d` applicato; `docker ps` mostra `127.0.0.1:5678->5678/tcp`; `curl localhost:5678` HTTP 200; tunnel SSH OK; accesso esterno diretto non raggiungibile; warning log non critici annotati; nessun upgrade/reboot/workflow n8n/app; sessione: `docs/sessions/2026-05-12-vps-n8n-bind-localhost-hardening.md`.
- **Workstream attivo obbligatorio:** evoluzione watcher/runner — non proporre ritorno all'app Alina finché watcher/runner non è chiuso o finché l'utente non chiede esplicitamente di tornare all'app. App Alina **V1.9.2** stabile, non toccata.
- Prossimo passo operativo: progettare MVP n8n (watcher) + runner documentale su VPS, allineato a `docs/automation/runbook.md` e `docs/automation/permissions.md`.
- Usare **`docs/tasks/templates/`** come formato unico dei task da passare a **Cursor CLI** / Agent; **template prompt Cursor** versionato: **`docs/tasks/templates/cursor-prompt-default.md`** (allineato a **Build Cursor prompt** n8n; sostituzione `{{…}}` in task n8n successivo).

Questo file serve per ripartire rapidamente in una nuova chat AI senza perdere contesto.

## Regola prioritaria per nuove chat

Prima di ricostruire lo stato del progetto, leggere `docs/ORCHESTRATOR_RULES.md`.

Quel file definisce:
- ordine di lettura dopo `aggio`;
- ruoli ChatGPT/Cursor/GitHub;
- regola anti-copia/incolla manuale quando GitHub e aggiornato;
- obbligo di usare `docs/COMMANDS.md` per i controlli frontend standard;
- vincoli permanenti: branch **`main`** operativo, **`gas-current/`** solo snapshot, niente `git add .`, deploy coerente col blocco (`docs/STREAMLINED_WORKFLOW.md`).

## Contesto sintetico

Progetto: `Alina Lavoro`.

App personale per registrazione ore di lavoro, turni, stipendi e note di Alina.

Stack:
- Google Apps Script come backend;
- Google Sheet come database;
- HTML/CSS/JavaScript come frontend;
- GitHub per versionamento;
- Cursor come implementatore operativo;
- `clasp` per sincronizzare il codice con Apps Script.

## Uso Web App vs Google Sheet

- Per **uso quotidiano** sul telefono (Alina): salvare e aprire il link della **Web App** Apps Script con suffisso **`/exec`** (deploy **`@24`** / ID documentato sopra).
- Il link al **Google Sheet** è solo **database e amministrazione** del foglio; **non** è l’interfaccia dell’app e non va usato al posto dell’URL **`/exec`**.

## Dispositivo target (test reale)

- **Xiaomi Redmi 9C NFC** è il **telefono di riferimento** per validazione su Android/WebView in fascia low-end.
- **V1.9.2** / **`@24`**: test manuale **`/exec`** — **OK** (2026-05-10).
- **V1.9.1** / **`@23`**: test manuale utente — **OK** (2026-05-10).
- Ottimizzazioni future su **Mesi** / **Home** / **Note** (performance, DOM, CSS): **evolutive**, non urgenti rispetto allo stato attuale.

## Repository

- Repository: `mrhz1973/alina-lavoro`.
- Branch operativo unico: **`main`** (sviluppi, fix, documentazione, release).
- Branch **`dev`:** **legacy/inattivo** (non usato per nuovi lavori; può restare sul remoto).
- Tag rollback storico: `v1.5-stable`.
- Tag stabile V1.6.2: `v1.6.2-stable`.
- Tag stabile **V1.9.2:** **`v1.9.2-stable`** (release corrente su `main`).
- Tag stabile **V1.9.1:** **`v1.9.1-stable`** (deploy **`@23`**).
- Tag stabile **V1.9.0:** **`v1.9.0-stable`** (deploy **`@22`**).
- Tag stabile **V1.8.9:** **`v1.8.9-stable`** (deploy **`@20`**).
- Tag stabile **V1.8.8:** **`v1.8.8-stable`** (deploy **`@19`** — toggle anni non affidabile).
- Tag stabile **V1.8.7:** **`v1.8.7-stable`** (rollback deploy **`@18`**).
- Tag stabile **V1.8.5:** **`v1.8.5-stable`** (rollback deploy **`@15`** — bug Mesi/navbar).
- Tag stabile **V1.8.4:** **`v1.8.4-stable`** (rollback deploy **`@14`**).
- Tag stabile **V1.8.3:** **`v1.8.3-stable`** (rollback deploy **`@12`**).
- Tag stabile **V1.8.2:** **`v1.8.2-stable`** (rollback deploy **`@10`**).
- Tag stabile **V1.8.1:** **`v1.8.1-stable`** (deploy storico **@9**).
- Tag stabile V1.8.0: **`v1.8.0-stable`**.
- GitHub e fonte di verita per l'orchestratore.

## Stato stabile corrente

- **V1.9.2** è la versione stabile corrente su **`main`**; tag **`v1.9.2-stable`**; Apps Script **`@24`**; **Dettaglio mese** più **visivo** (metriche, card, barre ore); eredità **V1.9.1** (**Stipendio** nascosto sul **mese corrente** in **Mesi**); include **V1.9.0** e precedenti.
- **Test manuale utente su `/exec` @24:** **OK** (2026-05-10): **1.9.2**; metriche in alto; card giorno; barre proporzionali; **Indietro**; **Stipendio** solo su mesi precedenti al corrente; **Dettaglio** ovunque; anni Mesi; smoke Home–Note–Impostazioni; **Redmi 9C NFC** incluso.
- **Rollback immediato precedente:** **`v1.9.1-stable`** / deploy **`@23`** — `AKfycbxvuOGtltO32umfM4XgfL1nWTbmzWZ7mnl4f6tsFkkT5yj0qF6OXdBY9tHTDXpUj3WsRg`.
- **Rollback V1.9.0:** **`v1.9.0-stable`** / deploy **`@22`** — `AKfycbyisd4Dd_8XxBU6-ZcjF6qm6K_d4x4YsIRSXCZyeBm4nNjZgfg_X34rdh_KUJ9nV2ULRA`.
- **Rollback V1.8.7:** **`v1.8.7-stable`** / deploy **`@18`** — `AKfycbyKn_0bR-JkGIPx96cNooiEjeqxMa7Uqvn5Rsb61GhEvvDBC5lT8FPwX11egV4U0un-Uw`.
- **`dev`** (legacy): tenuto eventualmente **identico** a `main` per storia; **non** è branch di lavoro.
- V1.8A / V1.8.0: tag **`v1.8.0-stable`**, deploy storico **@8** (sessioni 2026-05-02).
- V1.6.2 resta riproducibile tramite tag **`v1.6.2-stable`**.
- V1.5 resta rollback storico tramite tag **`v1.5-stable`**.

## Stato Apps Script / deploy

- **Deploy finale di stabilizzazione V1.6.2:** documentato (deployment clasp `@6` in output locale dell’epoca).
- **V1.8A:** deployment storico clasp **`@8`** — `docs/sessions/2026-05-02-v18a-deploy-ufficiale-eseguito.md`.
- **V1.8.1:** deployment ufficiale clasp **`@9`** — ID e URL in `docs/sessions/2026-05-03-v181-versione-ui-release.md`.
- **V1.8.2:** deployment ufficiale clasp **`@10`** — ID `AKfycbz3TwCw8XjyUY4dfydoxDf-fztIDiq0EEPi84HBiahangwj318Sw5XULSARXSVwF38I_Q`; esito in `docs/sessions/2026-05-05-v182-arrotondamento-orari-release.md`.
- **V1.8.3:** deployment ufficiale clasp **`@12`** — ID `AKfycbwp39AN4DPH4BXikfemvF7G6yUdObnYro63nC3fqvUcn9G5XxzWyXD91AR2H8pfV9WDaw`; deploy **`@11`** intermedio — `docs/sessions/2026-05-10-v183-v18b-months-rerender-deploy.md`.
- **V1.9.2:** deployment ufficiale clasp **`@24`** — ID `AKfycbyIkaQqS-Dce0tfdxyfjdnEEE_xSb3Ys3KdeGL9xiX652QfgfAFRRBSvmuLXdPqQhaXSg` — `docs/sessions/2026-05-10-v192-month-detail-visual-refresh-deploy.md`.
- **V1.9.1:** deployment ufficiale clasp **`@23`** — ID `AKfycbxvuOGtltO32umfM4XgfL1nWTbmzWZ7mnl4f6tsFkkT5yj0qF6OXdBY9tHTDXpUj3WsRg` — `docs/sessions/2026-05-10-v191-hide-current-month-salary-button-deploy.md`.
- **V1.9.0:** deployment ufficiale clasp **`@22`** — ID `AKfycbyisd4Dd_8XxBU6-ZcjF6qm6K_d4x4YsIRSXCZyeBm4nNjZgfg_X34rdh_KUJ9nV2ULRA` — `docs/sessions/2026-05-10-v190-month-detail-mvp-deploy.md`.
- **V1.8.10:** deployment ufficiale clasp **`@21`** — ID `AKfycbz0_8bE92ATlKeb2oaOrhqOwrUgyiEnw977libqBH5Swkiv2LMwdDK0EbJyo-h7Zpjw6A` — `docs/sessions/2026-05-10-v1810-salary-reminder-snooze-24h-deploy.md`.
- **V1.8.9:** deployment ufficiale clasp **`@20`** — ID `AKfycbxxbOtZmmcflqyrToKXo_bR6MaK4pupI-fkDrGRmZsC2vSnjQajmwMNePmg26ji-XY8og` — `docs/sessions/2026-05-10-v189-fix-months-year-toggle-deploy.md`.
- **V1.8.8:** deployment ufficiale clasp **`@19`** — ID `AKfycbyzsTI8uaRJDGyiNrmm6jQRGjNyI80kE_Z4W7qwBLcbwKt6wp-coqsmlcG-cXUAJYtKlg` — `docs/sessions/2026-05-10-v188-months-year-collapse-deploy.md`.
- **V1.8.7:** deployment ufficiale clasp **`@18`** — ID `AKfycbyKn_0bR-JkGIPx96cNooiEjeqxMa7Uqvn5Rsb61GhEvvDBC5lT8FPwX11egV4U0un-Uw` — `docs/sessions/2026-05-10-v187-months-by-year-deploy.md`.
- **V1.8.6:** deployment ufficiale clasp **`@17`** — ID `AKfycbwLxc6ilqVnKxP5G7OZ0sY7AOXQVKQDeteDqNs2gJN0WygQOmPSKhr0iXiCBdwolu90IQ` — `docs/sessions/2026-05-10-v186-months-mobile-grid-navbar-fix-deploy.md`.
- **V1.8.5:** deployment ufficiale clasp **`@15`** — ID `AKfycbwCCxFZUQUjp8RslSt4jPMnxS1vOM7JORGkvaEn20YdSlEzoB-WnETsiR_b2RYKZ8vc9Q` — `docs/sessions/2026-05-10-v185-months-mobile-compact-deploy.md`.
- **V1.8.4:** deployment ufficiale clasp **`@14`** — ID `AKfycbx-PVHZvRait-KwBfLzc6pWfuMltRN9s0WiJMZN9p71hoK32Bmw9N62ICQod8JIAJVV4Q`; deploy **`@13`** intermedio — `docs/sessions/2026-05-10-v184-fix-salary-reminder-later-deploy.md`.
- **Git `main`:** codice **V1.9.2**, tag **`v1.9.2-stable`**.
- **`gas-current/`:** snapshot codice **V1.9.2**; non è area di sviluppo.

## Struttura importante

- `docs/ORCHESTRATOR_RULES.md`: regole prioritarie orchestratore / nuove chat.
- `src/backend/Code.gs`: backend reale da modificare.
- `src/frontend/Index.html`: frontend reale da modificare.
- `appsscript.json`: manifest Apps Script.
- `gas-current/`: snapshot read-only, non modificare.
- `.gas/`: cartella locale generata da `npm run sync`, ignorata da Git.
- `.clasp.json`: configurazione locale, ignorata da Git.
- `docs/PROJECT_STATE.md`: stato reale del progetto.
- `docs/AI_RULES.md`: regole permanenti per AI/Cursor.
- `docs/WORKFLOW.md`: workflow orchestratore/implementatore.
- `docs/COMMANDS.md`: comandi standard.

## Regole fondamentali

- Non inventare lo stato: controllare GitHub, Git e documenti.
- Orchestratore: legge GitHub e fa il punto quando l'utente scrive `aggio`.
- Per `aggio`, leggere prima `docs/ORCHESTRATOR_RULES.md`.
- Implementatore: Cursor/Agent esegue modifiche, controlli, commit e push.
- Lavorare su **`main`** per tutti i nuovi sviluppi.
- Non pianificare merge `dev` → `main` nel flusso normale.
- Non modificare `gas-current/`.
- Non fare deploy Apps Script senza conferma esplicita.
- Non usare `git add .` salvo autorizzazione esplicita.
- Preferire commit piccoli e selettivi.
- Separare sempre piano, implementazione, test e riepilogo.
- L'implementatore deve aggiornare GitHub a fine blocco anche se l'utente non scrive esplicitamente `finito`.

## Comandi rapidi per Cursor

Allineamento con GitHub e stato locale:

```bash
git pull
git status
git branch --show-current
git log --oneline -5
npm run aggio
```

Push Apps Script senza deploy:

```bash
npm run push
```

Deploy solo con conferma:

```bash
npm run deploy
```

Checkpoint/chiusura blocco:

```bash
npm run checkpoint
npm run finito -- "Messaggio commit" file1 file2
```

## Rischi aperti

- Nessun rischio bloccante post-test **V1.9.1** / **`@23`**. Evoluzione **Dettaglio mese** più grafico — backlog (`docs/roadmap.md`).

## Prossimo passo raccomandato

**Workstream attivo obbligatorio: automazione watcher/runner.** Non proporre ritorno all'app Alina finché watcher/runner non è chiuso o finché l'utente non chiede esplicitamente di tornare all'app.

1. Prossimo passo operativo: progettare MVP n8n (watcher) + runner documentale su VPS, allineato a `docs/automation/runbook.md` e `docs/automation/permissions.md`.
2. Lavoro su **`main`**: `git checkout main`, `git pull origin main`.
