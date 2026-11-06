import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, basename } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const migration = JSON.parse(readFileSync(join(root,'data/migrations/report-files.json'),'utf8'));
const contents = path => readFileSync(join(root,path));

function gitBlobSha(bytes) {
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

test('every old report has exactly one migrated target, no legacy file remains at repository root', () => {
  const targets = new Set();
  assert.equal(migration.files.length,125);
  for (const file of migration.files) {
    assert.ok(!targets.has(file.target),`${file.target} duplicated`);
    targets.add(file.target);
    assert.ok(existsSync(join(root,file.target)),`missing ${file.target}`);
    assert.equal(existsSync(join(root,file.original)),false,`${file.original} should have moved`);
    assert.ok(file.target.startsWith(file.kind==='html'?'reports/html/':'reports/md/'));
  }
  const rootLegacy = readdirSync(root).filter(path=>/\.(?:html|md)$/i.test(path)&&!['README.md','AGENTS.md','index.html'].includes(path));
  assert.deepEqual(rootLegacy,[]);
});

test('all migrated Markdown bytes match their original Git blobs', () => {
  const markdown = migration.files.filter(file=>file.kind==='markdown');
  assert.equal(markdown.length,63);
  for (const file of markdown) {
    const data=contents(file.target);
    assert.equal(gitBlobSha(data),file.originalBlobSha,`${file.target}: content changed during move`);
  }
});

test('each nonempty migrated HTML has its own extracted stylesheet with no remaining style blocks', () => {
  const pages = migration.files.filter(file=>file.kind==='html');
  assert.equal(pages.length,62);
  assert.equal(pages.filter(file=>!file.empty).length,58);
  for (const page of pages) {
    const body=contents(page.target).toString('utf8');
    if (page.empty) {
      assert.equal(body.length,0);
      assert.equal(page.css,null);
      continue;
    }
    assert.ok(page.css,`${page.target}: missing CSS mapping`);
    assert.ok(existsSync(join(root,page.css)),`${page.css}: missing CSS`);
    assert.ok(statSync(join(root,page.css)).size>0,`${page.css}: empty extracted CSS`);
    const styleUrl = '../css/'+encodeURIComponent(basename(page.original,'.html'))+'.css';
    assert.ok(body.includes(`href="${styleUrl}"`),`${page.target}: invalid CSS link`);
    assert.doesNotMatch(body,/<style\b[^>]*>/i,`${page.target}: embedded CSS still present`);
  }
  const css = readdirSync(join(root,'reports/css')).filter(file=>file.endsWith('.css'));
  assert.equal(css.length,58);
});

test('new catalog routes all attached research reports to migrated paths', () => {
  const works=JSON.parse(contents('data/works.json').toString('utf8'));
  for(const work of works) for(const path of work.legacyReports){
    assert.ok(path.startsWith(path.endsWith('.html')?'reports/html/':'reports/md/'),`bad route: ${path}`);
    assert.ok(existsSync(join(root,path)),`broken catalog route: ${path}`);
  }
  const index = contents('index.html').toString('utf8');
  assert.ok(index.includes('reports/html/109论持久战.html'));
  assert.ok(index.includes('reports/md/000实践论.md'));
});
