-- Public classes, editable event history and site gallery management.
-- This migration is additive: existing programs, content, events and objects remain intact.

-- Never promote an existing private bucket: it may contain files that must stay private.
do $$
begin
  if exists (select 1 from storage.buckets where id = 'site-media' and public = false) then
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
  add column if not exists program_id uuid references public.programs(id) on delete set null,
  add column if not exists teacher text,
  add column if not exists teacher_en text,
  add column if not exists registration_enabled boolean not null default false,
  add column if not exists payment_url text,
  add column if not exists price_mxn numeric(10,2),
  add column if not exists event_type text not null default 'EVENT'
    check (event_type in ('CLASS', 'EVENT', 'COMMUNITY'));

create index if not exists events_start_status_idx on public.events(status, starts_at);

drop policy if exists enrollments_self_enroll_open_program on public.enrollments;
grant insert on public.enrollments to authenticated;
create policy enrollments_self_enroll_open_program
  on public.enrollments for insert to authenticated
  with check (
    user_id = auth.uid()
    and status = 'PENDING'
    and exists (
      select 1 from public.programs p
      where p.id = program_id
        and p.status = 'PUBLISHED'
        and p.access_level = 'PUBLIC'
        and p.allow_self_enrollment = true
    )
  );

-- Public requests remain pending until an administrator verifies payment and approves access.
alter table public.enrollments drop constraint if exists enrollments_status_check;
alter table public.enrollments add constraint enrollments_status_check check (status in ('PENDING', 'ACTIVE', 'CANCELLED'));

create table if not exists public.class_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'PENDING' check (status in ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')),
  payment_status text not null default 'UNVERIFIED' check (payment_status in ('UNVERIFIED', 'REPORTED', 'CONFIRMED', 'WAIVED')),
  payment_method text,
  payment_reference text,
  payment_verified_at timestamptz,
  payment_verified_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, user_id),
  check (status <> 'APPROVED' or payment_status in ('CONFIRMED', 'WAIVED')),
  check (payment_status <> 'CONFIRMED' or (payment_reference is not null and payment_verified_by is not null))
);
create index if not exists class_registrations_user_idx on public.class_registrations(user_id, created_at desc);
create index if not exists class_registrations_event_idx on public.class_registrations(event_id, created_at desc);
alter table public.class_registrations enable row level security;
grant select, insert on public.class_registrations to authenticated;
grant update on public.class_registrations to authenticated;
drop policy if exists class_registrations_self_or_admin_read on public.class_registrations;
create policy class_registrations_self_or_admin_read on public.class_registrations
  for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists class_registrations_self_request on public.class_registrations;
create policy class_registrations_self_request on public.class_registrations
  for insert to authenticated with check (
    user_id = auth.uid() and status = 'PENDING' and payment_status = 'UNVERIFIED'
    and exists (select 1 from public.events e where e.id = event_id and e.status = 'PUBLISHED' and e.registration_enabled)
  );
drop policy if exists class_registrations_admin_update on public.class_registrations;
create policy class_registrations_admin_update on public.class_registrations
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists class_registrations_admin_delete on public.class_registrations;
create policy class_registrations_admin_delete on public.class_registrations
  for delete to authenticated using (public.is_admin());
drop trigger if exists class_registrations_updated_at on public.class_registrations;
create trigger class_registrations_updated_at before update on public.class_registrations
  for each row execute function public.set_v1_updated_at();

-- Grant program access only after explicit payment verification and approval.
create or replace function public.sync_class_registration_access()
returns trigger language plpgsql security definer set search_path = public as $$
declare linked_program uuid;
begin
  select program_id into linked_program from public.events where id = coalesce(new.event_id, old.event_id);
  if linked_program is not null then
    if exists (select 1 from public.class_registrations r join public.events e on e.id = r.event_id
      where r.user_id = coalesce(new.user_id, old.user_id) and e.program_id = linked_program
        and r.status = 'APPROVED' and r.payment_status in ('CONFIRMED', 'WAIVED')) then
      insert into public.enrollments (user_id, program_id, status)
      values (coalesce(new.user_id, old.user_id), linked_program, 'ACTIVE')
      on conflict (user_id, program_id) do update set status = 'ACTIVE';
    else
      update public.enrollments set status = 'CANCELLED'
      where user_id = coalesce(new.user_id, old.user_id) and program_id = linked_program;
    end if;
  end if;
  return null;
end;
$$;
drop trigger if exists class_registration_access_sync on public.class_registrations;
create trigger class_registration_access_sync after insert or update or delete on public.class_registrations
  for each row execute function public.sync_class_registration_access();

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

