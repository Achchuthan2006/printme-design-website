create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

alter table if exists public.profiles add column if not exists auth_user_id uuid unique;
alter table if exists public.profiles add column if not exists role text not null default 'customer';
alter table if exists public.profiles add column if not exists email text;
alter table if exists public.profiles add column if not exists updated_at timestamptz not null default timezone('utc', now());

create unique index if not exists idx_profiles_email_unique on public.profiles (email) where email is not null;
create unique index if not exists idx_profiles_auth_user_unique on public.profiles (auth_user_id) where auth_user_id is not null;

create table if not exists public.customer_preferences (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  email_updates boolean not null default true,
  sms_updates boolean not null default false,
  marketing_emails boolean not null default false,
  preferred_pickup_location text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
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
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
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
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
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
  created_at timestamptz not null default timezone('utc', now())
);

alter table if exists public.orders add column if not exists profile_id uuid references public.profiles(id) on delete set null;
alter table if exists public.orders add column if not exists workflow_status text not null default 'draft';
alter table if exists public.orders add column if not exists customer_full_name text;
alter table if exists public.orders add column if not exists customer_email text;
alter table if exists public.orders add column if not exists customer_phone text;
alter table if exists public.orders add column if not exists company_name text;
alter table if exists public.orders add column if not exists payment_mode text not null default 'full';
alter table if exists public.orders add column if not exists fulfillment_method text not null default 'pickup';
alter table if exists public.orders add column if not exists delivery_address jsonb;
alter table if exists public.orders add column if not exists order_notes text;
alter table if exists public.orders add column if not exists payable_cents integer not null default 0;
alter table if exists public.orders add column if not exists quote_review_required boolean not null default false;
alter table if exists public.orders add column if not exists stripe_checkout_session_id text;
alter table if exists public.orders add column if not exists stripe_payment_intent_id text;
alter table if exists public.orders add column if not exists request_ip inet;
alter table if exists public.orders add column if not exists request_user_agent text;
alter table if exists public.orders add column if not exists request_referer text;
alter table if exists public.orders add column if not exists snapshot jsonb;
alter table if exists public.orders add column if not exists updated_at timestamptz not null default timezone('utc', now());

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
  created_at timestamptz not null default timezone('utc', now())
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
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
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
  created_at timestamptz not null default timezone('utc', now())
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
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workflow_events (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  event_type text not null,
  visibility text not null default 'internal',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
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
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.internal_notes (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  author_profile_id uuid references public.profiles(id) on delete set null,
  note text not null,
  visibility text not null default 'internal',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.admin_activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.profiles(id) on delete set null,
  entity_type text not null,
  entity_id text not null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
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
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.idempotency_keys (
  id uuid primary key default gen_random_uuid(),
  scope text not null,
  idempotency_key text not null,
  request_hash text not null,
  status_code integer not null default 200,
  response_body jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  unique (scope, idempotency_key)
);

create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
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
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
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
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
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
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
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
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
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
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_quote_requests_email on public.quote_requests(email);
create index if not exists idx_quote_line_items_quote_number on public.quote_line_items(quote_number);
create index if not exists idx_orders_customer_email on public.orders(customer_email);
create index if not exists idx_orders_workflow_status on public.orders(workflow_status);
create index if not exists idx_order_line_items_order_number on public.order_line_items(order_number);
create index if not exists idx_artwork_uploads_order_number on public.artwork_uploads(order_number);
create index if not exists idx_artwork_uploads_quote_number on public.artwork_uploads(quote_number);
create index if not exists idx_artwork_uploads_profile_id on public.artwork_uploads(profile_id);
create index if not exists idx_catalog_products_category on public.catalog_products(category_id, storefront_status);
create index if not exists idx_support_requests_profile on public.support_requests(profile_id, status);
create index if not exists idx_idempotency_scope_key on public.idempotency_keys(scope, idempotency_key);
create index if not exists idx_workflow_events_entity on public.workflow_events(entity_type, entity_id, created_at desc);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists trg_customer_preferences_updated_at on public.customer_preferences;
create trigger trg_customer_preferences_updated_at before update on public.customer_preferences for each row execute function public.set_updated_at();
drop trigger if exists trg_customer_addresses_updated_at on public.customer_addresses;
create trigger trg_customer_addresses_updated_at before update on public.customer_addresses for each row execute function public.set_updated_at();
drop trigger if exists trg_quote_requests_updated_at on public.quote_requests;
create trigger trg_quote_requests_updated_at before update on public.quote_requests for each row execute function public.set_updated_at();
drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at before update on public.orders for each row execute function public.set_updated_at();
drop trigger if exists trg_artwork_uploads_updated_at on public.artwork_uploads;
create trigger trg_artwork_uploads_updated_at before update on public.artwork_uploads for each row execute function public.set_updated_at();
drop trigger if exists trg_support_requests_updated_at on public.support_requests;
create trigger trg_support_requests_updated_at before update on public.support_requests for each row execute function public.set_updated_at();
drop trigger if exists trg_invoices_updated_at on public.invoices;
create trigger trg_invoices_updated_at before update on public.invoices for each row execute function public.set_updated_at();
drop trigger if exists trg_catalog_products_updated_at on public.catalog_products;
create trigger trg_catalog_products_updated_at before update on public.catalog_products for each row execute function public.set_updated_at();
drop trigger if exists trg_catalog_variant_groups_updated_at on public.catalog_variant_groups;
create trigger trg_catalog_variant_groups_updated_at before update on public.catalog_variant_groups for each row execute function public.set_updated_at();
drop trigger if exists trg_catalog_variant_options_updated_at on public.catalog_variant_options;
create trigger trg_catalog_variant_options_updated_at before update on public.catalog_variant_options for each row execute function public.set_updated_at();
drop trigger if exists trg_product_pricing_rules_updated_at on public.product_pricing_rules;
create trigger trg_product_pricing_rules_updated_at before update on public.product_pricing_rules for each row execute function public.set_updated_at();
