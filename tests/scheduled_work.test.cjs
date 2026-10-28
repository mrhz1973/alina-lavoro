const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

class FakeSheet {
  constructor(name) { this.name = name; this.rows = []; }
  getName() { return this.name; }
  getLastRow() { return this.rows.length; }
  getLastColumn() { return Math.max(0, ...this.rows.map(row => row.length)); }
  setFrozenRows() {}
  appendRow(values) { this.rows.push(values.slice()); }
  getRange(row, column, height = 1, width = 1) {
    const sheet = this;
    return {
      getValues() {
        return Array.from({ length: height }, (_, r) =>
          Array.from({ length: width }, (_, c) => (sheet.rows[row - 1 + r] || [])[column - 1 + c] ?? ''));
      },
      setValues(values) {
        for (let r = 0; r < height; r++) {
          if (!sheet.rows[row - 1 + r]) sheet.rows[row - 1 + r] = [];
          for (let c = 0; c < width; c++) sheet.rows[row - 1 + r][column - 1 + c] = values[r][c];
        }
        return this;
      },
      setValue(value) { return this.setValues([[value]]); },
      setFontWeight() { return this; }
    };
  }
}

class FakeSpreadsheet {
  constructor() { this.sheets = new Map(); }
  getSheetByName(name) { return this.sheets.get(name) || null; }
  insertSheet(name) { const sheet = new FakeSheet(name); this.sheets.set(name, sheet); return sheet; }
  getSheets() { return [...this.sheets.values()]; }
  getName() { return 'Synthetic test'; }
}

function createApp(options = {}) {
  const spreadsheet = new FakeSpreadsheet();
  const activeSpreadsheet = Object.hasOwn(options, 'activeSpreadsheet') ? options.activeSpreadsheet : spreadsheet;
  const context = vm.createContext({
    console, Date, Math, JSON, Number, String, Object, Array, RegExp, Set, isNaN,
    SpreadsheetApp: {
      getActiveSpreadsheet: () => activeSpreadsheet,
      openById: options.openById || (() => spreadsheet),
      flush() {}
    },
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => options.spreadsheetId || null }) },
    Session: { getScriptTimeZone: () => 'Europe/Rome' },
    Utilities: { formatDate: (date, _zone, fmt) => fmt === 'yyyy-MM' ? date.toISOString().slice(0, 7) : date.toISOString().slice(0, 10) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) }
  });
  const source = fs.readFileSync(path.join(__dirname, '../src/backend/Code.gs'), 'utf8');
  vm.runInContext(source, context);
  context.backupSheet_ = () => {};
  context.setupAlinaLavoro();
  return { context, spreadsheet };
}

test('a web app uses the explicitly configured sheet and never silently falls back to another one', () => {
  const selected = new FakeSpreadsheet();
  const active = new FakeSpreadsheet();
  const ids = [];
  const { context: app } = createApp({
    spreadsheetId: 'synthetic-sheet-id',
    activeSpreadsheet: active,
    openById(id) { ids.push(id); return selected; }
  });
  assert.equal(app.getSpreadsheet_(), selected);
  assert.ok(ids.length > 0);
  assert.ok(ids.every(id => id === 'synthetic-sheet-id'));
  assert.equal(active.getSheets().length, 0);

  app.SpreadsheetApp.openById = () => { throw new Error('access denied'); };
  assert.throws(() => app.getSpreadsheet_(), /access denied/);
  app.PropertiesService.getScriptProperties = () => ({ getProperty: () => null });
  app.SpreadsheetApp.getActiveSpreadsheet = () => null;
  assert.throws(() => app.getSpreadsheet_(), /ALINA_SPREADSHEET_ID/);
});

test('the isolated candidate requires the deploying account and can open its configured sheet', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '../appsscript.json'), 'utf8'));
  assert.equal(manifest.webapp.access, 'MYSELF');
  assert.equal(manifest.webapp.executeAs, 'USER_DEPLOYING');
  assert.ok(manifest.oauthScopes.includes('https://www.googleapis.com/auth/spreadsheets'));
});

function record(date, slot, start, end, state, revision) {
  return { id: `${date}#${slot}`, data: date, fascia: String(slot), minuto_inizio: start,
    minuto_fine: end, stato: state, revisione: revision };
}

test('the app page includes the scheduled module while keeping the legacy route separate', () => {
  const { context: app } = createApp();
  const frontend = path.join(__dirname, '../src/frontend');
  function output(content) {
    return { content, getContent() { return this.content; }, setTitle() { return this; },
      addMetaTag() { return this; }, setXFrameOptionsMode() { return this; } };
  }
  app.HtmlService = {
    createHtmlOutputFromFile(name) { return output(fs.readFileSync(path.join(frontend, name + '.html'), 'utf8')); },
    createHtmlOutput(content) { return output(content); }, XFrameOptionsMode: { ALLOWALL: 'allow' }
  };
  const page = app.doGet({ parameter: {} }).getContent();
  assert.match(page, /function scheduledStart_/);
  assert.match(page, /function renderHome/);
  assert.doesNotMatch(page, /SCHEDULED_WORK_MODULE/);
  const diagnostic = app.doGet({ parameter: { route: 'runtime-forensic-0448' } }).getContent();
  assert.match(diagnostic, /0448-runtime-forensic/);
  assert.doesNotMatch(diagnostic, /function scheduledStart_/);
});

