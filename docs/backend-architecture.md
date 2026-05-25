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
- `app/api/stripe/webhook/route.ts`
  Verified Stripe webhook handler for payment-state truth and audit logging
- `lib/backend/schemas.ts`
  Shared Zod validation for quote intake, checkout payloads, request metadata, and Stripe metadata parsing
- `lib/backend/workflows.ts`
  Shared canonical workflow states and event names
- `lib/backend/repository.ts`
  Persistence orchestration for quotes, orders, uploads, payment audit records, and workflow events
- `lib/backend/notifications.ts`
  Notification dispatch layer and automation-readiness trigger map

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
- `payment_events`
  Stripe and internal payment audit records
- `workflow_events`
  Timeline/audit feed for quotes, orders, uploads, and support events
- `internal_notes`
  Admin-only notes attached to quotes, orders, or customers
- `support_messages`
  Contact/support submissions with routing status
- `notifications`
  Delivery attempts, trigger names, status, and provider payload metadata

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
- Stripe session metadata carries `orderNumber`, `paymentMode`, and review flags
- Webhook route verifies signatures and updates backend payment truth
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

## Recommended Next Build Steps

- Persist customer-visible timeline events in `workflow_events` and expose them to account and order-status UI
- Normalize quote and order detail snapshots so reorder and approval flows can be generated from stored line items
- Attach uploads to quotes and orders through canonical IDs instead of preview-only labels
- Add support message persistence and routing status so chat, support page, and contact flows can feed one operational inbox
- Add notification preferences and outbound delivery history so email/SMS reminders can be introduced cleanly

## Operational Notes

- `print_quote_requests` remains supported as a legacy fallback table for quote intake
- New persistence prefers normalized tables such as `quote_requests`, `orders`, `order_line_items`, `artwork_uploads`, and `workflow_events`
- If Supabase server credentials or new tables are not yet available, routes degrade gracefully while logging operational warnings
