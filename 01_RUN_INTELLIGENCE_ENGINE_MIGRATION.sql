-- KOL IDS™ Intelligence Engine migration
-- Adds the durable evidence/forecast/calibration layer required by the legacy
-- Accuracy Engine / Predictive / Campaign Control / Portfolio logic.
create table if not exists public.performance_observations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  creator_id uuid not null references public.creators(id) on delete cascade,
  observed_at timestamptz not null,
  status text not null default 'COMPLETED' check(status in ('COMPLETED','PARTIAL','INVALID')),
  source text not null default 'SELF-REPORTED',
  goal text,
  spend_thb numeric(14,2),
  revenue_thb numeric(14,2),
  reach numeric,
  impressions numeric,
  views numeric,
  likes numeric,
  comments numeric,
  shares numeric,
  clicks numeric,
  conversions numeric,
  engagement numeric,
  quality_score numeric,
  validation jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index if not exists performance_obs_org_creator_date_idx on public.performance_observations(organization_id,creator_id,observed_at desc);
create index if not exists performance_obs_org_campaign_date_idx on public.performance_observations(organization_id,campaign_id,observed_at desc);

create table if not exists public.prediction_ledger (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  creator_id uuid not null references public.creators(id) on delete cascade,
  goal text not null,
  predicted_at timestamptz not null default now(),
  actual_at timestamptz,
  predicted_score numeric,
  lower_bound numeric,
  upper_bound numeric,
  actual_score numeric,
  covered boolean,
  model_version text not null default 'SUPABASE_INTELLIGENCE_V1',
  method text not null,
  evidence jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id)
);
create index if not exists prediction_ledger_org_goal_date_idx on public.prediction_ledger(organization_id,goal,predicted_at desc);
create index if not exists prediction_ledger_org_creator_idx on public.prediction_ledger(organization_id,creator_id,predicted_at desc);

create table if not exists public.intelligence_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  run_type text not null,
  model_version text not null,
  status text not null default 'COMPLETED',
  parameters jsonb not null default '{}'::jsonb,
  result jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index if not exists intelligence_runs_org_created_idx on public.intelligence_runs(organization_id,created_at desc);

create table if not exists public.portfolio_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  budget_thb numeric(14,2) not null default 0,
  status text not null,
  portfolio_score numeric,
  confidence numeric,
  planned_spend numeric,
  budget_remaining numeric,
  risk_exposure numeric,
  coverage_score numeric,
  synergy_score numeric,
  objective text,
  result jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index if not exists portfolio_runs_org_campaign_idx on public.portfolio_runs(organization_id,campaign_id,created_at desc);

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  portfolio_run_id uuid not null references public.portfolio_runs(id) on delete cascade,
  creator_id uuid not null references public.creators(id) on delete cascade,
  rank int not null,
  allocation_thb numeric(14,2) not null default 0,
  candidate_score numeric,
  objective_alignment numeric,
  impact_score numeric,
  confidence numeric,
  risk numeric,
  evidence_score numeric,
  selection_reason text,
  metadata jsonb not null default '{}'::jsonb
);
create index if not exists portfolio_items_run_rank_idx on public.portfolio_items(portfolio_run_id,rank);

-- RLS: members can read/write their own organization's intelligence records.
alter table public.performance_observations enable row level security;
alter table public.prediction_ledger enable row level security;
alter table public.intelligence_runs enable row level security;
alter table public.portfolio_runs enable row level security;
alter table public.portfolio_items enable row level security;

do $$ begin if not exists (select 1 from pg_policies where schemaname='public' and policyname='performance_obs_member_select') then
create policy performance_obs_member_select on public.performance_observations for select using (exists(select 1 from public.organization_memberships m where m.organization_id=performance_observations.organization_id and m.user_id=auth.uid() and m.status='active'));
end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where schemaname='public' and policyname='performance_obs_member_write') then
create policy performance_obs_member_write on public.performance_observations for all using (exists(select 1 from public.organization_memberships m where m.organization_id=performance_observations.organization_id and m.user_id=auth.uid() and m.status='active')) with check (exists(select 1 from public.organization_memberships m where m.organization_id=performance_observations.organization_id and m.user_id=auth.uid() and m.status='active'));
end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where schemaname='public' and policyname='prediction_ledger_member_select') then
create policy prediction_ledger_member_select on public.prediction_ledger for select using (exists(select 1 from public.organization_memberships m where m.organization_id=prediction_ledger.organization_id and m.user_id=auth.uid() and m.status='active'));
end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where schemaname='public' and policyname='intelligence_runs_member_select') then
create policy intelligence_runs_member_select on public.intelligence_runs for select using (exists(select 1 from public.organization_memberships m where m.organization_id=intelligence_runs.organization_id and m.user_id=auth.uid() and m.status='active'));
end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where schemaname='public' and policyname='portfolio_runs_member_select') then
create policy portfolio_runs_member_select on public.portfolio_runs for select using (exists(select 1 from public.organization_memberships m where m.organization_id=portfolio_runs.organization_id and m.user_id=auth.uid() and m.status='active'));
end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where schemaname='public' and policyname='portfolio_items_member_select') then
create policy portfolio_items_member_select on public.portfolio_items for select using (exists(select 1 from public.portfolio_runs r join public.organization_memberships m on m.organization_id=r.organization_id where r.id=portfolio_items.portfolio_run_id and m.user_id=auth.uid() and m.status='active'));
end if; end $$;
