# KOL IDS™ V20 — Enterprise Intelligence Workspace

This release keeps the production Supabase backend, Auth, RLS, Edge Functions, payment and workspace bootstrap unchanged.

Frontend changes are focused on turning the workspace into a real decision-intelligence product:

- Executive command center / overview
- Campaign intelligence context
- Audience intelligence context
- Required 8-part Creator Intelligence profile
- Decision parameters with six weights that must total 100%
- Recommendation threshold and risk ceiling
- Evidence-aware confidence and completeness gating
- Creator-level decision ledger persisted to `creator_decisions`
- Review gate persisted to `review_runs`
- Budget/KPI/risk control-tower calculations from campaign payload
- Evidence report and JSON export
- Responsive enterprise navigation

Important methodology boundary:
The legacy Apps Script accuracy engine contains historical cohort evidence, recency decay, OOS calibration, drift and prediction intervals. The current Supabase schema does not yet expose those historical ledgers as first-class tables, so V20 does not fabricate those statistics. It exposes the available decision logic honestly and leaves the historical-calibration layer for the next backend migration.

## V21 Intelligence Upgrade
V21 promotes the legacy Accuracy Engine / Predictive / Campaign Control / Portfolio concepts into a Supabase-backed intelligence layer. See `INTELLIGENCE_ENGINE_V21_DEPLOY.md`.
