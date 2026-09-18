# Kunsang Gar Asset Inventory

Audit and migration snapshot generated 2026-09-16 from the public site `https://kunsanggarmexico.org/`.

This copy is the root promotion of the approved asset catalog. Public images and
manifests are available under `/assets/`; protected PDFs remain outside the
public tree until private storage and authorization are implemented.

## Summary

- 42 local content assets cataloged in `content-manifest.json`.
- 39 image files: 36 newly downloaded from the old site and 3 existing local assets retained in place.
- 3 original PDFs downloaded from `/oraciones`; contents were not modified or converted.
- 5 external video/media records in `video/video-manifest.json`; no YouTube video was downloaded.
- 1 pending audio record in `audio/audio-manifest.json`, marked `PENDING_CLIENT_MEDIA`.
- Downloaded content size: 13,337,515 bytes, approximately 12.72 MiB.
- 42 unique SHA-256 hashes across the cataloged local content assets; no duplicate files remain.

## Created Structure

```text
assets/
  brand/
  teacher/
  events/
  tradition/
  prayers/
  books/
  certification/
  gallery/
  documents/
  video/
    video-manifest.json
  audio/
    audio-manifest.json
  content-manifest.json
  ASSET-INVENTORY.md
```

Existing root assets, `site.css`, and `site.js` were left untouched.

## Brand

| Archivo | Origen | Uso |
| --- | --- | --- |
| `brand/kunsang-gar-site-logo.png` | Zyro asset used across the old site | Institutional logo, original PNG preserved |
| `kunsaanglogo.jpg` | Existing local asset | Existing platform logo, kept without duplication |

## Geshe Dangsong

| Archivo | Origen | Uso |
| --- | --- | --- |
| `geshe.png` | Existing local platform asset | Existing Geshe Dangsong image, source URL not recorded |
| `events/mexico-2026-announcement.png` | `/descubre-kunsang-gar-mexico` | Promotional artwork featuring Geshe Dangsong |
| `events/event-november-25.jpg` | `/bardo-thodol` | Bardo Thödol event graphic featuring Geshe Dangsong |
| `events/ritual-visual-01.jpg` | `/` and `/visita-de-ss-34` | Ritual/event visual connected to teacher programming |

The migrated files do not assert a portrait identity when visual review did not confirm one. Rights for all teacher imagery remain `UNCONFIRMED` unless noted otherwise in the JSON manifest.

## Tradition

| Archivo | Origen | Uso |
| --- | --- | --- |
| `tradition/bon-landscape-01.jpg` | `/tradicion-bon`, `/nuevo-bon` | Bön landscape and prayer flags |
| `tradition/bon-tradition-ritual-01.webp` | `/` | Bön ritual gathering |
| `tradition/bon-tradition-ritual-02.jpg` | `/certificacion`, `/` | Tsa Lung / meditation illustration |
| `tradition/new-bon-01.jpeg` | `/`, `/ritual-1000-ofrendas` | New Bön editorial image |
| `tradition/new-bon-02.jpg` | `/` | New Bön editorial image |
| `tradition/rime-01.jpg` | `/` | Rimé editorial image |
| `tradition/rime-02.jpg` | `/` | Rimé editorial image |
| `tradition/rime-03.jpg` | `/rime`, `/tradicion-bon` | Rimé editorial image recovered from CDN reference |

## Events

| Archivo | Origen | Evento / fecha |
| --- | --- | --- |
| `events/mexico-2026-announcement.png` | `/descubre-kunsang-gar-mexico` | Mexico 2026 announcement; date to be confirmed |
| `events/mexico-2026-event-01.png` | `/contacto`, `/geshe-dangsong` | Mexico 2026 promotional graphic; date to be confirmed |
| `events/mexico-2026-event-02.png` | `/` | Mexico 2026 promotional graphic; date to be confirmed |
| `events/mexico-2026-event-03.png` | `/` | Mexico 2026 promotional graphic; date to be confirmed |
| `events/mexico-2026-event-04.png` | Original CDN asset reference | Cultural/event graphic; page placement and date to be confirmed |
| `events/event-november-25.jpg` | `/bardo-thodol` | Bardo Thödol, 22 November, CDMX, date year requires review |
| `events/event-2026-01.jpg` through `event-2026-08.jpg`, `event-2026-10.jpg` | `/tradicion-bon` | Editorial image set; exact event labels/dates not encoded in filenames |
| `events/ritual-visual-01.jpg` | `/`, `/visita-de-ss-34` | Visit/ritual programming visual; date to be confirmed |
| `events/sadhana-todas-las-dakinis.jpeg` | `/classes.html` | Official flyer for Sadhana de todas las Dakinis, 2-3 October 2026 |
| `events/visita-geshe-mexico-octubre-noviembre-2026.jpeg` | `/events/` | Official flyer for Geshe's Mexico visit, October-November 2026 |

