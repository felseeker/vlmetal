# Полный исполнительный план редизайна

Версия: 1.0
Статус: обязательный план для следующей исполнительной ИИ
Проект: ООО «Концепция Строительства», Владивосток
Стек сайта: HTML, CSS, vanilla JavaScript, GitHub Pages
Стек CRM: React, TypeScript, Vite, TanStack Router, Yandex Cloud Functions, S3 JSON
Режим: локальная разработка, без release и без push до письменного одобрения владельца

## 00. Краткое резюме

1. Текущий сайт технически работает.
2. Текущий сайт визуально не устраивает владельца.
3. Первая попытка редизайна повторила старую структуру.
4. Вторая попытка в `redesign/` стала проще, но не стала новой по визуальной грамматике.
5. Нельзя продолжать наращивать старый CSS.
6. Нельзя просто менять цвета и шрифты.
7. Нельзя повторять старые секции в том же порядке.
8. Следующий редизайн должен быть спроектирован как новая система.
9. Сначала делается изолированный preview.
10. Preview открывается с отдельного localhost root.
11. Старый сайт остаётся доступен для сравнения.
12. Production root не заменяется до approval.
13. CRM расширяется параллельно.
14. CRM production не деплоится без отдельного запроса.
15. Реальные заявки в QA не отправляются.

## 01. Подтверждённые требования владельца

1. Визуальное направление: гибрид.
2. Главная должна быть премиальной и продающей.
3. Страница металла должна показывать производство.
4. Страница отделки должна быть современной и спокойной.
5. Портфолио должно быть фотоцентричным.
6. О компании должна включать контакты.
7. Контакты не нужны отдельной страницей.
8. Калькулятор стоимости не нужен.
9. Онлайн-чат пока не нужен.
10. Ссылки на мессенджеры нужны.
11. Фотографии берём с текущего сайта.
12. Новые фотографии позже добавляются через CRM.
13. Прайс должен редактироваться в CRM.
14. Портфолио должно редактироваться в CRM.
15. Полную админку текстов можно расширить позже.
16. Форма заявок не должна ломаться.
17. Старый endpoint формы нельзя менять без проверки.
18. Публикация не выполняется автоматически.
19. Push не выполняется автоматически.
20. Перед release создаётся backup.

## 02. Главная ошибка предыдущих итераций

1. Старый hero был сохранён.
2. Старые размеры были сохранены.
3. Старые карточки были сохранены.
4. Старый порядок секций был сохранён.
5. Старый dark industrial фон был сохранён.
6. Добавился только новый CSS override.
7. Override конфликтовал с существующим CSS.
8. `otdelka` продолжала жить в отдельной системе.
9. Portfolio выглядел как ещё один каталог карточек.
10. Заголовки оставались oversized.
11. Повторялись `eyebrow + h2 + cards`.
12. Motion был декоративным, а не композиционным.
13. Результат выглядел как упрощённая копия.
14. Это запрещено в новой итерации.

## 03. Документы перед кодом

1. Прочитать `ai/RULES.md`.
2. Прочитать `ai/ROADMAP.md`.
3. Прочитать `ai/TASTE_AUDIT.md`.
4. Прочитать `ai/TASTE_REDESIGN_PLAN.md`.
5. Прочитать этот файл целиком.
6. Прочитать `ai/REDESIGN_ARCHITECTURE.md`.
7. Прочитать `ai/REDESIGN_RULES.md`.
8. Прочитать `redesign/README.md`.
9. Прочитать CRM `ROADMAP.md`.
10. Прочитать CRM API handler.
11. Прочитать CRM catalog types.
12. Прочитать CRM catalog UI.
13. Прочитать текущие формы сайта.
14. Прочитать текущие JSON-LD блоки.
15. Прочитать SEO checklist.

## 04. Skills и MCP

1. Использовать `ui-ux-pro-max`.
2. Использовать генератор design-system.
3. Использовать `motion` skill.
4. Выполнить Motion documentation search перед каждой новой animation family.
5. Изучить Taste Skill v2.
6. Применять `design-taste-frontend`.
7. Применять `redesign-existing-projects`.
8. Применять `high-end-visual-design` выборочно.
9. Не смешивать brutalist rules с premium rules без решения.
10. Использовать Playwright MCP.
11. Использовать Playwright после каждого крупного блока.
12. Использовать webfetch для референсов.
13. Использовать Task agents для независимого исследования.
14. Использовать TodoWrite.
15. Использовать git checkpoints.
16. Не использовать платный Taste MCP без explicit approval.
17. Не устанавливать blockchain или x402 зависимости.
18. Не устанавливать framework для сайта.
19. Не устанавливать Tailwind в сайт.
20. Не использовать emoji как UI icons.

## 05. Design Read

Reading this as: trust-first local construction website for private clients and small B2B buyers, with a contemporary architectural language, asymmetric editorial compositions, real project evidence, and restrained production details.

1. Audience: homeowner.
2. Audience: small business owner.
3. Audience: procurement/contact person.
4. Desired feeling: competent.
5. Desired feeling: calm.
6. Desired feeling: accountable.
7. Desired feeling: visually memorable.
8. Avoid feeling: cheap template.
9. Avoid feeling: gaming interface.
10. Avoid feeling: AI-generated landing.
11. Avoid feeling: factory dashboard.
12. Avoid feeling: generic renovation marketplace.

