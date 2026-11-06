-- Authenticated member forum with author-owned edits and administrator moderation.
create table public.community_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 3 and 160),
  body text not null check (char_length(btrim(body)) between 3 and 12000),
  author_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  status text not null default 'PUBLISHED' check (status in ('PUBLISHED', 'HIDDEN', 'DELETED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.community_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 8000),
  author_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  status text not null default 'PUBLISHED' check (status in ('PUBLISHED', 'HIDDEN', 'DELETED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index community_posts_timeline_idx on public.community_posts (created_at desc);
create index community_posts_author_idx on public.community_posts (author_id, created_at desc);
create index community_replies_post_timeline_idx on public.community_replies (post_id, created_at asc);
create index community_replies_author_idx on public.community_replies (author_id, created_at desc);

alter table public.community_posts enable row level security;
alter table public.community_replies enable row level security;

revoke all on public.community_posts, public.community_replies from public, anon, authenticated;
grant select, insert, update on public.community_posts to authenticated;
grant select, insert, update on public.community_replies to authenticated;

create policy community_posts_read on public.community_posts
  for select to authenticated
  using (status = 'PUBLISHED' or author_id = auth.uid() or public.is_admin() or public.is_content_manager());

create policy community_posts_create on public.community_posts
  for insert to authenticated
  with check (author_id = auth.uid() and status = 'PUBLISHED');

create policy community_posts_update on public.community_posts
  for update to authenticated
  using (author_id = auth.uid() or public.is_admin() or public.is_content_manager())
  with check (
    (author_id = auth.uid() and status in ('PUBLISHED', 'DELETED'))
    or public.is_admin() or public.is_content_manager()
  );

create policy community_replies_read on public.community_replies
  for select to authenticated
  using (
    (status = 'PUBLISHED' and exists (
      select 1 from public.community_posts p where p.id = post_id and p.status = 'PUBLISHED'
    ))
    or author_id = auth.uid() or public.is_admin() or public.is_content_manager()
  );

create policy community_replies_create on public.community_replies
  for insert to authenticated
  with check (
    author_id = auth.uid() and status = 'PUBLISHED'
    and exists (select 1 from public.community_posts p where p.id = post_id and p.status = 'PUBLISHED')
  );

create policy community_replies_update on public.community_replies
  for update to authenticated
  using (author_id = auth.uid() or public.is_admin() or public.is_content_manager())
  with check (
    (author_id = auth.uid() and status in ('PUBLISHED', 'DELETED'))
    or public.is_admin() or public.is_content_manager()
  );

create or replace function public.community_prepare_post()
returns trigger
language plpgsql
security definer
set search_path = public
as $function$
begin
  if tg_op = 'INSERT' then
    new.author_name := coalesce(
      (select nullif(btrim(p.full_name), '') from public.profiles p where p.id = new.author_id),
      nullif(btrim(auth.jwt() -> 'user_metadata' ->> 'full_name'), ''),
      'Miembro de Kunsang Gar'
    );
  else
    new.author_id := old.author_id;
    new.author_name := old.author_name;
    new.created_at := old.created_at;
  end if;
  new.updated_at := now();
  return new;
end;
$function$;

create or replace function public.community_prepare_reply()
returns trigger
language plpgsql
security definer
set search_path = public
as $function$
begin
  if tg_op = 'INSERT' then
    new.author_name := coalesce(
      (select nullif(btrim(p.full_name), '') from public.profiles p where p.id = new.author_id),
      nullif(btrim(auth.jwt() -> 'user_metadata' ->> 'full_name'), ''),
      'Miembro de Kunsang Gar'
    );
  else
    new.author_id := old.author_id;
    new.author_name := old.author_name;
    new.post_id := old.post_id;
    new.created_at := old.created_at;
  end if;
  new.updated_at := now();
  return new;
end;
$function$;

create or replace function public.community_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $function$
begin
  if tg_op <> 'INSERT' then return new; end if;
  perform pg_advisory_xact_lock(hashtext(new.author_id::text));
  if tg_table_name = 'community_posts' and exists (
    select 1 from public.community_posts p
    where p.author_id = new.author_id and p.created_at > now() - interval '15 seconds'
  ) then
    raise exception 'Please wait before creating another post.' using errcode = 'P0001';
  elsif tg_table_name = 'community_replies' and exists (
    select 1 from public.community_replies r
    where r.author_id = new.author_id and r.created_at > now() - interval '15 seconds'
  ) then
    raise exception 'Please wait before replying again.' using errcode = 'P0001';
  end if;
  return new;
end;
$function$;

revoke all on function public.community_prepare_post() from public, anon, authenticated;
revoke all on function public.community_prepare_reply() from public, anon, authenticated;
revoke all on function public.community_rate_limit() from public, anon, authenticated;

create trigger community_posts_prepare before insert or update on public.community_posts
  for each row execute function public.community_prepare_post();
create trigger community_replies_prepare before insert or update on public.community_replies
  for each row execute function public.community_prepare_reply();
create trigger community_posts_rate_limit before insert on public.community_posts
  for each row execute function public.community_rate_limit();
create trigger community_replies_rate_limit before insert on public.community_replies
  for each row execute function public.community_rate_limit();
