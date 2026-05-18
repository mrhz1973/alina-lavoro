/**
 * Alina Lavoro - V1.5
 * Backend Google Apps Script
 * Realizzata da Tuso Martino
 *
 * Changelog V1.5:
 * 1. Fix newShift lato client (data: date) — vedi Index.html
 * 2. eliminaTurniFuturi: confronto Date/Date invece di stringhe
 * 3. backupSheet_ prima di operazioni distruttive su TURNI + max 5 backup
 * 4. LockService (waitLock 10s) su saveShift e syncBatch
 * 5. Rimossa importaStoricoDaFoglio1
 * 6. importaStoricoSoloFinoAOggi: salta righe 00:00/00:00 senza minuti
 * 7. pulisciTurniVuoti() manuale (editor) per righe fantasma
 *
 * V1.6.2: add HtmlService viewport meta tag for mobile layout.
 */

const DEFAULT_ACCESS_CODE = '1234';

const SHEETS = {
  TURNI: 'TURNI',
  STIPENDI: 'STIPENDI',
  NOTE: 'NOTE',
  CONFIG: 'CONFIG',
  SYNC_LOG: 'SYNC_LOG'
};

const HEADERS = {
  TURNI: [
    'id',
    'data',
    'inizio',
    'fine',
    'pausa_minuti',
    'minuti_lavorati',
    'nota',
    'manuale',
    'creato_il',
    'aggiornato_il',
    'sync_version'
  ],
  STIPENDI: [
    'id',
    'mese_lavorato',
    'mese_busta',
    'data_inserimento',
    'importo_reale',
    'ore_mese',
    'tariffa_effettiva',
    'note',
    'creato_il',
    'aggiornato_il'
  ],
  NOTE: [
    'id',
    'data',
    'tipo',
    'testo',
    'completata',
    'creato_il',
    'aggiornato_il'
  ],
  CONFIG: [
    'parametro',
    'valore'
  ],
  SYNC_LOG: [
    'timestamp',
    'azione',
    'stato',
    'messaggio'
  ]
};

const DEFAULT_CONFIG = {
  codice_accesso: DEFAULT_ACCESS_CODE,
  lingua: 'it',
  tema: 'light',
  stile: 'modern',
  giorno_busta: '10',
  promemoria_busta: '0',
  media_mesi: '6',
  tariffa_media_default: '10',
  valuta: 'EUR',
  setup_completato: 'no'
};

function getRequestRoute_(e) {
  var params = (e && e.parameter) ? e.parameter : {};
  var keys = ['page', 'route', 'view', 'alinaPage'];
  for (var i = 0; i < keys.length; i++) {
    var val = '';
    try { val = String(params[keys[i]] || '').trim().toLowerCase(); } catch (_) {}
    if (val) return val;
  }
  return '';
}

function isExternalImportPreviewRoute_(route) {
  return route === 'external-import-preview' ||
         route === 'externalimportpreview' ||
         route === 'import-preview' ||
         route === 'importpreview';
}

function isExternalImportPreviewInlineRoute_(route) {
  return route === 'external-import-preview-inline' ||
         route === 'import-preview-inline';
}

function doGet(e) {
  var route = getRequestRoute_(e);

  // FORCE INLINE PREVIEW ROUTE - must be checked FIRST
  if (route === 'runtime-forensic-0448') {
    return HtmlService.createHtmlOutput(
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Runtime Forensic 0448</title></head>' +
      '<body style="font-family:monospace;padding:24px">' +
      '<h1>RUNTIME FORENSIC 0448</h1>' +
      '<p>marker: 0448-runtime-forensic</p>' +
      '<p>If you see this page, the clasp push worked and this is the correct runtime.</p>' +
      '<p>Timestamp: ' + new Date().toISOString() + '</p>' +
      '</body></html>'
    ).setTitle('Runtime Forensic 0448');
  }

  if (route === 'external-import-preview-inline' || route === 'import-preview-inline') {
    return HtmlService
      .createHtmlOutput(buildExternalImportPreviewInlineHtml_())
      .setTitle('Preview Google Sheet esterno INLINE 0448')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  if (route === 'debug-route') {
    var params = (e && e.parameter) ? JSON.stringify(e.parameter) : '{}';
    return HtmlService.createHtmlOutput(
      '<!DOCTYPE html><html><body style="font-family:monospace;padding:24px">' +
      '<h2>ALINA ROUTE DEBUG</h2>' +
      '<p><b>route computed:</b> ' + route + '</p>' +
      '<p><b>e.parameter:</b> ' + params + '</p>' +
      '</body></html>'
    ).setTitle('ALINA ROUTE DEBUG');
  }

  if (isExternalImportPreviewRoute_(route)) {
    return HtmlService
      .createHtmlOutputFromFile('ExternalImportPreview')
      .setTitle('Preview Import Esterno — DEV')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  setupAlinaLavoro();

  return HtmlService
    .createHtmlOutputFromFile('Index')
    .setTitle('Alina Lavoro')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function previewExternalSheetImport(payload) {
  try {
    var rawUrl = (payload && payload.url) ? String(payload.url).trim() : '';
    var tabName = (payload && payload.tab) ? String(payload.tab).trim() : '';

    if (!rawUrl) return { ok: false, error: 'URL o ID mancante.' };

    var ssId = extractSpreadsheetId_(rawUrl);
    if (!ssId) return { ok: false, error: 'Impossibile estrarre ID dal valore fornito.' };

    // Usa Advanced Sheets Service (read-only) invece di SpreadsheetApp.openById
    var sheetName;
    if (tabName) {
      sheetName = tabName;
    } else {
      // Ottieni i metadati dei fogli per trovare il primo foglio
      try {
        var spreadsheet = Sheets.Spreadsheets.get(ssId);
        if (spreadsheet && spreadsheet.sheets && spreadsheet.sheets.length > 0) {
          sheetName = spreadsheet.sheets[0].properties.title;
        } else {
          return { ok: false, error: 'Nessun foglio trovato nel documento.' };
        }
      } catch (metaErr) {
        return safeExternalImportError_('spreadsheet_get', ssId, tabName, metaErr);
      }
    }

    // Leggi i dati con Sheets API (read-only)
    var range = sheetName + '!A1:Z';
    var response;
    try {
      response = Sheets.Spreadsheets.Values.get(ssId, range);
    } catch (apiErr) {
      if (apiErr.message && apiErr.message.indexOf('permission') !== -1) {
        return safeExternalImportError_('values_get_permission', ssId, sheetName, apiErr);
      }
      if (apiErr.message && apiErr.message.indexOf('Unable to parse range') !== -1) {
        return safeExternalImportError_('values_get_range', ssId, sheetName, apiErr);
      }
      return safeExternalImportError_('values_get', ssId, sheetName, apiErr);
    }

    var values = response.values;
    if (!values || values.length < 2) {
      return { ok: true, rowsRead: values ? values.length : 0, validRows: 0, invalidRows: 0, recognizedColumns: [], sampleRows: [], errors: ['Il foglio è vuoto o ha solo intestazioni.'] };
    }

    var headers = values[0].map(function(h) { return String(h).trim().toLowerCase(); });
    var rows = values.slice(1);
    var validRows = 0;
    var invalidRows = 0;
    var sampleRows = [];
    var errors = [];

    rows.forEach(function(row, idx) {
      var hasContent = row.some(function(cell) { return cell !== '' && cell !== null && cell !== undefined; });
      if (!hasContent) { invalidRows++; return; }
      validRows++;
      if (sampleRows.length < 5) {
        var obj = {};
        headers.forEach(function(h, i) { obj[h] = row[i]; });
        sampleRows.push(obj);
      }
    });

    // Build normalized preview for shift import (Task 0450)
    var normalizedPreview = buildExternalShiftPreview_(headers, rows);

    return {
      ok: true,
      rowsRead: rows.length,
      validRows: validRows,
      invalidRows: invalidRows,
      recognizedColumns: headers,
      sampleRows: sampleRows,
      errors: errors,
      normalizedPreview: normalizedPreview
    };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}

function extractSpreadsheetId_(input) {
  var m = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]{20,})/);
  if (m) return m[1];
  if (/^[a-zA-Z0-9_-]{20,}$/.test(input)) return input;
  return null;
}

function externalImportPreviewRuntimeInfo() {
  return {
    ok: true,
    marker: "0448-runtime-forensic",
    timestamp: new Date().toISOString(),
    uses: "Sheets.Spreadsheets.Values.get",
    spreadsheetAppOpenByIdExpected: false
  };
}

function redactSpreadsheetId_(spreadsheetId) {
  if (!spreadsheetId) return "(missing)";
  var id = String(spreadsheetId);
  if (id.length <= 3) return id + "…";
  if (id.length <= 10) return id.substring(0, 3) + "…";
  return id.substring(0, 6) + "…" + id.substring(id.length - 4);
}

function safeExternalImportError_(phase, spreadsheetId, tabName, err) {
  return {
    ok: false,
    phase: phase,
    spreadsheetIdRedacted: redactSpreadsheetId_(spreadsheetId),
    tabName: tabName || "",
    rawMessage: err.message || err.toString() || "Unknown error",
    name: err.name || "",
    stackFirstLine: (err.stack && err.stack.split('\n')[0]) || ""
  };
}

function externalImportPreviewAccessProbe(payload) {
  try {
    // Extract payload parameters with tolerance for different field names
    var rawUrl = (payload && payload.url) ? String(payload.url).trim() : '';
    var ssId = (payload && payload.spreadsheetId) ? String(payload.spreadsheetId).trim() : '';
    var tabName = (payload && payload.tab) ? String(payload.tab).trim() : '';
    var tabNameAlt = (payload && payload.tabName) ? String(payload.tabName).trim() : '';

    // Use spreadsheetId if provided, otherwise extract from URL
    var effectiveSsId = ssId || extractSpreadsheetId_(rawUrl);
    var effectiveTabName = tabName || tabNameAlt;

    if (!effectiveSsId) {
      return safeExternalImportError_('extract_id', effectiveSsId, effectiveTabName, new Error('Missing spreadsheet ID'));
    }

    // Phase 1: Get spreadsheet metadata
    var title = '';
    var availableSheets = [];
    try {
      var spreadsheet = Sheets.Spreadsheets.get(effectiveSsId, { fields: "properties.title,sheets.properties.title" });
      if (spreadsheet) {
        title = spreadsheet.properties && spreadsheet.properties.title ? spreadsheet.properties.title : '';
        if (spreadsheet.sheets) {
          availableSheets = spreadsheet.sheets.map(function(sheet) {
            return sheet.properties && sheet.properties.title ? sheet.properties.title : '';
          }).filter(function(name) { return name; });
        }
      }
    } catch (metaErr) {
      return safeExternalImportError_('spreadsheet_get', effectiveSsId, effectiveTabName, metaErr);
    }

    // Phase 2: Get sample values
    var targetTabName = effectiveTabName;
    if (!targetTabName && availableSheets.length > 0) {
      targetTabName = availableSheets[0]; // Use first available sheet
    }

    var valuesRange = '';
    var rowsSeen = 0;
    if (targetTabName) {
      try {
        var range = targetTabName + '!A1:Z20';
        var response = Sheets.Spreadsheets.Values.get(effectiveSsId, range);
        if (response && response.values) {
          valuesRange = range;
          rowsSeen = response.values.length;
        }
      } catch (valuesErr) {
        return safeExternalImportError_('values_get', effectiveSsId, targetTabName, valuesErr);
      }
    }

    return {
      ok: true,
      phase: 'ok',
      spreadsheetIdRedacted: redactSpreadsheetId_(effectiveSsId),
      tabName: targetTabName,
      title: title,
      availableSheets: availableSheets,
      valuesRange: valuesRange,
      rowsSeen: rowsSeen
    };

  } catch (probeErr) {
    return safeExternalImportError_('probe', '', '', probeErr);
  }
}

// ============================================================================
// External Import Normalization Helpers (Task 0450)
// ============================================================================

const ITALIAN_MONTHS = {
  'gennaio': 1, 'febbraio': 2, 'marzo': 3, 'aprile': 4, 'maggio': 5, 'giugno': 6,
  'luglio': 7, 'agosto': 8, 'settembre': 9, 'ottobre': 10, 'novembre': 11, 'dicembre': 12
};

function normalizeExternalImportHeader_(header) {
  return String(header || '')
    .toLowerCase()
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\.\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findExternalColumn_(headers, aliases) {
  for (var i = 0; i < headers.length; i++) {
    var normalizedHeader = normalizeExternalImportHeader_(headers[i]);
    for (var j = 0; j < aliases.length; j++) {
      if (normalizedHeader.indexOf(aliases[j].toLowerCase()) !== -1) {
        return i;
      }
    }
  }
  return -1;
}

function parseItalianExternalDate_(value) {
  if (!value) return null;
  var str = String(value).trim();
  
  // Already ISO format YYYY-MM-DD
  var isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return str;
  }
  
  // Italian format: "21 settembre 2024"
  var italianMatch = str.match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/i);
  if (italianMatch) {
    var day = parseInt(italianMatch[1], 10);
    var monthName = italianMatch[2].toLowerCase();
    var year = parseInt(italianMatch[3], 10);
    var month = ITALIAN_MONTHS[monthName];
    if (month && day >= 1 && day <= 31) {
      return year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
    }
  }
  
  return null;
}

