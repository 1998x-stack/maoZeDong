import {readFileSync,readdirSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('..',import.meta.url));
const works=JSON.parse(readFileSync(join(root,'data/works.json'),'utf8'));
const input=join(root,'research/articles');
const output=join(root,'research/published');
const check=process.argv.includes('--check');
function renderResearch(a,w){
 const esc=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const urlRef=id=>a.sources.find(s=>s.id===id);
 const citeMd=ids=>ids.length?"（"+ids.map(id=>{const s=urlRef(id);return `[${id}](${s.url})`;}).join("、")+"）":"（尚缺可核实来源）";
 const citeHtml=ids=>ids.length?`<span class="citations">${ids.map(id=>{const s=urlRef(id);return `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="查看来源${esc(id)}">${esc(id)}</a>`;}).join(" ")}</span>`:`<span class="uncited">待证</span>`;
 const claimMd=c=>`- **[${c.grade}]** ${c.text} ${citeMd(c.sourceIds)}`;
 const claimHtml=c=>`<li class="claim"><span class="grade grade-${esc(c.grade)}" aria-label="证据等级${esc(c.grade)}">${esc(c.grade)}</span><span>${esc(c.text)} ${citeHtml(c.sourceIds)}</span></li>`;
 const ringMd=a.rings.map((r,i)=>`## ${i+1}. ${r.title}\n\n**研究问题：** ${r.question}\n\n${r.claims.map(claimMd).join("\n")}`).join("\n\n");
 const ringHtml=a.rings.map((r,i)=>`<section id="${esc(r.id)}" class="ring"><div class="ring-index">0${i+1} / FIVE RINGS</div><h2>${esc(r.title)}</h2><p class="ring-question">${esc(r.question)}</p><ul class="claims">${r.claims.map(claimHtml).join("")}</ul></section>`).join("\n");
 const alternativesMd="| 可能路径 | 方案身份 | 预期机会 | 风险与代价 |\n| --- | --- | --- | --- |\n"+a.alternatives.map(x=>`| ${x.name} | ${x.kind==="reconstructed"?"研究者重建":"同期已提出"} | ${x.benefit} | ${x.risk} |`).join("\n");
 const alternativesHtml=`<section id="alternatives" class="other-section"><h2>真实选择与分析性方案</h2><p>下表均标明来源身份，不能把研究者构建的路径说成当时确有正式提案。</p><div class="table-scroll"><table><thead><tr><th scope="col">可能路径</th><th scope="col">性质</th><th scope="col">潜在机会</th><th scope="col">风险与约束</th></tr></thead><tbody>${a.alternatives.map(x=>`<tr><th scope="row">${esc(x.name)}</th><td>${x.kind==="reconstructed"?"分析性重建":"同期提出"}</td><td>${esc(x.benefit)}</td><td>${esc(x.risk)}</td></tr>`).join("")}</tbody></table></div></section>`;
 const sourcesMd=a.sources.map(s=>`- **${s.id}** [${s.title}](${s.url}) — ${s.kind}；${s.note}`).join("\n");
 const sourcesHtml=a.sources.map(s=>`<li><strong>${esc(s.id)}</strong> <a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a><span>${esc(s.note)}</span></li>`).join("");
 const status="研究草案 · 尚未逐条史料审校";
 const md=`# ${w.title}｜五环决策研究\n\n> ${status}。不是原著全文；原著请见 [在线来源](${w.sourceUrl})。\n\n**时间冻结（T0）：** ${a.t0.label}\n\n**核心问题：** ${a.thesis}\n\n${a.intro}\n\n${ringMd}\n\n## 方案对照\n\n${alternativesMd}\n\n## 仍待核实\n\n${a.unresolved.map(s=>"- "+s).join("\n")}\n\n## 来源与版本身份\n\n${sourcesMd}\n\n> 五环是研究框架，不是毛泽东本人提出的固定五段公式；所有结论保留证据等级与版本限制。\n`;
 const html=`<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><meta name="description" content="${esc(w.title)}：基于历史信息截面的五环决策研究草案">
<title>${esc(w.title)}｜史境·五环研究</title><link rel="stylesheet" href="../../web/research.css"></head>
<body><a class="skip-link" href="#main">跳转到正文</a><header class="topbar"><a class="brand" href="../../index.html">史境 <span>／五环研究</span></a><a href="${esc(w.sourceUrl)}" target="_blank" rel="noopener noreferrer">原著外链 ↗</a></header>
<div class="layout"><aside class="side" aria-label="研究环节导航"><strong>FIVE RINGS</strong><nav>${a.rings.map((r,i)=>`<a href="#${esc(r.id)}"><span>${i+1}</span>${esc(r.title)}</a>`).join("")}<a href="#alternatives">方案对照</a><a href="#sources">证据与争议</a></nav><p>信息条件优先于事后结论。</p></aside>
<main id="main"><div class="eyebrow">HISTORICAL DECISION RESEARCH · ${esc(a.t0.date)}</div><h1>${esc(w.title)}<small>五环决策研究</small></h1><p class="status" role="status">${status}</p><section class="lead" aria-label="研究摘要"><h2>历史信息截面</h2><p><strong>T0：</strong>${esc(a.t0.label)}</p><p><strong>核心问题：</strong>${esc(a.thesis)}</p><p>${esc(a.intro)}</p></section>
${ringHtml}${alternativesHtml}
<section id="sources" class="other-section"><h2>史料、版本与待证问题</h2><p>材料是当前证据链的入口；部分回顾性研究不等于1930年的可用信息。</p><ol class="sources">${sourcesHtml}</ol><h3>仍未核实</h3><ul>${a.unresolved.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section><footer>原创研究草案 · 证据等级 A / B / C / D 并非可靠性自动认证。<a href="../../index.html">返回作品目录</a></footer></main></div></body></html>
`;
 return {md,html};
}
function validateArticle(a,w){
 if(a.schemaVersion!==1||a.workId!==w.id||a.status!=="draft")throw Error("Invalid pilot work metadata");
 const rings=["reality","structure","options","execution","feedback"];
 if(a.rings.length!==5||a.rings.some((r,i)=>r.id!==rings[i]||!r.claims.length))throw Error("Invalid ring chain");
 const ids=new Set(a.sources.map(s=>s.id));
 for(const s of a.sources)if(!s.url.startsWith("https://"))throw Error("Non-https source");
 for(const r of a.rings)for(const c of r.claims){
  if(!["A","B","C","D"].includes(c.grade)||!Array.isArray(c.sourceIds)||c.sourceIds.some(id=>!ids.has(id)))throw Error("Invalid claim");
  if(["A","B"].includes(c.grade)&&!c.sourceIds.length)throw Error("No evidence for confirmed claim");
 }
}
let n=0;
for(const name of readdirSync(input).filter(n=>n.endsWith('.json')).sort()){
 const data=JSON.parse(readFileSync(join(input,name),'utf8'));
 const work=works.find(x=>x.id===data.workId);
 if(!work)throw Error('Missing work for '+name);
 if(name!==data.workId+'.json')throw Error('File name and work ID mismatch');
 validateArticle(data,work);
 const out=renderResearch(data,work);
 for(const [ext,content] of Object.entries(out)){
  const path=join(output,data.workId+'.'+ext);
  if(check){
   if(!existsSync(path)||readFileSync(path,'utf8')!==content)throw Error('Outdated '+path+'; run node scripts/build-research.mjs');
  }else{mkdirSync(output,{recursive:true});writeFileSync(path,content,'utf8');}
 }
 n++;
}
if(n===0)throw Error('No research articles found');
console.log((check?'Verified ':'Generated ')+n+' research articles in both MD and HTML.');
