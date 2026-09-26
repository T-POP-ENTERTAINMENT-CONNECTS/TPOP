# KOL IDS V31.1.1 — Discover full-stage redeploy runbook

## Scope
This patch addresses Discover's generic HTTP 400 experience and adds stage-specific server diagnostics. The console line alone did not contain the response body, so it was not sufficient to prove whether the original 400 came from input validation, gateway/auth, or a downstream request. This version surfaces response details and logs a request ID/stage for failures.

## Changed files
- `app.js` — parses JSON/text Edge Function error responses and includes HTTP status if no response detail is available.
- `supabase/functions/discover-creator/index.ts` — validates request fields explicitly, returns stable error codes/request IDs, records stage in server logs, checks audit inserts, and expands CORS allowed headers.
- `DISCOVER_DEPLOY.md` and `CHANGELOG_20260926_DISCOVER_HARDENING.md` — deployment notes.

## Redeploy sequence
1. Download and unzip this package; back up the current GitHub branch first.
2. Update the repository with the package files (or at minimum the changed files listed above). Commit and publish the website so the updated `app.js` is live.
3. In Supabase, open Edge Functions → `discover-creator` → Deploy new version. Upload the updated `supabase/functions/discover-creator/index.ts` (or deploy the folder with Supabase CLI). Keep JWT verification enabled. Do not redeploy the other six functions for this Discover-only patch.
4. Do not rerun SQL just for this code patch. If the Discover schema has not previously been installed, apply the Discover migrations in this order: `20260926_discover_intelligence.sql` → `20260926_pricing_input_discover_compliance.sql` → `20260927_discover_multi_platform.sql`. If already applied, do not rerun them just because the Edge Function changed.
5. Confirm existing Edge Function secrets are present: Supabase URL/service role secret key (server-side only), and whichever approved provider secrets are actually configured. Do not paste secrets into GitHub or frontend files.
6. Hard-refresh the live site. Open DevTools → Network, enter one known valid handle, press Enter, and inspect the `discover-creator` request. A successful call should return HTTP 200 with `success: true`; an expected missing-provider/no-result case returns 404 with `CREATOR_NOT_FOUND`; invalid input returns 400 with a specific code.
7. If it still fails, copy the JSON Response including `code`, `stage`, and `requestId`. Search the Supabase Edge Function Logs for that request ID. The server log now identifies the failing stage without exposing provider/database internals to the customer.

## Test status
- `app.js`: Node syntax check passed.
- `discover-creator/index.ts`: TypeScript transpilation/syntax check passed.
- ZIP integrity check passed.
- Live Supabase request was not executed from this environment; production success must be verified after redeploy.
