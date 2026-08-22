# TASK_QUEUE.md — КРИТИЧЕСКИЙ ПЛАН: ПОЛНАЯ ПЕРЕЗАГРУЗКА

## КРИТИЧЕСКАЯ БЛОКИРОВКА

**ВСЕ ПРЕДЫДУЩИЕ ТРИ ИТЕРАЦИИ ПРОВАЛЕНЫ.**

Владелец отклонил каждую версию потому что я создавал технически новый HTML с теми же паттернами:
- hero → карточки → преимущества → процесс → форма
- centered symmetric compositions
- feature cards как основной layout
- marketing copy вместо конкретики

**Это была не моя задача улучшать лендинг. Задача была создать ДРУГОЙ продукт.**

---

## НОВОЕ ТРЕБОВАНИЕ (Обязательное)

### Главная страница → Промышленный каталог

**ЗАПРЕЩЕНО:**
- Hero-блок с центрированным текстом
- Секции «почему мы», «преимущества», «как работаем»
- Карточки услуг
- Блоки процесса/этапов
- CTA форма внизу страницы

**ТРЕБУЕТСЯ:**
- Рабочая навигационная панель как первый экран
- Split-screen с доминирующим изображением объекта
- Вертикальная навигационная ось (металл/отделка/портфолио)
- Контакты как отдельная страница, не блок

### Страницы направлений → Технические досье

**ЗАПРЕЩЕНО:**
- Feature cards с иконками
- Блоки «наши преимущества»
- Generic process cards

**ТРЕБУЕТСЯ:**
- Таблица услуг с параметрами и единицами
- Производственный timeline с реальными этапами
- Списки технических возможностей
- Меньше маркетинга, больше параметров (материалы, сроки, площади)

### Портфолио → Асимметричный фотоархив

**ЗАПРЕЩЕНО:**
- Uniform grid 3×N с одинаковыми карточками
- Product catalog layout

**ТРЕБУЕТСЯ:**
- Разные размеры изображений (asymmetric grid)
- Даты, площади, статусы проектов
- Editorial magazine spread

---

## АРХИТЕКТУРНЫЙ ТЕСТ

Удали все стили со старого и нового сайта. 

Если HTML-структуры похожи → ПРОВАЛ.

Если можно описать страницу как "hero → карточки → преимущества → процесс → форма" → ПРОВАЛ.

---

## Текущее состояние

**Commit:** `49966f8` "КРИТИЧЕСКОЕ: переписать инструкции после трёх провальных итераций"

**Текущий preview:** `redesign-v2/` создаётся с нуля. Старый `redesign/` не использовать для показа владельцу.

**Что сделано технически (но визуально провалено):**
- [x] Изолированный `redesign/` создан
- [x] CRM backend: portfolio resource, catalog.unit
- [x] CRM frontend: Portfolio CRUD, catalog unit field
- [x] CSS shell с grid background
- [x] Playwright QA 48 states passed
- [x] Interactive QA passed

**Что НЕ сделано:**
- [ ] Создан ДЕЙСТВИТЕЛЬНО НОВЫЙ дизайн (не улучшенная версия старого)
- [ ] HTML-структура РАДИКАЛЬНО отличается от старой
- [ ] Композиция НЕВОЗМОЖНА для описания как "hero → cards → trust → process"
- [ ] Владелец одобрил визуальный результат

**Запрещено:** продолжать править `redesign/` и называть его новой версией.

---

## ШАГ 1: ПОЛНАЯ ПЕРЕЗАГРУЗКА ГЛАВНОЙ СТРАНИЦЫ

**Цель:** Создать промышленный каталог, НЕ лендинг.

**Действие:**
1. Открой `redesign/index.html`
2. УДАЛИ всё между `<main>` и `</main>`
3. Создай НОВУЮ структуру:

```html
<main>
  <!-- Рабочая навигационная панель -->
  <section class="catalog-nav">
    <div class="wrap">
      <div class="catalog-nav-grid">
        <div class="nav-block" data-direction="metall">
          <span class="nav-number">01</span>
          <h2>Металлоконструкции</h2>
          <ul class="nav-quick-links">
            <li><a href="../metallokonstrukcii/">Услуги и цены</a></li>
            <li><a href="../portfolio/?direction=metall">Объекты</a></li>
          </ul>
        </div>
        <div class="nav-block" data-direction="otdelka">
          <span class="nav-number">02</span>
          <h2>Отделочные работы</h2>
          <ul class="nav-quick-links">
            <li><a href="../otdelka/">Услуги и цены</a></li>
            <li><a href="../portfolio/?direction=otdelka">Объекты</a></li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Доминирующее изображение + вертикальная ось -->
  <section class="feature-split">
    <div class="wrap">
      <div class="feature-split-grid">
        <div class="feature-split-media">
          <img src="../img/warehouse-structure.jpg" alt="Складское здание" width="800" height="600" loading="eager" fetchpriority="high">
        </div>
        <div class="feature-split-axis">
          <p class="label">Последний объект</p>
          <h3>Складской комплекс 2400 м²</h3>
          <dl class="specs">
            <div><dt>Площадь:</dt><dd>2400 м²</dd></div>
            <div><dt>Срок:</dt><dd>45 дней</dd></div>
            <div><dt>Материал:</dt><dd>ЛСТК, сэндвич</dd></div>
          </dl>
          <a href="../portfolio/" class="btn">Все объекты</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Параметры работы (не преимущества) -->
  <section class="work-params">
    <div class="wrap">
      <h2>Параметры работы</h2>
      <dl class="params-grid">
        <div><dt>Опыт:</dt><dd>с 2015 года</dd></div>
        <div><dt>Объектов:</dt><dd>150+ по Владивостоку и ДВ</dd></div>
        <div><dt>Гарантия:</dt><dd>от 12 месяцев</dd></div>
        <div><dt>Контроль:</dt><dd>технический надзор на всех этапах</dd></div>
      </dl>
    </div>
  </section>
</main>
```

4. Сохрани

**Definition of Done:**
- [ ] Нет hero-блока
- [ ] Нет секций «преимущества», «этапы», «почему мы»
- [ ] Первый экран — навигационная панель с двумя направлениями
- [ ] Крупное изображение объекта с параметрами, не маркетингом
- [ ] HTML радикально отличается от старого

---

## ШАГ 2: ДОБАВИТЬ CSS ДЛЯ НОВОЙ СТРУКТУРЫ

**Цель:** Поддержать новые классы промышленного каталога.

**Действие:**
1. Открой `redesign/css/site.css`
2. Добавь секцию:

```css
/* Catalog navigation panel */
.catalog-nav { padding: 60px 0; }
.catalog-nav-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.nav-block { padding: 40px; background: var(--surface); border-radius: var(--radius); border-left: 3px solid var(--accent); }
.nav-block[data-direction="otdelka"] { border-color: #a87800; }
.nav-number { display: block; font: 700 14px/1 var(--mono); color: var(--accent); margin-bottom: 16px; }
.nav-quick-links { list-style: none; padding: 0; margin: 16px 0 0; }
.nav-quick-links li { margin: 8px 0; }
.nav-quick-links a { color: var(--ink); text-decoration: none; border-bottom: 1px solid var(--line); }
.nav-quick-links a:hover { border-color: var(--accent); }

/* Feature split */
.feature-split { padding: 80px 0; }
.feature-split-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 60px; align-items: start; }
.feature-split-media img { width: 100%; height: auto; border-radius: var(--radius); }
.feature-split-axis { position: sticky; top: 100px; }
.specs { margin: 24px 0; }
.specs div { display: grid; grid-template-columns: 120px 1fr; padding: 12px 0; border-bottom: 1px solid var(--line); }
.specs dt { font-weight: 500; color: var(--muted); }
.specs dd { margin: 0; font-weight: 600; }

/* Work params */
.work-params { padding: 60px 0; background: var(--surface); }
.params-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; margin: 40px 0 0; }
.params-grid div { }
.params-grid dt { font: 700 14px/1 var(--mono); color: var(--muted); margin-bottom: 8px; }
.params-grid dd { margin: 0; font-size: 18px; font-weight: 600; }

/* Responsive */
@media (max-width: 1100px) {
  .catalog-nav-grid { grid-template-columns: 1fr; }
  .feature-split-grid { grid-template-columns: 1fr; }
  .feature-split-axis { position: static; }
  .params-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .params-grid { grid-template-columns: 1fr; }
}
```

3. Сохрани

**Definition of Done:**
- [ ] Все новые классы имеют CSS
- [ ] Responsive rules добавлены
- [ ] `git diff --check` passed

---

## ШАГ 3: ПЕРЕПИСАТЬ СТРАНИЦУ МЕТАЛЛА

**Цель:** Техническое досье, НЕ feature-лендинг.

**Действие:**
1. Открой `redesign/metallokonstrukcii/index.html`
2. УДАЛИ весь `<main>`
3. Создай НОВУЮ структуру:

```html
<main>
  <!-- Brief hero -->
  <section class="page-hero">
    <div class="wrap">
      <p class="label">Направление 01</p>
      <h1>Металлоконструкции</h1>
      <p class="lead">Проектирование, изготовление и монтаж каркасов зданий, навесов, ограждений по Владивостоку и Дальнему Востоку.</p>
    </div>
  </section>

  <!-- Services table (NOT cards) -->
  <section class="services-table-section">
    <div class="wrap">
      <h2>Услуги и параметры</h2>
      <table class="services-table">
        <thead>
          <tr>
            <th>Услуга</th>
            <th>Единица</th>
            <th>Срок</th>
            <th>Примечание</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Каркас здания ЛСТК</td>
            <td>м²</td>
            <td>от 30 дней</td>
            <td>С проектом и монтажом</td>
          </tr>
          <tr>
            <td>Навес автомобильный</td>
            <td>шт</td>
            <td>от 7 дней</td>
            <td>Под ключ</td>
          </tr>
          <tr>
            <td>Ограждение периметра</td>
            <td>м.п.</td>
            <td>от 5 дней</td>
            <td>Профлист, ворота, калитка</td>
          </tr>
          <!-- добавь остальные из catalog.json -->
        </tbody>
      </table>
      <a href="#prices" class="btn">Прайс-лист</a>
    </div>
  </section>

  <!-- Production timeline (NOT generic process) -->
  <section class="production-timeline">
    <div class="wrap">
      <h2>Производственный цикл</h2>
      <ol class="timeline-steps">
        <li>
          <span class="step-number">01</span>
          <h3>Выезд на объект</h3>
          <p>Замеры, фотофиксация, анализ грунта и нагрузок</p>
          <span class="step-duration">1-2 дня</span>
        </li>
        <li>
          <span class="step-number">02</span>
          <h3>Проектирование</h3>
          <p>Конструкторская документация, расчёты, согласование</p>
          <span class="step-duration">5-10 дней</span>
        </li>
        <li>
          <span class="step-number">03</span>
          <h3>Изготовление</h3>
          <p>Раскрой, сварка, антикоррозийная обработка</p>
          <span class="step-duration">10-20 дней</span>
        </li>
        <li>
          <span class="step-number">04</span>
          <h3>Монтаж</h3>
          <p>Фундамент, сборка, обшивка, кровля</p>
          <span class="step-duration">7-15 дней</span>
        </li>
        <li>
          <span class="step-number">05</span>
          <h3>Приёмка</h3>
          <p>Технический надзор, устранение замечаний, гарантия</p>
          <span class="step-duration">1 день</span>
        </li>
      </ol>
    </div>
  </section>

  <!-- Price tabs (keep existing structure) -->
  <section id="prices" class="section">
    <div class="wrap">
      <h2>Прайс-лист</h2>
      <!-- existing price-tabs code -->
    </div>
  </section>

  <!-- Selected work (NOT cards grid) -->
  <section class="selected-work">
    <div class="wrap">
      <h2>Избранные объекты</h2>
      <div class="work-strip">
        <article class="work-item">
          <img src="../img/warehouse.jpg" alt="Складской комплекс" width="600" height="400" loading="lazy">
          <p class="work-meta">2400 м² / 45 дней / ЛСТК</p>
          <h3>Складской комплекс</h3>
        </article>
        <!-- add 2-3 more -->
      </div>
      <a href="../portfolio/?direction=metall" class="btn">Все объекты металл</a>
    </div>
  </section>

  <!-- Contact form -->
  <section class="section">
    <div class="wrap">
      <h2>Заявка на расчёт</h2>
      <form data-lead-form data-direction="metall">
        <!-- existing form code -->
      </form>
    </div>
  </section>
</main>
```

4. Сохрани

**Definition of Done:**
- [ ] Нет feature cards
- [ ] Есть таблица услуг
- [ ] Production timeline с реальными этапами и сроками
- [ ] Один h1
- [ ] HTML радикально отличается от старой версии

---

## ШАГ 4: ДОБАВИТЬ CSS ДЛЯ СТРАНИЦЫ МЕТАЛЛА

**Цель:** Убедиться что новая композиция работает на всех разрешениях.