function parseExternalTime_(value) {
  if (!value) return null;
  var str = String(value).trim().replace(',', '.');
  
  // Already HH:mm format
  var timeMatch = str.match(/^(\d{1,2}):(\d{2})$/);
  if (timeMatch) {
    var hours = parseInt(timeMatch[1], 10);
    var minutes = parseInt(timeMatch[2], 10);
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
    }
  }
  
  // Decimal format: "8.00" or "15.30"
  var decimalMatch = str.match(/^(\d{1,2})\.(\d{2})$/);
  if (decimalMatch) {
    var hours = parseInt(decimalMatch[1], 10);
    var minutes = parseInt(decimalMatch[2], 10);
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
    }
  }
  
  // Simple hour format: "8" or "15"
  var simpleMatch = str.match(/^(\d{1,2})$/);
  if (simpleMatch) {
    var hours = parseInt(simpleMatch[1], 10);
    if (hours >= 0 && hours <= 23) {
      return String(hours).padStart(2, '0') + ':00';
    }
  }
  
  return null;
}

function parseExternalDurationMinutes_(value) {
  if (!value) return null;
  var str = String(value).trim().replace(',', '.');
  
  // Decimal hours format: "7.00" = 7h 0m = 420m, "5.30" = 5h 30m = 330m
  var decimalMatch = str.match(/^(\d{1,2})\.(\d{2})$/);
  if (decimalMatch) {
    var hours = parseInt(decimalMatch[1], 10);
    var decimalPart = parseInt(decimalMatch[2], 10);
    if (hours >= 0 && decimalPart >= 0 && decimalPart < 100) {
      // Treat .30 as 30 minutes, not 0.30 hours
      var minutes = (hours * 60) + (decimalPart >= 60 ? Math.floor(decimalPart * 0.6) : decimalPart);
      return minutes;
    }
  }
  
  // Simple hours format: "7" = 420m
  var simpleMatch = str.match(/^(\d{1,2})$/);
  if (simpleMatch) {
    var hours = parseInt(simpleMatch[1], 10);
    if (hours >= 0) {
      return hours * 60;
    }
  }
  
  return null;
}

function buildExternalShiftPreview_(headers, rows) {
  // Column aliases for mapping
  var dateAliases = ['data', 'date', 'giorno', 'day'];
  var startAliases = ['inizio', 'start', 'ora inizio', 'dalle'];
  var endAliases = ['termine', 'fine', 'end', 'ora fine', 'alle'];
  var durationAliases = ['ore lavorate', 'durata', 'minuti', 'minuti lavorati', 'ore . minuti', 'totale ore'];
  
  var dateCol = findExternalColumn_(headers, dateAliases);
  var startCol = findExternalColumn_(headers, startAliases);
  var endCol = findExternalColumn_(headers, endAliases);
  var durationCol = findExternalColumn_(headers, durationAliases);
  
  var recognizedMapping = {
    data: dateCol >= 0 ? headers[dateCol] : null,
    inizio: startCol >= 0 ? headers[startCol] : null,
    fine: endCol >= 0 ? headers[endCol] : null,
    durata: durationCol >= 0 ? headers[durationCol] : null
  };
  
  var importableRows = [];
  var skippedRows = [];
  
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var rowNum = i + 2; // +2 because row 1 is header
    
    // Check if row has any content
    var hasContent = row.some(function(cell) { 
      return cell !== '' && cell !== null && cell !== undefined; 
    });
    if (!hasContent) {
      continue; // Skip empty rows without counting as skipped
    }
    
    // Parse date (required)
    var rawDate = dateCol >= 0 ? row[dateCol] : null;
    var parsedDate = parseItalianExternalDate_(rawDate);
    if (!parsedDate) {
      skippedRows.push({
        sourceRow: rowNum,
        reason: 'invalid_date',
        raw: { data: rawDate, inizio: startCol >= 0 ? row[startCol] : null, termine: endCol >= 0 ? row[endCol] : null }
      });
      continue;
    }
    
    // Parse times
    var rawStart = startCol >= 0 ? row[startCol] : null;
    var rawEnd = endCol >= 0 ? row[endCol] : null;
    var parsedStart = parseExternalTime_(rawStart);
    var parsedEnd = parseExternalTime_(rawEnd);
    
    // Parse duration
    var rawDuration = durationCol >= 0 ? row[durationCol] : null;
    var parsedDuration = parseExternalDurationMinutes_(rawDuration);
    
    // Calculate working minutes
    var minutesWorked = 0;
    var durationSource = 'none';
    
    if (parsedStart && parsedEnd) {
      var startParts = parsedStart.split(':');
      var endParts = parsedEnd.split(':');
      var startMin = parseInt(startParts[0], 10) * 60 + parseInt(startParts[1], 10);
      var endMin = parseInt(endParts[0], 10) * 60 + parseInt(endParts[1], 10);
      if (endMin >= startMin) {
        minutesWorked = endMin - startMin;
        durationSource = 'computed_from_times';
      }
    }
    
    // If computed duration is 0 or invalid, try parsed duration
    if (minutesWorked === 0 && parsedDuration !== null && parsedDuration > 0) {
      minutesWorked = parsedDuration;
      durationSource = 'from_duration_column';
    }
    
    // Check if row is importable
    var isEmptyZeroShift = (!parsedStart || parsedStart === '00:00') && 
                           (!parsedEnd || parsedEnd === '00:00') && 
                           minutesWorked === 0;
    
    if (isEmptyZeroShift) {
      skippedRows.push({
        sourceRow: rowNum,
        reason: 'empty_zero_shift',
        raw: { data: rawDate, inizio: rawStart, termine: rawEnd, 'ore lavorate': rawDuration }
      });
      continue;
    }
    
    if (minutesWorked === 0) {
      skippedRows.push({
        sourceRow: rowNum,
        reason: 'missing_work_duration',
        raw: { data: rawDate, inizio: rawStart, termine: rawEnd, 'ore lavorate': rawDuration }
      });
      continue;
    }
    
    // Build normalized row
    var normalizedRow = {
      data: parsedDate,
      inizio: parsedStart || '00:00',
      fine: parsedEnd || '00:00',
      minuti_lavorati: minutesWorked,
      nota: '',
      manuale: true,
      sourceRow: rowNum,
      durationSource: durationSource
    };
    
    importableRows.push(normalizedRow);
  }
  
  return {
    dataType: 'shifts',
    rowsRead: rows.length,
    importableRows: importableRows.length,
    skippedRows: skippedRows.length,
    recognizedMapping: recognizedMapping,
    normalizedSampleRows: importableRows.slice(0, 5),
    skippedSamples: skippedRows.slice(0, 10),
    warnings: []
  };
}

