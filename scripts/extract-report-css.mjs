import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const htmlDir = join(root, 'reports/html');
const cssDir = join(root, 'reports/css');
const dryRun = process.argv.includes('--check');

for (const name of readdirSync(htmlDir).filter(n => n.endsWith('.html'))) {
  const htmlPath = join(htmlDir,name);
  const html = readFileSync(htmlPath,'utf8');
  const pattern = /<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi;
  const blocks = [...html.matchAll(pattern)].map(x => x[1]);
  if (!blocks.length) continue;

  const cssName = basename(name,'.html')+'.css';
  const cssPath = join(cssDir,cssName);
  if (existsSync(cssPath)) throw new Error(`Refusing to overwrite an existing stylesheet: ${cssName}`);

  let css = blocks.join('\n\n');
  // CSS urls were originally resolved relative to the repository root.
  css = css.replace(/url\(\s*(["']?)([^"'()]+)\1\s*\)/gi,(match,quote,url) =>
    /^(?:https?:|data:|\/|#|\/\/)/i.test(url) ? match : `url(${quote}../../${url}${quote})`);
  let replaced = 0;
  const href = '../css/'+encodeURIComponent(basename(name,'.html'))+'.css';
  const output = html.replace(pattern,() => replaced++ === 0 ? `<link rel="stylesheet" href="${href}">` : '');
  if (dryRun) {
    console.error(`Embedded CSS still present: ${name}`);
    process.exitCode = 1;
    continue;
  }
  writeFileSync(cssPath,css,'utf8');
  writeFileSync(htmlPath,output,'utf8');
  console.log(`Extracted ${blocks.length} style block(s): ${name} -> ${cssName}`);
}
