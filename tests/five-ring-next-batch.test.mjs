import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('..',import.meta.url));
const read=p=>readFileSync(join(root,p),'utf8');
const ids=["mao-1928-red-power","mao-1928-jinggang","mao-1930-spark"];
const works=JSON.parse(read('data/works.json'));
test('1928–1930 second batch preserves dates, sources, T0 and draft status',()=>{
 for(const id of ids){
  const a=JSON.parse(read('research/articles/'+id+'.json'));
  assert.equal(a.workId,id);
  assert.equal(a.status,'draft');
  assert.equal(a.rings.length,5);
  assert.ok(a.rings.every(r=>r.claims.length>=3));
  assert.ok(a.actors.length>=4 && a.chronology.length>=4 && a.versionNotes.length>=3);
  assert.ok(a.chronology.some(x=>x.horizon==='before'));
  assert.ok(a.chronology.some(x=>x.horizon==='after'));
  const known=new Set(a.sources.map(s=>s.id));
  for(const r of a.rings)for(const claim of r.claims){
   assert.ok(['A','B','C','D'].includes(claim.grade));
   assert.ok(claim.sourceIds.every(s=>known.has(s)));
   if(claim.grade==='A'||claim.grade==='B')assert.ok(claim.sourceIds.length>0);
  }
  for(const x of [...a.actors,...a.chronology,...a.versionNotes])
   assert.ok(x.sourceIds.every(s=>known.has(s)));
  const w=works.find(w=>w.id===id);
  assert.equal(w.reviewStatus,'catalogued');
  assert.equal(w.researchBrief,'research/published/'+id+'.html');
 }
});
test('all three MD and HTML deliver the five rings, actors, timeline and version evidence',()=>{
 for(const id of ids){
  const md=read('research/published/'+id+'.md'),html=read('research/published/'+id+'.html');
  for(const phrase of ['认识现实','识别结构','比较选择','组织执行','反馈纠偏','历史时间线','行动者信息','版本谱系']){
   assert.ok(md.includes(phrase),id+': missing MD '+phrase);
   assert.ok(html.includes(phrase),id+': missing HTML '+phrase);
  }
  assert.ok(html.includes('id="actors"'));
  assert.ok(html.includes('data-horizon="after"'));
  assert.ok(html.includes('研究草案'));
  assert.ok(!html.includes('undefined'));
  assert.ok(read('index.html').includes('research/published/'+id+'.html'));
 }
});
test('new studies are generated alongside preserved legacy reports, not overwriting them',()=>{
 for(const id of ids){
  const w=works.find(w=>w.id===id);
  assert.ok(w.legacyReports.length>=2);
  for(const oldPath of w.legacyReports)assert.ok(existsSync(join(root,oldPath)),oldPath);
 }
 const check=spawnSync(process.execPath,['scripts/build-research.mjs','--check'],{cwd:root,encoding:'utf8'});
 assert.equal(check.status,0,check.stderr || check.stdout);
});
