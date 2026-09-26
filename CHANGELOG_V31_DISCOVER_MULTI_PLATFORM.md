# KOL IDS V31 — Discover Creator + Multi-Platform Intelligence

## What changed

- `Search by @handle` is now the primary Creator discovery input.
- Discover can search the primary platform plus optional additional channels in one request.
- Added **Lemon8** as a supported platform in the application layer and catalog constraint.
- A discovered person is imported as **one Creator with multiple verified channel records**, instead of one Creator per platform.
- Creator payload now keeps `channels[]`, `multiPlatform`, and platform-specific metrics/source/data-quality evidence.
- Discover fit is aggregated across returned channels and remains campaign-aware.
- Digital Performance now explicitly supports Instagram, TikTok, YouTube, Facebook, X, and Lemon8 under the same Creator.
- Intelligence Engine exposes `platformPerformance` evidence for historical digital observations, with platform-level scores and observed totals.
- Cross-platform reach/views are explicitly treated as observed platform totals, **not unique-user reach**.
- Existing provider compliance model remains intact: no scraping was introduced.

## Supabase migration

Run after the existing 20260926 Discover migrations:

`supabase/migrations/20260927_discover_multi_platform.sql`

## Edge Functions to deploy

- `discover-creator`
- `intelligence-engine`

## Frontend

- `app.js`

## Provider requirement

Lemon8 and any non-YouTube/TikTok channel still require the configured approved provider contract (`KOLIDS_PROVIDER_URL` + `KOLIDS_PROVIDER_API_KEY`). Adding Lemon8 to the UI does not invent or bypass a data source.
