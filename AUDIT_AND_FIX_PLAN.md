# ПОЛНЫЙ АУДИТ И ДЕТАЛЬНЫЙ ПЛАН ИСПРАВЛЕНИЙ

**Дата:** 22 августа 2026  
**Проект:** vlmetal — сайт ООО «Концепция Строительства»  
**Статус:** Критические проблемы в консистентности, интеграции CRM и структуре навигации

---

## КРИТИЧЕСКИЕ ПРОБЛЕМЫ (из запроса владельца)

### 1. ❌ **СВЯЗЬ КАТАЛОГА С CRM ОТСУТСТВУЕТ**

**Обнаружено:**
- `/metallokonstrukcii/index.html` — содержит **хардкод-прайс** в HTML внутри табов, нет динамической загрузки
- Нет JSON-файлов `catalog.json` или `portfolio.json` в корне проекта
- CRM существует (`/vlmetal-crm/shadcn-admin/src/features/catalog/`), но API endpoint не вызывается фронтендом
- Прайс-лист на странице металла показывает фиксированные цены, владелец изменяет их только вручную в HTML

**Как должно работать:**
- CRM → JSON API → фронтенд подгружает актуальный каталог
- Владелец обновляет цены и описания через CRM админку, сайт подтягивает автоматически

**Связь с CRM backend:**
- В `vlmetal-crm/shadcn-admin/src/features/catalog/components/catalog-data.ts` определён тип Product
- API существует в `vlmetal-crm/yandex-cloud/crm-api/` (endpoints `/api/catalog`, `/api/portfolio`)
- Endpoint должен быть: `https://d5d01eb689qn07cv0ocu.sax5b7yq.apigw.yandexcloud.net/api/catalog`

**Текущий статус:** **НУЛЕВОЙ** — никакой связи нет, прайс полностью статичный.

---

### 2. ❌ **РАЗМЕРЫ ТЕКСТА И ДИЗАЙН МЕНЯЮТСЯ МЕЖДУ СТРАНИЦАМИ**

**Обнаружено при сравнении:**

| Страница | Header | Шрифты | Навигация | Footer | CSS файлы |
|----------|--------|--------|-----------|--------|-----------|
| `/` (главная) | `.header` | `Rajdhani, Montserrat` | 9 ссылок (включая якоря) | `.footer` | `style.css` |
| `/about/` | `.header` | `Rajdhani, Montserrat` | 5 ссылок (страницы) | `.footer` | `style.css` |
| `/portfolio/` | `.header` | `Rajdhani, Montserrat` | 6 ссылок | `.footer` | `style.css` |
| `/metallokonstrukcii/` | `.header` | `Rajdhani, Montserrat` | **Нет** | `.footer` | `style.css` |
| `/otdelka/` | **`.ot-header`** | `Montserrat, Rajdhani` | **10+ ссылок** | `.footer` (базовый) | `style.css` + **`otdelka.css`** (1712 строк) |

**Критические расхождения:**

#### `/otdelka/` — ОТДЕЛЬНАЯ ВИЗУАЛЬНАЯ СИСТЕМА:
- Уникальный namespace: `.ot-*` (ot-header, ot-logo, ot-nav, ot-btn, ot-section)
- Свои CSS переменные:
  ```css
  --ot-white, --ot-grey, --ot-yellow, --ot-graphite, --ot-muted, --ot-heading
  ```
- Отличается палитра (желтый вместо оранжевого accent):
  - Главная: `--accent: #ff6a00` (оранжевый)
  - Отделка: `--ot-yellow: #F5C518` (желтый)
- Отличается grid (44px vs 60px в базовом style.css)
- Отличается hero-секция: `.ot-hero` вместо `.hero`
- Отличаются кнопки: `.ot-btn` вместо `.btn`
- **Результат:** страница выглядит как ОТДЕЛЬНЫЙ сайт

#### Главная (`/`) — ЯКОРНАЯ НАВИГАЦИЯ:
- В меню 9 ссылок, из них **4 якоря на ту же страницу**:
  ```html
  <a href="#about">О НАС</a>
  <a href="#testimonials">ОТЗЫВЫ</a>
  <a href="#faq">ВОПРОСЫ</a>
  <a href="#contacts">КОНТАКТЫ</a>
  ```
