# KOL IDS™ Production Candidate

## What this package does
- KOL IDS-owned email/password identity via Supabase Auth; no Google dependency.
- Atomic first-login workspace bootstrap + 14-day trial.
- PostgreSQL persistence and organization-scoped RLS.
- License gate: TRIAL / 3M / 6M / 12M; seats 1/2/3.
- Brand, Campaign, KOL Database, KOL Intelligence, Decision, Performance, Outcome and Learning surfaces.
- Apps Script is legacy/migration only.

## Required production setup
1. Create a Supabase project and run `supabase/schema.sql` in SQL Editor.
2. Authentication → Providers → Email: enable Email/password.
3. Configure the production site URL and redirect URLs for your Cloudflare domain.
4. Copy `config.example.js` to `config.js`; add ONLY the Supabase URL and anon/publishable key.
5. Never expose service_role, Stripe secret, webhook secret, or database password in this repository.
6. Deploy the app folder to Cloudflare Pages/Workers static hosting.
7. Point `app.tpopconnects.com` (recommended) to Cloudflare. If the public requirement is `tpopconnects.com/#kolids`, keep that hash route in the landing page and send the CTA to the app URL.

## Commercial activation
The browser package intentionally does not contain payment secrets. For sales, the pricing buttons open the configured T POP CONNECTS order/payment intake endpoint. The Apps Script endpoint is sales/order intake only; it is not used for KOL IDS customer authentication or application data. License activation remains server-side in Supabase/admin workflow.

## Go-live checklist
- [ ] Run schema successfully with no SQL errors.
- [ ] Test new account → email confirmation → first login → workspace + trial.
- [ ] Test second account cannot read first organization's rows.
- [ ] Test expired license blocks application data operations.
- [ ] Test seat limit 1/2/3 at database level.
- [ ] Test brand → campaign → KOL → decision → performance → outcome → learning persistence after refresh/re-login.
- [ ] Add payment webhook and activate paid licenses.
- [ ] Add legal/privacy/terms pages and support contact before public sale.
