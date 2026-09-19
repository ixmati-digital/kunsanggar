-- Kunsang Gar V1 México: Mercado Pago MXN order persistence.
-- This is additive and preserves the historical ticket_orders contract.
create extension if not exists pgcrypto;

create table if not exists public.ticket_orders (
  id uuid primary key default gen_random_uuid(),
  external_reference text unique not null,
  preference_id text,
  payment_id text,
  event_slug text not null,
  event_name text not null,
  ticket_type text,
  quantity int not null default 1,
  unit_price numeric not null,
  total_amount numeric not null,
  buyer_name text not null,
  buyer_email text not null,
  buyer_phone text not null,
  payment_status text not null default 'created',
  payment_status_detail text,
  payment_method text,
  date_approved timestamptz,
  raw_payment jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Preserve legacy rows while making the V1 contract explicit when the table
-- already exists in the project.
alter table public.ticket_orders add column if not exists currency_code text not null default 'MXN';
alter table public.ticket_orders add column if not exists preference_id text;
alter table public.ticket_orders add column if not exists payment_id text;
alter table public.ticket_orders add column if not exists payment_status_detail text;
alter table public.ticket_orders add column if not exists payment_method text;
alter table public.ticket_orders add column if not exists date_approved timestamptz;
alter table public.ticket_orders add column if not exists raw_payment jsonb;
alter table public.ticket_orders add column if not exists created_at timestamptz default now();
alter table public.ticket_orders add column if not exists updated_at timestamptz default now();

create index if not exists ticket_orders_external_reference_idx on public.ticket_orders (external_reference);
create index if not exists ticket_orders_payment_status_idx on public.ticket_orders (payment_status);
create index if not exists ticket_orders_event_slug_idx on public.ticket_orders (event_slug);
create index if not exists ticket_orders_buyer_email_idx on public.ticket_orders (buyer_email);
create index if not exists ticket_orders_created_at_idx on public.ticket_orders (created_at desc);

create or replace function public.set_ticket_orders_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists ticket_orders_updated_at on public.ticket_orders;
create trigger ticket_orders_updated_at
before update on public.ticket_orders
for each row execute function public.set_ticket_orders_updated_at();

-- Browser clients must not read or write payment orders directly. The
-- serverless preference/webhook handlers use the service role key.
alter table public.ticket_orders enable row level security;

-- The public checkout never reads this table. Only an authenticated ADMIN may
-- read it through the Supabase anon client used by /admin/orders.html.
drop policy if exists ticket_orders_admin_read on public.ticket_orders;
create policy ticket_orders_admin_read
on public.ticket_orders
for select
using (public.is_admin());
