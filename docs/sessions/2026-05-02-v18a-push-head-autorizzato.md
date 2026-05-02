# V1.8A — autorizzazione push Apps Script HEAD

Data: 2026-05-02

## Autorizzazione utente

L'utente ha autorizzato esplicitamente Cursor a eseguire:

```bash
npm run push
```

sul branch `dev`, per caricare la V1.8A su Google Apps Script / HEAD e rendere possibile il gate di validazione manuale.

## Limiti dell'autorizzazione

Autorizzato:

- `npm run push` su `dev`.
- Caricamento codice V1.8A su Apps Script / HEAD.
- Nessun deploy ufficiale.

Non autorizzato:

- `npm run deploy`.
- Merge `dev -> main`.
- Creazione tag.
- Modifica `gas-current/`.
- Modifiche funzionali non richieste.

## Obiettivo operativo

Rendere testabile la V1.8A su ambiente Apps Script / URL test o HEAD, per permettere la validazione manuale utente/Alina.

La validazione tecnica V1.8A e gia chiusa e documentata in:

- `docs/sessions/2026-05-02-v18a-validazione-tecnica-chiusa.md`

L'allineamento Apps Script precedente ha confermato che il remoto era ancora V1.6.2 e non V1.8A:

- `docs/sessions/2026-05-02-v18a-apps-script-allineamento.md`

## Prossimo passo atteso da Cursor

Cursor deve:

1. sincronizzarsi su `dev`;
2. verificare stato pulito;
3. eseguire `npm run push`;
4. non eseguire `npm run deploy`;
5. documentare l'esito su GitHub;
6. chiudere il blocco con commit selettivo e push, secondo `docs/WORKFLOW.md` e `docs/AI_RULES.md`.
