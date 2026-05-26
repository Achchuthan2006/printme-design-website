# PrintMe Backend Architecture

## Goals

- Support customer quotes, direct orders, artwork uploads, payments, and future reorders
- Separate customer-facing data from internal operations data
- Preserve a clean workflow trail for quotes, orders, uploads, and payment events
- Keep Stripe, Supabase, email, and admin tooling integration-ready without pushing unsafe assumptions into the frontend

## Current Backend Layers

- `app/api/quote-request/route.ts`
  Public quote intake with rate limiting, validation, persistence, and notification triggers
- `app/api/checkout/session/route.ts`
  Checkout session creation with validated cart payloads, order draft persistence, and payment/session metadata
- `app/api/uploads/metadata/route.ts`
  Server-side recording point for artwork metadata after client-side storage upload
- `app/api/uploads/signed-url/route.ts`
  Server-issued signed upload URLs so artwork files can be stored without broad client bucket permissions
- `app/api/stripe/webhook/route.ts`
  Verified Stripe webhook handler for payment-state truth and audit logging
- `app/api/account/profile/route.ts`
  Authenticated profile bootstrap and account-role resolution
- `app/api/account/dashboard/route.ts`
  Authenticated customer dashboard data endpoint wired to persisted profile, order, quote, file, and invoice records
- `lib/backend/schemas.ts`
  Shared Zod validation for quote intake, checkout payloads, request metadata, and Stripe metadata parsing
- `lib/backend/workflows.ts`
  Shared canonical workflow states and event names
- `lib/backend/repository.ts`
  Persistence orchestration for quotes, orders, uploads, payment audit records, workflow events, idempotency records, and notification delivery tracking
- `lib/backend/notifications.ts`
  Notification dispatch layer with tracked delivery events and shared trigger map
- `lib/backend/idempotency.ts`
  Request fingerprinting and idempotency-key resolution for quote, checkout, and webhook safety
- `lib/backend/auth.ts`
  Server-side bearer-token verification and role-aware request authentication
- `lib/backend/account.ts`
  Customer profile synchronization and persisted dashboard data mapping
- `lib/backend/storage.ts`
  Artwork upload validation, secure storage path rules, and signed-upload generation
- `lib/backend/workflow-engine.ts`
  Workflow transition guardrails for payment and order state mutation
- `lib/backend/billing.ts`
  Private Stripe customer/payment orchestration and checkout-to-billing linkage

## Current Frontend Platform Direction

- Customer account surfaces are now organized around `orders`, `quotes`, `files`, `invoices`, and `support`, rather than a single generic dashboard
- Order and quote progress UI is built to consume future `workflow_events` without changing the customer-facing component model
- Support is structured as a system:
  quote guidance, file help, status tracking, escalation, and contact shortcuts
- Cart and checkout now distinguish between:
  online-payable items and jobs that still require staff review
- Repeat-order readiness is being shaped through:
  file reuse, quote-first restart paths, order history, and status-linked support

## Recommended Core Tables

- `profiles`
  Auth-linked customer or staff profile
- `customer_addresses`
  Saved delivery and pickup-related addresses
- `customer_preferences`
  Notification preferences and repeat-business defaults
- `quote_requests`
  Quote intake record with customer details, specs, and workflow state
- `quote_line_items`
  Structured line items for future multi-item quotes
- `orders`
  Canonical order record with workflow and payment state
- `order_line_items`
  One row per configured cart item
- `artwork_uploads`
  File metadata and workflow state
- `artwork_upload_versions`
  Reuploads, replacements, review flags, and historical file lineage
- `payment_events`
  Stripe and internal payment audit records
- `invoices`
  Payable balances, issue dates, and receipt readiness
- `workflow_events`
  Timeline/audit feed for quotes, orders, uploads, and support events
- `internal_notes`
  Admin-only notes attached to quotes, orders, or customers
- `support_requests`
  Contact/support submissions with routing status
- `notifications`
  Delivery attempts, trigger names, status, and provider payload metadata
- `idempotency_keys`
  Replay protection and cached API responses for critical write paths

## Private Operational Schema

Sensitive provider and audit records should live outside the customer-readable public workflow tables.

- `private.billing_customers`
  Stripe customer identifiers and backend-only billing linkage
- `private.payment_records`
  Checkout session, payment intent, charge, refund, and captured/refunded amount tracking
- `private.webhook_events`
  Immutable receipt log for verified provider webhooks and processing results
- `private.email_deliveries`
  Provider-level delivery metadata separate from customer-visible notification state
- `catalog_products`
  Internal source-of-truth for product/service records, storefront state, and operational metadata
- `catalog_variant_groups`
  Shared attribute groups such as size, stock, finish, turnaround, and color mode
- `catalog_variant_options`
  Concrete values inside each variant group, ready for pricing and SKU rules
- `catalog_product_variant_group_links`
  Join table that attaches shared or product-specific variant groups to individual products
- `catalog_pricing_rules`
  Future pricing engine rows keyed by product, quantity tier, turnaround, option set, or staff override

