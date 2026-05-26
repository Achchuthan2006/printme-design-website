-- PrintMe legacy bootstrap schema.
-- Canonical production-ready schema changes now live in supabase/migrations
-- and the extended architecture reference lives in docs/supabase-schema.sql.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  company_name text,
  account_status text not null default 'active',
  business_notes text,
  communication_preferences jsonb not null default '{"emailUpdates": true, "smsUpdates": false, "marketingEmails": false}',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  label text not null default 'Primary',
  address_line_1 text not null,
  address_line_2 text,
  city text,
  province text,
  postal_code text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.product_categories(id),
  slug text unique not null,
  title text not null,
  description text not null,
  mode text not null default 'quote-only',
  starting_price_cents integer,
  turnaround text,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_options (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  name text not null,
  label text not null,
  option_type text not null,
  choices jsonb,
  required boolean not null default false
);

create table if not exists public.print_quote_requests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id),
  full_name text not null,
  email text not null,
  phone text not null,
  company_name text,
  service_needed text not null,
  quantity text not null,
  preferred_deadline date not null,
  fulfillment_method text not null,
  artwork_readiness text,
  budget_range text,
  project_details text not null,
  status text not null default 'new',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid references public.print_quote_requests(id) on delete cascade,
  product_id uuid references public.products(id),
  title text not null,
  quantity text,
  options jsonb,
  notes text
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id),
  quote_id uuid references public.print_quote_requests(id),
  order_number text unique not null,
  email text not null,
  phone text,
  status text not null default 'pending_review',
  fulfillment_method text not null default 'pickup',
  subtotal_cents integer not null default 0,
  tax_cents integer not null default 0,
  total_cents integer not null default 0,
  stripe_checkout_id text,
  payment_status text not null default 'unpaid',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  title text not null,
  quantity integer not null default 1,
  unit_price_cents integer not null default 0,
  options jsonb,
  notes text
);

create table if not exists public.uploads (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id),
  quote_id uuid references public.print_quote_requests(id),
  order_id uuid references public.orders(id),
  product_slug text,
  upload_context text not null default 'account',
  status text not null default 'uploaded',
  bucket text not null default 'print-files',
  path text not null,
  file_name text not null,
  file_size integer,
  mime_type text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  invoice_number text unique not null,
  pdf_path text,
  total_cents integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id),
  order_id uuid references public.orders(id),
  quote_id uuid references public.print_quote_requests(id),
  type text not null,
  channel text not null default 'email',
  status text not null default 'pending',
  payload jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.internal_notes (
  id uuid primary key default gen_random_uuid(),
  author_profile_id uuid references public.profiles(id),
  customer_profile_id uuid references public.profiles(id),
  quote_id uuid references public.print_quote_requests(id),
  order_id uuid references public.orders(id),
  upload_id uuid references public.uploads(id),
  note text not null,
  visibility text not null default 'staff_only',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.admin_activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.profiles(id),
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  previous_status text,
  next_status text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.staff_assignments (
  id uuid primary key default gen_random_uuid(),
  staff_profile_id uuid references public.profiles(id),
  order_id uuid references public.orders(id),
  quote_id uuid references public.print_quote_requests(id),
  role text not null default 'owner',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  quote text not null,
  rating integer default 5,
  approved boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_print_quote_requests_created_at on public.print_quote_requests (created_at desc);
create index if not exists idx_orders_profile_id on public.orders (profile_id);
create index if not exists idx_orders_status on public.orders (status);
create index if not exists idx_uploads_order_id on public.uploads (order_id);
create index if not exists idx_uploads_profile_id on public.uploads (profile_id);
create index if not exists idx_uploads_quote_id on public.uploads (quote_id);
create index if not exists idx_uploads_status on public.uploads (status);
create index if not exists idx_internal_notes_order_id on public.internal_notes (order_id);
create index if not exists idx_internal_notes_quote_id on public.internal_notes (quote_id);
create index if not exists idx_admin_activity_log_entity on public.admin_activity_log (entity_type, entity_id);

-- TODO admin dashboard:
-- create role-protected admin views for quotes, orders, uploads, products, pricing rules, invoices, notes, activity logs, and email events.
-- enable RLS policies for profiles, addresses, orders, uploads, and invoices before production launch.
-- add an admin/staff role to public.profiles and enforce it in Supabase RLS policies, not just UI route guards.
-- TODO auth emails:
-- configure Supabase Auth email templates for welcome, password reset, email confirmation, and account recovery.
-- TODO storage:
-- create a private Supabase Storage bucket named 'print-files' and policies that allow customers to upload to their own account/quote/order paths.
-- wire public.uploads inserts to quote, checkout, and account upload flows once authenticated IDs are available.