## 06. Taste dials

1. `DESIGN_VARIANCE = 8`.
2. `MOTION_INTENSITY = 6`.
3. `VISUAL_DENSITY = 4`.
4. Variance means asymmetric sections.
5. Variance means mixed image ratios.
6. Variance means editorial offsets.
7. Variance does not mean random chaos.
8. Motion means staged entry.
9. Motion means image masks.
10. Motion means tactile CTA.
11. Motion does not mean infinite animation.
12. Density 4 means generous whitespace.
13. Density 4 means short copy.
14. Density 4 means no crowded hero.

## 07. Chosen visual system

1. Base family: architectural editorial.
2. Secondary family: measured industrial.
3. Layout foundation: Swiss grid.
4. Layout behavior: asymmetric editorial split.
5. Surface family: paper, steel, graphite.
6. Primary light background: cool off-white.
7. Secondary light background: concrete grey.
8. Primary dark background: graphite charcoal.
9. Secondary dark background: steel charcoal.
10. Text: charcoal in light mode.
11. Text: warm white in dark mode.
12. Metal accent: burnt safety orange.
13. Otdelka accent: muted amber.
14. Accent saturation: restrained.
15. Accent must not become glow everywhere.
16. Shadows must be tinted and subtle.
17. Borders must be used sparingly.
18. Radius scale must be consistent.
19. Buttons may have a compact radius.
20. Project surfaces may use a larger radius.
21. No arbitrary mixed radii.
22. No full-page grid background.
23. No sparks.
24. No purple gradients.
25. No neon glow.
26. No fake blueprint texture everywhere.

## 08. Typography system

1. Use one display family.
2. Use one body family.
3. Do not use random serif emphasis.
4. Do not use Inter by default without reason.
5. Candidate display: Outfit.
6. Candidate display: Poppins.
7. Candidate body: Lato.
8. Candidate body: Open Sans.
9. Existing Montserrat is acceptable fallback.
10. Existing Rajdhani is not the primary display by default.
11. Body text must be 16-18px.
12. Body line-height must be 1.5-1.65.
13. Paragraph max width 65ch.
14. H1 desktop range 48-64px.
15. H1 tablet range 40-52px.
16. H1 mobile range 32-40px.
17. H1 maximum two lines desktop.
18. H1 maximum three lines mobile.
19. H2 desktop range 32-44px.
20. H2 mobile range 28-34px.
21. H3 range 20-28px.
22. Metadata range 11-13px.
23. Metadata may use uppercase.
24. Long headings use sentence case.
25. Buttons use short labels.
26. Buttons must not wrap.
27. Use `text-wrap: balance` where supported.
28. Use `overflow-wrap: anywhere` for long company names.
29. Use tabular numerals for stats/prices.
30. Test font rendering on Windows Chromium.

## 09. Global layout rules

1. Max content width: 1180-1240px.
2. Desktop side padding: 32-48px.
3. Tablet side padding: 24px.
4. Mobile side padding: 16-20px.
5. Header height: 64-76px.
6. Hero top padding: maximum 96px after header.
7. Hero CTA visible in first viewport.
8. Hero image visible in first viewport.
9. Hero copy maximum 20 words where possible.
10. Every page needs a clear next action.
11. Use CSS Grid for primary layouts.
12. Use flex only for inline groups.
13. Do not use percentage flex math.
14. Do not use `height: 100vh`.
15. Use `min-height: 100dvh` only when justified.
16. Keep sections visually distinct without random dark bands.
17. Vary layout family per section.
18. Do not use the same grid twice consecutively.
19. Do not use more than one repeated card row per page.
20. Use lists/dividers where cards are unnecessary.

## 10. Homepage architecture

1. Header.
2. Split editorial hero.
3. One short trust statement.
4. Direction switcher with two unequal visual panels.
5. Selected project editorial spread.
6. Process timeline.
7. Compact proof list.
8. One CTA/contact area.
9. Footer.

Homepage must not contain:

1. Full metal catalog.
2. Full renovation price list.
3. Six feature cards.
4. Repeated trust promises.
5. Long FAQ before first CTA.
6. Multiple carousels.
7. Infinite marquee.
8. Full-screen sparks.

Hero requirements:

1. Left text block.
2. Right image block.
3. One eyebrow maximum.
4. H1 maximum two lines.
5. Subcopy maximum four lines.
6. Primary CTA: `Обсудить проект`.
7. Secondary CTA: `Смотреть работы`.
8. Small metadata below, not inside headline.

## 11. Metal page architecture

1. Header shared.
2. Industrial hero with workshop/project image.
3. Short service list.
4. Price tabs.
5. Production timeline.
6. Selected metal projects.
7. Materials/guarantee facts.
8. Lead form.
9. FAQ.
10. Footer shared.

Service list categories:

1. Ворота и заборы.
2. Навесы.
3. Лестницы.
4. Мангалы.
5. Резка и сварка.
6. Индивидуальные конструкции.

Metal page accent rules:

