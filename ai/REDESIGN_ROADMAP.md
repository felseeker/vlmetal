# Roadmap полного редизайна

## Stage 0 — правила и опорные решения

- [x] Зафиксировать требования заказчика: умеренная типографика, единый дизайн, два accent-цвета.
- [x] Прочитать `ai/RULES.md`, `ai/ROADMAP.md`.
- [x] Запустить `ui-ux-pro-max --design-system --persist`.
- [x] Проверить Motion MCP и зафиксировать reduced-motion правило.
- [x] Изучить паттерны ведущих строительных сайтов: hero с одним сильным сообщением, разделение services/projects/about, доказательства и CTA.
- [x] Создать `REDESIGN_RULES.md`, `REDESIGN_ARCHITECTURE.md`, этот roadmap.

## Stage 1 — общая оболочка

- [x] Новый спокойный фон без видимой сетки и «швов».
- [x] Новая типографическая шкала без гигантских заголовков.
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
