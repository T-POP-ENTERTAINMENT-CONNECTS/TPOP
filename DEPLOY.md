# KOL IDS™ Production Deployment — GitHub → Supabase → Cloudflare

## 1. Supabase
1. Create a production Supabase project.
2. Open SQL Editor and run the complete `supabase/schema.sql`.
3. In Authentication → Providers, enable Email.
4. Configure production Site URL and Redirect URLs.
5. Configure SMTP/custom email delivery for production auth emails.
6. Copy the Project URL and browser-safe anon/publishable key.

## 2. GitHub
Push this package to a private repository. Never commit service-role keys, database passwords or access tokens.

## 3. Cloudflare Pages
Create a Pages project named `kol-ids-cloud` and connect the GitHub repository. The repository root is the Pages output directory; no framework build step is required. Pages Functions are discovered from the root `functions/` directory. Cloudflare documents this routing model for Pages Functions.

Verify after the first deployment:
- `/health` returns JSON with `ok: true`.
- `/config.js` returns runtime configuration JavaScript and does not cache it.

## 4. Cloudflare environment variables
Production variables:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

`functions/config.js` exposes only these browser-safe values at runtime.

## 5. GitHub Actions deployment
Set GitHub variable `CLOUDFLARE_PAGES_PROJECT=kol-ids-cloud` and secrets `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`. The workflow is `.github/workflows/deploy.yml`. It installs a pinned Wrangler version and deploys the Pages root.

For a Pages project using Git integration, you can instead let Cloudflare build/deploy from `main`; keep the workflow only if you want GitHub Actions to own deployment.

## 6. Custom domain + customer entry point
Connect this Cloudflare Pages project to `tpopconnects.com`.

Customer entry point:
- `https://tpopconnects.com/` → T POP corporate website
- `https://tpopconnects.com/#kolids` → KOL IDS™ Cloud application

The `#kolids` fragment is handled by the browser, so Cloudflare does not need a special route for it. The unified production `index.html` hides the corporate shell and mounts the KOL IDS application when the fragment is present.

All KOL IDS CTAs in the corporate page point to `https://tpopconnects.com/#kolids`; there is no Google Apps Script `/exec` dependency in the customer-facing entry path.

## 7. Production acceptance
Test two separate accounts.

Auth: sign up, email confirmation, sign in, refresh, reopen browser, sign out/in, password reset.

Tenant isolation: Account A creates data; Account B must see an empty workspace and must not be able to query Account A.

Core workflow: create/edit brand, create/edit campaign, create/edit KOL, fill all 8 Creator Intelligence categories, add custom chips, upload KOL image, refresh and verify persistence, open KOL Intelligence.

Failure/recovery: save button scoped busy state, double-submit, failed network request, reload, invalid image, duplicate KOL code, cross-tenant relationship attempt.

Security gate: run the SQL policy tests against the actual Supabase project before launch. The application package cannot execute those tests without your live project credentials.

## 8. Commercial cutover gate
`schema → RLS isolation → auth → CRUD → image persistence → intelligence contract → migration/parity → domain/SSL → backups → billing/license enforcement → customer acceptance`

Only then point the public sales CTA to the cloud app.

## 9. Billing/licensing
The schema includes `licenses` and organization `plan_code`. This build does not fake payment success or grant paid entitlements. Connect the real payment provider and enforce entitlements server-side before treating a paid plan as active.
