# V1.8A — test manuale OK

Data: 2026-05-02

## Esito utente

L'utente ha comunicato: `test V1.8A ok`.

## Contesto test

- Branch Git: `dev`.
- Versione: `1.8.0-a.1`.
- V1.8A caricata su Google Apps Script / HEAD tramite `npm run push`.
- Nessun deploy ufficiale V1.8A eseguito.
- Nessun merge `dev -> main` eseguito.
- Nessun tag V1.8A creato.
- Produzione ufficiale ancora: `main` / `v1.6.2-stable`.

## Interpretazione operativa

Il gate manuale V1.8A viene considerato superato.

La V1.8A puo passare alla fase di stabilizzazione, ma servono ancora autorizzazioni esplicite separate per:

1. deploy ufficiale Apps Script;
2. merge `dev -> main`;
3. eventuale tag stabile V1.8.

## Nota futura

L'utente ha chiesto di mostrare la versione nell'interfaccia dell'app; richiesta tracciata in issue GitHub #3.
