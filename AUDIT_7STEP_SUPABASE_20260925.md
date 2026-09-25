# KOL IDS — 7-Step + Supabase Static Audit

Audit date: 2026-09-25
Scope: `app.js`, `KOLIDSworkspace.html`, `KOLIDSworkspace/index.html`, Supabase schema/migrations/functions, paid signup and payment approval flow.

## Executive result

The 7-step browser workflow is structurally connected to one organization/campaign graph, but several integration risks were found. The blocking Campaign error shown in the screenshot was the most immediate one; additional access-control and commercial-flow gaps were also hardened in this patch.

## 7-step audit

| Step | Data source / write path | Result | Finding / action |
|---|---|---|---|
| 01 Campaign | `campaigns.payload` | Fixed | Existing deployments could lack `campaigns.payload`; the compatibility migration now adds it safely and reloads PostgREST schema cache. |
| 02 Audience | `audiences.payload` + `campaign_id` | Green | Audience can create a minimal campaign shell when Step 01 has not been completed, then links the audience relationally to that campaign. |
| 03 KOL Persona | `creators.payload` | Green | Creator batch writes use the organization boundary. Creator intelligence is stored inside payload and consumed by the decision engine. |
| 04 Decision | `creator_decisions` + campaign `decisionShortlistIds` / `selectedCreatorIds` | Green with dependency | Decision records are created by the Supabase Intelligence Edge Function. Approved creators are persisted back to the campaign for Step 05 attribution. |
| 05 Performance | `performance_observations` via `intelligence-engine` | Hardened | The edge function writes validated observations and updates prediction ledger actuals. It now also verifies active subscription before processing. |
| 06 Business Impact | campaign `payload.businessImpact` + learning | Green | Impact and learning are persisted back to the campaign and consumed by Step 07. |
| 07 Reports | in-memory aggregation of campaign/audience/decision/performance/impact/learning | Hardened | JSON export was previously local-only and there was no CSV export. Both are now explicit exports and Trial accounts are gated by a paid-upgrade popup. |

## Supabase schema/query audit

### Fixed / hardened

1. `campaigns.payload` schema-cache mismatch — fixed by `20260925_campaign_payload_compatibility.sql`.
2. The intelligence Edge Function previously checked organization membership but did not independently require an active subscription. Because it uses the service role, RLS alone could not enforce the commercial gate. Active subscription validation is now performed inside the Edge Function.
3. Paid signup previously had no billing-document collection. Paid signup now supports:
   - Quotation
   - Tax Invoice
   - Receipt
   - Individual / บุคคลธรรมดา
   - Juristic / นิติบุคคล
   - Legal name
   - Tax ID
   - Branch
   - Phone
   - Billing address
4. Billing data is persisted atomically inside `customer_orders.payload.billing` through the upgraded `provision_customer_account(..., p_billing jsonb)` function.
5. Payment-review admin email now attempts to retrieve the order details through the protected `payment-approval` Edge Function and displays the billing/document request information together with payment proof.
6. PostgREST schema reload is included after compatibility migrations.

### Important operational dependency

The intelligence tables are created by `supabase/migrations/20260924_intelligence_engine.sql`, not only by `supabase/schema.sql`. The deployment must therefore run the migration sequence, not only copy the base schema.

Required migration order now includes:

1. `20260924_intelligence_engine.sql`
2. `20260925_campaign_payload_compatibility.sql`
3. `20260925_paid_signup_billing.sql`

### Non-blocking observations

- `app.js` intentionally returns an empty array for a few optional intelligence tables when their query fails. This keeps older workspaces from crashing, but it can also hide a missing-migration/RLS problem by rendering an empty state. Production health checks should verify these tables explicitly.
- There is a legacy `campaigns()` renderer in `app.js`, but the active 7-step router uses `campaignIntake()` for Step 01. It is dead/legacy code rather than the active page path.
- `performance_observations`, `prediction_ledger`, `intelligence_runs`, `portfolio_runs`, and `portfolio_items` depend on the intelligence migration. Their policies are compatible with the service-role Edge Function architecture, but commercial access is now additionally enforced in the Edge Function.

## Trial report export lock

Trial users can still view the report inside the workspace. The following are gated:

- Export report JSON
- Export report CSV

When a Trial user clicks either export, the workspace shows a paid-plan popup instead of generating the file. The popup routes the user to the public KOL IDS plan/order flow.

The PDF report remains a separate action and was not locked by this request.

## Paid signup billing flow

Paid signup now works as:

`Choose paid plan → Create account → choose document(s) → Individual/Juristic → billing details → create pending order → submit payment proof → admin sees payment + billing details → approve → paid workspace activates`

Trial signup does not ask for billing information.

## Validation performed

- `app.js`: JavaScript syntax check — PASS.
- Public `KOLIDS.html` inline JavaScript: syntax check — PASS.
- Supabase Edge Function TypeScript transpilation/syntax diagnostics for client signup, payment approval and intelligence engine — PASS.
- Static table/function reference audit completed against the supplied schema and migrations.

## Deployment notes

Deploy the updated frontend files and redeploy the changed Supabase Edge Functions:

- `client-sign-up`
- `payment-approval`
- `intelligence-engine`

Then run the two new SQL migrations in Supabase SQL Editor.
