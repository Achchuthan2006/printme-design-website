-- PrintMe recommended Supabase schema
-- This file is intentionally additive and can be adapted into migrations.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  role text not null default 'customer',
  full_name text not null,
  email text not null unique,
  phone text,
  company_name text,
  account_status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_preferences (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  email_updates boolean not null default true,
  sms_updates boolean not null default false,
  marketing_emails boolean not null default false,
  preferred_pickup_location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  label text,
  address_line_1 text not null,
  address_line_2 text,
  city text not null,
  province text not null,
  postal_code text not null,
  country_code text not null default 'CA',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.catalog_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_id uuid references public.product_categories(id) on delete set null,
  title text not null,
  short_title text,
  storefront_description text,
  internal_description text,
  order_mode text not null default 'hybrid',
  storefront_status text not null default 'draft',
  featured boolean not null default false,
  base_turnaround_label text,
  starting_price_cents integer,
  fulfillment_modes text[] not null default '{}'::text[],
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.catalog_variant_groups (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  scope text not null default 'shared',
  input_type text not null default 'select',
  is_required boolean not null default false,
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.catalog_variant_options (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.catalog_variant_groups(id) on delete cascade,
  label text not null,
  option_value text not null,
  sku_suffix text,
  sort_order integer not null default 0,
  price_delta_cents integer,
  turnaround_delta_days integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (group_id, option_value)
);

create table if not exists public.product_variant_group_links (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.catalog_products(id) on delete cascade,
  group_id uuid not null references public.catalog_variant_groups(id) on delete cascade,
  is_required boolean,
  sort_order integer not null default 0,
  overrides jsonb not null default '{}'::jsonb,
  unique (product_id, group_id)
);

create table if not exists public.product_pricing_rules (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.catalog_products(id) on delete cascade,
  rule_name text not null,
  rule_type text not null,
  currency text not null default 'cad',
  configuration jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  quote_number text not null unique,
  profile_id uuid references public.profiles(id) on delete set null,
  status text not null default 'submitted',
  full_name text not null,
  email text not null,
  phone text not null,
  company_name text,
  service_needed text not null,
  quantity_label text not null,
  preferred_deadline text not null,
  fulfillment_method text not null,
  project_details text not null,
  request_ip inet,
  request_user_agent text,
  request_referer text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quote_line_items (
  id uuid primary key default gen_random_uuid(),
  quote_number text not null references public.quote_requests(quote_number) on delete cascade,
  product_slug text,
  title text not null,
  quantity_label text,
  pricing_mode text not null default 'quote-only',
  requested_options jsonb not null default '{}'::jsonb,
  admin_pricing_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  profile_id uuid references public.profiles(id) on delete set null,
  workflow_status text not null,
  payment_status text not null,
  payment_mode text not null,
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  customer_full_name text not null,
  customer_email text not null,
  customer_phone text not null,
  company_name text,
  fulfillment_method text not null,
  delivery_address jsonb,
  order_notes text,
  subtotal_cents integer not null default 0,
  payable_cents integer not null default 0,
  quote_review_required boolean not null default false,
  request_ip inet,
  request_user_agent text,
  request_referer text,
  snapshot jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_line_items (
  id uuid primary key default gen_random_uuid(),
  order_number text not null references public.orders(order_number) on delete cascade,
  product_slug text not null,
  title text not null,
  quantity integer not null default 1,
  unit_price_cents integer not null default 0,
  estimated_total_cents integer not null default 0,
  pricing_mode text not null,
  mode text not null,
  options jsonb not null default '{}'::jsonb,
  option_labels jsonb not null default '[]'::jsonb,
  notes text,
  fulfillment_method text,
  turnaround text,
  quote_only boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.artwork_uploads (
  id uuid primary key default gen_random_uuid(),
  file_id text not null unique,
  profile_id uuid references public.profiles(id) on delete set null,
  quote_number text references public.quote_requests(quote_number) on delete set null,
  order_number text references public.orders(order_number) on delete set null,
  product_slug text,
  scope text not null,
  status text not null,
  file_name text not null,
  mime_type text not null,
  file_size_bytes bigint not null,
  storage_bucket text not null,
  storage_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.artwork_upload_versions (
  id uuid primary key default gen_random_uuid(),
  upload_id uuid not null references public.artwork_uploads(id) on delete cascade,
  file_name text not null,
  mime_type text not null,
  file_size_bytes bigint not null,
  storage_bucket text not null,
  storage_path text,
  uploaded_by_profile_id uuid references public.profiles(id) on delete set null,
  review_status text not null default 'uploaded',
  issue_flags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  order_number text not null references public.orders(order_number) on delete cascade,
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  status text not null,
  amount_cents integer,
  currency text not null default 'cad',
  raw_event_type text,
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  order_number text references public.orders(order_number) on delete set null,
  profile_id uuid references public.profiles(id) on delete set null,
  subtotal_cents integer not null default 0,
  tax_cents integer not null default 0,
  total_cents integer not null default 0,
  balance_due_cents integer not null default 0,
  currency text not null default 'cad',
  payment_status text not null default 'pending',
  issued_at timestamptz,
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workflow_events (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  event_type text not null,
  visibility text not null default 'internal',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.internal_notes (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  author_profile_id uuid references public.profiles(id) on delete set null,
  note text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  trigger_name text not null,
  provider text not null,
  delivery_status text not null default 'pending',
  payload jsonb not null default '{}'::jsonb,
  delivered_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  ticket_number text not null unique,
  profile_id uuid references public.profiles(id) on delete set null,
  order_number text references public.orders(order_number) on delete set null,
  quote_number text references public.quote_requests(quote_number) on delete set null,
  channel text not null default 'web',
  status text not null default 'open',
  subject text not null,
  summary text not null,
  priority text not null default 'normal',
  assigned_to_profile_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.idempotency_keys (
  id uuid primary key default gen_random_uuid(),
  scope text not null,
  idempotency_key text not null,
  request_hash text not null,
  status_code integer not null default 200,
  response_body jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (scope, idempotency_key)
);

create index if not exists idx_quote_requests_email on public.quote_requests(email);
create index if not exists idx_quote_line_items_quote_number on public.quote_line_items(quote_number);
create index if not exists idx_orders_customer_email on public.orders(customer_email);
create index if not exists idx_orders_workflow_status on public.orders(workflow_status);
create index if not exists idx_artwork_uploads_order_number on public.artwork_uploads(order_number);
create index if not exists idx_artwork_uploads_quote_number on public.artwork_uploads(quote_number);
create index if not exists idx_catalog_products_category on public.catalog_products(category_id, storefront_status);
create index if not exists idx_catalog_variant_options_group on public.catalog_variant_options(group_id, sort_order);
create index if not exists idx_invoices_order_number on public.invoices(order_number);
create index if not exists idx_support_requests_profile on public.support_requests(profile_id, status);
create index if not exists idx_idempotency_scope_key on public.idempotency_keys(scope, idempotency_key);
create index if not exists idx_workflow_events_entity on public.workflow_events(entity_type, entity_id, created_at desc);
