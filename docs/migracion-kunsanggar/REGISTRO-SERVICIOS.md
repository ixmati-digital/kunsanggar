# Registro de servicios y configuraciones

| Componente | Actual | Estado para el dominio nuevo |
|---|---|---|
| Dominio web | `kunsanggar.com` | Registrado en el Hostinger observado; nameservers `horizon.dns-parking.com` y `orbit.dns-parking.com`. |
| Web | Hostinger, repo GitHub `kunsanggar`, `main`, raíz `public_html` | Alias conectado al sitio existente; SSL activo; 301 preparado en la rama, no publicado. |
| Dominio de transición | `kunsanggarmexico.com` | Sigue activo; no quitar ni modificar DNS/correo durante transición. |
| Supabase | Proyecto destino `bzmqddxnpopkqhdxsngu` | La app usa este proyecto; actualizar Auth Site URL/redirect allow-list a `https://kunsanggar.com/**` y `https://www.kunsanggar.com/**` tras login de operador. |
| API pagos | Vercel `kunsanggar` (raíz `landing-eventos`) | `assets/payment-config.js` llama a `https://kunsanggar.vercel.app`; conservar ese endpoint. Permitir nuevo origen y actualizar `PUBLIC_SITE_URL`; `PAYMENT_WEBHOOK_URL` debe seguir apuntando a la API Vercel. |
| Mercado Pago | Código de pagos V1 MXN existente | Sin transacción en esta migración. No se alteraron secretos; callback/cors preparados en rama. |
| Email anterior | Hostinger Email para `@kunsanggarmexico.com` | Intacto; mantener mientras existan mensajes o uso. |
| Email nuevo | Ningún plan/buzón asociado observado para `@kunsanggar.com` | Pendiente de servicio controlado por Roberto; no modificar MX hasta respaldo y disponibilidad. |
| SEO | Canonical/hreflang/sitemap/robots | Preparados en rama para el nuevo dominio; Search Console no verificado. |

Los secretos sólo se administran en paneles de servicio. Este documento no registra tokens, contraseñas ni claves.