function buildExternalImportPreviewInlineHtml_() {
  return '<!DOCTYPE html>' +
    '<html lang="it">' +
    '<head>' +
    '<meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>Preview Google Sheet esterno INLINE 0448</title>' +
    '<style>' +
    '* { box-sizing: border-box; margin: 0; padding: 0; }' +
    'body { font-family: sans-serif; background: #f5f5f5; color: #222; padding: 24px 16px; max-width: 640px; margin: 0 auto; }' +
    'h1 { font-size: 1.2rem; margin-bottom: 4px; }' +
    '.build-tag { font-size: 0.75rem; color: #888; margin-bottom: 24px; }' +
    'label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px; margin-top: 16px; }' +
    'input[type=text] { width: 100%; padding: 8px 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 0.9rem; }' +
    'button { margin-top: 20px; padding: 10px 24px; background: #1a73e8; color: #fff; border: none; border-radius: 6px; font-size: 0.95rem; cursor: pointer; }' +
    'button:disabled { background: #aaa; cursor: not-allowed; }' +
    '#result-area { margin-top: 24px; }' +
    '.result-box { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 16px; font-size: 0.85rem; white-space: pre-wrap; word-break: break-all; }' +
    '.error-box { background: #fff3f3; border: 1px solid #f66; border-radius: 8px; padding: 16px; font-size: 0.85rem; color: #c00; white-space: pre-wrap; word-break: break-all; }' +
    '.info { font-size: 0.8rem; color: #555; margin-top: 8px; }' +
    '.badge { display: inline-block; background: #fde68a; color: #92400e; border-radius: 4px; padding: 2px 8px; font-size: 0.72rem; font-weight: 700; margin-bottom: 16px; }' +
    '</style>' +
    '</head>' +
    '<body>' +
    '<h1>Preview Google Sheet esterno INLINE 0448</h1>' +
    '<div class="build-tag">DEV inline 0448</div>' +
    '<div class="badge">RUNTIME FORENSIC 0448 — if you see 0442, the browser is not using this pushed source.</div>' +

    '<label for="sheet-url">URL o ID Google Sheet</label>' +
    '<input type="text" id="sheet-url" placeholder="https://docs.google.com/spreadsheets/d/… oppure ID diretto">' +

    '<label for="tab-name">Nome foglio / tab (opzionale)</label>' +
    '<input type="text" id="tab-name" placeholder="Foglio1">' +

    '<button id="btn-preview">Anteprima</button>' +
    '<button id="btn-access" style="background: #27ae60; margin-left: 10px;">Verifica accesso file</button>' +
    '<button id="btn-runtime" style="background: #f39c12; margin-left: 10px;">Verifica runtime</button>' +
    '<p class="info">Nessun dato viene scritto o modificato. Solo lettura.</p>' +
    '<div id="js-ready-marker" style="font-size:0.7rem;color:#888;margin-top:4px;"></div>' +

    '<div id="result-area"></div>' +

    '<script>' +
    'function runPreview() {' +
    '  var url = document.getElementById("sheet-url").value.trim();' +
    '  var tab = document.getElementById("tab-name").value.trim();' +
    '  var btn = document.getElementById("btn-preview");' +
    '  var area = document.getElementById("result-area");' +

    '  if (!url) {' +
    '    area.innerHTML = "<div class=\\"error-box\\">Inserisci un URL o ID Google Sheet.</div>";' +
    '    return;' +
    '  }' +

    '  btn.disabled = true;' +
    '  btn.textContent = "Caricamento…";' +
    '  area.innerHTML = "<div class=\\"result-box\\">In attesa del backend…</div>";' +

    '  google.script.run' +
    '    .withSuccessHandler(function(data) {' +
    '      btn.disabled = false;' +
    '      btn.textContent = "Anteprima";' +
    '      if (data && data.ok) {' +
        '        var html = "<div class=\\"result-box\\">";' +
        '        html += "<strong>Righe lette:</strong> " + data.rowsRead + "\\n";' +
        '        html += "<strong>Righe valide:</strong> " + data.validRows + "\\n";' +
        '        html += "<strong>Righe non valide:</strong> " + data.invalidRows + "\\n";' +
        '        html += "<strong>Colonne riconosciute:</strong> " + (data.recognizedColumns || []).join(", ") + "\\n\\n";' +
        '        if (data.sampleRows && data.sampleRows.length) {' +
        '          html += "<strong>Anteprima righe raw (max 5):</strong>\\n";' +
        '          data.sampleRows.forEach(function(row, i) {' +
        '            html += (i + 1) + ". " + JSON.stringify(row) + "\\n";' +
        '          });' +
        '        }' +
        '        if (data.errors && data.errors.length) {' +
        '          html += "\\n<strong>Avvisi:</strong>\\n" + data.errors.join("\\n");' +
        '        }' +
        '        html += "</div>";' +
        '        ' +
        '        // Normalized Preview (Task 0450)' +
        '        if (data.normalizedPreview) {' +
        '          var norm = data.normalizedPreview;' +
        '          html += "<div class=\\"result-box\\" style=\\"margin-top:16px; background:#f0f8ff;\\">";' +
        '          html += "<strong>=== ANTEPRIMA NORMALIZZATA (Import Turni) ===</strong>\\n\\n";' +
        '          html += "<strong>Tipo dati:</strong> " + norm.dataType + "\\n";' +
        '          html += "<strong>Righe lette:</strong> " + norm.rowsRead + "\\n";' +
        '          html += "<strong>Righe importabili:</strong> " + norm.importableRows + "\\n";' +
        '          html += "<strong>Righe scartate:</strong> " + norm.skippedRows + "\\n\\n";' +
        '          ' +
        '          if (norm.recognizedMapping) {' +
        '            html += "<strong>Mapping colonne:</strong>\\n";' +
        '            html += "  - Data: " + (norm.recognizedMapping.data || "non trovata") + "\\n";' +
        '            html += "  - Inizio: " + (norm.recognizedMapping.inizio || "non trovata") + "\\n";' +
        '            html += "  - Fine: " + (norm.recognizedMapping.fine || "non trovata") + "\\n";' +
        '            html += "  - Durata: " + (norm.recognizedMapping.durata || "non trovata") + "\\n\\n";' +
        '          }' +
        '          ' +
        '          if (norm.normalizedSampleRows && norm.normalizedSampleRows.length) {' +
        '            html += "<strong>Righe importabili (max 5):</strong>\\n";' +
        '            norm.normalizedSampleRows.forEach(function(row, i) {' +
        '              html += (i + 1) + ". " + row.data + " " + row.inizio + "-" + row.fine + " (" + row.minuti_lavorati + " min)\\n";' +
        '            });' +
        '            html += "\\n";' +
        '          }' +
        '          ' +
        '          if (norm.skippedSamples && norm.skippedSamples.length) {' +
        '            html += "<strong>Righe scartate (max 10):</strong>\\n";' +
        '            norm.skippedSamples.forEach(function(skip, i) {' +
        '              html += (i + 1) + ". Riga " + skip.sourceRow + ": " + skip.reason;' +
        '              if (skip.raw && skip.raw.data) html += " (data: " + skip.raw.data + ")";' +
        '              html += "\\n";' +
        '            });' +
        '            html += "\\n";' +
        '          }' +
        '          ' +
        '          if (norm.warnings && norm.warnings.length) {' +
        '            html += "<strong>Avvisi normalizzazione:</strong>\\n" + norm.warnings.join("\\n");' +
        '          }' +
        '          html += "</div>";' +
        '        }' +
        '        ' +
        '        area.innerHTML = html;' +
    '      } else {' +
    '        var msg = (data && data.error) ? data.error : "Errore sconosciuto.";' +
    '        area.innerHTML = "<div class=\\"error-box\\">Errore backend: " + escHtml(msg) + "</div>";' +
    '      }' +
    '    })' +
    '    .withFailureHandler(function(err) {' +
    '      btn.disabled = false;' +
    '      btn.textContent = "Anteprima";' +
    '      area.innerHTML = "<div class=\\"error-box\\">Errore chiamata backend:\\n" + escHtml(String(err && err.message ? err.message : err)) + "</div>";' +
    '    })' +
    '    .previewExternalSheetImport({ url: url, tab: tab });' +
    '}' +

    'function checkAccess() {' +
    '  var url = document.getElementById("sheet-url").value.trim();' +
    '  var tab = document.getElementById("tab-name").value.trim();' +
    '  var btn = document.getElementById("btn-access");' +
    '  var area = document.getElementById("result-area");' +

    '  if (!url) {' +
    '    area.innerHTML = "<div class=\\"error-box\\">Inserisci un URL o ID Google Sheet.</div>";' +
    '    return;' +
    '  }' +

    '  btn.disabled = true;' +
    '  btn.textContent = "Verifica…";' +
    '  area.innerHTML = "<div class=\\"result-box\\">Verifica accesso in corso…</div>";' +

    '  google.script.run' +
    '    .withSuccessHandler(function(data) {' +
    '      btn.disabled = false;' +
    '      btn.textContent = "Verifica accesso file";' +
    '      if (data && data.ok) {' +
    '        var html = "<div class=\\"result-box\\">";' +
    '        html += "<strong>Stato:</strong> OK\\n";' +
    '        html += "<strong>Fase:</strong> " + data.phase + "\\n";' +
    '        html += "<strong>Spreadsheet ID:</strong> " + data.spreadsheetIdRedacted + "\\n";' +
    '        html += "<strong>Foglio:</strong> " + data.tabName + "\\n";' +
    '        html += "<strong>Titolo:</strong> " + data.title + "\\n";' +
    '        html += "<strong>Fogli disponibili:</strong> " + (data.availableSheets || []).join(", ") + "\\n";' +
    '        html += "<strong>Range valori:</strong> " + data.valuesRange + "\\n";' +
    '        html += "<strong>Righe viste:</strong> " + data.rowsSeen + "\\n";' +
    '        html += "</div>";' +
    '        area.innerHTML = html;' +
    '      } else {' +
    '        var html = "<div class=\\"error-box\\">";' +
    '        html += "<strong>Stato:</strong> ERRORE\\n";' +
    '        html += "<strong>Fase:</strong> " + (data.phase || "sconosciuta") + "\\n";' +
    '        html += "<strong>Spreadsheet ID:</strong> " + (data.spreadsheetIdRedacted || "sconosciuto") + "\\n";' +
    '        html += "<strong>Foglio:</strong> " + (data.tabName || "") + "\\n";' +
    '        html += "<strong>Messaggio:</strong> " + (data.rawMessage || "sconosciuto") + "\\n";' +
    '        html += "<strong>Tipo errore:</strong> " + (data.name || "sconosciuto") + "\\n";' +
    '        html += "<strong>Stack:</strong> " + (data.stackFirstLine || "sconosciuto") + "\\n";' +
    '        html += "</div>";' +
    '        area.innerHTML = html;' +
    '      }' +
    '    })' +
    '    .withFailureHandler(function(err) {' +
    '      btn.disabled = false;' +
    '      btn.textContent = "Verifica accesso file";' +
    '      area.innerHTML = "<div class=\\"error-box\\">Errore chiamata backend:\\n" + escHtml(String(err && err.message ? err.message : err)) + "</div>";' +
    '    })' +
    '    .externalImportPreviewAccessProbe({ url: url, tab: tab });' +
    '}' +

    'function checkRuntime() {' +
    '  var btn = document.getElementById("btn-runtime");' +
    '  var area = document.getElementById("result-area");' +

    '  btn.disabled = true;' +
    '  btn.textContent = "Verifica…";' +
    '  area.innerHTML = "<div class=\\"result-box\\">Verifica runtime in corso…</div>";' +

    '  google.script.run' +
    '    .withSuccessHandler(function(data) {' +
    '      btn.disabled = false;' +
    '      btn.textContent = "Verifica runtime";' +
    '      if (data && data.ok) {' +
    '        var html = "<div class=\\"result-box\\">";' +
    '        html += "<strong>Runtime Marker:</strong> " + data.marker + "\\n";' +
    '        html += "<strong>Timestamp:</strong> " + data.timestamp + "\\n";' +
    '        html += "<strong>Uses:</strong> " + data.uses + "\\n";' +
    '        html += "<strong>SpreadsheetApp.openById Expected:</strong> " + data.spreadsheetAppOpenByIdExpected + "\\n";' +
    '        html += "</div>";' +
    '        area.innerHTML = html;' +
    '      } else {' +
    '        var msg = (data && data.error) ? data.error : "Errore sconosciuto.";' +
    '        area.innerHTML = "<div class=\\"error-box\\">Errore runtime: " + escHtml(msg) + "</div>";' +
    '      }' +
    '    })' +
    '    .withFailureHandler(function(err) {' +
    '      btn.disabled = false;' +
    '      btn.textContent = "Verifica runtime";' +
    '      area.innerHTML = "<div class=\\"error-box\\">Errore chiamata runtime:\\n" + escHtml(String(err && err.message ? err.message : err)) + "</div>";' +
    '    })' +
    '    .externalImportPreviewRuntimeInfo();' +
    '}' +

    'function escHtml(s) {' +
    '  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");' +
    '}' +
    '' +
    '// Expose functions globally for button onclick compatibility' +
    'window.runPreview = runPreview;' +
    'window.checkAccess = checkAccess;' +
    'window.checkRuntime = checkRuntime;' +
    'window.escHtml = escHtml;' +
    '' +
    '// JS ready marker for task 0451' +
    'window.__ALINA_EXTERNAL_PREVIEW_JS_READY = "0451";' +
    '' +
    '// Bind button click handlers after DOM is ready' +
    'document.addEventListener("DOMContentLoaded", function() {' +
    '  var btnPreview = document.getElementById("btn-preview");' +
    '  var btnAccess = document.getElementById("btn-access");' +
    '  var btnRuntime = document.getElementById("btn-runtime");' +
    '  var marker = document.getElementById("js-ready-marker");' +
    '  if (btnPreview) btnPreview.addEventListener("click", runPreview);' +
    '  if (btnAccess) btnAccess.addEventListener("click", checkAccess);' +
    '  if (btnRuntime) btnRuntime.addEventListener("click", checkRuntime);' +
    '  if (marker) marker.textContent = "JS ready: 0451"; ' +
    '});' +
    '</script>' +
    '</body>' +
    '</html>';
}

