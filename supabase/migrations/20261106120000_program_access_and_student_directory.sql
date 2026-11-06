-- Program enrollment access is free only when an administrator explicitly
-- marks a published program as free. Existing records stay unconfigured.
alter table public.programs
  add column if not exists enrollment_payment_mode text not null default 'UNCONFIGURED';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'programs_enrollment_payment_mode_check'
      and conrelid = 'public.programs'::regclass
  ) then
    alter table public.programs
      add constraint programs_enrollment_payment_mode_check
      check (enrollment_payment_mode in ('UNCONFIGURED', 'FREE', 'PAID'));
  end if;
end;
$$;

create or replace function public.request_program_enrollment(p_program_id uuid)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_payment_mode text;
  v_status text;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  select p.enrollment_payment_mode
    into v_payment_mode
  from public.programs p
  where p.id = p_program_id
    and p.status = 'PUBLISHED'
    and p.access_level = 'PUBLIC'
    and p.allow_self_enrollment = true;

  if not found then
    raise exception 'This program is not open for self-enrollment' using errcode = '42501';
  end if;

  select e.status into v_status
  from public.enrollments e
  where e.user_id = v_user_id and e.program_id = p_program_id;

  if v_status = 'ACTIVE' then return 'ACTIVE'; end if;
  if v_status = 'CANCELLED' then return 'CANCELLED'; end if;

  if v_status = 'PENDING' then
    if v_payment_mode = 'FREE' then
      update public.enrollments e set status = 'ACTIVE'
      where e.user_id = v_user_id and e.program_id = p_program_id and e.status = 'PENDING';
      return 'ACTIVE';
    end if;
    return 'PENDING';
  end if;

  insert into public.enrollments (user_id, program_id, status)
  values (v_user_id, p_program_id, case when v_payment_mode = 'FREE' then 'ACTIVE' else 'PENDING' end)
  on conflict (user_id, program_id) do nothing;

  select e.status into v_status
  from public.enrollments e
  where e.user_id = v_user_id and e.program_id = p_program_id;

  if v_status = 'PENDING' and v_payment_mode = 'FREE' then
    update public.enrollments e set status = 'ACTIVE'
    where e.user_id = v_user_id and e.program_id = p_program_id and e.status = 'PENDING';
    return 'ACTIVE';
  end if;
  return coalesce(v_status, 'PENDING');
end;
$$;

revoke all on function public.request_program_enrollment(uuid) from public, anon, authenticated;
grant execute on function public.request_program_enrollment(uuid) to authenticated;

create or replace function public.protect_program_enrollment_access()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_payment_mode text;
  v_verified_payment boolean;
begin
  if new.status <> 'ACTIVE' or (tg_op = 'UPDATE' and old.status = 'ACTIVE') then
    return new;
  end if;

  select p.enrollment_payment_mode into v_payment_mode
  from public.programs p where p.id = new.program_id;

  if v_payment_mode = 'FREE' then return new; end if;

  select exists (
    select 1 from public.class_registrations cr
    join public.events ev on ev.id = cr.event_id
    where cr.user_id = new.user_id and ev.program_id = new.program_id
      and cr.status = 'APPROVED' and cr.payment_status in ('CONFIRMED', 'WAIVED')
  ) into v_verified_payment;

  if v_verified_payment then return new; end if;
  raise exception 'Program access requires a configured free program or a verified payment';
end;
$$;
revoke all on function public.protect_program_enrollment_access() from public, anon, authenticated;
drop trigger if exists protect_program_enrollment_access on public.enrollments;
create trigger protect_program_enrollment_access
  before insert or update on public.enrollments
  for each row execute function public.protect_program_enrollment_access();

-- Email addresses are returned only by this ADMIN-guarded function; they are
-- never added to the public profiles table or exposed to content managers.
create or replace function public.admin_student_directory()
returns table (
  student_id uuid,
  full_name text,
  email text,
  account_created_at timestamptz,
  request_type text,
  requested_item text,
  request_status text,
  payment_status text,
  access_status text,
  requested_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public, auth, pg_temp
as $$
begin
  if not public.is_admin() then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;

  return query
  with students as (
    select p.id, coalesce(nullif(btrim(p.full_name), ''), 'Cuenta sin nombre') as name,
      u.email::text as email, u.created_at
    from public.profiles p
    join auth.users u on u.id = p.id
    where p.role = 'PRACTITIONER'
  ), activity_rows as (
    select s.id, s.name, s.email, s.created_at, 'PROGRAM'::text as kind,
      p.title::text as item, e.status::text as request_state,
      case p.enrollment_payment_mode
        when 'FREE' then 'NOT_REQUIRED'
        when 'PAID' then case when exists (
          select 1 from public.class_registrations cr
          join public.events ev on ev.id = cr.event_id
          where cr.user_id = e.user_id and ev.program_id = p.id
            and cr.status = 'APPROVED' and cr.payment_status in ('CONFIRMED', 'WAIVED')
        ) then 'CONFIRMED' else 'UNVERIFIED' end
        else 'NOT_CONFIGURED'
      end::text as payment_state,
      case e.status when 'ACTIVE' then 'ACTIVE' when 'PENDING' then 'PENDING' else 'REVOKED' end::text as access_state,
      e.created_at as activity_at
    from students s
    join public.enrollments e on e.user_id = s.id
    join public.programs p on p.id = e.program_id

    union all

    select s.id, s.name, s.email, s.created_at, 'CLASS'::text,
      ev.title::text, cr.status::text, cr.payment_status::text,
      case when cr.status = 'APPROVED' and cr.payment_status in ('CONFIRMED', 'WAIVED') then 'ACTIVE'
        when cr.status in ('REJECTED', 'CANCELLED') then 'REVOKED' else 'PENDING' end::text,
      cr.created_at
    from students s
    join public.class_registrations cr on cr.user_id = s.id
    join public.events ev on ev.id = cr.event_id

    union all

    select s.id, s.name, s.email, s.created_at, 'CONTENT'::text,
      ci.title::text, ag.status::text, 'NOT_APPLICABLE'::text,
      case ag.status when 'APPROVED' then 'ACTIVE' when 'DENIED' then 'REVOKED' else 'PENDING' end::text,
      ag.created_at
    from students s
    join public.access_grants ag on ag.user_id = s.id
    join public.content_items ci on ci.id = ag.content_item_id
  ), no_activity as (
    select s.id, s.name, s.email, s.created_at, 'ACCOUNT'::text as kind,
      null::text as item, 'NONE'::text as request_state, 'NOT_APPLICABLE'::text as payment_state,
      'NO_REQUEST'::text as access_state, null::timestamptz as activity_at
    from students s
    where not exists (select 1 from activity_rows a where a.id = s.id)
  )
  select a.id, a.name, a.email, a.created_at, a.kind, a.item,
    a.request_state, a.payment_state, a.access_state, a.activity_at
  from activity_rows a
  union all
  select n.id, n.name, n.email, n.created_at, n.kind, n.item,
    n.request_state, n.payment_state, n.access_state, n.activity_at
  from no_activity n
  order by 4 desc, 1, 10 desc nulls last;
end;
$$;

revoke all on function public.admin_student_directory() from public, anon, authenticated;
grant execute on function public.admin_student_directory() to authenticated;
