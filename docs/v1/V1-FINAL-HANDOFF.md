# Kunsang Gar — V1 final technical handoff

Date: 2026-09-21  
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
| Test-data cleanup | PASS | Temporary program/content records were deleted through the Supabase SQL Editor; public REST checks returned empty results afterward. |
| Public copy boundary | PASS | Source audit found no internal phase, budget, blocker, QA, infrastructure or approval copy in the public HTML. |
| Practitioner registration | PASS (UI deployed) | Account page now provides controlled Supabase sign-up; the production Auth project requires email confirmation before a new session is issued. |
| Student enrollment/admin access | PASS (UI deployed) | Admin now has Students and Access Control screens using the existing `enrollments` and `access_grants` tables. |
| Private upload | PASS (UI deployed) | Admin content form now uploads selected files to the private `protected-content` bucket and stores `storage_path`; no client material was uploaded during QA. |

## CLIENT ACCEPTANCE TEST

### Mercado Pago

**CLIENT ACCEPTANCE TEST PENDING.** Roberto must perform the real MXN transaction. This closure did not create a payment, preference or new order, and therefore does not claim that the live payment-to-webhook-to-order cycle is accepted.

The deployed API preserves the existing México/MXN flow and server-side secret handling. The pending client test must verify: preference creation, Mercado Pago approval or pending result, webhook update, `payment_id`, `payment_status`, result page and the corresponding row in `/admin/orders.html`.

### Remaining runtime validations

| Check | Status | Reason |
| --- | --- | --- |
| Normal user RLS | BLOCKED | A temporary practitioner signup was created, but Supabase email confirmation is required and no confirmation session was available during QA. The schema policy does not grant normal users access to `ticket_orders`; this remains a validation gap, not a claimed PASS. |
| Signed URL | BLOCKED | The production code path calls `createSignedUrl` for `storage_path` resources and the bucket policy exists, but there is no authorized protected V1 resource available to exercise end-to-end without inventing or publishing content. |

These two items are the only runtime validations left open in this handoff. No public protected resource was created to hide an unverified result. The temporary Auth account must be removed from the Supabase dashboard before final acceptance; it has no application data or access grants.

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
NORMAL USER RLS: BLOCKED — practitioner session not available
ADMIN RLS: PASS
PRIVATE STORAGE: PASS
SIGNED URL: BLOCKED — no authorized protected resource for end-to-end test
ADMIN ORDERS: PASS
VERCEL API: PASS — availability/method checks; real payment not executed
SUPABASE: PASS
MERCADO PAGO: CLIENT ACCEPTANCE TEST PENDING
CLIENT CONTENT REVIEW: REQUIRED — internal, not public
PRODUCTION: PASS for the verified public/API/Supabase scope
V1 TECHNICAL STATUS: PASS WITH EXPLICIT CLIENT ACCEPTANCE AND TWO VALIDATION BLOCKERS
```

No new feature or design change was introduced during this final closure. The only artifact generated is this internal handoff document.
