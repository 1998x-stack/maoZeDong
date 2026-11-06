(() => {
  'use strict';
  const works = JSON.parse(document.getElementById('works-data').textContent);
  works.sort((a,b) => a.date.localeCompare(b.date));
  const el = id => document.getElementById(id);
  const state = { volume: 0, topic: '', period: '', search: '', selected: works[0]?.id ?? null };
  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[character]));
  const volumeName = number => ['','第一卷','第二卷','第三卷','第四卷','第五卷'][number] ?? `第${number}卷`;
  const dateText = work => {
    const [year, month, day] = work.date.split('-');
    return year + '年' + (month ? Number(month)+'月' : '') + (day ? Number(day)+'日' : '');
  };
  const legacyLink = work => work.legacyReports.find(file => file.endsWith('.html')) || null;
  const searchText = work => [work.title,work.date,work.question,work.period,...work.topics].join(' ').toLowerCase();
  const filterWorks = () => works.filter(work => 
    (!state.volume || work.volume === state.volume) &&
    (!state.topic || work.topics.includes(state.topic)) &&
    (!state.period || work.period === state.period) &&
    (!state.search || searchText(work).includes(state.search.toLowerCase()))
  );
  const options = (id,values) => {
    const target = el(id);
    for (const value of values) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      target.appendChild(option);
    }
  };
  options('topic',[...new Set(works.flatMap(work => work.topics))].sort((a,b) => a.localeCompare(b,'zh')));
  options('period',[...new Set(works.map(work => work.period))]);
  el('total-count').textContent = String(works.length);

  function renderNav(){
    const volumes = [...new Set(works.map(work => work.volume))].sort((a,b)=>a-b);
    const all = [{id:0,label:'全部作品'},...volumes.map(v=>({id:v,label:volumeName(v)}))];
    el('volume-nav').innerHTML = all.map(item => {
      const count = item.id === 0 ? works.length : works.filter(w=>w.volume===item.id).length;
      return `<button type="button" class="volume-button" data-volume="${item.id}" aria-pressed="${state.volume === item.id}"><span>${escapeHtml(item.label)}</span><small>${count} 篇</small></button>`;
    }).join('');
  }

  function renderCard(work) {
    const selected = state.selected === work.id;
    return `<article class="work-card ${selected ? 'selected':''}">
      <div class="work-card-head">
        <span class="date">${escapeHtml(dateText(work))}</span>
        <span class="volume-label">${escapeHtml(volumeName(work.volume))}</span>
      </div>
      <button type="button" class="work-focus" data-id="${escapeHtml(work.id)}" aria-pressed="${selected}" aria-label="查看${escapeHtml(work.title)}的研究信息">${escapeHtml(work.title)}</button>
      <p class="question">${escapeHtml(work.question)}</p>
      <div class="work-card-footer"><a href="${escapeHtml(work.sourceUrl)}" target="_blank" rel="noopener noreferrer">阅读原著 ↗</a><span>${work.legacyReports.length} 份旧研究文件</span></div>
    </article>`;
  }

  function renderInspector(work) {
    const host = el('inspector');
    if (!work) {
      host.innerHTML = '<p class="inspector-empty">当前筛选条件没有匹配作品。可以清除筛选，再查看原著与研究报告。</p>';
      return;
    }
    const legacy = legacyLink(work);
    const source = `<a class="primary" href="${escapeHtml(work.sourceUrl)}" target="_blank" rel="noopener noreferrer">前往原著 ↗</a>`;
    const report = legacy ? `<a class="secondary" href="./${escapeHtml(encodeURI(legacy))}">查看旧研究稿 ↗</a>` : '';
    const links = work.legacyReports.filter(path=>path.endsWith('.html')).map((path,i)=>{
      return `<a href="./${escapeHtml(encodeURI(path))}">研究稿 ${i+1}</a>`;
    }).join('　');
    host.innerHTML = `
      <div class="inspector-kicker">WORK / 作品信息</div>
      <h3 tabindex="-1" id="inspector-title">${escapeHtml(work.title)}</h3>
      <div class="inspector-meta"><span>${escapeHtml(volumeName(work.volume))}</span><span>${escapeHtml(dateText(work))}</span><span>${escapeHtml(work.period)}</span></div>
      <div class="inspector-label">值得研究的问题</div>
      <p>${escapeHtml(work.question)}</p>
      <div class="inspector-label">原著版本身份</div>
      <p>${escapeHtml(work.sourceLabel)}</p>
      <div class="inspector-label">研究状态</div>
      <p class="review-status">已完成来源索引 · 尚未逐条审校历史论断</p>
      <div class="inspector-actions">${source}${report}</div>
      ${links ? `<div class="inspector-label">可查看的 HTML 研究稿</div><p>${links}</p>` : ''}
      <div class="inspector-note">${escapeHtml(work.notes)}<br>注意：旧稿是后期研究性解读，不是原著全文。</div>
    `;
  }
  function render(){
    renderNav();
    const visible = filterWorks();
    if (!visible.some(w => w.id === state.selected)) state.selected = visible[0]?.id ?? null;
    el('result-count').textContent = `找到 ${visible.length} 篇作品`;
    el('works-grid').innerHTML = visible.length
      ? visible.map(renderCard).join('')
      : `<div class="empty"><strong>没有找到匹配作品</strong>请尝试不同标题、主题或年份；目前仅收录首批来源已确认的样本。</div>`;
    renderInspector(visible.find(w => w.id === state.selected));
  }
  el('volume-nav').addEventListener('click', event => {
    const button = event.target.closest('button[data-volume]');
    if (!button) return;
    state.volume = Number(button.dataset.volume);
    render();
  });
  el('works-grid').addEventListener('click', event => {
    const button = event.target.closest('button[data-id]');
    if (!button) return;
    state.selected = button.dataset.id;
    render();
    el('inspector-title')?.focus({preventScroll:true});
    if (window.matchMedia('(max-width:1050px)').matches) el('inspector').scrollIntoView({behavior:'smooth',block:'start'});
  });
  el('search').addEventListener('input', event => {state.search=event.target.value.trim();render();});
  el('topic').addEventListener('change', event => {state.topic=event.target.value;render();});
  el('period').addEventListener('change', event => {state.period=event.target.value;render();});
  el('reset').addEventListener('click', () => {
    state.volume=0;state.topic='';state.period='';state.search='';
    el('search').value='';el('topic').value='';el('period').value='';
    render();el('search').focus();
  });
  render();
})();
