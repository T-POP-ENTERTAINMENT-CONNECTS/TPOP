# KOL IDS V31.1 — Discover hardening patch

- Reject malformed handles instead of silently stripping unsupported characters.
- Reject invalid platform names and requests containing more than six platform entries.
- Enforce a 16 KiB JSON request-body limit and return a clear 400 for malformed JSON.
- Check browser Origin against `KOLIDS_ALLOWED_ORIGIN` when an Origin header is present (authentication remains mandatory; CORS is not an authorization control).
- Return 401 for missing/invalid authentication instead of masking it as a 500.
- Add `Cache-Control: no-store` and `X-Content-Type-Options: nosniff` to JSON responses.
- Replace raw internal exception messages in unexpected 500 responses with a generic message and request ID.

## Deployment
Deploy the updated `supabase/functions/discover-creator/index.ts` as `discover-creator`. No database migration is required for this patch. Keep JWT verification enabled and configure `KOLIDS_ALLOWED_ORIGIN` to the exact production origin. Test authenticated discovery, import, invalid handle, invalid platform, unauthenticated request, and oversized/malformed request.

This is a targeted hardening pass, not a full production security certification. It does not verify live Supabase policies, secrets, provider contracts, billing state, or the deployed frontend/backend version.
