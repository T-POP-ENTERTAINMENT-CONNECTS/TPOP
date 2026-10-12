# Full pipeline audit and channel-scoped engine — 2026-10-12

## V6 changes

- Added a campaign primary outcome model so primary Goal and performance type stay aligned through fit scoring, historical outcome pooling, calibration, drift, prediction intervals, backtests, and ledger pairing.
- Old V5 rows are excluded from V6 calibration and shown as older model evidence. A change to campaign, audience, creator profile or outcome model invalidates previous approvals.
- Only decisions from a completed analysis run with current input revisions can be approved. Performance writes and portfolio optimization verify that same fresh evidence on the server.
- Step 6/7 calculations now keep channel denominators and channel scores separate, require complete coverage for ratios, and suppress mixed-channel aggregate returns and cross-type score rankings; ROI/ROAS also require distinct creator Gen Codes. These codes are not a substitute for transaction-level deduplication.
- Added client/server integer validation for count fields and e-commerce net-sales consistency checks.
- Added explicit campaign budget currency. Creator fee comparability and portfolio optimization remain THB-only; no FX is applied.

## Verification

- Frontend JavaScript and Edge Function syntax checks passed.
- Deterministic smoke checks passed for channel-scoped business-impact formulas, validation boundaries, and Digital / E-commerce / Offline outcome-score bounds.
- Live Supabase, Deno type checking, actual deployment and production-record validation were not available in this workspace. No production deployment was performed.

Deploy `supabase/functions/intelligence-engine` and the workspace files together, then rerun creator analysis and re-approve eligible creators. Review `AUDIT_20261012_FULL_PIPELINE.md` for the step-by-step audit and remaining product limits.
