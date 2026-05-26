# PrintMe Launch Readiness

This checklist translates the current PrintMe codebase into concrete deployment and operations rules.

## Environment model

Use two environment layers for staff access while the admin portal is still frontend-driven:

- `ADMIN_PORTAL_ENABLED`
  Enables or disables the internal admin surface entirely.
- `ADMIN_USER_EMAILS`
  Server-side allowlist for staff-only backend checks and future server enforcement.
- `NEXT_PUBLIC_ADMIN_USER_EMAILS`
  Client-side allowlist for the current admin portal gate. Keep it identical to `ADMIN_USER_EMAILS` until Supabase role claims replace this temporary step.

Recommended production rule:

1. Keep `ADMIN_PORTAL_ENABLED=false` until the allowlists are configured and tested.
2. Set both admin email lists to the same approved staff addresses.
3. Replace the public allowlist with Supabase `profiles.role` plus server-side session checks before broadening internal tooling.

## Required production variables

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`
- `SENDGRID_API_KEY`
- `SENDGRID_FROM_EMAIL`
- `SENDGRID_ADMIN_EMAIL`
- `SENDGRID_REPLY_TO_EMAIL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `ADMIN_PORTAL_ENABLED`
- `ADMIN_USER_EMAILS`
- `NEXT_PUBLIC_ADMIN_USER_EMAILS`
- `NEXT_PUBLIC_ANALYTICS_ID` if analytics are enabled

## Supabase readiness

1. Apply the canonical migrations in `supabase/migrations`.
2. Use [supabase/schema.sql](/C:/Users/Achch/Desktop/PrintMe/supabase/schema.sql) as a bootstrap reference and [docs/supabase-schema.sql](/C:/Users/Achch/Desktop/PrintMe/docs/supabase-schema.sql) as the extended architecture reference.
3. Create the private `print-files` storage bucket or set `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` to the production bucket name.
4. Enable Row Level Security for customer-facing tables before storing live customer data.
5. Apply the profile, address, order, quote, upload, invoice, and support policies from the migration set before launch.
6. Confirm the private schema tables for Stripe customers, payment records, webhook events, and email deliveries are present and only server-controlled.
7. Plan the migration from email allowlists to `profiles.role` or equivalent claims before scaling staff workflows.

## Payments and webhook readiness

1. Create a live Stripe webhook endpoint for `/api/stripe/webhook`.
2. Subscribe it to checkout completion and payment events used by the order workflow.
3. Confirm webhook signatures with `STRIPE_WEBHOOK_SECRET`.
4. Verify that checkout session metadata includes the order identifiers needed by internal operations.
5. Test failed payment, deposit payment, cancelled checkout, and repeated webhook delivery paths before launch.
6. Verify that webhook receipts are written to the private webhook event log and that private payment records update with captured/refunded values.

## Email and notifications

1. Verify SendGrid sender authentication for the PrintMe domain.
2. Confirm admin recipients for quote, checkout, and support notifications.
3. Test customer-facing emails for welcome, quote received, order placed, upload received, payment confirmation, artwork issue, and pickup-ready notifications.
4. Confirm provider-level delivery metadata is stored in the private email delivery log.
5. Add monitoring or alerting around failed notification sends before depending on them operationally.
6. Apply the command-center migration so `analytics_events`, `operational_alerts`, `notification_inbox`, and `dashboard_kpi_snapshots` exist before enabling live reporting.

## Release checklist

1. Run `npm run build`.
2. Run `npm run typecheck`.
3. Smoke-test these routes:
   - `/`
   - `/services`
   - `/products`
   - `/quote-request`
   - `/cart`
   - `/checkout`
   - `/account/login`
   - `/support`
   - `/admin` with an allowed staff account
4. Confirm Stripe redirects resolve against `NEXT_PUBLIC_SITE_URL`.
5. Confirm Supabase uploads succeed and metadata is stored.
6. Confirm the admin portal is inaccessible to non-staff accounts.
7. Confirm a signed-in staff account can reach the admin portal and customer account safely.

## Known temporary boundaries

- The current admin portal gate is a UI and configuration boundary, not a full server-enforced authorization model.
- Customer account surfaces now support persisted profile, order, quote, file, and invoice data when available, with preview fallbacks where no live records exist yet.
- Upload metadata, payment history, and notification history are now structured for persistence, and secure signed upload URLs are prepared server-side.
- Command-center reporting is now designed to read from persisted analytics and notification intelligence tables when Supabase is configured.

## Recommended next engineering milestones

1. Add Supabase SSR auth so admin and account route protection can be enforced server-side without relying on client state.
2. Replace email allowlists with persisted staff roles and RLS-backed admin permissions everywhere.
3. Add automated smoke tests for quote intake, cart, checkout, signed upload URL generation, upload metadata submission, and admin access.
4. Add centralized observability for payment failures, upload failures, and notification failures.