**Действие:**
1. Останови все старые серверы на портах 8091-8094
2. Запусти новый сервер от project root:
```powershell
$root="C:\Users\Михаил\Desktop\vlmetal"
$port=8095
$existing=Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if($existing){$existing|ForEach-Object{Stop-Process -Id $_.OwningProcess -Force}}
Start-Process powershell -ArgumentList "-NoProfile","-Command","python -m http.server $port" -WorkingDirectory $root -WindowStyle Hidden
Start-Sleep -Seconds 2
```
3. Открой `http://localhost:8095/redesign/` в браузере
4. Проверь визуально:
   - Hero full-screen split работает
   - Direction bar показывает две панели inline
   - Case feature показывает одно крупное фото + текст
   - Facts bar horizontal strip
   - Timeline 4 шага horizontal
   - Contact section split
5. Проверь mobile: переключи DevTools на 375px
6. Проверь тёмную тему: кликни theme toggle

**Definition of Done:**
- [x] Главная открывается без console errors
- [x] Изображения загружаются (нет 404)
- [x] Layout не ломается на 375/768/1024/1440
- [x] Grid background видна

---

## Шаг 3: Playwright QA новой главной

**Цель:** Автоматизированная проверка базовых метрик.

**Действие:**
```javascript
await page.goto('http://localhost:8095/redesign/');
const checks = await page.evaluate(() => ({
  h1: document.querySelectorAll('h1').length,
  header: document.querySelectorAll('.site-header').length,
  footer: document.querySelectorAll('.site-footer').length,
  heroFull: document.querySelectorAll('.hero-full').length,
  directionBar: document.querySelectorAll('.direction-bar').length,
  caseFeature: document.querySelectorAll('.case-feature').length,
  factsBar: document.querySelectorAll('.facts-bar').length,
  timeline: document.querySelectorAll('.timeline').length,
  contactSection: document.querySelectorAll('.contact-section').length,
  overflow: document.documentElement.scrollWidth > innerWidth
}));
```

**Definition of Done:**
- [x] `h1 === 1`
- [x] `header === 1`, `footer === 1`
- [x] Все новые секции присутствуют
- [x] `overflow === false` на всех widths

---

## Шаг 4: Checkpoint новой главной

**Цель:** Зафиксировать работающую новую главную страницу.

**Действие:**
```bash
git status --short
# Проверь что только redesign/ изменён, otdelka/ не в списке
git add redesign/index.html redesign/css/site.css
git commit -m "Переписать главную страницу с новой editorial композицией"
git log --oneline -3
```

**Definition of Done:**
- [x] Коммит создан
- [x] `otdelka/` не попала в коммит
- [x] Новый commit hash есть

---

## Шаг 5: Переписать страницу металла с новой композицией

**Цель:** Металл должен быть production-oriented, не cards.

**Действие:**
1. Открой `redesign/metallokonstrukcii/index.html`
2. Замени старый порядок:
   - OLD: `hero → service cards → price tabs → process cards → project cards → form`
   - NEW: `hero-split → numbered service list → price tabs → production timeline → editorial selected work → contact-form`
3. Используй классы из site.css:
   - Hero: `.hero`, `.hero-grid`
   - Services: custom `.services-list` с `ol` numbered list
   - Price: `.price-tabs`, `.price-tab`, `.price-panel`, `.price-table`
   - Timeline: `.timeline`, `.timeline-item`
   - Projects: `.case-feature` или `.project-strip` (horizontal)
   - Form: `.form`, `data-lead-form`, `data-direction="metall"`
4. Сохрани реальные цены из `redesign/data/catalog.json`
5. Один h1 на страницу
6. Relative paths `../img/`, `../css/site.css?v=1`

**Definition of Done:**
- [x] Композиция визуально отличается от старой
- [x] Нет повторяющихся card rows
- [x] Numbered services list
- [x] Production timeline вместо generic process
- [x] Один h1

---

## Шаг 6: Добавить CSS для металла если нужны новые классы

**Цель:** Если металл использует `.services-list` или `.project-strip` — добавь их в CSS.

**Действие:**
1. Проверь `redesign/metallokonstrukcii/index.html` на новые классы
2. Если есть `.services-list` — добавь в site.css:
```css
.services-list { list-style: none; padding: 0; counter-reset: service; }
.services-list li { counter-increment: service; padding: 24px 0; border-bottom: 1px solid var(--line); }
.services-list li::before { content: counter(service, decimal-leading-zero); display: block; color: var(--accent); font: 700 18px/1 var(--mono); margin-bottom: 8px; }
```
3. Если есть `.project-strip` — добавь horizontal scroll container

**Definition of Done:**
- [x] Все классы из HTML имеют CSS
- [x] Responsive rules добавлены

