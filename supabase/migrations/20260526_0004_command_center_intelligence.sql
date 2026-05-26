create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  entity_type text,
  entity_id text,
  session_id text,
  source text not null default 'web',
  path text,
  event_name text not null,
  funnel_stage text,
  properties jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.dashboard_kpi_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_date date not null,
  window_label text not null,
  metric_key text not null,
  metric_value numeric not null,
  dimensions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  unique (snapshot_date, window_label, metric_key)
);

create table if not exists public.operational_alerts (
  id uuid primary key default gen_random_uuid(),
  entity_type text,
  entity_id text,
  severity text not null default 'warning',
  category text not null,
  title text not null,
  detail text not null,
  status text not null default 'open',
  action_href text,
  metadata jsonb not null default '{}'::jsonb,
  detected_at timestamptz not null default timezone('utc', now()),
  acknowledged_at timestamptz,
  resolved_at timestamptz
);

create table if not exists public.notification_inbox (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid references public.notifications(id) on delete set null,
  recipient_profile_id uuid references public.profiles(id) on delete set null,
  audience text not null default 'customer',
  channel text not null default 'system',
  priority text not null default 'normal',
  title text not null,
  detail text not null,
  action_href text,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_analytics_events_occurred_at on public.analytics_events(occurred_at desc);
create index if not exists idx_analytics_events_name_stage on public.analytics_events(event_name, funnel_stage, occurred_at desc);
create index if not exists idx_analytics_events_entity on public.analytics_events(entity_type, entity_id, occurred_at desc);
create index if not exists idx_dashboard_kpi_snapshots_lookup on public.dashboard_kpi_snapshots(snapshot_date desc, window_label, metric_key);
create index if not exists idx_operational_alerts_status on public.operational_alerts(status, severity, detected_at desc);
create index if not exists idx_notification_inbox_recent on public.notification_inbox(created_at desc);
create index if not exists idx_notification_inbox_recipient on public.notification_inbox(recipient_profile_id, read_at, created_at desc);

alter table public.analytics_events enable row level security;
alter table public.dashboard_kpi_snapshots enable row level security;
alter table public.operational_alerts enable row level security;
alter table public.notification_inbox enable row level security;

drop policy if exists "analytics events admin read" on public.analytics_events;
create policy "analytics events admin read" on public.analytics_events
for select
using (public.is_admin());

drop policy if exists "dashboard kpi snapshots admin read" on public.dashboard_kpi_snapshots;
create policy "dashboard kpi snapshots admin read" on public.dashboard_kpi_snapshots
for select
using (public.is_admin());

drop policy if exists "operational alerts admin read" on public.operational_alerts;
create policy "operational alerts admin read" on public.operational_alerts
for select
using (public.is_admin());

drop policy if exists "notification inbox scoped read" on public.notification_inbox;
create policy "notification inbox scoped read" on public.notification_inbox
for select
using (
  public.is_admin()
  or recipient_profile_id = public.current_profile_id()
);
