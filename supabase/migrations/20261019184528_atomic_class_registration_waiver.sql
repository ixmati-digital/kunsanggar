-- Atomic, auditable ADMIN-only payment waiver and access activation.
alter table public.class_registrations
  add column if not exists payment_waiver_reason text;

create or replace function public.admin_waive_class_registration(
  p_registration_id uuid,
  p_reason text default null
)
returns table (
  id uuid,
  status text,
  payment_status text,
  payment_verified_at timestamptz,
  payment_verified_by uuid,
  payment_waiver_reason text
)
language plpgsql
security definer
set search_path = public
as $function$
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'Only administrators may waive a class registration payment';
  end if;

  return query
  update public.class_registrations as r
  set status = 'APPROVED',
      payment_status = 'WAIVED',
      payment_method = 'WAIVED',
      payment_reference = null,
      payment_verified_by = auth.uid(),
      payment_verified_at = now(),
      payment_waiver_reason = nullif(btrim(p_reason), ''),
      updated_at = now()
  where r.id = p_registration_id
    and r.status in ('PENDING', 'APPROVED')
    and r.payment_status in ('UNVERIFIED', 'REPORTED', 'WAIVED')
  returning r.id, r.status, r.payment_status, r.payment_verified_at,
            r.payment_verified_by, r.payment_waiver_reason;

  if not found then
    raise exception 'Registration is unavailable or cannot be waived';
  end if;
end;
$function$;

revoke all on function public.admin_waive_class_registration(uuid, text) from public, anon;
grant execute on function public.admin_waive_class_registration(uuid, text) to authenticated;