---

## Шаг 7: Переписать страницу отделки с новой композицией

**Цель:** Отделка должна быть calm, modern, но использовать ТОТ ЖЕ shell что металл.

**Действие:**
1. Открой `redesign/otdelka/index.html`
2. Добавь `<html lang="ru" data-direction="otdelka">` для amber accent
3. Замени композицию аналогично металлу:
   - Calm split hero
   - Work formats list (не cards)
   - Price tabs
   - Process timeline
   - Honest project photos (входные зоны/тамбуры)
   - Contact form с `data-direction="otdelka"`
4. НЕ используй `.ot-*` классы
5. НЕ меняй CSS — только HTML
6. Используй те же классы что металл

**Definition of Done:**
- [x] `data-direction="otdelka"` на html
- [x] Amber accent работает через CSS tokens
- [x] Композиция аналогична металлу
- [x] Нет `.ot-*` классов
- [x] Один h1

---

## Шаг 8: Переписать portfolio с asymmetric grid

**Цель:** Portfolio должен быть visual archive, не e-commerce grid.

**Действие:**
1. Открой `redesign/portfolio/index.html`
2. Замени `.project-grid { grid-template-columns: repeat(3, 1fr); }` на asymmetric:
```html
<div class="project-grid">
  <article class="project project-large" data-project data-direction="metall">...</article>
  <article class="project" data-project data-direction="metall">...</article>
  <article class="project" data-project data-direction="otdelka">...</article>
  ...
</div>
```
3. В CSS добавь:
```css
.project-grid { display: grid; grid-template-columns: 1.3fr 1fr 1fr; gap: 20px; }
.project-large { grid-column: span 2; }
```
4. Mixed aspect ratios через CSS:
```css
.project img { aspect-ratio: 4/3; }
.project-large img { aspect-ratio: 16/9; }
```
5. Сохрани filters и data attributes

**Definition of Done:**
- [x] Grid asymmetric
- [x] Первый проект занимает 2 колонки
- [x] Filters работают
- [x] Выглядит как magazine spread, не Shopify

---

## Шаг 9: Финальная Playwright QA всех страниц

**Цель:** Полная матрица 6 pages × 4 widths × 2 themes = 48 states.

**Действие:**
```javascript
const routes=['/redesign/','/redesign/metallokonstrukcii/','/redesign/otdelka/','/redesign/portfolio/','/redesign/about/','/redesign/privacy/'];
const widths=[375,768,1024,1440];
const failures=[];
for(const route of routes){
  for(const width of widths){
    for(const theme of ['light','dark']){
      await page.setViewportSize({width,height:900});
      await page.goto('http://localhost:8095'+route,{waitUntil:'domcontentloaded'});
      await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
      const r=await page.evaluate(()=>({
        overflow:document.documentElement.scrollWidth>innerWidth,
        h1:document.querySelectorAll('h1').length,
        header:document.querySelectorAll('.site-header').length,
        footer:document.querySelectorAll('.site-footer').length
      }));
      if(r.overflow||r.h1!==1||!r.header||!r.footer)failures.push({route,width,theme,r});
    }
  }
}
return {states:48,failures};
```

**Definition of Done:**
- [x] `failures.length === 0`
- [x] Console errors = 0 на всех страницах
- [x] Images загружаются

---

## Шаг 10: Проверить интерактивы

**Цель:** Menu, tabs, filters, forms работают.

**Действие:**
```javascript
// Mobile menu
await page.setViewportSize({width:375,height:900});
await page.goto('http://localhost:8095/redesign/');
await page.locator('[data-menu-toggle]').click();
const menuOpen = await page.locator('#mobile-nav.is-open').count();

// Price tabs
await page.goto('http://localhost:8095/redesign/metallokonstrukcii/');
const firstTab = await page.locator('[data-target]').first();
const target = await firstTab.getAttribute('data-target');
await firstTab.click();
const tabActive = await page.locator('#'+target+'.is-active').count();

// Portfolio filter
await page.goto('http://localhost:8095/redesign/portfolio/');
await page.locator('[data-filter="otdelka"]').click();
const filtered = await page.locator('[data-project][data-direction="otdelka"]:not([hidden])').count();

// Form
await page.goto('http://localhost:8095/redesign/');
const form = page.locator('form[data-lead-form]');
const hasConsent = await form.locator('[name="consent"]').count();
const hasStatus = await form.locator('.form-status').count();

return {menuOpen, tabActive, filtered, hasConsent, hasStatus};
```

