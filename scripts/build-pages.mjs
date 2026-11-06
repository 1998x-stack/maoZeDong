import {copyFileSync,existsSync,mkdirSync,readFileSync,rmSync,statSync,writeFileSync} from 'node:fs';
import {dirname,join,relative,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const dist=resolve(root,'dist');
const works=JSON.parse(readFileSync(join(root,'data/works.json'),'utf8'));
const migration=JSON.parse(readFileSync(join(root,'data/migrations/report-files.json'),'utf8'));
const byTarget=new Map(migration.files.map(x=>[x.target,x]));
const published=new Set();
rmSync(dist,{recursive:true,force:true});
mkdirSync(dist,{recursive:true});
function copy(file){
 const path=file.replaceAll('\\','/');
 const source=resolve(root,path);
 if(!source.startsWith(root+sep)||!existsSync(source)||!statSync(source).isFile())throw Error('Invalid Pages source '+file);
 if(published.has(path))return;
 const target=join(dist,path);
 mkdirSync(dirname(target),{recursive:true});
 copyFileSync(source,target);
 published.add(path);
}
function generate(file,content){
 const target=resolve(dist,file);
 if(!target.startsWith(dist+sep))throw Error('Invalid generated path '+file);
 mkdirSync(dirname(target),{recursive:true});
 writeFileSync(target,content,'utf8');
 published.add(file);
}
for(const p of ['index.html','web/app.js','web/reader.js','web/styles.css','web/research.css','web/favicon.svg'])copy(p);
for(const work of works){
 if(!work.researchBrief)throw Error('Missing five-ring research '+work.id);
 copy(work.researchBrief);
 copy('research/published/'+work.id+'.md');
 copy('research/articles/'+work.id+'.json');
 for(const path of work.legacyReports){
  if(path.endsWith('.html')&&statSync(join(root,path)).size===0)continue;
  copy(path);
  if(path.endsWith('.html')){
   const css=byTarget.get(path)?.css;
   if(!css)throw Error('Legacy CSS mapping absent: '+path);
   copy(css);
  }
 }
}
const site=new URL(process.env.PAGES_SITE_URL||'https://1998x-stack.github.io/maoZeDong/');
if(site.protocol!=='https:'||site.search||site.hash)throw Error('PAGES_SITE_URL must be an HTTPS site root');
const base=site.href.endsWith('/')?site.href:site.href+'/';
const urls=['',...works.map(w=>w.researchBrief)].map(path=>base+path);
generate('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(url=>'  <url><loc>'+url.replaceAll('&','&amp;')+'</loc></url>').join('\n')+'\n</urlset>\n');
generate('robots.txt','User-agent: *\nAllow: /\nSitemap: '+base+'sitemap.xml\n');
generate('.nojekyll','');
generate('404.html',[
 '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>页面不存在 · 史境</title>',
 '<style>body{min-height:100vh;margin:0;background:#f7f5f0;color:#183d35;display:grid;place-items:center;font:16px/1.9 system-ui,sans-serif}main{padding:40px;text-align:center}b{font:500 90px Georgia,serif;color:#a24d42}a{display:inline-block;padding:8px 20px;background:#183d35;border-radius:5px;color:#fff;text-decoration:none}</style>',
 '</head><body><main><b>404</b><h1>这份资料暂时不在这里</h1><p>请返回目录按年代、主题或作品名称重新查找。</p><a href="'+base+'">返回史境目录 ↗</a></main></body></html>'
].join('\n')+'\n');
generate('pages-manifest.json',JSON.stringify({schemaVersion:1,site:base,description:'Curated published archive; no unrelated reports or tooling.',files:[...published].sort()},null,2)+'\n');
console.log('Built '+published.size+' curated Pages assets and '+works.length+' works at '+relative(root,dist));
