import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const works = JSON.parse(readFileSync(join(root, 'data/works.json'), 'utf8'));
const template = readFileSync(join(root, 'web/template.html'), 'utf8');
const placeholder = '__WORKS_JSON__';
if (template.split(placeholder).length !== 2) {
  throw new Error('Template must contain exactly one __WORKS_JSON__ placeholder');
}
const data = JSON.stringify(works).replaceAll('<', '\\u003c').replaceAll('>', '\\u003e');
const html = template.replace(placeholder, data);
writeFileSync(join(root, 'index.html'), html, 'utf8');
console.log(`Generated index.html for ${works.length} works.`);
