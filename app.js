document.documentElement.classList.add('js-ready');

const PLACEHOLDER_PRICE = 'Цена по индивидуальному расчёту';
let catalog = window.catalogData || { metal: [], finish: [] };
const assetBase = document.body.dataset.assets || 'assets/';
const contactHref = assetBase.startsWith('../') ? '../contacts/' : 'contacts/';
const catalogApiUrl = 'https://d5d01eb689qn07cv0ocu.sax5b7yq.apigw.yandexcloud.net/api/catalog';

const textValue = value => String(value ?? '');
const dangerousImageScheme = /^(javascript|data|vbscript|blob):/i;
// Browsers strip ASCII control characters (tab, LF, CR, NUL) from URLs before parsing,
// so "java\tscript:" must not be allowed to slip past the scheme blocklist as a relative
// path such as "assets/java script:...". Whitespace is also removed when reading the
// scheme itself, because "java script:" is the same dangerous scheme to a URL parser.
const normalizeImageSource = value => textValue(value).replace(/[\u0000-\u001f\u007f]/g, '').trim();
const imageSchemeOf = candidate => {
  const colon = candidate.indexOf(':');
  if (colon < 0) return '';
  return candidate.slice(0, colon).replace(/[\s\u0000-\u001f\u007f]/g, '');
};
const isBlockedImageSource = candidate => {
  if (!candidate) return false;
  if (candidate.startsWith('//')) return true;
  return dangerousImageScheme.test(`${imageSchemeOf(candidate)}:`);
};
// Prepares a catalog value for safeImageUrl. Dangerous schemes and protocol-relative
// URLs are rejected BEFORE assetBase is prepended, so they can never masquerade as a
// same-origin relative path such as "assets/javascript:...". Local file names still
// become "assets/<file>" and absolute URLs keep their own origin for safeImageUrl.
// The function is idempotent: values that already carry an "assets/" prefix (with or
// without a leading slash) or an absolute URL are passed through untouched instead of
// becoming "assets/assets/..." duplicates.
function resolveAssetImage(value) {
  const candidate = normalizeImageSource(value);
  if (!candidate || isBlockedImageSource(candidate)) return '';
  if (/^[a-z][a-z0-9+.-]*:/i.test(candidate)) return candidate;
  if (/^\/?assets\//i.test(candidate)) return candidate;
  return `${assetBase}${candidate}`;
}
function setupAmbientGrid() {
  if (typeof document === 'undefined' || !document.body) return;
  if (document.querySelector('.ambient-grid-mask')) return;

  const mask = document.createElement('div');
  mask.className = 'ambient-grid-mask';
  mask.setAttribute('aria-hidden', 'true');
  const layer = document.createElement('div');
  layer.className = 'ambient-grid-layer';
  mask.append(layer);
  document.body.insertBefore(mask, document.body.firstChild);
}

function setupAmbientLights() {
  if (typeof document === 'undefined' || !document.body) return;
  if (document.querySelector('.ambient-lights')) return;

  const lights = document.createElement('div');
  lights.className = 'ambient-lights';
  lights.setAttribute('aria-hidden', 'true');
  const warm = document.createElement('div');
  warm.className = 'ambient-light ambient-light--warm';
  const bright = document.createElement('div');
  bright.className = 'ambient-light ambient-light--bright';
  lights.append(warm, bright);
  document.body.insertBefore(lights, document.body.firstChild);
}

function safeImageUrl(value) {
  const candidate = normalizeImageSource(value);
  if (!candidate) return '';
  // Images may come from the site itself or from the trusted catalog API.
  // Block protocol-relative and dangerous schemes before parsing.
  if (isBlockedImageSource(candidate)) return '';
  try {
    const url = new URL(candidate, window.location.href);
    // Second gate: after resolution the scheme must be a real document/network protocol.
    // Obfuscated dangerous schemes that somehow survived the pre-check (javascript:, data:,
    // vbscript:, blob:, filesystem:, chrome:, ...) fail here. file: stays allowed so the
    // static pages can still be previewed straight from disk.
    if (!/^(https?|file):$/.test(url.protocol)) return '';
    // Same-origin assets are allowed on any of those protocols (local http/file preview).
    if (url.origin === window.location.origin) return url.href;
    // Cross-origin resources must be https and come from the trusted catalog API.
    if (url.protocol !== 'https:') return '';
    return url.origin === new URL(catalogApiUrl).origin ? url.href : '';
  } catch { return ''; }
}

const fallbackServices = [
  { title: 'Металлоконструкции под ключ', text: 'Каркасы зданий, эстакады, площадки, защитные и нестандартные конструкции.', group: 'other', image: 'hero-3.jpg' },
  { title: 'Монтаж и сварочные работы', text: 'Сборка и установка каркасов, лестниц, ограждений, ворот и навесов на объекте.', group: 'workshop', image: 'gal-svarka.jpg' },
  { title: 'Навесы и козырьки', text: 'Автонавесы, пристенные и отдельностоящие решения, навесы над входом и террасой.', group: 'navesy', image: 'naves-avt-1.jpg' }
];

let services = (catalog.metal.length ? catalog.metal : fallbackServices).map((service, index) => ({
  ...service,
  index,
  category: [service.group, 'metal'],
  image: resolveAssetImage(service.image)
}));
let currentFilter = 'all';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let revealObserver;
let modalOpener;

const iconArrow = '<span class="icon icon--arrow" aria-hidden="true"></span>';

/* Russian labels for catalog groups. Used instead of the placeholder price row,
   which repeated identically on every card. */
const GROUP_LABELS = {
  mangals: 'Мангалы',
  gates: 'Ворота и заборы',
  navesy: 'Навесы',
  stairs: 'Лестницы',
  workshop: 'Работы в цеху',
  lowrise: 'Малоэтажное строительство',
  other: 'Другие решения'
};

function appendText(parent, tag, className, value) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = textValue(value);
  parent.append(element);
  return element;
}

