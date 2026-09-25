# Kunsang Gar — V1 handoff técnico

Fecha de actualización: 2026-09-25

Alcance: plataforma pública ES/EN y operación de miembros V1 México.

## COMPLETE

| Área | Estado | Evidencia comprobada |
| --- | --- | --- |
| Sitio público ES/EN | PASS | Producción responde HTTP 200 en inicio, cuenta, programas, biblioteca y órdenes admin. Verificaciones anteriores confirmaron `lang="es"` y `lang="en"`, selector e interfaces traducidas. |
| Login y sesión de practicante | PASS | El usuario temporal inició sesión en `/account/`; la sesión persistió al navegar. La cuenta mostró rol `PRACTITIONER`. |
| Administración | PASS | Sesión ADMIN real; dashboard y controles de Programas, Contenido, Alumnos y Control de acceso cargaron conectados a Supabase. |
| Programa CRUD/publicación | PASS | ADMIN creó, editó, publicó y luego eliminó un programa técnico temporal desde el CMS. El practicante inscrito lo vio en `/programs/`. |
| Contenido CRUD/publicación | PASS | ADMIN creó y editó dos contenidos temporales asociados al programa: uno `ENROLLED` y otro `RESTRICTED`, ambos publicados; después los eliminó. |
| Inscripción de alumno | PASS | ADMIN incorporó al practicante desde Alumnos; el CMS confirmó la inscripción y el recurso `ENROLLED` apareció para esa cuenta. En V1 el alumno no se autoinscribe: ADMIN lo incorpora al programa. |
| RLS público y de practicante | PASS | Solicitudes anónimas no obtuvieron filas de contenido protegido ni archivos. Con sesión PRACTITIONER: `ticket_orders` devolvió cero filas; el contenido RESTRICTED sin grant devolvió cero filas. |
| Acceso RESTRICTED | PASS | Antes del grant el practicante no vio el contenido y Supabase negó signed URL (`Object not found`). ADMIN aprobó el grant desde Control de acceso; el contenido apareció y el practicante abrió el archivo. Después ADMIN lo cambió a `DENIED` y el contenido dejó de aparecer. |
| Storage privado / signed URL | PASS | Los recursos de prueba se subieron al bucket privado `protected-content`. ADMIN y el practicante autorizado consumieron URL firmada y leyeron el contenido de prueba. Sin autorización, la URL firmada fue denegada. |
| Limpieza de datos temporales | PARCIAL | Se borraron y se confirmó la eliminación de grants, inscripción, los dos contenidos, programa y ambos objetos de Storage. Siguen pendientes dos usuarios temporales de Auth. |
| Vercel API | PASS en disponibilidad | Pruebas previas de métodos y respuestas seguras de endpoints fueron satisfactorias. No se realizó cobro. |
| Supabase destino | PASS | Proyecto Kunsang activo `bzmqddxnpopkqhdxsngu`; migración de acceso aplicada; bucket privado y RLS usados durante las pruebas reales. |
| `/admin/orders.html` | PARCIAL | ADMIN accede a la vista. Con PRACTITIONER la ruta no mostró órdenes, pero el navegador quedó en una vista en blanco; falta confirmar una denegación/redirect claro. RLS sí impidió leer `ticket_orders` desde PRACTITIONER. |
| Logout | NO VERIFICADO | La sesión de prueba no se cerró explícitamente antes de esta actualización. |
| Cambio de signed URL para contenido PUBLIC en Storage | PENDIENTE DE PUBLICAR | Se corrigió localmente para permitir URL firmada de contenido público con `storage_path`; producción sigue cargando `platform.js?v=54cfb5a`. |

## CLIENT ACCEPTANCE TEST

**Mercado Pago real: PENDING — Roberto.** No se cobró ni se creó una transacción real. Roberto debe validar preference → checkout MXN → webhook → `ticket_orders` → estado/pago → resultado → `/admin/orders.html`.

## CLIENT CONTENT REVIEW

Revisión lingüística/doctrinal pendiente del cliente para Geshe, Bön, Nuevo Bön, Rimé, Certificación y Oraciones. Es una revisión de contenido, no un fallo técnico, y no aparece como nota interna pública.

## PHASE 2 / OUT OF SCOPE

- Libros, catálogo, links de compra o checkout de tienda.
- Tibetano, monedas o pagos internacionales, Stripe y PayPal.
- Funciones sociales, chat propio, LMS expandido o streaming complejo.

## PENDIENTES DE CIERRE

1. Confirmación inmediata antes de eliminar permanentemente los dos usuarios temporales de Auth; luego comprobar que no existen.
2. Probar logout y confirmar que al terminar sesión dejan de mostrarse los recursos de miembro.
3. Verificar una denegación explícita y clara para PRACTITIONER en `/admin/orders.html`.
4. Revisar y publicar el cambio pendiente de signed URL para recursos `PUBLIC` con Storage, actualizar esta nota y hacer smoke test.
5. Commit/push/deploy del cierre, manteniendo fuera del commit los archivos no relacionados ya presentes en el workspace.

## ESTADO

```text
PUBLIC ES/EN: PASS (smoke de rutas y QA bilingüe previa)
AUTH ADMIN: PASS
AUTH PRACTITIONER: PASS
ADMIN ROLE: PASS
PROGRAM CRUD: PASS
CONTENT CRUD: PASS
ENROLLMENT / MEMBER ACCESS: PASS
PUBLIC RLS: PASS
PRACTITIONER RLS: PASS
ADMIN RLS: PASS para vistas administrativas probadas
PRIVATE STORAGE / SIGNED URL: PASS para acceso autorizado y denegación
ADMIN ORDERS: PARCIAL; falta verificar UX de denegación PRACTITIONER
Vercel API: PASS en disponibilidad, sin transacción real
SUPABASE: PASS
MERCADO PAGO: CLIENT ACCEPTANCE TEST PENDING
AUTH TEST-USER CLEANUP: PENDING
LOGOUT: NOT VERIFIED
LOCAL FIX / DEPLOY: PENDING
V1 TECHNICAL STATUS: el flujo núcleo de membresía funciona en prueba real; cierre final aún pendiente
```

No se usó material doctrinal de prueba. Los datos de ensayo fueron técnicos y se retiraron; no se publicó contenido de prueba.
