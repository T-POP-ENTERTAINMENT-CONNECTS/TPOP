# KOL IDS™ — Production Cloud Build

Production architecture:

`GitHub (source) → Cloudflare Pages + Pages Functions → Supabase Auth / Postgres / Storage`

The runtime no longer depends on Google Apps Script or the Google account currently active in the browser.

## Hardened
- Supabase email/password authentication with persistent sessions.
- Organization/workspace isolation using Postgres Row Level Security.
- Workspace creation through a SECURITY DEFINER RPC.
- Cross-tenant relationship guards.
- Supabase Storage for persistent KOL profile images.
- Creator Intelligence: all 8 categories required.
- Example chips remain visible and custom signals can be added.
- Primary + secondary channel model.
- Persistent data after refresh/re-login.
- Scoped button busy state.
- No fake intelligence scores when evidence is absent.
- Cloudflare runtime config; no credentials committed to Git.
- Security headers/CSP.
- GitHub Actions deployment path.
- `/health` production smoke endpoint.

## Important
The browser anon/publishable key is designed to be public. The service-role key must never be placed in this repository or browser code.

This package is the production application foundation. The live infrastructure is still required; this repository contains no customer secrets and cannot deploy into your Cloudflare/Supabase accounts without your credentials. A commercial launch still requires the live Supabase project, domain, production email delivery, legal pages, billing/plan enforcement, backups and final acceptance tests.

## Files
- `index.html` — app shell
- `app.js` — application runtime
- `styles.css` — production UI
- `functions/config.js` — Cloudflare runtime configuration
- `supabase/schema.sql` — schema + RLS + Storage policies
- `migration/KOL_IDS_CLOUD_MIGRATION_EXPORT.gs` — legacy migration helper
- `.github/workflows/deploy.yml` — GitHub → Cloudflare deployment
- `wrangler.toml` — Cloudflare Pages configuration
- `_headers` — security headers
- `DEPLOY.md` — deployment sequence

After cutover, Supabase is the production source of truth. Keep the legacy Apps Script/Sheets system only until parity and migration checks pass.


## Customer URL
The production customer entry point is `https://tpopconnects.com/#kolids`. The corporate T POP landing page and KOL IDS cloud app are packaged together; selecting the KOL IDS fragment mounts the production app without Google Apps Script.


## Customer access login
The production login screen accepts **Registered Email + Client ID + Access Key**. The current Supabase implementation uses the Access Key as the Supabase account password and validates the Client ID against `public.licenses.license_code` (and `owner_email` when populated). Provision each customer in Supabase Auth and assign a matching license record before testing customer login.
