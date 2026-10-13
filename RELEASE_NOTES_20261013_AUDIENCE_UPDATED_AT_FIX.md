# Audience updated_at schema fix — 2026-10-13

- Added `public.audiences.updated_at` to the fresh-install schema.
- Added a migration for existing deployments. Existing audience rows are backfilled from `created_at` to preserve their prior revision timestamp; future inserts default to `now()`.
- Reloaded the PostgREST schema cache so the frontend save and intelligence-engine revision reads can see the column.
- No audience payload, RLS policy, or existing record was deleted or rewritten.

## Migration

`supabase/migrations/20261013_add_audiences_updated_at.sql`
