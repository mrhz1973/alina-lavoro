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
