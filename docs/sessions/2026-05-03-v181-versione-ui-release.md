# V1.8.1 — micro-release: versione visibile in produzione (issue #3)

**Data:** 2026-05-03  
**Workflow:** `docs/STREAMLINED_WORKFLOW.md`

## Contesto

- Issue **#3** (versione in UI) già implementata su `dev`; issue chiusa come completed su GitHub.
- Obiettivo: portare il micro-step su **`main`**, **deploy ufficiale** Apps Script, tag **`v1.8.1-stable`**, snapshot **`gas-current/`** allineato al codice deployato.

## Versione

- `package.json`: **1.8.1**
- `src/frontend/Index.html`: **`APP_VERSION = '1.8.1'`** (Impostazioni, sotto «Salva»).

## Git

- Merge **`dev` → `main`** (fast-forward), inclusi commit issue #3 e bump `1.8.1`.
- Dopo deploy e doc: commit di release su `main` (documentazione + `gas-current/`).
- Tag annotato: **`v1.8.1-stable`** sul commit di release documentale.
- **`dev`** riallineato a **`main`** (fast-forward) e push.

## Deploy Apps Script

Comando: `npm run deploy` (da `main`, dopo merge).

Output clasp (rilevante):

- Push: **3 file** (`.gas/appsscript.json`, `.gas/Code.gs`, `.gas/Index.html`).
- Deploy: **`Deployed AKfycbyz-AH2fGmW3BeT1r4md3CaGfKw0KYoAJ22wOZ2t1-WDNjmkSJdCpjov-T_9NcZ9LFoiA @9`**
- **Deployment ID:** `AKfycbyz-AH2fGmW3BeT1r4md3CaGfKw0KYoAJ22wOZ2t1-WDNjmkSJdCpjov-T_9NcZ9LFoiA`
- **Revisione clasp:** **`@9`**
- **URL Web App (pattern standard):**  
  `https://script.google.com/macros/s/AKfycbyz-AH2fGmW3BeT1r4md3CaGfKw0KYoAJ22wOZ2t1-WDNjmkSJdCpjov-T_9NcZ9LFoiA/exec`

## Snapshot `gas-current/`

Aggiornato **dopo** il deploy, copiando da sorgenti autoritative (`cp` da `src/` / radice). Nel commit di release risulta diff solo su **`gas-current/Index.html`** (frontend con `APP_VERSION` 1.8.1); **`Codice.js`** e **`appsscript.json`** erano già identici al repository e non hanno prodotto delta.

Coerente con produzione **@9** e tag **`v1.8.1-stable`** (solo archivio; non è area di sviluppo).

## Riferimenti

- Implementazione issue #3: `docs/sessions/2026-05-03-issue-3-versione-ui.md`
- Deploy precedente V1.8A: `docs/sessions/2026-05-02-v18a-deploy-ufficiale-eseguito.md` (**@8**)
