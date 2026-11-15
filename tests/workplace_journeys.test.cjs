const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

// The demo has a local, synthetic backend and separate browser storage keys.
function buildDemo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'alina-journeys-'));
  const output = path.join(dir, 'preview.html'), config = path.join(dir, 'config.json');
  try {
    fs.writeFileSync(config, JSON.stringify({
      nome_lavoro_variabile: 'B&B di prova', nome_lavoro_programmato: 'Ekom di prova',
      operatore_registro: 'Operatore di prova', programma_1_inizio: '06:00', programma_1_fine: '08:30',
      programma_2_inizio: '13:00', programma_2_fine: '14:30'
    }));
    execFileSync(process.execPath, [path.join(__dirname, '../tools/create_local_demo.cjs'), output, config]);
    return fs.readFileSync(output, 'utf8');
  } finally {
    if (fs.existsSync(output)) fs.unlinkSync(output);
    if (fs.existsSync(config)) fs.unlinkSync(config);
    fs.rmdirSync(dir);
  }
}

function bootDemo(html, store = new Map()) {
  let clock = Date.parse('2026-03-03T10:00:00');
  class SimulatedDate extends Date {
    constructor(...args) { super(...(args.length ? args : [clock])); }
    static now() { return clock; }
  }
  const events = new Map(), elements = new Map();
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      id, value: '', innerHTML: '', textContent: '', dataset: {}, children: [],
      style: { setProperty() {} },
      classList: { add() {}, remove() {}, contains() { return false; }, toggle() {} },
      insertAdjacentHTML(_where, content) { this.innerHTML += content; },
      appendChild(child) { this.children.push(child); }, addEventListener() {}, click() {}
    });
    return elements.get(id);
  }
  const document = {
    documentElement: { dataset: {}, style: { setProperty() {} }, lang: '' },
    visibilityState: 'visible',
    addEventListener(name, callback) { if (!events.has(name)) events.set(name, []); events.get(name).push(callback); },
    querySelectorAll() { return []; }, getElementById: element,
    createElement() { return element('created'); }, createDocumentFragment() { return element('fragment'); }
  };
  const localStorage = {
    getItem(key) { return store.has(key) ? store.get(key) : null; },
    setItem(key, value) { store.set(key, String(value)); },
    removeItem(key) { store.delete(key); }
  };
  const navigator = { onLine: true };
  const context = vm.createContext({
    document, localStorage, navigator, Date: SimulatedDate, Math, JSON, Number, String, Object,
    Array, RegExp, Set, isNaN, Blob, URL, console, setTimeout() { return 1; }, clearTimeout() {},
    window: { addEventListener() {}, visualViewport: null }
  });
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 4);
  scripts.forEach(script => vm.runInContext(script[1], context));
  (events.get('DOMContentLoaded') || []).forEach(callback => callback());
  return { app: context, store, elements, navigator, setClock(value) { clock = Date.parse(value); } };
}
async function settle() {
  await new Promise(resolve => setImmediate(resolve));
  await new Promise(resolve => setImmediate(resolve));
}

test('B&B: finishing saves automatically; offline work survives and syncs on reconnection', async () => {
  const html = buildDemo(), demo = bootDemo(html), { app, navigator } = demo;
  await settle();
  app.scheduledSelectWorkplace_('variable');
  app.commitStartWork(app.newShift('2026-03-03'), '08:40');
  await settle();
  app.commitEndWork(app.getTodayShift(), '11:55');
  await settle();
  let saved = app.localDemoRead_().shifts;
  assert.equal(saved.length, 1);
  assert.equal(saved[0].inizio, '08:40');
  assert.equal(saved[0].fine, '11:55');
  assert.equal(saved[0].minuti_lavorati, 195);
  assert.equal(app.getQueue().length, 0);
  assert.doesNotMatch(app.document.getElementById('content').innerHTML, /onclick="startWork\(\)"/);
  // An accidental second start must not erase today's completed shift.
  app.startWork();
  await settle();
  saved = app.localDemoRead_().shifts;
  assert.equal(saved.length, 1);
  assert.equal(saved[0].inizio, '08:40');
  assert.equal(saved[0].fine, '11:55');
  assert.equal(saved[0].minuti_lavorati, 195);
  assert.equal(app.getQueue().length, 0);

  demo.setClock('2026-03-04T10:00:00');
  navigator.onLine = false;
  app.commitStartWork(app.newShift('2026-03-04'), '09:00');
  app.commitEndWork(app.getTodayShift(), '12:00');
  assert.equal(app.getQueue().length, 2);
  assert.equal(app.localDemoRead_().shifts.length, 1);
  navigator.onLine = true;
  await app.flushQueue();
  await settle();
  assert.equal(app.getQueue().length, 0);
  saved = app.localDemoRead_().shifts;
  assert.equal(saved.length, 2);
  assert.equal(saved.find(row => row.data === '2026-03-04').minuti_lavorati, 180);
  await app.flushQueue();
  assert.equal(app.localDemoRead_().shifts.length, 2);
  const reloaded = bootDemo(html, demo.store);
  await settle();
  assert.equal(vm.runInContext('state.shifts.length', reloaded.app), 2);
  assert.equal(reloaded.app.getQueue().length, 0);
  assert.equal(demo.store.has('alina_lavoro_queue_v1'), false);
});

