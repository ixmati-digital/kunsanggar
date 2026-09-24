# Kunsang Gar — V1 final technical handoff

Date: 2026-09-23
Scope: V1 México, public ES/EN, Supabase production and existing Vercel API.

This document records the final technical verification. It does not change public copy, translations, design, payment scope or Phase 2.

## COMPLETE

| Area | Status | Evidence |
| --- | --- | --- |
| Public ES | PASS | Production home and public routes loaded with `lang="es"`; language switcher present; no console errors in the smoke check. |
| Public EN | PASS | Production home and public routes loaded with `lang="en"`; English copy rendered through the controlled local i18n layer; no console errors in the smoke check. |
| Admin login | PASS | Production `/account/` authenticated with the configured administrative user. |
| Admin role | PASS | Account page displayed `ADMIN`; `/admin/` route guard allowed access. |
| Program CRUD | PASS | Created, edited, published and then deleted a temporary technical record through the authenticated admin UI. No doctrinal content was used. |
| Content CRUD | PASS | Created, edited, assigned `RESTRICTED`, published and then deleted a temporary technical record through the authenticated admin UI. |
| Public RLS | PASS | Anonymous REST checks returned no rows for `ticket_orders`, `profiles`, `programs` and `content_items`; the policies were also reviewed in the versioned migration. |
| Admin RLS | PASS | Authenticated `/admin/orders.html` loaded the migrated order data through the Supabase anon client and admin policy. |
| Private Storage | PASS | Supabase production shows the `protected-content` bucket with two policies; the bucket is private and contains no V1 test files. |
| Admin orders | PASS | `/admin/orders.html` rendered in the authenticated production session. |
| Vercel API availability | PASS | Safe production checks: webhook `GET` returned the expected ignored response; preference endpoint `OPTIONS` returned `204`; method guards returned expected `405`; payment status returned the expected validation `400` without an order reference. |
| Supabase production | PASS | New Kunsang Gar project responded at the configured project URL; tables, migrated orders, RLS policies and private bucket were available. |
| Program/content test-data cleanup | PASS | Earlier temporary program/content records were deleted through the Supabase SQL Editor; anonymous REST checks on 2026-09-23 returned empty results. The temporary Auth user remains and is tracked below. |
| Public copy boundary | PASS | Source audit found no internal phase, budget, blocker, QA, infrastructure or approval copy in the public HTML. |
| Practitioner registration UI | DEPLOYED, runtime incomplete | Account page offers Supabase sign-up. The temporary user was created, but Auth requires email confirmation and has not issued a practitioner session. |
| Student enrollment/admin access UI | DEPLOYED, unverified | Admin has Students and Access Control screens using `enrollments` and `access_grants`; no practitioner enrollment or grant has been tested end-to-end. |
| Private upload UI | DEPLOYED, unverified | Admin content form targets the private `protected-content` bucket and stores `storage_path`; no protected test file has been uploaded or opened. |
| Admin guard without session | PASS | In a fresh production browser session, `/admin/orders.html` redirected to `/account/?next=%2Fadmin%2Forders.html` before showing orders. Authenticated ADMIN access was verified in the earlier QA run. |

## CLIENT ACCEPTANCE TEST

### Mercado Pago

**CLIENT ACCEPTANCE TEST PENDING.** Roberto must perform the real MXN transaction. This closure did not create a payment, preference or new order, and therefore does not claim that the live payment-to-webhook-to-order cycle is accepted.

The deployed API preserves the existing México/MXN flow and server-side secret handling. The pending client test must verify: preference creation, Mercado Pago approval or pending result, webhook update, `payment_id`, `payment_status`, result page and the corresponding row in `/admin/orders.html`.

### Remaining runtime validations

| Check | Status | Reason |
| --- | --- | --- |
| Normal user login/session/profile and RLS | BLOCKED | Password login for `v1-practitioner-20260923@kunsanggarmexico.com` returned `email_not_confirmed` on 2026-09-23. No practitioner JWT or session was issued. |
| Admin enrollment/grant and practitioner program/content access | BLOCKED | Requires the confirmed practitioner session, temporary technical program/content records and destination dashboard access for the test and cleanup. No complete path has been exercised. |
| Private upload and signed URL | BLOCKED | Requires an authorized protected test resource and practitioner session. Bucket configuration and code alone are not end-to-end proof. |
| Access consistency migration | BLOCKED | `20260923000000_v1_access_consistency.sql` is versioned and pushed but has not been applied to the destination project. |
| Temporary Auth user cleanup | BLOCKED | The unconfirmed test user still exists in the destination project; destination Authentication administration is not accessible in the current dashboard session. |

No public protected resource was created to hide an unverified result. The temporary Auth account must be removed after the practitioner test; it has no application data or access grants at this checkpoint.

The access consistency migration `20260923000000_v1_access_consistency.sql` was pushed in `b0a8ee9`. It must be applied in destination `bzmqddxnpopkqhdxsngu` before final RLS acceptance. Direct navigation to destination Authentication redirected the current Supabase dashboard session to the Ixmati organization list; its project list contains the historical Kunsang project `zienhasmbmrzwcysekdh`, Academia Ixmati and PhotoSchool. The historical project was not modified. Production REST calls to `bzmqddxnpopkqhdxsngu` work with the public key but do not provide administrative access.

## CLIENT CONTENT REVIEW

The public ES/EN experience is technically complete. The following source translations require linguistic/doctrinal review by Kunsang Gar before being treated as definitive:

- Geshe Dangsong
- Bön
- Nuevo Bön
- Rimé
- Certificación
- Oraciones

This is a client content review, not a technical failure. The review status is internal only and is not exposed in the public site.

## PHASE 2 / OUT OF SCOPE

The following are not part of this V1 handoff:

- Books, store catalogue, purchase links or checkout.
- Tibetan language.
- International currencies or payment processors.
- Stripe or PayPal.
- Social network, internal chat, LMS expansion or complex streaming.
- New event operations beyond the existing V1 México integration.
- Automatic translation or external translation widgets.

## FINAL STATUS MATRIX

```text
PUBLIC ES: PASS
PUBLIC EN: PASS
AUTH: PASS (ADMIN session verified)
ADMIN: PASS
PROGRAM CRUD: PASS
CONTENT CRUD: PASS
PUBLIC RLS: PASS
NORMAL USER RLS: BLOCKED — practitioner email unconfirmed
ADMIN RLS: PASS
PRIVATE STORAGE: PASS
SIGNED URL: BLOCKED — no authorized protected resource or practitioner session
ADMIN ORDERS: PASS
VERCEL API: PASS — availability/method checks; real payment not executed
SUPABASE: PASS
MERCADO PAGO: CLIENT ACCEPTANCE TEST PENDING
CLIENT CONTENT REVIEW: REQUIRED — internal, not public
PRODUCTION: PASS for verified public/API routes; member golden path unverified
V1 TECHNICAL STATUS: NOT CLOSED — practitioner/admin member workflow, private document and migration require live validation
```

The public site remains live. This handoff is internal; no doctrinal test content or protected client document was published.
