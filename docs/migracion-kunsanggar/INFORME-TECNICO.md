# Migración de dominio — Kunsang Gar

Fecha de corte del informe: 8 de octubre de 2026.

## Estado

El dominio `kunsanggar.com` está registrado en la cuenta Hostinger visible, usa los nameservers de Hostinger y tiene SSL activo. DNS observado: apex A `148.135.128.19` y `77.37.76.127`; `www` CNAME `www.kunsanggar.com.cdn.hstgr.net`. Se añadió como dominio estacionado del sitio `kunsanggarmexico.com`; ambos dominios sirven la misma respuesta pública (hash idéntico de `/`) y ambos responden HTTPS 200. No se retiró ni se modificó el dominio anterior.

El sitio de producción es estático, administrado desde el repositorio GitHub `kunsanggar`, rama `main`, y publicado por Hostinger en `public_html`. El panel Hostinger muestra despliegue automático activo; el último commit de `main` observado fue `7469aa8`.

## Cambios preparados en esta rama

- Canonical, Open Graph, Twitter, enlaces absolutos y metadatos del sitio apuntan al dominio nuevo; el correo heredado se conserva hasta tener buzones nuevos y migración de mensajes verificados.
- Regla 301 para el host anterior y el alias `www.kunsanggar.com`, conservando ruta y query string.
- `robots.txt` y `sitemap.xml` actualizados para el dominio nuevo; no enumeran cuenta, admin, API ni libros.
- CORS de la API de pagos permite el nuevo origen; los retornos usan el nuevo dominio. Webhook mantiene el endpoint server-side de Vercel.
- Se integró la rama funcional de clases/eventos/galería; su migración Supabase debe aplicarse antes de publicarla.

Estos cambios todavía no constituyen el corte productivo: Auth y la migración de esquema requieren acceso al proyecto Supabase destino. Vercel identifica el proyecto `kunsanggar`, pero tanto la lectura como la edición de variables de producción devolvieron HTTP 403 por permisos insuficientes; el navegador también muestra login. No activar 301 de producción hasta verificar login/registro/callbacks y endpoints con el nuevo host.

## Datos y servicios preservados

- Supabase destino configurado por el producto: proyecto `bzmqddxnpopkqhdxsngu`; no se tocó el proyecto antiguo ni otros proyectos.
- API de pagos: proyecto Vercel `kunsanggar`, raíz `landing-eventos`; API browser-base actualmente `https://kunsanggar.vercel.app`.
- Mercado Pago: código y órdenes no se alteraron; no se ejecutó ningún cobro. Actualizar `PUBLIC_SITE_URL` al dominio nuevo y fijar `PAYMENT_WEBHOOK_URL` al endpoint Vercel tras iniciar sesión en Vercel.
- Correo antiguo: planes/buzones permanecen sin cambios. No se creó ni borró ningún buzón y no se alteraron registros MX antiguos.
- El dominio nuevo no tiene MX, SPF/TXT, DKIM ni DMARC publicados en la consulta DNS y no aparece un plan de correo asociado. El dominio anterior conserva MX Hostinger, SPF y CNAME DKIM. La cuenta Hostinger abierta contiene varios sitios; no se concedió acceso a esa cuenta.

## Plan de corte y rollback

1. Aplicar la migración SQL aditiva de clases/eventos/galería en Supabase destino y verificar políticas/RLS.
2. Añadir el dominio nuevo en Supabase Auth como Site URL/redirect permitido; probar registro, confirmación, login, recuperación y logout.
3. En el proyecto Vercel `kunsanggar`, actualizar `PUBLIC_SITE_URL` y `PAYMENT_WEBHOOK_URL`, confirmar variables existentes sin revelar valores y desplegar.
4. Publicar este commit por Hostinger desde `main`. Probar login, formularios, checkout en modo sin cargo, contenido privado y rutas ES/EN en ambos dominios.
5. Confirmar el 301 por ruta y query string, y revisar `robots.txt`, sitemap y canonicals. Mantener DNS, hosting y correo del dominio anterior.
6. Si falla: revertir el commit de redirección; el dominio antiguo continuará servido y el alias nuevo puede permanecer temporalmente. No cambiar MX como rollback web.

## No completado

- URLs permitidas y plantillas de correo de Supabase Auth.
- Variables de Vercel de producción: `PUBLIC_SITE_URL` y `PAYMENT_WEBHOOK_URL` no pudieron actualizarse; el usuario Vercel disponible carece de permiso de lectura/escritura de variables (403). La corrección CORS está en la rama, pendiente de deploy.
- Migración SQL aditiva más reciente.
- Alta de correo `@kunsanggar.com`, migración de mensajes y pruebas reales de envío/recepción.
- Administración independiente de Roberto: Hostinger confirma que el acceso compartido a hosting expone todos los sitios del plan; un plan de email gratis no permite acceso compartido. Se requiere cuenta/servicio independiente controlado por Roberto, sin transferir ni borrar los buzones viejos.
- Search Console / cambio de dirección: acceso no verificado.

No se hizo deploy ni se cambió DNS durante la preparación de código.
