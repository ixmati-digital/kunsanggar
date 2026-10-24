# Entrega final — Kunsang Gar

Fecha: 24 de octubre de 2026 · Sitio: https://kunsanggar.com/

## Estado

El sitio público, sus páginas de clases, eventos, galería, Library y oraciones están publicados y accesibles. La versión observada en producción muestra el ciclo de seis actividades, el álbum “Sangha Kunsang Gar · octubre 2026” con siete fotos, testimonios publicados y seis PDF públicos. Los eventos pasados se conservan en la base y no aparecen en la lista pública de próximas actividades.

El CMS en `https://kunsanggar.com/admin/` contiene gestión de programas, contenidos, eventos, inscripciones, testimonios, Sangha, alumnos, pagos y biblioteca. El selector español/inglés, permisos de Lena CONTENT_MANAGER y el rol ADMIN de Roberto están presentes en el esquema/código; el perfil de Roberto quedó corregido en Supabase. La autenticación y operaciones de carga/edición no se ejecutaron con sesiones reales en esta verificación.

## Cambios del cierre

- Se incorporó recuperación de contraseña para estudiante y CMS, con solicitud por email, retorno a `/account/?reset=1` y formulario para establecer clave. La entrega real del correo y la whitelist de redirecciones requieren verificación autenticada.
- Se ocultarán álbumes vacíos en la galería pública sin borrar su contenido en CMS.
- Se añadirá el segundo video de YouTube compartido por Lena.
- Se amplió la traducción de títulos/frases de Classes y se filtrarán enlaces de inscripción que aún apuntan a un dominio Netlify antiguo.
- Se protegerá `/docs/` para que los documentos internos de cierre no queden públicos.

Estos cambios esperan el push final y el despliegue automático; no se declaran publicados hasta verificar la versión de producción.

## Pruebas

Verificadas en producción con navegador: home, Clases en español e inglés, fichas/eventos, Library, Sangha, `/prayers.html?lang=en`, los seis PDF, el primer video de YouTube, login de estudiante y pantalla de login CMS. Inspección de Supabase: migraciones, roles, RLS, buckets, álbum, fotos y testimonios.

Pruebas no ejecutadas: inicio de sesión con credenciales, recuperación y recepción real de correo, carga múltiple autenticada, operaciones CMS, inscripción nueva, confirmación de pago, webhook firmado de Stripe. No se hicieron pagos ni se modificaron inscripciones.

## Bloqueos

- Variables y configuración real del webhook de Vercel no verificables: la API de variables devolvió 403 y no existe CLI disponible.
- No hay importes configurados para las actividades; no se puede afirmar pago automatizado ni activar cobros correctos.
- Falta confirmar el cambio de horario de Monte Kailash y acceder a la carpeta Drive de fotos posterior.
- Las descripciones extensas en inglés de varios eventos aún requieren traducción/revisión editorial.

## Trabajo preservado

Los cambios locales ajenos a este cierre se respaldaron en `/private/tmp/KunsangGar-preserve-20261024`; no se restablecieron ni se eliminaron. La propuesta internacional y sus precios no se modificaron.
