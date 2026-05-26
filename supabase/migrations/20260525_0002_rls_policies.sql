create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where auth_user_id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.current_profile_id()
returns uuid
language sql
stable
as $$
  select id
  from public.profiles
  where auth_user_id = auth.uid()
  limit 1;
$$;

alter table public.profiles enable row level security;
alter table public.customer_preferences enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.quote_requests enable row level security;
alter table public.quote_line_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_line_items enable row level security;
alter table public.artwork_uploads enable row level security;
alter table public.invoices enable row level security;
alter table public.support_requests enable row level security;
alter table public.workflow_events enable row level security;
alter table public.notifications enable row level security;
alter table public.internal_notes enable row level security;

drop policy if exists "profiles self select" on public.profiles;
create policy "profiles self select" on public.profiles
for select
using (auth_user_id = auth.uid() or public.is_admin());

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles
for update
using (auth_user_id = auth.uid() or public.is_admin())
with check (auth_user_id = auth.uid() or public.is_admin());

drop policy if exists "customer preferences self access" on public.customer_preferences;
create policy "customer preferences self access" on public.customer_preferences
for all
using (profile_id = public.current_profile_id() or public.is_admin())
with check (profile_id = public.current_profile_id() or public.is_admin());

drop policy if exists "customer addresses self access" on public.customer_addresses;
create policy "customer addresses self access" on public.customer_addresses
for all
using (profile_id = public.current_profile_id() or public.is_admin())
with check (profile_id = public.current_profile_id() or public.is_admin());

drop policy if exists "quotes self read" on public.quote_requests;
create policy "quotes self read" on public.quote_requests
for select
using (profile_id = public.current_profile_id() or email = (auth.jwt() ->> 'email') or public.is_admin());

drop policy if exists "quotes self insert" on public.quote_requests;
create policy "quotes self insert" on public.quote_requests
for insert
with check (profile_id = public.current_profile_id() or email = (auth.jwt() ->> 'email') or public.is_admin());

drop policy if exists "quotes self update" on public.quote_requests;
create policy "quotes self update" on public.quote_requests
for update
using (profile_id = public.current_profile_id() or public.is_admin())
with check (profile_id = public.current_profile_id() or public.is_admin());

drop policy if exists "quote line items self read" on public.quote_line_items;
create policy "quote line items self read" on public.quote_line_items
for select
using (
  exists (
    select 1
    from public.quote_requests qr
    where qr.quote_number = quote_line_items.quote_number
      and (qr.profile_id = public.current_profile_id() or qr.email = (auth.jwt() ->> 'email') or public.is_admin())
  )
);

drop policy if exists "orders self read" on public.orders;
create policy "orders self read" on public.orders
for select
using (profile_id = public.current_profile_id() or customer_email = (auth.jwt() ->> 'email') or public.is_admin());

drop policy if exists "orders self insert" on public.orders;
create policy "orders self insert" on public.orders
for insert
with check (profile_id = public.current_profile_id() or customer_email = (auth.jwt() ->> 'email') or public.is_admin());

drop policy if exists "orders self update" on public.orders;
create policy "orders self update" on public.orders
for update
using (profile_id = public.current_profile_id() or public.is_admin())
with check (profile_id = public.current_profile_id() or public.is_admin());

drop policy if exists "order line items self read" on public.order_line_items;
create policy "order line items self read" on public.order_line_items
for select
using (
  exists (
    select 1
    from public.orders o
    where o.order_number = order_line_items.order_number
      and (o.profile_id = public.current_profile_id() or o.customer_email = (auth.jwt() ->> 'email') or public.is_admin())
  )
);

drop policy if exists "artwork uploads self read" on public.artwork_uploads;
create policy "artwork uploads self read" on public.artwork_uploads
for select
using (profile_id = public.current_profile_id() or public.is_admin());

drop policy if exists "artwork uploads self insert" on public.artwork_uploads;
create policy "artwork uploads self insert" on public.artwork_uploads
for insert
with check (profile_id = public.current_profile_id() or public.is_admin());

drop policy if exists "artwork uploads self update" on public.artwork_uploads;
create policy "artwork uploads self update" on public.artwork_uploads
for update
using (profile_id = public.current_profile_id() or public.is_admin())
with check (profile_id = public.current_profile_id() or public.is_admin());

drop policy if exists "invoices self read" on public.invoices;
create policy "invoices self read" on public.invoices
for select
using (profile_id = public.current_profile_id() or public.is_admin());

drop policy if exists "support requests self access" on public.support_requests;
create policy "support requests self access" on public.support_requests
for all
using (profile_id = public.current_profile_id() or public.is_admin())
with check (profile_id = public.current_profile_id() or public.is_admin());

drop policy if exists "workflow events customer read" on public.workflow_events;
create policy "workflow events customer read" on public.workflow_events
for select
using (
  public.is_admin()
  or visibility = 'customer'
);

drop policy if exists "notifications admin read" on public.notifications;
create policy "notifications admin read" on public.notifications
for select
using (public.is_admin());

drop policy if exists "internal notes admin only" on public.internal_notes;
create policy "internal notes admin only" on public.internal_notes
for all
using (public.is_admin())
with check (public.is_admin());