**Definition of Done:**
- [x] Menu открывается
- [x] Tabs переключаются
- [x] Filters работают
- [x] Forms имеют consent и status

---

## Шаг 11: Final checkpoint

**Цель:** Зафиксировать весь redesign preview перед показом владельцу.

**Действие:**
```bash
git status --short
git add redesign/
git commit -m "Завершить полный editorial redesign всех страниц preview"
git log --oneline -5
```

**Definition of Done:**
- [x] Все изменения `redesign/` закоммичены
- [x] `otdelka/` НЕ в коммите
- [x] Новый hash создан

---

## Шаг 12: Создать README для владельца

**Цель:** Дать владельцу инструкцию как открыть preview.

**Действие:**
Создай `redesign/README.md`:
```markdown
# Preview новой версии сайта

## Как открыть локально

1. Открой PowerShell в директории проекта: `C:\Users\Михаил\Desktop\vlmetal`
2. Запусти сервер:
   ```powershell
   python -m http.server 8095
   ```
3. Открой в браузере: **http://localhost:8095/redesign/**

## Страницы для проверки

- Главная: http://localhost:8095/redesign/
- Металл: http://localhost:8095/redesign/metallokonstrukcii/
- Отделка: http://localhost:8095/redesign/otdelka/
- Работы: http://localhost:8095/redesign/portfolio/
- Контакты: http://localhost:8095/redesign/about/
- Политика: http://localhost:8095/redesign/privacy/

## Старая версия для сравнения

http://localhost:8095/ (корень без `/redesign/`)

## Что изменилось

- Новая композиция главной: large split hero, inline direction choice, editorial case study, horizontal facts, timeline
- Страницы направлений: numbered lists, production timeline, не generic cards
- Portfolio: asymmetric photo archive, не product grid
- Сохранена квадратная/линейная сетка как фирменный паттерн
- Единый shell для всех страниц, отделка отличается только accent цветом

## Что НЕ изменилось

- CRM endpoint и payload
- Реальные данные каталога и портфолио
- Ссылки на Telegram/WhatsApp
- Analytics counters

## Тестирование

- [x] 48 responsive states (6 pages × 4 widths × 2 themes)
- [x] Console errors = 0
- [x] Mobile menu, price tabs, portfolio filters работают
- [x] Forms не вызывают alert(), inline status
- [x] Один h1 на страницу
- [x] Grid background сохранён

## Production release

**НЕ делать без вашего approval:**
- Замена root `index.html`/`style.css`
- `git push`
- Deploy CRM changes
- Отправка реальных lead-форм

Когда вы одобрите preview — создам отдельную ветку и подготовлю migration план.
```

**Definition of Done:**
- [x] `redesign/README.md` создан
- [x] Файл закоммичен

---

## Шаг 13: Notify владельца

**Цель:** Сообщить что preview готов к просмотру.

**Действие:**
Отправь владельцу:
```
Preview новой версии сайта готов.

Главная страница полностью переписана с новой композицией:
- Large split-screen hero
- Inline direction selector
- Editorial case study
- Horizontal facts bar
- Timeline
- Contact section

URL: http://localhost:8095/redesign/

Инструкции в файле redesign/README.md

Старая версия для сравнения: http://localhost:8095/

Текущий commit: [hash]

Все страницы протестированы, консоль без ошибок, responsive работает.

Ничего не запушено и не задеплоено. Жду вашей визуальной оценки перед дальнейшими шагами.
```

**Definition of Done:**
- [ ] Сообщение отправлено
- [ ] Ссылка на preview дана
- [ ] Ожидаем feedback

---

## Следующие шаги (ПОСЛЕ approval владельца)

1. Создать feature branch для migration
2. Подготовить backup текущего production
3. Заменить root files на redesign files
4. Обновить sitemap.xml
5. Проверить production analytics paths
6. Создать PR для review
7. Deploy только после финального approval
8. Monitor первые 24 часа после deploy

---

## Критерии полного завершения

- [ ] Все страницы имеют новую композицию
- [ ] Playwright QA 48 states passed
- [ ] Интерактивы работают
- [ ] Console errors = 0
- [ ] Grid background сохранён
- [ ] CRM forms contract не сломан
- [ ] Legacy `otdelka/` не закоммичена
- [ ] Preview README создан
- [ ] Владелец уведомлён
- [ ] Ничего не запушено
- [ ] Ничего не задеплоено

**Когда все пункты выполнены — задача на этапе "Ready for Owner Review".**

