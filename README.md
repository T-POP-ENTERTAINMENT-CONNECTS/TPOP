# KOL IDS™ — Creator Decision Intelligence

## Current production specification
- T POP website → `https://tpopconnects.com/`
- KOL IDS entry + workspace → `https://tpopconnects.com/KOLIDS`
- Customer login → Supabase Auth Email + Password
- Google Account → not a KOL IDS credential
- Client ID / Access Key → removed from customer login
- Workspace → organization-based
- 3 Months → THB 35,000 · 1 User
- 6 Months → THB 65,000 · 2 Users
- 12 Months → THB 125,000 · 3 Users
- Trial → 7 Days · 1 User
- Team → Owner/Admin invites members individually
- Seat limit → enforced by cloud/database rules
- 7-Step workflow → Campaign → Audience → KOL Intelligence → Decision → Review & Run → Gen Code & Impact → Reports & Evidence
- Database → Supabase PostgreSQL + RLS
- Customer runtime → no `google.script.run`, no Apps Script `/exec`
- Hosting → GitHub + Cloudflare-ready
- Paid approval → request form → Admin Sales Control → cloud license provisioning
- Product wording → **KOL IDS™ — Creator Decision Intelligence**

## Deployment
1. Put the root web files (`index.html`, `KOLIDS.html`, `app.js`, `styles.css`, `config.js`, `_redirects`) in the Cloudflare Pages/GitHub deployment root.
2. Configure `config.js` with the Supabase URL and anon key.
3. Run `supabase/schema.sql` in Supabase.
4. Deploy the Supabase Edge Functions.
5. Configure the paid request form to collect Account Email + Users.
6. Admin approval provisions the cloud subscription/license.

## URL routing
`KOLIDS.html is the public KOL IDS product, pricing, trial and sign-in page. After successful sign-in, the user is routed to the private 7-Step workspace at `/KOLIDSworkspace`.

## Legacy code
`legacy-appscript/` is retained as migration source material only. It is not loaded by the customer runtime. Do not delete it until the remaining business/intelligence modules have been ported and verified in the cloud runtime.

## UI release note — V20

The workspace shell and in-app experience were rebuilt as a premium enterprise creator-decision workspace. The V20 UI adds a command-center Overview, grouped navigation, richer information hierarchy, executive metrics, workflow readiness, and refined responsive surfaces. This is a frontend-only presentation layer change; Supabase schema, Auth, RLS, Edge Functions, payment logic, and the existing data model are intentionally unchanged.


## V30.1 Commercial / Input Friction Update
- 3 Months → THB 35,000 · 1 User
- 6 Months → THB 65,000 · 2 Users
- 12 Months → THB 125,000 · 3 Users
- Campaign intake reduced to essential decision inputs; dates and key messages are optional.
- Audience intake uses a short brief as the main required evidence; persona name defaults automatically.
- Discover uses source-policy gates so derived metrics are only enabled where the API/provider contract permits them.