function setupAlinaLavoro() {
  const ss = getSpreadsheet_();

  ensureSheet_(ss, SHEETS.TURNI, HEADERS.TURNI);
  ensureSheet_(ss, SHEETS.STIPENDI, HEADERS.STIPENDI);
  ensureSheet_(ss, SHEETS.NOTE, HEADERS.NOTE);
  ensureSheet_(ss, SHEETS.CONFIG, HEADERS.CONFIG);
  ensureSheet_(ss, SHEETS.SYNC_LOG, HEADERS.SYNC_LOG);

  const cfg = getConfigRaw_();

  Object.keys(DEFAULT_CONFIG).forEach(function (key) {
    if (cfg[key] === undefined || cfg[key] === '') {
      setConfigValue_(key, DEFAULT_CONFIG[key]);
    }
  });

  log_('setupAlinaLavoro', 'ok', 'Setup completato');

  return {
    success: true,
    message: 'Setup completato'
  };
}

function getBootstrap(accessCode) {
  setupAlinaLavoro();
  requireAccess_(accessCode);

  const config = getConfigRaw_();
  const shifts = getRecords_(SHEETS.TURNI);
  const salaries = getRecords_(SHEETS.STIPENDI);
  const notes = getRecords_(SHEETS.NOTE);

  const summaries = computeSummaries_(shifts, salaries, config);
  const reminder = computeSalaryReminder_(summaries, salaries, config);

  return {
    success: true,
    data: {
      config: safeConfig_(config),
      shifts: shifts,
      salaries: salaries,
      notes: notes,
      summaries: summaries,
      reminder: reminder,
      serverTime: new Date().toISOString()
    }
  };
}

function validateAccessCode(code) {
  setupAlinaLavoro();

  try {
    requireAccess_(code);
    return {
      success: true
    };
  } catch (err) {
    return {
      success: false,
      message: 'Codice non valido'
    };
  }
}

function saveConfig(accessCode, configPatch) {
  setupAlinaLavoro();
  requireAccess_(accessCode);

  const allowed = [
    'lingua',
    'tema',
    'stile',
    'giorno_busta',
    'promemoria_busta',
    'media_mesi',
    'tariffa_media_default',
    'setup_completato',
    'codice_accesso'
  ];

  allowed.forEach(function (key) {
    if (configPatch && configPatch[key] !== undefined) {
      setConfigValue_(key, String(configPatch[key]));
    }
  });

  log_('saveConfig', 'ok', 'Configurazione aggiornata');

  return getBootstrap(accessCode);
}

function saveShift(accessCode, shift) {
  setupAlinaLavoro();
  requireAccess_(accessCode);

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (e) {
    throw new Error('Operazione in corso, riprova tra qualche secondo');
  }
  try {
    saveShiftDirect_(shift);
    return getBootstrap(accessCode);
  } finally {
    lock.releaseLock();
  }
}

function saveSalary(accessCode, salary) {
  setupAlinaLavoro();
  requireAccess_(accessCode);

  saveSalaryDirect_(salary);

  return getBootstrap(accessCode);
}

function saveNote(accessCode, note) {
  setupAlinaLavoro();
  requireAccess_(accessCode);

  saveNoteDirect_(note);

  return getBootstrap(accessCode);
}

function deleteNote(accessCode, noteId) {
  setupAlinaLavoro();
  requireAccess_(accessCode);

  deleteRecord_(SHEETS.NOTE, String(noteId));
  log_('deleteNote', 'ok', String(noteId));

  return getBootstrap(accessCode);
}

function syncBatch(accessCode, actions) {
  setupAlinaLavoro();
  requireAccess_(accessCode);

  if (!actions || !actions.length) {
    log_('syncBatch', 'ok', 'Nessuna azione');
    return getBootstrap(accessCode);
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (e) {
    throw new Error('Operazione in corso, riprova tra qualche secondo');
  }
  try {
    actions.forEach(function (action) {
      if (!action || !action.type) {
        log_('syncBatch_action', 'skip', 'Azione vuota');
        return;
      }

      log_('syncBatch_action', 'start', action.type);

      if (action.type === 'saveShift') {
        saveShiftDirect_(action.payload);
      }

      if (action.type === 'saveSalary') {
        saveSalaryDirect_(action.payload);
      }

      if (action.type === 'saveNote') {
        saveNoteDirect_(action.payload);
      }

      if (action.type === 'deleteNote') {
        if (action.payload && action.payload.id) {
          deleteRecord_(SHEETS.NOTE, String(action.payload.id));
          log_('deleteNote_direct', 'ok', String(action.payload.id));
        }
      }

      if (action.type === 'saveConfig') {
        const patch = action.payload || {};
        Object.keys(patch).forEach(function (key) {
          setConfigValue_(key, String(patch[key]));
        });
        log_('saveConfig_direct', 'ok', 'Configurazione aggiornata');
      }

      log_('syncBatch_action', 'end', action.type);
    });

    log_('syncBatch', 'ok', String(actions.length) + ' azioni');

    return getBootstrap(accessCode);
  } finally {
    lock.releaseLock();
  }
}

function saveShiftDirect_(shift) {
  if (!shift) {
    throw new Error('Turno mancante');
  }

  if (!shift.id) {
    throw new Error('Turno senza ID');
  }

  if (!shift.data) {
    throw new Error('Data turno mancante');
  }

  const now = new Date().toISOString();

  const row = {
    id: String(shift.id),
    data: String(shift.data || ''),
    inizio: String(shift.inizio || ''),
    fine: String(shift.fine || ''),
    pausa_minuti: toNumber_(shift.pausa_minuti, 0),
    minuti_lavorati: toNumber_(shift.minuti_lavorati, 0),
    nota: String(shift.nota || ''),
    manuale: shift.manuale ? 'true' : 'false',
    creato_il: String(shift.creato_il || now),
    aggiornato_il: now,
    sync_version: String(shift.sync_version || now)
  };

  upsertRecord_(SHEETS.TURNI, HEADERS.TURNI, row);
  log_('saveShift_direct', 'ok', row.id);
}

function saveSalaryDirect_(salary) {
  if (!salary) {
    throw new Error('Stipendio mancante');
  }

  if (!salary.id) {
    throw new Error('Stipendio senza ID');
  }

  if (!salary.mese_lavorato) {
    throw new Error('Mese lavorato mancante');
  }

  const now = new Date().toISOString();
  const amount = toNumber_(salary.importo_reale, 0);
  const hours = toNumber_(salary.ore_mese, 0);
  const effective = hours > 0 ? amount / hours : toNumber_(salary.tariffa_effettiva, 0);

  const row = {
    id: String(salary.id),
    mese_lavorato: String(salary.mese_lavorato || ''),
    mese_busta: String(salary.mese_busta || ''),
    data_inserimento: String(salary.data_inserimento || today_()),
    importo_reale: amount,
    ore_mese: hours,
    tariffa_effettiva: effective,
    note: String(salary.note || ''),
    creato_il: String(salary.creato_il || now),
    aggiornato_il: now
  };

  upsertRecord_(SHEETS.STIPENDI, HEADERS.STIPENDI, row);
  log_('saveSalary_direct', 'ok', row.id);
}

function saveNoteDirect_(note) {
  if (!note) {
    throw new Error('Nota mancante');
  }

  if (!note.id) {
    throw new Error('Nota senza ID');
  }

  const now = new Date().toISOString();

  const row = {
    id: String(note.id),
    data: String(note.data || today_()),
    tipo: String(note.tipo || 'generale'),
    testo: String(note.testo || ''),
    completata: note.completata ? 'true' : 'false',
    creato_il: String(note.creato_il || now),
    aggiornato_il: now
  };

  upsertRecord_(SHEETS.NOTE, HEADERS.NOTE, row);
  log_('saveNote_direct', 'ok', row.id);
}

/**
 * TEST manuale: crea una riga finta in TURNI.
 */
function testSaveShiftManuale() {
  setupAlinaLavoro();

  const shift = {
    id: 'test_' + new Date().getTime(),
    data: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'),
    inizio: '08:00',
    fine: '',
    pausa_minuti: 0,
    minuti_lavorati: 0,
    nota: 'test manuale',
    manuale: true,
    creato_il: new Date().toISOString(),
    aggiornato_il: new Date().toISOString(),
    sync_version: new Date().toISOString()
  };

  saveShiftDirect_(shift);

  return {
    success: true,
    message: 'Test turno salvato',
    shift: shift
  };
}

function formatDateForImport_(value) {
  if (!value) {
    return '';
  }

  if (value instanceof Date) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }

  const txt = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(txt)) {
    return txt;
  }

  const parts = txt.split(/[\/\-.]/);

  if (parts.length === 3) {
    const d = String(parts[0]).padStart(2, '0');
    const m = String(parts[1]).padStart(2, '0');
    const y = String(parts[2]);

    if (y.length === 4) {
      return y + '-' + m + '-' + d;
    }
  }

  return '';
}

function formatTimeForImport_(value) {
  if (!value) {
    return '';
  }

  if (value instanceof Date) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'HH:mm');
  }

  if (typeof value === 'number') {
    const totalMinutes = Math.round(value * 24 * 60);
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;

    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  }

  const txt = String(value).trim();

  if (/^\d{1,2}:\d{2}$/.test(txt)) {
    const parts = txt.split(':');
    return String(parts[0]).padStart(2, '0') + ':' + parts[1];
  }

  return '';
}

function minutesFromImport_(inizio, fine, ore) {
  if (inizio && fine) {
    return computeMinutes_(inizio, fine, 0);
  }

  if (typeof ore === 'number') {
    if (ore > 0 && ore < 1) {
      return Math.round(ore * 24 * 60);
    }

    return Math.round(ore * 60);
  }

  if (ore) {
    const txt = String(ore).replace(',', '.').trim();
    const n = Number(txt);

    if (!isNaN(n)) {
      return Math.round(n * 60);
    }
  }

  return 0;
}

function getSpreadsheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (!ss) {
    throw new Error('Nessun Google Sheet attivo. Apri lo script dal foglio Google corretto.');
  }

  return ss;
}

function ensureSheet_(ss, name, headers) {
  let sh = ss.getSheetByName(name);

  if (!sh) {
    sh = ss.insertSheet(name);
  }

  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    return sh;
  }

  const lastCol = Math.max(sh.getLastColumn(), headers.length);
  const existing = sh.getRange(1, 1, 1, lastCol).getValues()[0];

  headers.forEach(function (header, index) {
    if (!existing[index]) {
      sh.getRange(1, index + 1).setValue(header);
    }
  });

  sh.setFrozenRows(1);

  return sh;
}

function getRecords_(sheetName) {
  const ss = getSpreadsheet_();
  const sh = ss.getSheetByName(sheetName);

  if (!sh || sh.getLastRow() < 2) {
    return [];
  }

  const lastCol = sh.getLastColumn();
  const headers = sh.getRange(1, 1, 1, lastCol).getValues()[0];
  const values = sh.getRange(2, 1, sh.getLastRow() - 1, lastCol).getValues();

  return values
    .filter(function (row) {
      return row.join('').trim() !== '';
    })
    .map(function (row) {
      const obj = {};
      headers.forEach(function (header, index) {
        if (!header) return;
        obj[header] = normalizeCell_(row[index]);
      });
      return obj;
    });
}

