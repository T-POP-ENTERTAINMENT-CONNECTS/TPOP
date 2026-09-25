# KOL IDS™ Gen Code + Attribution

Production implementation is fully in the Supabase runtime:

- `supabase/functions/intelligence-engine/index.ts`
- `public.gen_codes`
- `public.gen_code_attributions`
- `supabase/migrations/20260925_gencode_attribution.sql`

Supported fields and behavior:
- one unique code per Creator per Campaign
- Organization + Campaign + Creator scoping
- percent / fixed / no discount
- commission rate
- validity and expiry
- attribution window
- Uses / Orders / Conversions / Revenue / New Customers / Commission
- duplicate order protection
- attribution-window and expiry validation
- Gen Code PDF
- Full Campaign Intelligence PDF