- На остальных страницах (about, portfolio, metallokonstrukcii) этих якорей нет → битые ссылки

#### `/metallokonstrukcii/` — НАВИГАЦИЯ ОТСУТСТВУЕТ:
- Header есть, но в `<nav class="nav">` **пусто** (строка 111 в index.html пустая)
- Пользователь не может перейти на другие страницы без Back

---

### 3. ❌ **НАВИГАЦИЯ НЕСОГЛАСОВАННАЯ**

**Требование владельца:**
> Сверху должны быть только кнопки: Главная, Внутренняя, Металл, Примеры работ, О нас — все разными страницами

**Текущее состояние:**

#### Главная (`/`):
```html
ГЛАВНАЯ | МЕТАЛЛОКОНСТРУКЦИИ | ВНУТРЕННЯЯ ОТДЕЛКА | ПРИМЕРЫ РАБОТ | О КОМПАНИИ | О НАС | ОТЗЫВЫ | ВОПРОСЫ | КОНТАКТЫ
```
**9 ссылок**, из них 5 — якоря на ту же страницу.

#### About (`/about/`):
```html
ГЛАВНАЯ | МЕТАЛЛ | ОТДЕЛКА | ПРИМЕРЫ РАБОТ | О КОМПАНИИ
```
**5 ссылок**, правильная структура.

#### Portfolio (`/portfolio/`):
```html
ГЛАВНАЯ | МЕТАЛЛОКОНСТРУКЦИИ | ВНУТРЕННЯЯ ОТДЕЛКА | ПРИМЕРЫ РАБОТ | О КОМПАНИИ | КОНТАКТЫ
```
**6 ссылок** (5 страниц + якорь).

#### Metallokonstrukcii (`/metallokonstrukcii/`):
```html
(навигация пустая)
```

#### Otdelka (`/otdelka/`):
```html
ГЛАВНАЯ | МЕТАЛЛОКОНСТРУКЦИИ | ВНУТРЕННЯЯ ОТДЕЛКА | ПРИМЕРЫ РАБОТ | О КОМПАНИИ | ОТЗЫВЫ | ВОПРОСЫ | КОНТАКТЫ
```
**8 ссылок**, смесь страниц и якорей.

**Проблема:** Каждая страница показывает разную навигацию, пользователь не может предсказать структуру сайта.

---

### 4. ❌ **МЕТАЛЛ — НУЖЕН ПРАЙС-ЛИСТ, НЕ КАК СЕЙЧАС**

**Текущее состояние:**
- Прайс спрятан в табах по категориям: Мангалы, Ворота и заборы, Навесы, Лестницы, Работы в цеху, Малоэтажка, Прочее
- Для каждой категории свой `<table>` в HTML
- Переключение через JS табов (`.tab-link`, `.tab-panel`)
- **Прайс статичный, хардкод в HTML**

**Требование владельца:**
> нужно так же что бы прайс листом было, а не как сейчас у нас

**Интерпретация:**
- Убрать табы
- Показать **единую таблицу-прайс** со всеми услугами сразу (как Excel/PDF прайс-лист)
- Возможно, добавить фильтр или группировку по категориям внутри одной таблицы

---

### 5. ❌ **ДИЗАЙН МЕЖДУ СТРАНИЦАМИ СИЛЬНО ОТЛИЧАЕТСЯ**

**Визуальные несоответствия:**

#### Цветовая палитра:
| Страница | Accent | Фон | Текст | Grid |
|----------|--------|-----|-------|------|
| `/`, `/about/`, `/portfolio/`, `/metallokonstrukcii/` | `#ff6a00` (оранжевый) | `#0a0a0a` (темный) | `#ffffff` | 60×60px |
| `/otdelka/` | `#F5C518` (желтый) | `#fdfbf6` (светлый по умолчанию) | `#2d2d2d` | 44×44px |

#### Типографика:
- Основные страницы: `font-family: 'Rajdhani', 'Montserrat'`
- Otdelka: `font-family: 'Montserrat', 'Rajdhani'` (обратный порядок)
- Размеры заголовков разные (h1 на главной крупнее, чем на about)

#### CSS классы:
- Основные страницы: `.header`, `.logo`, `.nav`, `.btn`, `.section`, `.footer`
- Otdelka: `.ot-header`, `.ot-logo`, `.ot-nav`, `.ot-btn`, `.ot-section`, `.footer` (footer базовый, но остальное — свое)

