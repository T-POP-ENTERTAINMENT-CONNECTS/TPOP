# Logic integrity hardening — 2026-10-12

## Changes
- Historical performance observations that fail the engine's validation checks are excluded from creator history, comparable cohorts, and drift calculations.
- Calibration, creator calibration, prediction intervals, and backtests now include only finite 0–100 outcomes paired with finite 0–100 predictions whose actual observation timestamp is at or after the prediction timestamp.
- Legacy rows with an actual outcome but no predicted score no longer enter calibration or backtest statistics. Interval coverage averages only rows with a recorded coverage result.
- Ledger synchronization attaches an actual outcome only to a prediction with a score and only when the completed observation has the same objective and occurs after that prediction. This avoids scoring an awareness prediction against a sales outcome.
- Server-side decision-weight validation now rejects missing, non-finite, or negative dimension weights before scoring, then enforces the existing 100-point total.

## Remaining product limits
- Audience, content, and brand fit are lexical overlap heuristics; they do not establish semantic relevance.
- Outcome normalization caps and dimension weights remain fixed assumptions, not benchmarks learned from representative campaign data.
- Confidence is an evidence-reliability heuristic. It is not a probability of success or a claim of forecast accuracy.
- This package has not been deployed to Supabase or evaluated against production data. Historical records may contain errors that are not detectable from the available fields.
- Deploy the frontend and Edge Function together, then validate using staging data and an out-of-sample campaign review before making customer-facing accuracy claims.
