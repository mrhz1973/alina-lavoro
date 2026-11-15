/* Embed separately held workplace images into a private Apps Script staging copy.
   Usage: node tools/inject_workplace_media.cjs INPUT OUTPUT VARIABLE1 VARIABLE2 SCHEDULED LOGO */
const fs = require('node:fs');
const path = require('node:path');

const [input, output, ...images] = process.argv.slice(2);
if (!input || !output || images.length !== 4) {
  throw new Error('Expected input, output, two variable-work images, one scheduled-work image and logo');
}
const marker = '<!-- WORKPLACE_MEDIA -->';
const html = fs.readFileSync(input, 'utf8');
if (html.split(marker).length !== 2) throw new Error('Workplace media marker must occur exactly once');
const names = ['--work-variable-photo-1', '--work-variable-photo-2', '--work-scheduled-photo', '--work-scheduled-logo'];
const mime = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const rules = images.map((file, index) => {
  const type = mime[path.extname(file).toLowerCase()];
  if (!type) throw new Error('Unsupported workplace image format');
  const content = fs.readFileSync(file);
  if (!content.length || content.length > 1024 * 1024) throw new Error('Workplace image must be between 1 byte and 1 MiB');
  return names[index] + ':url("data:' + type + ';base64,' + content.toString('base64') + '");';
});
const style = '<style>:root{' + rules.join('') + '--work-photo-strip-display:flex;--work-scheduled-logo-display:block}</style>';
fs.writeFileSync(output, html.replace(marker, style), 'utf8');
console.log('Private staging page prepared with workplace imagery.');
