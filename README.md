# KOL IDS™ — Production 7-Step Decision Intelligence

## Runtime
- Public site: `https://tpopconnects.com/`
- KOL IDS entry: `https://tpopconnects.com/KOLIDS`
- Authenticated workspace: `https://tpopconnects.com/KOLIDSworkspace/`
- Auth: Supabase Auth Email + Password
- Frontend: `index.html`, `KOLIDS.html`, `KOLIDSworkspace/index.html`, `app.js`
- Backend: Supabase PostgreSQL + RLS + Edge Functions
- No Apps Script dependency in the KOL IDS workspace runtime; payment approval integration is isolated under integrations/google-apps-script/

## 7-Step workflow
1. Campaign
2. Audience
3. KOL Persona / Creator Intelligence
4. Decision
5. Performance — Digital / Online + Event / Offline
6. Business Impact
7. Reports

Decision rules:
- Maximum 100 creators per analysis run.
- Creator Fit is calculated by the intelligence engine; users do not enter Fit scores.
- Creator selection happens after analysis.
- Gen Code generation is allowed only for selected creators.
- Gen Code is scoped to Organization + Campaign + Creator.
- One unique code per Creator per Campaign.
- Attribution records update Uses, Orders, Conversions, Revenue and Commission.
- Full Campaign Intelligence PDF includes decision and impact evidence.

## Deploy
See `supabase/BACKEND_RUN_ORDER.md` for the exact database and Edge Function order.

For a new Supabase project, `supabase/schema.sql` is the consolidated schema.
For an existing production project, run the dated migrations in `supabase/migrations/` in filename order.

Never place service-role or webhook secrets in browser code.
