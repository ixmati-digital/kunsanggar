-- Scoped CMS role for editorial work. Does not grant access to orders, profiles,
-- access grants, protected storage, or account/role administration.

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('ADMIN', 'CONTENT_MANAGER', 'PRACTITIONER'));

create or replace function public.is_content_manager()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'CONTENT_MANAGER'
  );
$$;

-- Give the editor the unpublished rows needed by the CMS management screens.
create policy programs_cms_read on public.programs for select
  using (public.is_admin() or public.is_content_manager());
create policy content_cms_read on public.content_items for select
  using (public.is_admin() or public.is_content_manager());
create policy events_cms_read on public.events for select
  using (public.is_admin() or public.is_content_manager());
create policy gallery_items_cms_read on public.gallery_items for select
  using (public.is_admin() or public.is_content_manager());
create policy testimonials_cms_read on public.testimonials for select
  using (public.is_admin() or public.is_content_manager());

-- Assign only the two expressly designated accounts; unrelated profiles remain untouched.
update public.profiles p set role = case lower(u.email)
  when 'enseñanza@kunsanggar.com' then 'ADMIN'
  when 'communitymanager@kunsanggar.com' then 'CONTENT_MANAGER'
end
from auth.users u
where p.id = u.id
  and lower(u.email) in ('enseñanza@kunsanggar.com', 'communitymanager@kunsanggar.com');

create or replace function public.sync_kunsang_cms_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if lower(new.email) = 'enseñanza@kunsanggar.com' then
    insert into public.profiles (id, role) values (new.id, 'ADMIN')
    on conflict (id) do update set role = 'ADMIN';
  elsif lower(new.email) = 'communitymanager@kunsanggar.com' then
    insert into public.profiles (id, role) values (new.id, 'CONTENT_MANAGER')
    on conflict (id) do update set role = 'CONTENT_MANAGER';
  end if;
  return new;
end;
$$;

drop trigger if exists sync_kunsang_cms_role on auth.users;
create trigger sync_kunsang_cms_role
  after insert or update on auth.users
  for each row execute function public.sync_kunsang_cms_role();

-- Editorial writes.
drop policy if exists programs_admin_write on public.programs;
create policy programs_cms_write on public.programs for all
  using (public.is_admin() or public.is_content_manager())
  with check (public.is_admin() or public.is_content_manager());

drop policy if exists content_admin_write on public.content_items;
create policy content_cms_write on public.content_items for all
  using (public.is_admin() or public.is_content_manager())
  with check (public.is_admin() or public.is_content_manager());

drop policy if exists events_admin_write on public.events;
create policy events_cms_write on public.events for all
  using (public.is_admin() or public.is_content_manager())
  with check (public.is_admin() or public.is_content_manager());

drop policy if exists gallery_items_admin_write on public.gallery_items;
create policy gallery_items_cms_write on public.gallery_items for all
  using (public.is_admin() or public.is_content_manager())
  with check (public.is_admin() or public.is_content_manager());

drop policy if exists testimonials_admin_write on public.testimonials;
create policy testimonials_cms_write on public.testimonials for all
  using (public.is_admin() or public.is_content_manager())
  with check (public.is_admin() or public.is_content_manager());

drop policy if exists site_media_admin_manage on storage.objects;
create policy site_media_cms_manage on storage.objects for all to authenticated
  using (bucket_id = 'site-media' and (public.is_admin() or public.is_content_manager()))
  with check (bucket_id = 'site-media' and (public.is_admin() or public.is_content_manager()));

-- The editor may add and manage protected lesson attachments only under content/.
create policy protected_content_editor_upload on storage.objects for insert to authenticated
  with check (bucket_id = 'protected-content' and name like 'content/%' and public.is_content_manager());
create policy protected_content_editor_read on storage.objects for select to authenticated
  using (bucket_id = 'protected-content' and name like 'content/%' and public.is_content_manager());