test('Ekom: two shifts, same-day B&B and a date-specific change remain distinct in the report', async () => {
  const html = buildDemo(), demo = bootDemo(html), { app } = demo;
  await settle();
  app.scheduledSelectWorkplace_('variable');
  app.commitStartWork(app.newShift('2026-03-03'), '08:40');
  await settle();
  app.commitEndWork(app.getTodayShift(), '11:55');
  await settle();
  app.scheduledSelectWorkplace_('scheduled');
  app.scheduledStart_('1');
  await settle();
  assert.throws(() => app.scheduledBuildReport_('2026-03'));
  app.scheduledFinish_('1');
  await settle();
  app.scheduledStart_('2');
  await settle();
  app.scheduledFinish_('2');
  await settle();
  assert.equal(app.scheduledMonthTotals_('2026-03').minutes, 240);
  for (const [id, value] of Object.entries({
    sch_date: '2026-03-03', sch_day_1_start: '06:00', sch_day_1_end: '09:00',
    sch_day_2_start: '13:00', sch_day_2_end: '14:30'
  })) app.document.getElementById(id).value = value;
  app.scheduledSaveDay_();
  await settle();
  assert.equal(app.getQueue().length, 0);
  assert.equal(app.scheduledMonthTotals_('2026-03').minutes, 270);
  const report = JSON.parse(JSON.stringify(app.scheduledBuildReport_('2026-03')));
  assert.deepEqual(report.giorni, [{ data: '2026-03-03', turni: [
    { inizio: '06:00', fine: '09:00' }, { inizio: '13:00', fine: '14:30' }
  ] }]);
  const markers = app.workplaceDays_('2026-03')['2026-03-03'];
  assert.equal(markers.variable, true);
  assert.equal(markers.scheduled, true);
  const reloaded = bootDemo(html, demo.store);
  await settle();
  assert.equal(vm.runInContext('state.shifts.length', reloaded.app), 1);
  assert.equal(vm.runInContext('state.scheduledShifts.filter(row => row.stato === "done").length', reloaded.app), 2);
  assert.equal(reloaded.app.scheduledMonthTotals_('2026-03').minutes, 270);
  assert.equal(reloaded.app.getQueue().length, 0);
});

test('B&B: adding a different date preserves the current shift and an existing target date loads its own times', async () => {
  const html = buildDemo(), demo = bootDemo(html), { app } = demo;
  await settle();
  app.scheduledSelectWorkplace_('variable');
  app.commitStartWork(app.newShift('2026-03-03'), '08:40');
  await settle();
  app.commitEndWork(app.getTodayShift(), '11:55');
  await settle();
  const originalId = app.getTodayShift().id;
  for (const [id, value] of Object.entries({
    m_data: '2026-03-02', m_inizio: '08:25', m_fine: '12:45', m_pausa: '0', m_nota: ''
  })) app.document.getElementById(id).value = value;
  app.saveManualShift(originalId);
  await settle();
  const rows = app.localDemoRead_().shifts;
  assert.equal(rows.length, 2);
  assert.equal(rows.find(row => row.data === '2026-03-03').fine, '11:55');
  assert.equal(rows.find(row => row.data === '2026-03-02').fine, '12:45');
  app.document.getElementById('m_data').value = '2026-03-03';
  app.manualShiftDateChanged_();
  assert.equal(app.document.getElementById('m_inizio').value, '08:40');
  assert.equal(app.document.getElementById('m_fine').value, '11:55');
  const otherId = rows.find(row => row.data === '2026-03-02').id;
  app.document.getElementById('m_fine').value = '12:00';
  app.saveManualShift(otherId);
  await settle();
  const updated = app.localDemoRead_().shifts;
  assert.equal(updated.length, 2);
  assert.equal(updated.find(row => row.data === '2026-03-03').fine, '12:00');
  assert.equal(updated.find(row => row.data === '2026-03-02').fine, '12:45');
  assert.equal(app.getQueue().length, 0);
});