1. Orange accent only.
2. No yellow accent on metal page.
3. No purple or blue CTA.
4. Table price uses orange emphasis.
5. Workshop image appears before price.
6. Project proof appears after process.

## 12. Otdelka page architecture

1. Header shared.
2. Calm split hero.
3. Formats of work list.
4. Price tabs.
5. Process timeline.
6. Honest existing project photos.
7. Materials and budget explanation.
8. Lead form for free measurement.
9. FAQ.
10. Footer shared.

Otdelka accent rules:

1. Amber accent only.
2. No separate visual namespace.
3. No cream-only alternate site.
4. No decorative seams.
5. No unreadable muted text.
6. Do not call a tambour a full apartment renovation.
7. Label entrance zones honestly.
8. Prepare fields for future photos.

## 13. Portfolio architecture

1. Short hero.
2. Filter controls.
3. Asymmetric archive.
4. Mixed image ratios.
5. Category label.
6. Project title.
7. One-line outcome.
8. Optional detail panel.
9. CTA to form.
10. Footer.

Portfolio must not look like:

1. SaaS cards.
2. Product catalogue.
3. Three identical columns.
4. Decorative photo wallpaper.
5. Fake case studies.

## 14. About and contacts architecture

1. Short company hero.
2. Narrative block with workshop photo.
3. Plain facts row.
4. Process timeline.
5. Contact block.
6. Address.
7. Phone.
8. Email.
9. Telegram.
10. WhatsApp.
11. MAX.
12. Working hours.
13. Map link or map block.
14. Requisites.
15. Lead form.
16. Footer.

Do not invent:

1. Foundation year.
2. Team members.
3. Review percentages.
4. Warranty duration not present in source.
5. Number of specialists.
6. Certifications.

## 15. Shared header specification

Required structure:

1. `<header class="site-header">`.
2. `.site-header__inner`.
3. `.brand`.
4. `.site-nav`.
5. `.theme-toggle`.
6. `.header-cta`.
7. `.menu-toggle`.
8. `.mobile-menu`.

Navigation labels:

1. Главная.
2. Металлоконструкции.
3. Внутренняя отделка.
4. Примеры работ.
5. О компании.
6. Контакты.

Header tests:

1. Same DOM classes on all pages.
2. Same order on all pages.
3. Same logo dimensions.
4. Active item is exposed.
5. Mobile menu opens at 375px.
6. Menu closes after link click.
7. Escape closes menu if overlay mode used.
8. Theme toggle keeps localStorage key `site-theme`.
9. Header does not wrap at 1024px.
10. Header does not cover focused element.

## 16. Shared footer specification

1. Same DOM classes on all pages.
2. Contact column.
3. Navigation column.
4. Messenger column.
5. Legal/requisites column.
6. Phone link.
7. Email link.
8. Telegram link.
9. WhatsApp link.
10. MAX link.
11. Privacy link.
12. Legal company name.
13. No fake social links.
14. No duplicated footer variants.

## 17. Forms and CRM contract

Current endpoint:

`https://d5d01eb689qn07cv0ocu.sax5b7yq.apigw.yandexcloud.net/api/website-lead`

Payload:

```json
{
  "name": "string",
  "phone": "string",
  "message": "[Direction] string",
  "consent": true
}
```

Required form behavior:

1. Real labels above fields.
2. Native required validation.
3. Phone input type tel.
4. Consent required.
5. Inline loading state.
6. Inline success state.
7. Inline error state.
8. No `alert()`.
9. Disable duplicate submit.
10. Keep entered data on error.
11. Never send a test lead in QA.
12. Intercept `fetch` in Playwright.
13. Verify payload locally.
14. Test endpoint only after explicit user decision.

## 18. Content data contract

Catalog fields:

1. `id`.
2. `name`.
3. `category`.
4. `direction`.
5. `price`.
6. `unit`.
7. `description`.
8. `image`.
9. `alt`.
10. `featured`.

Portfolio fields:

1. `id`.
2. `title`.
3. `category`.
4. `direction`.
5. `images[]`.
6. `description`.
7. `date`.
8. `featured`.
9. `alt`.
10. `location` if confirmed.
11. `materials` if confirmed.
12. `priceFrom` only if confirmed.

Validation:

1. Catalog name required.
2. Catalog price required.
3. Catalog unit from allowlist.
4. Portfolio title required.
5. Portfolio direction from allowlist.
6. Portfolio images must be array.
7. Portfolio alt required for published project.
8. Date must be ISO or empty.
9. No invented data in sync.

## 19. CRM backend tasks

1. Add `portfolio` to ALLOWED resources.
2. Add portfolio storage through existing JSON helpers.
3. Normalize catalog `unit`.
4. Validate catalog required fields.
5. Normalize portfolio direction.
6. Limit portfolio image count.
7. Limit title length.
8. Limit description length.
9. Preserve JWT authentication.
10. Preserve rate limiting.
11. Preserve CORS behavior.
12. Do not change website-lead behavior.
13. Add Gateway `/api/portfolio` GET/POST.
14. Add Gateway `/api/portfolio/{id}` GET/PUT/DELETE.
15. Do not deploy Gateway locally.
16. Validate Node syntax.
17. Add API unit tests if harness exists.

