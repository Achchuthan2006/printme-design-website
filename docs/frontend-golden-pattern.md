# PrintMe Frontend Golden Pattern

This document defines the stable shared pattern for future customer-facing PrintMe UI work.

## Layout

- Use `PageSection` for major vertical bands.
- Use `container-shell` for horizontal rhythm.
- Default to `section-space`; use tighter spacing only for secondary support sections.
- Prefer one primary visual container per section instead of nested decorative wrappers.

## Typography

- Use `display-title` for primary page and section headlines.
- Use `SectionHeading` for section intros with optional description.
- Keep body copy in `text-sm` to `text-base` with generous line height.
- Reserve uppercase tracking-heavy labels for utilities, status, or short metadata only.

## Color And Surface Rules

- Default page background stays warm-neutral through `bg-canvas`.
- Use `Card` variants as the surface source of truth:
  - `surface` for standard content groupings
  - `glass` for premium spotlight or elevated support surfaces
  - `panel` for hero-style compositions
  - `dark` for high-contrast conversion bands
- Use brand color as an accent and action signal, not as a large fill everywhere.

## Buttons

- `default` is the primary dark action.
- `secondary` is the standard alternative action.
- `outline` is reserved for contextual contrast, especially on dark sections.
- Avoid mixing multiple custom button styles inside one section.

## Cards

- Prefer open layouts plus a few strong cards instead of dense card grids everywhere.
- Repeated cards should share one component or one variant family.
- Interactive cards should use `interactive` behavior instead of custom hover recipes.

## Navigation

- Use `NavList` and `NavItemLink` for reusable account, admin, and structured nav lists.
- Keep header navigation visually restrained and consistent with the main component tokens.
- Avoid bespoke nav item styling unless the interaction model is genuinely different.

## Composition

- Each section should have one job:
  - discover
  - compare
  - trust
  - convert
  - support
- Prefer alternating open text-led sections with framed support/product surfaces.
- Avoid placeholder imagery or decorative empty boxes in production pages.

## Responsive Behavior

- Desktop layouts can feel editorial, but mobile should collapse into a clean vertical narrative.
- Maintain CTA clarity and preserve hierarchy before preserving side-by-side layouts.
- Avoid hardcoded heights unless they are necessary for a specific visual frame.

## Guardrails

- Reuse catalog, product, and service data as the source of truth.
- Extend existing shared components before creating new one-off UI.
- No new parallel design systems, duplicate cards, or inline style sprawl.
