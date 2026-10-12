# KOL IDS — Logic integrity handoff (2026-10-12)

## User request
Improve the reliability and data integrity of the supplied KOL IDS system and return the complete corrected package as a ZIP.

## Changes present in the package
- The final package uses model V4 for all current decision evidence and excludes legacy V3 ledger rows from current learning summaries.
- Frontend decision and PDF tables display missing measurements as unavailable, never as a neutral score. Client-side duplicate scoring and direct performance persistence paths were removed.
- Creator Fit fails closed when the remote Intelligence Engine is unavailable; no browser-generated substitute score is persisted.
- Explicit legacy local-fallback decisions are not treated as authoritative during refresh.
- Keyword inference does not add unsupported default traits. Missing core audience, objective/content, or brand evidence gates recommendations.
- User-entered source labels do not independently prove that performance evidence is verified.
- The public landing demo does not present hard-coded creator scores as live analysis.
- Prior-only neutral baseline values are excluded from valid prediction evidence.
- Invalid completed performance observations are excluded from history, cohort, and drift calculations.
- Calibration, creator calibration, prediction intervals, and backtests use only bounded, finite prediction/outcome pairs with outcomes observed after the prediction timestamp. Rows with null predictions do not count.
- Ledger synchronization requires an actual observation with the same objective as the prediction, recorded after prediction time; prior-only rows remain without actual outcomes.
- Server-side decision weights must be finite and non-negative for each decision dimension and must total 100 before analysis.

## Limits that remain
- “Close all gaps” cannot be established from source inspection alone; external services, production data, user-entered facts, and deployment behavior are outside this package review.
- Audience/content/brand matching remains a lexical overlap heuristic, not a validated semantic fit model.
- Outcome normalization caps and weights are fixed rule assumptions, not empirically learned benchmarks.
- The confidence field is an evidence-reliability heuristic, not a probability or accuracy claim.
- The package contains no official platform, ecommerce, CRM, or event-data ingestion. User-supplied source labels are not independent verification.
- Forecast accuracy and campaign uplift have not been established. Representative historical data and out-of-sample evaluation are required before making accuracy claims.
- This handoff did not deploy to Supabase or execute the system against production/staging data. Existing production ledger rows are filtered from statistics where possible; they are not deleted or silently rewritten.

## Deployment note
Deploy the frontend and `supabase/functions/intelligence-engine/index.ts` together. Validate the deployment on staging with intentionally missing, invalid, mismatched-goal, and prior-only records before production use.
