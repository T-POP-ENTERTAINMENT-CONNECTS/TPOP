# KOL IDS V31.2 — Full Loop Production Repair

This package is a production repair of the supplied V31.1 Discover/7-step build.

Main fixes:
- Fault-tolerant Supabase refresh so optional table errors do not mask successful saves.
- Detailed Supabase/PostgREST error messages in the frontend.
- Bootstrap retry and live-schema contract diagnostics.
- Catalog-first Discover with stale-provider fallback.
- Audience-created campaign shell now writes created_by explicitly.
- Idempotent production DB repair SQL and health check.
- Updated Discover Edge Function.
