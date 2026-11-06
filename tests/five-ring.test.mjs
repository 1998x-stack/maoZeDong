import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
const root=fileURLToPath(new URL('..',import.meta.url));
const read=path=>readFileSync(join(root,path),'utf8');
test('stage-0 inventory is deterministic and keeps zero-byte files visible',()=>{
 const r=spawnSync(process.execPath,['scripts/inventory-legacy.mjs','--check'],{cwd:root,encoding:'utf8'});
 assert.equal(r.status,0,r.stderr);
 const inventory=JSON.parse(read('data/legacy-inventory.json'));
 assert.ok(inventory.items.length>=60);
 assert.ok(inventory.items.some(x=>x.issues.includes('zero-byte')));
 assert.ok(inventory.items.every(x=>x.phase==='P0-inventoried'));
});
test('five-ring pilot generates identical MD and HTML from one JSON source',()=>{
 const r=spawnSync(process.execPath,['scripts/build-research.mjs','--check'],{cwd:root,encoding:'utf8'});
 assert.equal(r.status,0,r.stderr);
 const base='research/published/mao-1930-against-bookishness';
 const md=read(base+'.md'),html=read(base+'.html');
 for(const phrase of ['认识现实','识别结构','比较选择','组织执行','反馈纠偏']){
  assert.ok(md.includes(phrase));assert.ok(html.includes(phrase));
 }
 assert.ok(html.includes('研究草案'));
 assert.ok(html.includes('aria-label'));
 assert.ok(!html.includes('<script>'));
});
test('new research link is in catalog but does not upgrade legacy review',()=>{
 const works=JSON.parse(read('data/works.json'));
 const w=works.find(x=>x.id==='mao-1930-against-bookishness');
 assert.equal(w.reviewStatus,'catalogued');
 assert.match(w.researchBrief,/^research\/published\/.*\.html$/);
 assert.ok(read('index.html').includes(w.researchBrief));
});
