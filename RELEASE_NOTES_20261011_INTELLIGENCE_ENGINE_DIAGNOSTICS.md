# KOL IDS — Intelligence Engine Error Diagnostics (2026-10-11)

## Change
- Preserve the original error message/code/details/hint from Supabase/PostgREST errors instead of replacing non-`Error` objects with the generic `Intelligence engine failed` message.
- Emit structured server-side diagnostics to Edge Function logs.
- Keep existing authentication, organization membership, active subscription checks, and CORS policy unchanged.

## Deploy
From the project root:

```bash
supabase functions deploy intelligence-engine --project-ref xdmtuoyeiyhkwiwozaut
```

Then retry Calculate / refresh fit once and inspect the response body or Supabase Edge Function logs. Use the resulting database error to make the permanent schema/query fix. This diagnostic patch improves visibility; it does not presume or claim to fix the underlying database/runtime failure.

## Security note
Error details may expose database schema names. Use this diagnostic response only while investigating, avoid sharing full tokens/Authorization headers, and remove or restrict detailed client-facing diagnostics after the root cause is fixed.