#### Hero-секции:
- Главная: `.hero` с крупным изображением справа
- About: `.page-hero--about` (модификатор)
- Portfolio: `.page-hero--portfolio`
- Metallokonstrukcii: `.hero` (базовый)
- Otdelka: `.ot-hero` (полностью свой)

**Результат:** пользователь чувствует, что переходит между разными сайтами.

---

## ДОПОЛНИТЕЛЬНЫЕ ПРОБЛЕМЫ (обнаружены при аудите)

### 6. ⚠️ **Дублирование кода и несогласованность структуры**

**Header:**
- 5 файлов содержат почти идентичный header HTML
- При изменении логотипа или меню нужно править 5 мест
- Mobile menu тоже дублируется 5 раз

**Footer:**
- Аналогично, footer копипастен 5 раз
- Контакты и реквизиты одинаковые, но разметка может различаться

**Решение:** создать общий `header.html` и `footer.html`, подключать через JS или SSI (если сервер поддерживает).

---

### 7. ⚠️ **Theme toggle (светлая/темная тема) не синхронизирован**

**Обнаружено:**
- `style.css` поддерживает `[data-theme="light"]` и `[data-theme="dark"]`
- `otdelka.css` поддерживает `[data-theme="dark"]`
- Главная страница: кнопка theme-toggle есть
- About, Portfolio, Metallokonstrukcii: кнопка theme-toggle есть
- Otdelka: кнопка theme-toggle **есть**, но работает через **собственный скрипт** в конце HTML (отдельная реализация)

**Проблема:** два разных JS-скрипта управляют темой, localStorage ключи могут отличаться.

**Как должно быть:** один общий `theme-toggle.js` для всех страниц.

---

### 8. ⚠️ **Mobile menu не работает на `/metallokonstrukcii/`**

Из-за пустой навигации мобильное меню тоже пустое — пользователь на мобильном не может уйти со страницы.

---

### 9. ⚠️ **Нет breadcrumbs (хлебных крошек)**

Хотя schema.org breadcrumbs есть в JSON-LD на `/otdelka/` и `/metallokonstrukcii/`, визуальных хлебных крошек нет. Пользователь не понимает, где он находится в иерархии сайта.

---

### 10. ⚠️ **Нет единого источника правды для контента**

**Примеры:**
- Телефон: `+79242310478` — захардкожен в 5 HTML-файлах
- Адрес: `Владивосток, ул. Татарская, 11` — в 5 местах
- ИНН/ОГРН — в футере каждой страницы

При изменении контакта нужно править 5 файлов.

**Решение:** создать `config.json` с глобальными данными (контакты, соц.сети, реквизиты) и подгружать через JS.

---

## ДЕТАЛЬНЫЙ ПЛАН ИСПРАВЛЕНИЙ

### ЭТАП 1: КОНСИСТЕНТНОСТЬ ДИЗАЙНА (приоритет КРИТИЧЕСКИЙ)

**Цель:** Привести все страницы к единому визуальному языку.

#### 1.1. Унифицировать CSS (удалить `otdelka.css`, мигрировать на `style.css`)

**Задачи:**

1. **Создать резервную копию:**
   ```bash
   cp otdelka/otdelka.css otdelka/otdelka.css.backup
   ```

2. **Перенести полезные паттерны из `otdelka.css` в `style.css`:**
   - Carousel (если используется только на otdelka)
   - FAQ accordion (если нужен на других страницах)
   - Любые уникальные компоненты, которые имеют смысл для всего сайта

3. **Заменить все `.ot-*` классы в `/otdelka/index.html` на базовые:**
   - `.ot-header` → `.header`
   - `.ot-logo` → `.logo`
   - `.ot-nav` → `.nav`
   - `.ot-btn` → `.btn`
   - `.ot-section--white` → `.section` или `.section--light`
   - `.ot-hero` → `.hero`
   - И так далее для всех 100+ классов

4. **Удалить `<link rel="stylesheet" href="otdelka.css">` из `/otdelka/index.html`**

5. **Проверить результат:**
   - Открыть `/otdelka/` в браузере
   - Сравнить визуально со старой версией (должно быть похоже, но в едином стиле с остальными страницами)
   - Проверить responsive на 375px, 768px, 1024px, 1440px