function renderServices(filter = 'all') {
  const grid = document.querySelector('#serviceGrid');
  if (!grid) return;
  grid.replaceChildren();
  services.forEach((service, index) => {
    const card = document.createElement('article'); card.className = 'service-card reveal'; card.dataset.category = service.category.join(' '); card.hidden = filter !== 'all' && !service.category.includes(filter);
    const imageWrap = document.createElement('div'); imageWrap.className = 'service-card__image'; imageWrap.setAttribute('aria-hidden', 'true');
    const image = document.createElement('img'); image.src = safeImageUrl(service.image); image.alt = ''; image.loading = 'lazy'; imageWrap.append(image);
    const body = document.createElement('div'); body.className = 'service-card__body'; appendText(body, 'span', 'service-card__number', String(index + 1).padStart(2, '0')); appendText(body, 'h3', '', service.title); appendText(body, 'p', '', service.text);
    const footer = document.createElement('div'); footer.className = 'service-card__footer';
    // Only real prices are shown; the shared placeholder is replaced by the group label.
    const priceLabel = service.price && service.price !== PLACEHOLDER_PRICE ? service.price : GROUP_LABELS[service.group] || textValue(service.group);
    appendText(footer, 'span', 'service-card__price', priceLabel);
    const open = document.createElement('button'); open.className = 'service-card__open'; open.type = 'button'; open.dataset.serviceType = 'metal'; open.dataset.serviceIndex = String(index); open.setAttribute('aria-label', `Подробнее: ${textValue(service.title)}`); open.textContent = 'Подробнее '; open.insertAdjacentHTML('beforeend', iconArrow); footer.append(open);
    card.append(imageWrap, body, footer); grid.append(card);
  });
  setupReveal();
}

function renderFinishTabs() {
  const tabs = document.querySelector('#finishTabs');
  if (!tabs || !catalog.finish.length) return;
  tabs.replaceChildren();
  catalog.finish.forEach((category, index) => { const tab = document.createElement('button'); tab.className = `finish-tab${index === 0 ? ' is-active' : ''}`; tab.type = 'button'; tab.role = 'tab'; tab.id = `finish-tab-${category.id}`; tab.tabIndex = index === 0 ? 0 : -1; tab.setAttribute('aria-controls', 'finishPanel'); tab.setAttribute('aria-selected', String(index === 0)); tab.dataset.finishId = category.id; tab.textContent = category.title; tabs.append(tab); });
  const activateTab = (tab, shouldFocus = false) => {
    tabs.querySelectorAll('.finish-tab').forEach(item => { const active = item === tab; item.classList.toggle('is-active', active); item.tabIndex = active ? 0 : -1; item.setAttribute('aria-selected', String(active)); });
    renderFinishPanel(tab.dataset.finishId);
    setupServiceTriggers();
    if (shouldFocus) tab.focus();
  };
  tabs.querySelectorAll('.finish-tab').forEach(tab => tab.addEventListener('click', () => {
    activateTab(tab);
  }));
  if (tabs.dataset.keyboardReady) return;
  tabs.dataset.keyboardReady = 'true';
  tabs.addEventListener('keydown', event => {
    const tabList = [...tabs.querySelectorAll('.finish-tab')];
    const currentIndex = tabList.indexOf(document.activeElement);
    if (currentIndex < 0) return;
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabList.length;
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabList.length) % tabList.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tabList.length - 1;
    else return;
    event.preventDefault();
    activateTab(tabList[nextIndex], true);
  });
}

function renderFinishPanel(id = catalog.finish[0]?.id) {
  const panel = document.querySelector('#finishPanel');
  const category = catalog.finish.find(item => item.id === id) || catalog.finish[0];
  if (!panel || !category) return;
  panel.replaceChildren(); panel.hidden = false; panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-hidden', 'false'); panel.setAttribute('aria-labelledby', `finish-tab-${category.id}`); panel.setAttribute('aria-expanded', 'true');
  const top = document.createElement('div'); top.className = 'finish-panel__top'; const copy = document.createElement('div'); appendText(copy, 'h4', '', category.title); appendText(copy, 'p', '', category.description); top.append(copy); appendText(top, 'span', '', `${category.rows.filter(row => row.name).length} позиций`);
  const wrap = document.createElement('div'); wrap.className = 'finish-table-wrap'; wrap.tabIndex = 0; wrap.setAttribute('data-lenis-prevent', ''); wrap.setAttribute('role', 'region'); wrap.setAttribute('aria-label', 'Прокручиваемый прайс-лист');
  const table = document.createElement('table'); table.className = 'finish-table'; table.innerHTML = '<thead><tr><th>Наименование работ</th><th>Ед.</th><th>Стоимость</th></tr></thead>'; const tbody = document.createElement('tbody');
  category.rows.forEach((row, rowIndex) => { const tr = document.createElement('tr'); if (row.group) { tr.className = 'finish-table__group'; const th = document.createElement('th'); th.colSpan = 3; th.textContent = row.group; tr.append(th); } else { const name = document.createElement('td'); const button = document.createElement('button'); button.className = 'finish-row__open'; button.type = 'button'; button.dataset.serviceType = 'finish'; button.dataset.finishId = category.id; button.dataset.finishRow = String(rowIndex); button.textContent = row.name; name.append(button); tr.append(name); appendText(tr, 'td', '', row.unit); appendText(tr, 'td', '', row.price || PLACEHOLDER_PRICE); } tbody.append(tr); });
  table.append(tbody); wrap.append(table); panel.append(top, wrap);
  panel.querySelector('.finish-table-wrap')?.addEventListener('wheel', event => event.stopPropagation(), { passive: true });
}