test('scheduled shifts are separate from the existing shift and salary summaries', () => {
  const { context: app } = createApp();
  app.saveShiftDirect_({ id: 'legacy-1', data: '2026-03-03', inizio: '09:00', fine: '12:00', minuti_lavorati: 180 });
  const first = record('2026-03-03', 1, 420, 570, 'open', 1);
  app.saveScheduledShiftDirect_(first, 'operation_start_1');
  app.saveScheduledShiftDirect_({ ...first, stato: 'done', revisione: 2 }, 'operation_finish_1');
  const bootstrap = app.getBootstrap('');
  assert.equal(bootstrap.data.shifts.length, 1);
  assert.equal(bootstrap.data.scheduledShifts.length, 1);
  assert.equal(bootstrap.data.summaries[0].minuti, 180);
  assert.equal(bootstrap.data.scheduledShifts[0].minuto_inizio, 420);
});

test('retries are idempotent and conflicting revisions cannot overwrite a shift', () => {
  const { context: app } = createApp();
  const first = record('2026-03-03', 1, 420, 570, 'open', 1);
  const done = { ...first, stato: 'done', revisione: 2 };
  app.saveScheduledShiftDirect_(first, 'operation_start_1');
  app.saveScheduledShiftDirect_(done, 'operation_finish_1');
  app.saveScheduledShiftDirect_(first, 'operation_start_1');
  assert.throws(() => app.saveScheduledShiftDirect_({ ...first, minuto_inizio: 390 }, 'operation_start_1'), /già usato/);
  assert.throws(() => app.saveScheduledShiftDirect_({ ...done, minuto_fine: 600 }, 'operation_conflict_1'), /Conflitto/);
  app.saveScheduledShiftDirect_({ ...done, minuto_fine: 600, revisione: 3 }, 'operation_change_1');
  const stored = app.getRecords_('TURNI_PROGRAMMATI')[0];
  assert.equal(stored.stato, 'done');
  assert.equal(stored.minuto_fine, 600);
  assert.equal(stored.revisione, 3);
});

test('invalid dates, non-half-hour times and invalid status transitions are rejected', () => {
  const { context: app } = createApp();
  const item = record('2026-03-03', 1, 420, 570, 'open', 1);
  assert.throws(() => app.saveScheduledShiftDirect_({ ...item, data: '2026-02-30', id: '2026-02-30#1' }, 'operation_invalid_1'), /data/);
  assert.throws(() => app.saveScheduledShiftDirect_({ ...item, minuto_inizio: 425 }, 'operation_invalid_2'), /mezz'ora/);
  assert.throws(() => app.saveScheduledShiftDirect_({ ...item, stato: 'done' }, 'operation_invalid_3'), /Passaggio/);
  app.saveScheduledShiftDirect_(item, 'operation_start_2');
  assert.throws(() => app.saveScheduledShiftDirect_({ ...item, stato: 'planned', revisione: 2 }, 'operation_invalid_4'), /Passaggio/);
});

test('monthly reports include only finished shifts and respect per-day changes', () => {
  const { context: app } = createApp();
  const days = [
    record('2026-03-02', 1, 390, 570, 'done', 3),
    record('2026-03-02', 2, 840, 960, 'done', 2),
    record('2026-03-03', 1, 420, 570, 'planned', 1)
  ];
  const report = JSON.parse(JSON.stringify(app.buildScheduledReport_(days, '2026-03', 'Operatore di prova', 'Sede di prova')));
  assert.deepEqual(report.giorni, [{ data: '2026-03-02', turni: [{ inizio: '06:30', fine: '09:30' }, { inizio: '14:00', fine: '16:00' }] }]);
  assert.throws(() => app.buildScheduledReport_([...days, record('2026-03-04', 1, 420, 570, 'open', 1)], '2026-03', 'Operatore', 'Sede'), /non terminati/);
  assert.throws(() => app.buildScheduledReport_([days[0], record('2026-03-02', 2, 540, 600, 'done', 2)], '2026-03', 'Operatore', 'Sede'), /sovrapposti/);
});

test('JSON backup and import preview include scheduled shifts', () => {
  const { context: app } = createApp();
  const row = record('2026-03-03', 1, 420, 570, 'open', 1);
  app.saveScheduledShiftDirect_(row, 'operation_start_3');
  app.saveScheduledShiftDirect_({ ...row, stato: 'done', revisione: 2 }, 'operation_finish_3');
  const backup = app.buildExportBundle_();
  assert.equal(backup.counts.scheduledShifts, 1);
  const { context: restored } = createApp();
  const preview = restored.previewImportFromJson('', JSON.stringify(backup));
  assert.equal(preview.sections.scheduledShifts.freshCount, 1);
  const result = restored.applyImport('', { sections: { scheduledShifts: { rows: preview.sections.scheduledShifts.payload.rows } } }, { mode: 'merge_skip_duplicates' });
  assert.equal(result.inserted, 1);
  assert.equal(restored.getRecords_('TURNI_PROGRAMMATI')[0].stato, 'done');
  assert.equal(restored.getRecords_('TURNI').length, 0);
});
