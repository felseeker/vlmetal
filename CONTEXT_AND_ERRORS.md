# CONTEXT_AND_ERRORS.md — База знаний проекта

## Архитектура проекта

### Общая структура

```
vlmetal/                          # Статический сайт (GitHub Pages)
├── index.html                    # Production главная (НЕ ТРОГАТЬ до approval)
├── style.css                     # Production CSS (НЕ ТРОГАТЬ до approval)
├── img/                          # Общие изображения для всех версий
├── metallokonstrukcii/           # Production страница металла
├── otdelka/                      # Legacy страница отделки (uncommitted changes)
├── portfolio/                    # Production портфолио
├── about/                        # Production about
├── privacy/                      # Production privacy
├── redesign/                     # Изолированный preview НОВОЙ версии
│   ├── index.html                # NEW главная с editorial композицией
│   ├── metallokonstrukcii/index.html
│   ├── otdelka/index.html
│   ├── portfolio/index.html
│   ├── about/index.html
│   ├── privacy/index.html
│   ├── css/site.css              # NEW shared shell
│   ├── js/                       # NEW behaviors
│   └── data/                     # Generated from CRM
├── scripts/
│   ├── sync-content.js           # CRM → website data sync
│   └── validate-content.js       # JSON validation
└── ai/                           # Process documentation
    ├── RULES.md
    ├── ROADMAP.md
    ├── TASTE_AUDIT.md
    ├── TASTE_REDESIGN_PLAN.md
    └── FULL_REDESIGN_EXECUTION_PLAN.md (1302 lines)

vlmetal-crm/                      # CRM Admin (React + Yandex Cloud)
├── shadcn-admin/src/             # React TypeScript frontend
│   ├── features/catalog/         # Catalog CRUD
│   ├── features/portfolio/       # Portfolio CRUD (НОВЫЙ)
│   └── routes/
├── yandex-cloud/
│   ├── crm-api/index.js          # Backend API handler
│   └── gateway-spec.yaml         # API Gateway routes
└── package.json
```

### Текущее состояние (commit `4277c6a`)