-- The six announced autumn teachings. Prices, times, English copy and payment URLs remain unset.
insert into public.programs (slug, title, teacher, access_level, status, allow_self_enrollment)
values
  ('plegarias-dia-de-muertos-2026', 'Plegarias en línea con motivo del Día de Muertos', 'Geshe Dangsong Namgyal', 'ENROLLED', 'PUBLISHED', false),
  ('a-khrid-kalung-gyatso-2026', 'A Khrid Kalung Gyatso', 'Geshe Dangsong Namgyal', 'ENROLLED', 'PUBLISHED', false),
  ('ritual-montana-sipe-gyalmo-2026', 'Ritual de la montaña de Sipe Gyalmo', 'Geshe Dangsong Namgyal', 'ENROLLED', 'PUBLISHED', false),
  ('yoga-de-los-suenos-2026', 'Yoga de los Sueños', 'Geshe Dangsong Namgyal', 'ENROLLED', 'PUBLISHED', false),
  ('meditacion-mindfulness-principiantes-2026', 'Meditación y Mindfulness para principiantes', 'Geshe Dangsong Namgyal', 'ENROLLED', 'PUBLISHED', false),
  ('bardo-y-phowa-2026', 'Bardo y Phowa', 'Geshe Dangsong Namgyal', 'ENROLLED', 'PUBLISHED', false)
on conflict (slug) do nothing;

insert into public.events
  (slug, title, teacher, starts_at, ends_at, format, location, image_path, event_type, status,
   program_id, registration_enabled)
values
  ('plegarias-dia-de-muertos-2026', 'Plegarias en línea con motivo del Día de Muertos', 'Geshe Dangsong Namgyal',
   '2026-10-31 00:00:00-06', '2026-10-31 23:59:00-06', 'En línea', null,
   '/assets/events/ciclo-ensenanza-oct-nov-2026.jpeg', 'CLASS', 'PUBLISHED',
   (select id from public.programs where slug = 'plegarias-dia-de-muertos-2026'), true),
  ('a-khrid-kalung-gyatso-2026', 'A Khrid Kalung Gyatso', 'Geshe Dangsong Namgyal',
   '2026-11-07 00:00:00-06', '2026-11-08 23:59:00-06', null, 'Ciudad de México',
   '/assets/events/ciclo-ensenanza-oct-nov-2026.jpeg', 'CLASS', 'PUBLISHED',
   (select id from public.programs where slug = 'a-khrid-kalung-gyatso-2026'), true),
  ('ritual-montana-sipe-gyalmo-2026', 'Ritual de la montaña de Sipe Gyalmo', 'Geshe Dangsong Namgyal',
   '2026-11-14 00:00:00-06', '2026-11-15 23:59:00-06', null, 'Ciudad de México',
   '/assets/events/ciclo-ensenanza-oct-nov-2026.jpeg', 'CLASS', 'PUBLISHED',
   (select id from public.programs where slug = 'ritual-montana-sipe-gyalmo-2026'), true),
  ('yoga-de-los-suenos-2026', 'Yoga de los Sueños', 'Geshe Dangsong Namgyal',
   '2026-11-21 00:00:00-06', '2026-11-22 23:59:00-06', null, 'Tlalnepantla, Estado de México',
   '/assets/events/ciclo-ensenanza-oct-nov-2026.jpeg', 'CLASS', 'PUBLISHED',
   (select id from public.programs where slug = 'yoga-de-los-suenos-2026'), true),
  ('meditacion-mindfulness-principiantes-2026', 'Meditación y Mindfulness para principiantes', 'Geshe Dangsong Namgyal',
   '2026-11-28 00:00:00-06', '2026-11-29 23:59:00-06', null, 'Tulancingo, Hidalgo',
   '/assets/events/ciclo-ensenanza-oct-nov-2026.jpeg', 'CLASS', 'PUBLISHED',
   (select id from public.programs where slug = 'meditacion-mindfulness-principiantes-2026'), true),
  ('bardo-y-phowa-2026', 'Bardo y Phowa', 'Geshe Dangsong Namgyal',
   '2026-12-05 00:00:00-06', '2026-12-06 23:59:00-06', null, null,
   '/assets/events/ciclo-ensenanza-oct-nov-2026.jpeg', 'CLASS', 'PUBLISHED',
   (select id from public.programs where slug = 'bardo-y-phowa-2026'), true)
