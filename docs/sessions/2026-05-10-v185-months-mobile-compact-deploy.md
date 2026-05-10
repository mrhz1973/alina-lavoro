# Release **V1.8.5** — righe Mesi più compatte su mobile — deploy Apps Script

**Data:** 2026-05-10

## Contenuto release

- Solo **CSS** in [`src/frontend/Index.html`](../../src/frontend/Index.html): nel blocco `@media (max-width: 899px)`, override mirati per **`.list-item--month`** (padding, gap interno, font-size titolo/sottotitolo/meta, pulsante stipendio leggermente più compatto). Nessuna modifica alla logica **`renderMonths`** / firma V1.8B.
- Bump **`package.json`** / **`APP_VERSION`** → **1.8.5**.
- Backend: invariato.

## Deploy Windows

Su alcune installazioni Windows il comando npm **`sync`** (`mkdir -p` / `cp` via `cmd`) può fallire. Questo deploy è stato eseguito da **Git Bash** con:

```bash
mkdir -p .gas && cp src/backend/Code.gs .gas/Code.gs && cp src/frontend/Index.html .gas/Index.html && cp appsscript.json .gas/appsscript.json && npx clasp push && npx clasp deploy
```

Equivalente funzionale a `npm run deploy` quando la shell Unix è disponibile (vedi anche [`docs/COMMANDS.md`](../COMMANDS.md)).

## Esito clasp

| Step | Note |
|------|------|
| Push + deploy **`@15`** | ID `AKfycbwCCxFZUQUjp8RslSt4jPMnxS1vOM7JORGkvaEn20YdSlEzoB-WnETsiR_b2RYKZ8vc9Q` — **produzione documentata** (`APP_VERSION` **1.8.5**) |

## Rollback immediato precedente

- **V1.8.4 / `@14`:** `AKfycbx-PVHZvRait-KwBfLzc6pWfuMltRN9s0WiJMZN9p71hoK32Bmw9N62ICQod8JIAJVV4Q` — tag **`v1.8.4-stable`**.

## Tag Git

- **`v1.8.5-stable`** sul commit di release (bump + doc + snapshot **`gas-current/`**).

## Snapshot `gas-current/`

Allineato a **V1.8.5** post-deploy (`Index.html`, `Codice.js`, `appsscript.json`).

## Test manuale

**Da fare** su **`/exec`** del deployment **`@15`**:

- Impostazioni: versione **1.8.5**;
- Pagina **Mesi** su viewport mobile: righe/card più compatte ma **leggibili**; larghezza piena righe; navbar inferiore **fissa e cliccabile**;
- Smoke **Home** / navigazione;
- **Inizio/Fine** (issue **#5**) invariati nel comportamento.
