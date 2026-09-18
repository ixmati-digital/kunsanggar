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

Apply `supabase/migrations/20260918000000_v1_product.sql` to the existing Supabase project. Then create an Auth user and promote it manually from the SQL editor:

```sql
update public.profiles set role = 'ADMIN' where id = 'AUTH_USER_UUID';
```

The existing `ticket_orders` table, Mercado Pago functions and Stripe links are intentionally untouched. The existing landing-eventos `.env.local` contains a Vercel token and must not be copied into ROOT or committed.
