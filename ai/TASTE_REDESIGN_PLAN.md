# Taste-Based Redesign Plan

## Design Read

Reading this as: a trust-first local construction landing site for B2C and small B2B clients, with a modern architectural language, leaning toward asymmetric editorial layout, Swiss grid discipline, and restrained industrial details.

## Why Previous Versions Failed

The previous attempts were not true redesigns because they kept the same visual grammar:

- centered or split hero with the same hierarchy;
- repeated three-card feature rows;
- dark industrial background inherited from the original site;
- uppercase display headlines;
- section label + title + cards repeated on every section;
- decorative grid, sparks, glow and generic hover effects;
- portfolio as another card grid instead of a visual archive;
- different page namespaces that made `otdelka` look like another product.

The next implementation must not edit the old stylesheet by adding another override layer. It must replace the visual grammar in the isolated `redesign/` version first.

## Skills To Apply

### Primary

- `design-taste-frontend` from Taste Skill v2.
- `redesign-existing-projects` from Taste Skill.
- `high-end-visual-design` from Taste Skill.
- `ui-ux-pro-max` for design-system and UX verification.
- `design-system` and `design` for tokens and component specifications.
- `motion` for every animation or transition.

### Not Used Without Approval

- `taste-mcp` is a hosted human-review service with paid x402 calls ($1-$15). Do not call paid tools or install crypto/payment tooling without explicit user approval.
- `brutalist-skill` is reference material only. Its terminal/CRT, massive typography, hard borders, and dark-only rules conflict with this brief.

## Taste Dials

```text
DESIGN_VARIANCE: 8
MOTION_INTENSITY: 6
VISUAL_DENSITY: 4
```

Interpretation:

- Variance 8: asymmetric editorial compositions, not symmetrical card rows.
- Motion 6: visible but calm reveal, image masks, tactile CTA states.
- Density 4: generous whitespace, short copy, no crowded hero.

## Visual Direction

### Base

- Primary substrate: cool architectural off-white, not warm beige.
- Text: charcoal/graphite, never pure black for large surfaces.
- Secondary surfaces: concrete grey and cool steel blue-grey.
- Dark theme: graphite charcoal, not black neon-tech.
- Accent metal: burnt safety orange, locked across the complete metal page.
- Accent otdelka: muted amber/yellow, locked across the complete otdelka page.

### Typography

- Use one display sans and one body sans only.
- Prefer a characterful sans display such as Geist/Outfit/Cabinet Grotesk if locally available; otherwise use the existing Montserrat as a controlled fallback.
- Body text must be readable and limited to approximately 65 characters per line.
- Sentence case for headlines. Uppercase only for short metadata and buttons.
- H1 desktop target: 48-64px, maximum two lines in the hero.
- H1 mobile target: 32-40px, maximum three lines.
- H2 target: 32-44px.
- Body target: 16-18px with line-height 1.5-1.65.
- No random serif emphasis inside sans headlines.

## Layout Grammar

### Shared header

- One header DOM pattern for all pages.
- 64-72px desktop height.
- Desktop navigation must fit on one line at 1024px; use shorter visual labels only if needed, while accessible labels remain descriptive.
- Mobile menu is a full-width overlay panel with staggered links.
- Theme toggle is a compact icon control, not a decorative button.

### Homepage

Do not repeat the old section sequence. Use:

1. Split hero: left value proposition, right oversized real image with a small technical metadata rail.
2. A two-line trust statement, not a four-card strip.
3. A directional switcher: two large editorial panels, orange and amber accents.
4. Selected work archive: one dominant project image plus two offset details.
5. Process as a horizontal rule/timeline, not cards.
6. A short proof list with numbers and text in rows.
7. One strong CTA and contact area.

### Metal page

- Use a darker section only for the production hero and process; do not make the whole page dark.
- Show a workshop image and technical metadata.
- Services are a numbered list with descriptions, not product cards.
- Price list is the primary interaction: tabs and clean tables.
- Portfolio is a horizontal selected-project strip, not another grid.

### Otdelka page

- Same header, footer, grids, typography, and layout grammar as metal.
- Difference only: amber accent and interior-specific imagery/copy.
- No separate cream theme, `.ot-*` visual namespace, or decorative seam background.
- Use a calm split hero, material palette strip, price table, and one process timeline.

### Portfolio page

- Treat as an archive/gallery, not a SaaS card grid.
- Use mixed aspect ratios and a deliberate asymmetrical masonry-like grid.
- Filter controls are compact editorial tabs.
- Project card contains image, category, title, and one-line outcome.
- Lightbox is optional only after the archive is visually strong.

### About page

- Use one strong production image and a text-led company story.
- Use a facts row with plain numbers, not metric cards.
- Contacts are part of the narrative: address, hours, phone, messengers, map link.
- No invented team, dates, guarantees, or certifications.

## Anti-Slop Gates

Reject the implementation if any of these are true:

- the first screen resembles the old hero;
- more than one repeated 3-column card row appears on a page;
- every section starts with an eyebrow label;
- there is a full-page grid, sparks, glow, purple gradient, or CRT effect;
- long uppercase headlines dominate the screen;
- otdelka has different header/footer or different component shapes;
- cards are used where a list, divider, image, or whitespace would work better;
- CTA text wraps on desktop;
- body text is below 16px;
- important content appears only through animation;
- animation uses top/left/width/height or runs infinitely without purpose;
- emojis are used as UI icons;
- any content is invented instead of sourced from the current website/CRM.

## Motion Plan

Before writing animation code:

1. Search Motion docs for the exact pattern.
2. Use only transform/opacity/clip-path where safe.
3. Use a generated CSS spring `linear()` curve for CTA/card interaction.
4. Use IntersectionObserver for reveal; do not use scroll handlers that force layout.
5. Implement mobile menu stagger with a fixed small delay per link.
6. Under reduced motion, render all content immediately and disable autoplay.

Motion inventory:

- header menu reveal: 240-360ms, stagger 35ms;
- hero text reveal: 450-600ms, once;
- image mask reveal: 550-700ms, once;
- project archive stagger: 60ms per item;
- CTA hover: 180-300ms spring;
- table/filter state: 150-220ms opacity/underline only;
- no continuous decorative animation.

## Data and CRM

The website must consume generated static data, not directly call CRM at runtime.

Catalog fields:

```text
id, name, category, direction, price, unit, description, image, alt, featured
```

Portfolio fields:

```text
id, title, category, direction, images[], description, date, featured, alt
```

CRM work:

- `catalog.unit` validation and UI field;
- `portfolio` CRUD resource;
- Portfolio upload through existing `/api/upload`;
- navigation item in CRM;
- build-time `sync-content.js` with remote token only from environment;
- no deployment, S3 mutation, or real lead submission during local QA.

Lead contract must remain:

```text
POST /api/website-lead
{ name, phone, message, consent }
```

Direction may be prefixed inside `message`, matching current backend behavior.

## QA Gates

- Preview must be served from a dedicated root, never confused with the old site.
- Playwright: 6 pages × 4 widths × 2 themes.
- Console errors: zero local errors.
- No horizontal overflow.
- Header/footer DOM classes identical across all pages.
- `h1` exactly once per page.
- All meaningful images have alt; decorative logo images use empty alt.
- Check tabs, filters, FAQ, mobile menu, theme, keyboard focus.
- Intercept form fetch in tests; do not create real CRM leads.
- Validate catalog and portfolio JSON before sync.
- Run CRM `npm run build`.
- Do not replace root site or push until the user explicitly approves the preview.
