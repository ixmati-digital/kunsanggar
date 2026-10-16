-- Prevent an approved class registration without verified Stripe payment or
-- an administrator-authorized waiver. Access synchronization then grants the
-- program enrollment only for this approved and paid/waived state.
begin;

create or replace function public.require_verified_payment_before_approval()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'APPROVED'
    and new.payment_status not in ('CONFIRMED', 'WAIVED') then
    raise exception 'Registration approval requires verified payment or an authorized waiver';
  end if;
  return new;
end;
$$;

drop trigger if exists require_verified_payment_before_approval on public.class_registrations;
create trigger require_verified_payment_before_approval
  before insert or update on public.class_registrations
  for each row execute function public.require_verified_payment_before_approval();

commit;
