# Mercado Pago México — V1 runbook

## Scope

One-time payments only, in MXN, through Mercado Pago Checkout Pro:

`ROOT checkout → create preference → Mercado Pago → return → webhook → ticket_orders`

Supported concepts in V1:

- `sadhana_dakinis`: `$600 MXN`, active while the class is upcoming.
- `donacion_mx`: one-time donation, integer amount between `$50` and `$50,000 MXN`.

Historical event slugs remain in the backend for record continuity, but past events are inactive for new checkout.

## Required server environment

Configure only in the serverless runtime:

```text
MERCADOPAGO_ACCESS_TOKEN
MERCADOPAGO_WEBHOOK_SECRET
MERCADOPAGO_WEBHOOK_SIGNATURE_REQUIRED=true
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
PUBLIC_SITE_URL
SADHANA_DAKINIS_PRICE=600
PAYMENT_SUCCESS_PATH=/payment-success.html
PAYMENT_FAILURE_PATH=/payment-failure.html
PAYMENT_PENDING_PATH=/payment-pending.html
PAYMENT_WEBHOOK_PATH=/api/mercadopago-webhook
# If the public frontend stays on Hostinger, use the Vercel API origin instead:
PAYMENT_WEBHOOK_URL=https://<vercel-api-host>/api/mercadopago-webhook
```

No access token, service-role key or other secret belongs in ROOT HTML or browser JavaScript.

If Hostinger remains the frontend host, set the public value in
`assets/payment-config.js` to the deployed Vercel API origin, for example
`https://<vercel-api-host>`. This value is not a secret. The same origin must
be used by `PAYMENT_WEBHOOK_URL` so Mercado Pago can reach the webhook.

## Database

Apply `supabase/migrations/20260919000000_v1_mexico_payments.sql` to the existing Supabase project. It is additive, creates/preserves `ticket_orders`, enables RLS without public policies, and leaves service-role writes available to the backend handlers.

## Verification required before production

1. POST a controlled Sadhana request and confirm a Mercado Pago preference is returned.
2. Confirm a `ticket_orders` row is created with `payment_status = created`, `currency_id = MXN` in the preference, amount and `external_reference`.
3. Complete a controlled Mercado Pago test payment.
4. Confirm return page, webhook delivery, `payment_id`, normalized `payment_status` and `date_approved`.
5. Test pending and rejected/cancelled outcomes.
6. Test a one-time donation amount and reject invalid/out-of-range amounts.
7. Confirm no browser response contains a secret.

Until those steps run against real credentials and a real backend, V1 is `DEMO READY` but not `PRODUCTION READY`.