## 20. CRM catalog UI tasks

1. Extend Product type with optional `unit` for backward compatibility.
2. Display unit in product detail.
3. Add unit select to edit form.
4. Allowed unit `шт`.
5. Allowed unit `м²`.
6. Allowed unit `м.п.`.
7. Allowed unit `точка`.
8. Allowed unit `услуга`.
9. Allowed unit `компл.`.
10. Default unit `шт`.
11. Preserve old catalog records.
12. Preserve photo upload.
13. Preserve favorites.
14. Preserve compare.
15. Build CRM after change.

## 21. CRM portfolio UI tasks

1. Add `features/portfolio/portfolio-page.tsx`.
2. Add `features/portfolio/index.ts`.
3. Add authenticated route.
4. Regenerate route tree through Vite plugin.
5. Add navigation item.
6. Add permission entries.
7. Load data through `apiFetch`.
8. Show empty state.
9. Show loading state.
10. Show error state.
11. Add direction filter.
12. Add category filter.
13. Add featured badge.
14. Add create form.
15. Add edit form.
16. Add delete confirmation.
17. Add multiple image upload.
18. Limit uploads to five.
19. Use `/api/upload`.
20. Preserve audit logging.
21. Preserve role permissions.
22. Build with TypeScript.
23. Test route loads.
24. Test CRUD with mocked apiFetch.

## 22. Build-time sync tasks

1. Add `scripts/sync-content.js`.
2. Require `CRM_SYNC_TOKEN` for remote mode.
3. Support `--local` mode.
4. Fetch catalog with Bearer token.
5. Fetch portfolio with Bearer token.
6. Normalize catalog.
7. Normalize portfolio.
8. Validate all records.
9. Write redesign data files.
10. Never write secrets.
11. Never deploy.
12. Never call from browser.
13. Add `scripts/validate-content.js`.
14. Check required fields.
15. Check allowed units.
16. Check allowed directions.
17. Check image arrays.
18. Exit non-zero on invalid data.
19. Print counts.
20. Print explicit no-deploy message.

## 23. Motion implementation

Before animation code:

1. Call Motion MCP search.
2. Search exact pattern.
3. Record returned guidance.
4. Choose one reveal family.
5. Choose one hover family.
6. Choose one menu family.
7. Generate CSS spring curve.
8. Test reduced motion.

Animation families:

1. Hero text mask reveal.
2. Hero image clip reveal.
3. Project archive stagger.
4. Mobile menu link cascade.
5. CTA press spring.
6. Filter underline transition.
7. Price row fade.
8. FAQ transition only if accessible.

Forbidden motion:

1. Infinite sparks.
2. Infinite marquee.
3. Auto carousel without pause.
4. Scroll event layout reads.
5. Animating width.
6. Animating height for reveal.
7. Animating top/left.
8. Excessive blur.
9. Parallax on mobile.
10. Animation required to understand content.

## 24. Taste preflight

Run before each major page:

1. State the Design Read.
2. State the three dials.
3. Name the selected vibe archetype.
4. Name the selected layout archetype.
5. List the anti-patterns intentionally avoided.
6. Confirm the page is not using old section order.
7. Confirm the page has a unique composition.
8. Confirm the hero copy is short.
9. Confirm the CTA is visible above the fold.
10. Confirm one primary CTA intent.
11. Confirm body text measure.
12. Confirm no repeated eyebrow rhythm.
13. Confirm no duplicate card row.
14. Confirm one accent per page.
15. Confirm image assets are honest.
16. Confirm empty/loading/error states.
17. Confirm keyboard focus.
18. Confirm mobile collapse.
19. Confirm reduced motion.
20. Confirm no placeholder copy.

## 25. Implementation order

1. Create backup checkpoint.
2. Freeze old root files.
3. Create isolated preview root.
4. Inventory assets.
5. Copy source data into typed local data.
6. Build tokens.
7. Build shared header.
8. Build shared footer.
9. Build shared lead form.
10. Build homepage composition.
11. Run Playwright homepage review.
12. Build metal page composition.
13. Run Playwright metal review.
14. Build otdelka page composition.
15. Run Playwright otdelka review.
16. Build portfolio archive.
17. Run Playwright portfolio review.
18. Build about/contact page.
19. Run Playwright about review.
20. Add privacy page.
21. Add JSON-LD.
22. Add SEO metadata.
23. Add analytics without duplication.
24. Add motion after static layout is approved internally.
25. Add CRM content sync.
26. Add CRM portfolio UI.
27. Build CRM.
28. Run full matrix.
29. Create screenshot set.
30. Ask owner to review preview.
31. Do not migrate root until approval.

## 26. Asset audit tasks

1. List every image in `img/`.
2. Group images by `hero`, `gal`, `mangal`, `vorota`, `naves`, `lestnica`, `lowrise`, `other`, `port`.
3. Record dimensions.
4. Record file sizes.
5. Select one LCP image per page.
6. Generate WebP only when source is real.
7. Keep JPG fallback.
8. Add width/height to every image.
9. Add lazy loading below fold.
10. Add fetchpriority high only to LCP.
11. Write honest alt text.
12. Do not use AI-generated project photos as completed work.
13. Do not use stock photos as customer cases.
14. Do not call an entrance zone an apartment renovation.
15. Add future `images[]` fields for CRM.

