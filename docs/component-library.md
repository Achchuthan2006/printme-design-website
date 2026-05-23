# PrintMe Component Library

## Purpose

This file documents the current shared components and how they should be used so future UI work stays brand-aligned.

## Buttons

Source: [components/ui/button.tsx](/C:/Users/Achch/Desktop/PrintMe/components/ui/button.tsx)

Purpose:

- primary actions
- secondary routes
- inline linked actions

Variants:

- `primary`
- `secondary`
- `ghost`

Usage rules:

- Use `primary` for one dominant action per area.
- Use `secondary` for alternate but still important actions.
- Use `ghost` for low-emphasis utility actions.
- Keep labels action-oriented and concise.

Do:

- use uppercase labels
- pair primary CTA with a single meaningful secondary CTA when needed

Avoid:

- multiple primary CTAs side-by-side unless the pattern already exists
- decorative CTA labels with vague wording

## Brand Logo

Source: [components/layout/brand-logo.tsx](/C:/Users/Achch/Desktop/PrintMe/components/layout/brand-logo.tsx)

Purpose:

- official site wordmark rendering

Variants:

- `header`
- `footer`
- `inverted`

Rules:

- Do not manually resize the logo with ad hoc wrappers.
- Add a new size variant in `BrandLogo` before introducing a new usage context.

## Section Heading

Source: [components/ui/section-heading.tsx](/C:/Users/Achch/Desktop/PrintMe/components/ui/section-heading.tsx)

Purpose:

- standard page section intro

Props:

- `eyebrow`
- `title`
- `description`
- `align`

Rules:

- Use for most major sections.
- Keep descriptions short and useful.
- Use `center` only when the section layout benefits from symmetry.

## Page Hero

Source: [components/ui/page-hero.tsx](/C:/Users/Achch/Desktop/PrintMe/components/ui/page-hero.tsx)

Purpose:

- interior page hero pattern

Includes:

- eyebrow
- headline
- description
- primary CTA
- supporting CTA
- proof/highlight list

Rules:

- Prefer this component over inventing page-specific hero wrappers.
- Pass `highlights` that reinforce trust or next-step clarity.

## Badge

Source: [components/ui/badge.tsx](/C:/Users/Achch/Desktop/PrintMe/components/ui/badge.tsx)

Purpose:

- compact labeling
- service or product metadata

Rules:

- Use for short labels only.
- Do not place full sentences in badges.
- Keep badge counts limited within a single card or hero.

## Inputs, Textareas, Selects

Primary pattern:

- `.premium-input`

Seen in:

- quote flow
- checkout
- auth
- product configurator

Rules:

- Use bold labels above fields.
- Use helper copy to reduce uncertainty.
- Avoid mixing raw browser-like input styles with premium inputs on the same screen.

## Cards

Shared styles:

- `.surface-card`
- `.premium-surface`
- `.hero-panel`

Usage:

- `surface-card`: standard content container
- `premium-surface`: repeated card/list/dashboard unit
- `hero-panel`: high-emphasis focal block

Rules:

- Choose the lightest panel type that fits the content.
- Avoid nesting many heavy cards inside other heavy cards.

## Service Cards

Source: [components/sections/service-card.tsx](/C:/Users/Achch/Desktop/PrintMe/components/sections/service-card.tsx)

Purpose:

- top-level service browsing

Rules:

- Use service cards for broad service entry points, not detailed product specs.
- Keep copy concise and benefit-driven.

## Product Cards

Source: [components/commerce/product-card.tsx](/C:/Users/Achch/Desktop/PrintMe/components/commerce/product-card.tsx)

Purpose:

- catalog browsing

Includes:

- visual
- badges
- category
- description
- turnaround note
- price/quote state
- CTA

Rules:

- Use for product listing pages and category views.
- Keep one clear CTA per card.

## Trust Strips And Trust Badges

Sources:

- [components/catalog/trust-strip.tsx](/C:/Users/Achch/Desktop/PrintMe/components/catalog/trust-strip.tsx)
- [components/conversion/local-trust-strip.tsx](/C:/Users/Achch/Desktop/PrintMe/components/conversion/local-trust-strip.tsx)
- [components/sections/trust-badge.tsx](/C:/Users/Achch/Desktop/PrintMe/components/sections/trust-badge.tsx)

Purpose:

- compact proof and reassurance

Rules:

- Keep trust points factual and operational.
- Use icon + short statement + brief supporting line.
- Do not overload trust strips with marketing claims.

## CTA Panels

Sources:

- [components/conversion/lead-cta-panel.tsx](/C:/Users/Achch/Desktop/PrintMe/components/conversion/lead-cta-panel.tsx)
- [components/catalog/final-cta.tsx](/C:/Users/Achch/Desktop/PrintMe/components/catalog/final-cta.tsx)

Purpose:

- high-emphasis conversion zones

Rules:

- Use darker brand surfaces for major end-of-page CTAs.
- Keep copy short, direct, and practical.
- Use one dominant next step plus one alternate route.

## Accordions And FAQ

Sources:

- [components/catalog/faq-accordion.tsx](/C:/Users/Achch/Desktop/PrintMe/components/catalog/faq-accordion.tsx)
- [app/faq/page.tsx](/C:/Users/Achch/Desktop/PrintMe/app/faq/page.tsx)

Purpose:

- reduce hesitation
- answer pre-purchase questions

Rules:

- Keep questions concise and specific.
- Answers should remove ambiguity, not repeat marketing copy.

## Navbar And Footer

Sources:

- [components/layout/header.tsx](/C:/Users/Achch/Desktop/PrintMe/components/layout/header.tsx)
- [components/layout/footer.tsx](/C:/Users/Achch/Desktop/PrintMe/components/layout/footer.tsx)

Rules:

- Header should remain crisp, high-contrast, and wordmark-led.
- Footer should feel rich and grounded, not cluttered.
- Contact and local credibility belong in both, but with different density.

## Account And Admin Navigation

Sources:

- [components/account/account-nav.tsx](/C:/Users/Achch/Desktop/PrintMe/components/account/account-nav.tsx)
- [components/admin/admin-nav.tsx](/C:/Users/Achch/Desktop/PrintMe/components/admin/admin-nav.tsx)

Rules:

- Keep product/admin surfaces visually related to the public site.
- Status, nav, and card styles should reuse the same token logic.
- Avoid introducing unrelated dashboard themes.

## Status Badges

Sources:

- [components/account/status-badge.tsx](/C:/Users/Achch/Desktop/PrintMe/components/account/status-badge.tsx)
- [components/admin/admin-status-badge.tsx](/C:/Users/Achch/Desktop/PrintMe/components/admin/admin-status-badge.tsx)

Rules:

- Reserve color for meaningful state differences.
- Keep labels short and uppercase or normalized consistently.
- Do not introduce many ad hoc status colors.

## Dashboard Tables

Source: [components/admin/admin-table.tsx](/C:/Users/Achch/Desktop/PrintMe/components/admin/admin-table.tsx)

Purpose:

- structured operations data

Rules:

- Tables should stay clean and readable.
- Hover feedback can be soft brand tint, never loud.
- Search/filter bars should use the same panel language as the rest of admin.

## When To Create A New Shared Component

Create or extract a shared component when:

- the pattern appears on 2+ pages
- the spacing and styling are becoming repetitive
- a new surface needs a documented variant of an existing pattern

Do not create a new shared component when:

- the pattern is genuinely unique
- the abstraction would hide useful clarity
