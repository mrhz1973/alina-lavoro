const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const realPdfLib = require('pdf-lib');

function context(PDFLib) {
  const code = fs.readFileSync(path.join(__dirname, '../src/frontend/ScheduledPdf.html'), 'utf8')
    .match(/<script>([\s\S]*?)<\/script>/)[1];
  const app = vm.createContext({
    PDFLib, Uint8Array, Blob, URL, atob, Number, String, Object, Array, Math, Error,
    t: key => key,
    scheduledDateValid_: value => /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value,
    scheduledParseTime_: value => {
      const m = /^([01]\d|2[0-3]):(00|30)$/.exec(String(value || ''));
      return m ? Number(m[1]) * 60 + Number(m[2]) : null;
    }
  });
  vm.runInContext(code, app);
  return app;
}

function report(days) {
  return { anno: 2026, mese: 3, operatore: 'Operatore di prova', cantiere: 'Sede di prova', giorni: days };
}

test('PDF preview draws completed hours and leaves the open exit blank', async () => {
  const drawn = [];
  const page = { getWidth: () => 595, getHeight: () => 841, getRotation: () => ({ angle: 0 }),
    drawText: (text, options) => drawn.push({ text, ...options }) };
  const PDFLib = { PDFDocument: { load: async () => ({ getPages: () => [page],
    embedFont: async () => ({ widthOfTextAtSize: () => 0 }), save: async () => new Uint8Array([1, 2, 3]) }) },
    StandardFonts: { Helvetica: 'Helvetica' }, rgb: () => ({}) };
  const app = context(PDFLib);
  const data = report([{ data: '2026-03-02', turni: [
    { inizio: '07:00', fine: '09:30', stato: 'done' },
    { inizio: '14:00', fine: '', stato: 'open' }
  ] }]);
  await app.scheduledCreatePdf_('JVBERi0=', data);
  const strings = drawn.map(item => item.text);
  for (const expected of ['Operatore di prova', 'MARZO 2026', '07:00', '09:30', '14:00', '02:30']) assert.ok(strings.includes(expected));
  assert.ok(!strings.includes('15:30'));
  assert.equal(drawn.find(item => item.text === '07:00').x, 127);
  assert.equal(drawn.find(item => item.text === '02:30').x, 456);
  await assert.rejects(() => app.scheduledCreatePdf_('JVBERi0=', report([{ data: '2026-03-02', turni: [
    { inizio: '07:00', fine: '', stato: 'open' }, { inizio: '14:00', fine: '15:30', stato: 'done' }
  ] }])), /scheduled_invalid/);
});

test('a real generated PDF preserves the supplied template and supports an empty month', async () => {
  const template = await realPdfLib.PDFDocument.create();
  template.addPage([595, 841]);
  const original = await template.save();
  const copy = Buffer.from(original);
  const app = context(realPdfLib);
  const result = await app.scheduledCreatePdf_(copy.toString('base64'), report([]));
  const document = await realPdfLib.PDFDocument.load(result);
  assert.equal(document.getPageCount(), 1);
  assert.equal(document.getPage(0).getWidth(), 595);
  assert.deepEqual(Buffer.from(original), copy);
});