## 27. SEO checklist tasks

1. Read `ai/seo/CHECKLIST.md`.
2. Unique title per page.
3. Description 150-160 characters where possible.
4. Canonical uses punycode.
5. OG title exists.
6. OG description exists.
7. OG image exists.
8. OG URL uses punycode.
9. JSON-LD validates with JSON.parse.
10. JSON-LD matches visible content.
11. LocalBusiness data remains consistent.
12. BreadcrumbList exists on inner pages.
13. FAQPage only when FAQ is visible.
14. Portfolio uses CollectionPage or ItemList.
15. About uses AboutPage/Organization.
16. Sitemap includes new pages.
17. Robots points to sitemap.
18. No Unicode absolute domain URLs.
19. No fake reviews or claims.
20. No accidental test URLs.

## 28. Accessibility tasks

1. One H1 per page.
2. Logical heading hierarchy.
3. Skip link.
4. Header nav label.
5. Mobile menu aria-expanded.
6. Theme toggle aria-label.
7. Tabs use tablist/tab/tabpanel.
8. Filters expose selected state.
9. FAQ uses aria-expanded and aria-controls.
10. Form labels are visible or properly sr-only.
11. Error text is inline.
12. Success text uses aria-live.
13. Focus-visible is obvious.
14. Touch target minimum 44px.
15. Contrast measured in light theme.
16. Contrast measured in dark theme.
17. Decorative images use empty alt.
18. Meaningful images use descriptive alt.
19. No color-only meaning.
20. Reduced motion renders final state.

## 29. Local QA matrix

1. Start server from preview root.
2. Use separate port from old site.
3. Verify root HTML is preview HTML.
4. Verify CSS URL is preview CSS.
5. Test 375px.
6. Test 768px.
7. Test 1024px.
8. Test 1440px.
9. Test light theme.
10. Test dark theme.
11. Test fresh localStorage.
12. Test stored theme.
13. Test menu open.
14. Test menu close.
15. Test active nav.
16. Test tabs.
17. Test filters.
18. Test FAQ.
19. Test form validation.
20. Intercept form fetch.
21. Assert payload.
22. Do not let fetch reach production in tests.
23. Check console errors.
24. Check network 404.
25. Check images naturalWidth.
26. Check overflow.
27. Check H1 count.
28. Check header count.
29. Check footer count.
30. Check focus.

## 30. CRM QA matrix

1. `node --check` backend.
2. Validate ALLOWED resource.
3. Validate catalog unit.
4. Validate portfolio direction.
5. Validate portfolio images.
6. Verify invalid unit rejects.
7. Verify missing catalog name rejects.
8. Verify missing catalog price rejects.
9. Verify missing portfolio title rejects.
10. Verify empty portfolio list is safe.
11. Build CRM TypeScript.
12. Generate route tree through Vite.
13. Load portfolio route.
14. Verify navigation item.
15. Verify role permissions.
16. Verify upload uses existing endpoint.
17. Verify audit log call.
18. Verify sync local mode.
19. Verify sync remote requires token.
20. Verify sync performs no deploy.

## 31. Release gate

Release is forbidden until all items pass:

1. Owner explicitly approves preview.
2. Owner confirms final visual direction.
3. Root replacement plan reviewed.
4. Backup commit created.
5. Backup tag created locally.
6. No secrets in git diff.
7. No real test leads in CRM.
8. All five page routes work.
9. Privacy route works.
10. Analytics preserved.
11. JSON-LD valid.
12. Sitemap updated.
13. Robots valid.
14. Playwright matrix passes.
15. CRM build passes.
16. Content validation passes.
17. Sync dry run passes.
18. User explicitly says release.
19. User explicitly says push if push is wanted.
20. Only then may root files be replaced.

## 32. Do not do list

1. Do not push.
2. Do not deploy Yandex Cloud.
3. Do not modify CNAME.
4. Do not delete old backup.
5. Do not delete old root before approval.
6. Do not send real form submissions.
7. Do not add credentials.
8. Do not use Taste paid MCP.
9. Do not install x402 wallet tools.
10. Do not add React to the static site.
11. Do not add a build system to the static site.
12. Do not use emoji icons.
13. Do not use default AI purple gradient.
14. Do not use full-page mesh.
15. Do not use repeating three-card sections.
16. Do not use giant four-line hero copy.
17. Do not use placeholder testimonials.
18. Do not invent dates.
19. Do not claim missing interior photos are apartment renovations.
20. Do not call a plan complete without local verification.

## 33. File ownership map

1. `redesign/` is the isolated preview root.
2. `redesign/css/` contains only preview CSS.
3. `redesign/js/` contains only preview JavaScript.
4. `redesign/data/` contains generated preview data.
5. `scripts/sync-content.js` owns remote content download.
6. `scripts/validate-content.js` owns local content validation.
7. Root `index.html` is production candidate and is frozen until approval.
8. Root `style.css` is production candidate and is frozen until approval.
9. `otdelka/otdelka.css` is legacy and must not become the foundation of the new preview.
10. CRM `shadcn-admin` owns authenticated content editing.
11. CRM `yandex-cloud/crm-api/index.js` owns API validation.
12. Gateway YAML owns deployed route declaration.
13. `sitemap.xml` owns crawler page inventory.
14. `robots.txt` owns crawler access policy.
15. `ai/` owns process documentation.