create policy protected_content_editor_update on storage.objects for update to authenticated
  using (bucket_id = 'protected-content' and name like 'content/%' and public.is_content_manager())
  with check (bucket_id = 'protected-content' and name like 'content/%' and public.is_content_manager());
create policy protected_content_editor_delete on storage.objects for delete to authenticated
  using (bucket_id = 'protected-content' and name like 'content/%' and public.is_content_manager());

-- An editor can review signups and change their operational status, but cannot
-- verify/waive payment or grant course access. Payment fields remain ADMIN-only.
drop policy if exists class_registrations_self_or_admin_read on public.class_registrations;
create policy class_registrations_cms_read on public.class_registrations
  for select using (user_id = auth.uid() or public.is_admin() or public.is_content_manager());

-- Do not expose payment evidence through PostgREST to editors or members.
revoke select on public.class_registrations from authenticated;
grant select (id, event_id, user_id, status, payment_status, created_at, updated_at)
  on public.class_registrations to authenticated;

create or replace function public.admin_class_registrations()
returns table (
  id uuid, event_id uuid, user_id uuid, event_title text, status text,
  payment_status text, payment_method text, payment_reference text,
  payment_verified_at timestamptz, payment_verified_by uuid,
  created_at timestamptz, updated_at timestamptz
)
language sql stable security definer set search_path = public as $$
  select r.id, r.event_id, r.user_id, e.title, r.status,
    r.payment_status, r.payment_method, r.payment_reference,
    r.payment_verified_at, r.payment_verified_by, r.created_at, r.updated_at
  from public.class_registrations r
  join public.events e on e.id = r.event_id
  where public.is_admin()
  order by r.created_at desc;
$$;
revoke all on function public.admin_class_registrations() from public;
grant execute on function public.admin_class_registrations() to authenticated;
drop policy if exists class_registrations_admin_update on public.class_registrations;
create policy class_registrations_cms_update on public.class_registrations
  for update to authenticated using (public.is_admin() or public.is_content_manager())
  with check (public.is_admin() or public.is_content_manager());
drop policy if exists class_registrations_admin_delete on public.class_registrations;
create policy class_registrations_cms_delete on public.class_registrations
  for delete using (public.is_admin());

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
    new.payment_verified_by is distinct from old.payment_verified_by
  ) then
    raise exception 'Only administrators may change registration payment verification';
  end if;
  if public.is_content_manager() and not public.is_admin()
    and new.status = 'APPROVED' and old.status is distinct from 'APPROVED' then
    raise exception 'Only administrators may approve a paid registration';
  end if;
  return new;
end;
$$;
drop trigger if exists protect_registration_payment_fields on public.class_registrations;
create trigger protect_registration_payment_fields
  before update on public.class_registrations
  for each row execute function public.protect_registration_payment_fields();

-- Editors can see names only for people who have submitted a class registration.
drop policy if exists profiles_cms_registration_names on public.profiles;
create policy profiles_cms_registration_names on public.profiles for select
  using (public.is_content_manager() and exists (
    select 1 from public.class_registrations r where r.user_id = profiles.id
  ));

-- Payment/registration controls embedded in events are administrator-only.
create or replace function public.protect_event_payment_settings()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if public.is_content_manager() and not public.is_admin() then
    if tg_op = 'INSERT' and (new.payment_url is not null or new.price_mxn is not null) then
      raise exception 'Only administrators may configure event payment settings';
    elsif tg_op = 'UPDATE' and (
      new.payment_url is distinct from old.payment_url or new.price_mxn is distinct from old.price_mxn
    ) then
      raise exception 'Only administrators may change event payment settings';
    end if;
  end if;
  return new;
end;
$$;
drop trigger if exists protect_event_payment_settings on public.events;
create trigger protect_event_payment_settings
  before insert or update on public.events
  for each row execute function public.protect_event_payment_settings();
