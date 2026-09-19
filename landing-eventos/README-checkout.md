# Checkout Pro + Supabase

## Alcance V1 México

El flujo activo de V1 es exclusivamente México + MXN + Mercado Pago. Los conceptos habilitados por el backend son `sadhana_dakinis` ($600 MXN) y `donacion_mx` (donativo único validado entre $50 y $50,000 MXN). Stripe, PayPal, USD, EUR y multimoneda permanecen fuera de V1; los enlaces históricos se conservan como referencia y no deben activarse desde ROOT.

## Archivos

Modificados:
- `index.html`
- `script.js`
- `styles.css`
- `success.html`
- `failure.html`
- `pending.html`
- `api/create-preference.js`

Agregados:
- `api/mercadopago-webhook.js`
- `supabase-schema.sql`
- `README-checkout.md`

El frontend de ROOT usa wrappers equivalentes en `/api/` y las páginas
`/checkout.html`, `/payment-success.html`, `/payment-pending.html` y
`/payment-failure.html`. El handler sigue viviendo aquí para conservar la
integración existente.

## Variables de entorno

Configurar en Vercel:

```env
MERCADOPAGO_ACCESS_TOKEN=
PUBLIC_SITE_URL=https://kunsanggarmexico.com
PAYMENT_SUCCESS_PATH=/payment-success.html
PAYMENT_FAILURE_PATH=/payment-failure.html
PAYMENT_PENDING_PATH=/payment-pending.html
PAYMENT_WEBHOOK_URL=https://<vercel-api-host>/api/mercadopago-webhook
MERCADOPAGO_WEBHOOK_SECRET=
MERCADOPAGO_WEBHOOK_SIGNATURE_REQUIRED=true
SADHANA_DAKINIS_PRICE=600
TSA_LUNG_PRICE=2000
MIL_OFRENDAS_PRICE=2000
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

No poner `MERCADOPAGO_ACCESS_TOKEN` ni `SUPABASE_SERVICE_ROLE_KEY` en HTML o JS público.

Si el frontend permanece en Hostinger, configura `PAYMENT_WEBHOOK_URL` con el
origen público real de la API serverless en Vercel y establece ese mismo origen
en `assets/payment-config.js` del frontend.

La Public Key de Mercado Pago puede usarse en frontend si después se integra Bricks, pero Checkout Pro con preferencia
solo necesita `MERCADOPAGO_ACCESS_TOKEN` en backend. Si un Access Token se compartió en texto plano, rotarlo en Mercado
Pago antes de producción y configurar el nuevo valor únicamente como variable de entorno.

## Supabase

1. Crear proyecto en Supabase.
2. Abrir SQL Editor.
3. Ejecutar `supabase-schema.sql`.
4. Copiar `Project URL` a `SUPABASE_URL`.
5. Copiar `service_role key` a `SUPABASE_SERVICE_ROLE_KEY`.

La tabla usada es `public.ticket_orders`.

## Vercel

Hostinger estático no ejecuta funciones `/api`. Para este flujo, desplegar `landing-eventos` como proyecto en Vercel:

1. Importar el repositorio en Vercel.
2. Configurar `Root Directory` como `landing-eventos`.
3. Framework preset: `Other`.
4. Build command: vacío.
5. Output directory: vacío o `.`.
6. Agregar las variables de entorno.
7. Desplegar.

El frontend llama a:

```txt
POST /api/create-preference
```

Mercado Pago notificará a:

```txt
https://kunsanggarmexico.com/api/mercadopago-webhook

El secreto de firma del webhook debe configurarse antes de producción. No
dejar el valor en el frontend ni en el repositorio.
```

## Flujo

1. El usuario inicia `Sadhana de todas las Dakinis` o un donativo desde ROOT.
2. El frontend llama a `/api/create-preference`.
3. La función valida el concepto y el monto, e inserta una orden `created` en Supabase.
4. La función crea una preferencia en Mercado Pago.
5. Mercado Pago redirige al usuario a Checkout Pro.
6. Mercado Pago regresa a `payment-success.html`, `payment-failure.html` o `payment-pending.html`.
7. Mercado Pago llama al webhook y este actualiza `ticket_orders` con datos del pago y del comprador disponibles.

## Eventos Meta Pixel

- `PageView`: se mantiene en el pixel base.
- `ViewContent`: se dispara al cargar la landing.
- `WhatsAppClickTsaLung`: se mantiene para clics de WhatsApp.
- `InitiateCheckout`: se dispara al iniciar pago.
- `Purchase`: solo en `success.html` cuando los parámetros indican `approved`.

## Checklist de pruebas

- Abrir ROOT y confirmar que el formulario de checkout sólo ofrece conceptos V1 México.
- Llenar formulario de checkout y confirmar que el backend rechaza conceptos desconocidos y montos inválidos.
- Confirmar que `/api/create-preference` responde `init_point`, `preference_id`, `external_reference`.
- Confirmar que Supabase crea una fila con `payment_status = created`.
- Completar pago de prueba en Mercado Pago.
- Confirmar que `payment-success.html` muestra pago recibido.
- Confirmar que el webhook actualiza `payment_status`, `payment_id`, `payment_method` y `raw_payment`.
- Probar pago rechazado y revisar `payment-failure.html`.
- Probar pago pendiente por SPEI/OXXO y revisar `payment-pending.html`.