## 34. Checkpoint policy

1. Create checkpoint before preview rewrite.
2. Create checkpoint after design tokens.
3. Create checkpoint after shared shell.
4. Create checkpoint after homepage.
5. Create checkpoint after metal page.
6. Create checkpoint after otdelka page.
7. Create checkpoint after portfolio.
8. Create checkpoint after about page.
9. Create checkpoint after CRM backend.
10. Create checkpoint after CRM frontend.
11. Create checkpoint after QA.
12. Commit messages are in Russian.
13. Commits contain only intended files.
14. Never amend a failed checkpoint.
15. Never reset hard.
16. Never revert user changes without asking.
17. Inspect status before each checkpoint.
18. Inspect diff before each checkpoint.
19. Inspect recent log before each checkpoint.
20. Tags are local unless user asks push.

## 35. Reference research protocol

1. Research at least five construction or architecture sites.
2. Research at least two local contractor sites.
3. Record URLs in the design notes.
4. Record hero composition.
5. Record navigation density.
6. Record project presentation.
7. Record service presentation.
8. Record CTA language.
9. Record footer density.
10. Record mobile behavior.
11. Do not copy branding.
12. Do not copy proprietary content.
13. Extract patterns, not screenshots.
14. Prefer real site patterns over AI assumptions.
15. Reject any reference that looks like generic template marketplace.
16. Compare results against Taste anti-slop rules.
17. Summarize research before implementation.
18. Link research from `ai/`.
19. Keep reference conclusions short.
20. Do not install an external library solely because a reference uses it.

## 36. Content editing protocol

1. Every new text must have a source or owner approval.
2. Use existing website copy as draft source.
3. Remove duplicate promises.
4. Keep claims measurable where possible.
5. Avoid unsupported “best”, “premium”, “№1”.
6. Avoid fake urgency.
7. Avoid fake discounts.
8. Avoid fake review scores.
9. Avoid fabricated project dates.
10. Keep local geography specific.
11. Mention Владивосток when useful for SEO.
12. Mention Приморский край where delivery is relevant.
13. Keep CTA copy action-oriented.
14. Keep navigation copy short enough for 1024px.
15. Use sentence case in narrative copy.
16. Use uppercase only for metadata if it improves hierarchy.
17. Avoid long blocks without headings.
18. Keep paragraphs below 65ch.
19. Keep hero subcopy below 20 words when possible.
20. Do not change legal company data without source.

## 37. Homepage content checklist

1. Explain both directions within first screen or immediately below.
2. State city/location.
3. State contract or accountability proof.
4. Show one real metal image.
5. Show one real finish/interior-related image.
6. Link to metal page.
7. Link to otdelka page.
8. Link to portfolio.
9. Keep full catalog off homepage.
10. Keep full price off homepage.
11. Show selected work after direction choice.
12. Show one process section.
13. Show one contact CTA.
14. Avoid repeating 500+ in four sections.
15. Avoid repeating warranty in every section.
16. Add messenger links in footer/contact.
17. Keep form direction field.
18. Keep privacy link adjacent to consent.
19. Keep analytics intact.
20. Test navigation anchors.

## 38. Metal content checklist

1. Lead with production capability.
2. Use workshop or construction image.
3. Mention own workshop only if source confirms.
4. Mention cutting/welding/painting only if available.
5. Explain custom work by photo/sketch/measurements.
6. Show categories as a list or tabs.
7. Use existing catalog prices.
8. Preserve price units.
9. Mark prices as starting/orientational where applicable.
10. Add a “точная стоимость” note.
11. Show process after price.
12. Show selected work after process.
13. Keep FAQ useful and specific.
14. Keep contact CTA after proof.
15. Keep metal accent orange.
16. Do not add interior-specific yellow accents.
17. Do not show product cards as the only proof.
18. Do not remove portfolio links.
19. Test all price tabs.
20. Test catalog sync data.

## 39. Otdelka content checklist

1. Lead with free measurement.
2. Use honest entrance/room imagery.
3. Do not overstate available portfolio.
4. Explain black/clean work distinction if source supports it.
5. Show price units.
6. Show price orientation disclaimer.
7. Show process from measurement to handover.
8. Show materials only if supported.
9. Show separate work options.
10. Keep amber accent.
11. Keep same shared shell as metal.
12. Remove legacy otdelka-only background seams.
13. Remove legacy cream-only surface system.
14. Remove emoji icons.
15. Use SVG or text hierarchy instead.
16. Keep FAQ content visible.
17. Keep free-measurement CTA.
18. Link selected projects.
19. Add future image fields in data.
20. Test light and dark theme separately.

## 40. Portfolio content checklist

