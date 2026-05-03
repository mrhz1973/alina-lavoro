# V1.8A — autorizzazione deploy ufficiale Apps Script

Data: 2026-05-02

## Autorizzazione utente

L'utente ha autorizzato esplicitamente il deploy ufficiale Apps Script della V1.8A.

## Stato prima del deploy

- Branch operativo: `dev`.
- Versione sviluppo: `1.8.0-a.1`.
- V1.8A validata tecnicamente.
- `npm run push` gia eseguito su Apps Script / HEAD.
- Test manuale utente V1.8A comunicato come OK.
- Produzione ufficiale ancora: `main` / `v1.6.2-stable`.

## Limiti dell'autorizzazione

Autorizzato:

- deploy ufficiale Apps Script V1.8A tramite `npm run deploy`.
- aggiornamento documentale post-deploy su `dev`.

Non autorizzato automaticamente:

- merge `dev -> main`.
- creazione tag stabile V1.8.
- modifiche funzionali non richieste.
- modifica `gas-current/`.

## Requisiti UI da preservare

- Pagina Mesi: card/righe devono occupare tutto lo spazio orizzontale disponibile, senza zone vuote laterali o colonne morte.
- Durante lo scroll lista Mesi, i **4** tab/pulsanti inferiori di navigazione (Home, Mesi, Note, Imp.) devono restare sempre visibili, fissi, attivi e cliccabili.

## Prossimo passo atteso da Cursor

Cursor deve:

1. sincronizzarsi su `dev`;
2. verificare stato pulito;
3. eseguire i controlli pertinenti;
4. eseguire `npm run deploy`;
5. documentare esito deploy su GitHub;
6. non fare merge e non creare tag;
7. chiudere il blocco con commit selettivo e push secondo `docs/WORKFLOW.md` e `docs/AI_RULES.md`.
