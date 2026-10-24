# Entrega final — Kunsang Gar

Fecha: 24 de octubre de 2026 · Sitio: https://kunsanggar.com/

## Estado

El sitio público, sus páginas de clases, eventos, galería, Library y oraciones están publicados y accesibles. La versión observada en producción muestra el ciclo de seis actividades, el álbum “Sangha Kunsang Gar · octubre 2026” con siete fotos, testimonios publicados y seis PDF públicos. Los eventos pasados se conservan en la base y no aparecen en la lista pública de próximas actividades.

El CMS en `https://kunsanggar.com/admin/` contiene gestión de programas, contenidos, eventos, inscripciones, testimonios, Sangha, alumnos, pagos y biblioteca. El selector español/inglés, permisos de Lena CONTENT_MANAGER y el rol ADMIN de Roberto están presentes en el esquema/código; el perfil de Roberto quedó corregido en Supabase. La autenticación y operaciones de carga/edición no se ejecutaron con sesiones reales en esta verificación.

## Cambios del cierre

- Se incorporó recuperación de contraseña para estudiante y CMS, con solicitud por email, retorno a `/account/?reset=1` y formulario para establecer clave. La entrega real del correo y la whitelist de redirecciones requieren verificación autenticada.
- Se ocultaron álbumes vacíos en la galería pública sin borrar su contenido en CMS.
- Se añadió el segundo video de YouTube compartido por Lena.
- Se amplió la traducción de títulos y frases de Classes y se filtraron los enlaces de inscripción que apuntan a un dominio Netlify antiguo.
- Se protegió `/docs/` para que los documentos internos de cierre no queden públicos.

Los cambios están publicados en `main` y verificados en Hostinger. El login del CMS muestra selector ES/EN y cambia correctamente ambos idiomas; los enlaces de recuperación siguen pendientes de prueba con correo real.

## Pruebas

Verificadas en producción con navegador: home, Clases en español e inglés, fichas/eventos, Library, Sangha, `/prayers.html?lang=en`, los seis PDF, los dos enlaces de video, pantallas de acceso de estudiante y CMS, cambio ES/EN del login CMS y acceso bloqueado a `/docs/`. Inspección de Supabase: migraciones, roles, RLS, buckets, álbum, fotos y testimonios. Se verificó por HTTP el redireccionamiento del dominio antiguo y los enlaces de correo actualizados.

Pruebas no ejecutadas: inicio de sesión autenticado, envío/recepción de recuperación, carga múltiple autenticada, operaciones CMS con cuenta de Roberto o Lena, inscripción nueva, confirmación de pago y webhook firmado de Stripe. No se hicieron pagos ni se modificaron inscripciones.

## Bloqueos

- Variables y configuración real del webhook de Vercel no verificables: la API de variables devolvió 403 y no existe CLI disponible.
- No hay importes configurados para las actividades; no se puede afirmar pago automatizado ni activar cobros correctos.
- Falta confirmar el cambio de horario de Monte Kailash y acceder a la carpeta Drive de fotos posterior.
- El email de contacto público es `contacto@kunsanggar.com`; los enlaces visibles se actualizaron. Las descripciones extensas en inglés de varios eventos aún requieren traducción/revisión editorial.

## Git y despliegue

Los cambios se publicaron en `main` mediante fast-forward; Hostinger actualizó el sitio automáticamente. Commit final: `bb902ca6ce788c7bf8c8fbe7f7d93c6fc190c204` (`fix: use official Kunsang Gar contact email`). No se utilizó Hostinger File Manager, no se cambió DNS y no se modificó la propuesta internacional.

## Trabajo preservado

Los cambios locales ajenos a este cierre se respaldaron en `/private/tmp/KunsangGar-preserve-20261024`; no se restablecieron ni se eliminaron. La propuesta internacional y sus precios no se modificaron.
