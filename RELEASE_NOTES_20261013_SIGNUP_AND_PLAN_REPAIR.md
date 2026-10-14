# KOL IDS signup + plan repair (2026-10-13)

## What was checked
- Frontend sends `PLAN_1M`, `PLAN_6M`, or `PLAN_12M` and the matching visible prices.
- `client-sign-up` calls `provision_customer_account` with six arguments.
- The package contains two price migrations for 1-month plan (THB 9,700 and THB 9,800), which could leave the database price dependent on which SQL was run last.
- The function previously returned the generic `Account provisioning failed` for non-native PostgREST error objects, hiding the actual database error.

## Changes
- `client-sign-up` now records the provisioning stage and logs structured, non-secret error details. It returns a stage-specific failure instead of hiding all errors behind a generic message.
- Added `20261013_zz_final_signup_plan_catalogue_repair.sql` to make the active catalogue deterministic: Trial 7 days; 1 month THB 9,800; 6 months THB 54,000; 12 months THB 103,000. The legacy 3-month plan is disabled for new sales but historical records remain.
- The repair migration removes the obsolete five-argument provisioning RPC overload and confirms the six-argument RPC is present.
- No passwords, service-role keys, or other secrets are logged or returned.

## Required deployment steps
1. In Supabase SQL Editor, run `supabase/migrations/20261013_zz_final_signup_plan_catalogue_repair.sql` once.
2. Deploy the function from the project root:
   `supabase functions deploy client-sign-up --no-verify-jwt`
3. Ensure Edge Function secrets include `SUPABASE_URL` and either `SUPABASE_SERVICE_ROLE_KEY` or the expected `SUPABASE_SECRET_KEYS` JSON value. Never put the service key in the browser.
4. Test with a new email. If it fails, the UI now identifies the stage; inspect `client-sign-up` Logs for `[client-sign-up] request failed` and the same timestamp.
5. Before retrying an email already used for a failed attempt, check Authentication > Users and `customer_orders`; do not repeatedly submit the same form blindly.

## Validation performed
- ZIP integrity verified.
- Source and migration consistency inspected offline.
- Not connected to the production Supabase project; live Auth, database, browser, and email integration remain to be verified after deployment.
