# KOL IDS — Intelligence Engine CORS Fix (2026-10-11)

## Fix
- Updated `supabase/functions/intelligence-engine/index.ts` CORS headers to allow the Supabase JS `x-client-info` request header and the standard Supabase client headers used for function invocation.
- Explicitly allows the production origin `https://tpopconnects.com`.
- Keeps `POST` and `OPTIONS` as the only allowed methods.
- The `OPTIONS` preflight handler continues to return the CORS headers before processing POST requests.

## Required deployment
This source change does not take effect on the hosted Supabase project until the `intelligence-engine` Edge Function is redeployed.

From the project root, run:

```bash
supabase functions deploy intelligence-engine --project-ref xdmtuoyeiyhkwiwozaut
```

Then reload `https://tpopconnects.com` and test Creator Fit analysis. If another production origin is used (for example `https://www.tpopconnects.com`), add that exact origin to the CORS policy before deployment.

## Security note
This change does not disable authentication, organization membership checks, or subscription checks. It only allows the browser's preflight request to proceed with the expected headers.
