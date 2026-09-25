# Kunsang Gar — Cierre técnico V1

Actualizado: 2026-09-25. Pruebas realizadas en producción; último código verificado: `7b699da` (el presente documento se integra en el commit final siguiente).

## Operación probada

| Flujo | Resultado y evidencia |
| --- | --- |
| Sitio público / ES-EN | 18 rutas principales navegadas en ES y EN (18/18 por idioma); `lang`, títulos y contenido verificados en DOM real. El selector conserva idioma entre rutas. HTTP 200 en home, cuenta, programas, biblioteca, admin, órdenes, checkout y estados de pago. |
| Registro/login/sesión/logout | La cuenta PRACTITIONER de prueba inició sesión en producción, conservó sesión al navegar y cambiar idioma; cerrar sesión volvió al formulario de login y se mantuvo cerrada tras recargar. |
| Rol y protección de admin | La cuenta mostró `PRACTITIONER`; `/admin/orders.html` la redirigió a `/account/?access=admin-required`. Sin sesión, la ruta pide login. No mostró órdenes al practicante. |
| CMS / ADMIN | Sesión ADMIN real. Se crearon, editaron y publicaron programa y contenido temporal desde el CMS; se asoció el contenido a programa y se configuraron niveles `ENROLLED` y `RESTRICTED`. |
| Incorporación de miembros | ADMIN incorporó al PRACTITIONER desde Alumnos. En V1, el alta de cuenta puede ser del usuario, pero la incorporación a un programa la decide y ejecuta ADMIN. |
| Acceso por programa | El PRACTITIONER vio el programa inscrito y su contenido `ENROLLED`. Una consulta sin sesión no recibió recursos protegidos. |
| RESTRICTED y RLS | Sin grant, el PRACTITIONER no recibió contenido y Storage negó signed URL. ADMIN aprobó grant; el contenido apareció y el archivo pudo abrirse. Tras revocar el grant, dejó de aparecer y volvió a denegarse. PRACTITIONER obtuvo cero órdenes en `ticket_orders`. |
| Storage privado | Los dos objetos temporales se guardaron en `protected-content`, se consumieron mediante URL firmada autorizada y luego se borraron. El acceso no autorizado fue denegado. |
| Limpieza | Confirmada la eliminación de 1 programa, 2 contenidos, 1 inscripción, 1 grant y los 2 objetos temporales. No se creó una orden ni se hizo una transacción. Quedan dos usuarios temporales de Auth (ver residuo). |
| Eventos / copy público | Se retiraron la nota editorial interna de Bardo Thödol, estados internos de eventos pasados y frases placeholder de fechas no confirmadas. Se conservó sólo la información histórica verificada y la visita octubre–noviembre. Checkout, biblioteca y landing histórico también se probaron en inglés; marca Mercado Pago y término tradicional “La” se preservan correctamente. |
| Responsive / consola | Cuenta y Eventos verificados en viewport 390 px; sin overflow horizontal. El menú móvil de Cuenta abre correctamente. Cero errores de consola en las verificaciones de Cuenta/rutas públicas. |
| Sitios internos | `/adicionales-por-aprobar/`, `/docs/`, `/planeacion/` y reportes devuelven HTTP 403; `/books.html` devuelve 404. PDFs restringidos y audios `UNCONFIRMED` no se publican. |

## API, Supabase y pagos

- Supabase destino Kunsang: `bzmqddxnpopkqhdxsngu`. Auth, consultas, RLS, grants, Storage privado y CMS se ejercitaron con sesiones reales.
- La clave `service_role` se usa en endpoints de servidor; no se añadió a frontend. La revisión de código confirma que preference/webhook escriben órdenes por la API server-side.
- API Vercel verificada sin transacción: `OPTIONS` en `create-preference` responde 204; `GET` responde 405. Webhook sin `payment_id` responde `ignored`; `payment-status` sin `external_reference` responde 400. No se creó preference ni orden en esta auditoría.
- **Mercado Pago: aceptación real de Roberto pendiente.** No hubo cobro. La cadena preference → checkout → webhook → orden → resultado no se puede considerar aceptación end-to-end hasta una prueba real autorizada. La excepción temporal de firma del webhook sigue activa por autorización previa; configurar firma HMAC y `MERCADOPAGO_WEBHOOK_SECRET` antes de operar pagos sin supervisión.
- La tabla de programas/contenidos quedó sin los registros temporales. No hay programa doctrinal de prueba; ADMIN debe publicar únicamente material aprobado por Kunsang.
- PUBLIC COPY AUDIT ES/EN: 18/18 rutas navegadas por idioma, sin referencias internas detectadas. Las rutas privadas/comerciales y documentación fuente probadas siguen denegadas.

## CLIENT ACCEPTANCE TEST

1. Roberto completa y confirma una operación real de Mercado Pago MXN.
2. Verificar que la notificación actualiza la orden correcta, incluido estado e identificador de pago, y que la vista `/admin/orders.html` la presenta. No se efectuó ni se autoriza un cobro en esta auditoría.

## CLIENT CONTENT REVIEW

Revisión lingüística/doctrinal pendiente para Geshe, Bön, Nuevo Bön, Rimé, Certificación y Oraciones. Es revisión de contenido, no un bloqueo técnico; no aparece como nota pública.

## RESIDUO DE DATOS DE PRUEBA

No se pudieron eliminar desde este entorno porque no hay sesión administrativa del dashboard ni credencial Admin API disponible; no se intentó purgar Auth mediante UI sin confirmación de acción. Permanecen estas dos cuentas temporales de Auth en el proyecto destino:

- `v1-practitioner-run-20260924@kunsanggarmexico.com` — usuario PRACTITIONER usado en la prueba.
- `v1-practitioner-20260923@kunsanggarmexico.com` — cuenta temporal anterior.

Sus grants, inscripciones, programas, contenidos y archivos de prueba asociados sí fueron eliminados. No borrar cuentas reales.

## PHASE 2 / FUERA DE V1

- Libros, catálogo, links de compra y tienda.
- Pagos internacionales, otras monedas, Stripe y PayPal.
- Red social interna, chat propio, LMS ampliado y streaming complejo.

## Estado final

La plataforma de miembros es operable para que ADMIN gestione alumnos, programas, contenidos y permisos y entregue archivos privados autorizados. El flujo de PRACTITIONER fue probado realmente en producción. La base quedó limpia de contenido temporal; para comenzar a impartir enseñanzas, ADMIN aún debe publicar el programa y materiales reales aprobados. El único test externo de pago pendiente es el de Roberto; las dos cuentas temporales de Auth son el único residuo de datos de prueba conocido.