function normalizeRemoteCatalog(items) {
  if (!Array.isArray(items) || !items.length) return null;
  const metal = items.filter(item => item.direction !== 'finish').map(item => ({
    group: item.group || item.category || 'other',
    title: item.name || item.title || 'Услуга',
    text: item.description || '',
    image: item.photoUrl || item.imageUrl || item.image || '',
    price: item.price || PLACEHOLDER_PRICE,
  }));
  const groupedFinish = new Map();
  items.filter(item => item.direction === 'finish').forEach(item => {
    const id = item.group || item.category || 'finish-other';
    if (!groupedFinish.has(id)) groupedFinish.set(id, { id, title: item.categoryName || item.categoryTitle || id, description: item.categoryDescription || 'Актуальные работы внутренней отделки.', rows: [] });
    groupedFinish.get(id).rows.push({ name: item.name || item.title || 'Работа', unit: item.unit || 'м²', price: item.price || PLACEHOLDER_PRICE });
  });
  return { metal, finish: [...groupedFinish.values()] };
}

async function loadRemoteCatalog() {
  if (!document.querySelector('#serviceGrid, #finishTabs')) return;
  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 4500);
    const response = await fetch(catalogApiUrl, { signal: controller.signal, headers: { Accept: 'application/json' } });
    window.clearTimeout(timeout);
    if (!response.ok) return;
    const remote = normalizeRemoteCatalog(await response.json());
    if (!remote) return;
    catalog = { metal: remote.metal.length ? remote.metal : catalog.metal, finish: remote.finish.length ? remote.finish : catalog.finish };
    services = (catalog.metal.length ? catalog.metal : fallbackServices).map((service, index) => ({ ...service, index, category: [service.group, 'metal'], image: safeImageUrl(resolveAssetImage(service.image)) }));
    if (document.querySelector('#serviceGrid')) { renderServices(currentFilter); setupServiceTriggers(); setupCardInteractions(); }
    if (document.querySelector('#finishTabs')) { renderFinishTabs(); renderFinishPanel(); setupServiceTriggers(); }
    setupReveal();
  } catch {
    // The static catalog remains available when the CRM API is offline.
  }
}

/* Signature glyph: the abstract bracket from the logo recurs as a mark before
   section numbers and as a footer watermark. Injected here so the asset path
   follows data-assets on every page. */
function setupSignatureMarks() {
  const markSrc = `${assetBase}logo_big.png`;
  document.querySelectorAll('.section-number').forEach(element => {
    if (element.dataset.markReady) return;
    element.dataset.markReady = 'true';
    const mark = document.createElement('img');
    mark.src = markSrc;
    mark.alt = '';
    mark.className = 'section-number__mark';
    mark.setAttribute('aria-hidden', 'true');
    element.prepend(mark);
  });
  const footer = document.querySelector('.site-footer');
  if (footer && !footer.querySelector('.site-footer__mark')) {
    const mark = document.createElement('img');
    mark.src = markSrc;
    mark.alt = '';
    mark.className = 'site-footer__mark';
    mark.setAttribute('aria-hidden', 'true');
    footer.append(mark);
  }
}

function setupHeader(smoothScroll) {
  const header = document.querySelector('#siteHeader');
  const topButton = document.querySelector('#backToTop');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const update = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 35);
    topButton?.classList.toggle('is-visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
  topButton?.addEventListener('click', () => smoothScroll ? smoothScroll.scrollTo(0, { duration: .7 }) : window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    if (smoothScroll) smoothScroll.scrollTo(target, { offset: -100, duration: .7 });
    else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    if (link.classList.contains('skip-link')) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
  }));
}

/* Letter swap: replaces each direct nav link's text with per-character two-glyph
   stacks that roll on the magnet state. aria-label keeps the full link name. */
function buildLetterSwap(nav) {
  nav.querySelectorAll(':scope > a').forEach(link => {
    if (link.dataset.letterSwapReady) return;
    link.dataset.letterSwapReady = 'true';
    const text = link.textContent;
    link.dataset.letterSwapText = text;
    link.setAttribute('aria-label', text.replace(/\u00A0/g, ' '));
    link.__letterSwapSource = Array.from(link.childNodes);
    const fragment = document.createDocumentFragment();
    Array.from(text).forEach((char, index) => {
      const charSpan = document.createElement('span');
      charSpan.className = 'letter-swap__char';
      charSpan.setAttribute('aria-hidden', 'true');
      charSpan.style.setProperty('--i', String(index));
      const stack = document.createElement('span');
      stack.className = 'letter-swap__stack';
      const glyph = char === ' ' ? '\u00A0' : char;
      for (let copy = 0; copy < 2; copy++) {
        const glyphSpan = document.createElement('span');
        glyphSpan.textContent = glyph;
        stack.append(glyphSpan);
      }
      charSpan.append(stack);
      fragment.append(charSpan);
    });
    // One synchronous swap: no intermediate frame with missing text.
    link.replaceChildren(fragment);
  });
}

/* Magnetic pill + letter swap for the desktop navigation. Pointer devices only,
   reconciled against one media query so resize/reduced-motion changes tear it down. */
