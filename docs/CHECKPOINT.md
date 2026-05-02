# Alina Lavoro — Checkpoint (ripartenza)

Ultimo aggiornamento: 2026-05-02.

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
- Branch operativo: `dev`.
- Branch stabile: `main`.
- Tag rollback: `v1.5-stable`.
- GitHub e fonte di verita per l'orchestratore.

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

## Stato ultimo noto

- V1.5 stabile e taggata come `v1.5-stable`.
- V1.6, V1.6.1 e V1.6.2 sono su `dev`.
- V1.6.2 corregge il viewport mobile in Apps Script tramite `HtmlService.addMetaTag` e fallback CSS portrait.
- V1.6.2 e stata caricata in Apps Script con `npm run push`.
- Il deployment ufficiale V1.6.2 e stato aggiornato dall'utente.
- Layout mobile su URL di test: confermato corretto.
- Layout mobile su URL ufficiale `/exec`: confermato OK dall'utente.
- Workflow orchestratore/implementatore formalizzato: Cursor deve aggiornare GitHub a fine blocco o sessione.

## Regole fondamentali

- Non inventare lo stato: controllare GitHub, Git e documenti.
- Orchestratore: legge GitHub e fa il punto quando l'utente scrive `aggio`.
- Implementatore: Cursor/Agent esegue modifiche, controlli, commit e push.
- Non modificare `gas-current/`.
- Non fare deploy senza conferma esplicita.
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

## Prossimo passo raccomandato

1. Usare `aggio` nell'orchestratore per ricostruire lo stato da GitHub.
2. Lasciare V1.6.2 in osservazione.
3. Valutare merge `dev -> main` solo quando V1.6.2 e considerata stabile.
4. Se la pagina Mesi resta lenta su dispositivi vecchi, trattare il rendering in V1.8.