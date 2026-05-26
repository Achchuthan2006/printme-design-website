create schema if not exists private;
revoke all on schema private from anon, authenticated;

create table if not exists private.billing_customers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  email text not null,
  stripe_customer_id text not null unique,
  customer_name text,
  phone text,
  is_default boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists private.payment_records (
  id uuid primary key default gen_random_uuid(),
  order_number text not null references public.orders(order_number) on delete cascade,
  invoice_id uuid references public.invoices(id) on delete set null,
  profile_id uuid references public.profiles(id) on delete set null,
  provider text not null default 'stripe',
  provider_customer_id text,
  provider_checkout_session_id text,
  provider_payment_intent_id text,
  provider_charge_id text,
  payment_mode text not null default 'full',
  status text not null default 'pending',
  amount_authorized_cents integer,
  amount_captured_cents integer,
  amount_refunded_cents integer not null default 0,
  currency text not null default 'cad',
  billing_email text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists private.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text not null unique,
  event_type text not null,
  livemode boolean not null default false,
  related_order_number text references public.orders(order_number) on delete set null,
  processing_status text not null default 'received',
  payload jsonb not null,
  processing_error text,
  received_at timestamptz not null default timezone('utc', now()),
  processed_at timestamptz
);

create table if not exists private.email_deliveries (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid references public.notifications(id) on delete set null,
  entity_type text not null,
  entity_id text not null,
  trigger_name text not null,
  recipient text not null,
  provider text not null,
  provider_message_id text,
  delivery_status text not null default 'pending',
  payload jsonb not null default '{}'::jsonb,
  sent_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_private_billing_customers_profile on private.billing_customers(profile_id);
create index if not exists idx_private_billing_customers_email on private.billing_customers(email);
create index if not exists idx_private_payment_records_order on private.payment_records(order_number, created_at desc);
create index if not exists idx_private_payment_records_checkout on private.payment_records(provider_checkout_session_id);
create index if not exists idx_private_payment_records_intent on private.payment_records(provider_payment_intent_id);
create index if not exists idx_private_webhook_events_related_order on private.webhook_events(related_order_number, received_at desc);
create index if not exists idx_private_email_deliveries_entity on private.email_deliveries(entity_type, entity_id, created_at desc);

drop trigger if exists trg_private_billing_customers_updated_at on private.billing_customers;
create trigger trg_private_billing_customers_updated_at before update on private.billing_customers for each row execute function public.set_updated_at();
drop trigger if exists trg_private_payment_records_updated_at on private.payment_records;
create trigger trg_private_payment_records_updated_at before update on private.payment_records for each row execute function public.set_updated_at();

alter table public.payment_events enable row level security;
alter table public.notifications enable row level security;
alter table public.artwork_upload_versions enable row level security;
alter table public.idempotency_keys enable row level security;
alter table public.admin_activity_logs enable row level security;
alter table public.product_categories enable row level security;
alter table public.catalog_products enable row level security;
alter table public.catalog_variant_groups enable row level security;
alter table public.catalog_variant_options enable row level security;

drop policy if exists "payment events admin read" on public.payment_events;
create policy "payment events admin read" on public.payment_events
for select
using (public.is_admin());

drop policy if exists "notifications customer scoped read" on public.notifications;
create policy "notifications customer scoped read" on public.notifications
for select
using (
  public.is_admin()
  or exists (
    select 1
    from public.orders o
    where notifications.entity_type = 'order'
      and notifications.entity_id = o.order_number
      and (o.profile_id = public.current_profile_id() or o.customer_email = (auth.jwt() ->> 'email'))
  )
  or exists (
    select 1
    from public.quote_requests q
    where notifications.entity_type = 'quote'
      and notifications.entity_id = q.quote_number
      and (q.profile_id = public.current_profile_id() or q.email = (auth.jwt() ->> 'email'))
  )
);

drop policy if exists "artwork upload versions self read" on public.artwork_upload_versions;
create policy "artwork upload versions self read" on public.artwork_upload_versions
for select
using (
  public.is_admin()
  or exists (
    select 1
    from public.artwork_uploads u
    where u.id = artwork_upload_versions.upload_id
      and u.profile_id = public.current_profile_id()
  )
);

drop policy if exists "idempotency keys admin only" on public.idempotency_keys;
create policy "idempotency keys admin only" on public.idempotency_keys
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin activity logs admin only" on public.admin_activity_logs;
create policy "admin activity logs admin only" on public.admin_activity_logs
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "active product categories public read" on public.product_categories;
create policy "active product categories public read" on public.product_categories
for select
using (is_active = true or public.is_admin());

drop policy if exists "active catalog products public read" on public.catalog_products;
create policy "active catalog products public read" on public.catalog_products
for select
using (storefront_status = 'active' or public.is_admin());

drop policy if exists "catalog variant groups public read" on public.catalog_variant_groups;
create policy "catalog variant groups public read" on public.catalog_variant_groups
for select
using (public.is_admin() or scope in ('shared', 'product_specific'));

drop policy if exists "catalog variant options public read" on public.catalog_variant_options;
create policy "catalog variant options public read" on public.catalog_variant_options
for select
using (public.is_admin() or true);

do $$
begin
  if not exists (
    select 1 from storage.buckets where id = 'print-files'
  ) then
    insert into storage.buckets (id, name, public)
    values ('print-files', 'print-files', false);
  end if;
end $$;

drop policy if exists "print files owner read" on storage.objects;
create policy "print files owner read" on storage.objects
for select
to authenticated
using (
  bucket_id = 'print-files'
  and (
    public.is_admin()
    or split_part(name, '/', 2) = auth.uid()::text
  )
);

drop policy if exists "print files owner insert" on storage.objects;
create policy "print files owner insert" on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'print-files'
  and (
    public.is_admin()
    or split_part(name, '/', 2) = auth.uid()::text
  )
);

drop policy if exists "print files owner update" on storage.objects;
create policy "print files owner update" on storage.objects
for update
to authenticated
using (
  bucket_id = 'print-files'
  and (
    public.is_admin()
    or split_part(name, '/', 2) = auth.uid()::text
  )
)
with check (
  bucket_id = 'print-files'
  and (
    public.is_admin()
    or split_part(name, '/', 2) = auth.uid()::text
  )
);

drop policy if exists "print files owner delete" on storage.objects;
create policy "print files owner delete" on storage.objects
for delete
to authenticated
using (
  bucket_id = 'print-files'
  and (
    public.is_admin()
    or split_part(name, '/', 2) = auth.uid()::text
  )
);
