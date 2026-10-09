-- Public classes, editable event history and site gallery management.
-- This migration is additive: existing programs, content, events and objects remain intact.

-- Never promote an existing private bucket: it may contain files that must stay private.
do $$
begin
  if exists (
    select 1 from storage.buckets
    where id = 'site-media' and public = false
  ) then
    raise exception 'site-media exists as a private bucket; inspect its contents before migration';
  end if;
end $$;

alter table public.programs
  add column if not exists title_en text,
  add column if not exists description_en text,
  add column if not exists allow_self_enrollment boolean not null default false;

alter table public.content_items
  add column if not exists title_en text,
  add column if not exists description_en text;

alter table public.events
  add column if not exists title_en text,
  add column if not exists description_en text,
  add column if not exists format_en text,
  add column if not exists location text,
  add column if not exists location_en text,
  add column if not exists registration_url text,
  add column if not exists image_path text,
  add column if not exists event_type text not null default 'EVENT'
    check (event_type in ('CLASS', 'EVENT', 'COMMUNITY'));

create index if not exists events_start_status_idx on public.events(status, starts_at);

drop policy if exists enrollments_self_enroll_open_program on public.enrollments;
grant insert on public.enrollments to authenticated;
create policy enrollments_self_enroll_open_program
  on public.enrollments for insert to authenticated
  with check (
    user_id = auth.uid()
    and status = 'ACTIVE'
    and exists (
      select 1 from public.programs p
      where p.id = program_id
        and p.status = 'PUBLISHED'
        and p.access_level = 'PUBLIC'
        and p.allow_self_enrollment = true
    )
  );

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_en text,
  alt_text text not null,
  alt_text_en text,
  image_path text not null,
  sort_order integer not null default 100,
  status text not null default 'DRAFT' check (status in ('DRAFT', 'PUBLISHED')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gallery_items_public_order_idx
  on public.gallery_items(status, sort_order, created_at);
create unique index if not exists gallery_items_image_path_unique_idx
  on public.gallery_items(image_path);

drop trigger if exists gallery_items_updated_at on public.gallery_items;
create trigger gallery_items_updated_at before update on public.gallery_items
  for each row execute function public.set_v1_updated_at();

alter table public.gallery_items enable row level security;
grant select on public.gallery_items to anon, authenticated;
grant insert, update, delete on public.gallery_items to authenticated;
drop policy if exists gallery_items_read_published_or_admin on public.gallery_items;
create policy gallery_items_read_published_or_admin on public.gallery_items
  for select using (status = 'PUBLISHED' or public.is_admin());
drop policy if exists gallery_items_admin_write on public.gallery_items;
create policy gallery_items_admin_write on public.gallery_items
  for all using (public.is_admin()) with check (public.is_admin());

-- Public media is for approved website images only; protected lessons stay in protected-content.
insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

drop policy if exists site_media_admin_manage on storage.objects;
create policy site_media_admin_manage on storage.objects
  for all to authenticated
  using (bucket_id = 'site-media' and public.is_admin())
  with check (bucket_id = 'site-media' and public.is_admin());

-- Move existing public gallery images into the editable gallery without copying files.
insert into public.gallery_items (title, title_en, alt_text, alt_text_en, image_path, sort_order, status)
values
  ('Encuentro de Kunsang Gar', 'Kunsang Gar gathering', 'Encuentro de Kunsang Gar', 'Kunsang Gar gathering', '/assets/gallery/kunsang-gar-gallery-01.jpeg', 10, 'PUBLISHED'),
  ('Actividad de Kunsang Gar', 'Kunsang Gar activity', 'Actividad de Kunsang Gar', 'Kunsang Gar activity', '/assets/gallery/kunsang-gar-gallery-02.jpeg', 20, 'PUBLISHED'),
  ('Clase de Kunsang Gar', 'Kunsang Gar class', 'Clase de Kunsang Gar', 'Kunsang Gar class', '/assets/gallery/kunsang-gar-gallery-03.jpeg', 30, 'PUBLISHED'),
  ('Enseñanza de Kunsang Gar', 'Kunsang Gar teaching', 'Enseñanza de Kunsang Gar', 'Kunsang Gar teaching', '/assets/gallery/kunsang-gar-gallery-04.jpeg', 40, 'PUBLISHED'),
  ('Actividad comunitaria de Kunsang Gar', 'Kunsang Gar community activity', 'Actividad comunitaria de Kunsang Gar', 'Kunsang Gar community activity', '/assets/gallery/kunsang-gar-gallery-05.jpeg', 50, 'PUBLISHED')
on conflict do nothing;

-- Preserve the already-published past-event archive as editable records.
insert into public.events
  (slug, title, title_en, description, description_en, starts_at, ends_at, format, format_en,
   location, location_en, event_type, status)
values
  ('recuperacion-alma-sadhana-longevidad-tsok-2026',
   'Recuperación del alma, Sadhana de longevidad y Tsok', 'Soul Retrieval, Longevity Sadhana and Tsok',
   'Geshe Dangsong Namgyal · Ciudad de México y online · Inglés con traducción al español. La actividad abordó la relación con los elementos, el alma (La), longevidad y prácticas de Tshe Wang Rigdzin.',
   null,
   '2026-05-23 00:00:00-06', '2026-05-24 23:59:00-06', 'Presencial y online', 'In person and online', 'Ciudad de México', 'Mexico City', 'EVENT', 'PUBLISHED'),
  ('esencia-conciencia-vacio-luminosidad-2026',
   'Esencia de la Conciencia: Vacío y luminosidad', 'Essence of Consciousness: Emptiness and luminosity',
   'Presencial y online · Inglés con traducción al español. Enseñanza sobre vacío, luminosidad, rigpa y Tantra Madre Bön.',
   null,
   '2026-06-06 00:00:00-06', '2026-06-07 23:59:00-06', 'Presencial y online', 'In person and online', 'Ciudad de México', 'Mexico City', 'EVENT', 'PUBLISHED'),
  ('yoga-tantra-madre-meditacion-dzogchen-2026',
   'Yoga del Tantra Madre y meditación Dzogchen', 'Mother Tantra Yoga and Dzogchen meditation',
   '20 y 21 de junio de 2026 · 10:00 a 18:00, hora de México · Presencial y online. Programa sobre canales, vientos, esencias, yantra yoga, mantras y práctica no dual.',
   null,
   '2026-06-20 10:00:00-06', '2026-06-21 18:00:00-06', 'Presencial y online', 'In person and online', 'Ciudad de México', 'Mexico City', 'EVENT', 'PUBLISHED'),
  ('gran-empoderamiento-nampar-gyalwa-2025',
   'Gran Empoderamiento de Nampar Gyalwa', 'Great Empowerment of Nampar Gyalwa',
   '29 y 30 de julio de 2025 · SS Menri Trizin 34 · Ciudad de México y online · Inglés con traducción al español.',
   null,
   '2025-07-29 00:00:00-06', '2025-07-30 23:59:00-06', 'Presencial y online', 'In person and online', 'Ciudad de México', 'Mexico City', 'EVENT', 'PUBLISHED')
on conflict (slug) do nothing;
