-- KOL IDS™ Cloud Production Foundation v2
-- Multi-tenant customer access, trial, paid subscriptions, seats, orders and RLS.
-- Safe for Supabase/Postgres. No service-role secret belongs in the browser.

create extension if not exists pgcrypto;

-- ============================================================
-- 1. COMMERCIAL CATALOG
-- ============================================================
create table if not exists public.plans (
  code text primary key,
  name text not null,
  duration_days int not null check (duration_days > 0),
  price_thb numeric(12,2) not null default 0,
  seats int not null check (seats > 0),
  is_trial boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.plans(code,name,duration_days,price_thb,seats,is_trial)
values
('TRIAL_7','7-Day Trial',7,0,1,true),
('PLAN_3M','3 Months',90,39000,1,false),
('PLAN_6M','6 Months',180,73900,2,false),
('PLAN_12M','12 Months',365,139000,3,false)
on conflict (code) do update set
  name=excluded.name,
  duration_days=excluded.duration_days,
  price_thb=excluded.price_thb,
  seats=excluded.seats,
  is_trial=excluded.is_trial,
  updated_at=now();

-- ============================================================
-- 2. TENANT / ORGANIZATION
-- ============================================================
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text,
  created_by uuid not null references auth.users(id),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Existing databases may already have organizations without slug.
-- Keep this migration idempotent so rerunning schema.sql upgrades them safely.
alter table public.organizations
  add column if not exists slug text;

create unique index if not exists organizations_slug_uq
  on public.organizations(slug) where slug is not null;

create table if not exists public.organization_memberships (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check(role in ('owner','admin','member')),
  status text not null default 'active' check(status in ('active','invited','suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key(organization_id,user_id)
);

create index if not exists organization_memberships_user_idx
  on public.organization_memberships(user_id,status);
create index if not exists organization_memberships_org_idx
  on public.organization_memberships(organization_id,status);

-- Customer profile: non-sensitive application identity only.
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  company_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 3. ORDERS / SUBSCRIPTIONS / BILLING STATE
-- ============================================================
create table if not exists public.customer_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  requested_by uuid references auth.users(id),
  plan_code text not null references public.plans(code),
  status text not null default 'pending' check(status in ('pending','paid','approved','cancelled','expired','failed')),
  payment_status text not null default 'unpaid' check(payment_status in ('unpaid','pending','paid','refunded','failed')),
  amount_thb numeric(12,2) not null default 0,
  currency text not null default 'THB',
  provider text,
  provider_reference text,
  customer_email text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz,
  approved_at timestamptz,
  approved_by uuid references auth.users(id)
);

create index if not exists customer_orders_org_idx on public.customer_orders(organization_id,created_at desc);
create index if not exists customer_orders_email_idx on public.customer_orders(lower(customer_email));
create unique index if not exists customer_orders_provider_ref_uq
  on public.customer_orders(provider,provider_reference)
  where provider is not null and provider_reference is not null;

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  plan_code text not null references public.plans(code),
  order_id uuid references public.customer_orders(id),
  status text not null default 'pending' check(status in ('pending','active','expired','cancelled','suspended')),
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  approved_at timestamptz,
  approved_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_org_idx on public.subscriptions(organization_id,status,expires_at desc);
create unique index if not exists subscriptions_one_active_org_uq
  on public.subscriptions(organization_id)
  where status='active';

create table if not exists public.subscription_events (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid references public.subscriptions(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  order_id uuid references public.customer_orders(id) on delete set null,
  event_type text not null,
  actor_user_id uuid references auth.users(id),
  provider text,
  provider_event_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create unique index if not exists subscription_events_provider_uq
  on public.subscription_events(provider,provider_event_id)
  where provider is not null and provider_event_id is not null;

create table if not exists public.trial_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  redeemed_at timestamptz not null default now()
);

create unique index if not exists trial_redemptions_email_uq on public.trial_redemptions(lower(email));

create table if not exists public.platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'platform_admin',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Keep legacy sales_requests compatible.
create table if not exists public.sales_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  requested_plan text not null,
  status text not null default 'pending',
  amount_thb numeric(12,2),
  payload jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid references auth.users(id)
);

-- ============================================================
-- 4. PRODUCT DATA
-- ============================================================
create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  status text default 'draft',
  payload jsonb default '{}'::jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.audiences (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  name text not null,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.creators (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.creator_decisions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  creator_id uuid references public.creators(id) on delete set null,
  decision text,
  score numeric,
  evidence jsonb default '{}'::jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create table if not exists public.review_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  status text default 'draft',
  payload jsonb default '{}'::jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create table if not exists public.generated_impacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.reports_evidence (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 5. HARDENED AUTHORIZATION HELPERS
-- ============================================================
create or replace function public.is_org_member(target_org uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists(
    select 1 from public.organization_memberships m
    where m.organization_id=target_org
      and m.user_id=(select auth.uid())
      and m.status='active'
  );
$$;

create or replace function public.is_org_admin(p_org uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists(
    select 1 from public.organization_memberships m
    where m.organization_id=p_org
      and m.user_id=(select auth.uid())
      and m.status='active'
      and m.role in ('owner','admin')
  );
$$;

create or replace function public.is_platform_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists(
    select 1 from public.platform_admins a
    where a.user_id=(select auth.uid()) and a.active=true
  );
$$;

create or replace function public.has_active_subscription(p_org uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists(
    select 1
    from public.subscriptions s
    join public.plans p on p.code=s.plan_code and p.active=true
    where s.organization_id=p_org
      and s.status='active'
      and s.starts_at <= now()
      and (s.expires_at is null or s.expires_at > now())
  );
$$;

create or replace function public.active_subscription(p_org uuid)
returns jsonb
language sql stable security definer
set search_path = ''
as $$
  select coalesce((
    select jsonb_build_object(
      'subscription',to_jsonb(s),
      'plan',to_jsonb(p)
    )
    from public.subscriptions s
    join public.plans p on p.code=s.plan_code
    where s.organization_id=p_org
      and s.status='active'
      and s.starts_at <= now()
      and (s.expires_at is null or s.expires_at > now())
    order by s.expires_at desc nulls last, s.created_at desc
    limit 1
  ), '{}'::jsonb);
$$;

create or replace function public.current_org_id()
returns uuid
language sql stable security definer
set search_path = ''
as $$
  select m.organization_id
  from public.organization_memberships m
  where m.user_id=(select auth.uid()) and m.status='active'
  order by m.created_at asc
  limit 1;
$$;

-- ============================================================
-- 6. CUSTOMER PROVISIONING (called by trusted Edge Function)
-- ============================================================
create or replace function public.provision_customer_account(
  p_user_id uuid,
  p_email text,
  p_name text,
  p_plan_code text,
  p_organization_name text default null
)
returns jsonb
language plpgsql security definer
set search_path = ''
as $$
declare
  v_plan public.plans;
  v_org public.organizations;
  v_membership public.organization_memberships;
  v_sub public.subscriptions;
  v_order public.customer_orders;
  v_email text := lower(trim(p_email));
  v_org_name text := coalesce(nullif(trim(p_organization_name),''), split_part(v_email,'@',1) || ' Organization');
  v_order_no text;
begin
  if p_user_id is null or v_email='' then raise exception 'Invalid customer identity'; end if;
  select * into v_plan from public.plans where code=p_plan_code and active=true;
  if v_plan.code is null then raise exception 'Unknown or inactive plan'; end if;

  insert into public.profiles(user_id,email,display_name,company_name)
  values(p_user_id,v_email,nullif(trim(p_name),''),nullif(trim(p_organization_name),''))
  on conflict(user_id) do update set email=excluded.email,display_name=coalesce(excluded.display_name,public.profiles.display_name),company_name=coalesce(excluded.company_name,public.profiles.company_name),updated_at=now();

  select o.* into v_org
  from public.organizations o
  join public.organization_memberships m on m.organization_id=o.id
  where m.user_id=p_user_id and m.status='active'
  order by o.created_at asc limit 1;

  if v_org.id is null then
    insert into public.organizations(name,created_by,slug)
    values(v_org_name,p_user_id,regexp_replace(lower(v_org_name),'[^a-z0-9]+','-','g') || '-' || substr(replace(gen_random_uuid()::text,'-',''),1,8))
    returning * into v_org;
    insert into public.organization_memberships(organization_id,user_id,role,status)
    values(v_org.id,p_user_id,'owner','active') returning * into v_membership;
  else
    select * into v_membership from public.organization_memberships where organization_id=v_org.id and user_id=p_user_id;
  end if;

  if v_plan.is_trial then
    if exists(select 1 from public.trial_redemptions where lower(email)=v_email) then
      raise exception 'Trial already used for this email';
    end if;
    insert into public.subscriptions(organization_id,plan_code,status,starts_at,expires_at)
    values(v_org.id,v_plan.code,'active',now(),now() + make_interval(days=>v_plan.duration_days))
    returning * into v_sub;
    insert into public.trial_redemptions(user_id,email,organization_id,subscription_id)
    values(p_user_id,v_email,v_org.id,v_sub.id);
    insert into public.subscription_events(subscription_id,organization_id,event_type,actor_user_id,payload)
    values(v_sub.id,v_org.id,'trial_activated',p_user_id,jsonb_build_object('plan',v_plan.code));
  else
    v_order_no := 'KID-' || to_char(now(),'YYYYMMDDHH24MISS') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,6));
    insert into public.customer_orders(order_number,organization_id,requested_by,plan_code,status,payment_status,amount_thb,customer_email,payload)
    values(v_order_no,v_org.id,p_user_id,v_plan.code,'pending','unpaid',v_plan.price_thb,v_email,jsonb_build_object('source','customer_signup'))
    returning * into v_order;
    insert into public.subscriptions(organization_id,plan_code,order_id,status,starts_at,expires_at)
    values(v_org.id,v_plan.code,v_order.id,'pending',now(),null)
    returning * into v_sub;
    insert into public.subscription_events(subscription_id,organization_id,order_id,event_type,actor_user_id,payload)
    values(v_sub.id,v_org.id,'order_created',p_user_id,jsonb_build_object('order_number',v_order.order_number,'plan',v_plan.code));
  end if;

  return jsonb_build_object(
    'user_id',p_user_id,
    'organization',to_jsonb(v_org),
    'membership',to_jsonb(v_membership),
    'subscription',to_jsonb(v_sub),
    'plan',to_jsonb(v_plan),
    'order',case when v_order.id is null then null else to_jsonb(v_order) end,
    'access_granted',v_plan.is_trial,
    'message',case when v_plan.is_trial then 'Trial activated' else 'Account created; payment approval is required before workspace access' end
  );
end;
$$;
revoke all on function public.provision_customer_account(uuid,text,text,text,text) from public,anon,authenticated;
grant execute on function public.provision_customer_account(uuid,text,text,text,text) to service_role;

-- ============================================================
-- 7. WORKSPACE BOOTSTRAP / ACCESS CONTRACT
-- ============================================================
create or replace function public.bootstrap_workspace(p_name text default null)
returns jsonb
language plpgsql security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_org public.organizations;
  v_membership public.organization_memberships;
  v_sub public.subscriptions;
  v_plan public.plans;
  v_access boolean := false;
  v_reason text := 'NO_ACTIVE_SUBSCRIPTION';
  v_email text;
begin
  if v_uid is null then raise exception 'Authentication required'; end if;
  select email into v_email from auth.users where id=v_uid;

  select o.* into v_org
  from public.organizations o
  join public.organization_memberships m on m.organization_id=o.id
  where m.user_id=v_uid and m.status='active'
  order by o.created_at asc limit 1;

  -- Backward-compatible first login: legacy accounts receive one trial only.
  if v_org.id is null then
    if exists(select 1 from public.trial_redemptions where lower(email)=lower(coalesce(v_email,''))) then
      raise exception 'Account is not provisioned for a workspace';
    end if;
    insert into public.organizations(name,created_by,slug)
    values(coalesce(nullif(trim(p_name),''),split_part(coalesce(v_email,'customer'),'@',1) || ' Organization'),v_uid,regexp_replace(lower(coalesce(nullif(trim(p_name),''),split_part(coalesce(v_email,'customer'),'@',1) || '-organization')),'[^a-z0-9]+','-','g') || '-' || substr(replace(gen_random_uuid()::text,'-',''),1,8))
    returning * into v_org;
    insert into public.organization_memberships(organization_id,user_id,role,status)
    values(v_org.id,v_uid,'owner','active') returning * into v_membership;
    select * into v_plan from public.plans where code='TRIAL_7';
    insert into public.subscriptions(organization_id,plan_code,status,starts_at,expires_at)
    values(v_org.id,'TRIAL_7','active',now(),now()+make_interval(days=>v_plan.duration_days)) returning * into v_sub;
    insert into public.trial_redemptions(user_id,email,organization_id,subscription_id)
    values(v_uid,lower(coalesce(v_email,'')),v_org.id,v_sub.id)
    on conflict (lower(email)) do nothing;
    insert into public.subscription_events(subscription_id,organization_id,event_type,actor_user_id,payload)
    values(v_sub.id,v_org.id,'legacy_trial_activated',v_uid,'{"source":"bootstrap_workspace"}'::jsonb);
    v_access:=true; v_reason:='ACTIVE';
  else
    select * into v_membership from public.organization_memberships where organization_id=v_org.id and user_id=v_uid;
    -- Expire stale subscriptions deterministically when workspace is opened.
    update public.subscriptions
      set status='expired',updated_at=now()
      where organization_id=v_org.id and status='active' and expires_at is not null and expires_at<=now();
    select * into v_sub from public.subscriptions where organization_id=v_org.id and status='active' and starts_at<=now() and (expires_at is null or expires_at>now()) order by expires_at desc nulls last,created_at desc limit 1;
    if v_sub.id is not null then
      select * into v_plan from public.plans where code=v_sub.plan_code;
      v_access:=true; v_reason:='ACTIVE';
    else
      select * into v_sub from public.subscriptions where organization_id=v_org.id order by created_at desc limit 1;
      if v_sub.status='pending' then v_reason:='PAYMENT_PENDING';
      elsif v_sub.status='expired' then v_reason:='SUBSCRIPTION_EXPIRED';
      elsif v_sub.status='cancelled' then v_reason:='SUBSCRIPTION_CANCELLED';
      else v_reason:='NO_ACTIVE_SUBSCRIPTION'; end if;
      select * into v_plan from public.plans where code=coalesce(v_sub.plan_code,'TRIAL_7');
    end if;
  end if;

  return jsonb_build_object(
    'profile',jsonb_build_object('user_id',v_uid,'email',v_email),
    'organization',to_jsonb(v_org),
    'membership',to_jsonb(v_membership),
    'subscription',case when v_sub.id is null then null else to_jsonb(v_sub) end,
    'plan',case when v_plan.code is null then null else to_jsonb(v_plan) end,
    'access_granted',v_access,
    'access_reason',v_reason,
    'server_time',now()
  );
end;
$$;

revoke all on function public.is_org_member(uuid) from public,anon,authenticated;
grant execute on function public.is_org_member(uuid) to authenticated;
revoke all on function public.is_org_admin(uuid) from public,anon,authenticated;
grant execute on function public.is_org_admin(uuid) to authenticated;
revoke all on function public.is_platform_admin() from public,anon,authenticated;
grant execute on function public.is_platform_admin() to authenticated;
revoke all on function public.has_active_subscription(uuid) from public,anon,authenticated;
grant execute on function public.has_active_subscription(uuid) to authenticated;
revoke all on function public.active_subscription(uuid) from public,anon,authenticated;
grant execute on function public.active_subscription(uuid) to authenticated;
revoke all on function public.current_org_id() from public,anon,authenticated;
grant execute on function public.current_org_id() to authenticated;
revoke all on function public.bootstrap_workspace(text) from public,anon;
grant execute on function public.bootstrap_workspace(text) to authenticated;

-- ============================================================
-- 8. ADMIN ORDER ACTIVATION
-- ============================================================
create or replace function public.admin_activate_order(p_order_id uuid,p_provider text default null,p_provider_reference text default null)
returns jsonb
language plpgsql security definer
set search_path = ''
as $$
declare
  v_order public.customer_orders;
  v_plan public.plans;
  v_sub public.subscriptions;
  v_now timestamptz:=now();
begin
  if not public.is_platform_admin() then raise exception 'Platform admin permission required'; end if;
  select * into v_order from public.customer_orders where id=p_order_id for update;
  if v_order.id is null then raise exception 'Order not found'; end if;
  if v_order.status in ('cancelled','failed','expired') then raise exception 'Order is not activatable'; end if;
  select * into v_plan from public.plans where code=v_order.plan_code and active=true;
  if v_plan.code is null then raise exception 'Plan unavailable'; end if;

  update public.subscriptions
  set status='cancelled',updated_at=v_now
  where organization_id=v_order.organization_id and status='active';

  select * into v_sub from public.subscriptions where order_id=v_order.id order by created_at desc limit 1;
  if v_sub.id is null then
    insert into public.subscriptions(organization_id,plan_code,order_id,status,starts_at,expires_at,approved_at,approved_by)
    values(v_order.organization_id,v_order.plan_code,v_order.id,'active',v_now,v_now+make_interval(days=>v_plan.duration_days),v_now,(select auth.uid())) returning * into v_sub;
  else
    update public.subscriptions
    set status='active',starts_at=v_now,expires_at=v_now+make_interval(days=>v_plan.duration_days),approved_at=v_now,approved_by=(select auth.uid()),updated_at=v_now
    where id=v_sub.id returning * into v_sub;
  end if;

  update public.customer_orders
  set status='approved',payment_status='paid',paid_at=coalesce(paid_at,v_now),approved_at=v_now,approved_by=(select auth.uid()),provider=coalesce(p_provider,provider),provider_reference=coalesce(p_provider_reference,provider_reference),updated_at=v_now
  where id=v_order.id;

  insert into public.subscription_events(subscription_id,organization_id,order_id,event_type,actor_user_id,provider,provider_event_id,payload)
  values(v_sub.id,v_order.organization_id,v_order.id,'subscription_activated',(select auth.uid()),p_provider,p_provider_reference,jsonb_build_object('plan',v_plan.code));

  return jsonb_build_object('ok',true,'order_id',v_order.id,'subscription',to_jsonb(v_sub),'plan',to_jsonb(v_plan));
end;
$$;
revoke all on function public.admin_activate_order(uuid,text,text) from public,anon,authenticated;
grant execute on function public.admin_activate_order(uuid,text,text) to authenticated;

-- ============================================================
-- 9. MEMBER INVITES / SEAT ENFORCEMENT
-- ============================================================
create or replace function public.invite_member(p_email text)
returns jsonb
language plpgsql security definer
set search_path = ''
as $$
declare
  v_org uuid:=public.current_org_id();
  v_seats int;
  v_used int;
  v_email text:=lower(trim(p_email));
begin
  if v_org is null or not public.is_org_admin(v_org) then raise exception 'Organization admin permission required'; end if;
  if v_email='' or position('@' in v_email)=0 then raise exception 'Valid email required'; end if;
  select p.seats into v_seats from public.subscriptions s join public.plans p on p.code=s.plan_code where s.organization_id=v_org and s.status='active' and s.starts_at<=now() and (s.expires_at is null or s.expires_at>now()) order by s.expires_at desc nulls last limit 1;
  if v_seats is null then raise exception 'Active subscription required'; end if;
  select count(*) into v_used from public.organization_memberships where organization_id=v_org and status in ('active','invited');
  if v_used >= v_seats then raise exception 'Seat limit reached for this plan'; end if;
  return jsonb_build_object('ok',true,'organization_id',v_org,'email',v_email,'remaining_seats',v_seats-v_used-1);
end;
$$;
revoke all on function public.invite_member(text) from public,anon;
grant execute on function public.invite_member(text) to authenticated;

-- ============================================================
-- 10. RLS
-- ============================================================
alter table public.plans enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.profiles enable row level security;
alter table public.customer_orders enable row level security;
alter table public.subscriptions enable row level security;
alter table public.subscription_events enable row level security;
alter table public.trial_redemptions enable row level security;
alter table public.platform_admins enable row level security;
alter table public.campaigns enable row level security;
alter table public.audiences enable row level security;
alter table public.creators enable row level security;
alter table public.creator_decisions enable row level security;
alter table public.review_runs enable row level security;
alter table public.generated_impacts enable row level security;
alter table public.reports_evidence enable row level security;
alter table public.sales_requests enable row level security;

do $$
declare r record;
begin
  for r in select policyname,tablename from pg_policies where schemaname='public' and tablename in ('plans','organizations','organization_memberships','profiles','customer_orders','subscriptions','subscription_events','trial_redemptions','platform_admins','campaigns','audiences','creators','creator_decisions','review_runs','generated_impacts','reports_evidence','sales_requests') loop
    execute format('drop policy if exists %I on public.%I',r.policyname,r.tablename);
  end loop;
end $$;

create policy plans_public_read on public.plans for select to anon,authenticated using (active=true);
create policy org_member_read on public.organizations for select to authenticated using ((select public.is_org_member(id)));
create policy member_read on public.organization_memberships for select to authenticated using ((select public.is_org_member(organization_id)));
create policy profile_self_read on public.profiles for select to authenticated using (user_id=(select auth.uid()));
create policy profile_self_update on public.profiles for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
create policy sub_member_read on public.subscriptions for select to authenticated using ((select public.is_org_member(organization_id)));
create policy order_member_read on public.customer_orders for select to authenticated using ((select public.is_org_member(organization_id)) and requested_by=(select auth.uid()));
create policy event_member_read on public.subscription_events for select to authenticated using ((select public.is_org_member(organization_id)));

-- Product data: authenticated + active entitlement only.
create policy campaign_select on public.campaigns for select to authenticated using ((select public.is_org_member(organization_id)));
create policy campaign_insert on public.campaigns for insert to authenticated with check ((select public.is_org_member(organization_id)) and (select public.has_active_subscription(organization_id)) and created_by=(select auth.uid()));
create policy campaign_update on public.campaigns for update to authenticated using ((select public.is_org_member(organization_id)) and (select public.has_active_subscription(organization_id))) with check ((select public.is_org_member(organization_id)) and (select public.has_active_subscription(organization_id)));
create policy campaign_delete on public.campaigns for delete to authenticated using ((select public.is_org_member(organization_id)) and (select public.has_active_subscription(organization_id)));

create policy audience_select on public.audiences for select to authenticated using ((select public.is_org_member(organization_id)));
create policy audience_insert on public.audiences for insert to authenticated with check ((select public.is_org_member(organization_id)) and (select public.has_active_subscription(organization_id)));
create policy audience_update on public.audiences for update to authenticated using ((select public.is_org_member(organization_id)) and (select public.has_active_subscription(organization_id))) with check ((select public.is_org_member(organization_id)) and (select public.has_active_subscription(organization_id)));
create policy audience_delete on public.audiences for delete to authenticated using ((select public.is_org_member(organization_id)) and (select public.has_active_subscription(organization_id)));

create policy creator_select on public.creators for select to authenticated using ((select public.is_org_member(organization_id)));
create policy creator_insert on public.creators for insert to authenticated with check ((select public.is_org_member(organization_id)) and (select public.has_active_subscription(organization_id)));
create policy creator_update on public.creators for update to authenticated using ((select public.is_org_member(organization_id)) and (select public.has_active_subscription(organization_id))) with check ((select public.is_org_member(organization_id)) and (select public.has_active_subscription(organization_id)));
create policy creator_delete on public.creators for delete to authenticated using ((select public.is_org_member(organization_id)) and (select public.has_active_subscription(organization_id)));

create policy decision_select on public.creator_decisions for select to authenticated using ((select public.is_org_member(organization_id)));
create policy decision_insert on public.creator_decisions for insert to authenticated with check ((select public.is_org_member(organization_id)) and (select public.has_active_subscription(organization_id)) and created_by=(select auth.uid()));
create policy decision_update on public.creator_decisions for update to authenticated using ((select public.is_org_member(organization_id)) and (select public.has_active_subscription(organization_id))) with check ((select public.is_org_member(organization_id)) and (select public.has_active_subscription(organization_id)));
create policy decision_delete on public.creator_decisions for delete to authenticated using ((select public.is_org_member(organization_id)) and (select public.has_active_subscription(organization_id)));

create policy review_select on public.review_runs for select to authenticated using ((select public.is_org_member(organization_id)));
create policy review_insert on public.review_runs for insert to authenticated with check ((select public.is_org_member(organization_id)) and (select public.has_active_subscription(organization_id)) and created_by=(select auth.uid()));
create policy impact_select on public.generated_impacts for select to authenticated using ((select public.is_org_member(organization_id)));
create policy impact_insert on public.generated_impacts for insert to authenticated with check ((select public.is_org_member(organization_id)) and (select public.has_active_subscription(organization_id)));
create policy evidence_select on public.reports_evidence for select to authenticated using ((select public.is_org_member(organization_id)));
create policy evidence_insert on public.reports_evidence for insert to authenticated with check ((select public.is_org_member(organization_id)) and (select public.has_active_subscription(organization_id)));

-- No browser insert/update/delete on commercial authority tables.
-- customer_orders, subscriptions, subscription_events, trial_redemptions and platform_admins are server controlled.

-- ============================================================
-- 11. PERFORMANCE INDEXES
-- ============================================================
create index if not exists campaigns_org_created_idx on public.campaigns(organization_id,created_at desc);
create index if not exists audiences_org_campaign_idx on public.audiences(organization_id,campaign_id,created_at desc);
create index if not exists creators_org_created_idx on public.creators(organization_id,created_at desc);
create index if not exists decisions_org_campaign_idx on public.creator_decisions(organization_id,campaign_id,created_at desc);
create index if not exists review_runs_org_campaign_idx on public.review_runs(organization_id,campaign_id,created_at desc);

-- Restrict direct table grants where commercial authority is concerned.
revoke all on table public.customer_orders,public.subscriptions,public.subscription_events,public.trial_redemptions,public.platform_admins from anon;
revoke insert,update,delete on table public.customer_orders,public.subscriptions,public.subscription_events,public.trial_redemptions,public.platform_admins from authenticated;

-- ============================================================
-- 12. OPTIONAL ACCESS VIEW (RLS INVOKER SAFE)
-- ============================================================
create or replace view public.my_workspace_access
with (security_invoker=true)
as
select
  o.id as organization_id,
  o.name as organization_name,
  m.user_id,
  m.role,
  s.id as subscription_id,
  s.status as subscription_status,
  s.starts_at,
  s.expires_at,
  p.code as plan_code,
  p.name as plan_name,
  p.seats,
  p.price_thb,
  (s.status='active' and s.starts_at<=now() and (s.expires_at is null or s.expires_at>now())) as access_granted
from public.organizations o
join public.organization_memberships m on m.organization_id=o.id and m.user_id=(select auth.uid()) and m.status='active'
left join lateral (
  select * from public.subscriptions sx where sx.organization_id=o.id order by (sx.status='active') desc,sx.created_at desc limit 1
) s on true
left join public.plans p on p.code=s.plan_code;
