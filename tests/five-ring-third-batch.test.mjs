import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
const root=fileURLToPath(new URL('..',import.meta.url));
const read=p=>readFileSync(join(root,p),'utf8');
const ids=["mao-1925-class-analysis","mao-1929-party-thought","mao-1937-liberalism"];
const works=JSON.parse(read('data/works.json'));
test('third batch has five evidence-ranked rings and historically bounded actor models',()=>{
 for(const id of ids){
  const a=JSON.parse(read('research/articles/'+id+'.json'));
  assert.equal(a.workId,id);
  assert.equal(a.status,'draft');
  assert.equal(a.rings.length,5);
  assert.ok(a.rings.every(r=>r.claims.length===4));
  assert.ok(a.actors.length>=4&&a.chronology.length>=4&&a.versionNotes.length>=3);
  assert.ok(a.chronology.some(x=>x.horizon==='after')&&a.chronology.some(x=>x.horizon==='at'));
  const sources=new Set(a.sources.map(s=>s.id));
  assert.equal(sources.size,a.sources.length);
  for(const r of a.rings)for(const claim of r.claims){
   assert.ok(['A','B','C','D'].includes(claim.grade));
   assert.ok(claim.sourceIds.every(id=>sources.has(id)));
   if(claim.grade==='A')assert.ok(claim.sourceIds.length>0);
   if(claim.grade==='B')assert.ok(claim.sourceIds.length>=2);
  }
  for(const record of [...a.actors,...a.chronology,...a.versionNotes]){
   assert.ok(record.sourceIds.every(id=>sources.has(id)));
  }
  const w=works.find(w=>w.id===id);
  assert.equal(w.reviewStatus,'catalogued');
  assert.equal(w.researchBrief,'research/published/'+id+'.html');
 }
});
test('third-batch Markdown and HTML carry actor, edition and chronology sections',()=>{
 for(const id of ids){
  const md=read('research/published/'+id+'.md');
  const html=read('research/published/'+id+'.html');
  for(const item of ['认识现实','识别结构','比较选择','组织执行','反馈纠偏','历史时间线','行动者信息','版本谱系']){
   assert.ok(md.includes(item),id+' markdown missing '+item);
   assert.ok(html.includes(item),id+' html missing '+item);
  }
  assert.ok(html.includes('id="historical-scene"')&&html.includes('id="actors"'));
  assert.ok(html.includes('研究草案'));
  assert.ok(!html.includes('不等于1930年的可用信息'));
  assert.ok(read('index.html').includes('research/published/'+id+'.html'));
 }
});
test('legacy reports are preserved and all research representations are generated from JSON',()=>{
 for(const id of ids){
  const work=works.find(x=>x.id===id);
  assert.ok(work.legacyReports.length>=2);
  for(const path of work.legacyReports)assert.ok(existsSync(join(root,path)),path);
 }
 const r=spawnSync(process.execPath,['scripts/build-research.mjs','--check'],{cwd:root,encoding:'utf8'});
 assert.equal(r.status,0,r.stderr||r.stdout);
});
