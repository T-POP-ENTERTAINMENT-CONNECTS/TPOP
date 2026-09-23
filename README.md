# KOL IDS™ Cloud App — Deploy Ready Core

This package starts the migration of KOL IDS from Google Apps Script/Google Sheets to a customer-facing cloud application. The customer entry point no longer depends on the Google account currently open in the browser.

## What is included

- `index.html`, `app.js`, `styles.css`: working cloud workspace UI
- Supabase Auth: email/password sign-up, sign-in, persistent sessions, sign-out
- Workspace bootstrap: first authenticated user receives an organization/workspace
- Real Supabase CRUD for Brands, Campaigns and KOL records
- KOL Intelligence view based on the structured creator fields
- `supabase/schema.sql`: PostgreSQL schema + RLS
- `config.example.js`: deployment configuration template
- `migration/KOL_IDS_CLOUD_MIGRATION_EXPORT.gs`: safe export helper for the legacy Google Sheets system
- `legacy/kids/`: source Apps Script project retained for migration/parity work

## Important

This is the deployable cloud foundation/core workspace, not a claim that every one of the 259 legacy Apps Script files has already been ported to cloud APIs. The legacy code is preserved so the remaining intelligence/QA logic can be migrated module-by-module without losing the existing system.

## Deploy order

1. Create a Supabase project.
2. Supabase SQL Editor → run `supabase/schema.sql`.
3. Supabase Authentication → enable Email provider.
4. Copy `config.example.js` to `config.js` and fill in the Supabase project URL and anon/publishable key.
5. Deploy the folder as a static site to Vercel, Netlify, Cloudflare Pages, or another static host.
6. Open the deployed URL. Sign up with the customer's KOL IDS email; the first user gets a workspace automatically.
7. Add Brands, Campaigns and KOLs to verify the database/RLS path.
8. Only after this smoke test, migrate production data from Google Sheets.

## Security

The browser uses the Supabase anon/publishable key. This is expected. Security depends on Row Level Security in `schema.sql`; never put a Supabase service-role key in `config.js` or browser code.

## Custom domain

After the cloud app is deployed, connect a subdomain such as `app.tpopconnects.com` at the hosting provider. Keep `tpopconnects.com/kol-ids` on Squarespace as the commercial landing page and point its Login/Launch buttons to the cloud app.

## Sales / payment flow
Pricing buttons use the T POP CONNECTS Apps Script order endpoint as a **sales/order intake page only**. Customer authentication, workspace data, and KOL IDS application state remain in Supabase/Cloudflare. The legacy Apps Script endpoint is not used as the KOL IDS application backend.
