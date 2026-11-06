-- Community author labels are public; never fall back to an account email.
create or replace function public.community_prepare_post()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile_name text;
  v_metadata_name text;
begin
  if tg_op = 'INSERT' then
    select nullif(btrim(p.full_name), '') into v_profile_name
    from public.profiles p where p.id = new.author_id;
    v_metadata_name := nullif(btrim(auth.jwt() -> 'user_metadata' ->> 'full_name'), '');

    if v_profile_name ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then v_profile_name := null; end if;
    if v_metadata_name ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then v_metadata_name := null; end if;

    new.author_name := coalesce(v_profile_name, v_metadata_name, 'Miembro de Kunsang Gar');
  else
    new.author_id := old.author_id;
    new.author_name := case
      when old.author_name ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
        then coalesce((select nullif(btrim(p.full_name), '') from public.profiles p where p.id = old.author_id
          and btrim(p.full_name) !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'), 'Miembro de Kunsang Gar')
      else old.author_name
    end;
    new.created_at := old.created_at;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create or replace function public.community_prepare_reply()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile_name text;
  v_metadata_name text;
begin
  if tg_op = 'INSERT' then
    select nullif(btrim(p.full_name), '') into v_profile_name
    from public.profiles p where p.id = new.author_id;
    v_metadata_name := nullif(btrim(auth.jwt() -> 'user_metadata' ->> 'full_name'), '');

    if v_profile_name ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then v_profile_name := null; end if;
    if v_metadata_name ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then v_metadata_name := null; end if;

    new.author_name := coalesce(v_profile_name, v_metadata_name, 'Miembro de Kunsang Gar');
  else
    new.author_id := old.author_id;
    new.author_name := case
      when old.author_name ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
        then coalesce((select nullif(btrim(p.full_name), '') from public.profiles p where p.id = old.author_id
          and btrim(p.full_name) !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'), 'Miembro de Kunsang Gar')
      else old.author_name
    end;
    new.post_id := old.post_id;
    new.created_at := old.created_at;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

-- Existing rows with an email as the display label are replaced by a profile
-- name when that name is non-sensitive, or a generic public label otherwise.
update public.community_posts p
set author_name = coalesce(
  (select nullif(btrim(profile.full_name), '') from public.profiles profile
   where profile.id = p.author_id and btrim(profile.full_name) !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  'Miembro de Kunsang Gar'
)
where p.author_name ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$';

update public.community_replies r
set author_name = coalesce(
  (select nullif(btrim(profile.full_name), '') from public.profiles profile
   where profile.id = r.author_id and btrim(profile.full_name) !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  'Miembro de Kunsang Gar'
)
where r.author_name ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$';

revoke all on function public.community_prepare_post() from public, anon, authenticated;
revoke all on function public.community_prepare_reply() from public, anon, authenticated;
