const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

test('the generated standalone preview starts and saves two shifts using only its simulated backend', async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'scheduled-preview-'));
  const output = path.join(tmp, 'preview.html');
  let html;
  try {
    execFileSync(process.execPath, [path.join(__dirname, '../tools/create_local_demo.cjs'), output]);
    html = fs.readFileSync(output, 'utf8');
  } finally {
    if (fs.existsSync(output)) fs.unlinkSync(output);
    fs.rmdirSync(tmp);
  }
  assert.match(html, /ANTEPRIMA LOCALE/);
  assert.match(html, /connect-src &#39;none&#39;|connect-src 'none'/);
  assert.doesNotMatch(html, /SCHEDULED_WORK_MODULE/);

  const events = new Map(), elements = new Map(), store = new Map();
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
    addEventListener(name, callback) { events.set(name, callback); },
    querySelectorAll() { return []; }, getElementById: element,
    createElement() { return element('created'); }, createDocumentFragment() { return element('fragment'); }
  };
  const localStorage = {
    getItem(key) { return store.has(key) ? store.get(key) : null; },
    setItem(key, value) { store.set(key, String(value)); },
    removeItem(key) { store.delete(key); }
  };
  const context = vm.createContext({
    document, localStorage, navigator: { onLine: true }, Date, Math, JSON, Number, String, Object,
    Array, RegExp, Set, isNaN, Blob, URL, console, setTimeout() { return 1; }, clearTimeout() {},
    window: { addEventListener() {}, visualViewport: null }
  });
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 3);
  scripts.forEach((script, index) => vm.runInContext(script[1], context, { filename: `preview-script-${index}.js` }));
  events.get('DOMContentLoaded')();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(vm.runInContext('state.scheduledCapability', context), true);
  assert.match(elements.get('content').innerHTML, /Attivita A/);
  context.scheduledSelectWorkplace_('scheduled');
  assert.match(elements.get('content').innerHTML, /Attivita B/);
  context.scheduledStart_('1');
  await new Promise(resolve => setImmediate(resolve));
  context.scheduledFinish_('1');
  await new Promise(resolve => setImmediate(resolve));
  context.scheduledStart_('2');
  await new Promise(resolve => setImmediate(resolve));
  context.scheduledFinish_('2');
  await new Promise(resolve => setImmediate(resolve));
  const month = vm.runInContext('currentMonth()', context);
  const report = JSON.parse(JSON.stringify(context.scheduledBuildReport_(month)));
  assert.equal(report.giorni.length, 1);
  assert.deepEqual(report.giorni[0].turni, [{ inizio: '07:00', fine: '09:30' }, { inizio: '14:00', fine: '15:30' }]);
  assert.equal(JSON.parse(store.get('alina_demo_backend_v2')).scheduledShifts.length, 2);
  assert.equal(store.has('alina_lavoro_queue_v1'), false);
  assert.equal(store.has('alina_lavoro_cache_v1'), false);
});