function initNavMagnet() {
  // Works on every page regardless of the gate below.
  document.querySelectorAll('.desktop-nav a.is-current').forEach(link => link.setAttribute('aria-current', 'page'));
  const nav = document.querySelector('.header-shell > .desktop-nav');
  if (!nav || nav.dataset.navMagnetReady) return;
  nav.dataset.navMagnetReady = 'true';
  const shell = nav.parentElement;
  const eligible = window.matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const state = {
    enabled: false, hoveredLink: null, focusedLink: null, activeLink: null,
    links: [], magnet: null, observer: null, controls: null,
    current: { x: 0, y: 0, w: 0, h: 0 },
    target: { x: 0, y: 0, w: 0, h: 0 },
    rafId: 0, lastTime: 0, resizeRaf: 0
  };

  const render = () => {
    const magnet = state.magnet;
    if (!magnet) return;
    magnet.style.transform = `translate3d(${state.current.x}px, ${state.current.y}px, 0)`;
    magnet.style.width = `${state.current.w}px`;
    magnet.style.height = `${state.current.h}px`;
  };

  const step = now => {
    const dt = Math.min(state.lastTime ? now - state.lastTime : 1000 / 60, 100);
    state.lastTime = now;
    const alpha = 1 - Math.pow(0.8, dt / (1000 / 60));
    let maxDiff = 0;
    for (const key of ['x', 'y', 'w', 'h']) {
      const diff = state.target[key] - state.current[key];
      const absDiff = Math.abs(diff);
      if (absDiff > maxDiff) maxDiff = absDiff;
      state.current[key] += diff * alpha;
    }
    if (maxDiff < 2) {
      Object.assign(state.current, state.target);
      render();
      state.rafId = 0;
      return;
    }
    render();
    state.rafId = requestAnimationFrame(step);
  };

  const startLoop = () => {
    if (state.rafId || !state.enabled) return;
    state.lastTime = 0;
    state.rafId = requestAnimationFrame(step);
  };

  // Geometry is cached in shell padding-box coordinates; no layout reads per frame.
  const setTarget = link => {
    const s = shell.getBoundingClientRect();
    const r = link.getBoundingClientRect();
    state.target.x = r.left - s.left - shell.clientLeft - 12;
    state.target.y = r.top - s.top - shell.clientTop;
    state.target.w = r.width + 24;
    state.target.h = r.height;
  };

  const measure = () => {
    const s = shell.getBoundingClientRect();
    state.links.forEach(link => {
      const r = link.getBoundingClientRect();
      link.__navRect = { x: r.left - s.left - shell.clientLeft, y: r.top - s.top - shell.clientTop, w: r.width, h: r.height };
    });
  };

  const intersects = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

  // White-on-white guard: neighbours whose text overlaps the light pill go dark.
  const applyLinkClasses = () => {
    const link = state.activeLink;
    state.links.forEach(item => {
      item.classList.toggle('is-magnet', item === link);
      item.classList.toggle('is-magnet-covered', Boolean(link && item !== link && item.__navRect && intersects(item.__navRect, state.target)));
    });
  };

  const updatePill = () => {
    if (!state.enabled || !state.magnet) return;
    const link = state.hoveredLink || state.focusedLink;
    const changed = link !== state.activeLink;
    state.activeLink = link;
    if (link) {
      if (changed) {
        setTarget(link);
        // First appearance snaps to the target, then scales in — never from (0,0).
        if (!state.magnet.classList.contains('is-visible')) {
          Object.assign(state.current, state.target);
          render();
        }
        state.magnet.classList.add('is-visible');
        startLoop();
      }
      applyLinkClasses();
    } else {
      state.magnet.classList.remove('is-visible');
      state.links.forEach(item => item.classList.remove('is-magnet', 'is-magnet-covered'));
    }
  };

  const remeasure = () => {
    if (!state.enabled) return;
    measure();
    if (state.activeLink) {
      setTarget(state.activeLink);
      Object.assign(state.current, state.target);
      render();
      applyLinkClasses();
    }
  };

  const onPointerEnter = event => {
    if (event.pointerType === 'touch') return;
    state.hoveredLink = event.currentTarget;
    updatePill();
  };
  const onPointerMove = event => {
    const link = event.target.closest('a');
    if (!link || link === state.hoveredLink) return;
    state.hoveredLink = link;
    updatePill();
  };
  const onPointerLeave = () => { state.hoveredLink = null; updatePill(); };
  const onFocusIn = event => {
    const link = event.target.closest('a');
    if (!link) return;
    state.focusedLink = link;
    updatePill();
  };
  const onFocusOut = event => {
    // Moving focus between links must not hide the pill.
    if (event.relatedTarget && nav.contains(event.relatedTarget)) return;
    state.focusedLink = null;
    updatePill();
  };
  const onResize = () => {
    if (state.resizeRaf) return;
    state.resizeRaf = requestAnimationFrame(() => { state.resizeRaf = 0; remeasure(); });
  };

  const enable = () => {
    if (state.enabled) return;
    state.enabled = true;
    buildLetterSwap(nav);
    const magnet = document.createElement('div');
    magnet.className = 'nav-magnet';
    magnet.setAttribute('aria-hidden', 'true');
    const shape = document.createElement('div');
    shape.className = 'nav-magnet__shape';
    magnet.append(shape);
    shell.insertBefore(magnet, nav);
    state.magnet = magnet;
    nav.classList.add('is-magnet-ready');
    state.links = [...nav.querySelectorAll(':scope > a')];
    state.controls = new AbortController();
    const options = { signal: state.controls.signal };
    state.links.forEach(link => link.addEventListener('pointerenter', onPointerEnter, options));
    nav.addEventListener('pointermove', onPointerMove, options);
    nav.addEventListener('pointerleave', onPointerLeave, options);
    nav.addEventListener('focusin', onFocusIn, options);
    nav.addEventListener('focusout', onFocusOut, options);
    window.addEventListener('resize', onResize, options);
    measure();
    state.observer = new ResizeObserver(remeasure);
    state.observer.observe(shell);
    state.observer.observe(nav);
    if (document.fonts?.ready) document.fonts.ready.then(() => remeasure()).catch(() => {});
  };

  const disable = () => {
    if (!state.enabled) return;
    state.enabled = false;
    if (state.rafId) { cancelAnimationFrame(state.rafId); state.rafId = 0; }
    if (state.resizeRaf) { cancelAnimationFrame(state.resizeRaf); state.resizeRaf = 0; }
    state.controls?.abort();
    state.controls = null;
    state.observer?.disconnect();
    state.observer = null;
    state.links.forEach(link => {
      link.classList.remove('is-magnet', 'is-magnet-covered');
      if (link.__letterSwapSource) {
        link.replaceChildren(...link.__letterSwapSource);
        delete link.__letterSwapSource;
      }
      link.removeAttribute('aria-label');
      delete link.dataset.letterSwapReady;
      delete link.dataset.letterSwapText;
    });
    state.links = [];
    state.hoveredLink = state.focusedLink = state.activeLink = null;
    state.magnet?.remove();
    state.magnet = null;
    nav.classList.remove('is-magnet-ready');
  };

  const reconcile = () => { if (eligible.matches) enable(); else disable(); };
  eligible.addEventListener('change', reconcile);
  reconcile();
}

