import {existsSync,readFileSync,readdirSync,statSync} from 'node:fs';
import {dirname,join,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const dist=resolve(root,'dist');
const works=JSON.parse(readFileSync(join(root,'data/works.json'),'utf8'));
const manifest=JSON.parse(readFileSync(join(dist,'pages-manifest.json'),'utf8'));
const published=new Set(manifest.files);
let links=0;
function scan(dir){
 for(const entry of readdirSync(dir,{withFileTypes:true})){
  const path=join(dir,entry.name);
  if(entry.isDirectory())scan(path);
  else if(entry.isFile()&&path.endsWith('.html')){
   const html=readFileSync(path,'utf8');
   for(const m of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)){
    const url=m[1].trim();
    if(/^(?:https?:|data:|mailto:|tel:|javascript:|\/\/|#)/i.test(url))continue;
    if(url.startsWith('/'))throw Error('Absolute project Pages link: '+path+' -> '+url);
    const pathPart=url.split(/[?#]/,1)[0];
    if(!pathPart)continue;
    const target=resolve(dirname(path),decodeURIComponent(pathPart));
    if(!target.startsWith(dist+sep)||!existsSync(target)||!statSync(target).isFile())throw Error('Broken internal Pages link '+path+' -> '+url);
    links++;
   }
  }
 }
}
for(const p of manifest.files)if(!existsSync(join(dist,p)))throw Error('Manifest file missing: '+p);
for(const w of works){
 if(!published.has(w.researchBrief))throw Error('Missing work research '+w.id);
 if(!published.has('research/articles/'+w.id+'.json'))throw Error('Missing evidence JSON '+w.id);
 for(const p of w.legacyReports)if((!p.endsWith('.html')||statSync(join(root,p)).size>0)&&!published.has(p))throw Error('Unpublished legacy link '+p);
}
for(const p of ['index.html','404.html','.nojekyll','robots.txt','sitemap.xml','web/app.js','web/reader.js','web/styles.css','web/research.css','web/favicon.svg'])if(!published.has(p))throw Error('Asset not deployed '+p);
scan(dist);
console.log('Validated '+manifest.files.length+' Pages assets and '+links+' internal HTML links.');
