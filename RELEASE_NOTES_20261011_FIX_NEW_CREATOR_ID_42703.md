# KOL IDS — Fix for HTTP 500 / PostgreSQL 42703

Root cause from Supabase logs:
`record "new" has no field "creator_id"`.

The `kolids_validate_org_links()` trigger function used a boolean expression combining `tg_table_name` with `NEW.creator_id`. On trigger tables without that column, PostgreSQL can still evaluate the record-field reference and throw 42703. The creator check is now nested inside a table-name branch that only runs for `performance_observations` and `prediction_ledger`.

## Apply the database migration

Run `supabase/migrations/20261011_fix_new_creator_id_record_42703.sql` in Supabase SQL Editor, or apply migrations using your normal Supabase migration workflow. Then retry Calculate / refresh fit.

This migration updates the database trigger function. Deploying the Edge Function alone is not sufficient for this database-side error.