on conflict (slug) do nothing;

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text,
  body text not null,
  body_en text,
  image_path text,
  sort_order integer not null default 100,
  status text not null default 'DRAFT' check (status in ('DRAFT', 'PUBLISHED')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.testimonials add column if not exists body_en text;
create index if not exists testimonials_public_order_idx on public.testimonials(status, sort_order, created_at);
alter table public.testimonials enable row level security;
grant select on public.testimonials to anon, authenticated;
grant insert, update, delete on public.testimonials to authenticated;
drop trigger if exists testimonials_updated_at on public.testimonials;
create trigger testimonials_updated_at before update on public.testimonials
  for each row execute function public.set_v1_updated_at();
drop policy if exists testimonials_read_published_or_admin on public.testimonials;
create policy testimonials_read_published_or_admin on public.testimonials
  for select using (status = 'PUBLISHED' or public.is_admin());
drop policy if exists testimonials_admin_write on public.testimonials;
create policy testimonials_admin_write on public.testimonials
  for all using (public.is_admin()) with check (public.is_admin());

insert into public.testimonials (name, country, body, image_path, sort_order, status)
values
  ('Simone Fassina', 'España', $$Desde muy joven estudio las tradiciones espirituales. Practico el Buddhadharma desde la época de la pandemia y me considero un buscador en camino hacia mi propia vía. Mi recorrido comenzó durante el COVID, cuando casi por casualidad descubrí el Ngöndro Dzogchen Bön y empecé a practicarlo online a través del monasterio francés Shenten Dargye Ling. Me enamoré de esta tradición, pero con el tiempo mi práctica fue disminuyendo hasta interrumpirse. Mientras tanto, para conocer también el budismo, comencé a estudiar el Lam Rim en un centro Gelugpa y experimenté prácticas de distintas escuelas del budismo tibetano y de otras tradiciones. Decidido a mantener vivo mi vínculo con el Dzogchen Bön, busqué otras opciones y descubrí Kunsang Gar. Encontré exactamente lo que necesitaba: enseñanzas online continuas, variadas y cercanas en el tiempo, transmitidas por un maestro Bön altamente realizado y a un precio accesible. Desde la primera enseñanza percibí la gran preparación de Geshe Dangsong y, desde entonces, no me he perdido ninguna. También tuve la oportunidad de conocerlo personalmente durante un retiro en Menorca. Me han impresionado especialmente su sencillez, apertura, disponibilidad, ecuanimidad, energía e incansable dedicación, así como su capacidad para transmitir con claridad la profundidad del Dzogchen Bön. Sus enseñanzas me han proporcionado herramientas sencillas y poderosas para afrontar las fuerzas negativas, encontrar mayor tranquilidad y acercarme a la experiencia del estado natural de la mente. Siento que no abandonaré nunca el camino del Bön y la poderosa guía de Geshe Dangsong. Invito a cualquier persona a experimentar la filosofía y la práctica Dzogchen en sus propias vidas.$$,
   '/assets/events/testimonials/simone-fassina.jpeg', 10, 'PUBLISHED'),
  ('Roberto Vargas', 'México', $$En el año 2022, la vida me regaló un encuentro que cambiaría mi corazón: conocí al maestro Geshe Dangsong. Me invitó a colaborar con él. No sabía qué responderle, porque yo ya tenía un maestro. Dudé. Pero al final sus palabras me convencieron, y hoy, con el alma en las manos, puedo decir que fue una de las mejores cosas que he hecho en mi vida. Porque conocí a un ser extraordinario. Un ser que ha compartido conmigo y con muchos otros estudiantes enseñanzas valiosísimas sobre el Yungdrung Bön y el Dzogchen. Una persona sumamente sencilla, empática y amorosa. Un maestro que nunca deja dudas, que se entrega con generosidad cuando uno le pregunta acerca de la práctica. Un gran amigo espiritual, con un conocimiento enorme no sólo del Yungdrung Bön, sino del budismo en general. Con él he recorrido un camino inmenso. Casi cinco años. He estado en todas sus enseñanzas en México, presenciales, y en la mayoría de sus enseñanzas por Zoom desde entonces. Cada enseñanza ha sido una luz, un apoyo, un recordatorio. No tengo palabras para expresar mi devoción a mi gurú por todo lo que ha hecho para mejorar mi vida. Sólo me queda el corazón agradecido y una palabra que lo contiene todo: Gracias, querido maestro.$$,
   null, 20, 'PUBLISHED'),
  ('Zulema Toriz (Sherab Zangmo)', null, $$Mi profunda gratitud al Maestro por su guía compasiva, y a la Sangha por ser el refugio y el espejo en este camino del Dharma. Gracias a sus enseñanzas y su presencia, hoy camino con la mente más clara, el corazón más abierto y una paz profunda en mi vida. Que el mérito de estas enseñanzas se extienda a todos los seres sintientes.$$,
   null, 30, 'PUBLISHED')
on conflict do nothing;
