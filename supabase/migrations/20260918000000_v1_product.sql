-- Kunsang Gar V1. Never drops or alters ticket_orders.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'PRACTITIONER' check (role in ('ADMIN', 'PRACTITIONER')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  teacher text,
  level text,
  format text,
  access_level text not null default 'PUBLIC' check (access_level in ('PUBLIC', 'ENROLLED', 'RESTRICTED')),
  status text not null default 'DRAFT' check (status in ('DRAFT', 'PUBLISHED')),
  cover_image_url text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  title text not null,
  description text,
  content_type text not null default 'OTHER',
  access_level text not null default 'PUBLIC' check (access_level in ('PUBLIC', 'ENROLLED', 'RESTRICTED')),
  status text not null default 'DRAFT' check (status in ('DRAFT', 'PUBLISHED')),
  storage_path text,
  external_url text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  program_id uuid not null references public.programs(id) on delete cascade,
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'CANCELLED')),
  created_at timestamptz not null default now(),
  unique (user_id, program_id)
);

create table if not exists public.access_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  status text not null default 'PENDING' check (status in ('PENDING', 'APPROVED', 'DENIED')),
  decided_by uuid references auth.users(id) on delete set null,
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, content_item_id)
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  format text,
  status text not null default 'DRAFT' check (status in ('DRAFT', 'PUBLISHED')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists programs_status_idx on public.programs(status);
create index if not exists content_items_program_idx on public.content_items(program_id);
create index if not exists content_items_status_idx on public.content_items(status);
create index if not exists enrollments_user_idx on public.enrollments(user_id);
create index if not exists access_grants_user_idx on public.access_grants(user_id);

create or replace function public.set_v1_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_v1_updated_at();
drop trigger if exists programs_updated_at on public.programs;
create trigger programs_updated_at before update on public.programs for each row execute function public.set_v1_updated_at();
drop trigger if exists content_items_updated_at on public.content_items;
create trigger content_items_updated_at before update on public.content_items for each row execute function public.set_v1_updated_at();
drop trigger if exists events_updated_at on public.events;
create trigger events_updated_at before update on public.events for each row execute function public.set_v1_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'ADMIN');
$$;

create or replace function public.can_access_content(item_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin() or exists (
    select 1 from public.content_items ci
    left join public.enrollments e on e.program_id = ci.program_id and e.user_id = auth.uid() and e.status = 'ACTIVE'
    left join public.access_grants g on g.content_item_id = ci.id and g.user_id = auth.uid() and g.status = 'APPROVED'
    where ci.id = item_id and ci.status = 'PUBLISHED' and (
      ci.access_level = 'PUBLIC' or (ci.access_level = 'ENROLLED' and e.id is not null) or (ci.access_level = 'RESTRICTED' and g.id is not null)
    )
  );
$$;

create or replace function public.can_access_program(program_uuid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin() or exists (
    select 1 from public.programs p
    left join public.enrollments e on e.program_id = p.id and e.user_id = auth.uid() and e.status = 'ACTIVE'
    where p.id = program_uuid and p.status = 'PUBLISHED' and (
      p.access_level = 'PUBLIC' or (p.access_level = 'ENROLLED' and e.id is not null)
    )
  );
$$;

alter table public.profiles enable row level security;
alter table public.programs enable row level security;
alter table public.content_items enable row level security;
alter table public.enrollments enable row level security;
alter table public.access_grants enable row level security;
alter table public.events enable row level security;

drop policy if exists profiles_self_or_admin on public.profiles;
create policy profiles_self_or_admin on public.profiles for select using (id = auth.uid() or public.is_admin());
drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_admin_update on public.profiles for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists programs_read_published_or_admin on public.programs;
create policy programs_read_published_or_admin on public.programs for select using (public.can_access_program(id));
drop policy if exists programs_admin_write on public.programs;
create policy programs_admin_write on public.programs for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists content_read_authorized_or_admin on public.content_items;
create policy content_read_authorized_or_admin on public.content_items for select using (public.can_access_content(id) or public.is_admin());
drop policy if exists content_admin_write on public.content_items;
create policy content_admin_write on public.content_items for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists enrollments_self_or_admin on public.enrollments;
create policy enrollments_self_or_admin on public.enrollments for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists enrollments_admin_write on public.enrollments;
create policy enrollments_admin_write on public.enrollments for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists grants_self_or_admin on public.access_grants;
create policy grants_self_or_admin on public.access_grants for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists grants_admin_write on public.access_grants;
create policy grants_admin_write on public.access_grants for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists events_read_published_or_admin on public.events;
create policy events_read_published_or_admin on public.events for select using (status = 'PUBLISHED' or public.is_admin());
drop policy if exists events_admin_write on public.events;
create policy events_admin_write on public.events for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('protected-content', 'protected-content', false)
on conflict (id) do update set public = false;

drop policy if exists protected_content_admin_all on storage.objects;
create policy protected_content_admin_all on storage.objects for all using (bucket_id = 'protected-content' and public.is_admin()) with check (bucket_id = 'protected-content' and public.is_admin());
drop policy if exists protected_content_authorized_read on storage.objects;
create policy protected_content_authorized_read on storage.objects for select using (
  bucket_id = 'protected-content' and exists (
    select 1 from public.content_items ci where ci.storage_path = name and public.can_access_content(ci.id)
  )
);
