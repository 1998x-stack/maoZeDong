import {readFileSync,readdirSync,statSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
const root=fileURLToPath(new URL('..',import.meta.url));
const works=JSON.parse(readFileSync(join(root,'data/works.json'),'utf8'));
const lookup=new Map(works.flatMap(w=>w.legacyReports.map(path=>[path,w.id])));
const pairs=new Map();
for(const name of readdirSync(root)){
 const match=name.match(/^(\d{3}.+)\.(md|html)$/);
 if(!match)continue;
 const p=pairs.get(match[1])||{base:match[1],md:null,html:null,mdBytes:null,htmlBytes:null,workId:null,phase:"P0-inventoried",issues:[]};
 p[match[2]]=name;p[match[2]+"Bytes"]=statSync(join(root,name)).size;
 p.workId ||= lookup.get(name)||null;pairs.set(match[1],p);
}
const items=[...pairs.values()].sort((a,b)=>a.base<b.base?-1:a.base>b.base?1:0).map(p=>{
 if(!p.md||!p.html)p.issues.push('missing-format');
 if((p.md!==null&&p.mdBytes===0)||(p.html!==null&&p.htmlBytes===0))p.issues.push('zero-byte');
 if(!p.workId)p.issues.push('not-yet-catalogued');
 if(p.base.includes('公务员'))p.issues.push('out-of-scope');
 return p;
});
const value=JSON.stringify({schemaVersion:1,description:'旧研究稿根目录盘点；P0 只表示发现文件，并非史料审校',items},null,2)+'\n';
const file=join(root,'data/legacy-inventory.json');
if(process.argv.includes('--check')){
 if(value!==readFileSync(file,'utf8')){console.error('Inventory outdated: node scripts/inventory-legacy.mjs');process.exitCode=1;}
 else console.log('Legacy inventory matches: '+items.length+' groups');
}else{writeFileSync(file,value,'utf8');console.log('Inventoried '+items.length+' groups');}
