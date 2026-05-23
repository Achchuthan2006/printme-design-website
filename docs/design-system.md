# PrintMe Design System

## Purpose

This document turns the current PrintMe brand expression into reusable implementation rules for UI work.

Reference files:

- tokens: [tailwind.config.ts](/C:/Users/Achch/Desktop/PrintMe/tailwind.config.ts)
- shared utilities: [app/globals.css](/C:/Users/Achch/Desktop/PrintMe/app/globals.css)
- primary shared UI: [components/ui](/C:/Users/Achch/Desktop/PrintMe/components/ui)

## Color Tokens

### Brand

- `brand.DEFAULT`: primary CTA, active accents, key emphasis
- `brand.dark`: primary CTA hover/pressed states
- `brand.deep`: deeper emphasis and strong dark-orange surfaces
- `brand.light`: accent-on-dark support where a lighter brand note is helpful
- `brand.soft`: subtle panels, trust notes, validation support, non-primary highlights

### Neutrals

- `ink`: primary headline and dark brand surfaces
- `slate`: secondary text
- `line`: borders and dividers
- `canvas`: soft section backgrounds
- `panel`: pure surface background

### Usage Rules

- Keep strong orange-red usage concentrated in action zones.
- Large full-page orange fields should be rare.
- Most page backgrounds should be white, off-white, or dark neutral.
- When in doubt, use neutral surfaces plus orange-red accents rather than orange-red-heavy layouts.

## Typography Tokens

### Utility Classes

- `.display-title`: primary headline treatment
- `.editorial-kicker`: small uppercase section label
- `.text-balance`: use on major headings
- `.text-pretty`: use for supporting copy blocks

### Hierarchy Rules

- Hero/page headline: `.display-title`
- Section headline: `.display-title` at smaller scale or `SectionHeading`
- Section label: `.editorial-kicker`
- Body copy: `text-sm` to `text-base` with generous line-height
- Metadata labels: uppercase, smaller, bold, spaced out

## Spacing Scale

### Containers

- Global page container: `.container-shell`
- Default section rhythm: `.section-space`

### Spacing Logic

- Major sections: use `.section-space`
- Interior card padding: 20px to 32px depending on density
- CTA areas: tighter vertical spacing than content sections, but never cramped
- Hero blocks: generous top/bottom breathing room and tighter internal grouping

### Rhythm Rules

- Keep headlines close to their eyebrow.
- Keep headline-to-description spacing moderate, not oversized.
- Keep CTA groups visually attached to the content they serve.
- Avoid “one large gap then many small random gaps.”

## Radius Rules

- Primary panels: `1.5rem` to `2rem`
- Inputs and buttons: `1rem` to `1.5rem`
- Pills/badges/status tags: fully rounded
- Avoid mixing sharp corners with rounded cards unless there is a specific reason

## Shadows

- `shadow-soft`: default lift
- `shadow-card`: stronger interaction/feature lift
- `shadow-luxe`: hero or major CTA surfaces

Rules:

- Use stronger shadows for hero and CTA focal points.
- Keep most informational cards on `shadow-soft`.
- Avoid stacked or competing shadow styles in the same region.

## Border Rules

- Default borders use `line` with light opacity.
- Use white inset borders to add polish on premium panels.
- Dashed borders are reserved for states like empty/upload/helper contexts.

## Motion Principles

- Motion should support clarity and perceived polish.
- Use opacity, translate, and shadow shifts more than large movement.
- Respect `prefers-reduced-motion`.
- Hover is only for interactive elements.
- No bounce or novelty easing.

Current motion classes include:

- `.hero-in`
- `.hero-visual-in`
- `.reveal-up`
- `.premium-cta`
- `.cta-sheen`

## Layout Rules

- Prefer strong two-column hero compositions or clean centered content blocks.
- Keep first viewport layouts simple and immediately scannable.
- Use cards when content benefits from grouping; do not card-ify everything.
- Alternate neutral and white backgrounds to maintain rhythm.

## Section Patterns

### Hero Pattern

- Use `PageHero` for standard interior pages.
- Use the homepage hero as the premium marketing benchmark.
- Hero should contain: eyebrow, headline, supporting copy, primary CTA, secondary CTA, and compact proof points or highlights.

### Section Intro Pattern

- Prefer `SectionHeading` or its structure.
- Use eyebrow only when it helps scan the page.
- Keep section descriptions practical and concise.

## CTA Rules

### Primary CTA

Use for:

- quote request
- add to cart
- checkout
- major next step

Style:

- brand orange-red fill
- white text
- uppercase bold label

### Secondary CTA

Use for:

- alternate route
- supporting action
- lower-commitment navigation

Style:

- white surface
- neutral text
- border emphasis

### CTA Copy Rules

- use verbs
- be direct
- avoid cleverness
- explain the next step when useful

Examples:

- `Get My Quote`
- `Review My Order`
- `Check Artwork First`
- `Speak With PrintMe`

## Trust Section Rules

- Trust should appear as compact proof, not long brand essays.
- Common proof themes: local support, file review, turnaround clarity, pickup confidence, production guidance.
- Use icon-led cards, compact proof bars, or short structured lists.
- Keep trust language realistic and operational.

## Form Rules

- Use `.premium-input` for text inputs, textareas, and selects where possible.
- Labels are bold and clear.
- Helper text should explain the practical reason for the field.
- Success and validation messaging should sit on soft branded surfaces, not loud alert styling unless genuinely critical.

## Dashboard UI Rules

- Admin and account surfaces should feel like part of the same PrintMe product ecosystem.
- Use the same color tokens, border radius, and typography rules as the public site.
- Prefer strong headers, structured cards, and clear status labels.
- Avoid introducing unrelated SaaS dashboard color themes.

## Visual Consistency Rules

- Build from tokens and shared classes first.
- Reuse `surface-card`, `premium-surface`, `hero-panel`, and shared UI components before introducing custom wrappers.
- If a surface repeats, standardize it.
- If a new page feels like a separate visual product, it is off-system.

## Implementation Audit Notes

The current codebase is broadly aligned to this system, but future work should continue replacing older one-off classes with shared utilities and shared components where repetition appears.
