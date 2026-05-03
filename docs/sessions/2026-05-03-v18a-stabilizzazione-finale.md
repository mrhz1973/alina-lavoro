# V1.8A / V1.8.0 — stabilizzazione finale Git e snapshot

**Data:** 2026-05-03  
**Workflow:** `docs/STREAMLINED_WORKFLOW.md`

## Contesto

- Deploy Apps Script ufficiale **@8** già eseguito il 2026-05-02 (`docs/sessions/2026-05-02-v18a-deploy-ufficiale-eseguito.md`).
- Validazione tecnica e test manuale utente OK.

## Azioni eseguite

1. Merge controllato **`main` ← `dev`** (fast-forward), senza nuove modifiche funzionali.
2. Commit di chiusura release: documentazione (`PROJECT_STATE`, `CHECKPOINT`, `roadmap`), `package.json` → **1.8.0**, correzione terminologia **4 tab** navigazione inferiore nei documenti pertinenti, aggiornamento sessioni deploy.
3. Tag annotato Git **`v1.8.0-stable`** sul commit di chiusura.
4. Allineamento **`dev` ← `main`** (fast-forward) e push di `main`, `dev`, tag.
5. **`gas-current/`:** copia da sorgenti autoritative (`src/backend/Code.gs` → `gas-current/Codice.js`, `src/frontend/Index.html`, `appsscript.json`) come snapshot coerente con codice V1.8.0 e deployment **@8**.

## Deploy Apps Script

Invariato rispetto al blocco deploy: produzione resta **@8**; nessun nuovo `npm run deploy` richiesto per questa chiusura Git.

## Prossimo passo

Sviluppo successivo su branch **`dev`** dopo `git pull` (es. issue #3 versione visibile in app).
