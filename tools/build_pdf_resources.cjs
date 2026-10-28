/* Prepare public PDF code and, optionally, a private template for Apps Script.
   Usage: node tools/build_pdf_resources.cjs STAGING_DIR [PRIVATE_TEMPLATE.pdf]
   Never add the generated private template to the public repository. */
const fs = require('node:fs');
const path = require('node:path');

const target = process.argv[2];
if (!target) throw new Error('A staging directory is required');
const destination = path.resolve(target);
const libraryPath = require.resolve('pdf-lib/dist/pdf-lib.min.js');
const library = fs.readFileSync(libraryPath, 'utf8').replace(/<\/script/gi, '<\\/script');
fs.mkdirSync(destination, { recursive: true });
fs.writeFileSync(path.join(destination, 'PdfLib.html'), '<script>\n' + library + '\n</script>\n', 'utf8');

const templatePath = process.argv[3] || process.env.ALINA_PDF_TEMPLATE;
if (templatePath) {
  const bytes = fs.readFileSync(path.resolve(templatePath));
  if (bytes.length > 2_000_000 || bytes.subarray(0, 5).toString('ascii') !== '%PDF-') throw new Error('Invalid PDF template');
  fs.writeFileSync(path.join(destination, 'ScheduledPdfTemplate.html'), bytes.toString('base64'), 'utf8');
  console.log('Private PDF template prepared in staging.');
} else {
  console.log('PDF library prepared; no private template was supplied.');
}