function setupMobileMenu() {
  const button = document.querySelector('#menuButton');
  const menu = document.querySelector('#mobileMenu');
  if (!button || !menu) return;
  menu.setAttribute('data-lenis-prevent', '');
  let closeButton = menu.querySelector('.mobile-menu__close');
  if (!closeButton) {
    closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'mobile-menu__close glass-control';
    closeButton.setAttribute('aria-label', 'Закрыть меню');
    closeButton.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span>';
    menu.prepend(closeButton);
  }
  const getVisibleLinks = () => [...menu.querySelectorAll('a')].filter(link => {
    const style = window.getComputedStyle(link);
    return !link.hidden && style.display !== 'none' && style.visibility !== 'hidden' && link.getClientRects().length > 0;
  });
  let openFocusTarget = null;
  const close = ({ restoreFocus = true } = {}) => { button.classList.remove('is-active'); button.setAttribute('aria-expanded', 'false'); button.setAttribute('aria-label', 'Открыть меню'); menu.classList.remove('is-open', 'is-opening'); menu.hidden = true; document.body.classList.remove('menu-open'); window.__lenisInstance?.start(); if (restoreFocus) button.focus(); };
  button.addEventListener('click', () => {
    const open = menu.hidden;
    button.classList.toggle('is-active', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
     if (open) {
       openFocusTarget = document.activeElement;
       menu.hidden = false;
       menu.classList.add('is-opening');
       requestAnimationFrame(() => {
         if (menu.hidden) return;
         menu.classList.replace('is-opening', 'is-open');
         if (document.activeElement === openFocusTarget || document.activeElement === button) closeButton.focus();
       });
    } else close({ restoreFocus: false });
    document.body.classList.toggle('menu-open', open);
    if (open) window.__lenisInstance?.stop(); else window.__lenisInstance?.start();
  });
  closeButton.addEventListener('click', () => close());
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => close({ restoreFocus: false })));
  document.addEventListener('keydown', event => {
    if (menu.hidden) return;
    if (event.key === 'Escape') close();
    if (event.key === 'Tab') {
      const focusables = [closeButton, ...getVisibleLinks()];
      if (!focusables.length) return;
      if (event.shiftKey && document.activeElement === focusables[0]) { event.preventDefault(); focusables.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === focusables.at(-1)) { event.preventDefault(); focusables[0].focus(); }
    }
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) close(); });
}

function setupHeroSlider() {
  const slides = [...document.querySelectorAll('.hero__slide')];
  const dots = [...document.querySelectorAll('.slider-dot')];
  if (slides.length < 2) return;
  let active = 0;
  let timer;
  let paused = false;
  let userPaused = false;
  let transitioning = false;
  let requested = null;
  let transitionToken = 0;
  const failed = new Set();
  const pause = document.querySelector('#sliderPause');
  const updateDots = () => dots.forEach((dot, i) => { dot.classList.toggle('is-active', i === active); dot.setAttribute('aria-pressed', String(i === active)); });
  const schedule = () => {
    window.clearTimeout(timer);
    if (reducedMotion.matches || paused || document.hidden || transitioning) return;
     timer = window.setTimeout(() => {
       let candidate = null;
       for (let step = 1; step <= slides.length; step++) {
         const index = (active + step) % slides.length;
         if (!failed.has(index)) { candidate = index; break; }
       }
       if (candidate === null) { failed.clear(); candidate = (active + 1) % slides.length; }
       show(candidate);
     }, 7500);
  };
  const clearTransitionClasses = () => slides.forEach(slide => slide.classList.remove('hero__slide--leaving', 'hero__slide--entering', 'hero__slide--dissolve'));
  const show = async (index, manual = false) => {
    const next = slides[index];
    if (!next) return;
     if (index === active && !transitioning) { schedule(); return; }
     if (failed.has(index)) { schedule(); return; }
    if (transitioning) {
      if (!manual) { requested = index; return; }
      transitionToken++;
      clearTransitionClasses();
      transitioning = false;
    }
    const token = ++transitionToken;
    transitioning = true;
    requested = null;
     try {
       if (typeof next.decode === 'function') await next.decode();
       if (next.naturalWidth === 0) throw new Error('hero image has no decoded frame');
     } catch {
       if (token !== transitionToken) return;
       failed.add(index);
       transitioning = false;
       clearTransitionClasses();
       schedule();
       return;
     }
    if (token !== transitionToken) return;
    if (document.hidden || (paused && !manual)) { transitioning = false; clearTransitionClasses(); schedule(); return; }
    const current = slides[active];
    current.classList.add('hero__slide--leaving');
     next.classList.add('hero__slide--entering', 'hero__slide--ken-burns');
    // Keep the old frame fully visible while the decoded frame fades above it.
    requestAnimationFrame(() => next.classList.add('hero__slide--dissolve'));
    const duration = reducedMotion.matches ? 0 : (window.matchMedia('(max-width: 900px)').matches ? 700 : 900);
    window.setTimeout(() => {
      if (token !== transitionToken) return;
      current.classList.remove('hero__slide--active', 'hero__slide--leaving');
       next.classList.remove('hero__slide--entering', 'hero__slide--dissolve');
      next.classList.add('hero__slide--active');
      active = index;
      transitioning = false;
      updateDots();
      schedule();
      if (requested !== null) { const nextRequested = requested; requested = null; show(nextRequested); }
    }, duration);
  };
  const stop = () => { window.clearTimeout(timer); timer = null; };
  const setPaused = value => { paused = value; document.body.classList.toggle('slider-paused', paused); stop(); if (!paused) schedule(); };
  dots.forEach(dot => dot.addEventListener('click', () => { const index = Number(dot.dataset.slide); requested = index; show(index, true); }));
  pause?.addEventListener('click', () => { userPaused = !userPaused; setPaused(userPaused); pause.textContent = userPaused ? 'Продолжить' : 'Пауза'; pause.setAttribute('aria-pressed', String(userPaused)); });
  const hero = document.querySelector('.hero');
  hero?.addEventListener('focusin', () => setPaused(true));
  hero?.addEventListener('focusout', event => { if (!hero.contains(event.relatedTarget) && !userPaused) setPaused(false); });
  document.addEventListener('visibilitychange', () => { document.body.classList.toggle('slider-hidden', document.hidden); if (document.hidden) stop(); else schedule(); });
  reducedMotion.addEventListener('change', event => {
    transitionToken++;
    transitioning = false;
    requested = null;
    clearTransitionClasses();
    slides.forEach((slide, i) => slide.classList.toggle('hero__slide--active', i === active));
    if (event.matches) { stop(); slides.forEach(slide => slide.style.removeProperty('transform')); }
    schedule();
  });
  updateDots();
  schedule();
}

