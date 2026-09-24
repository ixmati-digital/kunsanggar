-- V1 access consistency: a resource also requires access to its parent program.
-- An explicit approved content grant can authorize entry to a RESTRICTED program.
create or replace function public.can_access_program(program_uuid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin() or exists (
    select 1 from public.programs p
    left join public.enrollments e
      on e.program_id = p.id and e.user_id = auth.uid() and e.status = 'ACTIVE'
    where p.id = program_uuid and p.status = 'PUBLISHED' and (
      p.access_level = 'PUBLIC'
      or (p.access_level = 'ENROLLED' and e.id is not null)
      or (p.access_level = 'RESTRICTED' and exists (
        select 1 from public.access_grants g
        join public.content_items ci on ci.id = g.content_item_id
        where ci.program_id = p.id and ci.status = 'PUBLISHED'
          and g.user_id = auth.uid() and g.status = 'APPROVED'
      ))
    )
  );
$$;

create or replace function public.can_access_content(item_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin() or exists (
    select 1 from public.content_items ci
    left join public.enrollments e
      on e.program_id = ci.program_id and e.user_id = auth.uid() and e.status = 'ACTIVE'
    left join public.access_grants g
      on g.content_item_id = ci.id and g.user_id = auth.uid() and g.status = 'APPROVED'
    where ci.id = item_id and ci.status = 'PUBLISHED'
      and public.can_access_program(ci.program_id)
      and (
        ci.access_level = 'PUBLIC'
        or (ci.access_level = 'ENROLLED' and e.id is not null)
        or (ci.access_level = 'RESTRICTED' and g.id is not null)
      )
  );
$$;
