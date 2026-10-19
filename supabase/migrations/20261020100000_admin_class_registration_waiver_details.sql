-- Admin-only registration report includes waiver and payment audit fields.
create or replace function public.admin_class_registrations_with_waiver_details()
returns table (
  id uuid,
  event_id uuid,
  user_id uuid,
  event_title text,
  status text,
  payment_status text,
  payment_method text,
  payment_reference text,
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  payment_verified_at timestamptz,
  payment_verified_by uuid,
  payment_waiver_reason text,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $function$
  select r.id, r.event_id, r.user_id, e.title, r.status,
    r.payment_status, r.payment_method, r.payment_reference,
    r.stripe_checkout_session_id, r.stripe_payment_intent_id,
    r.payment_verified_at, r.payment_verified_by, r.payment_waiver_reason,
    r.created_at, r.updated_at
  from public.class_registrations r
  join public.events e on e.id = r.event_id
  where public.is_admin()
  order by r.created_at desc;
$function$;

revoke all on function public.admin_class_registrations_with_waiver_details() from public, anon;
grant execute on function public.admin_class_registrations_with_waiver_details() to authenticated;