function setupFilters() {
  const buttons = [...document.querySelectorAll('.filter-button')];
  buttons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    currentFilter = filter;
    buttons.forEach(item => { item.classList.toggle('is-active', item === button); item.setAttribute('aria-selected', String(item === button)); });
    renderServices(filter);
    setupCardInteractions();
    setupServiceTriggers();
    setupReveal();
  }));
}

function openServiceModal(service, meta = {}) {
  const modal = document.querySelector('#serviceModal');
  if (!modal) return;
  modalOpener = document.activeElement;
  modal.querySelector('.service-modal__eyebrow').textContent = meta.eyebrow || 'Расчёт по задаче';
  modal.querySelector('.service-modal__title').textContent = service.title || service.name;
  modal.querySelector('.service-modal__description').textContent = service.text || service.description || '';
  modal.querySelector('.service-modal__price').textContent = service.price || PLACEHOLDER_PRICE;
  modal.querySelector('.service-modal__unit').textContent = meta.unit ? `Единица: ${meta.unit}` : 'Финальная стоимость зависит от объёма, материалов и сложности';
  const image = modal.querySelector('.service-modal__image');
  image.src = safeImageUrl(service.image) || `${assetBase}hero-3.jpg`;
  image.alt = service.title || service.name;
  modal.hidden = false;
  document.body.classList.add('modal-open');
  window.__lenisInstance?.stop();
  modal.classList.add('is-open');
  revealElement(modal.querySelector('.service-modal__dialog'));
  modal.querySelector('.service-modal__close').focus();
}

function closeServiceModal() {
  const modal = document.querySelector('#serviceModal');
  if (!modal) return;
  modal.classList.remove('is-open');
  document.body.classList.remove('modal-open');
  modal.hidden = true;
  window.__lenisInstance?.start();
  if (modalOpener?.isConnected) modalOpener.focus({ preventScroll: true });
}

function setupServiceTriggers() {
  document.querySelectorAll('[data-service-type]').forEach(trigger => {
    if (trigger.dataset.modalReady) return;
    trigger.dataset.modalReady = 'true';
    trigger.addEventListener('click', () => {
      if (trigger.dataset.serviceType === 'metal') {
        const service = services[Number(trigger.dataset.serviceIndex)];
        openServiceModal({ title: service.title, text: service.text, image: service.image, price: service.price || PLACEHOLDER_PRICE }, { eyebrow: 'Металлоконструкции' });
      } else {
        const category = catalog.finish.find(item => item.id === trigger.dataset.finishId);
        const row = category?.rows[Number(trigger.dataset.finishRow)];
        if (row?.name) openServiceModal({ title: row.name, description: `${category.description} Позиция из актуального прайс-листа категории «${category.title}».`, price: row.price || PLACEHOLDER_PRICE, image: `${assetBase}lowrise-tambur-1.jpg` }, { eyebrow: category.title, unit: row.unit });
      }
    });
  });
}