- **Production site**: старая версия, работает, не трогается до approval
- **redesign/**: новая изолированная версия с переписанными страницами агентами
- **CRM backend**: portfolio resource добавлен, catalog.unit добавлен
- **CRM frontend**: Portfolio CRUD page добавлена, catalog unit field добавлен
- **Legacy otdelka/**: изменения не закоммичены намеренно

### Технологический стек

| Компонент | Технологии |
|-----------|-----------|
| Website | Vanilla HTML, CSS, JavaScript |
| CRM Frontend | React 18, TypeScript, Vite, TanStack Router, shadcn/ui |
| CRM Backend | Node.js, Yandex Cloud Functions, S3 JSON storage |
| Hosting | GitHub Pages (website), Yandex Cloud (CRM) |
| Analytics | Yandex Metrika, Google Analytics (уже настроены) |
| Fonts | Google Fonts: Poppins, Lato, IBM Plex Mono |

---

## Критические ошибки и решения

### Ошибка 1: Копирование старой структуры с новыми стилями

**Проблема:**
- Первые **ТРИ** итерации редизайна сохранили тот же порядок секций, композицию и логику лендинга
- Каждая версия была технически «новой» (новые CSS классы, новые названия блоков), но визуально повторяла старый паттерн
- Владелец отклонил все три версии: "какого хуя у нас получился тот же сайт блять опять?"

**Причина:**
- Я улучшал существующий дизайн вместо того, чтобы создать новый
- Сохранил архитектуру лендинга: hero → карточки → преимущества → процесс → форма
- Даже когда назвал это "editorial", не изменил главное: композицию страницы и способ подачи информации
- Продолжал «фиксить» и «улучшать» вместо того, чтобы остановиться, выбросить всё и начать с чистого листа

**КРИТИЧЕСКАЯ БЛОКИРОВКА:**

Если можешь описать страницу как "hero → карточки → преимущества → процесс → форма" — работа провалена.

Это не редизайн. Это копия. Так делать **КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО**.

**Правильное решение:**

Не улучшать лендинг. Создать промышленный каталог/архитектурный журнал.

**Главная страница:**
- НЕ hero-блок, а рабочая навигационная панель с двумя направлениями и актуальными объектами
- Split-screen с доминирующим изображением и вертикальной навигационной осью
- Никаких секций «почему мы», «преимущества», «этапы работы»
- Контакты как отдельная страница, не CTA-блок внизу

**Страницы направлений (металл/отделка):**
- Техническое досье, НЕ feature-лендинг
- Таблица услуг с параметрами, не карточки с иконками
- Производственный timeline, не блоки «процесс»
- Меньше маркетинга, больше конкретики (материалы, сроки, параметры)

**Портфолио:**
- Асимметричный фотоархив с разными размерами изображений
- Даты, площади, статусы проектов
- НЕ uniform grid карточек

**Архитектурный тест:**
Удали все стили со старого и нового сайта. Если HTML-структуры похожи — дизайн провален.

**Проверка:**
1. Можно ли описать страницу как вариацию "hero → карточки → преимущества → процесс → форма"? → ПРОВАЛ
2. HTML-структура новой и старой страницы РАДИКАЛЬНО отличаются? → PASS

---

### Ошибка 2: Агенты зависают после получения результата

**Проблема:**
- Task agent вызывает skill/MCP, получает ответ, но execution aborts
- Особенно при вызове `ui-ux-pro-max` или длинных промптах
- Result присутствует, но `task_result` не возвращается

**Причина:**
- Timeout или buffer limit при передаче больших результатов
- Вложенный tool call внутри агента превышает execution window

**Решение:**
- НЕ перезапускай зависшего агента
- Если нужен только output skill — вызови skill напрямую сам
- Если нужна работа агента — продолжи его задачу сам или делегируй другому агенту с меньшей зоной
- Используй `run_in_background: true` только если агент независимый и не ждёшь результат сразу

**Проверка:**
Если агент завис 2 раза на одной задаче — делай её сам, не третий раз через агента.

---

### Ошибка 3: Сервер запускается из `redesign/` root вместо project root

**Проблема:**
- `python -m http.server 8091` запущен из `C:\Users\Михаил\Desktop\vlmetal\redesign`
- Nested pages `metallokonstrukcii/index.html` ссылаются на `../img/hero.jpg`
- Но `../img` не существует от `redesign/` root → 404

**Причина:**
- Попытка избежать создания junction или копирования `img/` в `redesign/img/`
- Неправильное понимание relative paths

**Решение:**
- ВСЕГДА запускай server от project root: `C:\Users\Михаил\Desktop\vlmetal`
- Preview URL: `http://localhost:809X/redesign/`
- Nested pages будут корректно резолвить `../img/` как `vlmetal/img/`
- Не создавай junction/symlink в git tracked directory

**Проверка:**
```powershell
Start-Process powershell -ArgumentList "-NoProfile","-Command","python -m http.server 8094" -WorkingDirectory "C:\Users\Михаил\Desktop\vlmetal"
```

---

### Ошибка 4: Overflow на desktop 1024px из-за header CTA

**Проблема:**
- Desktop navigation + theme toggle + CTA button не помещаются в 1024px
- Горизонтальный overflow 41px
- Header был скрыт только на `max-width: 1000px`, что недостаточно

**Причина:**
- Breakpoint выбран на глаз, не протестирован

**Решение:**
- Изменить media query на `@media (max-width: 1100px)`
- На 1024px показывать mobile menu и скрывать desktop nav/CTA

**Проверка:**
Playwright на width 1024px не должен показывать `overflow: true`.

---

### Ошибка 5: Legacy otdelka закоммичена по ошибке

**Проблема:**
- `otdelka/index.html` и `otdelka/otdelka.css` изменены предыдущей сессией
- Эти изменения не часть текущего redesign плана
- Риск случайного commit

**Причина:**
- `git add .` или `git add -A` захватывает всё

**Решение:**
- ВСЕГДА используй `git add redesign/` для preview изменений
- НИКОГДА не коммить `otdelka/` без явного запроса
- Перед коммитом: `git status --short` и проверь список

**Проверка:**
```bash
git status --short | grep otdelka
```
Если показывает — не добавляй в commit.

---

### Ошибка 6: Grid background потерян при переписывании CSS

**Проблема:**
- Владелец сказал "квадратная/линейная сетка мне нравится"
- При переписывании `site.css` агент/модель убрала `background-image`
- Новая версия без фирменного паттерна

**Причина:**
- "Удалить sparks/glow" интерпретировано как "удалить всю сетку"
- Нет явного "СОХРАНИТЬ grid background" в промпте

**Решение:**
- Grid background обязателен:
```css
body {
  background-color: var(--bg);
  background-image:
    linear-gradient(to right, color-mix(in srgb, var(--line) 42%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--line) 42%, transparent) 1px, transparent 1px);
  background-size: 72px 72px;
}
```
- Это НЕ sparks. Это тонкие статичные линии.
- Не удалять, не заменять, не делать opacity: 0.

**Проверка:**
Открой preview и посмотри — должна быть видимая но неяркая сетка 72×72px.

---

### Ошибка 7: Формы вызывают alert() вместо inline status

**Проблема:**
- Старый `site.js` использовал `alert('Заявка отправлена')`
- Это не accessibility-friendly и не соответствует современным UI паттернам

**Причина:**
- Copy-paste из старого кода

**Решение:**
- Форма должна иметь `<div class="form-status" role="status" aria-live="polite"></div>`
- JS обновляет текст статуса:
```js
statusEl.textContent = 'Заявка отправлена. Мы свяжемся с вами в ближайшее время.';
```
- Никогда `alert()`, `confirm()`, `prompt()`

**Проверка:**
Заполни форму в Playwright, intercept fetch, проверь что status element обновился без alert.

---

### Ошибка 8: Портфолио выглядит как каталог товаров

**Проблема:**
- 3-column равномерный grid
- Одинаковые карточки с border/shadow
- Выглядит как e-commerce, а не portfolio

**Причина:**
- Использование generic `.project-grid { grid-template-columns: repeat(3, 1fr); }`

**Решение:**
- Асимметричная сетка:
```css
.project-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 20px;
}
.project:nth-child(4n+1) {
  grid-column: span 2;
}
```
- Разные aspect ratios изображений: `4:3`, `16:9`, `1:1`
- Minimize decorative borders

**Проверка:**
Скриншот portfolio должен выглядеть как editorial magazine spread, не как Shopify catalog.

---

### Ошибка 9: Отделка как отдельный визуальный язык

**Проблема:**
- Старая `otdelka/otdelka.css` имела `.ot-*` классы, cream-only theme, seam backgrounds
- Это создавало впечатление двух разных сайтов

**Причина:**
- Попытка дифференцировать направления через разные UI patterns

**Решение:**
- Отделка использует ТОТ ЖЕ `redesign/css/site.css`
- Различие ТОЛЬКО через `<html data-direction="otdelka">` → `--accent: #a87800` (amber)
- Header, footer, layout, grid, buttons, forms — идентичны металлу
- Контент и фото отличаются, CSS НЕ отличается

**Проверка:**
```bash
grep -r "\.ot-" redesign/
```
Результат должен быть пустым.

---

### Ошибка 10: CRM endpoint изменён без проверки backend

**Проблема:**
- Frontend форма отправляет на новый URL или с новым payload
- Backend не поддерживает новый контракт → 400/500

**Причина:**
- Изменение frontend без чтения backend handler

**Решение:**
- ТЕКУЩИЙ endpoint: `https://d5d01eb689qn07cv0ocu.sax5b7yq.apigw.yandexcloud.net/api/website-lead`
- ТЕКУЩИЙ payload:
```json
{
  "name": "string",
  "phone": "string",
  "message": "string (может содержать [Direction] prefix)",
  "consent": true
}
```
- НЕ менять без проверки `yandex-cloud/crm-api/index.js` handler
- НЕ добавлять новые поля без backend support

**Проверка:**
Прочитай `yandex-cloud/crm-api/index.js` функцию `handleWebsiteLead` перед изменением форм.

---

## Связи между файлами

### Website → CRM data flow

```
1. Пользователь редактирует каталог в CRM
   ↓
2. CRM сохраняет в S3 JSON (yandex-cloud/crm-api/index.js)
   ↓
3. Build-time: scripts/sync-content.js читает CRM API
   ↓
4. Генерирует redesign/data/catalog.json, portfolio.json
   ↓
5. Website читает JSON и отображает в таблицах/cards
```

### Theme sync flow

```
1. theme-init.js читает localStorage 'site-theme' ДО первого render
   ↓
2. Устанавливает data-theme="light|dark" на <html>
   ↓
3. CSS :root[data-theme="dark"] применяет тёмные токены
   ↓
4. Пользователь кликает [data-theme-toggle]
   ↓
5. site.js переключает theme, обновляет localStorage, data-theme
```

### Form submission flow

```
1. Пользователь заполняет форму [data-lead-form]
   ↓
2. submit event preventDefault
   ↓
3. site.js собирает {name, phone, message, consent}
   ↓
4. fetch POST endpoint
   ↓
5. Backend (yandex-cloud/crm-api) валидирует, сохраняет S3
   ↓
6. Response 200 → .form-status = "Заявка отправлена"
   ↓
7. Response error → .form-status = "Ошибка. Попробуйте позже."
```

### Responsive behavior flow

```
Desktop (>1100px):
  .site-nav visible
  .menu-toggle hidden
  .hero-full-grid две колонки
  .direction-bar-grid две колонки
  .timeline 4 колонки

Tablet (768-1100px):
  .site-nav hidden
  .menu-toggle visible
  .hero-full-grid одна колонка
  .timeline 2 колонки

Mobile (<768px):
  .mobile-nav overlay
  .hero-full-grid одна колонка
  .direction-bar-grid одна колонка
  .facts-bar-grid одна колонка
  .timeline одна колонка
```

---

## Ключевые зависимости

### Website dependencies (CDN/external)

- Google Fonts API: Poppins, Lato, IBM Plex Mono
- Yandex Metrika (если настроен в analytics.js)
- Google Analytics (если настроен в analytics.js)

### CRM dependencies (package.json)

- React 18.3+
- TypeScript 5.x
- Vite 5.x
- TanStack Router 1.x
- shadcn/ui components
- Lucide React icons
- date-fns

### Backend dependencies

- Node.js 18+ runtime (Yandex Cloud)
- S3-compatible storage API

---

## Критические пути файлов

### Если меняешь `redesign/css/site.css`:
- Проверь все 6 HTML страниц используют новые классы
- Проверь responsive на 375/768/1024/1440
- Проверь light и dark theme
- Проверь grid background сохранён

### Если меняешь `redesign/js/site.js`:
- Проверь theme toggle работает
- Проверь mobile menu работает
- Проверь tabs работают (metallokonstrukcii price)
- Проверь filters работают (portfolio)
- Проверь forms не вызывают alert
- Проверь reveal animations с reduced-motion

### Если меняешь любой `redesign/*/index.html`:
- Проверь relative paths `../img/`, `../css/site.css?v=1`, `../js/site.js`
- Проверь один h1 на страницу
- Проверь .site-header и .site-footer идентичны на всех страницах
- Проверь форма имеет data-lead-form и consent

### Если меняешь CRM backend:
- `node --check yandex-cloud/crm-api/index.js`
- Проверь ALLOWED resources включает новый resource
- Проверь validation logic
- НЕ деплой без явного approval

### Если меняешь CRM frontend:
- `cd shadcn-admin && npm run build`
- Проверь TypeScript errors = 0
- Проверь route tree regenerated
- Проверь navigation item добавлен в config

---

## Неочевидные правила

1. **Windows PowerShell LF/CRLF warnings игнорируются.** Это косметика, не блокер.

2. **`git diff --check` warnings про LF не фатальны.** Коммитить можно.

3. **Taste Skill clone в `temp-taste-skill/` удалён после изучения.** Правила перенесены в план, сам репо не нужен в рабочем дереве.

4. **Junction `redesign/img` не коммитится.** Он для локального сервера, в git не попадает.

5. **Старый порт 8080 может отдавать старый сайт.** Всегда используй новый порт для preview и явно указывай `/redesign/`.

6. **Agent Task с `run_in_background: false` ждёт завершения.** С `true` — запускается и отдаёт control сразу. Используй `true` только если не нужен immediate result.

7. **Playwright `waitUntil: 'networkidle'` может timeout на внешние шрифты/аналитику.** Используй `'domcontentloaded'` для QA.

8. **CRM build warnings про failing tests — expected.** 19 failed tests в unrelated modules не блокируют feature.

9. **Незакоммиченные `otdelka/` изменения — норма.** Не stage их случайно.

10. **FULL_REDESIGN_EXECUTION_PLAN.md 1302 строки.** Это не ошибка, это полный checklist.
