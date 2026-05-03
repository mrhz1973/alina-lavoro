# Alina Lavoro — Checkpoint (ripartenza)

Ultimo aggiornamento: 2026-05-03 — workflow **main-only** adottato (`docs/sessions/2026-05-03-main-only-workflow.md`). Produzione: **V1.8.1**, deploy **`@9`**, tag **`v1.8.1-stable`**.

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
- Tag stabile **V1.8.1:** **`v1.8.1-stable`** (release corrente su `main`).
- Tag stabile V1.8.0: **`v1.8.0-stable`**.
- GitHub e fonte di verita per l'orchestratore.

## Stato stabile corrente

- **V1.8.1** è la versione stabile corrente su **`main`**; tag Git **`v1.8.1-stable`**; issue **#3** (versione in Impostazioni) in produzione.
- **`dev`** (legacy): tenuto eventualmente **identico** a `main` per storia; **non** è branch di lavoro.
- V1.8A / V1.8.0: tag **`v1.8.0-stable`**, deploy storico **@8** (sessioni 2026-05-02).
- V1.6.2 resta riproducibile tramite tag **`v1.6.2-stable`**.
- V1.5 resta rollback storico tramite tag **`v1.5-stable`**.

## Stato Apps Script / deploy

- **Deploy finale di stabilizzazione V1.6.2:** documentato (deployment clasp `@6` in output locale dell’epoca).
- **V1.8A:** deployment storico clasp **`@8`** — `docs/sessions/2026-05-02-v18a-deploy-ufficiale-eseguito.md`.
- **V1.8.1:** deployment ufficiale clasp **`@9`** — ID e URL in `docs/sessions/2026-05-03-v181-versione-ui-release.md`.
- **Git `main`:** codice **V1.8.1**, tag **`v1.8.1-stable`**.
- **`gas-current/`:** snapshot aggiornato al codice deploy **@9** (coerente con `src`); non è area di sviluppo.

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

- Pagina Mesi: dopo V1.8A restano possibili ottimizzazioni future (virtualizzazione, meno re-render), ma non sono bloccanti se il test manuale resta OK.
- Verificare il comportamento reale su Android vecchio quando disponibile, se non gia incluso nel test manuale.

## Prossimo passo raccomandato

1. Verifica manuale URL `/exec` del deployment **@9** e riga versione **1.8.1** in Impostazioni.
2. Nuovi sviluppi: `git checkout main`, `git pull origin main`, roadmap V1.8B o micro-step su **`main`**.