function setupServiceModal() {
  if (!document.querySelector('#serviceModal')) {
    document.body.insertAdjacentHTML('beforeend', `<div class="service-modal" id="serviceModal" hidden role="dialog" aria-modal="true" aria-labelledby="serviceModalTitle"><div class="service-modal__backdrop"></div><div class="service-modal__dialog"><button class="service-modal__close" type="button" aria-label="Закрыть окно"></button><div class="service-modal__media"><img class="service-modal__image" alt="" /></div><div class="service-modal__content"><p class="service-modal__eyebrow"></p><h2 class="service-modal__title" id="serviceModalTitle"></h2><p class="service-modal__description"></p><div class="service-modal__facts"><div><span>Стоимость</span><strong class="service-modal__price"></strong></div><p class="service-modal__unit"></p></div><a class="button button--accent service-modal__link" href="${contactHref}">Оставить заявку ${iconArrow}</a></div></div></div>`);
  }
  const modal = document.querySelector('#serviceModal');
  if (!modal) return;
  modal.querySelector('.service-modal__dialog').setAttribute('data-lenis-prevent', '');
  modal.querySelector('.service-modal__close').addEventListener('click', closeServiceModal);
  modal.querySelector('.service-modal__backdrop').addEventListener('click', closeServiceModal);
  document.addEventListener('keydown', event => {
    if (modal.hidden) return;
    if (event.key === 'Escape') closeServiceModal();
    if (event.key === 'Tab') {
      const focusable = [...modal.querySelectorAll('button,a[href]')];
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  modal.querySelector('.service-modal__link').addEventListener('click', event => { event.currentTarget.href = `${contactHref}?service=${encodeURIComponent(modal.querySelector('.service-modal__title').textContent)}`; closeServiceModal(); });
}

function revealElement(element, delay = 0) {
  if (reducedMotion.matches) return;
  if (window.gsap) {
    window.gsap.fromTo(element, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .65, delay, ease: 'power2.out', overwrite: 'auto', clearProps: 'opacity,transform' });
  } else if (element.animate) {
    // The same opacity/transform pattern works without the animation CDN.
    element.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }], { duration: 650, delay: delay * 1000, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
  }
}

function setupReveal() {
  if (reducedMotion.matches) { document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible')); return; }
  if (!('IntersectionObserver' in window)) { document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible')); return; }
  if (!revealObserver) revealObserver = new IntersectionObserver(entries => {
    let stagger = 0;
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealElement(entry.target, Math.min(stagger++ * .07, .21));
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.reveal:not([data-reveal-ready])').forEach(element => {
    element.dataset.revealReady = 'true';
    revealObserver.observe(element);
  });
}

function setupCardInteractions() {
    // This function is called after catalog renders as well as during initial setup.
    // Keep the media-query subscriptions at one per current interaction lifecycle.
    const previous = setupCardInteractions.state;
    previous?.cleanup?.();
    const eligible = window.matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)');
    const controls = new AbortController();
    setupCardInteractions.state = { controls, eligible };
    const cleanupCards = () => {
      document.querySelectorAll('[data-motion-ready]').forEach(card => card.__cardMotionCleanup?.());
    };
    const enableCards = () => {
      if (!eligible.matches || reducedMotion.matches) {
        cleanupCards();
        return;
      }
    document.querySelectorAll('.direction-card, .service-card, .work-card').forEach(card => {
     if (card.dataset.motionReady) return;
     card.dataset.motionReady = 'true';
     const image = card.querySelector('img');
     let raf = 0;
     let rect;
     const reset = () => { card.style.setProperty('--card-rx', '0deg'); card.style.setProperty('--card-ry', '0deg'); };
      const onPointerMove = event => {
        if (reducedMotion.matches) return;
        if (raf) return;
        rect ||= card.getBoundingClientRect();
        raf = requestAnimationFrame(() => { raf = 0; const x = (event.clientX - rect.left) / rect.width - .5; const y = (event.clientY - rect.top) / rect.height - .5; card.style.setProperty('--card-rx', `${(-y * 1.2).toFixed(2)}deg`); card.style.setProperty('--card-ry', `${(x * 1.2).toFixed(2)}deg`); });
      };
      const onPointerLeave = () => { rect = null; if (raf) cancelAnimationFrame(raf); raf = 0; reset(); };
      const onPointerEnter = () => {
        if (image && window.gsap) window.gsap.to(image, { scale: 1.04, duration: .5, ease: 'power2.out', overwrite: true });
      };
      const onImageLeave = () => {
        if (image && window.gsap) window.gsap.to(image, { scale: 1, duration: .5, ease: 'power2.out', overwrite: true });
      };
      card.addEventListener('pointermove', onPointerMove);
      card.addEventListener('pointerleave', onPointerLeave);
      card.addEventListener('pointerenter', onPointerEnter);
      card.addEventListener('pointerleave', onImageLeave);
       card.__cardMotionCleanup = () => { card.removeEventListener('pointermove', onPointerMove); card.removeEventListener('pointerleave', onPointerLeave); card.removeEventListener('pointerenter', onPointerEnter); card.removeEventListener('pointerleave', onImageLeave); onPointerLeave(); if (image && window.gsap) window.gsap.killTweensOf(image); card.removeAttribute('data-motion-ready'); };
    });
    };
    setupCardInteractions.state.cleanup = () => {
      controls.abort();
      cleanupCards();
    };
    const onReducedMotionChange = event => {
      if (event.matches) cleanupCards();
      else enableCards();
    };
    const onEligibilityChange = event => {
      if (event.matches) enableCards();
      else cleanupCards();
    };
    reducedMotion.addEventListener('change', onReducedMotionChange, { signal: controls.signal });
    eligible.addEventListener('change', onEligibilityChange, { signal: controls.signal });
    enableCards();
}

function setupMotion() {
  const hasGsap = Boolean(window.gsap && window.ScrollTrigger);
  let lenis;
  let lenisTicker;
  let lenisRaf = 0;
  let lenisStopped = false;

  const destroyLenis = () => {
    lenisStopped = true;
    if (lenisTicker && window.gsap) window.gsap.ticker.remove(lenisTicker);
    lenisTicker = null;
    if (lenisRaf) cancelAnimationFrame(lenisRaf);
    lenisRaf = 0;
    lenis?.destroy?.();
    lenis = null;
    if (window.__lenisInstance) window.__lenisInstance = null;
  };
  const createLenis = () => {
    if (reducedMotion.matches || !window.Lenis || lenis) return;
    lenisStopped = false;
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true, syncTouch: false, easing: value => 1 - Math.pow(1 - value, 4) });
    window.__lenisInstance = lenis;
    if (hasGsap) {
      lenisTicker = time => { if (!lenisStopped && lenis) lenis.raf(time * 1000); };
      window.gsap.ticker.add(lenisTicker);
      window.gsap.ticker.lagSmoothing(0);
    } else {
      const frame = time => { if (lenisStopped || !lenis) return; lenis.raf(time); lenisRaf = requestAnimationFrame(frame); };
      lenisRaf = requestAnimationFrame(frame);
    }
  };
  createLenis();

  setupHeader(lenis);
  setupCardInteractions();
  setupReveal();
  document.querySelectorAll('.hero__content > *, .hero__meta').forEach((element, index) => revealElement(element, index * .12));

  let mediaTweens = [];
  if (hasGsap && !reducedMotion.matches) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    if (lenis) lenis.on('scroll', window.ScrollTrigger.update);
    mediaTweens = [...document.querySelectorAll('.hero__media, .detail-hero__media, .page-intro__media')].map(media => window.gsap.to(media, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: media.parentElement, start: 'top top', end: 'bottom top', scrub: .6 } }));
  }
  // Keep the two source copies in one clipping viewport. The first track already
  // contains the readable items followed by their aria-hidden continuation;
  // an older second track is hidden rather than animated as a second row.
  document.querySelectorAll('.ticker').forEach(ticker => {
    const tracks = [...ticker.querySelectorAll(':scope > .ticker__track')];
    if (!tracks.length) return;
    let viewport = ticker.querySelector(':scope > .ticker__viewport');
    if (!viewport) {
      viewport = document.createElement('div');
      viewport.className = 'ticker__viewport';
      tracks.forEach(track => viewport.appendChild(track));
      ticker.appendChild(viewport);
    }
    viewport.querySelectorAll(':scope > .ticker__track').forEach((track, index) => {
      track.style.display = index === 0 ? 'flex' : 'none';
      if (index > 0) track.setAttribute('aria-hidden', 'true');
    });
  });
  const tickerTracks = [...document.querySelectorAll('.ticker__viewport > .ticker__track:first-child')];
  const tickerTweens = hasGsap && !reducedMotion.matches
    ? tickerTracks.map(track => window.gsap.to(track, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 }))
    : [];
  if (hasGsap && !reducedMotion.matches) {
    // The tweens above are intentionally owned by this lifecycle.
    window.ScrollTrigger.refresh();
  }
  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      destroyLenis();
      mediaTweens.forEach(tween => { tween.scrollTrigger?.kill(); tween.kill(); });
      tickerTweens.forEach(tween => tween.kill());
      if (window.gsap) {
        window.gsap.set('.hero__media, .detail-hero__media, .page-intro__media, .ticker__track', { clearProps: 'transform' });
        window.gsap.killTweensOf('.reveal, .hero__content > *, .hero__meta');
        window.gsap.set('.reveal, .hero__content > *, .hero__meta', { clearProps: 'opacity,transform' });
      }
    } else createLenis();
  });
}

function setupCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animate = counter => {
    const target = Number(counter.dataset.count);
    if (reduce) { counter.textContent = String(target); return; }
    const started = performance.now();
    const tick = now => {
      const progress = Math.min((now - started) / 900, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!('IntersectionObserver' in window)) { counters.forEach(animate); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { animate(entry.target); observer.unobserve(entry.target); } }), { threshold: .8 });
  counters.forEach(counter => observer.observe(counter));
}

function setupForm() {
  const form = document.querySelector('#contactForm');
  const status = document.querySelector('#formStatus');
  const submit = document.querySelector('#submitButton');
  if (!form) return;
  const phoneField = form.querySelector('[name="phone"]');
  const messageField = form.querySelector('[name="message"]');
  if (phoneField) { phoneField.placeholder = '+7 или международный формат'; phoneField.setAttribute('aria-label', 'Телефон или номер для связи'); const label = phoneField.closest('label'); if (label && label.firstChild) label.firstChild.textContent = 'Телефон или номер для связи'; }
  if (messageField) messageField.placeholder = 'Можно указать Telegram или WhatsApp.';
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    submit.disabled = true;
    submit.textContent = 'Отправляем…';
    const formData = new FormData(form);
    const phone = String(formData.get('phone') || '').trim();
    const phoneDigits = phone.replace(/[\s()-]/g, '');
    if (!/^\+?\d{7,15}$/.test(phoneDigits)) { status.textContent = 'Введите корректный номер телефона в международном формате или укажите удобный способ связи в комментарии.'; submit.disabled = false; submit.textContent = `Рассчитать стоимость `; submit.insertAdjacentHTML('beforeend', iconArrow); return; }
    const service = new URLSearchParams(window.location.search).get('service');
    const direction = String(formData.get('direction') || '').trim();
    const payload = { name: String(formData.get('name') || '').trim(), phone, message: `${service ? `[Услуга: ${service}] ` : ''}[${direction}] ${String(formData.get('message') || '').trim()}`, consent: formData.get('consent') === 'on' };
    const controller = new AbortController(); const timeout = window.setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch('https://d5d01eb689qn07cv0ocu.sax5b7yq.apigw.yandexcloud.net/api/website-lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal });
      if (!response.ok) throw new Error('Request failed');
      status.textContent = 'Заявка отправлена. Мы свяжемся с вами в ближайшее рабочее время.';
      form.reset();
    } catch {
      status.textContent = 'Не удалось отправить форму автоматически. Позвоните нам: +7 (924) 231-04-78';
    } finally { window.clearTimeout(timeout);
      submit.disabled = false;
      submit.textContent = 'Рассчитать стоимость '; submit.insertAdjacentHTML('beforeend', iconArrow);
    }
  });
}

/* Floating actions must never overlap the site footer. When the footer enters an
   extended viewport (96px below the fold) the actions fade out, become inert and
   stop catching Tab. Independent of the existing menu/contacts/mobile hides. */
function setupFloatingActionsVisibility() {
  const actions = document.querySelector('.floating-actions');
  const footer = document.querySelector('.site-footer');
  if (!actions || !footer || actions.dataset.footerGuardReady) return;
  actions.dataset.footerGuardReady = 'true';
  let isNear = false;
  const apply = near => {
    if (near === isNear) return;
    isNear = near;
    actions.classList.toggle('is-near-footer', near);
    actions.inert = near;
  };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => apply(entry.isIntersecting));
    }, { rootMargin: '0px 0px 96px 0px', threshold: 0 });
    observer.observe(footer);
  } else {
    // Fallback: throttled geometry check without IntersectionObserver.
    let ticking = false;
    const check = () => {
      ticking = false;
      const rect = footer.getBoundingClientRect();
      apply(rect.top <= window.innerHeight + 96 && rect.bottom >= 0);
    };
    const requestCheck = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(check);
    };
    window.addEventListener('scroll', requestCheck, { passive: true });
    window.addEventListener('resize', requestCheck, { passive: true });
    check();
  }
}

setupAmbientGrid();
setupAmbientLights();
renderServices();
renderFinishTabs();
renderFinishPanel();
setupServiceModal();
setupServiceTriggers();
setupMobileMenu();
setupHeroSlider();
setupFilters();
setupCounters();
setupForm();
initNavMagnet();
setupSignatureMarks();
setupFloatingActionsVisibility();
setupMotion();
void loadRemoteCatalog();
