# KOL IDS — Campaign Schema Cache Fix

## Problem fixed
The Campaign save action could fail with:
`Could not find the 'payload' column of 'campaigns' in the schema cache`

## Root cause
The current SQL used `CREATE TABLE IF NOT EXISTS public.campaigns (...)`, but an older existing `campaigns` table can survive without the newer `payload` column. `CREATE TABLE IF NOT EXISTS` does not alter an existing table, so Supabase/PostgREST continued exposing the old schema.

## Fix
- Added idempotent `ALTER TABLE ... ADD COLUMN IF NOT EXISTS payload jsonb` repair for `campaigns`.
- Added the same compatibility repair for other payload-based product tables.
- Added a standalone migration: `supabase/migrations/20260925_campaign_payload_compatibility.sql`.
- Added `NOTIFY pgrst, 'reload schema'` so the API schema cache refreshes immediately after repair.
- Existing data is preserved; no table is dropped or recreated.

## Deploy
1. Open Supabase SQL Editor.
2. Run `supabase/migrations/20260925_campaign_payload_compatibility.sql`.
3. Reload the KOL IDS workspace and save the Campaign again.
