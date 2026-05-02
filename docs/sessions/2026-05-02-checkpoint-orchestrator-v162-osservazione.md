# Checkpoint orchestratore — V1.6.2 in osservazione

Data: 2026-05-02

## Contesto

Checkpoint creato dall'orchestratore dopo richiesta esplicita `checkpoint` dell'utente.

GitHub resta la fonte di verita operativa. L'orchestratore legge GitHub; Cursor/Agent resta l'implementatore operativo e deve aggiornare GitHub a fine blocco o sessione.

## Stato rilevato

- Repository: `mrhz1973/alina-lavoro`.
- Branch operativo: `dev`.
- Branch stabile: `main`.
- Tag rollback noto: `v1.5-stable`.
- `dev` risulta avanti rispetto a `main`.
- Confronto documentato: `dev` avanti di 19 commit rispetto a `main`, non indietro.
- V1.6, V1.6.1 e V1.6.2 risultano presenti su `dev`.

## Stato applicazione

- Versione corrente documentata: V1.6.2.
- V1.6.2 corregge il layout mobile tramite viewport Apps Script in `doGet()` con `HtmlService.addMetaTag` e fallback CSS portrait.
- V1.6.2 risulta caricata in Apps Script.
- Deployment ufficiale V1.6.2 aggiornato dall'utente.
- URL di test confermato OK.
- URL ufficiale `/exec` confermato OK.

## Regole operative confermate

- Lavorare su `dev` salvo istruzione esplicita diversa.
- Non modificare `gas-current/`.
- Non usare `git add .`.
- Non fare deploy Apps Script senza conferma esplicita.
- Merge `dev -> main` solo su richiesta esplicita.
- Cursor deve concludere ogni blocco operativo con documentazione se necessaria, commit selettivo e push.

## Rischi aperti

- Pagina Mesi ancora basata su rendering `innerHTML` completo: se resta lenta, trattare in V1.8 con rendering piu leggero.
- Verifica su Android vecchio reale ancora da fare quando disponibile.
- Merge `dev -> main` da valutare solo dopo ulteriore stabilita della V1.6.2.

## Prossimo passo consigliato

- Lasciare V1.6.2 in osservazione.
- Se i test reali restano OK, preparare un blocco di stabilizzazione e possibile merge `dev -> main` solo dopo conferma dell'utente.
- Se emergono lentezze nella pagina Mesi, aprire blocco V1.8 dedicato al rendering leggero.