function upsertRecord_(sheetName, headers, record) {
  const ss = getSpreadsheet_();
  const sh = ensureSheet_(ss, sheetName, headers);

  const lastRow = sh.getLastRow();
  let targetRow = -1;

  if (lastRow >= 2) {
    const ids = sh.getRange(2, 1, lastRow - 1, 1).getValues();

    for (let i = 0; i < ids.length; i++) {
      if (String(ids[i][0]) === String(record.id)) {
        targetRow = i + 2;
        break;
      }
    }
  }

  const rowValues = headers.map(function (header) {
    return record[header] !== undefined ? record[header] : '';
  });

  if (targetRow > 0) {
    sh.getRange(targetRow, 1, 1, headers.length).setValues([rowValues]);
  } else {
    sh.appendRow(rowValues);
  }
}

function deleteRecord_(sheetName, id) {
  const ss = getSpreadsheet_();
  const sh = ss.getSheetByName(sheetName);

  if (!sh || sh.getLastRow() < 2) {
    return false;
  }

  const ids = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues();

  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) {
      sh.deleteRow(i + 2);
      return true;
    }
  }

  return false;
}

function getConfigRaw_() {
  const records = getRecords_(SHEETS.CONFIG);
  const cfg = {};

  records.forEach(function (record) {
    if (record.parametro) {
      cfg[String(record.parametro)] = String(record.valore);
    }
  });

  return cfg;
}

function setConfigValue_(key, value) {
  const ss = getSpreadsheet_();
  const sh = ensureSheet_(ss, SHEETS.CONFIG, HEADERS.CONFIG);

  const lastRow = sh.getLastRow();
  let targetRow = -1;

  if (lastRow >= 2) {
    const params = sh.getRange(2, 1, lastRow - 1, 1).getValues();

    for (let i = 0; i < params.length; i++) {
      if (String(params[i][0]) === String(key)) {
        targetRow = i + 2;
        break;
      }
    }
  }

  if (targetRow > 0) {
    sh.getRange(targetRow, 2).setValue(value);
  } else {
    sh.appendRow([key, value]);
  }
}

function safeConfig_(config) {
  const clone = {};

  Object.keys(config).forEach(function (key) {
    if (key === 'codice_accesso') return;
    clone[key] = config[key];
  });

  return clone;
}

function requireAccess_(code) {
  // V2.2.0: access code check removed — single-user personal app, URL is the key
}

function computeSummaries_(shifts, salaries, config) {
  const groups = {};

  shifts.forEach(function (shift) {
    if (!shift.data) return;

    const month = String(shift.data).substring(0, 7);

    if (!groups[month]) {
      groups[month] = {
        mese: month,
        minuti: 0,
        giorniSet: {},
        turni: 0
      };
    }

    const minutes =
      toNumber_(shift.minuti_lavorati, 0) ||
      computeMinutes_(shift.inizio, shift.fine, shift.pausa_minuti);

    groups[month].minuti += minutes;

    if (minutes > 0) {
      groups[month].giorniSet[String(shift.data)] = true;
    }

    groups[month].turni += 1;
  });

  const salaryByMonth = {};

  salaries.forEach(function (salary) {
    if (salary.mese_lavorato) {
      salaryByMonth[String(salary.mese_lavorato)] = salary;
    }
  });

  const averageRate = computeAverageRate_(groups, salaryByMonth, config);

  return Object.keys(groups)
    .sort()
    .reverse()
    .map(function (month) {
      const group = groups[month];
      const hours = group.minuti / 60;
      const estimated = Math.round(hours * averageRate);
      const salary = salaryByMonth[month] || null;
      const real = salary ? toNumber_(salary.importo_reale, 0) : null;
      const effective = real !== null && hours > 0 ? real / hours : null;

      return {
        mese: month,
        minuti: group.minuti,
        ore: round2_(hours),
        ore_label: minutesLabel_(group.minuti),
        giorni: Object.keys(group.giorniSet).length,
        turni: group.turni,
        tariffa_media: round2_(averageRate),
        stimato: estimated,
        stipendio_reale: real,
        differenza: real !== null ? Math.round(real - estimated) : null,
        tariffa_effettiva: effective !== null ? round2_(effective) : null
      };
    });
}

function computeAverageRate_(groups, salaryByMonth, config) {
  const fallback = toNumber_(config.tariffa_media_default, 10);
  const n = Math.max(1, parseInt(config.media_mesi || '6', 10));
  const months = Object.keys(salaryByMonth).sort().reverse();
  const rates = [];

  months.forEach(function (month) {
    if (rates.length >= n) return;

    const salary = salaryByMonth[month];
    const amount = toNumber_(salary.importo_reale, 0);

    let hours = 0;

    if (groups[month]) {
      hours = groups[month].minuti / 60;
    }

    if (!hours) {
      hours = toNumber_(salary.ore_mese, 0);
    }

    if (amount > 0 && hours > 0) {
      rates.push(amount / hours);
    }
  });

  if (!rates.length) {
    return fallback;
  }

  const sum = rates.reduce(function (a, b) {
    return a + b;
  }, 0);

  return sum / rates.length;
}

function computeSalaryReminder_(summaries, salaries, config) {
  const now = new Date();
  const day = now.getDate();
  const payrollDay = parseInt(config.giorno_busta || '10', 10);
  const offset = parseInt(config.promemoria_busta || '0', 10);
  const triggerDay = Math.max(1, payrollDay - offset);
  const previous = previousMonth_(now);

  const hasSalary = salaries.some(function (salary) {
    return String(salary.mese_lavorato) === previous;
  });

  return {
    active: day >= triggerDay && !hasSalary,
    mese_lavorato: previous,
    mese_busta: currentMonth_(now),
    giorno_busta: payrollDay,
    trigger_day: triggerDay
  };
}

function computeMinutes_(start, end, pause) {
  if (!start || !end) {
    return 0;
  }

  const s = parseTime_(start);
  const e = parseTime_(end);

  if (s === null || e === null) {
    return 0;
  }

  let minutes = e - s;

  if (minutes < 0) {
    minutes += 24 * 60;
  }

  minutes -= toNumber_(pause, 0);

  return Math.max(0, minutes);
}

function parseTime_(hhmm) {
  const parts = String(hhmm || '').split(':');

  if (parts.length < 2) {
    return null;
  }

  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);

  if (isNaN(h) || isNaN(m)) {
    return null;
  }

  return h * 60 + m;
}

function minutesLabel_(minutes) {
  minutes = Math.round(toNumber_(minutes, 0));

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return h + ' h ' + String(m).padStart(2, '0') + ' min';
}

function normalizeCell_(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
}

function toNumber_(value, fallback) {
  if (value === null || value === undefined || value === '') {
    return fallback || 0;
  }

  const n = Number(String(value).replace(',', '.'));

  if (isNaN(n)) {
    return fallback || 0;
  }

  return n;
}

function round2_(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}

function today_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function currentMonth_(date) {
  return Utilities.formatDate(date || new Date(), Session.getScriptTimeZone(), 'yyyy-MM');
}

function previousMonth_(date) {
  const d = date ? new Date(date) : new Date();

  d.setDate(1);
  d.setMonth(d.getMonth() - 1);

  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM');
}

function log_(action, status, message) {
  try {
    const ss = getSpreadsheet_();
    const sh = ensureSheet_(ss, SHEETS.SYNC_LOG, HEADERS.SYNC_LOG);

    sh.appendRow([
      new Date().toISOString(),
      action,
      status,
      message || ''
    ]);
  } catch (err) {
    // Non bloccare mai l'app per un errore di log.
  }
}

/**
 * Duplica un foglio come NAME_BACKUP_yyyyMMdd_HHmmss, poi mantiene al massimo 5 backup.
 * Registra su SYNC_LOG.
 */
function backupSheet_(sourceName) {
  const ss = getSpreadsheet_();
  const source = ss.getSheetByName(sourceName);

  if (!source) {
    throw new Error('Non trovo il foglio ' + sourceName);
  }

  const tz = Session.getScriptTimeZone();
  const suffix = Utilities.formatDate(new Date(), tz, 'yyyyMMdd_HHmmss');
  const backupName = sourceName + '_BACKUP_' + suffix;
  const copy = source.copyTo(ss);
  copy.setName(backupName);

  pruneBackupsForSheet_(ss, sourceName);

  log_('backupSheet_', 'ok', 'Backup creato: ' + backupName);
}

function pruneBackupsForSheet_(ss, sourceName) {
  const prefix = sourceName + '_BACKUP_';
  const sheets = ss.getSheets();
  const backups = [];

  sheets.forEach(function (sheet) {
    const name = sheet.getName();
    if (name.indexOf(prefix) === 0) {
      backups.push({ name: name, sheet: sheet });
    }
  });

  backups.sort(function (a, b) {
    return b.name.localeCompare(a.name);
  });

  for (let i = 5; i < backups.length; i++) {
    ss.deleteSheet(backups[i].sheet);
    log_('backupSheet_', 'ok', 'Rimosso backup vecchio: ' + backups[i].name);
  }
}

function eliminaTurniFuturi() {
  setupAlinaLavoro();
  backupSheet_('TURNI');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName('TURNI');

  if (!sh) {
    throw new Error('Non trovo il foglio TURNI');
  }

  const lastRow = sh.getLastRow();

  if (lastRow < 2) {
    return {
      success: true,
      message: 'Nessuna riga da controllare',
      eliminati: 0
    };
  }

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const todayStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');

  // TODO(eliminaTurniFuturi): verificare possibile off-by-one su lastRow-1 nelle getRange (ultima riga dati).
  const values = sh.getRange(2, 1, lastRow - 1, sh.getLastColumn()).getValues();

  const rowsToKeep = [];
  let eliminati = 0;

  values.forEach(function (row) {
    const dataObj = dateObjectForImport_(row[1]);

    if (dataObj && dataObj > todayEnd) {
      eliminati++;
    } else {
      rowsToKeep.push(row);
    }
  });

  sh.getRange(2, 1, lastRow - 1, sh.getLastColumn()).clearContent();

  if (rowsToKeep.length > 0) {
    sh.getRange(2, 1, rowsToKeep.length, sh.getLastColumn()).setValues(rowsToKeep);
  }

  log_('eliminaTurniFuturi', 'ok', 'Eliminati futuri: ' + eliminati);

  return {
    success: true,
    message: 'Turni futuri eliminati',
    eliminati: eliminati,
    oggi: todayStr
  };
}

