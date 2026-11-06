import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('..',import.meta.url));
const dist=join(root,'dist');
const works=JSON.parse(readFileSync(join(root,'data/works.json'),'utf8'));
const build=spawnSync(process.execPath,['scripts/build-pages.mjs'],{cwd:root,encoding:'utf8'});

test('curated Pages build excludes repository tooling and unrelated reports',()=>{
 assert.equal(build.status,0,build.stderr||build.stdout);
 const manifest=JSON.parse(readFileSync(join(dist,'pages-manifest.json'),'utf8'));
 assert.equal(manifest.schemaVersion,1);
 assert.ok(manifest.files.includes('.nojekyll'));
 assert.ok(!manifest.files.some(p=>p.startsWith('tests/')||p.startsWith('.opencode/')||p.includes('公务员考试')));
 assert.ok(!manifest.files.includes('AGENTS.md'));
 assert.equal(manifest.files.filter(p=>p.startsWith('research/published/')&&p.endsWith('.html')).length,works.length);
 for(const work of works){
  assert.ok(existsSync(join(dist,work.researchBrief)));
  assert.ok(existsSync(join(dist,'research/articles/'+work.id+'.json')));
 }
});
test('Pages has no broken local HTML paths and supports research reading controls',()=>{
 const check=spawnSync(process.execPath,['scripts/check-pages.mjs'],{cwd:root,encoding:'utf8'});
 assert.equal(check.status,0,check.stderr||check.stdout);
 const home=readFileSync(join(dist,'index.html'),'utf8');
 assert.ok(home.includes('id="timeline-nav"'));
 assert.ok(home.includes('id="works-data"'));
 const html=readFileSync(join(dist,'research/published/mao-1938-protracted-war.html'),'utf8');
 assert.ok(html.includes('id="reader-t0"'));
 assert.ok(html.includes('id="forecast-audit"'));
 assert.ok(html.includes('reader.js'));
 assert.ok(html.includes('../articles/mao-1938-protracted-war.json'));
});
test('deployment is restricted to main, not pull requests',()=>{
 const yml=readFileSync(join(root,'.github/workflows/pages.yml'),'utf8');
 assert.match(yml,/branches: \[main\]/);
 assert.doesNotMatch(yml,/pull_request:/);
 assert.match(yml,/actions\/deploy-pages@v4/);
 assert.match(yml,/id-token: write/);
});