**Ожидаемый результат:** `/otdelka/` выглядит как часть общего сайта, а не отдельный проект.

**Время:** 4–6 часов (аккуратная миграция классов).

---

#### 1.2. Привести header и navigation к единому виду

**Задачи:**

1. **Определить финальную структуру меню (согласовать с владельцем):**

   Предложение:
   ```
   ГЛАВНАЯ | МЕТАЛЛ | ОТДЕЛКА | ПРИМЕРЫ РАБОТ | О КОМПАНИИ
   ```

   5 ссылок, только на страницы (без якорей в хедере).

2. **Создать общий шаблон header:**

   Файл: `/includes/header.html` (или inline JS для динамической вставки)

   ```html
   <header class="header">
     <div class="container header__inner">
       <a href="/" class="logo">
         <img src="/img/logo_big.png" alt="Концепция строительства" class="logo__img">
         <span class="logo__text">КОНЦЕПЦИЯ СТРОИТЕЛЬСТВА</span>
       </a>
       <nav class="nav" aria-label="Основное меню">
         <a href="/" class="nav__link">ГЛАВНАЯ</a>
         <a href="/metallokonstrukcii/" class="nav__link">МЕТАЛЛ</a>
         <a href="/otdelka/" class="nav__link">ОТДЕЛКА</a>
         <a href="/portfolio/" class="nav__link">ПРИМЕРЫ РАБОТ</a>
         <a href="/about/" class="nav__link">О КОМПАНИИ</a>
       </nav>
       <button class="theme-toggle" aria-label="Переключить тему">
         <svg class="theme-toggle__sun">...</svg>
         <svg class="theme-toggle__moon">...</svg>
       </button>
       <a href="#contacts" class="btn btn--header">СВЯЗАТЬСЯ</a>
       <button class="hamburger" id="hamburger" aria-label="Меню">
         <span></span><span></span><span></span>
       </button>
     </div>
     <div class="mobile-menu" id="mobileMenu">
       <a href="/" class="mobile-menu__link">ГЛАВНАЯ</a>
       <a href="/metallokonstrukcii/" class="mobile-menu__link">МЕТАЛЛ</a>
       <a href="/otdelka/" class="mobile-menu__link">ОТДЕЛКА</a>
       <a href="/portfolio/" class="mobile-menu__link">ПРИМЕРЫ РАБОТ</a>
       <a href="/about/" class="mobile-menu__link">О КОМПАНИИ</a>
     </div>
   </header>
   ```

3. **Добавить JS для подсветки активной ссылки:**

   ```javascript
   // active-nav.js
   document.addEventListener('DOMContentLoaded', function() {
     const path = window.location.pathname;
     const links = document.querySelectorAll('.nav__link, .mobile-menu__link');
     links.forEach(link => {
       if (link.getAttribute('href') === path || 
           (path !== '/' && link.getAttribute('href') !== '/' && path.startsWith(link.getAttribute('href')))) {
         link.classList.add('nav__link--active');
       }
     });
   });
   ```

4. **Заменить header на всех 5 страницах общим шаблоном**

5. **Проверить:**
   - Навигация одинаковая на всех страницах
   - Активная ссылка подсвечивается
   - Mobile menu работает
   - Theme toggle работает (см. следующий пункт)

**Время:** 2–3 часа.

---

#### 1.3. Унифицировать theme-toggle

**Задачи:**

1. **Создать общий `/theme-toggle.js`** (уже существует, проверить что он работает корректно)

2. **Убедиться, что все страницы используют один localStorage ключ:**
   ```javascript
   const THEME_KEY = 'site-theme'; // единый ключ
   ```

3. **Удалить inline theme-toggle скрипт из `/otdelka/index.html`** (там отдельная реализация)

4. **Убедиться, что `theme-init.js` загружается ДО рендера** (уже есть в `<head>`, должно работать)

**Проверка:**
- Переключить тему на главной
- Перейти на `/about/` — тема должна сохраниться
- Перейти на `/otdelka/` — тема должна остаться той же

**Время:** 1 час.

---

#### 1.4. Унифицировать footer

**Аналогично header, создать общий шаблон footer и использовать на всех страницах.**

**Время:** 1 час.

---