The old site also exposes event detail routes `/mexico-2026`, `/meditacion-vacio26`, `/tsalung26`, `/ritual-1000-ofrendas`, `/visita-de-ss-34`, and `/bardo-thodol`. Historical event data is retained in the editorial archive plan; future event details remain subject to confirmation.

## Prayers / Sacred Materials

| Archivo | Origen | Nivel de acceso conocido |
| --- | --- | --- |
| `prayers/sidpa-gyalmo-prayer-image.jpg` | `/oraciones` | `UNCONFIRMED`; image only, public embedding does not establish reuse rights |
| `prayers/offerings-ritual-01.jpg` | `/services`, `/oraciones` | `UNCONFIRMED`; sacred/editorial image |
| `prayers/prayer-material-thumbnail.jpg` | `/oraciones` | `UNCONFIRMED`; thumbnail only |
| `documents/dharmakayaprayera1-4english-and-spanish-dOqZoa51ZlFyg0M2.pdf` | `/oraciones` | `UNCONFIRMED`; 27 pages, source page warns about protected translations |
| `documents/purificacia3n-por-medio-del-agua-y-el-humo-versian-final-2-YX4jplJzwbhkrpwW.pdf` | `/oraciones` | `UNCONFIRMED`; 2 pages, copyright/access status needs confirmation |
| `documents/sepi-gyalmo-tsog-ritaul-text-in-spanesh-AzGMVX6aB8t3D8Wj.pdf` | `/oraciones` | `UNCONFIRMED`; 15 pages, source page states some materials require transmission |
| `documents/public/programa-sabiduria-kunsang-gar-es.pdf` | `/classes.html#brochures` | `PUBLIC`; client-authorized Spanish brochure, 13 pages |
| `documents/public/kunsang-gar-wisdom-program-en.pdf` | `/classes.html#brochures` | `PUBLIC`; client-authorized English brochure, 13 pages |

These files are preserved locally only. No new public access, registration gate, or practitioner permission has been implemented.

## Books

| Archivo | Origen | Uso |
| --- | --- | --- |
| `mujeres-sagradas-gran-perfeccion.jpeg` | Existing local platform asset | Existing promotional image for *Mujeres Santas de Gran Perfección* |
| `books/mujeres-santas-related-image.jpg` | `/libros-kg` | Related editorial image; visual review did not confirm it as the book cover |

The old page also links to Google Books. That external link remains cataloged below and was not replaced.

## Certification

| Archivo | Origen | Uso |
| --- | --- | --- |
| `certification/naljor-certification-01.jpeg` | `/oraciones` asset reference; certification use inferred from source context | Naljor / meditation visual; exact page placement needs confirmation |

The certification page now presents the Naljor structure and preserves the 75% attendance reference while leaving the current cohort calendar subject to confirmation.

## Gallery

| Archivo | Origen | Uso |
| --- | --- | --- |
| `gallery/kunsang-gar-gallery-01.jpeg` | `/` | Institutional/event image |
| `gallery/kunsang-gar-gallery-02.jpeg` | `/tsalung26`, `/` | Class/event image |
| `gallery/kunsang-gar-gallery-03.jpeg` | `/clases` | Classes image |
| `gallery/kunsang-gar-gallery-04.jpeg` | `/meditacion-vacio26`, `/` | Teaching/event image |
| `gallery/kunsang-gar-gallery-05.jpeg` | `/mexico-2026`, `/oraciones` | Event/prayer-related editorial image |
| `gallery/tsewang-rigdzin.jpg` | `/mexico-2026` | Event/editorial image; identity and reuse rights need confirmation |

## External Media

### YouTube / video

Cataloged, not downloaded, in `video/video-manifest.json`:

- `https://www.youtube.com/@KunsangGarMexico` -> `KEEP_EXTERNAL`
- `https://www.youtube.com/watch?v=HTZX4kJVwTc` -> `KEEP_EXTERNAL`; title not recovered
- `https://youtu.be/-i3607BO9Es` -> `KEEP_EXTERNAL`; title not recovered
- `https://videos.pexels.com/video-files/29457134/12680486_360_640_30fps.mp4` -> `OPTIONAL`; likely stock/decorative
- `https://videos.pexels.com/video-files/5000086/5000086-uhd_3840_2160_30fps.mp4` -> `UNKNOWN`; found in raw configuration, rendered use not confirmed

