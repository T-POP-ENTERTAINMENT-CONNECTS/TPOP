# KOL IDS™ — Full Loop Repair Deployment

## 1. Frontend
Replace the deployed workspace package with this ZIP contents. In particular:
- `app.js`
- `config.js`
- `KOLIDSworkspace/index.html`
- `KOLIDSworkspace.html`

The current Supabase project remains:
`https://xdmtuoyeiyhkwiwozaut.supabase.co`

## 2. Supabase SQL
In Supabase → SQL Editor, run:

`SQL_TO_RUN/04_PRODUCTION_CONTRACT_REPAIR.sql`

Then run:

`SQL_TO_RUN/05_PRODUCTION_HEALTHCHECK.sql`

Do not skip the repair SQL even if the older migrations were previously run; it is designed for an already-live project and is idempotent.

## 3. Edge Functions
Redeploy:
- `discover-creator`
- `intelligence-engine`

The supplied `client-sign-up` and `payment-approval` functions are unchanged by this repair.

## 4. What to test in the browser

### Step 01 — Campaign
Enter:
- Campaign name
- Objective
- Budget
- Currency
- Brand name
- Brand/product context

Click **Save as draft**, then refresh the browser. The campaign must remain.

Click **Continue → Audience** and verify the same campaign remains selected.

### Step 02 — Audience
Enter Audience Type + Audience Brief.
Test both:
- Save draft
- Save & continue

Refresh. The audience must remain linked to the same campaign.

### Step 03 — Discover
Enter an existing catalog @handle.
Expected:
1. Search request returns the creator card.
2. Creator metrics/source/freshness render.
3. **Add Creator to workspace** creates a row in `public.creators`.
4. Refresh still shows the creator in Creator Registry.
5. Add creator to shortlist and save shortlist.

If an external provider is unavailable but the creator already exists in `creator_catalog`, the stored catalog result should still render.

### Step 04 — Decision
Click **Calculate creator fit**.
Expected:
- `creator_decisions` rows created.
- `prediction_ledger` rows created.
- `intelligence_runs` row created.
- Results render in the Decision page.

### Step 05 — Performance
Record a valid observation.
Expected:
- `performance_observations` row created.
- Any open prediction rows are updated with actual outcome/coverage.

### Step 06 — Business Impact
Save impact data and verify it remains after refresh.

### Step 07 — Reports
Verify report reads the same campaign/audience/creator/decision/performance/impact records.

## 5. If the browser still shows HTTP 400
Do not guess from the generic browser message. The repaired frontend now surfaces:
- Supabase message
- details/hint
- Postgres/PostgREST code
- HTTP status

Send that exact error text if one remains. The error should now identify the failing contract rather than only saying `Failed to load resource: 400`.
