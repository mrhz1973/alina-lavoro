# Task 0450 — External Sheet Preview Normalization

**Status:** ✅ DONE (Normalization Preview Implemented)
**Date:** 2026-05-18
**Implementer:** Windsurf/Cascade

---

## Objective

Improve the external Google Sheet preview so it normalizes the read-only external sheet data and reports how many rows would be importable, skipped, or problematic.

---

## Problem Statement

The user manually verified that the external preview reads 930 rows from Foglio1, but currently treats all 930 as valid raw rows. Rows like:
- `{"data": "23 settembre 2024", "inizio": "0.00", "termine": "0.00"}`

must be counted as skipped/non-importable, not valid work shifts.

The preview needed to answer:
- How many rows were read
- How many rows would be importable as shifts
- How many rows would be skipped
- Why rows were skipped
- First 5 normalized importable rows
- First 10 skipped/problem rows
- Recognized source columns

---

## Implementation Summary

### 1. Normalization Helper Functions ✅

Added helper functions in `src/backend/Code.gs`:

**`normalizeExternalImportHeader_(header)`**
- Normalizes headers by lowercasing, removing line breaks, and trimming

**`findExternalColumn_(headers, aliases)`**
- Finds column index by matching aliases against normalized headers

**`parseItalianExternalDate_(value)`**
- Parses Italian dates like "21 settembre 2024" → "2024-09-21"
- Supports all Italian month names
- Accepts ISO format if already present

**`parseExternalTime_(value)`**
- Parses time formats: "8.00" → "08:00", "15.30" → "15:30"
- Handles HH:mm format and simple hour format

**`parseExternalDurationMinutes_(value)`**
- Parses duration: "7.00" → 420 minutes, "5.30" → 330 minutes
- Treats decimal part as minutes, not fractional hours

**`buildExternalShiftPreview_(headers, rows)`**
- Main normalization function that:
  - Maps columns: data, inizio, fine, durata
  - Parses and validates each row
  - Classifies rows as importable or skipped
  - Returns normalized preview object

### 2. Extended previewExternalSheetImport Response ✅

The function now returns `normalizedPreview` object with:

```javascript
{
  dataType: 'shifts',
  rowsRead: number,
  importableRows: number,
  skippedRows: number,
  recognizedMapping: { data, inizio, fine, durata },
  normalizedSampleRows: array (max 5),
  skippedSamples: array (max 10),
  warnings: array
}
```

### 3. Updated Inline UI Output ✅

Modified `buildExternalImportPreviewInlineHtml_()` to display:

- Righe lette
- Righe raw valide/non valide
- **Righe importabili** (new)
- **Righe scartate** (new)
- **Mapping colonne riconosciuto** (new)
- **Sample normalizzato** max 5 (new)
- **Righe scartate** max 10 with reason (new)

### 4. Import Rules Implemented ✅

A row is importable if:
- Date is valid (parsable)
- Either:
  - Start and end times are valid and not both 00:00
  - Or duration minutes > 0
- Rows with start 00:00, end 00:00, and no positive duration are skipped with reason "empty_zero_shift"

Normalized row shape:
```javascript
{
  data: "YYYY-MM-DD",
  inizio: "HH:mm",
  fine: "HH:mm",
  minuti_lavorati: number,
  nota: "",
  manuale: true,
  sourceRow: number,
  durationSource: 'computed_from_times' | 'from_duration_column'
}
```

### 5. Column Mapping ✅

Recognized column aliases:
- **data**: 'data', 'date', 'giorno', 'day'
- **inizio**: 'inizio', 'start', 'ora inizio', 'dalle'
- **fine**: 'termine', 'fine', 'end', 'ora fine', 'alle'
- **durata**: 'ore lavorate', 'durata', 'minuti', 'minuti lavorati', 'ore . minuti', 'totale ore'

---

## Validation Results

✅ **Helper functions present**: `parseItalianExternalDate_`, `parseExternalTime_`, `parseExternalDurationMinutes_`, `buildExternalShiftPreview_`
✅ **Response fields added**: `normalizedPreview` with all required fields
✅ **UI fields added**: Righe importabili, Righe scartate, Mapping colonne, Sample normalizzato, Skipped samples
✅ **authorizeSheetsReadonlyOnce absent**: Not found in code
✅ **SpreadsheetApp.openById absent**: Only appears in comment "invece di SpreadsheetApp.openById"
✅ **npx.cmd clasp push --force executed**: Successfully pushed 4 files
✅ **clasp deploy NOT executed**: Only HEAD/dev updated
✅ **production @57 untouched**: No production changes

---

## Testing Instructions

**URL to test:**
`https://script.google.com/macros/s/AKfycbwv2UB_Cdz17ZOUqeLzcougzqCbHrIkH3HjrbdTeDo-/dev?route=external-import-preview-inline&t=0450`

**Expected behavior:**
- Click "Anteprima" with external sheet URL
- Shows "Righe lette: 930" (or actual count)
- Shows "Righe importabili" count
- Shows "Righe scartate" count
- Shows column mapping (Data, Inizio, Fine, Durata)
- Shows sample normalized rows (date + time + minutes)
- Shows skipped rows with reasons (empty_zero_shift, invalid_date, etc.)

---

## Files Changed

- `src/backend/Code.gs` - Added normalization helpers and extended preview response
- `docs/tasks/done/0450-external-sheet-preview-normalization.md` - This task documentation
- `docs/sessions/2026-05-18-external-sheet-preview-normalization.md` - Session log

---

## Forbidden Actions Compliance

✅ **No production deploy**
✅ **No clasp deploy**
✅ **No data import into app database**
✅ **No write operations**
✅ **No SpreadsheetApp.openById active code**
✅ **No authorizeSheetsReadonlyOnce temporary function**
✅ **Production @57 untouched**

---

## Current Status

**EXTERNAL SHEET PREVIEW NORMALIZATION COMPLETE**

The external preview now provides:
- Raw data preview (existing)
- Normalized shift preview (new)
- Importable vs skipped row counts
- Detailed skip reasons
- Column mapping recognition
- Sample data for verification

Ready for user testing with actual external Google Sheet.

---

## Documentation

- `docs/sessions/2026-05-18-external-sheet-preview-normalization.md` - Full implementation session
