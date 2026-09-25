# KOL IDS Gen Code Production Integration

The existing `legacy-appscript/KOL_IDS_GENCODE.gs` remains preserved as the canonical legacy implementation reference.
The production GitHub/Supabase workspace now uses the same core semantics through `supabase/functions/intelligence-engine` and `public.gen_codes`:
- one code per selected creator and campaign
- unique code generation
- discount type/value
- commission rate
- validity / expiry
- attribution window
- uses, orders, conversions, revenue, new customers, commission fields
- organization/campaign/creator scoping
- no fabricated conversions or revenue

Run the included migration `supabase/migrations/20260925_gencode_attribution.sql` in Supabase SQL Editor before using Gen Code generation.
