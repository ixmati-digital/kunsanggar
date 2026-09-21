# Kunsang Gar — Supabase Infrastructure Migration

Status: `IN PROGRESS / NON-DESTRUCTIVE — DATA IMPORT COMPLETE`

Checkpoint audited: `8bc1382` (`feat: close V1 Mexico payment operations`)

## SOURCE

- Current source organization: `Ixmati Estudio FREE` (`gdbtsslhihnadsuldszk`).
- Current Kunsang project: `kunsang-gar` (`zienhasmbmrzwcysekdh`), region shown as `AWS | us-east-1`, production branch `main`.
- Separate PhotoSchool project observed in the same organization: `PhotoSchool` (`favxlanxbozcmhzvpyvb`), region `AWS | us-east-2`; it is out of scope and was not modified.
- The source project must remain online and unchanged during this migration.
- PhotoSchool resources are explicitly out of scope. No PhotoSchool table, bucket, object, policy, user, or configuration may be changed.

## DESTINATION

- Supabase account/organization owned by Kunsang Gar.
- Project name: `kunsang-gar`.
- Environment: Production.
- Plan: Free only; stop if any action introduces a charge.
- Region: choose one available reasonable for Mexico/USA during project creation and record it here before continuing.
- Target services: Database, Auth, Storage, and RLS in the new project.
- Destination organization: `Kunsang Gar FREE` (`nfhdevnhuibdnjepwkkv`).
- Destination project: `Kunsang Gar` (`bzmqddxnpopkqhdxsngu`), region `AWS | us-east-2`, production branch `main`.
- Destination project URL: `https://bzmqddxnpopkqhdxsngu.supabase.co`.
- Destination created before this migration; it was verified clean before applying the migrations.

## SCHEMA

Migrations reviewed locally and intended to run in this order after clean-project compatibility review:

1. `supabase/migrations/20260918000000_v1_product.sql`
2. `supabase/migrations/20260919000000_v1_mexico_payments.sql`

Expected V1 objects:

- `profiles`
- `programs`
- `content_items`
- `enrollments`
- `access_grants`
- `events`
- `ticket_orders`
- Functions/triggers for timestamps, new-user profiles, admin checks, and content/program access.
- Private Storage bucket `protected-content`.

Compatibility notes:

- The product migration is designed for a clean project and uses `create ... if not exists`, triggers, policies, and a private bucket.
- The payments migration creates or extends `ticket_orders` additively. It must not be run against PhotoSchool or any unrelated project.
- `ticket_orders` is preserved as the V1 México contract; no destructive alter/drop operation is authorized.
- Before applying to a non-empty Kunsang source, compare columns, constraints, functions, triggers, policies, and existing rows with the migration.

## DATA

Read-only source inventory completed on 2026-09-21:

- `public` currently exposes only `ticket_orders` in the Table Editor.
- `ticket_orders` contains 50 records; these are the only source rows observed and must be treated as Kunsang payment data pending ownership confirmation.
- Auth shows 3 users; their email addresses are intentionally not recorded here.
- Storage shows 0 buckets in the current Kunsang project.
- The V1 product tables (`profiles`, `programs`, `content_items`, `enrollments`, `access_grants`, `events`) were not present in the visible source table inventory.
- `ticket_orders` has RLS enabled in the source; the dashboard showed no visible policy for that table, so the destination policy must be applied and tested explicitly.

Destination migration status as of 2026-09-21:

- Product migration applied successfully.
- Mexico payments migration applied successfully after a clean-query retry; `ticket_orders` contains 50 imported Kunsang rows from the read-only source export. Literal CSV `null` values were normalized to empty database values before import; no source row was edited.
- Seven V1 tables are visible in the destination Table Editor.
- Private bucket `protected-content` is present and shows two policies.
- `ticket_orders_admin_read` is present and RLS is enabled.
- Public REST checks with the publishable key returned empty arrays for the V1 tables; no public order data was exposed.
- The source `ticket_orders` table remains unchanged with its 50 rows; no PhotoSchool project, table, bucket, object, policy, user, or configuration was modified.

Data migration result:

- Source export verified at 50 rows and 20 columns.
- Destination Table Editor confirmed `Successfully imported 50 rows` and `50 records`.
- No profiles, programs, content, enrollments, access grants, events, Auth users, or Storage objects were copied because they were not verified as required Kunsang data and/or require owner-controlled authorization.

Required data inventory before any further migration:

