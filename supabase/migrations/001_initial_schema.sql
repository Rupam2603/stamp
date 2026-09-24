create extension if not exists pgcrypto;
create extension if not exists citext;

do $$ begin
  create type public.user_role as enum ('owner','manager','staff');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.consent_channel as enum ('whatsapp','sms','email');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.reward_status as enum ('issued','redeemed','expired','cancelled');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.campaign_status as enum ('draft','active','paused','completed');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.stamp_event_type as enum ('earned','reversed','manual_adjustment');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.cafes(
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug citext unique not null,
  logo_url text,
  google_review_url text,
  phone text,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.branches(
  id uuid primary key default gen_random_uuid(),
  cafe_id uuid not null references public.cafes(id) on delete cascade,
  name text not null,
  address text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.staff_profiles(
  id uuid primary key references auth.users(id) on delete cascade,
  cafe_id uuid not null references public.cafes(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  full_name text not null,
  role public.user_role not null default 'staff',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.customers(
  id uuid primary key default gen_random_uuid(),
  cafe_id uuid not null references public.cafes(id) on delete cascade,
  full_name text,
  mobile text not null,
  email citext,
  mobile_verified_at timestamptz,
  email_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(cafe_id,mobile)
);

create table if not exists public.customer_consents(
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  channel public.consent_channel not null,
  opted_in boolean not null,
  notice_version text not null,
  consent_text text not null,
  source text not null default 'customer_web',
  consented_at timestamptz,
  withdrawn_at timestamptz,
  created_at timestamptz not null default now(),
  unique(customer_id,channel)
);

create table if not exists public.loyalty_programs(
  id uuid primary key default gen_random_uuid(),
  cafe_id uuid not null references public.cafes(id) on delete cascade,
  name text not null,
  stamps_required integer not null check(stamps_required>0),
  reward_title text not null,
  reward_description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.customer_loyalty_cards(
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.loyalty_programs(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  stamp_count integer not null default 0 check(stamp_count>=0),
  completed_cards integer not null default 0 check(completed_cards>=0),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(program_id,customer_id)
);

create table if not exists public.stamp_events(
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.customer_loyalty_cards(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  event_type public.stamp_event_type not null,
  quantity integer not null check(quantity<>0),
  bill_reference text,
  staff_id uuid references public.staff_profiles(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.scratch_campaigns(
  id uuid primary key default gen_random_uuid(),
  cafe_id uuid not null references public.cafes(id) on delete cascade,
  name text not null,
  description text,
  status public.campaign_status not null default 'draft',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  one_per_customer boolean not null default true,
  reward_expiry_days integer,
  created_by uuid references public.staff_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  check(ends_at>starts_at)
);

create table if not exists public.scratch_prizes(
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.scratch_campaigns(id) on delete cascade,
  title text not null,
  description text,
  probability numeric(8,6) not null check(probability between 0 and 1),
  quantity_limit integer check(quantity_limit is null or quantity_limit>=0),
  active boolean not null default true
);

create table if not exists public.scratch_claims(
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.scratch_campaigns(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  prize_id uuid references public.scratch_prizes(id) on delete set null,
  status public.reward_status not null default 'issued',
  redemption_code text not null unique,
  activated_at timestamptz not null default now(),
  expires_at timestamptz,
  redeemed_at timestamptz,
  redeemed_by uuid references public.staff_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create unique index if not exists one_claim_per_campaign_customer on public.scratch_claims(campaign_id,customer_id);

create table if not exists public.offers(
  id uuid primary key default gen_random_uuid(),
  cafe_id uuid not null references public.cafes(id) on delete cascade,
  title text not null,
  description text,
  image_url text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  active boolean not null default true,
  created_by uuid references public.staff_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  check(ends_at>starts_at)
);

create table if not exists public.offer_deliveries(
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.offers(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  channel public.consent_channel not null,
  status text not null default 'pending',
  provider_message_id text,
  sent_at timestamptz,
  failure_reason text
);

alter table public.cafes enable row level security;
alter table public.branches enable row level security;
alter table public.staff_profiles enable row level security;
alter table public.customers enable row level security;
alter table public.customer_consents enable row level security;
alter table public.loyalty_programs enable row level security;
alter table public.customer_loyalty_cards enable row level security;
alter table public.stamp_events enable row level security;
alter table public.scratch_campaigns enable row level security;
alter table public.scratch_prizes enable row level security;
alter table public.scratch_claims enable row level security;
alter table public.offers enable row level security;
alter table public.offer_deliveries enable row level security;
