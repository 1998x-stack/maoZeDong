(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const source = byId('works-data');
  if (!source) return;
  const works = JSON.parse(source.textContent).sort((a, b) => a.date.localeCompare(b.date));
  const q = new URLSearchParams(window.location.search);
  const paths = {
    social: ['mao-1925-class-analysis', 'mao-1927-hunan-peasant', 'mao-1930-against-bookishness'],
    organization: ['mao-1928-red-power', 'mao-1928-jinggang', 'mao-1929-party-thought', 'mao-1930-spark'],
    method: ['mao-1937-practice', 'mao-1937-contradiction', 'mao-1937-liberalism', 'mao-1938-protracted-war']
  };
  const years = [...new Set(works.map(w => w.date.slice(0, 4)))];
  const topics = [...new Set(works.flatMap(w => w.topics))].sort((a, b) => a.localeCompare(b, 'zh'));
  const periods = [...new Set(works.map(w => w.period))];
  const volumes = [...new Set(works.map(w => w.volume))].sort((a, b) => a - b);
  const state = {
    volume: Number(q.get('volume')) || 0,
    topic: topics.includes(q.get('topic')) ? q.get('topic') : '',
    period: periods.includes(q.get('period')) ? q.get('period') : '',
    year: years.includes(q.get('year')) ? q.get('year') : '',
    path: Object.hasOwn(paths, q.get('path')) ? q.get('path') : '',
    search: (q.get('q') || '').slice(0, 120),
    selected: works.some(w => w.id === q.get('work')) ? q.get('work') : (works[0]?.id || null)
  };
  if (!volumes.includes(state.volume)) state.volume = 0;
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
  const localUrl = path => './' + encodeURI(path).replaceAll('#', '%23').replaceAll('?', '%3F');
  const volumeName = n => ['','第一卷','第二卷','第三卷','第四卷','第五卷'][n] || ('第' + n + '卷');
  const dateText = w => {
    const [y, m, d] = w.date.split('-');
    return y + '年' + (m ? Number(m) + '月' : '') + (d ? Number(d) + '日' : '');
  };
  const pathNames = {social: '调查与社会结构', organization: '根据地与组织选择', method: '认识与战争判断'};
  const searchIndex = w => [w.title, w.date, w.question, w.period, ...w.topics].join(' ').toLocaleLowerCase();
  const visibleWorks = () => works.filter(w =>
    (!state.volume || w.volume === state.volume) &&
    (!state.topic || w.topics.includes(state.topic)) &&
    (!state.period || w.period === state.period) &&
    (!state.year || w.date.startsWith(state.year)) &&
    (!state.path || paths[state.path]?.includes(w.id)) &&
    (!state.search || searchIndex(w).includes(state.search.toLocaleLowerCase()))
  );
  const optionList = (id, values) => {
    const target = byId(id);
    for (const value of values) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      target.append(option);
    }
  };
  optionList('topic', topics);
  optionList('period', periods);
  byId('search').value = state.search;
  byId('topic').value = state.topic;
  byId('period').value = state.period;
  byId('total-count').textContent = String(works.length);
  byId('research-count').textContent = String(works.filter(w => w.researchBrief).length);
  byId('period-count').textContent = String(periods.length);
  document.querySelectorAll('[data-path-count]').forEach(el => {
    const key = el.dataset.pathCount;
    el.textContent = (paths[key]?.filter(id => works.some(w => w.id === id)).length || 0) + ' 篇作品';
  });

  function syncUrl() {
    const url = new URL(window.location.href);
    const current = {
      work: state.selected, volume: state.volume || '', topic: state.topic,
      period: state.period, year: state.year, path: state.path, q: state.search
    };
    for (const [key, value] of Object.entries(current)) {
      if (value) url.searchParams.set(key, String(value));
      else url.searchParams.delete(key);
    }
    if (url.href !== window.location.href) window.history.replaceState({}, '', url.pathname + url.search + url.hash);
  }

  function renderNav() {
    const choices = [{id: 0, label: '全部作品'}, ...volumes.map(n => ({id: n, label: volumeName(n)}))];
    byId('volume-nav').innerHTML = choices.map(x => {
      const count = x.id ? works.filter(w => w.volume === x.id).length : works.length;
      return '<button type="button" class="volume-button" data-volume="' + x.id + '" aria-pressed="' + (state.volume === x.id) +
        '"><span>' + escapeHtml(x.label) + '</span><small>' + count + '</small></button>';
    }).join('');
  }

  function renderTimeline() {
    const choices = [{year: '', label: '全部'}, ...years.map(year => ({year, label: year}))];
    byId('timeline-nav').innerHTML = choices.map(x => {
      const n = x.year ? works.filter(w => w.date.startsWith(x.year)).length : works.length;
      const selected = state.year === x.year;
      return '<button type="button" class="year-button' + (selected ? ' is-selected' : '') +
        '" data-year="' + x.year + '" aria-pressed="' + selected + '"><strong>' + escapeHtml(x.label) +
        '</strong><small>' + n + ' 篇</small></button>';
    }).join('');
  }

  function renderPaths() {
    document.querySelectorAll('.path-card').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.path === state.path));
    });
  }

  function renderCard(w) {
    const selected = w.id === state.selected;
    const detail = w.researchBrief
      ? '<a class="work-read" href="' + escapeHtml(localUrl(w.researchBrief)) + '">阅读五环研究 <span aria-hidden="true">↗</span></a>'
      : '<span class="work-read-muted">研究草案筹备中</span>';
    return '<article class="work-card' + (selected ? ' is-selected' : '') + '">' +
      '<div class="work-card-top"><span class="work-order">' + escapeHtml(w.date.slice(0, 4)) + '</span>' +
      '<span class="work-volume">' + escapeHtml(volumeName(w.volume)) + '</span></div>' +
      '<button type="button" class="work-title" data-id="' + escapeHtml(w.id) + '" aria-pressed="' + selected +
      '" aria-label="查看《' + escapeHtml(w.title) + '》详情">' + escapeHtml(w.title) + '</button>' +
      '<p class="work-date">' + escapeHtml(dateText(w)) + ' · ' + escapeHtml(w.period) + '</p>' +
      '<p class="work-question">' + escapeHtml(w.question) + '</p>' +
      '<div class="work-tags">' + w.topics.map(t => '<span>' + escapeHtml(t) + '</span>').join('') + '</div>' +
      '<div class="work-card-bottom">' + detail +
      '<button class="work-details" type="button" data-id="' + escapeHtml(w.id) + '" aria-label="查看《' + escapeHtml(w.title) +
      '》的史料信息">详情 <span aria-hidden="true">→</span></button></div></article>';
  }

  function renderInspector(w) {
    const host = byId('inspector');
    if (!w) {
      host.innerHTML = '<p class="inspector-empty">没有匹配的作品。请清除筛选，再查看研究报告。</p>';
      return;
    }
    const oldHtml = w.legacyReports.filter(path => path.endsWith('.html'));
    const oldMd = w.legacyReports.filter(path => path.endsWith('.md'));
    const primary = w.researchBrief
      ? '<a class="inspector-primary" href="' + escapeHtml(localUrl(w.researchBrief)) + '">进入五环研究 ↗</a>'
      : '<span class="inspector-unavailable">研究草案尚未建立</span>';
    const oldLinks = oldHtml.map((path, index) =>
      '<a href="' + escapeHtml(localUrl(path)) + '">旧稿 ' + (index + 1) + ' ↗</a>').join('');
    const markdownLink = oldMd.length
      ? '<a href="' + escapeHtml(localUrl(oldMd[0])) + '">Markdown 旧稿 ↗</a>' : '';
    host.innerHTML = '<div class="inspector-overline"><span class="status-pip" aria-hidden="true"></span> SELECTED WORK / 历史资料</div>' +
      '<h3 id="inspector-title" tabindex="-1">' + escapeHtml(w.title) + '</h3>' +
      '<div class="inspector-meta"><span>' + escapeHtml(volumeName(w.volume)) + '</span><span>' + escapeHtml(dateText(w)) +
      '</span><span>' + escapeHtml(w.period) + '</span></div>' +
      '<div class="inspector-divider"></div>' +
      '<div class="inspector-section-label">关键研究问题</div><p class="inspector-question">' + escapeHtml(w.question) + '</p>' +
      '<div class="inspector-section-label">史料身份</div><p>' + escapeHtml(w.sourceLabel) + '</p>' +
      '<div class="inspector-section-label">审校说明</div><p class="inspector-status">研究草案 · 史料逐条审校进行中</p>' +
      '<div class="inspector-cta">' + primary + '<a class="inspector-source" href="' + escapeHtml(w.sourceUrl) +
      '" target="_blank" rel="noopener noreferrer">访问原著来源 ↗</a></div>' +
      '<div class="inspector-section-label">旧研究档案</div>' +
      '<div class="inspector-legacy">' + (oldLinks || '无可读 HTML 旧稿') + markdownLink + '</div>' +
      '<div class="inspector-footer"><p>' + escapeHtml(w.notes) + '</p>' +
      '<button class="share-button" type="button" data-share="' + escapeHtml(w.id) + '">复制本篇研究链接 ↗</button>' +
      '<span id="share-status" role="status" aria-live="polite"></span></div>';
  }

  function render() {
    const filtered = visibleWorks();
    if (!filtered.some(w => w.id === state.selected)) state.selected = filtered[0]?.id || null;
    renderNav();
    renderTimeline();
    renderPaths();
    byId('result-count').textContent = '当前显示 ' + filtered.length + ' / ' + works.length + ' 篇作品';
    const labels = [
      state.path ? pathNames[state.path] : '', state.volume ? volumeName(state.volume) : '',
      state.year ? state.year + '年' : '', state.topic, state.period, state.search ? '搜索中' : ''
    ].filter(Boolean);
    const active = byId('active-filter');
    active.hidden = labels.length === 0;
    active.textContent = labels.join(' · ');
    byId('works-grid').innerHTML = filtered.length
      ? filtered.map(renderCard).join('')
      : '<div class="empty"><strong>没有找到匹配作品</strong><p>可以尝试更短的关键词，或重置年份、主题和卷次。</p></div>';
    renderInspector(filtered.find(w => w.id === state.selected));
    syncUrl();
  }

  function chooseWork(id) {
    state.selected = id;
    render();
    const title = byId('inspector-title');
    if (!title) return;
    title.focus({preventScroll: true});
    if (window.matchMedia('(max-width: 1050px)').matches) {
      byId('inspector').scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start'});
    }
  }

  const shell = byId('app-shell');
  const menu = byId('menu-toggle');
  const scrim = byId('mobile-scrim');
  function setMenu(open) {
    shell.classList.toggle('nav-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
    scrim.hidden = !open;
    if (!open) menu.focus({preventScroll: true});
  }
  menu.addEventListener('click', () => setMenu(!shell.classList.contains('nav-open')));
  scrim.addEventListener('click', () => setMenu(false));
  document.querySelectorAll('.sidebar a[href^="#"]').forEach(link => link.addEventListener('click', () => {
    if (shell.classList.contains('nav-open')) setMenu(false);
  }));
  document.querySelectorAll('.sidebar .nav-link').forEach(link => link.addEventListener('click', () => {
    document.querySelectorAll('.sidebar .nav-link').forEach(x => x.classList.toggle('is-active', x === link));
  }));
  byId('volume-nav').addEventListener('click', event => {
    const button = event.target.closest('[data-volume]');
    if (!button) return;
    state.volume = Number(button.dataset.volume);
    state.path = '';
    render();
    if (shell.classList.contains('nav-open')) setMenu(false);
    byId('catalog').scrollIntoView({behavior: 'smooth', block: 'start'});
  });
  byId('timeline-nav').addEventListener('click', event => {
    const button = event.target.closest('[data-year]');
    if (!button) return;
    state.year = button.dataset.year;
    state.path = '';
    render();
    byId('catalog').scrollIntoView({behavior: 'smooth', block: 'start'});
  });
  document.querySelectorAll('[data-path]').forEach(button => button.addEventListener('click', () => {
    state.path = state.path === button.dataset.path ? '' : button.dataset.path;
    state.volume = 0;
    state.year = '';
    state.topic = '';
    state.period = '';
    state.search = '';
    byId('search').value = '';
    byId('topic').value = '';
    byId('period').value = '';
    render();
    byId('catalog').scrollIntoView({behavior: 'smooth', block: 'start'});
  }));
  byId('works-grid').addEventListener('click', event => {
    const button = event.target.closest('button[data-id]');
    if (button) chooseWork(button.dataset.id);
  });
  byId('search').addEventListener('input', event => {state.search = event.target.value.trim(); render();});
  byId('topic').addEventListener('change', event => {state.topic = event.target.value; render();});
  byId('period').addEventListener('change', event => {state.period = event.target.value; render();});
  byId('reset').addEventListener('click', () => {
    state.volume = 0; state.year = ''; state.path = ''; state.topic = ''; state.period = ''; state.search = '';
    byId('search').value = '';
    byId('topic').value = '';
    byId('period').value = '';
    render();
    byId('search').focus();
  });

  const focusSearch = () => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) byId('catalog').scrollIntoView({behavior: 'smooth'});
    byId('search').focus({preventScroll: true});
  };
  byId('search-shortcut').addEventListener('click', focusSearch);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && shell.classList.contains('nav-open')) {setMenu(false); return;}
    const active = document.activeElement;
    const editing = active?.matches('input,textarea,select,[contenteditable="true"]');
    if (((event.key === '/' && !editing) || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k'))) {
      event.preventDefault();
      focusSearch();
    }
  });
  byId('inspector').addEventListener('click', async event => {
    const button = event.target.closest('button[data-share]');
    if (!button) return;
    const url = new URL(window.location.href);
    url.search = '?work=' + encodeURIComponent(button.dataset.share);
    url.hash = '#catalog';
    const message = byId('share-status');
    try {
      await navigator.clipboard.writeText(url.href);
      message.textContent = '已复制本篇链接';
    } catch {
      message.textContent = '请从浏览器地址栏复制本篇链接';
      window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    }
  });
  render();
})();
