# KOL IDS™ V21 — Enterprise Intelligence Engine

This release migrates the legacy Apps Script intelligence concepts into Supabase as a real evidence/decision layer.

## Adds
- Performance Evidence Ledger
- Strict time-aware creator evidence
- Data-quality validation
- Recency decay (120-day half-life)
- Comparable creator cohort evidence (similarity floor 0.45, max 60)
- Bayesian-style shrinkage toward prior 50 with prior strength 16
- OOS prediction ledger
- Recency-weighted calibration
- Empirical OOS prediction intervals (80% operational interval when >=15 observations)
- Drift detection after 8+ creator observations
- Confidence / model-trust guardrails
- Decision Engine execution through Supabase Edge Function
- Portfolio optimization ledger with budget and risk constraints
- Calibration and OOS backtest actions

## Deploy order
1. Run `SQL_TO_RUN/01_RUN_INTELLIGENCE_ENGINE_MIGRATION.sql` in Supabase SQL Editor.
2. Deploy `supabase/functions/intelligence-engine/index.ts` as Edge Function named `intelligence-engine`.
3. Do not change or redeploy the existing payment/auth Edge Functions for this feature.
4. Replace the frontend `app.js` with the V21 version.

No new secret is required. The function uses Supabase's platform service key internally and verifies the caller's JWT plus organization membership.

## Important methodology behavior
- No historical accuracy is fabricated when the evidence ledger is sparse.
- A prediction uses only observations at or before its `asOf` time and excludes the active campaign from its own evidence.
- Invalid metric relationships are rejected before entering the evidence ledger.
- OOS calibration and empirical intervals only activate after their evidence thresholds are met.
- Drift reduces the confidence signal; it is not silently ignored.
- Portfolio selection is constrained by campaign budget and risk ceiling.