## Auth and Access Model

- Customers
  Can read/update their own profile, addresses, quotes, orders, uploads, and invoices
- Admins
  Can access operational records across customers, orders, quotes, uploads, payments, and notes
- Roles
  Prepared in `lib/authz.ts`
  Current recommended source of truth: auth-linked profile role or allowlisted admin email

## Workflow Model

### Quote lifecycle

- `submitted`
- `under_review`
- `waiting_for_files`
- `quoted`
- `approved`
- `converted_to_order`
- `closed`

### Order lifecycle

- `draft`
- `quote_review_required`
- `payment_pending`
- `paid`
- `in_production`
- `ready_for_pickup`
- `shipped_delivered`
- `completed`
- `cancelled`
- `on_hold`

### Payment lifecycle

- `pending`
- `requires_action`
- `paid`
- `failed`
- `cancelled`
- `refunded`
- `demo`

## Admin and Operations Model

Internal workflows should be optimized around:

- queue-first quote review
- order production movement
- artwork/prepress review
- customer relationship context
- repeat-job reuse
- invoice and payment follow-up
- searchable workflow history

Recommended internal operational views:

- `quote queue`
  grouped by missing files, pricing-ready, awaiting customer response, and approved-for-conversion
- `order board`
  grouped by awaiting review, payment pending, in production, ready for pickup, on hold, and completed
- `upload review queue`
  grouped by awaiting review, proof required, needs changes, approved for print, and ready for production
- `customer workspace`
  showing recent orders, recent quotes, open issues, uploads, notes, and repeat-order patterns
- `product operations`
  showing storefront state, order mode, variant architecture, related FAQs, and operational notes

## Product and Variant Architecture

Separate product architecture into layers:

- `base product`
  shared title, category, description, order mode, storefront status, and support metadata
- `variant groups`
  reusable dimensions like size, stock, finish, print sides, turnaround, fulfillment, and artwork status
- `variant options`
  atomic option values with pricing hints, SKU readiness, and turnaround notes
- `product-specific overrides`
  custom groups or options needed only for signage, banners, engineering prints, mail services, or specialty work
- `pricing rules`
  future-compatible logic for quantity breaks, rush fees, material deltas, and quote-only branching
- `workflow rules`
  logic that decides when a configured item can go to cart, must go to quote, or requires staff review

This structure keeps:

- public product pages stable
- checkout configuration maintainable
- admin product management scalable
- future SKU / pricing automation feasible

## Upload Model

Every artwork file should eventually support:

- customer linkage
- quote linkage
- order linkage
- workflow state
- review notes
- storage bucket/path metadata
- MIME type and size metadata
- audit events

## Stripe Model

- Frontend creates checkout through `/api/checkout/session`
- Backend stores order draft before redirect
- Checkout requests now support backend idempotency keys and can pass that protection through to Stripe session creation
- Backend creates or reuses a Stripe customer and persists that linkage in `private.billing_customers`
- Stripe session metadata carries `orderNumber`, `paymentMode`, and review flags
- Webhook route verifies signatures and updates backend payment truth
- Webhook events should be processed exactly once using event-id replay protection before mutating payment state
- Private payment records are updated from verified webhook events and remain server-controlled
- Redirect pages are treated as UX, not source-of-truth payment state

## Automation Triggers

Prepared trigger points:

- quote received
- quote updated
- order received
- payment confirmed
- upload received
- artwork needs changes
- ready for pickup
- invoice notice
- support follow-up

## Defensive Patterns

- Rate limits stay at the API edge for quote intake, uploads, and checkout
- Shared Zod schemas validate cart, quote, request metadata, upload metadata, and Stripe session metadata
- Idempotency records protect quote submission, checkout session creation, and webhook replays from duplicate writes
- Notification delivery attempts are persisted so operational issues can be diagnosed without reading provider logs first
- Storage access is path-scoped through signed upload URLs and bucket policies rather than broad client write access
- Payment confirmation should always be webhook-driven and never inferred from success-page visits

## Recommended Next Build Steps

- Persist customer-visible timeline events in `workflow_events` and expose them to account and order-status UI
- Normalize quote and order detail snapshots so reorder and approval flows can be generated from stored line items
- Attach uploads to quotes and orders through canonical IDs instead of preview-only labels
- Add support message persistence and routing status so chat, support page, and contact flows can feed one operational inbox
- Add notification preferences and outbound delivery history so email/SMS reminders can be introduced cleanly
- Normalize admin-side catalog records into `catalog_products`, `catalog_variant_groups`, and `catalog_variant_options`
- Add staff assignments, queue ownership, and SLA timestamps to orders, quotes, uploads, and support messages
- Introduce first-class workflow transition records so status changes can be audited and filtered without parsing note text

## Operational Notes

- `print_quote_requests` remains supported as a legacy fallback table for quote intake
- New persistence prefers normalized tables such as `quote_requests`, `orders`, `order_line_items`, `artwork_uploads`, and `workflow_events`
- If Supabase server credentials or new tables are not yet available, routes degrade gracefully while logging operational warnings
