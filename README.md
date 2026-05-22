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
- `lib/sendgrid.ts` contains the email templates and the mail-send helper.
- `app/api/quote-request/route.ts` is the main backend entry point for quote submissions.
- `data/products.ts` contains catalog content, product options, starter pricing, FAQs, and related products.
- `features/cart/cart-context.tsx` provides the client cart scaffold.
- `lib/stripe.ts` is the payment boundary for future Stripe Checkout Session creation.
- `lib/uploads.ts` is the Supabase Storage upload helper.

## Future TODOs

- Stripe payments and deposit links
- Customer accounts and authentication
- File uploads with Supabase Storage
- Order tracking and status updates
- Admin dashboard for quote management
- Reorder flow for returning customers

## Assumptions

- The placeholder business email is `hello@printmedesign.com`
- Working hours are placeholders and should be replaced with the real schedule
- Testimonials are UI-ready placeholders and should be swapped with approved customer reviews