1. Use real project images.
2. Do not confuse products with completed projects.
3. Separate “production process” from “completed object”.
4. Provide category.
5. Provide direction.
6. Provide honest title.
7. Provide one-line result.
8. Provide alt text.
9. Use featured flag.
10. Filter by direction.
11. Filter by category.
12. Preserve URL query state if implemented.
13. Ensure filtered empty state is composed.
14. Keep grid asymmetric.
15. Use mixed aspect ratios deliberately.
16. Do not use six equal product cards in first view.
17. Add “want something similar” CTA.
18. Do not expose unsupported price as fact.
19. Add lightbox only after base grid is stable.
20. Test keyboard filter usage.

## 41. About content checklist

1. Use only confirmed company facts.
2. Show company role and location.
3. Show own production if confirmed.
4. Show service scope.
5. Show contract/gurantee claims exactly as sourced.
6. Show address.
7. Show phone.
8. Show email.
9. Show Telegram.
10. Show WhatsApp.
11. Show MAX if current link is valid.
12. Show working hours.
13. Show map link.
14. Show requisites if already public on site.
15. Do not add unsupported foundation year.
16. Do not add unsupported “15 years”.
17. Do not add unsupported “98%”.
18. Do not invent team names.
19. Keep one contact form.
20. Make contact section easy to scan on mobile.

## 42. CSS implementation checklist

1. Start from a clean preview stylesheet.
2. Do not import root `style.css` into preview.
3. Do not import legacy `otdelka.css` into preview.
4. Declare tokens at top.
5. Declare theme tokens separately.
6. Declare direction tokens separately.
7. Declare layout primitives.
8. Declare typography primitives.
9. Declare component styles.
10. Declare responsive overrides last.
11. Declare accessibility overrides last.
12. Avoid specificity wars.
13. Avoid `!important` unless accessibility safety requires it.
14. Avoid inline style for visual behavior.
15. Avoid duplicated selectors across page files.
16. Avoid giant all-in-one CSS blocks without section comments.
17. Keep selectors shallow.
18. Prefer class selectors to IDs for visual styles.
19. Keep DOM semantic.
20. Run diff check after edits.

## 43. JavaScript implementation checklist

1. Use one shared `site.js` for preview.
2. Use one shared theme-init.
3. Use one shared analytics loader.
4. Use one shared form handler.
5. Use data attributes for page behavior.
6. Avoid page-specific selector duplication.
7. Avoid global mutable state where possible.
8. Use IntersectionObserver for reveals.
9. Disconnect observers after reveal.
10. Respect reduced motion.
11. Avoid scroll event listeners.
12. Avoid forced layout reads during animation.
13. Do not use alert for errors.
14. Keep form state explicit.
15. Keep loading state explicit.
16. Keep success state explicit.
17. Keep error state explicit.
18. Prevent double submits.
19. Intercept fetch in tests.
20. Run `node --check` on every JS file.

## 44. Image implementation checklist

1. Use current real images first.
2. Validate every image path locally.
3. Add WebP only with fallback.
4. Do not link to missing root assets.
5. Use a preview-root asset strategy.
6. Avoid junctions in committed source.
7. Use explicit width/height.
8. Use lazy loading below fold.
9. Use fetchpriority high only for LCP.
10. Generate honest alt text.
11. Avoid misleading alt text.
12. Avoid oversized original files.
13. Keep source originals separate.
14. Optimize copies with sharp.
15. Inspect object-position per image.
16. Test image naturalWidth.
17. Test 404 network list.
18. Check light/dark image treatment.
19. Keep image contrast behind text accessible.
20. Never replace real work with generated “fake project” imagery.

## 45. Preview server checklist

1. Stop stale preview server before starting.
2. Use a dedicated port.
3. Serve preview root directly.
4. Do not serve project parent by accident.
5. Test `/` before telling user URL.
6. Confirm CSS URL points to preview CSS.
7. Confirm old selectors are absent.
8. Confirm logo loads.
9. Confirm hero loads.
10. Confirm below-fold assets load after scroll.
11. Confirm all page routes return 200.
12. Confirm privacy returns 200.
13. Confirm console has zero errors.
14. Confirm network has no local 404s.
15. Confirm mobile menu works.
16. Confirm theme works.
17. Confirm filters work.
18. Confirm tabs work.
19. Confirm form validation works without submit.
20. Give user one unambiguous root URL.

## 46. Final review questions

1. Does the first screenshot look different from old root?
2. Does the first screenshot look different from previous redesign?
3. Can the business type be understood in five seconds?
4. Is the next action obvious?
5. Is the company credible without invented claims?
6. Do images carry the visual weight?
7. Are headings compact enough?
8. Is body copy readable?
9. Does otdelka feel like the same site?
10. Does metal feel production-oriented?
11. Does portfolio feel like an archive?
12. Does about feel trustworthy?
13. Is the mobile menu complete?
14. Is the form contract preserved?
15. Is the CRM editable path clear?
16. Is future photo replacement easy?
17. Are animations purposeful?
18. Does reduced motion work?
19. Is the site usable without JavaScript for core navigation/content?
20. Would a real customer trust the interface?

## 47. Completion definition

The task is complete only when:

