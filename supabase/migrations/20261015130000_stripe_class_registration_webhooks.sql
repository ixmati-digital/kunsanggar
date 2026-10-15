-- Record Stripe evidence on the existing class registrations without creating
-- new payment orders or changing historical registrations.
begin;

alter table public.class_registrations
  add column if not exists stripe_checkout_session_id text,
  add column if not exists stripe_payment_intent_id text;

create unique index if not exists class_registrations_stripe_session_unique_idx
  on public.class_registrations(stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;

alter table public.class_registrations
  drop constraint if exists class_registrations_check1;
alter table public.class_registrations
  add constraint class_registrations_confirmed_payment_evidence_check
  check (
    payment_status <> 'CONFIRMED'
    or (
      payment_reference is not null
      and (payment_verified_by is not null or stripe_checkout_session_id is not null)
    )
  );

create or replace function public.protect_registration_payment_fields()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if public.is_content_manager() and not public.is_admin() and (
    new.id is distinct from old.id or
    new.event_id is distinct from old.event_id or
    new.user_id is distinct from old.user_id or
    new.created_at is distinct from old.created_at or
    new.payment_status is distinct from old.payment_status or
    new.payment_method is distinct from old.payment_method or
    new.payment_reference is distinct from old.payment_reference or
    new.payment_verified_at is distinct from old.payment_verified_at or
    new.payment_verified_by is distinct from old.payment_verified_by or
    new.stripe_checkout_session_id is distinct from old.stripe_checkout_session_id or
    new.stripe_payment_intent_id is distinct from old.stripe_payment_intent_id
  ) then
    raise exception 'Only administrators may change registration payment verification';
  end if;

  if new.payment_status = 'CONFIRMED' and old.payment_status is distinct from 'CONFIRMED' then
    if auth.role() = 'authenticated' or new.stripe_checkout_session_id is null
      or new.payment_method is distinct from 'STRIPE'
      or new.payment_reference is distinct from new.stripe_checkout_session_id
      or new.payment_verified_at is null then
      raise exception 'Stripe payment confirmation requires verified webhook evidence';
    end if;
  end if;

  if public.is_content_manager() and not public.is_admin()
    and new.status = 'APPROVED' and old.status is distinct from 'APPROVED' then
    raise exception 'Only administrators may approve a paid registration';
  end if;
  return new;
end;
$$;

drop function if exists public.admin_class_registrations_with_stripe();
create function public.admin_class_registrations_with_stripe()
returns table (
  id uuid, event_id uuid, user_id uuid, event_title text, status text,
  payment_status text, payment_method text, payment_reference text,
  stripe_checkout_session_id text, stripe_payment_intent_id text,
  payment_verified_at timestamptz, created_at timestamptz, updated_at timestamptz
)
language sql stable security definer set search_path = public as $$
  select r.id, r.event_id, r.user_id, e.title, r.status,
    r.payment_status, r.payment_method, r.payment_reference,
    r.stripe_checkout_session_id, r.stripe_payment_intent_id,
    r.payment_verified_at, r.created_at, r.updated_at
  from public.class_registrations r
  join public.events e on e.id = r.event_id
  where public.is_admin()
  order by r.created_at desc;
$$;
revoke all on function public.admin_class_registrations_with_stripe() from public, anon;
grant execute on function public.admin_class_registrations_with_stripe() to authenticated;

commit;
