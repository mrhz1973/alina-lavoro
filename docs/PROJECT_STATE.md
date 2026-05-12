# Alina Lavoro - Project State

Ultimo aggiornamento: 2026-05-12 — **Opzione A investigata (2026-05-12):** nessuna leva UI sicura per rendere pubblicabile il queue reader come sub-workflow — impostazioni workflow non espongono voce equivalente; campo Source del nodo Execute Workflow mostra solo `Database` e `Define Below`; `Define Below` scartato (duplicazione, drift, export JSON). Opzione A chiusa con esito negativo. **Task 0115 creato** (tipo `n8n-runtime-activation`): Opzione B controllata — Schedule Trigger direttamente nel queue reader `TEST - GitHub list Alina task queue`, ogni 5 minuti, mantenendo Manual Trigger e "When Executed by Another Workflow"; gate manuale obbligatorio prima di qualsiasi modifica runtime. Precedente: **Task 0114** **bloccato** (tipo `n8n-runtime-activation`, 2026-05-12): Schedule Trigger aggiunto al watcher (5 min, Europe/Berlin), Manual Trigger invariato, test manuale tutto verde; pubblicazione watcher fallita — n8n richiede che il sub-workflow (queue reader) sia pubblicato prima, ma il queue reader non è pubblicabile ("This workflow has no trigger nodes that require publishing"); deadlock UI; opzioni A/B/C da scegliere con orchestratore prima di procedere; nessun polling attivo; nessun runner automatico; nessuna modifica app; sessione: `docs/sessions/2026-05-12-n8n-watcher-schedule-trigger-publish-blocked.md`. Precedente: **Task 0113** **completato** (tipo `n8n-runtime-prerequisite`, 2026-05-12): prerequisito B1 validato — trigger "When Executed by Another Workflow" aggiunto al queue reader `TEST - GitHub list Alina task queue` come secondo trigger (collegato a `List files`, `Accept all data`); Manual Trigger invariato; watcher `Alina watcher - Schedule queue reader` configurato con Manual Trigger → Execute Workflow puntato al queue reader; test manuale tutto verde; nessun Schedule Trigger aggiunto; watcher non pubblicato/attivato come polling; nessun runner automatico; nessuna modifica app; sessione: `docs/sessions/2026-05-12-n8n-queue-reader-subworkflow-trigger-validation.md`. Precedente: **Task 0112** **completato** (tipo `n8n-watcher-design`, 2026-05-12): design Schedule Trigger watcher in `docs/automation/n8n-watcher-schedule-trigger-design.md`; **opzione B scelta** (workflow watcher separato — queue reader non modificato); Schedule Trigger ogni 5 min, fuso `Europe/Berlin`; overlap mitigato da skip `processing/`; has_task:false silenzioso; has_task:true genera prompt+sessione, runner NON automatico; runner fuori scope (→ task 0113); gate manuale obbligatorio prima di implementazione runtime; allineamento runbook Fase 2, permissions.md e design MVP 0111; nessuna modifica runtime/app; sessione: `docs/sessions/2026-05-12-n8n-watcher-schedule-trigger-design.md`. Precedente: produzione **V1.9.2** (**Dettaglio mese** più **visivo**: riepilogo **metriche** in alto, **card** giorno più leggibili, **barre proporzionali** ore vs giorno più lungo del mese; solo frontend **`src/frontend/Index.html`**; nessun backend/Sheet; eredità **V1.9.1** lista **Mesi** — **«Stipendio»** nascosto sul **mese corrente**; **V1.9.0** MVP Dettaglio mese) su **`main`**; Apps Script deployment **`@24`**; tag **`v1.9.2-stable`**. Deploy **Windows:** **Git Bash** + `npx clasp …` se `npm run deploy` fallisce su **cmd**. **Rollback immediato:** **`v1.9.1-stable`** / **`@23`** (`AKfycbxvuOGtltO32umfM4XgfL1nWTbmzWZ7mnl4f6tsFkkT5yj0qF6OXdBY9tHTDXpUj3WsRg`). **Test manuale utente su `/exec` @24:** **OK** (2026-05-10): versione **1.9.2**; Dettaglio mese layout visivo (metriche, card giorno, barre proporzionali); **Indietro** OK; **Stipendio** assente sul mese corrente e presente sui precedenti; smoke Home / Note / Impostazioni OK; incluso **Xiaomi Redmi 9C NFC**. Sessione: `docs/sessions/2026-05-10-v192-month-detail-visual-refresh-deploy.md`; **V1.9.1** test **OK** su `@23` — `docs/sessions/2026-05-10-v191-hide-current-month-salary-button-deploy.md`. **Limitazione nota UI:** banner Google Apps Script — **esterno** all’app. Workflow **main-only**.