function importaStoricoSoloFinoAOggi() {
  setupAlinaLavoro();
  backupSheet_('TURNI');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const source = ss.getSheetByName('Foglio1');
  const target = ss.getSheetByName('TURNI');

  if (!source) throw new Error('Non trovo Foglio1');
  if (!target) throw new Error('Non trovo TURNI');

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const values = source.getDataRange().getValues();
  const now = new Date().toISOString();
  const output = [];

  let importati = 0;
  let saltati = 0;
  let futuri = 0;

  for (let i = 1; i < values.length; i++) {
    const row = values[i];

    const dataRaw = row[0];   // A
    const inizioRaw = row[1]; // B
    const fineRaw = row[2];   // C
    const oreRaw = row[3];    // D

    const dataObj = dateObjectForImport_(dataRaw);

    if (!dataObj) {
      saltati++;
      continue;
    }

    if (dataObj > today) {
      futuri++;
      continue;
    }

    const dataIso = Utilities.formatDate(dataObj, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    const inizioTxt = formatTimeForImport_(inizioRaw);
    const fineTxt = formatTimeForImport_(fineRaw);
    const minuti = minutesFromImport_(inizioTxt, fineTxt, oreRaw);

    const isVuoto =
      (inizioTxt === '00:00' || !inizioTxt) &&
      (fineTxt === '00:00' || !fineTxt) &&
      !minuti;

    if (isVuoto) {
      saltati++;
      continue;
    }

    output.push([
      'storico_' + dataIso + '_' + String(i + 1),
      dataIso,
      inizioTxt,
      fineTxt,
      0,
      minuti,
      'importato da storico fino a oggi',
      'true',
      now,
      now,
      now
    ]);

    importati++;
  }

  if (target.getLastRow() > 1) {
    target.getRange(2, 1, target.getLastRow() - 1, HEADERS.TURNI.length).clearContent();
  }

  if (output.length > 0) {
    target.getRange(2, 1, output.length, HEADERS.TURNI.length).setValues(output);
  }

  log_(
    'importaStoricoSoloFinoAOggi',
    'ok',
    'Importati: ' + importati + ' - Futuri esclusi: ' + futuri + ' - Saltati: ' + saltati
  );

  SpreadsheetApp.flush();

  return {
    success: true,
    importati: importati,
    futuri_esclusi: futuri,
    saltati: saltati
  };
}

/**
 * Operazione manuale una tantum dall'editor Apps Script (dopo deploy V1.5).
 * Rimuove righe TURNI fantasma (00:00 / vuoti / 0 minuti). Backup TURNI prima dell'azione.
 */
function pulisciTurniVuoti() {
  setupAlinaLavoro();
  backupSheet_('TURNI');

  const ss = getSpreadsheet_();
  const sh = ss.getSheetByName('TURNI');

  if (!sh) {
    throw new Error('Non trovo il foglio TURNI');
  }

  const lastRow = sh.getLastRow();

  if (lastRow < 2) {
    log_('pulisciTurniVuoti', 'ok', 'Nessuna riga da pulire: 0');
    return {
      success: true,
      rimossi: 0
    };
  }

  const numCols = Math.max(sh.getLastColumn(), HEADERS.TURNI.length);
  const values = sh.getRange(2, 1, lastRow - 1, numCols).getValues();
  const kept = [];
  let rimossi = 0;

  values.forEach(function (row) {
    const inizio = String(row[2] || '').trim();
    const fine = String(row[3] || '').trim();
    const minuti = toNumber_(row[5], 0);
    const inizioVuoto = !inizio || inizio === '00:00';
    const fineVuoto = !fine || fine === '00:00';

    if (inizioVuoto && fineVuoto && minuti === 0) {
      rimossi++;
    } else {
      kept.push(row);
    }
  });

  sh.getRange(2, 1, lastRow - 1, numCols).clearContent();

  if (kept.length > 0) {
    sh.getRange(2, 1, kept.length, numCols).setValues(kept);
  }

  log_('pulisciTurniVuoti', 'ok', 'Righe vuote rimosse: ' + rimossi);
  SpreadsheetApp.flush();

  return {
    success: true,
    rimossi: rimossi
  };
}

function dateObjectForImport_(value) {
  if (!value) return null;

  if (value instanceof Date) {
    const d = new Date(value);
    d.setHours(12, 0, 0, 0);
    return d;
  }

  const txt = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(txt)) {
    const d = new Date(txt + 'T12:00:00');
    return isNaN(d.getTime()) ? null : d;
  }

  const parts = txt.split(/[\/\-.]/);

  if (parts.length === 3) {
    const day = String(parts[0]).padStart(2, '0');
    const month = String(parts[1]).padStart(2, '0');
    const year = String(parts[2]);

    if (year.length === 4) {
      const d = new Date(year + '-' + month + '-' + day + 'T12:00:00');
      return isNaN(d.getTime()) ? null : d;
    }
  }

  return null;
}

/* ==========================================================================
 * DATA IMPORT / EXPORT (tasks 0407–0412, 2026-05-16)
 *
 * Safe data portability: JSON backup, CSV per data type, import from CSV/JSON
 * paste or from a tab in the CURRENT Google Sheet.
 *
 * Safety contract:
 *   - Preview is read-only (no writes, no backup created).
 *   - Apply always calls backupSheet_() for each affected tab before writing.
 *   - Default mode is merge_skip_duplicates. Optional merge_update_duplicates.
 *   - No destructive replace_all in this version.
 *
 * Scope limitation:
 *   - appsscript.json uses 'spreadsheets.currentonly'. External Google Sheet
 *     by URL/ID is NOT accessible. previewImportFromSpreadsheet returns a
 *     clear error suggesting CSV paste, JSON paste, or sheet-tab mode.
 * ========================================================================== */

const IMPORT_EXPORT_FORMAT = 'alina-lavoro/v1';

function exportAllData(accessCode) {
  setupAlinaLavoro();
  requireAccess_(accessCode);
  log_('exportAllData', 'ok', 'JSON backup requested');
  return { success: true, data: buildExportBundle_() };
}

function getExportBundle(accessCode) {
  setupAlinaLavoro();
  requireAccess_(accessCode);
  const bundle = buildExportBundle_();
  return {
    success: true,
    json: JSON.stringify(bundle, null, 2),
    shiftsCsv: csvForRecords_(HEADERS.TURNI, bundle.shifts),
    salariesCsv: csvForRecords_(HEADERS.STIPENDI, bundle.salaries),
    notesCsv: csvForRecords_(HEADERS.NOTE, bundle.notes)
  };
}

function exportShiftsCsv(accessCode) {
  setupAlinaLavoro();
  requireAccess_(accessCode);
  return { success: true, csv: csvForRecords_(HEADERS.TURNI, getRecords_(SHEETS.TURNI)) };
}

function exportSalariesCsv(accessCode) {
  setupAlinaLavoro();
  requireAccess_(accessCode);
  return { success: true, csv: csvForRecords_(HEADERS.STIPENDI, getRecords_(SHEETS.STIPENDI)) };
}

function exportNotesCsv(accessCode) {
  setupAlinaLavoro();
  requireAccess_(accessCode);
  return { success: true, csv: csvForRecords_(HEADERS.NOTE, getRecords_(SHEETS.NOTE)) };
}

function buildExportBundle_() {
  const ss = getSpreadsheet_();
  const shifts = getRecords_(SHEETS.TURNI);
  const salaries = getRecords_(SHEETS.STIPENDI);
  const notes = getRecords_(SHEETS.NOTE);
  const config = safeConfig_(getConfigRaw_());

  return {
    alinaBackup: true,
    format: IMPORT_EXPORT_FORMAT,
    exportedAt: new Date().toISOString(),
    timezone: Session.getScriptTimeZone(),
    spreadsheetMeta: {
      name: ss.getName(),
      sheetCount: ss.getSheets().length
    },
    counts: {
      shifts: shifts.length,
      salaries: salaries.length,
      notes: notes.length
    },
    config: config,
    shifts: shifts,
    salaries: salaries,
    notes: notes
  };
}

function csvForRecords_(headers, records) {
  const lines = [csvLine_(headers)];

  records.forEach(function (record) {
    const cells = headers.map(function (header) {
      const value = record[header];
      return (value === null || value === undefined) ? '' : value;
    });
    lines.push(csvLine_(cells));
  });

  return lines.join('\r\n');
}

function csvLine_(cells) {
  return cells.map(csvCell_).join(',');
}

function csvCell_(value) {
  const text = (value === null || value === undefined) ? '' : String(value);

  if (text === '') {
    return '';
  }

  if (text.indexOf(',') >= 0 || text.indexOf('"') >= 0 || text.indexOf('\n') >= 0 || text.indexOf('\r') >= 0) {
    return '"' + text.replace(/"/g, '""') + '"';
  }

  return text;
}

function listImportableSheets(accessCode) {
  setupAlinaLavoro();
  requireAccess_(accessCode);

  const ss = getSpreadsheet_();
  const systemSheets = [SHEETS.TURNI, SHEETS.STIPENDI, SHEETS.NOTE, SHEETS.CONFIG, SHEETS.SYNC_LOG];
  const all = ss.getSheets().map(function (sheet) { return sheet.getName(); });
  const importable = all.filter(function (name) {
    if (systemSheets.indexOf(name) >= 0) return false;
    if (name.indexOf('_BACKUP_') >= 0) return false;
    return true;
  });

  return { success: true, sheets: importable, all: all };
}

function previewImportFromCsv(accessCode, csvText, dataType) {
  setupAlinaLavoro();
  requireAccess_(accessCode);

  if (!csvText || !String(csvText).trim()) {
    return { success: false, message: 'CSV vuoto' };
  }

  const parsed = parseCsv_(String(csvText));
  return buildImportPreview_(parsed, dataType, 'csv-paste');
}

function previewImportFromJson(accessCode, jsonText) {
  setupAlinaLavoro();
  requireAccess_(accessCode);

  if (!jsonText || !String(jsonText).trim()) {
    return { success: false, message: 'JSON vuoto' };
  }

  let obj;
  try {
    obj = JSON.parse(String(jsonText));
  } catch (err) {
    return { success: false, message: 'JSON non valido: ' + err.message };
  }

  if (!obj || obj.alinaBackup !== true) {
    return { success: false, message: 'Backup non riconosciuto (manca campo alinaBackup=true)' };
  }

  const sections = {};

  ['shifts', 'salaries', 'notes'].forEach(function (type) {
    const arr = Array.isArray(obj[type]) ? obj[type] : [];

    if (arr.length === 0) {
      sections[type] = {
        dataType: type,
        totalRows: 0,
        validCount: 0,
        invalidCount: 0,
        duplicateCount: 0,
        freshCount: 0,
        sample: [],
        duplicateSamples: [],
        invalidSamples: [],
        payload: { dataType: type, rows: [] }
      };
      return;
    }

    const parsed = { headers: Object.keys(arr[0] || {}), rows: arr };
    const preview = buildImportPreview_(parsed, type, 'json-backup');
    sections[type] = preview;
  });

  return {
    success: true,
    source: 'json-backup',
    format: obj.format || 'unknown',
    exportedAt: obj.exportedAt || '',
    counts: obj.counts || {},
    sections: sections
  };
}

function previewImportFromSheetTab(accessCode, sheetName, dataType) {
  setupAlinaLavoro();
  requireAccess_(accessCode);

  if (!sheetName) {
    return { success: false, message: 'Nome foglio mancante' };
  }

  const ss = getSpreadsheet_();
  const sh = ss.getSheetByName(sheetName);

  if (!sh) {
    return { success: false, message: 'Foglio "' + sheetName + '" non trovato nel Google Sheet corrente' };
  }

  if (sh.getLastRow() < 2) {
    return { success: false, message: 'Foglio "' + sheetName + '" senza dati (servono intestazioni + righe)' };
  }

  const lastCol = sh.getLastColumn();
  const headers = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) {
    return String(h || '').trim();
  });
  const values = sh.getRange(2, 1, sh.getLastRow() - 1, lastCol).getValues();

  const rows = values
    .filter(function (row) { return row.join('').trim() !== ''; })
    .map(function (row) {
      const obj = {};
      headers.forEach(function (header, idx) {
        if (header) obj[header] = row[idx];
      });
      return obj;
    });

  return buildImportPreview_({ headers: headers, rows: rows }, dataType, 'sheet-tab:' + sheetName);
}

