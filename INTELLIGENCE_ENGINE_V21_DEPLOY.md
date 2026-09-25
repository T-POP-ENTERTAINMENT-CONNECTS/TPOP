# KOL IDS™ Intelligence Engine Deployment

Deploy `supabase/functions/intelligence-engine/index.ts` after the intelligence migration is applied.

The Decision page sends only the selected analysis creator IDs. The Edge Function validates organization membership and enforces the 100-creator limit server-side.

The engine stores:
- creator decisions
- prediction ledger entries
- intelligence runs
- performance observations
- Gen Code attribution events

No Creator Fit score is accepted from the browser.
