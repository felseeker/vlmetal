# AI Rules — сайт «Концепция строительства» (концепция-строительства.рф)

Эта папка — точка входа для ИИ-агента (opencode / Claude Code / Cursor и т.д.), который работает над этим сайтом.

**Скажи агенту в начале нового чата:**

> Прочитай ai/RULES.md и работай по нему

## Что внутри

- `RULES.md` — главный файл правил: какие навыки использовать, что за проект, ограничения, чек-листы.
- `seo/CHECKLIST.md` — SEO-чеклист под этот конкретный сайт (локальный бизнес, Владивосток, статический HTML).
- `REDESIGN_RULES.md` — обязательные визуальные и UX-правила полного редизайна.
- `REDESIGN_ARCHITECTURE.md` — архитектура пяти страниц, shared-компонентов и будущего CRM sync.
- `REDESIGN_ROADMAP.md` — пошаговый план полного редизайна и QA-gates.
- `TASTE_REDESIGN_PLAN.md` — обязательный anti-slop план с dials, layout grammar, motion и CRM-ограничениями.
- `TASTE_AUDIT.md` — аудит, почему прошлые версии визуально не отличались от старого сайта.

## External design skills researched

- Taste Skill: `https://github.com/Leonxlnx/taste-skill`.
- Relevant install names: `design-taste-frontend`, `redesign-existing-projects`, `high-end-visual-design`.
- Taste MCP: `https://github.com/with0utwhy/taste-mcp` — hosted paid human review; не использовать без отдельного согласия на оплату.

## Кратко о проекте

Статический сайт (HTML/CSS/JS, без фреймворков и сборки) для ООО «Концепция Строительства» — два направления бизнеса: металлоконструкции и внутренняя отделка. Хостится на GitHub Pages (см. `CNAME`), домен на кириллице (punycode `xn----8sbfkbqbmookekqofldd0ec6lnc.xn--p1ai`).