The related Pexels thumbnail is also external: `https://images.pexels.com/videos/5000086/colombia-fondo-nubes-paisaje-5000086.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200` -> `OPTIONAL`.

### Other external dependencies

| Dependencia exacta | Clasificación | Tratamiento |
| --- | --- | --- |
| `https://images.unsplash.com/photo-1586105251261-72a756497a11` | `OPTIONAL` | Stock/decorative image; not downloaded |
| `https://images.unsplash.com/photo-1593900107359-dde19776da88` | `OPTIONAL` | Stock/decorative class image; not downloaded |
| `https://images.unsplash.com/photo-1627764627459-ba29d6051fe0` | `OPTIONAL` | Stock/decorative class image; not downloaded |
| `https://assets.zyrosite.com/AGB6KM5nOetwMBVL/ca-Yg2WVlO43VH8azD5.jpg` | `OPTIONAL` | Generic cloud/background asset; not migrated |
| `https://assets.zyrosite.com/AGB6KM5nOetwMBVL/me000125283_1-YBgrnnvEr5hyqNV3.webp` | `OPTIONAL` | Generic texture/background asset; not migrated |
| `https://assets.zyrosite.com/AGB6KM5nOetwMBVL/traffic.txt` | `UNKNOWN` | Technical asset, not content; not migrated |
| `https://www.kunsanggarcenter.org/es/b%C3%B6n-tradition-1` | `MUST MIGRATE` | External tradition content still needs editorial decision: migrate content or preserve a deliberate outbound link |
| `https://books.google.com.np/books/about/Mujeres_Santas_de_Gran_Perfecci%C3%B3n.html?id=xi3V0QEACAAJ&redir_esc=y` | `KEEP_EXTERNAL` | External book reference |
| `https://docs.google.com/forms/d/e/1FAIpQLSfcMYo1T1tKQwoYnGygfjFObJmR_YfpdSibiA4wAr8H2JDhUg/viewform?usp=header` | `KEEP_EXTERNAL` | External registration/contact form |
| `https://forms.gle/ocwVT9qXQppgsZbW6` | `KEEP_EXTERNAL` | External registration form |
| `https://forms.gle/HfeMeUp6kVUCpL3CA` | `KEEP_EXTERNAL` | External registration form |
| `https://cdn.zyrosite.com/u1/google-fonts/font-faces?family=Lato:wght@100` | `KEEP_EXTERNAL` | Old site font delivery; new platform has not been changed |
| `https://www.facebook.com/profile.php?id=61553741434871`, `https://www.instagram.com/`, `https://tiktok.com/`, `https://twitter.com/`, `https://www.linkedin.com/` | `KEEP_EXTERNAL` | Social destinations, not downloaded assets |

## Audio

Two client-provided local audio files are cataloged in `audio/audio-manifest.json`. They are not embedded or autoplayed in V1 because access and publication rights are still `UNCONFIRMED`:

| Archivo | Origen | Estado |
| --- | --- | --- |
| `audio/mantra-of-all-dakinis.mp3` | `/classes.html` | `AVAILABLE_NOT_PUBLISHED` |
| `audio/tibet-house-geshe-dangsong-namgyal.mp3` | `/geshe-dangsong.html` | `AVAILABLE_NOT_PUBLISHED` |

## Duplicates and QA

- Duplicate detection used SHA-256 over all local content files.
- One exact duplicate was found during staging: the same source image appeared under an event staging name and the Bön landscape name. The event staging copy was removed; one canonical copy remains and its multiple source-page uses are recorded.
- Final local catalog: 48 manifest assets; the newly delivered flyers and audio files are preserved and have no exact hash duplicates.
- `file` identified all images as valid PNG/JPEG/WebP files and all documents as valid PDFs.
- `pdfinfo` opened all three PDFs successfully: 27, 2, and 15 pages.
- No broken symlinks or empty downloaded files were found.
- No PDFs were converted, split, or edited.

## Rights, Access, and Recovery Risks

- Public visibility on the old site was not treated as permission to republish. Most migrated assets are `UNCONFIRMED` until the client confirms rights and intended audience.
- `/oraciones` contains explicit warnings about copyright, transmission, copying, distribution, and practice restrictions. Those warnings are preserved in the manifest; the files must not become public by accident.
- The site did not expose reliable per-file copyright metadata for most images.
- Several event and tradition images have opaque original filenames. Their local names are neutral and their exact editorial labels/dates remain to be confirmed.
- New external mantra/audio URLs were not supplied; the delivered local MP3 files are cataloged without inventing external URLs.
- The source site contains stock/decorative Unsplash and Pexels media. Those were not downloaded because they are not required to preserve institutional content.