### ЭТАП 2: ИНТЕГРАЦИЯ КАТАЛОГА С CRM (приоритет КРИТИЧЕСКИЙ)

**Цель:** Прайс-лист на `/metallokonstrukcii/` подтягивается из CRM.

#### 2.1. Проверить работоспособность CRM API

**Задачи:**

1. **Проверить endpoint вручную:**
   ```bash
   curl https://d5d01eb689qn07cv0ocu.sax5b7yq.apigw.yandexcloud.net/api/catalog
   ```

   Ожидаемый ответ:
   ```json
   [
     {
       "id": "...",
       "name": "Мангал Огонёк",
       "category": "Мангалы",
       "direction": "metall",
       "price": 25000,
       "unit": "шт",
       "description": "...",
       "image": "/img/mangal-ogonek.jpg",
       "featured": true
     },
     ...
   ]
   ```

2. **Если endpoint не отвечает или возвращает ошибку:**
   - Проверить `vlmetal-crm/yandex-cloud/crm-api/index.js`
   - Проверить `vlmetal-crm/yandex-cloud/gateway-spec.yaml`
   - Убедиться, что Cloud Function задеплоена
   - Проверить логи в Yandex Cloud Console

3. **Если endpoint работает, но данных нет:**
   - Зайти в CRM админку (shadcn-admin)
   - Добавить несколько товаров через UI
   - Проверить что они сохраняются в S3 JSON storage
   - Повторно запросить `/api/catalog`

**Время:** 1–2 часа (если API уже работает), 4–6 часов (если нужно чинить backend).

---

#### 2.2. Создать JS модуль для загрузки каталога

**Файл:** `/js/catalog-loader.js`

```javascript
// catalog-loader.js
(function() {
  const API_URL = 'https://d5d01eb689qn07cv0ocu.sax5b7yq.apigw.yandexcloud.net/api/catalog';
  
  async function loadCatalog() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to load catalog');
      const items = await response.json();
      return items;
    } catch (error) {
      console.error('Catalog load error:', error);
      return [];
    }
  }
  
  function renderPriceTable(items, category = null) {
    const filtered = category ? items.filter(i => i.category === category) : items;
    
    let html = `
      <table class="price-table">
        <thead>
          <tr>
            <th>Услуга</th>
            <th>Описание</th>
            <th>Единица</th>
            <th>Цена</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    filtered.forEach(item => {
      html += `
        <tr>
          <td><strong>${item.name}</strong></td>
          <td>${item.description || '—'}</td>
          <td>${item.unit}</td>
          <td>${item.price.toLocaleString('ru-RU')} ₽</td>
        </tr>
      `;
    });
    
    html += '</tbody></table>';
    return html;
  }
  
  window.CatalogLoader = { loadCatalog, renderPriceTable };
})();
```

**Время:** 1–2 часа.

---

#### 2.3. Переделать прайс-лист на `/metallokonstrukcii/`

**Варианты реализации:**

##### Вариант А: Единая таблица (как PDF-прайс)

**HTML:**
```html
<section class="section price-section" id="prices">
  <div class="container">
    <h2>ПРАЙС-ЛИСТ</h2>
    <div id="catalog-container">
      <p>Загрузка...</p>
    </div>
  </div>
</section>

<script src="/js/catalog-loader.js"></script>
<script>
(async function() {
  const container = document.getElementById('catalog-container');
  const items = await CatalogLoader.loadCatalog();
  if (items.length === 0) {
    container.innerHTML = '<p>Не удалось загрузить каталог. Пожалуйста, свяжитесь с нами.</p>';
    return;
  }
  // Группируем по категориям
  const byCategory = {};
  items.forEach(item => {
    if (!byCategory[item.category]) byCategory[item.category] = [];
    byCategory[item.category].push(item);
  });
  
  let html = '';
  Object.keys(byCategory).forEach(category => {
    html += `<h3>${category}</h3>`;
    html += CatalogLoader.renderPriceTable(byCategory[category]);
  });
  
  container.innerHTML = html;
})();
</script>
```

**Плюсы:**
- Простая реализация
- Весь прайс виден сразу (как Excel-лист)
- Можно добавить Ctrl+F поиск по странице

**Минусы:**
- На мобильном может быть длинный скролл
- Если товаров 100+, таблица огромная

---

##### Вариант Б: Табы с категориями (как сейчас), но данные из API

Сохранить текущую табовую структуру, но данные внутри каждого таба рендерить динамически.

**HTML:**
```html
<section class="section price-section" id="prices">
  <div class="container">
    <h2>ПРАЙС-ЛИСТ</h2>
    <div class="price-tabs" role="tablist">
      <button class="price-tab is-active" data-category="all">ВСЕ</button>
      <button class="price-tab" data-category="Мангалы">МАНГАЛЫ</button>
      <button class="price-tab" data-category="Ворота и заборы">ВОРОТА</button>
      <button class="price-tab" data-category="Навесы">НАВЕСЫ</button>
      <button class="price-tab" data-category="Лестницы">ЛЕСТНИЦЫ</button>
      <button class="price-tab" data-category="Работы в цеху">ЦЕХОВЫЕ РАБОТЫ</button>
    </div>
    <div id="catalog-panel" class="price-panel">
      <p>Загрузка...</p>
    </div>
  </div>
