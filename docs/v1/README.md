# Kunsang Gar V1 runtime setup

ROOT remains a static site. The functional surfaces use the Supabase browser client with the **publishable/anon key only**. Do not put `service_role` in ROOT or in a browser-exposed file.

Before testing, provide runtime configuration through a file loaded before `/assets/platform.js`:

```js
window.KUNSANG_GAR_CONFIG = {
  supabaseUrl: "https://YOUR_PROJECT.supabase.co",
  supabaseAnonKey: "YOUR_PUBLISHABLE_OR_ANON_KEY",
  storageBucket: "protected-content"
};
```

Apply `supabase/migrations/20260918000000_v1_product.sql` first, then
`supabase/migrations/20260919000000_v1_mexico_payments.sql` to the existing
Supabase project. The second migration is additive: it preserves the
historical `ticket_orders` rows, adds the MXN contract and grants read access
only to authenticated ADMIN profiles.

Then create an Auth user and promote it manually from the SQL editor:

```sql
update public.profiles set role = 'ADMIN' where id = 'AUTH_USER_UUID';
```

The historical Mercado Pago handlers in `landing-eventos/api/` are reused by
the ROOT wrappers in `/api/`. The historical Stripe links remain preserved but
are outside V1 and must not be activated. The existing `landing-eventos/.env.local`
contains a Vercel token and must not be copied into ROOT or committed.

## Hostinger + Vercel API

Hostinger may continue serving the public static frontend. Deploy the ROOT
`/api/` directory as a Vercel serverless project, configure its server-only
variables from `docs/v1/MERCADO-PAGO-MEXICO-RUNBOOK.md`, then set the public
Vercel origin in `assets/payment-config.js`. The origin is public configuration;
Mercado Pago and Supabase secrets remain only in Vercel environment variables.
