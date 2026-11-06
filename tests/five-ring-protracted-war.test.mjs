import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
const root=fileURLToPath(new URL('..',import.meta.url));
const read=path=>readFileSync(join(root,path),'utf8');
const id='mao-1938-protracted-war';
const works=JSON.parse(read('data/works.json'));
const a=JSON.parse(read('research/articles/'+id+'.json'));
test('last registered work has a linked draft without upgrading historical evidence review',()=>{
 assert.equal(works.length,11);
 assert.equal(works.filter(w=>w.researchBrief).length,works.length);
 const work=works.find(w=>w.id===id);
 assert.equal(a.workId,id);
 assert.equal(a.status,'draft');
 assert.equal(work.reviewStatus,'catalogued');
 assert.equal(work.researchBrief,'research/published/'+id+'.html');
 assert.ok(read('index.html').includes(work.researchBrief));
 for(const path of work.legacyReports)assert.ok(existsSync(join(root,path)));
});
test('1938 decision study separates information at T0 from later events',()=>{
 assert.equal(a.t0.date,'1938-05-26');
 assert.equal(a.rings.length,5);
 assert.ok(a.rings.every(r=>r.claims.length===5));
 assert.ok(a.actors.length>=8);
 assert.ok(a.chronology.length>=9);
 assert.ok(a.versionNotes.length>=4);
 assert.ok(a.chronology.some(x=>x.horizon==='before'&&x.event.includes('徐州')));
 assert.ok(a.chronology.some(x=>x.horizon==='after'&&x.event.includes('首次全文')));
 const ids=new Set(a.sources.map(s=>s.id));
 assert.equal(ids.size,a.sources.length);
 for(const entry of [...a.chronology,...a.actors,...a.versionNotes,...a.forecastAudit,...a.rings.flatMap(r=>r.claims)]){
  assert.ok(entry.sourceIds.every(x=>ids.has(x)), 'Unknown reference');
  if(entry.grade==='B')assert.ok(entry.sourceIds.length>=2);
 }
 assert.ok(a.alternatives.some(x=>x.kind==='documented'));
 assert.ok(a.alternatives.some(x=>x.kind==='reconstructed'));
});
test('four-step forecast audit is rendered in matching Markdown and accessible HTML',()=>{
 const md=read('research/published/'+id+'.md');
 const html=read('research/published/'+id+'.html');
 assert.ok(a.forecastAudit.length>=4);
 assert.ok(md.includes('## 预期与结果：在T0之后检验'));
 assert.ok(html.includes('id="forecast-audit"'));
 assert.ok(html.includes('aria-label="1938年判断与事后检验对照表"'));
 for(const f of a.forecastAudit){
  assert.ok(md.includes(f.prediction) && md.includes(f.laterObservation));
  assert.ok(html.includes(f.prediction) && html.includes(f.laterObservation));
 }
 assert.ok(!html.includes('undefined'));
 assert.ok(html.includes('研究草案'));
});
test('all 11 studies remain generated from the same JSON sources',()=>{
 const r=spawnSync(process.execPath,['scripts/build-research.mjs','--check'],{cwd:root,encoding:'utf8'});
 assert.equal(r.status,0,r.stderr||r.stdout);
 assert.match(r.stdout,/11 research articles/);
});
