# Alina Lavoro — Checkpoint (ripartenza)

Ultimo aggiornamento: 2026-05-03 — release Git **V1.8.0** chiusa: merge `dev` → `main`, tag **`v1.8.0-stable`**, `dev` allineato; deploy Apps Script **@8**; snapshot `gas-current/` aggiornato.

Questo file serve per ripartire rapidamente in una nuova chat AI senza perdere contesto.

## Regola prioritaria per nuove chat

Prima di ricostruire lo stato del progetto, leggere `docs/ORCHESTRATOR_RULES.md`.

Quel file definisce:
- ordine di lettura dopo `aggio`;
- ruoli ChatGPT/Cursor/GitHub;
- regola anti-copia/incolla manuale quando GitHub e aggiornato;
- obbligo di usare `docs/COMMANDS.md` per i controlli frontend standard;
- vincoli permanenti come `dev`, niente `gas-current/`, niente `git add .`, deploy solo su conferma.

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
- Branch operativo per nuovi sviluppi: `dev`.
- Branch stabile: `main`.
- Tag rollback storico: `v1.5-stable`.
- Tag stabile V1.6.2: `v1.6.2-stable`.
- Tag stabile **V1.8.0:** **`v1.8.0-stable`** (release corrente su `main`).
- GitHub e fonte di verita per l'orchestratore.

## Stato stabile corrente

- **V1.8.0** è la versione stabile corrente su **`main`** (merge `dev` → `main` fast-forward, 2026-05-03); tag Git **`v1.8.0-stable`**.
- **`dev`** è allineato a **`main`** (stesso commit).
- V1.8A (Mesi via DOM): validazione tecnica e test manuale OK; deploy **@8** documentato nelle sessioni 2026-05-02.
- V1.6.2 resta riproducibile tramite tag **`v1.6.2-stable`**.
- V1.5 resta rollback storico tramite tag **`v1.5-stable`**.

## Stato Apps Script / deploy

- **Deploy finale di stabilizzazione V1.6.2:** documentato (deployment clasp `@6` in output locale dell’epoca).
- **V1.8A:** deployment ufficiale clasp **`@8`** — ID e URL in `docs/sessions/2026-05-02-v18a-deploy-ufficiale-eseguito.md`.
- **Git `main`:** codice **V1.8.0**, tag **`v1.8.0-stable`**.
- **`gas-current/`:** snapshot aggiornato al codice V1.8.0 in chiusura release (coerente con `src` / deploy @8); non è area di sviluppo.

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
- Lavorare su `dev` per nuovi sviluppi salvo istruzione esplicita diversa.
- Prima di nuovi sviluppi, assicurarsi che `dev` sia allineato a `main`.
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

1. Nuovi sviluppi: `git checkout dev`, `git pull`, poi feature/issue (es. #3 versione visibile).
2. Verifica occasionale URL `/exec` e deployment **@8** in console Apps Script se serve audit.
