# Roadmap полного редизайна

## Рабочий режим

Новая версия сначала создаётся изолированно в `redesign/`. Старый корень сайта не используется как источник CSS и не заменяется до визуального одобрения владельца проекта.

## Stage 0 — правила и опорные решения

- [x] Зафиксировать требования заказчика: умеренная типографика, единый дизайн, два accent-цвета.
- [x] Прочитать `ai/RULES.md`, `ai/ROADMAP.md`.
- [x] Запустить `ui-ux-pro-max --design-system --persist`.
- [x] Проверить Motion MCP и зафиксировать reduced-motion правило.
- [x] Изучить паттерны ведущих строительных сайтов: hero с одним сильным сообщением, разделение services/projects/about, доказательства и CTA.
- [x] Создать `REDESIGN_RULES.md`, `REDESIGN_ARCHITECTURE.md`, этот roadmap.
- [x] Подтвердить CRM-контракт заявок: `POST /api/website-lead`, payload `name`, `phone`, `message`, `consent`; направление сохраняется в префиксе сообщения.
- [x] Найти существующий CRM-каталог: `vlmetal-crm/data/catalog.json` и `public/data/catalog.json`.

## Stage 1 — изолированная общая оболочка

- [ ] Создать `redesign/`, который не наследует старый `style.css`.
- [ ] Новый спокойный фон без видимой сетки и «швов».
- [ ] Новая типографическая шкала без гигантских заголовков.
- [ ] Единый header desktop/mobile на всех страницах.
- [ ] Единый footer на всех страницах.
- [ ] Единые buttons, cards, section headings, forms.
- [ ] Проверка light/dark и контраста.

## Stage 2 — страницы направлений

- [ ] Пересобрать главную как хаб, убрать дублирование полного каталога.
- [ ] Пересобрать hero металла и отделки в одном grid-паттерне.
- [ ] Перевести `otdelka` с параллельной системы `.ot-*` на shared components.
- [ ] Сохранить жёлтый accent только через `data-direction="otdelka"`.
- [ ] Проверить честность текстов и изображений отделки.

### Текущий изолированный MVP

- [x] Создан изолированный сайт в `redesign/` с шестью статическими страницами, общим `site.css` и `site.js`.
- [x] CRM contract формы сохранён: `website-lead`, поля `name`, `phone`, `message`, `consent`.
- [x] Локальные `catalog.json` и `portfolio.json` подготовлены для будущего build-time sync.
- [x] Добавлен локальный `scripts/sync-content.js` с режимом `--local`, без деплоя.
- [x] В CRM API добавлен resource `portfolio`, validation `catalog.unit` и Gateway routes; деплой не выполнялся.
- [x] В CRM добавлен Portfolio CRUD route/module и пункт навигации; CRM production не изменялся.

## Stage 3 — данные и портфолио

- [ ] Вынести 40 позиций металла из HTML в структурированный источник данных.
- [ ] Создать единый компонент tabs + price tables для металла и отделки.
- [ ] Перенести visual cases в portfolio.
- [ ] Добавить проектные поля, удобные для будущего CRM sync.
- [ ] Добавить доступные project details.

## Stage 4 — motion и polish

- [ ] Hero reveal и image treatment без агрессивных эффектов.
- [ ] Stagger для карточек и списков.
- [ ] Spring hover только на CTA и project cards.
- [ ] Scroll reveal с паузой/отключением для reduced motion.
- [ ] Проверить отсутствие layout shift и jank.

## Stage 5 — SEO, QA, checkpoint

- [ ] Прогнать SEO checklist для всех пяти страниц.
- [ ] Проверить JSON-LD через JSON.parse и validator.schema.org.
- [ ] Playwright matrix: 5 страниц × 4 ширины × 2 темы.
- [ ] Проверить keyboard navigation, focus, forms, menu, filters.
- [ ] Создать локальный checkpoint-коммит на русском.
- [ ] Не push без явного запроса.

## Stage 6 — CRM admin

- [ ] Уточнить API и ресурсы catalog/portfolio в `vlmetal-crm`.
- [ ] Добавить `unit` в catalog.
- [ ] Добавить portfolio resource и CRM UI.
- [ ] Создать build-time sync script.
- [ ] Генерировать HTML/JSON-LD/WebP из данных CRM.
