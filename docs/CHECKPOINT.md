# Alina Lavoro - Checkpoint

Questo file serve per ripartire rapidamente in una nuova chat AI senza perdere contesto.

## Contesto sintetico

Progetto: Alina Lavoro.

App personale per registrazione ore di lavoro, turni, stipendi e note di Alina.

Stack:
- Google Apps Script come backend.
- Google Sheet come database.
- HTML/CSS/JavaScript come frontend.
- GitHub per versionamento.
- Cursor come ambiente operativo.
- `clasp` per sincronizzare il codice con Apps Script.

## Repository

- Repository: `mrhz1973/alina-lavoro`.
- Branch operativo: `dev`.
- Branch stabile: `main`.
- Tag rollback: `v1.5-stable`.

## Struttura importante

- `src/backend/Code.gs`: backend reale da modificare.
- `src/frontend/Index.html`: frontend reale da modificare.
- `appsscript.json`: manifest.
- `gas-current/`: snapshot read-only, non modificare.
- `.gas/`: cartella locale generata da `npm run sync`, ignorata da Git.
- `.clasp.json`: configurazione locale, ignorata da Git.

## Stato ultimo noto

- V1.5 stabile e taggata come `v1.5-stable`.
- V1.6, V1.6.1 e V1.6.2 sono su `dev`.
- V1.6.2 corregge il viewport mobile in Apps Script tramite `HtmlService.addMetaTag` e fallback CSS portrait.
- V1.6.2 e stata caricata in Apps Script con `npm run push`.
- Il deployment ufficiale V1.6.2 e stato aggiornato dall'utente.
- Layout mobile su URL di test: confermato corretto.
- Verificare/registrare sempre se il test finale su URL ufficiale `/exec` e stato completato.

## Regole fondamentali

- Non inventare lo stato: controllare Git, GitHub e documenti.
- Prima di modifiche: `git status`.
- Non modificare `gas-current/`.
- Non fare deploy senza conferma esplicita.
- Non usare `git add .` salvo autorizzazione esplicita.
- Preferire commit piccoli e selettivi.
- Separare sempre piano, implementazione, test e riepilogo.

## Comandi rapidi

Stato:

```bash
git status
git branch --show-current
git log --oneline -5
```

Push Apps Script senza deploy:

```bash
npm run push
```

Deploy solo con conferma:

```bash
npm run deploy
```

## Prossimo passo raccomandato

Usare `aggio` per ricostruire lo stato reale, oppure `finito` per chiudere una sessione aggiornando documenti, commit e push.