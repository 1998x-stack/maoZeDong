import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
const root=fileURLToPath(new URL('..',import.meta.url));
const read=p=>readFileSync(join(root,p),'utf8');
const works=JSON.parse(read('data/works.json'));
const ids=['mao-1927-hunan-peasant','mao-1937-practice','mao-1937-contradiction'];
test('three studies have distinct historical scenes, actors, editions and all five rings',()=>{
 for(const id of ids){
  const data=JSON.parse(read('research/articles/'+id+'.json'));
  assert.equal(data.workId,id);
  assert.equal(data.status,'draft');
  assert.equal(data.rings.length,5);
  assert.ok(data.rings.every(r=>r.claims.length>=3));
  assert.ok(data.actors.length>=3 && data.versionNotes.length>=2 && data.chronology.length>=3);
  assert.ok(data.chronology.some(x=>x.horizon==='after'));
  const sourceIds=new Set(data.sources.map(s=>s.id));
  for(const item of [...data.actors,...data.chronology,...data.versionNotes])
   assert.ok(item.sourceIds.every(x=>sourceIds.has(x)),id+' unresolved reference');
  assert.equal(works.find(w=>w.id===id).reviewStatus,'catalogued');
  assert.equal(works.find(w=>w.id===id).researchBrief,'research/published/'+id+'.html');
 }
});
test('newly generated MD/HTML contain the research evidence, actor and version sections',()=>{
 for(const id of ids){
  const md=read('research/published/'+id+'.md'),html=read('research/published/'+id+'.html');
  for(const marker of ['历史现场','行动者','版本','认识现实','识别结构','比较选择','组织执行','反馈纠偏']){
   assert.ok(md.includes(marker),id+': MD missing '+marker);
   assert.ok(html.includes(marker),id+': HTML missing '+marker);
  }
  assert.ok(html.includes('id="historical-scene"') && html.includes('id="actors"'));
  assert.ok(html.includes('data-horizon="after"'));
  assert.ok(html.includes('研究草案'));
  assert.ok(!html.includes('undefined'));
 }
});
test('build-research output remains reproducible after adding richer study sections',()=>{
 const r=spawnSync(process.execPath,['scripts/build-research.mjs','--check'],{cwd:root,encoding:'utf8'});
 assert.equal(r.status,0,r.stderr || r.stdout);
});