- Count and sample-safe metadata for Kunsang `profiles`, `programs`, `content_items`, `enrollments`, `access_grants`, `events`, and `ticket_orders`.
- Identify whether current rows are real Kunsang data, seed/demo data, or unrelated tenant data.
- Do not copy PhotoSchool data or any ambiguous row.
- For V1 México, preserve only the Kunsang event/order records required for operational continuity, after confirming ownership.
- New destination may begin with schema-only data if no verified Kunsang data exists.

## AUTH

- Enable Supabase Auth for Kunsang users.
- Create/prepare one administrative user only after the Kunsang email and password/verification flow are supplied by the owner.
- Assign `profiles.role = 'ADMIN'` only to the verified Kunsang administrator.
- Default role is `PRACTITIONER`.
- `/admin/orders.html` must require a valid session and `ADMIN` profile.
- Never place a service-role key in frontend files, Git, or browser-visible configuration.

## STORAGE

- Create only the private `protected-content` bucket required by V1.
- Do not copy `UNCONFIRMED` audio.
- Do not upload restricted religious PDFs.
- Do not alter or inspect PhotoSchool buckets beyond read-only ownership identification.
- Authorized content must use Supabase session plus RLS/signed access; hiding a public URL is not sufficient.

## RLS

Required verification in the destination:

- Public users cannot list or read `ticket_orders`.
- Authenticated non-admin users cannot list administrative orders.
- Authenticated `ADMIN` users can read the order fields required by `/admin/orders.html`.
- Browser clients do not insert/update orders directly.
- Authorized serverless handlers use a server-only service-role key.
- Published program/content access follows `PUBLIC`, `ENROLLED`, and `RESTRICTED` rules.
- `protected-content` remains private and only authorized users/admins can read objects.

## SECRETS / ENV REFERENCES

Required outside Git:

- `SUPABASE_URL` / public browser URL.
- `SUPABASE_ANON_KEY` for browser-safe access.
- Server-only `SUPABASE_SERVICE_ROLE_KEY` for Vercel API handlers.
- Mercado Pago production credentials and webhook configuration for México.
- Vercel project environment variables for Production, Preview, and Development as appropriate.

Current repository state:

- `assets/platform-config.js` now contains the destination project URL and browser-safe publishable key; it contains no service-role key.
- `assets/payment-config.js` has an empty API base and contains no secrets.
- `landing-eventos/.env.local` contains only a redacted Vercel OIDC token reference; no production Supabase or Mercado Pago secret is available in the repository.
- The frontend has not been deployed or cut over; the old project remains available for rollback.

## MIGRATION PLAN

1. Confirm Kunsang source project identity and inventory without modifying PhotoSchool.
2. Create clean Free destination project `kunsang-gar`; stop on any paid-plan prompt.
3. Review both migrations against a clean destination and apply them in order.
4. Verify schema, functions, triggers, RLS, policies, and private bucket.
5. Inventory and migrate only verified Kunsang data. Completed for `ticket_orders`: 50 rows imported; no ambiguous product/content/auth/storage data copied.
6. Configure Auth and create the Kunsang administrator through the owner-controlled login/verification flow.
7. Configure Vercel serverless environment with the new Supabase URL, anon key, service-role key, and approved Mercado Pago credentials.
8. Update browser-safe `assets/platform-config.js` and API base configuration without committing secrets.
9. Run non-payment QA: public site, Auth, admin role, RLS, programs/content, private storage, and `/admin/orders.html`.
10. Prepare Mercado Pago México; do not execute a real payment until the owner explicitly approves the test.
11. Cut over only after NEW READY, TEST, and comparison checks pass.
12. Retain the old project as rollback; do not delete or alter it during this operation.

## ROLLBACK PLAN

- Keep the source Supabase project and current Vercel configuration unchanged until destination verification is complete.
- If destination verification fails, leave the frontend on the current configuration and do not remove source data.
- Revert only the Kunsang-specific configuration change to the prior known-good values; never roll back by deleting tables, buckets, or projects.
- Disable destination test credentials if necessary, without touching PhotoSchool resources.
- Re-run comparison and document the failure before attempting another cutover.

## GATES / STOP CONDITIONS

- Stop for Kunsang email, password, login, email verification, CAPTCHA, 2FA, or sensitive authorization.
- Stop for Mercado Pago credentials or any real payment approval.
- Stop for any billing/paid-plan prompt.
- Stop before any destructive action or any ambiguous tenant ownership.