## Stato reale

- **Branch operativo unico `main`:** release codice **V1.9.2** (`package.json` **1.9.2**, `APP_VERSION` **1.9.2** in Impostazioni). Tutti i nuovi sviluppi partono da qui.
- **Branch `dev`:** **legacy/inattivo** (non usato per lavoro corrente; può restare sul remoto e restare allineato a `main` senza ruolo operativo).
- **Tag Git stabili:** **`v1.9.2-stable`** (release corrente codice / snapshot); **`v1.9.1-stable`** (V1.9.1 / deploy **`@23`**); **`v1.9.0-stable`** … **`v1.5-stable`** (storico).
- **Apps Script (live):** deployment **clasp `@24`** (V1.9.2) — ID: `AKfycbyIkaQqS-Dce0tfdxyfjdnEEE_xSb3Ys3KdeGL9xiX652QfgfAFRRBSvmuLXdPqQhaXSg`. Dettagli: `docs/sessions/2026-05-10-v192-month-detail-visual-refresh-deploy.md`. Rollback precedente documentato: **`@23`** (V1.9.1) — `AKfycbxvuOGtltO32umfM4XgfL1nWTbmzWZ7mnl4f6tsFkkT5yj0qF6OXdBY9tHTDXpUj3WsRg`; **`@22`** (V1.9.0) — `AKfycbyisd4Dd_8XxBU6-ZcjF6qm6K_d4x4YsIRSXCZyeBm4nNjZgfg_X34rdh_KUJ9nV2ULRA`. URL Web App **`/exec`**: allineare al deployment corrente in Apps Script.
- **Uso sul telefono (Alina):** per l’uso quotidiano va usato il link della **Web App** con suffisso **`/exec`** (deployment documentato sopra). Il link diretto al **Google Sheet** è solo **database / amministrazione** del foglio; **non** sostituisce l’interfaccia dell’app.
- **Dispositivo target reale:** **Xiaomi Redmi 9C NFC** è il riferimento hardware principale per i test su cellulare; **V1.9.2** / **`@24`**: test manuale **`/exec`** — **OK** (2026-05-10). Eventuali ottimizzazioni future su **Mesi** / **Home** / **Note** restano **evolutive**, non urgenti.
- **`gas-current/`:** snapshot allineato a **V1.9.2** (`Codice.js` ← `Code.gs`, `Index.html`, `appsscript.json`); solo lettura / tracciamento, non sorgente primaria.
- **Automazione (preparazione pilota):** cartelle **`docs/tasks/`** (queue/done/failed, template) e **`docs/automation/`** per una futura catena ChatGPT → GitHub → n8n/VPS → Cursor CLI — **solo documentazione**; **nessun impatto** sulla produzione **V1.9.2** / deploy **`@24`**. Sessione quadro: `docs/sessions/2026-05-10-automation-task-framework.md`. **n8n —** workflow **`TEST - GitHub list Alina task queue`**: skip **`done`** (oltre a `processing`) **implementato e validato** manualmente in UI n8n (2026-05-11); **stessa sessione** documenta anche il ramo **`has_task: true`** (task **0005**) e il **primo task reale docs-only 0100** (edge case metadata **tabella** vs **lista** per **Classify task**) — `docs/sessions/2026-05-11-n8n-queue-reader-skip-done-validation.md`. **Template prompt Cursor in repo:** `docs/tasks/templates/cursor-prompt-default.md` (task **0100**, 2026-05-11). **PR #7** mergiata su `main` (2026-05-11): include template e documentazione sessione n8n. **Task 0101** **completato** (tipo `n8n-docs`, commit `5f602f8`, 2026-05-11): n8n legge template dal repo; nodo `Get cursor prompt template` attivo; `Build Cursor prompt` usa contenuto decodificato — marcato done. **Task 0102** **completato** (tipo `docs-only`, commit `5b86b20` + cleanup `bca334d` + done `bfe85c3`, 2026-05-11): **primo test Claude Code runner docs-only** riuscito — sessione: `docs/sessions/2026-05-11-claude-code-runner-test-0102.md`. **n8n queue reader** non trova task eleggibili: 0101/0102 coperti da `processing/done`. **Task 0103** **completato** (tipo `docs-only`, 2026-05-11): lifecycle ownership documentato in `docs/automation/n8n-workflows/lifecycle-ownership.md` — fonte canonica per owner, condizioni e pattern done/failed; nessuna modifica app, n8n runtime, done/, failed/, deploy o tag. **Task 0105** **completato** (tipo `docs-only`, 2026-05-12): `CLAUDE.md` creato nella root — memoria progetto stabile per Claude Code; sezione `Compact Instructions`; punta ai documenti canonici senza duplicarli; nessuna modifica app, n8n runtime, deploy o tag. **Task 0106** **completato** (tipo `n8n-design`, 2026-05-12): design skip failed queue reader in `docs/automation/n8n-workflows/queue-reader-skip-failed-design.md`; documentazione lifecycle aggiornata per coerenza; nessuna modifica n8n runtime. **Task 0107** **completato** (tipo `n8n-runtime-validation`, 2026-05-12): validazione manuale n8n skip failed in `docs/sessions/2026-05-12-n8n-queue-reader-skip-failed-runtime-validation.md`; skip failed ora implementato e validato nel runtime n8n; nessun impatto su app V1.9.2. **Task 0108** **completato** (tipo `n8n-runtime-validation-planning`, 2026-05-12): ramo `has_task:true` validato dopo skip failed — n8n ha selezionato correttamente task 0108, generato prompt e sessione automation; secondo run `has_task:false` (anti-doppio-run processing confermato); sessione `docs/sessions/2026-05-12-n8n-queue-reader-has-task-true-after-skip-failed.md`; nessun impatto su app V1.9.2. **Task 0109** **completato** (tipo `vps-maintenance-planning`, 2026-05-12): VPS IONOS verificato in modalità read-only — Ubuntu 24.04.4 LTS, kernel 6.8.0-111-generic, n8n in Docker (container `root-n8n-1`, Up ~34h, porta 5678 attiva, `curl localhost:5678` HTTP 200); 4 pacchetti libheif aggiornabili non urgenti, non applicati; no reboot required; ufw inattivo; rischio futuro documentato (binding n8n su `0.0.0.0:5678` — da vincolare a `127.0.0.1` o verificare firewall provider in task separato); nessun upgrade/reboot/modifica runtime/app; sessione: `docs/sessions/2026-05-12-vps-n8n-maintenance-check.md`. **Task 0110** **completato** (tipo `vps-hardening-planning`, 2026-05-12): binding Docker n8n ristretto da `0.0.0.0:5678` a `127.0.0.1:5678` — compose file `/root/docker-compose.yaml` identificato, backup creato (`docker-compose.yaml.bak-20260512-005104`), `docker compose up -d` applicato; verifica: `docker ps` mostra `127.0.0.1:5678->5678/tcp`, `curl localhost:5678` HTTP 200, tunnel SSH OK, accesso esterno diretto non raggiungibile; warning log non critici annotati; nessun upgrade/reboot/workflow n8n/app; sessione: `docs/sessions/2026-05-12-vps-n8n-bind-localhost-hardening.md`. **Task 0104** **completato** (tipo `n8n-validation-planning`, 2026-05-12): failed stub documentale creato in `docs/tasks/failed/0104-failed-validation-stub.md` con sezione `## Failed status`; done marker in `docs/tasks/done/0104-failed-validation-stub.md`; documenti automazione aggiornati; skip failed nel queue reader non ancora validato né implementato — sessione: `docs/sessions/2026-05-12-failed-validation-stub.md`.
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
- **V1.9.2:** Dettaglio mese **metriche** + **card** + **barre ore** (solo `Index.html`); bump **1.9.2**; deploy **`@24`**; tag **`v1.9.2-stable`** — test **`/exec` @24** **OK** (2026-05-10) — `docs/sessions/2026-05-10-v192-month-detail-visual-refresh-deploy.md`.
- **V1.9.1:** **Stipendio** nascosto su **mese corrente** (lista **Mesi**); **`buildMonthsViewSig_`** include **`currentMonth()`**; bump **1.9.1**; deploy **`@23`**; tag **`v1.9.1-stable`** — test manuale **`/exec` @23** **OK** — `docs/sessions/2026-05-10-v191-hide-current-month-salary-button-deploy.md`.
- **V1.9.0:** **Dettaglio mese** MVP (lista giorni con lavoro, stime **stimato**, pagina **`monthDetail`**); bump **1.9.0**; deploy **`@22`**; tag **`v1.9.0-stable`** — test manuale **`/exec` @22** **OK** — `docs/sessions/2026-05-10-v190-month-detail-mvp-deploy.md`.
- **V1.8.10:** snooze **24 ore** promemoria stipendio (locale); bump **1.8.10**; deploy **`@21`**; tag **`v1.8.10-stable`** — `docs/sessions/2026-05-10-v1810-salary-reminder-snooze-24h-deploy.md`.

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
- **V1.9.2:** tag **`v1.9.2-stable`**; Dettaglio mese visivo (metriche, card, barre); deploy clasp **`@24`** (`AKfycbyIkaQqS-Dce0tfdxyfjdnEEE_xSb3Ys3KdeGL9xiX652QfgfAFRRBSvmuLXdPqQhaXSg`).
- **V1.9.1:** tag **`v1.9.1-stable`**; Stipendio nascosto mese corrente (**Mesi**); deploy clasp **`@23`** (`AKfycbxvuOGtltO32umfM4XgfL1nWTbmzWZ7mnl4f6tsFkkT5yj0qF6OXdBY9tHTDXpUj3WsRg`).
- **V1.9.0:** tag **`v1.9.0-stable`**; Dettaglio mese MVP lista; deploy clasp **`@22`** (`AKfycbyisd4Dd_8XxBU6-ZcjF6qm6K_d4x4YsIRSXCZyeBm4nNjZgfg_X34rdh_KUJ9nV2ULRA`).
- **V1.8.10:** tag **`v1.8.10-stable`**; snooze 24 h promemoria stipendio; deploy clasp **`@21`** (`AKfycbz0_8bE92ATlKeb2oaOrhqOwrUgyiEnw977libqBH5Swkiv2LMwdDK0EbJyo-h7Zpjw6A`).
- **V1.8.9:** tag **`v1.8.9-stable`**; fix toggle anni Mesi; deploy clasp **`@20`** (`AKfycbxxbOtZmmcflqyrToKXo_bR6MaK4pupI-fkDrGRmZsC2vSnjQajmwMNePmg26ji-XY8og`).
- **V1.8.8:** tag **`v1.8.8-stable`**; anni collassabili (bug toggle su alcuni client); deploy clasp **`@19`** (`AKfycbyzsTI8uaRJDGyiNrmm6jQRGjNyI80kE_Z4W7qwBLcbwKt6wp-coqsmlcG-cXUAJYtKlg`).

