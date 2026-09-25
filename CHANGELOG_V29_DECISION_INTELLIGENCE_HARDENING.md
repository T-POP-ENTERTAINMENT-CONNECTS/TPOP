# KOL IDS V29 — Decision Intelligence / Learning Loop / Executive Report

This patch builds on V28 without changing the Supabase schema or the 7-step workflow.

## Step 04 — Decision Evidence
- Added structured Best Role, Fit Gap, Recommended Content Format and How to Deploy to each creator decision card.
- The fields are derived from the existing campaign objective, audience fit, content fit, brand fit, performance evidence, commercial efficiency and risk signals.
- Existing decision score, confidence and evidence remain unchanged.

## Step 05 — Performance Learning Loop
- Added Prediction → Actual → Learning calibration panel.
- Matches campaign prediction ledger rows to recorded actual outcomes.
- Shows matched outcomes, MAE, prediction bias and interval coverage only when actual evidence exists.
- Shows creator-level predicted vs actual delta and interval coverage.

## Step 06 — Business Impact
- Added an explicit prediction-learning signal beside observed business effect.
- Does not fabricate accuracy when no matched prediction/actual evidence exists.

## Step 07 — Executive Decision Report
- Added an executive decision summary for decision-makers.
- Expanded creator decision report with Best Role, Fit Gap and Deployment.
- Full PDF includes role, fit gap, recommended content format and deployment guidance.

## Compatibility
- No database migration required.
- Existing V28 campaign payloads remain valid.
- Existing prediction ledger and performance observation tables are reused.
