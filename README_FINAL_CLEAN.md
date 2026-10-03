# KOL IDS™ · FINAL CLEAN DEPLOY PACKAGE

This package is the production runtime/deployment source for the current KOL IDS system. Final logic/code audit completed 2026-10-02; completion pass 2026-10-03.

## Included
- Public website entry point
- KOL IDS account/signup page
- Authenticated workspace
- **Step 01–08**, including **Campaign History**
- Creator intelligence / decision / performance / business impact / reports
- Latest approval page flow: `approval.html`
- Supabase Edge Functions used by the current system
- Supabase schema + migrations required for the current database contract
- GitHub Pages / Cloudflare routing files
- T POP CONNECTS favicon (`favicon.png`) wired into public/login/workspace routes

## Deliberately removed
Historical changelogs, duplicate README files, old versioned release notes, old patch ZIPs, and duplicate manual SQL copies are not runtime dependencies and are intentionally excluded.

`supabase/migrations/` is the canonical database change source. Do not run historical `SQL_TO_RUN` copies in addition to the migrations unless a specific migration is missing from the target database.

## Frontend deploy
Upload the contents of this folder to the website root. Keep the directory names `KOLIDS/` and `KOLIDSworkspace/` so extensionless routes remain available.

## Supabase deploy
Deploy the `index.ts` file in each function directory. Keep `supabase/config.toml` so `signup-approval` and `payment-approval` remain callable without platform JWT verification; their application-level secrets provide the approval authorization.

## Important secrets
Never commit Supabase secret/service keys or Resend API keys. Configure them in Supabase Edge Function Secrets.

The browser only contains the publishable Supabase key.

## Enterprise CSV Export Standard
- CSV exports use schema version 2.0.
- Every exported row includes Export Version, Generated At, Product, and Data Scope metadata for auditability and downstream BI workflows.
- Export filenames include the KOL IDS report type, campaign name, and export date.
- UTF-8 BOM is preserved for reliable Thai/Unicode rendering in Excel and Google Sheets.
- Existing paid-export gating and report calculations are unchanged.

## Final logic audit
See `AUDIT_20261002_FINAL.md` for the checks and corrections applied to performance evidence validation, prediction-ledger recalculation, pricing, billing email plan labels, runtime cache-busting, decision scoring, outcome scoring and report consistency.