1. The new preview is visually distinct from old site.
2. The new preview is visually distinct from previous redesign.
3. All five main pages are complete.
4. Privacy page is complete.
5. Shared shell is identical.
6. Accent direction is correct.
7. Content is honest.
8. CRM catalog unit is editable.
9. CRM portfolio is editable.
10. Sync script works local-only.
11. Remote sync is token-gated.
12. Form endpoint is preserved.
13. No real leads were created during QA.
14. All routes return 200 locally.
15. All responsive matrix states pass.
16. All main interactions pass.
17. JSON data passes validation.
18. CRM build passes.
19. SEO checks pass.
20. Owner reviews and approves preview.
21. Backup exists before root migration.
22. Root migration is a separate commit.
23. Release is a separate explicit decision.
24. Push is a separate explicit decision.
25. No hidden deploy occurs.

## 48. Current repository state correction

1. The root website is not the approved redesign.
2. The existing root has prior Phase 1 changes.
3. The existing root also contains legacy `otdelka` changes that may be uncommitted.
4. Do not clean, revert, stage, or commit those legacy changes automatically.
5. Inspect them with `git status` before any root work.
6. Treat them as user/previous-agent work unless explicitly assigned.
7. The isolated `redesign/` is a functional prototype, not an approved design.
8. The prototype must not be presented as final.
9. The next design pass must change visual grammar, not only tokens.
10. The next design pass must begin from `TASTE_AUDIT.md`.
11. The next design pass must use the Taste dials in this document.
12. The next design pass must keep the current prototype available for comparison.
13. Do not delete the current prototype until the replacement is accepted.
14. Do not copy prototype section order automatically.
15. Do not copy prototype card density automatically.
16. Do not copy prototype hero wording automatically.
17. Do not copy prototype `eyebrow` rhythm automatically.
18. Do not copy prototype `surface` treatment automatically.
19. Do not copy prototype footer without visual review.
20. A new prototype must receive a new checkpoint.

## 49. Plan corrections for the next AI

1. The plan is not permission to rewrite the production root immediately.
2. The plan is not permission to deploy CRM changes.
3. The plan is not permission to push Git changes.
4. The plan is not permission to send live leads.
5. The plan is permission to work locally in an isolated preview.
6. The plan is permission to inspect local CRM code.
7. The plan is permission to add local CRM code only after reading adjacent patterns.
8. The plan is permission to add documentation under `ai/`.
9. The plan requires user questions whenever design ambiguity remains.
10. If a design decision materially changes the brand, pause and ask one concise question.
11. Do not ask for approval for routine syntax fixes.
12. Do ask before replacing the complete visual direction again.
13. Do not call paid Taste MCP.
14. Do not install Taste MCP as a local package.
15. Taste Skill may be copied or referenced locally only with explicit project hygiene.
16. External Taste repository clones must not remain in the project root.
17. Temporary junctions must not be committed.
18. Generated screenshots must be stored outside the repository or ignored.
19. CRM tokens must remain in environment variables.
20. Do not paste any secret into a plan, commit, or final response.

## 50. Preview acceptance protocol

1. Start the preview from the actual preview root.
2. Use a dedicated port, for example `8091`.
3. Open the root URL, not a nested legacy URL.
4. Confirm the loaded CSS URL.
5. Confirm the header class.
6. Confirm the old hero selector is absent.
7. Confirm the old grid background is absent.
8. Confirm the page title.
9. Confirm the first image loads.
10. Confirm below-fold images load after scroll.
11. Take one desktop screenshot per page.
12. Take one mobile screenshot per page.
13. Keep screenshots outside tracked source unless requested.
14. Tell the owner the exact root URL.
15. Explain the old-site URL separately.
16. Never assume `localhost:8080` is the new site.
17. Never say “done” based only on HTTP 200.
18. Wait for visual feedback.
19. Record feedback in `ai/` if it changes architecture.
20. Repeat only the affected design stage.

## 51. Definition of “visually new”

The new version passes this gate only if all conditions hold:

1. A screenshot without URL or browser chrome is distinguishable from the old site.
2. The hero does not use the old centered/stacked visual grammar.
3. The section order is materially different.
4. The page does not use the old all-caps headline treatment as its main identity.
5. The page does not use a full-page industrial grid.
6. The page does not use sparks or repeated glow.
7. The page does not use the same generic card row repeatedly.
8. The portfolio is an archive, not a product-card catalog.
9. The metal page has a production-specific visual moment.
10. The otdelka page has a calm but shared visual language.
11. The homepage routes users instead of repeating the catalog.
12. The about page reads as a company profile, not a duplicate homepage.
13. The header/footer are shared structurally.
14. Accent differences do not change the page structure.
15. Motion is noticeable but not decorative noise.

## 52. Final handoff contents

Before asking the owner to approve the preview, provide:

1. Exact preview URL.
2. Exact old-site comparison URL.
3. List of changed pages.
4. List of unchanged legacy files.
5. List of CRM files changed.
6. List of scripts added.
7. CRM endpoint statement.
8. Explicit statement that no real lead was sent.
9. Explicit statement that no deployment occurred.
10. Explicit statement that no push occurred.
11. QA matrix result.
12. Known limitations.
13. Missing-photo limitations.
14. Next iteration options.
15. Approval question.

The handoff must not claim production readiness if the owner has not reviewed the visual result.
