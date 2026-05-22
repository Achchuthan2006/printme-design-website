# PrintMe Design

Production-ready V1 marketing site and quote funnel for a local print shop built with Next.js App Router, TypeScript, Tailwind CSS, Supabase scaffolding, and SendGrid email integration.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Supabase client scaffolding
- SendGrid email helpers
- Stripe checkout scaffold

## Pages included

- Home
- Services
- About
- Contact
- Quote Request
- FAQ
- Product catalog
- Product detail/order builder
- Cart
- Checkout
- Customer account
- Customer account routes for orders, quotes, files, invoices, and settings
- Artwork upload workflow
- Support center
- Artwork guidelines
- Order status

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Fill in:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SENDGRID_API_KEY`
- `SENDGRID_FROM_EMAIL`
- `SENDGRID_ADMIN_EMAIL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `ADMIN_PORTAL_ENABLED`
- `NEXT_PUBLIC_ANALYTICS_ID`

Supabase Storage also expects a private bucket named `print-files` for customer artwork uploads.

4. Run the development server:

```bash
npm run dev
```

5. Apply the Supabase schema in [supabase/schema.sql](/C:/Users/Achch/Desktop/PrintMe/supabase/schema.sql).

## Quote request flow

- Client form validates required fields
- API route receives the request
- Data is stored in `print_quote_requests` when Supabase is configured
- Customer confirmation email is sent through SendGrid when configured
- Business admin notification email is sent through SendGrid when configured
- The API still responds safely when integrations are not configured yet

## Project structure

```text
app/
  about/
  api/quote-request/
  contact/
  faq/
  quote-request/
  services/
components/
  forms/
  layout/
  sections/
  ui/
lib/
supabase/
types/
```

## Integration notes

- `lib/supabase.ts` contains browser and server helpers for future auth, storage, and account features.
- `lib/env.ts` centralizes environment reads so server-only secrets stay out of client components.
- `lib/logger.ts` provides structured production logs for failed submissions, checkout failures, and future monitoring integrations.
- `lib/sendgrid.ts` contains the email templates and the mail-send helper.
- `app/api/quote-request/route.ts` is the main backend entry point for quote submissions.
- `app/api/checkout/session/route.ts` creates Stripe Checkout Sessions and rate-limits checkout attempts.
- `data/products.ts` contains catalog content, product options, starter pricing, FAQs, and related products.
- `features/cart/cart-context.tsx` provides the client cart scaffold.
- `lib/stripe.ts` is the payment boundary for future Stripe Checkout Session creation.
- `lib/uploads.ts` is the Supabase Storage upload helper for quote, order, account, and product artwork contexts.
- `components/upload/` contains the drag-and-drop artwork upload UI and print-ready checklist.
- `components/account/` contains Supabase Auth UI, protected account wrappers, dashboard widgets, and account portal scaffolds.
- `app/admin/` contains the internal operations dashboard scaffold. It is blocked unless `ADMIN_PORTAL_ENABLED=true`.

## Production launch checklist

1. Set production environment variables in the deployment platform. Keep `SUPABASE_SERVICE_ROLE_KEY`, `SENDGRID_API_KEY`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET` server-only.
2. Set `NEXT_PUBLIC_SITE_URL=https://printmedesign.com` before deploying so sitemap, canonical URLs, Stripe redirects, and metadata resolve correctly.
3. Apply [supabase/schema.sql](/C:/Users/Achch/Desktop/PrintMe/supabase/schema.sql), enable Row Level Security, and add policies for profiles, quotes, orders, uploads, invoices, internal notes, and admin activity.
4. Create the private Supabase Storage bucket `print-files` and restrict file access with authenticated/storage policies before accepting real artwork.
5. Configure SendGrid sender authentication for `printmedesign.com` and verify the quote/admin email recipients.
6. Configure Stripe Checkout live keys, webhook endpoint, and Stripe Dashboard payment methods before accepting production payments.
7. Keep `ADMIN_PORTAL_ENABLED=false` until staff access and Supabase role enforcement are ready. Turn it on only for trusted deployments.
8. Add analytics/search tooling through `NEXT_PUBLIC_ANALYTICS_ID` or a future provider wrapper, then verify quote, call, upload, cart, and checkout events.
9. Run `npm run build` before each release and smoke-test homepage, products, quote request, upload, cart, checkout, account, and admin routes.
10. After launch, monitor platform logs for quote failures, checkout failures, upload errors, and failed auth/admin access.

## Release and rollback notes

- Deploy from a tagged commit or stable branch so the launch version can be identified quickly.
- Keep the previous successful deployment available for instant rollback in Vercel or the chosen host.
- Apply database migrations before switching traffic when schema changes are backward-compatible.
- For risky releases, deploy a preview build first and run the pre-launch flow checklist before promoting to production.
- If payments, email, or uploads fail after launch, temporarily disable affected CTAs or switch to quote/contact fallback while rolling back.

## Future TODOs

- Persist account dashboard data to Supabase profiles, addresses, orders, quotes, uploads, and invoices
- Persist uploaded file metadata to Supabase once authenticated quote/order/customer IDs are available
- Proof approval workflow for reviewed artwork
- Order tracking and status updates
- Enforce staff/admin roles with Supabase RLS instead of the temporary admin portal gate
- Reorder flow for returning customers

## Assumptions

- The placeholder business email is `hello@printmedesign.com`
- Working hours are placeholders and should be replaced with the real schedule
- Testimonials are UI-ready placeholders and should be swapped with approved customer reviews
