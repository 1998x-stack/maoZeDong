import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const htmlDir = join(root, 'reports/html');
const cssDir = join(root, 'reports/css');
const mdDir = join(root, 'reports/md');
const failures = [];
const htmlFiles = readdirSync(htmlDir).filter(name => name.endsWith('.html')).sort();
const mdFiles = readdirSync(mdDir).filter(name => name.endsWith('.md')).sort();
const cssFiles = readdirSync(cssDir).filter(name => name.endsWith('.css')).sort();
const manifest = JSON.parse(readFileSync(join(root,'data/migrations/report-files.json'),'utf8'));
const expected = new Map(manifest.files.map(file => [file.target,file]));
let emptyHtml = 0;
let inlineAttrs = 0;
let extractedStyles = 0;

for (const name of htmlFiles) {
  const path = `reports/html/${name}`;
  const body = readFileSync(join(htmlDir,name),'utf8');
  const item = expected.get(path);
  if (!item) failures.push(`${path}: missing migration manifest entry`);
  if (!body.trim()) {
    emptyHtml++;
    if (existsSync(join(cssDir,basename(name,'.html')+'.css'))) failures.push(`${name}: empty page should not have a CSS file`);
    continue;
  }
  const cssName = basename(name,'.html') + '.css';
  const expectedCss = join(cssDir,cssName);
  if (!existsSync(expectedCss)) {
    failures.push(`${name}: extracted stylesheet is missing`);
    continue;
  }
  if (statSync(expectedCss).size === 0) failures.push(`${name}: CSS file is empty`);
  const href = '../css/' + encodeURIComponent(basename(name,'.html')) + '.css';
  if (!body.includes(`href="${href}"`)) failures.push(`${name}: missing external stylesheet reference ${href}`);
  if (/<style\b[^>]*>/i.test(body)) failures.push(`${name}: embedded <style> remains`);
  const attrs = [...body.matchAll(/\sstyle\s*=\s*(["'])/gi)].length;
  inlineAttrs += attrs; // Retained as per-element declarations for legacy fidelity; see reports/README.md.
  extractedStyles++;
}
for (const name of cssFiles) {
  if (!htmlFiles.includes(name.replace(/\.css$/,'.html'))) failures.push(`${name}: orphaned CSS without HTML`);
}
for (const item of manifest.files) {
  const target = join(root,item.target);
  if (!existsSync(target)) failures.push(`${item.target}: moved report missing`);
  if (existsSync(join(root,item.original))) failures.push(`${item.original}: old root path still exists`);
}
if (manifest.files.length !== htmlFiles.length + mdFiles.length) failures.push('manifest count does not match migrated HTML + Markdown files');
const rootFiles = readdirSync(root).filter(name => /\.(?:html|md)$/.test(name) && !['README.md','AGENTS.md','index.html'].includes(name));
if (rootFiles.length) failures.push(`unmigrated root files: ${rootFiles.join(', ')}`);
if (cssFiles.length !== extractedStyles) failures.push(`CSS count ${cssFiles.length} does not match non-empty HTML count ${extractedStyles}`);

if (failures.length) {
  console.error(`CSS audit failed (${failures.length}):\n- ${failures.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`CSS audit OK: ${htmlFiles.length} HTML, ${mdFiles.length} Markdown, ${cssFiles.length} extracted stylesheets, ${emptyHtml} empty HTML retained.`);
  console.log(`Legacy inline style attributes: ${inlineAttrs} (retained for behavior compatibility; review individually).`);
}
