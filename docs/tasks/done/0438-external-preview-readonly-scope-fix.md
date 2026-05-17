# Task 0438 — External Preview Read-Only Scope Fix

**Status:** ✅ DONE
**Date:** 2026-05-17
**Implementer:** Windsurf/Cascade

---

## Objective

Correggere la funzione `previewExternalSheetImport` per usare scope read-only compatibile, eliminando la dipendenza da `SpreadsheetApp.openById` che richiede scope completo.

---

## Problem

Test Anteprima falliva con:
"Le autorizzazioni specificate non sono sufficienti per chiamare SpreadsheetApp.openById.
Autorizzazioni obbligatorie: https://www.googleapis.com/auth/spreadsheets"

---

## Solution Implemented

### Backend Changes (src/backend/Code.gs)
- **Riscritto `previewExternalSheetImport()`** per usare Advanced Sheets Service
- **Sostituito `SpreadsheetApp.openById()`** con `Sheets.Spreadsheets.get()` (metadati)
- **Sostituito `sheet.getDataRange().getValues()`** con `Sheets.Spreadsheets.Values.get()` (dati)
- **Aggiunti messaggi errore specifici** per autorizzazione, accesso file, tab non trovato
- **Mantenuta output structure identica** per compatibilità frontend

### Manifest Changes (appsscript.json)
- **Aggiunto Advanced Sheets Service** in `enabledAdvancedServices`
- **Scope mantenuti**: `spreadsheets.currentonly`, `spreadsheets.readonly`, `script.container.ui`
- **NON aggiunto** scope completo `spreadsheets`
- **NON aggiunto** Drive scope

### Constraints Respected
- ✅ Production @57 NON toccata
- ✅ Index.html NON modificato
- ✅ Nessuna scrittura dati
- ✅ Nessun deploy produzione
- ✅ Solo clasp push --force

---

## Technical Details

### Read-Only Access Pattern
```javascript
// Ottieni primo foglio (metadati read-only)
var spreadsheet = Sheets.Spreadsheets.get(ssId);
sheetName = spreadsheet.sheets[0].properties.title;

// Leggi dati (read-only)
var range = sheetName + '!A1:Z';
var response = Sheets.Spreadsheets.Values.get(ssId, range);
var values = response.values;
```

### Error Messages
- **Autorizzazione:** "Autorizzazione read-only Google Sheet richiesta. Riapri la pagina /dev e autorizza se richiesto."
- **Accesso:** "File non accessibile: verifica che il Google Sheet sia tuo o condiviso con questo account."
- **Tab:** "Tab non trovato: controlla il nome del foglio in basso nel Google Sheet."

---

## Validation Results

- ✅ `git diff --check`: clean
- ✅ Index.html NON modificato
- ✅ Nessun `SpreadsheetApp.openById`/`openByUrl` attivo
- ✅ Nessuna funzione replace/scrittura
- ✅ Nessun full spreadsheets scope
- ✅ Nessun Drive scope
- ✅ Sync e push completati
- ✅ `.gas/` files aggiornati

---

## Test Instructions

URL: `/dev?route=external-import-preview`

1. Aprire URL in browser
2. Inserire Google Sheet URL/ID accessibile
3. Cliccare "Anteprima"
4. Verificare funzionamento senza errore autorizzazione
5. Verificare main `/dev` boot normale

---

## Production Impact

**Zero impact** - Production @57/build 0428 untouched.
Solo HEAD/dev aggiornato con fix read-only.

---

## Files Changed

- `src/backend/Code.gs` - previewExternalSheetImport riscritta
- `appsscript.json` - Advanced Sheets Service abilitato
- `docs/sessions/2026-05-17-external-preview-readonly-scope-fix.md` - sessione completa

---

## Commit

```
git add src/backend/Code.gs appsscript.json
git commit -m "fix: use readonly sheet preview access"
git push origin main
```

---

## Next

Gate riaperto per futuri sviluppi import con base read-only funzionante.