</section>

<script src="/js/catalog-loader.js"></script>
<script>
(async function() {
  const panel = document.getElementById('catalog-panel');
  const tabs = document.querySelectorAll('.price-tab');
  const items = await CatalogLoader.loadCatalog();
  
  function showCategory(category) {
    const html = CatalogLoader.renderPriceTable(items, category === 'all' ? null : category);
    panel.innerHTML = html;
  }
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      showCategory(tab.dataset.category);
    });
  });
  
  showCategory('all'); // Показать все при загрузке
})();
</script>
```

**Плюсы:**
- Привычный UX (как сейчас)
- Можно быстро переключаться между категориями
- Меньше скролла

**Минусы:**
- Нужно кликать по табам (чуть сложнее для пользователя)

---

**РЕКОМЕНДАЦИЯ:** Вариант А (единая таблица с группировкой по категориям) — проще, прозрачнее, как PDF-прайс.

**Время:** 2–3 часа.

---

#### 2.4. Добавить fallback для офлайн или ошибок API

**Задачи:**

1. Создать статичный `catalog-fallback.json` в `/data/` с базовым набором товаров
2. Если API не отвечает, подгружать fallback:
   ```javascript
   const items = await CatalogLoader.loadCatalog();
   if (items.length === 0) {
     const fallback = await fetch('/data/catalog-fallback.json').then(r => r.json());
     // render fallback
   }
   ```

**Время:** 1 час.

---

### ЭТАП 3: РЕФАКТОРИНГ И ОПТИМИЗАЦИЯ (приоритет СРЕДНИЙ)

#### 3.1. Вынести общие компоненты (header, footer) в JS-модули или SSI

**Опции:**

##### Опция 1: JavaScript (client-side include)
```javascript
// common-components.js
document.addEventListener('DOMContentLoaded', function() {
  fetch('/includes/header.html').then(r => r.text()).then(html => {
    document.getElementById('header-placeholder').outerHTML = html;
  });
});
```

В каждой странице:
```html
<div id="header-placeholder"></div>
```

**Минус:** FOUC (flash of unstyled content), SEO может пострадать.

---

##### Опция 2: Server-Side Includes (если поддерживается сервером)
```html
<!--#include virtual="/includes/header.html" -->
```

**Минус:** GitHub Pages не поддерживает SSI.

---

##### Опция 3: Build step (например, gulp/webpack)
Собирать HTML из компонентов при деплое.

**Минус:** Нужен build pipeline.

---

**РЕКОМЕНДАЦИЯ:** Для GitHub Pages проще оставить дублирование header/footer, но создать скрипт для автоматической синхронизации (например, Node.js скрипт, который копирует header.html во все страницы перед git push).

**Время:** 3–4 часа (если добавлять build).

---

#### 3.2. Создать `config.json` для глобальных данных

**Файл:** `/data/config.json`

```json
{
  "company": {
    "name": "ООО «Концепция Строительства»",
    "phone": "+79242310478",
    "email": "conceptstroydv@mail.ru",
    "address": "Владивосток, ул. Татарская, 11",
    "inn": "2543151912",
    "ogrn": "1202500020568",
    "hours": {
      "weekdays": "Пн–Пт: 09:00–19:00",
      "saturday": "Сб: 10:00–16:00"
    }
  },
  "social": {
    "telegram": "https://t.me/KCTROOO",
    "whatsapp": "https://wa.me/message/VJAZDFZV5M5SF1"
  }
}
```

Загружать через JS и заполнять footer динамически.

**Время:** 2–3 часа.

---

#### 3.3. Добавить breadcrumbs (хлебные крошки)

**Пример:**
```html
<nav class="breadcrumbs" aria-label="Хлебные крошки">
  <a href="/">Главная</a> / <span>Металлоконструкции</span>
