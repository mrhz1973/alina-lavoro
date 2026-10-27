const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

function createFrontend() {
  let clock = Date.parse('2026-03-03T06:45:00Z');
  class FakeDate extends Date {
    constructor(...args) { super(...(args.length ? args : [clock])); }
    static now() { return clock; }
  }
  const storage = new Map(), elements = new Map();
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      id, value: '', innerHTML: '', textContent: '', dataset: {}, children: [],
      classList: { add() {}, remove() {}, contains() { return false; }, toggle() {} },
      insertAdjacentHTML(_where, text) { this.innerHTML = text + this.innerHTML; },
      appendChild(child) { this.children.push(child); }, addEventListener() {}, click() {}
    });
    return elements.get(id);
  }
  const document = {
    documentElement: { dataset: {}, style: { setProperty() {} }, lang: '' },
    addEventListener() {}, querySelectorAll() { return []; }, getElementById: element,
    createElement() { return element('created'); }, createDocumentFragment() { return element('fragment'); }
  };
  const localStorage = {
    getItem(key) { return storage.has(key) ? storage.get(key) : null; },
    setItem(key, value) { storage.set(key, String(value)); },
    removeItem(key) { storage.delete(key); }
  };
  const navigator = { onLine: false };
  const context = vm.createContext({
    document, localStorage, navigator, Date: FakeDate, console, Math, JSON, Number, String,
    Object, Array, RegExp, Set, isNaN, Blob, URL, setTimeout() { return 1; }, clearTimeout() {},
    window: { addEventListener() {}, visualViewport: null }
  });
  const index = fs.readFileSync(path.join(__dirname, '../src/frontend/Index.html'), 'utf8');
  const module = fs.readFileSync(path.join(__dirname, '../src/frontend/ScheduledWork.html'), 'utf8');
  const first = index.match(/<script>([\s\S]*?)<\/script>/);
  const second = module.match(/<script>([\s\S]*?)<\/script>/);
  if (!first || !second) throw new Error('Missing app script');
  vm.runInContext(first[1], context);
  vm.runInContext(second[1], context);
  vm.runInContext([
    "state.config = Object.assign({}, state.config, {",
    "nome_lavoro_variabile:'Attivita A', nome_lavoro_programmato:'Attivita B',",
    "operatore_registro:'Operatore di prova', programma_1_inizio:'07:00',",
    "programma_1_fine:'09:30', programma_2_inizio:'14:00', programma_2_fine:'15:30', setup_completato:'yes'});",
    "state.shifts = [{id:'legacy', data:'2026-03-03', inizio:'10:00', fine:'12:00', minuti_lavorati:120}];",
    "state.summaries = [{mese:'2026-03', minuti:120, ore:2, giorni:1, ore_label:'2 h 00 min', stimato:20, tariffa_media:10}];",
    "scheduledSelectedWorkplace = 'scheduled'; state.scheduledCapability = true;"
  ].join('\n'), context);
  return { context, storage, elements, navigator, setClock(value) { clock = Date.parse(value); } };
}

test('recording two scheduled shifts keeps the existing workplace untouched', () => {
  const { context: app, setClock } = createFrontend();
  app.scheduledStart_('1'); // early click uses the configured start
  const first = vm.runInContext('state.scheduledShifts[0]', app);
  assert.equal(first.minuto_inizio, 420);
  assert.equal(first.stato, 'open');
  setClock('2026-03-03T09:35:00Z');
  app.scheduledFinish_('1');
  setClock('2026-03-03T13:50:00Z');
  app.scheduledStart_('2');
  app.scheduledFinish_('2');
  const state = vm.runInContext('state', app);
  assert.equal(state.scheduledShifts.length, 2);
  assert.equal(state.scheduledShifts[0].stato, 'done');
  assert.equal(state.scheduledShifts[1].stato, 'done');
  assert.equal(state.shifts.length, 1);
  assert.equal(state.shifts[0].minuti_lavorati, 120);
  assert.equal(state.summaries[0].minuti, 120);
  assert.equal(app.scheduledMonthTotals_('2026-03').minutes, 240);
});

test('a per-day override changes that day only and does not invent attendance', () => {
  const { context: app, elements } = createFrontend();
  for (const [id, value] of Object.entries({
    sch_date: '2026-03-04', sch_day_1_start: '06:30', sch_day_1_end: '10:00',
    sch_day_2_start: '14:00', sch_day_2_end: '16:00'
  })) elements.set(id, { id, value });
  app.scheduledSaveDay_();
  assert.equal(app.scheduledFind_('2026-03-04', '1').stato, 'planned');
  assert.equal(app.scheduledFind_('2026-03-04', '1').minuto_inizio, 390);
  assert.equal(app.scheduledMonthTotals_('2026-03').minutes, 0);
  assert.equal(app.scheduledTimesForDay_('2026-03-05', '1').start, 420);
});

test('a later tap still records the configured beginning of the chosen slot', () => {
  const { context: app, setClock } = createFrontend();
  setClock('2026-03-04T07:05:00Z');
  app.scheduledStart_('1');
  assert.equal(app.scheduledFind_('2026-03-04', '1').minuto_inizio, 420);
});

test('an open shift from an earlier day can be completed from the monthly view', () => {
  const { context: app, setClock } = createFrontend();
  app.scheduledStart_('1');
  setClock('2026-03-04T12:00:00Z');
  app.scheduledFinishForDate_('2026-03-03', '1');
  assert.equal(app.scheduledFind_('2026-03-03', '1').stato, 'done');
  assert.equal(app.scheduledMonthTotals_('2026-03').minutes, 150);
});