function viewerContext() {
  const app = context({}), pending = [], elements = new Map();
  const canvas = { style: { display: 'none', width: '100%' }, getContext: () => ({}) };
  const status = { textContent: '' }, zoom = { classList: { remove: () => {} }, textContent: '' };
  const print = { classList: { remove: () => {} } }, bodyClasses = new Set(), events = new Map();
  const backdrop = { classList: { contains: () => true } };
  elements.set('scheduledPdfCanvas', canvas); elements.set('scheduledPdfStatus', status);
  elements.set('scheduledPdfZoom', zoom); elements.set('scheduledPdfPrint', print); elements.set('modalBackdrop', backdrop);
  app.document = { getElementById: id => elements.get(id), body: { classList: {
    add: name => bodyClasses.add(name), remove: name => bodyClasses.delete(name)
  } } };
  app.state = { scheduledCapability: true, serverOk: true, accessCode: 'test' };
  app.navigator = { onLine: true }; app.getQueue = () => pending; app.scheduledSyncInFlight = false;
  app.monthLabel = value => value; app.esc = value => value;
  app.openModal = (title, html) => { app.modalTitle = title; app.modalHtml = html; };
  app.toast = value => { app.lastToast = value; };
  app.serverCall = async () => ({ success: true, report: report([]), templateBase64: 'JVBERi0=' });
  app.scheduledCreatePdf_ = async () => new Uint8Array([1, 2, 3]);
  app.pdfjsWorker = {};
  app.pdfjsLib = { getDocument: options => {
    assert.deepEqual(Array.from(options.data), [1, 2, 3]);
    assert.equal(options.isEvalSupported, false);
    return { promise: Promise.resolve({ numPages: 1, getPage: async () => ({
      getViewport: () => ({ width: 1190, height: 1682 }),
      render: () => ({ promise: Promise.resolve().then(() => { app.rendered = true; }) })
    }) }), destroy: async () => { app.destroyed = true; } };
  } };
  app.window = { open: () => { throw new Error('The preview must not open another tab'); },
    addEventListener: (name, fn) => events.set(name, fn), removeEventListener: name => events.delete(name),
    print: () => { app.printCalled = true; } };
  return { app, canvas, status, zoom, pending, bodyClasses, events };
}

test('PDF button renders inside the app and offers a larger view', async () => {
  const { app, canvas, status, zoom } = viewerContext();
  await app.scheduledViewPdf_('2026-03');
  assert.ok(app.rendered && app.destroyed);
  assert.equal(canvas.style.display, 'block');
  assert.equal(canvas.width, 1190); assert.equal(canvas.height, 1682);
  assert.equal(status.textContent, 'scheduled_report_info');
  assert.match(app.modalHtml, /scheduledPdfCanvas/);
  app.scheduledPdfZoom_();
  assert.equal(canvas.style.width, '200%');
  assert.equal(zoom.textContent, 'scheduled_pdf_zoom_out');
  app.scheduledPdfZoom_();
  assert.equal(canvas.style.width, '100%');
});

test('the renderer is loaded only when the PDF is opened and reused afterwards', async () => {
  const { app } = viewerContext(), renderer = app.pdfjsLib, requests = [], scripts = [];
  delete app.pdfjsLib; delete app.pdfjsWorker;
  app.document.createElement = () => ({ textContent: '', remove() {} });
  app.document.head = { appendChild(script) {
    scripts.push(script.textContent);
    if (script.textContent === 'worker code') app.pdfjsWorker = {};
    if (script.textContent === 'renderer code') app.pdfjsLib = renderer;
  } };
  app.serverCall = async (_fn, args) => {
    requests.push(args[2]);
    return { success: true, report: report([]), templateBase64: 'JVBERi0=', rendererScripts: ['worker code', 'renderer code'] };
  };
  await app.scheduledViewPdf_('2026-03');
  await app.scheduledViewPdf_('2026-03');
  assert.deepEqual(requests, [true, false]);
  assert.deepEqual(scripts, ['worker code', 'renderer code']);
});

test('PDF preview does not show stale records if a change is pending', async () => {
  const { app, canvas, status, pending } = viewerContext();
  app.serverCall = async () => { pending.push({}); return { success: true, report: report([]), templateBase64: 'JVBERi0=' }; };
  await app.scheduledViewPdf_('2026-03');
  assert.equal(canvas.style.display, 'none');
  assert.equal(status.textContent, 'scheduled_pending');
  assert.equal(app.rendered, undefined);
});

test('printing opens the system dialog only for a visible synchronized preview', async () => {
  const { app, canvas, pending, bodyClasses, events } = viewerContext();
  app.scheduledPrintPdf_();
  assert.equal(app.printCalled, undefined);
  await app.scheduledViewPdf_('2026-03');
  pending.push({});
  app.scheduledPrintPdf_();
  assert.equal(app.lastToast, 'scheduled_pending');
  assert.equal(app.printCalled, undefined);
  pending.pop();
  app.scheduledPrintPdf_();
  assert.equal(app.printCalled, true);
  assert.ok(bodyClasses.has('scheduled-pdf-printing'));
  events.get('afterprint')();
  assert.equal(bodyClasses.has('scheduled-pdf-printing'), false);
  app.scheduledReleasePdf_();
  assert.equal(canvas.width, 1); assert.equal(canvas.height, 1);
  assert.equal(canvas.style.display, 'none');
});
