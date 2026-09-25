# KOL IDS™ Production File Map

### Web
- `index.html` — T POP CONNECTS public site
- `KOLIDS.html` — KOL IDS entry, pricing, trial and sign-in
- `KOLIDSworkspace/index.html` — authenticated workspace shell
- `app.js` — single workspace application runtime
- `_redirects` — canonical KOL IDS routes

### Supabase
- `supabase/schema.sql` — consolidated fresh-install schema
- `supabase/migrations/` — incremental production migrations
- `supabase/functions/` — production Edge Functions

There is intentionally no duplicate workspace HTML or legacy frontend bundle. Apps Script is isolated to the optional payment-approval integration only.
