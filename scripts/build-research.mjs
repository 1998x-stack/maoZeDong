import {readFileSync,readdirSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('..',import.meta.url));
const works=JSON.parse(readFileSync(join(root,'data/works.json'),'utf8'));
const input=join(root,'research/articles');
const output=join(root,'research/published');
const check=process.argv.includes('--check');
function renderSupplement(a){
 if(!a.scene&&!a.actors&&!a.chronology&&!a.versionNotes&&!a.synthesis)return {preMd:"",postMd:"",preHtml:"",postHtml:""};
 const e=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const byId=new Map(a.sources.map(s=>[s.id,s]));
 const mdRefs=ids=>!ids?.length?"（尚缺可核实来源）":"（"+ids.map(id=>`[${id}](${byId.get(id).url})`).join("、")+"）";
 const htmlRefs=ids=>!ids?.length?'<span class="uncited">待证</span>':`<span class="citations">${ids.map(id=>`<a target="_blank" rel="noopener noreferrer" href="${e(byId.get(id).url)}">${e(id)}</a>`).join(" ")}</span>`;
 const preMd=[];
 const preHtml=[];
 if(a.scene){
  preMd.push(`## 历史现场与信息边界\n\n**${a.scene.heading}**\n\n${a.scene.frozen}\n\n**时间边界：** ${a.scene.boundary}\n\n**真正的决策问题：** ${a.scene.strategicQuestion}`);
  preHtml.push(`<section id="historical-scene" class="other-section insight-panel"><div class="ring-index">HISTORICAL SNAPSHOT · T0</div><h2>${e(a.scene.heading)}</h2><p>${e(a.scene.frozen)}</p><p class="boundary"><strong>信息边界：</strong>${e(a.scene.boundary)}</p><p><strong>关键问题：</strong>${e(a.scene.strategicQuestion)}</p></section>`);
 }
 if(a.chronology?.length){
  const labels={before:"T0之前",at:"T0附近",after:"T0之后｜事后复盘"};
  preMd.push("## 历史时间线：严格区分当时与后来\n\n"+a.chronology.map(t=>`- **${t.date}｜${labels[t.horizon]??t.horizon}｜${t.event}**：${t.notes} ${mdRefs(t.sourceIds)}`).join("\n"));
  preHtml.push(`<section id="chronology" class="other-section chronicle-panel"><h2>历史时间线：当时与事后分开</h2><ol class="chronicle">${a.chronology.map(t=>`<li data-horizon="${e(t.horizon)}"><div class="chronicle-top"><time>${e(t.date)}</time><span class="horizon">${e(labels[t.horizon]??t.horizon)}</span></div><strong>${e(t.event)}</strong><p>${e(t.notes)} ${htmlRefs(t.sourceIds)}</p></li>`).join("")}</ol></section>`);
 }
 if(a.actors?.length){
  preMd.push("## 行动者信息与权力地图\n\n| 行动者 | 当时位置 | 可能掌握的信息 | 现实约束 | 立场与证据限制 |\n| --- | --- | --- | --- | --- |\n"+a.actors.map(x=>`| ${x.name} | ${x.position} | ${x.information} | ${x.constraints} | ${x.positionSummary} ${mdRefs(x.sourceIds)} |`).join("\n"));
  preHtml.push(`<section id="actors" class="other-section actor-panel"><h2>行动者信息与权力地图</h2><p class="hint">区分正式职务、可能获得的信息与研究者推断；表中不虚构人物心理。</p><div class="actor-grid">${a.actors.map(x=>`<article class="actor-card"><h3>${e(x.name)}</h3><p class="actor-position">${e(x.position)}</p><dl><dt>信息条件</dt><dd>${e(x.information)}</dd><dt>现实约束</dt><dd>${e(x.constraints)}</dd><dt>判断与证据边界</dt><dd>${e(x.positionSummary)} ${htmlRefs(x.sourceIds)}</dd></dl></article>`).join("")}</div></section>`);
 }
 if(a.versionNotes?.length){
  preMd.push("## 版本谱系：避免把后来的文字写成当时的认识\n\n"+a.versionNotes.map(v=>`- **${v.date}｜${v.label}**：${v.details} ${mdRefs(v.sourceIds)}`).join("\n"));
  preHtml.push(`<section id="versions" class="other-section edition-panel"><h2>版本谱系与出处差异</h2><p class="hint">版本日期不等于作者当时已经拥有后期文字。需要比勘的地方明确保留。</p><ol>${a.versionNotes.map(v=>`<li><span class="version-date">${e(v.date)}</span><strong>${e(v.label)}</strong><p>${e(v.details)} ${htmlRefs(v.sourceIds)}</p></li>`).join("")}</ol></section>`);
 }
 const postMd=a.synthesis?`## 五环综合结论与适用边界\n\n${a.synthesis}`:"";
 const postHtml=a.synthesis?`<section id="synthesis" class="other-section synthesis-panel"><div class="ring-index">SYNTHESIS · EVIDENCE FIRST</div><h2>五环综合结论与适用边界</h2><p>${e(a.synthesis)}</p></section>`:"";
 return {preMd:preMd.join("\n\n"),postMd,preHtml:preHtml.join("\n"),postHtml};
}
function renderForecastAudit(a){
 if(!Array.isArray(a.forecastAudit)||!a.forecastAudit.length)return null;
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const refs=new Map(a.sources.map(s=>[s.id,s]));
 const mdCite=ids=>ids.length?'（'+ids.map(id=>'['+id+']('+refs.get(id).url+')').join('、')+'）':'（待证）';
 const htmlCite=ids=>ids.length?'<span class="citations">'+ids.map(id=>'<a href="'+esc(refs.get(id).url)+'" rel="noopener noreferrer" target="_blank">'+esc(id)+'</a>').join(' ')+'</span>':'<span class="uncited">待证</span>';
 const md='## 预期与结果：在T0之后检验，而不是倒推\n\n本节是史料对照表；“后来观察”只用于事后检验，不代表1938年已知。评估描述的是可核验的范围，而非历史预言的准确率。\n\n| T0时的判断 | 当时判断依据 | 成立条件或不确定性 | 后来观察（仅事后） | 检验与边界 |\n| --- | --- | --- | --- | --- |\n'+a.forecastAudit.map(x=>'| '+x.prediction+' | '+x.basis+' | '+x.conditions+' | '+x.laterObservation+' | '+x.assessment+' '+mdCite(x.sourceIds)+' |').join('\n');
 const html='<section id="forecast-audit" class="other-section forecast-panel"><div class="ring-index">EXPECTATION VS EVIDENCE · AFTER T0</div><h2>预期与结果：事后检验表</h2><p class="forecast-intro">后来的观察只用于评估1938年的条件性判断，不能放入当时人物的已知信息。</p><div class="table-scroll" role="region" aria-label="1938年判断与事后检验对照表" tabindex="0"><table><thead><tr><th scope="col">当时判断</th><th scope="col">T0依据</th><th scope="col">成立条件</th><th scope="col">后来观察</th><th scope="col">检验边界</th></tr></thead><tbody>'+a.forecastAudit.map(x=>'<tr><th scope="row">'+esc(x.prediction)+'</th><td>'+esc(x.basis)+'</td><td>'+esc(x.conditions)+'</td><td>'+esc(x.laterObservation)+'</td><td>'+esc(x.assessment)+' '+htmlCite(x.sourceIds)+'</td></tr>').join('')+'</tbody></table></div></section>';
 return {md,html};
}

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
<section id="sources" class="other-section"><h2>史料、版本与待证问题</h2><p>材料是当前证据链的入口；回顾性史料及编订注释不等于${esc(a.t0.date)}当时的人物已知信息。</p><ol class="sources">${sourcesHtml}</ol><h3>仍未核实</h3><ul>${a.unresolved.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section><footer>原创研究草案 · 证据等级 A / B / C / D 并非可靠性自动认证。<a href="../../index.html">返回作品目录</a></footer></main></div></body></html>
`;
 const supplement=renderSupplement(a);
 const joinedMd=supplement.preMd ? md.replace("\n\n## 1. 认识现实","\n\n"+supplement.preMd+"\n\n## 1. 认识现实") : md;
 const finalMd=supplement.postMd ? joinedMd.replace("\n\n## 方案对照","\n\n"+supplement.postMd+"\n\n## 方案对照") : joinedMd;
 let finalHtml=supplement.preHtml ? html.replace('<section id="reality"',supplement.preHtml+'\n<section id="reality"') : html;
 if(supplement.postHtml)finalHtml=finalHtml.replace('<section id="alternatives"',supplement.postHtml+'\n<section id="alternatives"');
 if(supplement.preHtml)finalHtml=finalHtml.replace('<nav>','<nav><a href="#historical-scene">历史现场</a><a href="#chronology">时间截面</a><a href="#actors">人物信息</a><a href="#versions">版本沿革</a>');
 if(supplement.postHtml)finalHtml=finalHtml.replace('<a href="#alternatives">','<a href="#synthesis">研究结论</a><a href="#alternatives">');
 const audit=renderForecastAudit(a);
 if(!audit)return {md:finalMd,html:finalHtml};
 if(!finalMd.includes("\n\n## 仍待核实")||!finalHtml.includes('<section id="sources"'))throw Error('Research sections missing for forecast audit');
 const withAuditMd=finalMd.replace("\n\n## 仍待核实","\n\n"+audit.md+"\n\n## 仍待核实");
 const withAuditHtml=finalHtml.replace('<section id="sources"',audit.html+'\n<section id="sources"').replace('<a href="#sources">','<a href="#forecast-audit">预期检验</a><a href="#sources">');
 return {md:withAuditMd,html:withAuditHtml};
}
function validateArticle(a,w){
 if(a.schemaVersion!==1||a.workId!==w.id||a.status!=="draft")throw Error("Invalid pilot work metadata");
 const rings=["reality","structure","options","execution","feedback"];
 if(a.rings.length!==5||a.rings.some((r,i)=>r.id!==rings[i]||!r.claims.length))throw Error("Invalid ring chain");
 const ids=new Set(a.sources.map(s=>s.id));
 if(a.scene){
  if(!a.t0?.date || !a.scene.frozen || !a.scene.boundary || !a.scene.strategicQuestion)throw Error("Incomplete historical scene");
  if(!Array.isArray(a.actors)||a.actors.length<3||!Array.isArray(a.chronology)||a.chronology.length<3||!Array.isArray(a.versionNotes)||a.versionNotes.length<2)throw Error("Research supplement incomplete");
  if(a.rings.some(r=>r.claims.length<3))throw Error("Expected deeper evidence claims in each ring");
  if(!a.synthesis || !Array.isArray(a.unresolved)||a.unresolved.length<2)throw Error("Missing synthesis or open issues");
 }
 if(a.forecastAudit!==undefined){
  if(!Array.isArray(a.forecastAudit)||a.forecastAudit.length<3)throw Error("Insufficient forecast audit");
  for(const f of a.forecastAudit){
   if(!f.prediction||!f.basis||!f.conditions||!f.laterObservation||!f.assessment||!Array.isArray(f.sourceIds)||!f.sourceIds.length)throw Error("Incomplete forecast evidence");
   if(f.sourceIds.some(id=>!ids.has(id)))throw Error("Unknown forecast source");
  }
 }
 for(const s of a.sources)if(!s.url.startsWith("https://"))throw Error("Non-https source");
 for(const record of [...(a.chronology??[]),...(a.actors??[]),...(a.versionNotes??[])]){
  if(!Array.isArray(record.sourceIds)||record.sourceIds.some(id=>!ids.has(id)))throw Error("Unresolved source in supplementary section");
 }
 if(a.chronology && a.chronology.some(c=>!['before','at','after'].includes(c.horizon)))throw Error("Invalid chronology horizon");
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
