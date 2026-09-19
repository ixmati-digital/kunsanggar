# Auditoría de brechas — Kunsang Gar V1 México

Fecha: 2026-09-19

Estados: `DONE`, `PARTIAL`, `NOT_IMPLEMENTED`, `BLOCKED`.

## Matriz

| Requisito | Estado | Evidencia / brecha |
| --- | --- | --- |
| Sitio público ROOT y navegación institucional | DONE | Las rutas editoriales principales existen y cargan localmente. |
| Contenido editorial del cliente | DONE | Geshe, Bön, Nuevo Bön, Rimé, servicios, Dana, programa y certificación están migrados en páginas ROOT. |
| Clases México | PARTIAL | Sadhana está publicada con fechas, horario, Zoom, donativo, registro externo y CTA al checkout MXN; falta validar cobro real. |
| Eventos México | PARTIAL | Visita octubre-noviembre 2026 y archivo histórico están presentados; fichas operativas/inscripciones BD aún no están conectadas. |
| Estados próximo/pasado | DONE | `/events/` marca visita como `UPCOMING` y eventos pasados como `ARCHIVED`. |
| Brochures autorizados | DONE | Los dos PDFs públicos están en `assets/documents/public/`; no se mezclan con material religioso restringido. |
| Audios `UNCONFIRMED` | DONE | Están fuera del árbol desplegable y sin referencias públicas. |
| PDFs religiosos restringidos | DONE | No tienen enlace público desde ROOT. |
| Mercado Pago México | PARTIAL | El backend V1 acepta únicamente `sadhana_dakinis` y `donacion_mx`, en MXN; no hay credenciales ni despliegue verificado. |
| Preferencia Mercado Pago | PARTIAL | `api/create-preference.js` expone el wrapper ROOT y reutiliza el handler histórico para crear preferencia y orden; requiere `MERCADOPAGO_ACCESS_TOKEN`, Supabase y backend desplegado. |
| Orden persistente | PARTIAL | Existe migración V1 para `ticket_orders`, índices y RLS sin políticas públicas; falta ejecutarla y probarla contra el proyecto real. |
| Webhook | PARTIAL | `api/mercadopago-webhook.js` expone el wrapper ROOT, verifica firma cuando está configurado y actualiza estado/payment id; falta prueba real y configuración final de URL/secreto. |
| Estados de pago | PARTIAL | El endpoint `api/payment-status.js` devuelve estados seguros por `external_reference`; falta confirmar lectura operativa en producción. |
| Retorno éxito | PARTIAL | `/payment-success.html`, `/payment-pending.html` y `/payment-failure.html` existen en ROOT; falta validación con pago real. |
| Cancelación/error | PARTIAL | El flujo ROOT muestra estados de retorno y conserva referencia de orden; falta validación externa. |
| Donaciones México | PARTIAL | `/donations.html` enlaza a donativo único MXN mediante `/checkout.html?evento=donacion_mx`; falta conectar y probar Mercado Pago/Supabase reales. |
| Admin de contenido/programas | PARTIAL | Existe frontend Supabase con CRUD de programas/contenido; requiere Supabase configurado y usuario ADMIN. |
| Admin de eventos | NOT_IMPLEMENTED | La pantalla actual declara eventos BD como no implementados; V1 puede operar con contenido editorial mientras se decide el mínimo operativo. |
| Admin de órdenes México | PARTIAL | `/admin/orders.html` ya ofrece consulta protegida para perfiles `ADMIN`; falta validar sesión, RLS y datos contra Supabase real. |
| Auth / Supabase / RLS / Storage | BLOCKED | Código y migración existen, pero no se verificaron contra un proyecto real en este entorno. |
| Pagos internacionales | PHASE_2 | Stripe/PayPal/USD/EUR no forman parte de V1. El histórico se preserva sin activarlo en ROOT. |

## Hallazgos críticos

1. El código histórico de Mercado Pago sólo conocía `tsa_lung` y `mil_ofrendas`; el handler V1 ahora agrega `sadhana_dakinis` y `donacion_mx`. Los eventos históricos quedaron fuera del checkout ROOT.
2. El histórico ya usa MXN, `ticket_orders`, `payment_status`, `payment_id`, `external_reference`, `preference_id` y webhook, por lo que se reutilizó con una configuración V1 México actualizada.
3. `landing-eventos/data/cursos.json` todavía contiene un enlace Stripe histórico para Mujeres Sagradas. No se usa como checkout V1; el histórico se conserva y queda clasificado fuera de alcance.
4. Hostinger sirve archivos estáticos y no ejecuta por sí solo estas funciones serverless. La producción necesita un backend/serverless configurado para `/api/create-preference`, `/api/mercadopago-webhook` y `/api/payment-status`, o una URL de API separada configurada explícitamente en `assets/payment-config.js`.

## Resultado de auditoría

El contenido público México está cerca de cierre. La brecha P0 real es la conexión y verificación del camino Mercado Pago + Supabase; la brecha P1 es la operación mínima de órdenes/donaciones en admin.
