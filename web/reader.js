(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const progress = $('reading-progress');
  const back = $('reader-back-to-top');
  const message = $('reader-status');
  const shrink = $('font-smaller'), reset = $('font-reset'), grow = $('font-larger');
  const SIZE_KEY = 'shijing-reader-scale';
  let scale = 1;

  try {
    const saved = Number(window.localStorage.getItem(SIZE_KEY));
    if (Number.isFinite(saved) && saved >= .85 && saved <= 1.3) scale = saved;
  } catch { /* Storage can be blocked; reading remains functional. */ }

  function applyScale() {
    root.style.setProperty('--reader-scale', String(scale));
    if (shrink) shrink.disabled = scale <= .85;
    if (grow) grow.disabled = scale >= 1.3;
    try {window.localStorage.setItem(SIZE_KEY, String(scale));} catch {}
  }
  function changeScale(amount) {
    scale = Math.min(1.3, Math.max(.85, Math.round((scale + amount) * 100) / 100));
    applyScale();
  }
  shrink?.addEventListener('click', () => changeScale(-.1));
  grow?.addEventListener('click', () => changeScale(.1));
  reset?.addEventListener('click', () => {scale = 1;applyScale();});
  applyScale();

  const t0 = $('reader-t0');
  t0?.addEventListener('click', () => {
    const pressed = t0.getAttribute('aria-pressed') !== 'true';
    t0.setAttribute('aria-pressed', String(pressed));
    t0.textContent = pressed ? '显示全部时间节点' : '仅看当时节点';
    document.body.classList.toggle('only-before', pressed);
    if (message) message.textContent = pressed ? '仅隐藏时间线内T0之后的事件，研究正文仍包含完整事后复盘。' : '已显示完整时间线。';
  });

  $('reader-copy')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      if (message) message.textContent = '已复制当前研究页面链接。';
    } catch {
      if (message) message.textContent = '浏览器未允许复制，请使用地址栏复制链接。';
    }
  });

  const anchors = [...document.querySelectorAll('.side nav a[href^="#"]')];
  const targets = anchors.map(link => ({
    link,
    target: document.getElementById(link.getAttribute('href').slice(1))
  })).filter(x => x.target);
  function updateOnScroll() {
    const total = Math.max(1, root.scrollHeight - window.innerHeight);
    if (progress) progress.style.width = Math.min(100, Math.max(0, window.scrollY / total * 100)) + '%';
    if (back) back.hidden = window.scrollY < 600;
    let current = targets[0];
    for (const item of targets) {
      if (item.target.getBoundingClientRect().top < 185) current = item;
      else break;
    }
    for (const item of targets) {
      if (current === item) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    }
  }
  let scheduled = false;
  document.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {scheduled = false;updateOnScroll();});
  }, {passive: true});
  window.addEventListener('resize', updateOnScroll, {passive: true});
  back?.addEventListener('click', () => window.scrollTo({top: 0, behavior: reduced.matches ? 'auto' : 'smooth'}));
  updateOnScroll();
})();
