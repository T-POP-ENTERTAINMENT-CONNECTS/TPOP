# KOL IDS™ — GitHub + Supabase Cloud

This package is the GitHub/static-host version of the KOL IDS workspace. The application entry flow uses Supabase Auth + Supabase Database directly; `legacy/kids/` is retained only as migration/reference source.

## Working cloud flow

`Sign up / Sign in → Workspace → Brand → Campaign → KOL Database → KOL Intelligence → Decision → Performance → Outcome → Learning → Executive Report`

Implemented in the cloud workspace:
- Supabase email/password authentication and persistent sessions
- First-login workspace bootstrap + 14-day trial
- Organization-scoped RLS
- Brands and campaigns CRUD
- KOL creation with Platform URL and required evidence fields
- 100-KOL application limit
- KOL Intelligence analysis that writes `brand_fit`, `brand_impact` and `kol_decisions` to Supabase
- Decision, Performance and Outcome recording
- Executive Report with Print/Save PDF and JSON export
- Responsive workspace UI
- No `google.script.run` dependency in the cloud app

## Deploy

1. Create a Supabase project.
2. Run `supabase/schema.sql` in Supabase SQL Editor.
3. Enable Email/Password in Supabase Authentication.
4. Put your public Supabase URL and anon/publishable key in `config.js`.
5. Deploy the folder to GitHub Pages, Cloudflare Pages, Netlify, Vercel, or another static host.
6. Open `index.html`, create an account, confirm email if required, and sign in.

### Important

`config.js` must contain only the public Supabase URL and anon/publishable key. Never commit a service-role key, database password, Stripe secret, or webhook secret.

Paid-license activation is intentionally not faked in the browser. The database license row controls access. Payment/renewal automation can be connected separately through a secure server/webhook.

`legacy/kids/` is not loaded by `workspace.html` or `app.js`; it is kept so the original Apps Script implementation remains available for parity/reference while migrating deeper intelligence modules.
