# Registro de validación de migración

## Ejecutado

| Prueba | Resultado | Evidencia |
|---|---|---|
| Dominio nuevo y `www` resuelven por HTTPS | PASS | `https://kunsanggar.com/` y `https://www.kunsanggar.com/` devolvieron HTTP 200 con Hostinger/HCDN y certificado servido. |
| Host antiguo y `www` continúan activos | PASS | `https://kunsanggarmexico.com/` y `https://www.kunsanggarmexico.com/` devolvieron HTTP 200 antes del corte. |
| Nuevo dominio sirve el mismo contenido que el antiguo | PASS | El hash SHA-256 del HTML de `/` fue idéntico en ambas respuestas antes de publicar nuevos cambios. |
| Rutas raíz de cuenta, programas, biblioteca y admin en dominio nuevo | PASS (HTTP) | `/account/`, `/programs/`, `/library/` y `/admin/` respondieron 200; no equivale a probar sesión/roles. |
| Alias en Hostinger | PASS | hPanel confirmó `kunsanggar.com` conectado como parked domain del sitio actual. |
| SSL Hostinger | PASS | hPanel muestra SSL activo; requests HTTPS respondieron sin error TLS. |
| MX antiguos | PASS, sin cambios | Los MX del dominio anterior siguen en Hostinger; ninguna edición DNS de correo fue realizada. |
| Home ES y EN | PASS (contenido) | Se navegó `https://kunsanggar.com/` en ES y se cambió a EN; navegación y textos principales cambiaron de idioma, sin error crítico de consola. |
| Clases EN | PASS (contenido actual) | Se abrió `/classes.html` en EN; la ruta respondió y cargó contenido. No implica que checkout de pago esté aprobado. |
| Rutas de plataforma | PASS (HTTP únicamente) | Cuenta, admin, programas y biblioteca respondieron 200; las sesiones y permisos no se validaron. |

## Pendiente / no probado

| Prueba | Estado | Motivo |
|---|---|---|
| Login/registro, Auth, recuperación y redirects en dominio nuevo | BLOCKED | Requiere acceso autenticado al proyecto Supabase destino. |
| RLS, programas y contenido tras migración | BLOCKED | La migración más reciente de clases/eventos/galería no está aplicada/verificada en producción. |
| Vercel project access | PARTIAL | El proyecto `kunsanggar` es visible por API; lectura y escritura de variables de producción devolvieron 403 por permisos insuficientes. No se revelaron valores. |
| Endpoint Vercel, preference, retornos y webhook | BLOCKED | La corrección está en la rama, pero aún no se desplegó ni se actualizaron `PUBLIC_SITE_URL`/`PAYMENT_WEBHOOK_URL`. No se hizo pago. |
| CORS de pagos en producción | FAIL reproducible, corrección preparada | `create-preference` respondió a preflight del dominio nuevo con `Access-Control-Allow-Origin: https://kunsanggar.vercel.app` (origen equivocado); `payment-status` devolvió 405 a OPTIONS. El branch agrega el origen nuevo y preflight de lectura, pero requiere deploy Vercel para verificar la corrección. |
| 301 antiguo → nuevo por rutas/query | NOT RUN | No se publicó la regla; evita cortar Auth y pagos antes de actualizar sus callbacks. |
| Correo nuevo: recepción/envío/IMAP/SMTP | BLOCKED | No hay plan/buzones configurados en el dominio nuevo. |
| Responsive móvil | NOT RUN | No se logró aplicar el emulador móvil al Chrome conectado. La prueba desktop no se contabiliza como móvil. |
| Search Console / cambio de dirección | BLOCKED | No se verificó sesión/permisos de Search Console. |

No se declara migración completa ni producción final aprobada.
