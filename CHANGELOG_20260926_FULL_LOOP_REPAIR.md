# 2026-09-26 — Full Loop Production Repair

## What was traced

The supplied V31.1 package had a structurally correct 7-step architecture, but the browser/data contract was still vulnerable to live-schema drift and partial refresh failures:

- A single failing optional Supabase table could make `refresh()` reject the whole workspace after a successful write.
- Save/import error messages exposed only generic browser HTTP 400 text instead of the Supabase error code/details.
- Campaign shell creation from Audience did not explicitly send `created_by`.
- Discover was provider-first for stale catalog records. If the provider was temporarily unavailable, an existing creator already stored in `creator_catalog` could fail to render even though the database already contained the creator.
- The live database could still be an older contract without `organizations.created_by`, `campaigns.payload`, Discover policy/quality columns, or the current intelligence tables.

## Changes

### Frontend
- `app.js`
  - Added structured Supabase error reporting.
  - Made workspace refresh fault-tolerant per table.
  - Kept core saved data visible even if an optional intelligence table is temporarily unavailable.
  - Added bootstrap retry and explicit missing-organization diagnostics.
  - Added `created_by` to the Audience-created campaign shell.
  - Discovery/import now survives a post-save refresh error instead of reporting a false import failure.

### Discover Edge Function
- `supabase/functions/discover-creator/index.ts`
  - Catalog-first lookup.
  - Existing catalog rows remain usable while a stale provider refresh is attempted.
  - Provider outage now falls back to the stored catalog instead of blanking the creator.
  - Source reads use the full current source row so policy metadata stays synchronized.

### Database
- `SQL_TO_RUN/04_PRODUCTION_CONTRACT_REPAIR.sql`
  - Idempotent live-schema repair for legacy deployments.
  - Reasserts core columns, Discover metadata columns, intelligence tables and org-scoped RLS.
  - Reloads PostgREST schema cache.
- `SQL_TO_RUN/05_PRODUCTION_HEALTHCHECK.sql`
  - Read-only verification of the production contract and Discover data.

## Required deployment order

1. Deploy the updated frontend (`app.js` and package contents).
2. Run `04_PRODUCTION_CONTRACT_REPAIR.sql`.
3. Run `05_PRODUCTION_HEALTHCHECK.sql` and confirm the returned booleans are `true`.
4. Redeploy `discover-creator`.
5. Redeploy `intelligence-engine` if the deployed version is not the supplied V31.1 version.
6. Hard-refresh the browser and sign in again.