function previewImportFromSpreadsheet(accessCode, urlOrId, sheetName, dataType) {
  setupAlinaLavoro();
  requireAccess_(accessCode);

  return {
    success: false,
    deferred: true,
    message: 'Import da Google Sheet esterno non disponibile in questa versione (scope OAuth corrente: spreadsheets.currentonly). Alternative: (1) crea un foglio nel Google Sheet corrente con i dati e usa la modalità "Foglio del Google Sheet"; (2) copia il CSV da Google Sheets e usa la modalità "Incolla CSV"; (3) usa un backup JSON.'
  };
}

function buildImportPreview_(parsed, dataType, source) {
  const headers = parsed.headers || [];
  const rows = parsed.rows || [];

  if (rows.length === 0) {
    return { success: false, message: 'Nessuna riga dati trovata' };
  }

  let detected = dataType;

  if (!detected) {
    detected = detectDataType_(headers);
  }

  if (!detected) {
    return {
      success: false,
      message: 'Tipo dati non riconosciuto dalle intestazioni. Specifica turni / stipendi / note.',
      headersDetected: headers
    };
  }

  const normalized = rows.map(function (row) {
    return normalizeImportRow_(row, detected);
  });

  const valid = [];
  const invalid = [];

  normalized.forEach(function (row, idx) {
    const errors = validateRow_(row, detected);
    if (errors.length === 0) {
      valid.push(row);
    } else {
      invalid.push({ index: idx, errors: errors, sample: rowSummary_(row, detected) });
    }
  });

  const existing = loadExistingForType_(detected);
  const existingIds = {};
  const existingBySig = {};

  existing.forEach(function (rec) {
    if (rec.id) existingIds[String(rec.id)] = String(rec.id);
    const sig = duplicateSignature_(rec, detected);
    if (sig) existingBySig[sig] = String(rec.id || '');
  });

  const fresh = [];
  const duplicates = [];

  valid.forEach(function (row) {
    let isDup = false;
    if (row.id && existingIds[String(row.id)]) {
      isDup = true;
    } else {
      const sig = duplicateSignature_(row, detected);
      if (sig && existingBySig[sig]) isDup = true;
    }
    if (isDup) {
      duplicates.push(row);
    } else {
      fresh.push(row);
    }
  });

  return {
    success: true,
    source: source,
    dataType: detected,
    headersDetected: headers,
    totalRows: rows.length,
    validCount: valid.length,
    invalidCount: invalid.length,
    duplicateCount: duplicates.length,
    freshCount: fresh.length,
    sample: fresh.slice(0, 5).map(function (r) { return rowSummary_(r, detected); }),
    duplicateSamples: duplicates.slice(0, 10).map(function (r) { return rowSummary_(r, detected); }),
    invalidSamples: invalid.slice(0, 10),
    payload: { dataType: detected, rows: valid }
  };
}

function detectDataType_(headers) {
  const lower = headers.map(function (h) { return String(h || '').toLowerCase().trim(); });

  if (lower.indexOf('mese_lavorato') >= 0 || lower.indexOf('importo_reale') >= 0) {
    return 'salaries';
  }

  if (lower.indexOf('testo') >= 0 && (lower.indexOf('tipo') >= 0 || lower.indexOf('completata') >= 0)) {
    return 'notes';
  }

  if (lower.indexOf('data') >= 0 &&
      (lower.indexOf('inizio') >= 0 || lower.indexOf('fine') >= 0 ||
       lower.indexOf('minuti_lavorati') >= 0 || lower.indexOf('ore') >= 0 ||
       lower.indexOf('pausa_minuti') >= 0)) {
    return 'shifts';
  }

  return null;
}

function normalizeImportRow_(row, dataType) {
  const mapped = mapImportHeaders_(row, dataType);

  if (dataType === 'shifts') return normalizeShiftRow_(mapped);
  if (dataType === 'salaries') return normalizeSalaryRow_(mapped);
  if (dataType === 'notes') return normalizeNoteRow_(mapped);

  return mapped;
}

function mapImportHeaders_(row, dataType) {
  const aliases = importHeaderAliases_();
  const aliasMap = aliases[dataType] || {};
  const result = {};

  Object.keys(row).forEach(function (originalKey) {
    const key = String(originalKey || '').toLowerCase().trim();
    const target = aliasMap[key] || key;
    if (target) {
      result[target] = row[originalKey];
    }
  });

  return result;
}

function importHeaderAliases_() {
  return {
    shifts: {
      'id': 'id',
      'data': 'data',
      'date': 'data',
      'giorno': 'data',
      'day': 'data',
      'inizio': 'inizio',
      'start': 'inizio',
      'ora_inizio': 'inizio',
      'orario_inizio': 'inizio',
      'fine': 'fine',
      'end': 'fine',
      'ora_fine': 'fine',
      'orario_fine': 'fine',
      'pausa': 'pausa_minuti',
      'pausa_minuti': 'pausa_minuti',
      'pause': 'pausa_minuti',
      'break': 'pausa_minuti',
      'minuti_lavorati': 'minuti_lavorati',
      'minuti': 'minuti_lavorati',
      'minutes': 'minuti_lavorati',
      'ore': 'ore',
      'hours': 'ore',
      'ore_lavorate': 'ore',
      'nota': 'nota',
      'note': 'nota',
      'commento': 'nota',
      'manuale': 'manuale',
      'manual': 'manuale',
      'creato_il': 'creato_il',
      'created_at': 'creato_il',
      'aggiornato_il': 'aggiornato_il',
      'updated_at': 'aggiornato_il',
      'sync_version': 'sync_version'
    },
    salaries: {
      'id': 'id',
      'mese_lavorato': 'mese_lavorato',
      'worked_month': 'mese_lavorato',
      'mese': 'mese_lavorato',
      'month': 'mese_lavorato',
      'mese_busta': 'mese_busta',
      'payslip_month': 'mese_busta',
      'data_inserimento': 'data_inserimento',
      'inserito_il': 'data_inserimento',
      'importo_reale': 'importo_reale',
      'importo': 'importo_reale',
      'amount': 'importo_reale',
      'salary': 'importo_reale',
      'stipendio': 'importo_reale',
      'ore_mese': 'ore_mese',
      'hours_month': 'ore_mese',
      'tariffa_effettiva': 'tariffa_effettiva',
      'rate': 'tariffa_effettiva',
      'note': 'note',
      'nota': 'note',
      'creato_il': 'creato_il',
      'aggiornato_il': 'aggiornato_il'
    },
    notes: {
      'id': 'id',
      'data': 'data',
      'date': 'data',
      'tipo': 'tipo',
      'type': 'tipo',
      'category': 'tipo',
      'testo': 'testo',
      'text': 'testo',
      'message': 'testo',
      'completata': 'completata',
      'completed': 'completata',
      'done': 'completata',
      'creato_il': 'creato_il',
      'aggiornato_il': 'aggiornato_il'
    }
  };
}

function normalizeShiftRow_(row) {
  const data = parseImportDate_(row.data);
  const inizio = parseImportTime_(row.inizio);
  const fine = parseImportTime_(row.fine);
  const pausa = toNumber_(row.pausa_minuti, 0);
  let minuti = toNumber_(row.minuti_lavorati, 0);

  if (!minuti) {
    minuti = minutesFromImport_(inizio, fine, row.ore);
  }

  return {
    id: row.id ? String(row.id) : '',
    data: data,
    inizio: inizio,
    fine: fine,
    pausa_minuti: pausa,
    minuti_lavorati: minuti,
    nota: row.nota !== undefined && row.nota !== null ? String(row.nota) : '',
    manuale: parseBool_(row.manuale, true),
    creato_il: row.creato_il ? String(row.creato_il) : '',
    aggiornato_il: row.aggiornato_il ? String(row.aggiornato_il) : '',
    sync_version: row.sync_version ? String(row.sync_version) : ''
  };
}

function normalizeSalaryRow_(row) {
  return {
    id: row.id ? String(row.id) : '',
    mese_lavorato: parseImportMonth_(row.mese_lavorato),
    mese_busta: parseImportMonth_(row.mese_busta),
    data_inserimento: parseImportDate_(row.data_inserimento),
    importo_reale: toNumber_(row.importo_reale, 0),
    ore_mese: toNumber_(row.ore_mese, 0),
    tariffa_effettiva: toNumber_(row.tariffa_effettiva, 0),
    note: row.note !== undefined && row.note !== null ? String(row.note) : '',
    creato_il: row.creato_il ? String(row.creato_il) : '',
    aggiornato_il: row.aggiornato_il ? String(row.aggiornato_il) : ''
  };
}

function normalizeNoteRow_(row) {
  return {
    id: row.id ? String(row.id) : '',
    data: parseImportDate_(row.data),
    tipo: row.tipo ? String(row.tipo) : 'generale',
    testo: row.testo !== undefined && row.testo !== null ? String(row.testo) : '',
    completata: parseBool_(row.completata, false),
    creato_il: row.creato_il ? String(row.creato_il) : '',
    aggiornato_il: row.aggiornato_il ? String(row.aggiornato_il) : ''
  };
}

function parseImportDate_(value) {
  if (value === null || value === undefined || value === '') return '';

  if (value instanceof Date) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }

  const txt = String(value).trim();

  if (!txt) return '';

  if (/^\d{4}-\d{2}-\d{2}/.test(txt)) {
    return txt.substring(0, 10);
  }

  if (/^\d{4}\/\d{2}\/\d{2}$/.test(txt)) {
    return txt.replace(/\//g, '-');
  }

  const match = txt.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
  if (match) {
    return match[3] + '-' + String(match[2]).padStart(2, '0') + '-' + String(match[1]).padStart(2, '0');
  }

  return '';
}

function parseImportMonth_(value) {
  if (value === null || value === undefined || value === '') return '';

  if (value instanceof Date) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM');
  }

  const txt = String(value).trim();

  if (!txt) return '';

  if (/^\d{4}-\d{2}$/.test(txt)) return txt;

  if (/^\d{4}-\d{2}-\d{2}/.test(txt)) return txt.substring(0, 7);

  if (/^\d{4}\/\d{2}/.test(txt)) return txt.substring(0, 7).replace('/', '-');

  const match = txt.match(/^(\d{1,2})[\/\-](\d{4})$/);
  if (match) {
    return match[2] + '-' + String(match[1]).padStart(2, '0');
  }

  return '';
}

function parseImportTime_(value) {
  return formatTimeForImport_(value);
}

function parseBool_(value, defaultVal) {
  if (value === true || value === false) return value;
  if (value === null || value === undefined || value === '') return !!defaultVal;

  const txt = String(value).trim().toLowerCase();

  if (txt === 'true' || txt === 'yes' || txt === 'si' || txt === 'sì' || txt === '1' || txt === 'da' || txt === 'true_value') return true;
  if (txt === 'false' || txt === 'no' || txt === '0' || txt === 'нет') return false;

  return !!defaultVal;
}