## Rischi aperti

- Mesi / Home / Note: possibili ottimizzazioni future (es. virtualizzazione lista Mesi, alleggerimento CSS) — **non urgenti**.
- Rollback: **`@23`** (V1.9.1) / tag **`v1.9.1-stable`**, **`@22`** (V1.9.0) / tag **`v1.9.0-stable`**, **`@21`** (V1.8.10) / tag **`v1.8.10-stable`**, o gestione deployment in Apps Script.

## Prossimo passo consigliato

**Workstream attivo obbligatorio: automazione watcher/runner.** Non proporre ritorno all'app Alina finché watcher/runner non è chiuso o finché l'utente non chiede esplicitamente di tornare all'app. App Alina **V1.9.2** resta stabile e non toccata.

**Task 0111** **completato** (tipo `n8n-runner-design`, 2026-05-12): documento di design MVP watcher + runner documentale in `docs/automation/n8n-watcher-runner-mvp-design.md`; trigger: polling timer n8n ogni 5 minuti; runner MVP: supervisionato/manuale (n8n genera prompt, utente/orchestratore esegue Claude Code o Cursor localmente); runner futuro: Claude Code CLI / Cursor CLI sul VPS; API LLM scartate come runner predefinito; gate manuali, scope docs-only, rischi, sequenza 0112/0113/0114; allineamento runbook Fase 2+3; nessuna modifica runtime/app; sessione: `docs/sessions/2026-05-12-n8n-watcher-runner-mvp-design.md`. **Task 0112** **completato** (tipo `n8n-watcher-design`, 2026-05-12): design Schedule Trigger watcher in `docs/automation/n8n-watcher-schedule-trigger-design.md`; opzione B (workflow separato, queue reader non toccato); Schedule Trigger 5 min / Europe/Berlin; overlap mitigato da skip processing; runner fuori scope; gate manuale prima di implementazione runtime; sessione: `docs/sessions/2026-05-12-n8n-watcher-schedule-trigger-design.md`. **Runtime discovery (2026-05-12):** verifica manuale n8n — nodo Execute Sub-workflow non trova il queue reader (manca trigger "When executed by another workflow"); opzione B resta desiderabile ma richiede task preparatorio per configurare il sub-workflow trigger sul queue reader prima dell'implementazione; design aggiornato con Sezione 10 — caveat e opzioni B1/B2/B3 documentate; nessuna modifica runtime/app. **Task 0113** **completato** (tipo `n8n-runtime-prerequisite`, 2026-05-12): prerequisito B1 validato — trigger "When Executed by Another Workflow" aggiunto al queue reader come secondo trigger; Manual Trigger invariato; watcher configurato con Execute Workflow puntato al queue reader; test manuale tutto verde; sessione: `docs/sessions/2026-05-12-n8n-queue-reader-subworkflow-trigger-validation.md`. **Task 0114** **bloccato** (tipo `n8n-runtime-activation`, 2026-05-12): Schedule Trigger aggiunto al watcher, test manuale tutto verde, ma pubblicazione bloccata — n8n richiede sub-workflow pubblicato prima del parent; queue reader non pubblicabile ("no trigger nodes that require publishing"); deadlock UI; nessun polling attivo; nessun runner automatico; sessione: `docs/sessions/2026-05-12-n8n-watcher-schedule-trigger-publish-blocked.md`.

1. Prossimo passo operativo: eseguire task 0115 — Opzione B controllata: aggiungere Schedule Trigger direttamente nel queue reader `TEST - GitHub list Alina task queue` (gate manuale, test pre-pubblicazione, primo tick has_task:false). Runner documentale automatico (Claude Code CLI / Cursor CLI) resta fuori scope e futuro.
2. Lavoro nuovo su **`main`** dopo `git pull origin main`.
