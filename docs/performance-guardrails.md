# PrintMe Performance Guardrails

## Core targets
- `LCP`: under `2.5s` on key landing and product pages.
- `INP`: under `200ms` for cart, checkout, account, and upload interactions.
- `CLS`: under `0.1` across homepage, product pages, cart, checkout, and auth flows.

## Priority flows to verify before release
- Homepage to product discovery
- Product detail to upload or template path
- Product detail to cart
- Cart to checkout
- Checkout to Stripe handoff
- Quote request submission
- Account login, signup, and password reset
- Account dashboard, orders, quotes, and files

## Frontend budgets
- Keep new always-mounted client shells to a minimum.
- Defer non-critical widgets until idle whenever possible.
- Use dynamic import for below-the-fold interactive studios and heavy helper surfaces.
- Avoid adding large animation libraries unless they replace more expensive custom code.
- Prefer static/server rendering for content-first pages and client components only for interaction zones.

## Media rules
- Use `next/image` for image assets whenever possible.
- Provide fixed dimensions or stable aspect ratios to prevent layout shift.
- Prefer `AVIF` or `WebP` output where supported.
- Treat hero media as priority only when it is truly above the fold.
- Keep decorative media lazy and below-the-fold.

## Interaction rules
- Cart additions should merge identical configurations instead of duplicating lines.
- Upload flows should support parallel upload where safe.
- Avoid blocking scroll, key, or click listeners unless a modal or drawer is open.
- Use strong loading, empty, and retry states for every async customer flow.

## Functional QA checklist
- Verify product option changes update summary immediately.
- Verify upload success and failure states on quote and checkout.
- Verify quote flow uses turnaround windows instead of arbitrary customer-picked dates.
- Verify Stripe checkout starts only after valid cart and customer data.
- Verify auth redirects, protected account pages, and sign-out behavior.

## Regression watchpoints
- Header and support widgets should not become larger than adjacent actions on desktop.
- New account or admin features should not force global hydration of the public site.
- Product page enhancements should stay split from the initial route bundle when below the fold.
- Local storage hydration should never overwrite saved cart state on first load.
