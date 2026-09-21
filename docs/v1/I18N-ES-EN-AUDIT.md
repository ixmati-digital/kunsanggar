# Kunsang Gar · Auditoría ES/EN V1

Documento interno. No publicar en interfaces públicas.

## Estado

La experiencia pública principal mantiene sus URLs existentes y usa `assets/i18n.js` para seleccionar español o inglés, recordar la preferencia en `localStorage` y actualizar `lang`, títulos, descripción y enlaces `hreflang`. El selector no usa servicios externos de traducción.

## Rutas auditadas

| Ruta | Estado ES/EN | Nota |
|---|---|---|
| `/` | BILINGUAL_READY | Home y navegación compartida |
| `/services.html` | BILINGUAL_READY | Copy funcional y servicios |
| `/contact.html` | BILINGUAL_READY | Canales de contacto |
| `/classes.html` | BILINGUAL_READY | Clases, Sadhana y brochures |
| `/kunsang-gar.html` | BILINGUAL_READY | Visión institucional |
| `/geshe-dangsong.html` | CLIENT_REVIEW_REQUIRED | Traducción conservadora de biografía/doctrina |
| `/tradicion-bon.html` | CLIENT_REVIEW_REQUIRED | Traducción conservadora de contenido doctrinal |
| `/nuevo-bon.html` | CLIENT_REVIEW_REQUIRED | Traducción conservadora del ensayo |
| `/rime.html` | CLIENT_REVIEW_REQUIRED | Traducción conservadora de contenido doctrinal |
| `/certification.html` | CLIENT_REVIEW_REQUIRED | Terminología de formación y certificación |
| `/prayers.html` | CLIENT_REVIEW_REQUIRED | Terminología de acceso y práctica |
| `/events/` | BILINGUAL_READY | Eventos públicos y archivo histórico |
| `/programs/` | BILINGUAL_READY | Empty state y enlaces |
| `/sangha.html` | BILINGUAL_READY | Copy público de comunidad |
| `/donations.html` | BILINGUAL_READY | Donativo México/MXN |
| `/account/` | BILINGUAL_READY | Login público y sesión |
| `/teachings/` | BILINGUAL_READY | Landing editorial pública |
| `/library/` | BILINGUAL_READY | Brochures y acceso protegido |
| `/checkout.html` y resultados de pago | BILINGUAL_READY | UI ES/EN; siempre México, MXN y Mercado Pago |

## Fuentes oficiales utilizadas

- `docs/client-source/Brochure Kunsang Gar English.pdf` para la terminología “Kunsang Gar Wisdom Program”, “Dzogchen Meditation” y “Tibetan Buddhist Rimé Tradition”.
- Brochures públicos enlazados desde `classes.html`.
- Textos oficiales del cliente en `docs/client-source/textos para sitio web.pdf` como fuente de significado; el PDF permanece material fuente y no se expone como documentación interna.

## Revisión del cliente

Las traducciones inglesas de biografía, tradición Bön, Nuevo Bön, Rimé, certificación y recursos de práctica se realizaron de forma conservadora para completar la experiencia V1. Requieren revisión editorial del cliente antes de considerarse definitivas. Esta marca existe sólo en documentación interna y nunca se muestra en el sitio.

## Reglas de alcance

- Tibetan, multimoneda, Stripe, PayPal y Phase 2 no se implementan.
- La cuenta de pago continúa siendo México/MXN/Mercado Pago aunque el idioma sea EN.
- Libros/tienda permanecen fuera de navegación y producción.
- Programs/Library no traducen automáticamente contenido religioso almacenado; sólo traducen interfaz y estados vacíos conocidos.
- Admin y rutas internas no forman parte del cierre de copy público bilingüe.
