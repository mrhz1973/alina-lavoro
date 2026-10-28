const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

function createFrontend(sharedStorage) {
  let clock = Date.parse('2026-03-03T06:45:00Z');
  class FakeDate extends Date {
    constructor(...args) { super(...(args.length ? args : [clock])); }
    static now() { return clock; }
  }
  const storage = sharedStorage || new Map(), elements = new Map(), listeners = new Map();
  function classes(initial = []) {
    const values = new Set(initial);
    return {
      add(name) { values.add(name); }, remove(name) { values.delete(name); },
      contains(name) { return values.has(name); },
      toggle(name, force) { const next = force === undefined ? !values.has(name) : !!force; if (next) values.add(name); else values.delete(name); return next; }
    };
  }
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      id, value: '', innerHTML: '', textContent: '', dataset: {}, children: [],
      classList: classes(['navScheduledRegister', 'navScheduledEdit'].includes(id) ? ['hidden'] : []),
      insertAdjacentHTML(_where, text) { this.innerHTML = text + this.innerHTML; },
      appendChild(child) { this.children.push(child); }, addEventListener() {}, click() {},
      scrollIntoView() { this.scrolled = true; }
    });
    return elements.get(id);
  }
  const navButtons = [
    ['navHome', 'home'], ['navVariableMonths', 'months'], ['navScheduledRegister', 'months'],
    ['navScheduledEdit', 'scheduledEdit'], ['navNotes', 'notes']
  ].map(([id, page]) => { const button = element(id); button.dataset.page = page; return button; });
  const document = {
    documentElement: { dataset: {}, style: { setProperty() {} }, lang: '' },
    visibilityState: 'visible',
    addEventListener(name, callback) { if (!listeners.has(name)) listeners.set(name, []); listeners.get(name).push(callback); },
    querySelectorAll(selector) {
      if (selector === '#nav button[data-page]' || selector === '.nav button') return navButtons;
      return [];
    }, getElementById: element,
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
  const pdfModule = fs.readFileSync(path.join(__dirname, '../src/frontend/ScheduledPdf.html'), 'utf8');
  const first = index.match(/<script>([\s\S]*?)<\/script>/);
  const second = module.match(/<script>([\s\S]*?)<\/script>/);
  if (!first || !second) throw new Error('Missing app script');
  vm.runInContext(first[1], context);
  vm.runInContext(second[1], context);
  vm.runInContext(pdfModule.match(/<script>([\s\S]*?)<\/script>/)[1], context);
  vm.runInContext([
    "state.config = Object.assign({}, state.config, {",
    "nome_lavoro_variabile:'Attivita A', nome_lavoro_programmato:'Attivita B',",
    "operatore_registro:'Operatore di prova', programma_1_inizio:'07:00',",
    "programma_1_fine:'09:30', programma_2_inizio:'14:00', programma_2_fine:'15:30', setup_completato:'yes'});",
    "state.shifts = [{id:'legacy', data:'2026-03-03', inizio:'10:00', fine:'12:00', minuti_lavorati:120}];",
    "state.summaries = [{mese:'2026-03', minuti:120, ore:2, giorni:1, ore_label:'2 h 00 min', stimato:20, tariffa_media:10}];",
    "scheduledSelectedWorkplace = 'scheduled'; state.scheduledCapability = true;"
  ].join('\n'), context);
  return { context, storage, elements, navigator, listeners, navButtons, setClock(value) { clock = Date.parse(value); } };
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

test('the scheduled workplace offers a current-month PDF button', () => {
  const { context: app, elements } = createFrontend();
  app.renderScheduledHome_();
  assert.match(elements.get('content').innerHTML, /scheduledViewPdf_\('2026-03'\)/);
  assert.match(elements.get('content').innerHTML, /Visualizza PDF/);
});

test('the scheduled home does not claim synchronization before server data loads', () => {
  const { context: app, elements, navigator } = createFrontend();
  navigator.onLine = true;
  vm.runInContext('state.serverOk = false; scheduledBootstrapComplete = false', app);
  app.renderScheduledHome_();
  assert.match(elements.get('content').innerHTML, /Caricamento/);
  assert.doesNotMatch(elements.get('content').innerHTML, /Tutto sincronizzato/);
  vm.runInContext('state.serverOk = true; scheduledBootstrapComplete = true', app);
  app.renderScheduledHome_();
  assert.match(elements.get('content').innerHTML, /Tutto sincronizzato/);
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

test('the date editor updates a completed shift without creating attendance for another slot', () => {
  const { context: app, elements } = createFrontend();
  app.scheduledStart_('1'); app.scheduledFinish_('1');
  for (const [id, value] of Object.entries({
    sch_date: '2026-03-03', sch_day_1_start: '06:30', sch_day_1_end: '10:00',
    sch_day_2_start: '14:00', sch_day_2_end: '15:30'
  })) elements.set(id, { id, value });
  app.scheduledSaveDay_();
  assert.equal(app.scheduledFind_('2026-03-03', '1').stato, 'done');
  assert.equal(app.scheduledMonthTotals_('2026-03').minutes, 210);
  assert.equal(app.scheduledFind_('2026-03-03', '2').stato, 'planned');
  assert.equal(app.scheduledTimesForDay_('2026-03-04', '1').start, 420);
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

function configureTestAreas(app) {
  vm.runInContext("state.config.aree_variabile_json = JSON.stringify([{latitude:40,longitude:10,radius:500},{latitude:40.001,longitude:10,radius:500}]);" +
    "state.config.aree_programmata_json = JSON.stringify([{latitude:41,longitude:11,radius:500}]);", app);
}

test('the scheduled home keeps both shifts prominent and retains one shared navigation bar', () => {
  const { context: app, elements } = createFrontend();
  app.renderScheduledHome_();
  const html = elements.get('content').innerHTML;
  assert.match(html, /workplace-button/);
  assert.match(html, /scheduled-action/);
  assert.match(html, /Prima fascia/);
  assert.match(html, /Seconda fascia/);
  assert.doesNotMatch(html, /scheduled-shortcuts/);
  assert.doesNotMatch(html, /Registro presenze|Modifica orari/);
  assert.doesNotMatch(html, /Scegli con la posizione/);
  assert.doesNotMatch(html, /Riprova autorizzazione posizione/);
  assert.match(app.scheduledSettingsHtml_(), /Riprova autorizzazione posizione/);
  const source = fs.readFileSync(path.join(__dirname, '../src/frontend/Index.html'), 'utf8');
  const bars = [...source.matchAll(/<nav\b/g)];
  assert.equal(bars.length, 1);
  const bar = source.match(/<nav id="nav"[\s\S]*?<\/nav>/)[0];
  assert.ok(bar.indexOf('nav_home') < bar.indexOf('scheduled_show_register'));
  assert.ok(bar.indexOf('scheduled_show_register') < bar.indexOf('scheduled_edit_short'));
  assert.ok(bar.indexOf('scheduled_edit_short') < bar.indexOf('nav_notes'));
  assert.match(source, /\.nav\.nav-scheduled\{grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
  assert.doesNotMatch(source, /\.nav\.scheduled-nav\{position:fixed/);
});

test('the shared bar keeps Home and Notes while its middle controls change by workplace', () => {
  const { context: app, elements } = createFrontend();
  app.render();
  assert.equal(elements.get('nav').classList.contains('nav-scheduled'), true);
  assert.equal(elements.get('navVariableMonths').classList.contains('hidden'), true);
  assert.equal(elements.get('navScheduledRegister').classList.contains('hidden'), false);
  assert.equal(elements.get('navScheduledEdit').classList.contains('hidden'), false);
  assert.equal(elements.get('navHome').classList.contains('hidden'), false);
  assert.equal(elements.get('navNotes').classList.contains('hidden'), false);
  assert.equal(elements.get('navHome').classList.contains('active'), true);
  app.scheduledOpenMonth_('2026-03');
  assert.equal(vm.runInContext('state.page', app), 'monthDetail');
  assert.equal(elements.get('navScheduledRegister').classList.contains('active'), true);
  app.scheduledOpenDayEditor_('2026-03-03');
  assert.equal(elements.get('navScheduledEdit').classList.contains('active'), true);
  assert.match(elements.get('modalBody').innerHTML, /sch_modal_day_1_start/);
  app.closeModal();
  assert.equal(elements.get('navScheduledRegister').classList.contains('active'), true);
  app.setPage('notes');
  assert.equal(elements.get('navNotes').classList.contains('active'), true);
  app.setPage('home');
  assert.equal(vm.runInContext('state.page', app), 'home');
  assert.equal(elements.get('navHome').classList.contains('active'), true);
  app.scheduledSelectWorkplace_('variable');
  assert.equal(elements.get('nav').classList.contains('nav-scheduled'), false);
  assert.equal(elements.get('navVariableMonths').classList.contains('hidden'), false);
  assert.equal(elements.get('navScheduledRegister').classList.contains('hidden'), true);
  assert.equal(elements.get('navScheduledEdit').classList.contains('hidden'), true);
  assert.equal(elements.get('navHome').classList.contains('hidden'), false);
  assert.equal(elements.get('navNotes').classList.contains('hidden'), false);
});

test('the date editor in the bottom bar uses its own fields even when settings are open', () => {
  const { context: app, elements } = createFrontend();
  app.scheduledStart_('1'); app.scheduledFinish_('1');
  for (const [id, value] of Object.entries({
    sch_date: '2026-03-04', sch_day_1_start: '07:00', sch_day_1_end: '09:30',
    sch_day_2_start: '14:00', sch_day_2_end: '15:30',
    sch_modal_date: '2026-03-03', sch_modal_day_1_start: '06:30', sch_modal_day_1_end: '10:00',
    sch_modal_day_2_start: '14:00', sch_modal_day_2_end: '15:30'
  })) elements.set(id, { id, value });
  app.scheduledSaveDay_(true);
  assert.equal(app.scheduledFind_('2026-03-03', '1').stato, 'done');
  assert.equal(app.scheduledFind_('2026-03-03', '1').minuto_inizio, 390);
  assert.equal(app.scheduledFind_('2026-03-04', '1'), null);
});

test('the register distinguishes a completed exit from an open shift', () => {
  const { context: app, elements } = createFrontend();
  app.scheduledStart_('1');
  vm.runInContext("state.detailMonth = '2026-03'", app);
  app.renderScheduledMonthDetail_();
  let html = elements.get('content').innerHTML;
  assert.match(html, /Entrata/);
  assert.match(html, /Uscita prevista/);
  assert.match(html, /Da segnare/);
  assert.doesNotMatch(html, /Ore registrate/);
  app.scheduledFinish_('1');
  app.renderScheduledMonthDetail_();
  html = elements.get('content').innerHTML;
  assert.match(html, /Uscita/);
  assert.match(html, /Ore registrate/);
  assert.doesNotMatch(html, /Da segnare/);
});

test('an automatic location match selects the scheduled workplace without recording attendance', async () => {
  const { context: app, navigator, storage } = createFrontend();
  configureTestAreas(app);
  vm.runInContext("scheduledSelectedWorkplace='variable'", app);
  navigator.geolocation = { getCurrentPosition(callback) { callback({ coords: { latitude: 41, longitude: 11, accuracy: 10 } }); } };
  await app.scheduledTryAutoLocation_();
  assert.equal(vm.runInContext('scheduledSelectedWorkplace', app), 'scheduled');
  assert.equal(vm.runInContext('state.scheduledShifts.length', app), 0);
  assert.equal(storage.has('alina_workplace_locations_v1'), false);
});

test('overlapping areas belonging to the same workplace identify the same workplace', async () => {
  const { context: app, navigator } = createFrontend();
  configureTestAreas(app);
  navigator.geolocation = { getCurrentPosition(callback) { callback({ coords: { latitude: 40.0005, longitude: 10, accuracy: 10 } }); } };
  await app.scheduledTryAutoLocation_();
  assert.equal(vm.runInContext('scheduledSelectedWorkplace', app), 'variable');
});

test('unavailable, inaccurate or ambiguous location leaves the manual choice available', async () => {
  for (const kind of ['denied', 'uncertain', 'overlap']) {
    const { context: app, navigator } = createFrontend();
    configureTestAreas(app);
    if (kind === 'overlap') vm.runInContext("state.config.aree_programmata_json=JSON.stringify([{latitude:40,longitude:10,radius:500}])", app);
    navigator.geolocation = { getCurrentPosition(ok, fail) {
      if (kind === 'denied') fail({ code: 1 });
      else ok({ coords: { latitude: 40, longitude: 10, accuracy: kind === 'uncertain' ? 1000 : 10 } });
    } };
    await app.scheduledTryAutoLocation_();
    assert.equal(vm.runInContext('scheduledSelectedWorkplace', app), 'scheduled');
    app.scheduledSelectWorkplace_('variable');
    assert.equal(vm.runInContext('scheduledSelectedWorkplace', app), 'variable');
  }
});

test('a delayed position result cannot override a manual workplace choice', async () => {
  const { context: app, navigator } = createFrontend();
  configureTestAreas(app);
  let resolvePosition;
  navigator.geolocation = { getCurrentPosition(callback) { resolvePosition = callback; } };
  await app.scheduledTryAutoLocation_();
  app.scheduledSelectWorkplace_('scheduled');
  resolvePosition({ coords: { latitude: 40, longitude: 10, accuracy: 10 } });
  assert.equal(vm.runInContext('scheduledSelectedWorkplace', app), 'scheduled');
});

test('a delayed location result cannot switch workplace while the register or date editor is opened', async () => {
  for (const action of ['register', 'editor']) {
    const { context: app, navigator } = createFrontend();
    configureTestAreas(app);
    let resolvePosition;
    navigator.permissions = { query: async () => ({ state: 'granted' }) };
    navigator.geolocation = { getCurrentPosition(callback) { resolvePosition = callback; } };
    await app.scheduledTryAutoLocation_();
    if (action === 'register') app.scheduledOpenMonth_('2026-03');
    else app.scheduledOpenDayEditor_('2026-03-03');
    resolvePosition({ coords: { latitude: 40, longitude: 10, accuracy: 10 } });
    assert.equal(vm.runInContext('scheduledSelectedWorkplace', app), 'scheduled');
  }
});

test('location is checked again when the app returns to the foreground with a granted permission', async () => {
  const { context: app, navigator, listeners } = createFrontend();
  configureTestAreas(app);
  let point = { latitude: 40, longitude: 10, accuracy: 10 };
  navigator.permissions = { query: async () => ({ state: 'granted' }) };
  navigator.geolocation = { getCurrentPosition(callback) { callback({ coords: point }); } };
  await app.scheduledTryAutoLocation_();
  assert.equal(vm.runInContext('scheduledSelectedWorkplace', app), 'variable');
  point = { latitude: 41, longitude: 11, accuracy: 10 };
  listeners.get('visibilitychange').forEach(callback => callback());
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(vm.runInContext('scheduledSelectedWorkplace', app), 'scheduled');
  assert.equal(vm.runInContext('state.scheduledShifts.length', app), 0);
});

test('invalid area configuration never attempts an automatic location', async () => {
  const { context: app, navigator } = createFrontend();
  let requested = false;
  navigator.geolocation = { getCurrentPosition() { requested = true; } };
  vm.runInContext("state.config.aree_variabile_json = 'invalid'; state.config.aree_programmata_json = '[]'", app);
  await app.scheduledTryAutoLocation_();
  assert.equal(requested, false);
  assert.equal(vm.runInContext('scheduledSelectedWorkplace', app), 'scheduled');
});

test('a permission prompt is attempted once and is not repeated on later foreground visits', async () => {
  const { context: app, navigator, listeners, storage } = createFrontend();
  configureTestAreas(app);
  let calls = 0;
  navigator.permissions = { query: async () => ({ state: 'prompt' }) };
  navigator.geolocation = { getCurrentPosition(_ok, fail) { calls++; fail({ code: 1 }); } };
  await app.scheduledTryAutoLocation_();
  assert.equal(calls, 1);
  assert.equal(storage.get('alina_geolocation_prompted_v1'), 'yes');
  listeners.get('visibilitychange').forEach(callback => callback());
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(calls, 1);
  assert.equal(vm.runInContext('scheduledSelectedWorkplace', app), 'scheduled');
});

test('a temporary grant that has expired does not trigger a new prompt on page reload', async () => {
  const first = createFrontend();
  configureTestAreas(first.context);
  first.navigator.permissions = { query: async () => ({ state: 'prompt' }) };
  first.navigator.geolocation = { getCurrentPosition(ok) { ok({ coords: { latitude: 40, longitude: 10, accuracy: 10 } }); } };
  await first.context.scheduledTryAutoLocation_();
  const reloaded = createFrontend(first.storage);
  configureTestAreas(reloaded.context);
  let calls = 0;
  reloaded.navigator.permissions = { query: async () => ({ state: 'prompt' }) };
  reloaded.navigator.geolocation = { getCurrentPosition() { calls++; } };
  await reloaded.context.scheduledTryAutoLocation_();
  assert.equal(calls, 0);
  reloaded.context.scheduledSelectWorkplace_('variable');
  assert.equal(vm.runInContext('scheduledSelectedWorkplace', reloaded.context), 'variable');
});

test('a remembered browser grant allows automatic location without another permission request', async () => {
  const { context: app, navigator, listeners, storage } = createFrontend();
  configureTestAreas(app);
  storage.set('alina_geolocation_prompted_v1', 'yes');
  let calls = 0;
  navigator.permissions = { query: async () => ({ state: 'granted' }) };
  navigator.geolocation = { getCurrentPosition(ok) { calls++; ok({ coords: { latitude: 40, longitude: 10, accuracy: 10 } }); } };
  await app.scheduledTryAutoLocation_();
  listeners.get('visibilitychange').forEach(callback => callback());
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(calls, 2);
  assert.equal(vm.runInContext('scheduledSelectedWorkplace', app), 'variable');
});

test('a blocked permission never calls geolocation', async () => {
  const { context: app, navigator } = createFrontend();
  configureTestAreas(app);
  let calls = 0;
  navigator.permissions = { query: async () => ({ state: 'denied' }) };
  navigator.geolocation = { getCurrentPosition() { calls++; } };
  await app.scheduledTryAutoLocation_();
  assert.equal(calls, 0);
});

test('without permission-state support the app avoids repeating an automatic request', async () => {
  for (const variant of ['missing', 'unsupported']) {
    const { context: app, navigator, listeners } = createFrontend();
    configureTestAreas(app);
    let calls = 0;
    if (variant === 'unsupported') navigator.permissions = { query: async () => { throw new TypeError('unsupported'); } };
    navigator.geolocation = { getCurrentPosition(_ok, fail) { calls++; fail({ code: 1 }); } };
    await app.scheduledTryAutoLocation_();
    listeners.get('visibilitychange').forEach(callback => callback());
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(calls, 1);
  }
});

test('without usable browser storage no automatic prompt is issued repeatedly', async () => {
  const { context: app, navigator } = createFrontend();
  configureTestAreas(app);
  let calls = 0;
  navigator.permissions = { query: async () => ({ state: 'prompt' }) };
  navigator.geolocation = { getCurrentPosition() { calls++; } };
  app.localStorage.setItem = () => { throw new Error('storage unavailable'); };
  await app.scheduledTryAutoLocation_();
  assert.equal(calls, 0);
});

test('manual workplace selection while permission is being checked wins', async () => {
  const { context: app, navigator, storage } = createFrontend();
  configureTestAreas(app);
  let resolvePermission, calls = 0;
  navigator.permissions = { query: () => new Promise(resolve => { resolvePermission = resolve; }) };
  navigator.geolocation = { getCurrentPosition() { calls++; } };
  const pending = app.scheduledTryAutoLocation_();
  app.scheduledSelectWorkplace_('variable');
  resolvePermission({ state: 'prompt' });
  await pending;
  assert.equal(calls, 0);
  assert.equal(storage.has('alina_geolocation_prompted_v1'), false);
  assert.equal(vm.runInContext('scheduledSelectedWorkplace', app), 'variable');
});

test('a permission prompt is never initiated while the app is in the background', async () => {
  const { context: app, navigator, listeners } = createFrontend();
  configureTestAreas(app);
  let calls = 0;
  navigator.permissions = { query: async () => ({ state: 'prompt' }) };
  navigator.geolocation = { getCurrentPosition(_ok, fail) { calls++; fail({ code: 1 }); } };
  app.document.visibilityState = 'hidden';
  await app.scheduledTryAutoLocation_();
  assert.equal(calls, 0);
  app.document.visibilityState = 'visible';
  listeners.get('visibilitychange').forEach(callback => callback());
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(calls, 1);
});

test('the settings retry permits one intentional request without clearing attendance', async () => {
  const { context: app, navigator, storage } = createFrontend();
  configureTestAreas(app);
  app.scheduledStart_('1');
  let calls = 0;
  navigator.permissions = { query: async () => ({ state: 'prompt' }) };
  navigator.geolocation = { getCurrentPosition(_ok, fail) { calls++; fail({ code: 1 }); } };
  await app.scheduledTryAutoLocation_();
  app.scheduledRetryLocationPermission_();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(calls, 2);
  assert.equal(storage.get('alina_geolocation_prompted_v1'), 'yes');
  assert.equal(app.scheduledFind_('2026-03-03', '1').stato, 'open');
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
