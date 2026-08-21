# Taste Audit Of Current Attempts

## Current failure classification

### Layout

- Previous versions reuse the same hero, direction cards, trust strip, process cards, testimonials, FAQ, and contact form sequence.
- `redesign/` copied that sequence instead of designing a new composition.
- The page has no authored visual rhythm: every section uses the same heading and card treatment.

### Typography

- Long all-caps copy makes the site look like a low-budget template.
- Hero headings are too large for their word count and wrap too often.
- Section headings and labels repeat the same visual cue.

### Surfaces

- Full-page dark background, visible grid, glow and sparks create a generic “AI industrial” fingerprint.
- Orange/yellow glow appears as decoration rather than a controlled brand accent.
- Too many bordered cards flatten hierarchy.

### Content

- The home page repeats the metal catalog instead of routing visitors.
- Portfolio cards are treated like products, even when they are completed work.
- Otdelka photography is limited and must be described honestly as entrance zones/tambours until more interior photos are added.

### Interactions

- Existing motion is mostly fade-in and hover scale; it lacks a choreographed hierarchy.
- The previous redesign used a new CSS layer over old CSS, causing conflicts and making pages look similar.
- The next implementation must be isolated and then reviewed before any root replacement.

## Pass condition

An evaluator should be able to distinguish the new site from the old site in a screenshot with the header cropped out. If the first viewport can be described as “the old site with new colors,” reject it.