test('monthly report rejects unsynced and unfinished data and includes only completed shifts', () => {
  const { context: app, navigator, storage } = createFrontend();
  app.scheduledStart_('1');
  assert.throws(() => app.scheduledBuildReport_('2026-03'), /sincronizza|синхронизируйте/i);
  navigator.onLine = true; vm.runInContext('state.serverOk = true', app);
  storage.set('alina_lavoro_queue_v1', '[]');
  assert.throws(() => app.scheduledBuildReport_('2026-03'), /termina|завершите/i);
  app.scheduledFinish_('1');
  storage.set('alina_lavoro_queue_v1', '[]');
  const report = JSON.parse(JSON.stringify(app.scheduledBuildReport_('2026-03')));
  assert.deepEqual(report.giorni, [{ data: '2026-03-03', turni: [{ inizio: '07:00', fine: '09:30' }] }]);
  assert.equal(report.operatore, 'Operatore di prova');
});

test('the location helper falls back safely when saved sites are absent', () => {
  const { context: app } = createFrontend();
  assert.doesNotThrow(() => app.scheduledChooseByLocation_());
  assert.equal(vm.runInContext('scheduledSelectedWorkplace', app), 'scheduled');
});

test('location can select a uniquely matching site without saving the observed position', () => {
  const { context: app, navigator, storage } = createFrontend();
  const sites = JSON.stringify({ variable: { latitude: 40, longitude: 10 }, scheduled: { latitude: 41, longitude: 11 } });
  storage.set('alina_workplace_locations_v1', sites);
  navigator.geolocation = { getCurrentPosition(callback) { callback({ coords: { latitude: 40, longitude: 10, accuracy: 10 } }); } };
  app.scheduledChooseByLocation_();
  assert.equal(vm.runInContext('scheduledSelectedWorkplace', app), 'variable');
  assert.equal(storage.get('alina_workplace_locations_v1'), sites);
});

test('an older server cannot acknowledge and discard scheduled work', async () => {
  const { context: app, navigator, storage } = createFrontend();
  app.scheduledStart_('1');
  const before = storage.get('alina_lavoro_queue_v1');
  navigator.onLine = true;
  app.serverCall = async () => ({ success: true, data: { config: {}, shifts: [], salaries: [], notes: [], summaries: [] } });
  await app.flushQueue();
  assert.equal(storage.get('alina_lavoro_queue_v1'), before);
  assert.equal(app.scheduledFind_('2026-03-03', '1').stato, 'open');
  assert.equal(vm.runInContext('state.serverOk', app), false);
});

test('work added during an in-flight sync stays in the queue', async () => {
  const { context: app, navigator, storage } = createFrontend();
  app.scheduledStart_('1');
  const first = JSON.parse(storage.get('alina_lavoro_queue_v1'))[0].payload;
  navigator.onLine = true;
  let finishRequest;
  app.serverCall = () => new Promise(resolve => { finishRequest = resolve; });
  const sync = app.flushQueue();
  app.scheduledFinish_('1');
  finishRequest({ success: true, data: {
    config: {}, shifts: [], salaries: [], notes: [], summaries: [], reminder: { active: false },
    scheduledShifts: [first], capabilities: { scheduledWork: 1 }
  } });
  await sync;
  const remaining = JSON.parse(storage.get('alina_lavoro_queue_v1'));
  assert.equal(remaining.length, 1);
  assert.equal(remaining[0].payload.stato, 'done');
  assert.equal(app.scheduledFind_('2026-03-03', '1').stato, 'done');
});

test('scheduled pending work does not mask fresh data for the existing workplace', () => {
  const { context: app } = createFrontend();
  app.scheduledStart_('1');
  app.scheduledMergeDuringLocalChanges_({
    config: { media_mesi: '3' },
    shifts: [{ id: 'legacy', data: '2026-03-03', inizio: '10:00', fine: '12:30', minuti_lavorati: 150 }],
    salaries: [{ id: 'remote-pay', mese_lavorato: '2026-03', importo_reale: 90 }],
    notes: [{ id: 'remote-note', testo: 'Test' }],
    summaries: [{ mese: '2026-03', minuti: 150, giorni: 1, stimato: 90 }],
    reminder: { active: false }, scheduledShifts: [], capabilities: { scheduledWork: 1 }
  });
  const state = vm.runInContext('state', app);
  assert.equal(state.shifts[0].minuti_lavorati, 150);
  assert.equal(state.salaries[0].id, 'remote-pay');
  assert.equal(state.notes[0].id, 'remote-note');
  assert.equal(state.summaries[0].minuti, 150);
  assert.equal(state.config.media_mesi, '3');
  assert.equal(state.scheduledShifts[0].stato, 'open');
});

test('unsynced edits for the existing workplace remain visible after a refresh', () => {
  const { context: app } = createFrontend();
  app.enqueue({ type: 'saveShift', payload: { id: 'legacy', data: '2026-03-03', inizio: '10:00', fine: '14:00', minuti_lavorati: 240 } });
  app.enqueue({ type: 'saveConfig', payload: { media_mesi: '4' } });
  app.scheduledMergeDuringLocalChanges_({
    config: { media_mesi: '3' }, shifts: [{ id: 'legacy', data: '2026-03-03', minuti_lavorati: 180 }],
    salaries: [], notes: [], summaries: [], scheduledShifts: [], capabilities: { scheduledWork: 1 }
  });
  const state = vm.runInContext('state', app);
  assert.equal(state.shifts[0].minuti_lavorati, 240);
  assert.equal(state.summaries[0].minuti, 240);
  assert.equal(state.config.media_mesi, '4');
});
