/**
 * Alina Lavoro - V1.4
 * Backend Google Apps Script
 * Realizzata da Tuso Martino
 *
 * Versione con importazione storico veloce in blocco.
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

function doGet(e) {
  setupAlinaLavoro();

  return HtmlService
    .createHtmlOutputFromFile('Index')
    .setTitle('Alina Lavoro')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
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

  saveShiftDirect_(shift);

  return getBootstrap(accessCode);
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

/**
 * IMPORTAZIONE VELOCE STORICO
 *
 * Legge da Foglio1:
 * A = Data
 * B = Inizio
 * C = Fine
 * D = Ore lavorate
 *
 * Scrive in TURNI in blocco con setValues().
 * Molto più veloce della vecchia versione riga-per-riga.
 */
function importaStoricoDaFoglio1() {
  setupAlinaLavoro();

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const source = ss.getSheetByName('Foglio1');
  const target = ss.getSheetByName('TURNI');

  if (!source) {
    throw new Error('Non trovo il foglio sorgente Foglio1');
  }

  if (!target) {
    throw new Error('Non trovo il foglio destinazione TURNI');
  }

  const sourceValues = source.getDataRange().getValues();

  if (!sourceValues || sourceValues.length < 2) {
    throw new Error('Foglio1 non contiene righe da importare');
  }

  // Pulisce TURNI lasciando solo intestazione.
  const lastTargetRow = target.getLastRow();
  if (lastTargetRow > 1) {
    target.getRange(2, 1, lastTargetRow - 1, HEADERS.TURNI.length).clearContent();
  }

  const now = new Date().toISOString();
  const output = [];
  let importati = 0;
  let saltati = 0;

  for (let i = 1; i < sourceValues.length; i++) {
    const row = sourceValues[i];

    const dataRaw = row[0];     // A
    const inizioRaw = row[1];   // B
    const fineRaw = row[2];     // C
    const oreRaw = row[3];      // D

    const dataIso = formatDateForImport_(dataRaw);
    const inizioTxt = formatTimeForImport_(inizioRaw);
    const fineTxt = formatTimeForImport_(fineRaw);
    const minuti = minutesFromImport_(inizioTxt, fineTxt, oreRaw);

    if (!dataIso) {
      saltati++;
      continue;
    }

    if (!inizioTxt && !fineTxt && !minuti) {
      saltati++;
      continue;
    }

    const id = 'storico_' + dataIso + '_' + String(i + 1);

    output.push([
      id,
      dataIso,
      inizioTxt,
      fineTxt,
      0,
      minuti,
      'importato da storico',
      'true',
      now,
      now,
      now
    ]);

    importati++;
  }

  if (output.length > 0) {
    target
      .getRange(2, 1, output.length, HEADERS.TURNI.length)
      .setValues(output);
  }

  log_(
    'importaStoricoDaFoglio1',
    'ok',
    'Importati: ' + importati + ' - Saltati: ' + saltati
  );

  SpreadsheetApp.flush();

  return {
    success: true,
    message: 'Importazione completata',
    importati: importati,
    saltati: saltati
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
  const cfg = getConfigRaw_();
  const expected = String(cfg.codice_accesso || DEFAULT_ACCESS_CODE);

  if (String(code || '') !== expected) {
    throw new Error('Codice accesso non valido');
  }
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

function eliminaTurniFuturi() {
  setupAlinaLavoro();

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

  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const values = sh.getRange(2, 1, lastRow - 1, sh.getLastColumn()).getValues();

  const rowsToKeep = [];
  let eliminati = 0;

  values.forEach(function(row) {
    const data = String(row[1] || '').trim(); // colonna B = data

    if (data && data > today) {
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
    oggi: today
  };
}

function importaStoricoSoloFinoAOggi() {
  setupAlinaLavoro();

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

    if (!inizioTxt && !fineTxt && !minuti) {
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