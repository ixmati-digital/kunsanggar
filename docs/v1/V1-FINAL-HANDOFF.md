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
| Program/content test-data cleanup | NOT VERIFIED IN THIS RUN | Anonymous REST checks on 2026-09-24 returned empty arrays for programs and content_items. No member-path test rows were created in this run. |
| Public copy boundary | PASS | Source audit found no internal phase, budget, blocker, QA, infrastructure or approval copy in the public HTML. |
| Practitioner registration UI | DEPLOYED, runtime incomplete | Account page offers Supabase sign-up. The existing temporary user's email was confirmed in destination Auth, but this run did not establish a practitioner session. |
| Student enrollment/admin access UI | DEPLOYED, unverified | Admin has Students and Access Control screens using `enrollments` and `access_grants`; no practitioner enrollment or grant has been tested end-to-end. |
| Private upload UI | DEPLOYED, unverified | Admin content form targets the private `protected-content` bucket and stores `storage_path`; no protected test file has been uploaded or opened. |
| Admin guard without session | PASS | In a fresh production browser session, `/admin/orders.html` redirected to `/account/?next=%2Fadmin%2Forders.html` before showing orders. |
| Current ADMIN session and orders | PASS | On 2026-09-23 the production account page displayed role `ADMIN`; `/admin/orders.html` loaded historical `ticket_orders` rows. The admin overview showed 0 programs and 0 content items; Students showed the temporary PRACTITIONER profile with no enrollment. |
| Admin cache correction | PASS | The admin HTML now loads `admin.js?v=6`; a fresh production navigation displayed Students and Access Control after the previous `v=5` cache obscured those screens. |
| Public language regression | PASS for corrected UI copy | A live EN check found untranslated account registration labels, a repeated home callout and a mislabeled account link. The non-doctrinal labels were corrected in `assets/i18n.js`; production browser checks after deploy showed `Create account`, `JOIN` and `Access`. |

## CLIENT ACCEPTANCE TEST

### Mercado Pago

**CLIENT ACCEPTANCE TEST PENDING.** Roberto must perform the real MXN transaction. This closure did not create a payment, preference or new order, and therefore does not claim that the live payment-to-webhook-to-order cycle is accepted.

The deployed API preserves the existing México/MXN flow and server-side secret handling. The pending client test must verify: preference creation, Mercado Pago approval or pending result, webhook update, `payment_id`, `payment_status`, result page and the corresponding row in `/admin/orders.html`.

### Remaining runtime validations

| Check | Status | Reason |
| --- | --- | --- |
| Normal user login/session/profile and RLS | BLOCKED | The previous login attempt returned `email_not_confirmed`; Auth later confirmed that temporary user, but practitioner login and RLS have not been retested. |
| Admin enrollment/grant and practitioner program/content access | BLOCKED | Requires an authenticated practitioner session and temporary technical records. The browser session became unavailable before the end-to-end test. |
| Private upload and signed URL | BLOCKED | Requires an authorized protected test resource and practitioner session. Bucket configuration and code alone are not end-to-end proof. |
| Access consistency migration | PASS | `20260923000000_v1_access_consistency.sql` was applied in the Kunsang destination SQL Editor on 2026-09-24; Supabase returned “Success. No rows returned”. |
| Temporary Auth user cleanup | BLOCKED | The prior temporary user was confirmed, but this run could not remove it because the connected Chrome debugging session became unavailable. |

No public protected resource was created to hide an unverified result. The destination Auth user was confirmed, but a fresh practitioner login and test-data cleanup remain outstanding. An additional test user was not created because Chrome automation lost its session before submitting the user form.

The production practitioner login form displayed `Email not confirmed` during the earlier 2026-09-23 check. The temporary account was subsequently confirmed directly in destination Auth on 2026-09-24, but login with that account has not yet been retested.

The access consistency migration `20260923000000_v1_access_consistency.sql` is applied in destination `bzmqddxnpopkqhdxsngu`. The owner deleted the historical Kunsang project `zienhasmbmrzwcysekdh` after cutover; the active Kunsang project remains the destination. On 2026-09-24, anonymous REST requests to `ticket_orders`, `profiles`, `programs`, `content_items`, `enrollments` and `access_grants` each returned HTTP 200 with zero visible rows. This confirms public requests did not expose rows, but does not prove practitioner or administrator RLS behavior. Chrome automation then reported `Debugger unattached` and `User unavailable`, preventing further dashboard and production-session interaction.

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
NORMAL USER RLS: BLOCKED — no practitioner session/test was completed
ADMIN RLS: PASS
PRIVATE STORAGE: PASS
SIGNED URL: BLOCKED — no authorized protected resource or practitioner session
ADMIN ORDERS: PASS
VERCEL API: PASS — availability/method checks; real payment not executed
SUPABASE: PASS
MERCADO PAGO: CLIENT ACCEPTANCE TEST PENDING
CLIENT CONTENT REVIEW: REQUIRED — internal, not public
PRODUCTION: PASS for verified public/API routes; member golden path unverified
V1 TECHNICAL STATUS: NOT CLOSED — practitioner login, end-to-end enrollment/access, signed URL and temporary-user cleanup remain unverified
```

The public site remains live. This handoff is internal; no doctrinal test content or protected client document was published.
