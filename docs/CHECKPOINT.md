# Alina Lavoro — Checkpoint (ripartenza)

Ultimo aggiornamento: 2026-05-10 — produzione **V1.8.6** (fix **Mesi** mobile griglia + **navbar**); `APP_VERSION` **1.8.6**; Apps Script **clasp `@17`** — ID `AKfycbwLxc6ilqVnKxP5G7OZ0sY7AOXQVKQDeteDqNs2gJN0WygQOmPSKhr0iXiCBdwolu90IQ`; tag **`v1.8.6-stable`**. Deploy Windows — `docs/sessions/2026-05-10-v186-months-mobile-grid-navbar-fix-deploy.md` (Git Bash se `npm run sync` fallisce su `cmd`). **Rollback immediato:** **`v1.8.5-stable`** / **`@15`**. **Test manuale utente su `/exec` @17: OK**. Workflow **main-only**; **`aggio:win`** per Windows senza bash (`docs/COMMANDS.md`).

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

## Repository

- Repository: `mrhz1973/alina-lavoro`.
- Branch operativo unico: **`main`** (sviluppi, fix, documentazione, release).
- Branch **`dev`:** **legacy/inattivo** (non usato per nuovi lavori; può restare sul remoto).
- Tag rollback storico: `v1.5-stable`.
- Tag stabile V1.6.2: `v1.6.2-stable`.
- Tag stabile **V1.8.6:** **`v1.8.6-stable`** (release corrente su `main`).
- Tag stabile **V1.8.5:** **`v1.8.5-stable`** (rollback deploy **`@15`** — bug Mesi/navbar).
- Tag stabile **V1.8.4:** **`v1.8.4-stable`** (rollback deploy **`@14`**).
- Tag stabile **V1.8.3:** **`v1.8.3-stable`** (rollback deploy **`@12`**).
- Tag stabile **V1.8.2:** **`v1.8.2-stable`** (rollback deploy **`@10`**).
- Tag stabile **V1.8.1:** **`v1.8.1-stable`** (deploy storico **@9**).
- Tag stabile V1.8.0: **`v1.8.0-stable`**.
- GitHub e fonte di verita per l'orchestratore.

## Stato stabile corrente

- **V1.8.6** è la versione stabile corrente su **`main`**; tag **`v1.8.6-stable`**; Apps Script **`@17`**; fix **Mesi** mobile (griglia + navbar/stacking); include ancora V1.8.5 (compattezza righe), V1.8.4 (**`dismissSalaryReminder`**), V1.8B (**`fc9ac43`**), issue **#5** e **#3**.
- **Test manuale utente su `/exec` @17: OK** — versione **1.8.6**; **Mesi** ok; resto dell’app come previsto; evoluzione futura desiderata: **Mesi per anno** (vedi `docs/roadmap.md`).
- **Rollback immediato precedente:** **`v1.8.5-stable`** / deploy **`@15`** — `AKfycbwCCxFZUQUjp8RslSt4jPMnxS1vOM7JORGkvaEn20YdSlEzoB-WnETsiR_b2RYKZ8vc9Q`.
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
- **V1.8.6:** deployment ufficiale clasp **`@17`** — ID `AKfycbwLxc6ilqVnKxP5G7OZ0sY7AOXQVKQDeteDqNs2gJN0WygQOmPSKhr0iXiCBdwolu90IQ` — `docs/sessions/2026-05-10-v186-months-mobile-grid-navbar-fix-deploy.md`.
- **V1.8.5:** deployment ufficiale clasp **`@15`** — ID `AKfycbwCCxFZUQUjp8RslSt4jPMnxS1vOM7JORGkvaEn20YdSlEzoB-WnETsiR_b2RYKZ8vc9Q` — `docs/sessions/2026-05-10-v185-months-mobile-compact-deploy.md`.
- **V1.8.4:** deployment ufficiale clasp **`@14`** — ID `AKfycbx-PVHZvRait-KwBfLzc6pWfuMltRN9s0WiJMZN9p71hoK32Bmw9N62ICQod8JIAJVV4Q`; deploy **`@13`** intermedio — `docs/sessions/2026-05-10-v184-fix-salary-reminder-later-deploy.md`.
- **Git `main`:** codice **V1.8.6**, tag **`v1.8.6-stable`**.
- **`gas-current/`:** snapshot codice **V1.8.6**; non è area di sviluppo.

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

- Pagina Mesi: ottimizzazioni future (virtualizzazione); **idea utente:** raggruppare **per anno** (schede/sezioni) — in roadmap.
- Verificare il comportamento reale su Android vecchio quando disponibile, se non gia incluso nel test manuale.

## Prossimo passo raccomandato

1. Nuovi sviluppi su **`main`**: `git checkout main`, `git pull origin main`; eventuale **Mesi per anno** come micro-step pianificato (`docs/roadmap.md`).
