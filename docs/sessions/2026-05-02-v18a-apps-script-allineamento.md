# V1.8A — Apps Script / URL test vs codice su `dev`

**Data:** 2026-05-02  
**Branch Git:** `dev` (`package.json` **1.8.0-a.1**)  
**Nessun** deploy ufficiale, **nessun** merge, **nessun** tag eseguiti in questa attività.

## Ambiente Google Apps Script

- Progetto collegato in locale tramite `.clasp.json` (`rootDir`: `.gas/`).
- `npx clasp deployments` (solo lettura) ha elencato **3 deployment**, tra cui:
  - uno su **`@HEAD`** (seguono l’ultima versione salvata dell’editor Apps Script);
  - deployment numerati (es. `@6` documentato in sessioni precedenti per V1.6.2).

Esiste quindi un **Web App / URL di test** collegato al progetto; l’URL esatto va copiato da **Apps Script → Implementa → Gestisci implementazioni** (o dall’output `clasp deployments` sulla macchina autorizzata).

## Allineamento a V1.8A (verifica tecnica locale)

- Eseguito **`clasp pull`** nella cartella `.gas/` (gitignored), **senza** `clasp push` / `npm run deploy`.
- Il file **`Index.html` scaricato dal server** contiene ancora il commento **V1.6.2** e `renderMonths()` con **un solo `innerHTML`** per la lista mesi (nessun `buildMonthsListSection_`).
- **Conclusione:** il progetto Apps Script remoto **non è allineato** al codice V1.8A presente in **`src/frontend/Index.html`** su `dev`.

Dopo la verifica, `.gas/` è stato **ripristinato** con `npm run sync` da `src/` (e rimosso un `Code.js` residuo del pull, non usato dal flusso `npm run sync` del repo).

## Cosa serve per il gate di validazione manuale Alina

1. **Autorizzazione esplicita** a caricare il codice beta (almeno **`npm run push`** = `sync` + `clasp push`), **senza** obbligo di `npm run deploy` sull’implementazione ufficiale `@6`.
2. Dopo il push, l’implementazione **`@HEAD`** (o l’URL di test che punta all’ultima versione) servirà il codice aggiornato; Alina può eseguire i test su quell’URL.
3. Fino al push: il test manuale sulla **V1.8A** non può essere eseguito sull’hosting Google contro il solo stato GitHub.

## Riferimenti

- Regole deploy: `docs/AI_RULES.md`, `docs/WORKFLOW.md`, `docs/ORCHESTRATOR_RULES.md`.
