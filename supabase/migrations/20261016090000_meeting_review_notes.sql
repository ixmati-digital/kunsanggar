-- Private notes collected during the Kunsang Gar platform review meeting.
-- Only authenticated CMS users can read or submit notes; nothing is public.
create table if not exists public.platform_review_notes (
  id uuid primary key default gen_random_uuid(),
  section text not null check (char_length(section) between 1 and 120),
  comment text not null check (char_length(comment) between 1 and 3000),
  priority text not null check (priority in ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
  requester text not null check (char_length(requester) between 1 and 120),
  created_by uuid not null references auth.users(id) on delete restrict default auth.uid(),
  created_at timestamptz not null default now()
);

create index if not exists platform_review_notes_created_at_idx
  on public.platform_review_notes(created_at desc);

alter table public.platform_review_notes enable row level security;
revoke all on public.platform_review_notes from anon, authenticated;
grant select, insert on public.platform_review_notes to authenticated;

drop policy if exists platform_review_notes_cms_read on public.platform_review_notes;
create policy platform_review_notes_cms_read
  on public.platform_review_notes for select to authenticated
  using (public.is_admin() or public.is_content_manager());

drop policy if exists platform_review_notes_cms_insert on public.platform_review_notes;
create policy platform_review_notes_cms_insert
  on public.platform_review_notes for insert to authenticated
  with check (
    created_by = auth.uid()
    and (public.is_admin() or public.is_content_manager())
  );
