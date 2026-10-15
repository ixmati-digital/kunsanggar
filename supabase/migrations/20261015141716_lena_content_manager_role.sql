begin;

create or replace function public.sync_kunsang_cms_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if lower(new.email) = 'teaching@kunsanggar.com' then
    insert into public.profiles (id, role)
    values (new.id, 'ADMIN')
    on conflict (id) do update set role = 'ADMIN';
  elsif lower(new.email) = 'communitymanager@kunsanggar.com' then
    insert into public.profiles (id, role)
    values (new.id, 'CONTENT_MANAGER')
    on conflict (id) do update set role = 'CONTENT_MANAGER';
  end if;
  return new;
end;
$$;

update public.profiles p
set role = 'CONTENT_MANAGER'
from auth.users u
where p.id = u.id
  and lower(u.email) = 'communitymanager@kunsanggar.com';

commit;