</nav>
```

Добавить на все страницы кроме главной.

**Время:** 1–2 часа.

---

### ЭТАП 4: ТЕСТИРОВАНИЕ И ВАЛИДАЦИЯ (приоритет КРИТИЧЕСКИЙ)

#### 4.1. Проверить все страницы в браузерах

- Chrome/Edge
- Firefox
- Safari (macOS/iOS)
- Mobile (375px, 768px, 1024px)

#### 4.2. Проверить работу всех интерактивных элементов

- [ ] Mobile menu открывается/закрывается
- [ ] Theme toggle переключает тему и сохраняет в localStorage
- [ ] Прайс-лист загружается из API
- [ ] Фильтры/табы на портфолио работают
- [ ] Формы отправляются корректно (если есть)
- [ ] Все ссылки ведут куда надо (нет 404)

#### 4.3. Lighthouse audit

Цели:
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

#### 4.4. Проверить консоль на ошибки

Не должно быть:
- 404 на изображения/шрифты/скрипты
- CORS ошибок
- JS errors

**Время:** 4–6 часов на полное тестирование.

---

## ИТОГОВЫЙ ЧЕКЛИСТ ИСПРАВЛЕНИЙ

### Критические (делать в первую очередь):
- [ ] **1. Связать каталог с CRM** (API + динамический рендер прайса)
- [ ] **2. Унифицировать навигацию** (5 ссылок, одинаковые на всех страницах)
- [ ] **3. Убрать otdelka.css** (мигрировать на общий style.css)
- [ ] **4. Переделать прайс-лист на `/metallokonstrukcii/`** (единая таблица или табы с API)

### Важные (делать после критических):
- [ ] **5. Унифицировать header/footer** (одинаковые на всех страницах)
- [ ] **6. Исправить mobile menu на `/metallokonstrukcii/`**
- [ ] **7. Синхронизировать theme-toggle** (единый скрипт)
- [ ] **8. Добавить active class для навигации** (подсветка текущей страницы)

### Желательные (если останется время):
- [ ] **9. Вынести общие данные в config.json**
- [ ] **10. Добавить breadcrumbs**
- [ ] **11. Оптимизировать изображения** (WebP, lazy loading)
- [ ] **12. Добавить fallback для офлайн (Service Worker или статичный каталог)**

---

## ВРЕМЕННЫЕ ОЦЕНКИ

| Этап | Задачи | Время |
|------|--------|-------|
| **Этап 1: Консистентность дизайна** | Унификация CSS, header, footer, theme-toggle | **8–12 часов** |
| **Этап 2: Интеграция CRM** | API проверка, JS-модуль, переделка прайса | **6–10 часов** |
| **Этап 3: Рефакторинг** | config.json, breadcrumbs, компоненты | **6–8 часов** |
| **Этап 4: Тестирование** | Браузеры, девайсы, Lighthouse, исправления багов | **6–8 часов** |
| **Итого:** | | **26–38 часов** |

**При работе в спринтах по 4 часа в день: 7–10 дней.**

---

## КРИТИЧЕСКИЕ ВОПРОСЫ К ВЛАДЕЛЬЦУ

Перед началом работ нужно **обязательно уточнить** у владельца:

1. **Прайс-лист:** Единая таблица или табы с категориями?
2. **Навигация:** Только 5 страниц в header (без якорей) — правильно?
3. **Отделка:** Убрать желтый accent и вернуть оранжевый (как на всех страницах)?
4. **CRM:** API endpoint `https://d5d01eb689qn07cv0ocu.sax5b7yq.apigw.yandexcloud.net/api/catalog` работает?
5. **Дедлайн:** Когда нужно закончить все исправления?

---

## СЛЕДУЮЩИЙ ШАГ

После согласования с владельцем начинаем с **Этапа 1, пункт 1.1** (унификация CSS и удаление otdelka.css).
