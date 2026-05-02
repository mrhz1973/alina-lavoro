# Alina Lavoro — Checkpoint (ripartenza)

Ultimo aggiornamento: 2026-05-02 — stabilizzazione finale V1.6.2 (deploy clasp + tag `v1.6.2-stable`).

Questo file serve per ripartire rapidamente in una nuova chat AI senza perdere contesto.

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
- Tag stabile V1.6.2: `v1.6.2-stable` (commit di documentazione/deploy su `main`).
- GitHub e fonte di verita per l'orchestratore.

## Stato stabile corrente

- V1.6.2 e la versione stabile corrente su `main`.
- V1.6.2 e stata validata dall'utente con test dichiarato perfetto.
- Merge controllato `dev -> main` eseguito tramite PR GitHub #1.
- Nota documentale post-merge allineata su `main` tramite PR GitHub #2.
- Dopo il merge, `dev` resta il branch operativo per i prossimi sviluppi.
- V1.5 resta disponibile come rollback storico tramite tag `v1.5-stable`.

## Stato Apps Script / deploy

- **Deploy finale di stabilizzazione:** eseguito con `npm run deploy` su `main` (2026-05-02), dopo autorizzazione esplicita utente; `clasp push` + `clasp deploy` completati (revisione deployment segnalata da clasp come `@6` in output locale).
- V1.6.2 era gia stata validata in precedenza su URL di test e `/exec` dall'utente.
- `gas-current/` non è stato modificato (solo lettura, come da regole).

## Struttura importante

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

- La pagina Mesi usa ancora rendering `innerHTML` completo: se resta lenta, trattare in V1.8 con strategia rendering diversa.
- Verificare il comportamento reale su Android vecchio quando disponibile, se non gia incluso nel test utente dichiarato perfetto.

## Prossimo passo raccomandato

1. Allineare `dev` a `main` se non gia allineato dopo questa stabilizzazione.
2. Usare `dev` per i prossimi sviluppi; riferimento release: tag `v1.6.2-stable`.
3. Se la pagina Mesi resta lenta su dispositivi vecchi, trattare il rendering in V1.8.