function validateRow_(row, dataType) {
  const errors = [];

  if (dataType === 'shifts') {
    if (!row.data) {
      errors.push('data mancante o formato non valido');
    }

    const hasStart = !!row.inizio;
    const hasEnd = !!row.fine;
    const hasMinutes = toNumber_(row.minuti_lavorati, 0) > 0;

    if (!hasStart && !hasEnd && !hasMinutes) {
      errors.push('orario o durata mancante (servono inizio, oppure inizio+fine, oppure minuti_lavorati)');
    }
  } else if (dataType === 'salaries') {
    if (!row.mese_lavorato) errors.push('mese_lavorato mancante o non valido (atteso YYYY-MM)');
    if (!(toNumber_(row.importo_reale, 0) > 0)) errors.push('importo_reale mancante o non positivo');
  } else if (dataType === 'notes') {
    if (!row.testo) errors.push('testo mancante');
    if (!row.data) errors.push('data mancante o non valida');
  } else {
    errors.push('tipo dati sconosciuto');
  }

  return errors;
}

function rowSummary_(row, dataType) {
  if (dataType === 'shifts') {
    const dur = toNumber_(row.minuti_lavorati, 0);
    const note = row.nota ? ' · ' + String(row.nota).substring(0, 30) : '';
    return row.data + ' ' + (row.inizio || '?') + '–' + (row.fine || '?') + ' (' + dur + 'min)' + note;
  }
  if (dataType === 'salaries') {
    return row.mese_lavorato + ' · € ' + toNumber_(row.importo_reale, 0);
  }
  if (dataType === 'notes') {
    return row.data + ' [' + (row.tipo || 'generale') + '] ' + String(row.testo || '').substring(0, 40);
  }
  return JSON.stringify(row).substring(0, 60);
}

function duplicateSignature_(row, dataType) {
  if (dataType === 'shifts') {
    return row.data + '|' + (row.inizio || '') + '|' + (row.fine || '');
  }
  if (dataType === 'salaries') {
    return 'm:' + (row.mese_lavorato || '');
  }
  if (dataType === 'notes') {
    return (row.data || '') + '|' + (row.tipo || '') + '|' + (row.testo || '');
  }
  return null;
}

function loadExistingForType_(dataType) {
  if (dataType === 'shifts') return getRecords_(SHEETS.TURNI);
  if (dataType === 'salaries') return getRecords_(SHEETS.STIPENDI);
  if (dataType === 'notes') return getRecords_(SHEETS.NOTE);
  return [];
}

function sheetNameForType_(dataType) {
  if (dataType === 'shifts') return SHEETS.TURNI;
  if (dataType === 'salaries') return SHEETS.STIPENDI;
  if (dataType === 'notes') return SHEETS.NOTE;
  throw new Error('Tipo dati sconosciuto: ' + dataType);
}

function applyImport(accessCode, payload, options) {
  setupAlinaLavoro();
  requireAccess_(accessCode);

  options = options || {};
  const mode = options.mode || 'merge_skip_duplicates';

  if (mode === 'replace_all') {
    return { success: false, message: 'Modalità replace_all non disponibile per sicurezza. Usa merge_skip_duplicates o merge_update_duplicates.' };
  }

  if (mode !== 'merge_skip_duplicates' && mode !== 'merge_update_duplicates') {
    return { success: false, message: 'Modalità non riconosciuta: ' + mode };
  }

  if (!payload) {
    return { success: false, message: 'Payload mancante' };
  }

  let sections;

  if (payload.sections) {
    sections = payload.sections;
  } else if (payload.dataType && Array.isArray(payload.rows)) {
    sections = {};
    sections[payload.dataType] = { rows: payload.rows };
  } else {
    return { success: false, message: 'Payload non valido (atteso { dataType, rows } o { sections: {...} })' };
  }

  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(15000);
  } catch (err) {
    return { success: false, message: 'Operazione in corso, riprova tra qualche secondo' };
  }

  try {
    const result = {
      success: true,
      mode: mode,
      backups: [],
      inserted: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      details: {},
      errors: []
    };

    ['shifts', 'salaries', 'notes'].forEach(function (type) {
      const section = sections[type];

      if (!section || !Array.isArray(section.rows) || section.rows.length === 0) {
        return;
      }

      const sheetName = sheetNameForType_(type);

      try {
        backupSheet_(sheetName);
        result.backups.push(sheetName);
      } catch (err) {
        result.errors.push('Backup ' + sheetName + ' fallito: ' + err.message);
        result.success = false;
        return;
      }

      const existing = loadExistingForType_(type);
      const existingIds = {};
      const existingBySig = {};

      existing.forEach(function (rec) {
        if (rec.id) existingIds[String(rec.id)] = String(rec.id);
        const sig = duplicateSignature_(rec, type);
        if (sig) existingBySig[sig] = String(rec.id || '');
      });

      const detail = { inserted: 0, updated: 0, skipped: 0, failed: 0, errors: [] };

      section.rows.forEach(function (row) {
        const errors = validateRow_(row, type);

        if (errors.length > 0) {
          detail.failed++;
          detail.errors.push('Riga invalida: ' + errors.join(', ') + ' [' + rowSummary_(row, type) + ']');
          return;
        }

        let matchId = null;

        if (row.id && existingIds[String(row.id)]) {
          matchId = existingIds[String(row.id)];
        } else {
          const sig = duplicateSignature_(row, type);
          if (sig && existingBySig[sig]) {
            matchId = existingBySig[sig];
          }
        }

        try {
          if (matchId) {
            if (mode === 'merge_update_duplicates') {
              const updated = prepareRowForWrite_(row, type, matchId);
              writeRowForType_(type, updated);
              detail.updated++;
            } else {
              detail.skipped++;
              return;
            }
          } else {
            const inserted = prepareRowForWrite_(row, type, null);
            writeRowForType_(type, inserted);
            detail.inserted++;
            existingIds[String(inserted.id)] = String(inserted.id);

            const sig = duplicateSignature_(inserted, type);
            if (sig) existingBySig[sig] = String(inserted.id);
          }
        } catch (err) {
          detail.failed++;
          detail.errors.push('Errore scrittura: ' + err.message);
        }
      });

      result.details[type] = detail;
      result.inserted += detail.inserted;
      result.updated += detail.updated;
      result.skipped += detail.skipped;
      result.failed += detail.failed;
    });

    log_('applyImport', 'ok', JSON.stringify({
      mode: mode,
      inserted: result.inserted,
      updated: result.updated,
      skipped: result.skipped,
      failed: result.failed
    }));

    SpreadsheetApp.flush();

    return result;
  } finally {
    lock.releaseLock();
  }
}

function prepareRowForWrite_(row, dataType, overrideId) {
  const now = new Date().toISOString();

  let id = overrideId || row.id;

  if (!id) {
    const prefix = dataType === 'shifts' ? 'shift' : (dataType === 'salaries' ? 'salary' : 'note');
    id = prefix + '_imp_' + Date.now() + '_' + Math.floor(Math.random() * 1000000).toString(36);
  }

  if (dataType === 'shifts') {
    return {
      id: String(id),
      data: String(row.data || ''),
      inizio: String(row.inizio || ''),
      fine: String(row.fine || ''),
      pausa_minuti: toNumber_(row.pausa_minuti, 0),
      minuti_lavorati: toNumber_(row.minuti_lavorati, 0),
      nota: String(row.nota || ''),
      manuale: row.manuale ? 'true' : 'false',
      creato_il: String(row.creato_il || now),
      aggiornato_il: now,
      sync_version: String(row.sync_version || now)
    };
  }

  if (dataType === 'salaries') {
    return {
      id: String(id),
      mese_lavorato: String(row.mese_lavorato || ''),
      mese_busta: String(row.mese_busta || ''),
      data_inserimento: String(row.data_inserimento || today_()),
      importo_reale: toNumber_(row.importo_reale, 0),
      ore_mese: toNumber_(row.ore_mese, 0),
      tariffa_effettiva: toNumber_(row.tariffa_effettiva, 0),
      note: String(row.note || ''),
      creato_il: String(row.creato_il || now),
      aggiornato_il: now
    };
  }

  if (dataType === 'notes') {
    return {
      id: String(id),
      data: String(row.data || today_()),
      tipo: String(row.tipo || 'generale'),
      testo: String(row.testo || ''),
      completata: row.completata ? 'true' : 'false',
      creato_il: String(row.creato_il || now),
      aggiornato_il: now
    };
  }

  throw new Error('Tipo dati non gestito: ' + dataType);
}

function writeRowForType_(dataType, row) {
  if (dataType === 'shifts') {
    upsertRecord_(SHEETS.TURNI, HEADERS.TURNI, row);
  } else if (dataType === 'salaries') {
    upsertRecord_(SHEETS.STIPENDI, HEADERS.STIPENDI, row);
  } else if (dataType === 'notes') {
    upsertRecord_(SHEETS.NOTE, HEADERS.NOTE, row);
  } else {
    throw new Error('Tipo non gestito: ' + dataType);
  }
}

function parseCsv_(text) {
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.substring(1);
  }

  // Detect tab-separated (Google Sheets paste): if first line has tabs but no commas, treat as TSV
  const firstNewline = text.indexOf('\n');
  const firstLine = firstNewline >= 0 ? text.substring(0, firstNewline) : text;

  if (firstLine.indexOf('\t') >= 0 && firstLine.indexOf(',') < 0) {
    return parseTsv_(text);
  }

  const rows = [];
  let cur = '';
  let curRow = [];
  let inQuotes = false;
  let i = 0;
  const len = text.length;

  while (i < len) {
    const ch = text.charAt(i);

    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < len && text.charAt(i + 1) === '"') {
          cur += '"';
          i += 2;
        } else {
          inQuotes = false;
          i++;
        }
      } else {
        cur += ch;
        i++;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
      } else if (ch === ',') {
        curRow.push(cur);
        cur = '';
        i++;
      } else if (ch === '\r') {
        if (i + 1 < len && text.charAt(i + 1) === '\n') {
          i++;
        }
        curRow.push(cur);
        rows.push(curRow);
        curRow = [];
        cur = '';
        i++;
      } else if (ch === '\n') {
        curRow.push(cur);
        rows.push(curRow);
        curRow = [];
        cur = '';
        i++;
      } else {
        cur += ch;
        i++;
      }
    }
  }

  if (cur !== '' || curRow.length > 0) {
    curRow.push(cur);
    rows.push(curRow);
  }

  if (rows.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = rows[0].map(function (h) { return String(h).trim(); });
  const dataRows = rows.slice(1).filter(function (row) {
    return row.some(function (c) { return String(c).trim() !== ''; });
  }).map(function (row) {
    const obj = {};
    headers.forEach(function (header, idx) {
      if (header) obj[header] = row[idx] !== undefined ? row[idx] : '';
    });
    return obj;
  });

  return { headers: headers, rows: dataRows };
}

function parseTsv_(text) {
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.substring(1);
  }

  const lines = text.split(/\r\n|\r|\n/).filter(function (l) { return l.trim() !== ''; });

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = lines[0].split('\t').map(function (h) { return String(h).trim(); });
  const rows = lines.slice(1).map(function (line) {
    const cells = line.split('\t');
    const obj = {};
    headers.forEach(function (h, i) {
      if (h) obj[h] = cells[i] !== undefined ? cells[i] : '';
    });
    return obj;
  });

  return { headers: headers, rows: rows };
}