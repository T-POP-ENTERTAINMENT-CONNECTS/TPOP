# KOL IDS — Intelligence Engine HTTP 500 diagnostics (2026-10-11)

## Why this patch
The deployed endpoint returns `{ "error": "Intelligence engine failed" }`. In the current source, the catch handler replaces non-`Error` objects (including Supabase/PostgREST error objects thrown by `throw error`) with that generic message, hiding the actual failure.

## Changes
- Assigns a diagnostic ID to each caught failure.
- Writes structured error name/message/code/details/hint/status and stack (when available) to Supabase Edge Function logs.
- Returns the diagnostic ID to the browser while keeping database details out of the public response.
- Does not change authentication, organization membership, subscription checks, scoring, or database writes.

## Deploy and identify the underlying failure
This is a diagnostics patch, not a claim that the unknown database/runtime root cause is already repaired. Deploy the function, reproduce the error once, then open Supabase Dashboard → Edge Functions → `intelligence-engine` → Logs. Find `[intelligence-engine] request failed` and match the `diagnosticId` from the response. The logged `message`, `code`, `details`, and `hint` should identify the failing operation.

```bash
supabase functions deploy intelligence-engine --project-ref xdmtuoyeiyhkwiwozaut
```

After the log identifies the exact failure, fix that root cause and redeploy. Do not paste access tokens or `Authorization` headers into chat or issue trackers.
