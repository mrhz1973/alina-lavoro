# Session — External Preview Read-Only Scope Fix (task 0438)

**Date:** 2026-05-17
**Task:** 0438 — External preview read-only scope fix
**Implementer:** Windsurf/Cascade

---

## Context

L'anteprima esterna (`previewExternalSheetImport`) falliva con errore:
"Le autorizzazioni specificate non sono sufficienti per chiamare SpreadsheetApp.openById.
Autorizzazioni obbligatorie: https://www.googleapis.com/auth/spreadsheets"

La pagina `/dev?route=external-import-preview` si apriva correttamente, ma il backend usava `SpreadsheetApp.openById` che richiede scope completo.

---

## Root Cause

`SpreadsheetApp.openById()` e `SpreadsheetApp.openByUrl()` richiedono lo scope completo `https://www.googleapis.com/auth/spreadsheets`, non compatibile con una preview read-only.

---

## What was done

### Files modified

**src/backend/Code.gs:**
- `previewExternalSheetImport()` completamente riscritta per usare Advanced Sheets Service
- Sostituito `SpreadsheetApp.openById(ssId)` con `Sheets.Spreadsheets.get(ssId)` per metadati
- Sostituito `sheet.getDataRange().getValues()` con `Sheets.Spreadsheets.Values.get(ssId, range)`
- Aggiunti messaggi di errore specifici per autorizzazione, file non accessibile, tab non trovato
- Nessuna scrittura dati, solo lettura read-only

**appsscript.json:**
- Aggiunto `enabledAdvancedServices` con Sheets API v4
- Scope esistenti mantenuti: `spreadsheets.currentonly`, `spreadsheets.readonly`, `script.container.ui`
- NON aggiunto scope completo spreadsheets
- NON aggiunto Drive scope

### Files NOT modified
- `src/frontend/Index.html` — untouched, APP_BUILD='0428'
- `src/frontend/ExternalImportPreview.html` — unchanged, UI già read-only

---

## Technical Implementation

### Advanced Sheets Service usage
```javascript
// Metadati fogli (read-only)
var spreadsheet = Sheets.Spreadsheets.get(ssId);
sheetName = spreadsheet.sheets[0].properties.title;

// Lettura dati (read-only)
var range = sheetName + '!A1:Z';
var response = Sheets.Spreadsheets.Values.get(ssId, range);
var values = response.values;
```

### Error handling migliorato
- **Autorizzazione mancante:** "Autorizzazione read-only Google Sheet richiesta. Riapri la pagina /dev e autorizza se richiesto."
- **File non accessibile:** "File non accessibile: verifica che il Google Sheet sia tuo o condiviso con questo account."
- **Tab non trovato:** "Tab non trovato: controlla il nome del foglio in basso nel Google Sheet."

---

## Validations

- `git diff --check`: clean
- Index.html NON modificato (verificato)
- previewExternalSheetImport NON usa `SpreadsheetApp.openById`/`openByUrl` (verificato)
- Nessuna funzione replace o scrittura dati (verificato)
- appsscript.json NON contiene scope completo `https://www.googleapis.com/auth/spreadsheets` (verificato)
- appsscript.json NON contiene Drive scope (verificato)
- `.gas/ExternalImportPreview.html` esiste dopo sync (verificato)
- `.gas/Code.gs` contiene previewExternalSheetImport aggiornata (verificato)
- `.gas/Code.js` rimosso (verificato)
- `npx clasp push --force`: 4 files pushed OK

---

## Deploy status

- **No deploy executed**
- Production @57 / build 0428 **untouched**
- HEAD/dev aggiornato con fix read-only (clasp push --force only)

---

## Test required

URL da testare:
```
/dev?route=external-import-preview
```

1. Inserire URL o ID di un Google Sheet accessibile
2. Cliccare "Anteprima"
3. Verificare che funzioni senza errore di autorizzazione
4. Verificare che main `/dev` (senza parametro) continui a boot normalmente

---

## Risk Assessment

- **Basso:** Advanced Sheets Service richiede solo `spreadsheets.readonly` scope (già presente)
- **Basso:** Nessuna modifica al main app o production
- **Medio:** Potrebbe richiedere ri-autorizzazione alla prima apertura dopo il push
- **Mitigazione:** Rollback immediato possibile ripristinando Code.gs e appsscript.json dal commit precedente

---

## Next steps

Se test passa:
- L'anteprima read-only è funzionante con scope corretto
- Futuri sviluppi import possono procedere con canary su questa base
- Production rimane stabile @57/build 0428

Se test fallisce:
- Rollback immediato a stato pre-0438
- Investigare se Advanced Sheets Service richiede configurazione aggiuntiva

---

## Commit

Staging selettivo pianificato:
```
git add src/backend/Code.gs appsscript.json
git commit -m "fix: use readonly sheet preview access"
git push origin main
```
