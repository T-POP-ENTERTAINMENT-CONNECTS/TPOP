# Evidence-first decision hardening — 2026-10-12

## Changes
- Removed client-side local-fit fallback from `calculateCreatorFitSafe()`. If the authoritative Supabase Intelligence Engine fails, the UI returns an explicit unavailable result and does not insert local provisional decisions into `creator_decisions`.
- Removed default creator-trait labels from profile keyword inference. Traits are only inferred when a supplied bio contains a matching cue; empty evidence remains empty. The source is labeled as keyword inference, not verified creator truth.
- Performance source labels `VERIFIED` and `API` submitted through the user-facing performance endpoint no longer receive an automatic quality uplift. Such labels trigger `source_label_requires_independent_validation`; the endpoint marks the source as not independently verified.
- Added a fit-evidence gate: if any core audience, content/objective, or brand evidence is missing, the decision becomes `INSUFFICIENT FIT EVIDENCE` rather than being recommended from neutral placeholders.
- Replaced public landing-page demo creator rows with a workflow illustration without fabricated numeric scores. The demo states that it is not a live analysis or proof of accuracy.

## Known limitations (not represented as solved)
- Fit matching remains a deterministic lexical overlap heuristic, not a validated semantic relevance model.
- Outcome-score normalization uses fixed rule caps and weights; these are not yet empirically calibrated against a representative campaign dataset.
- Predictive accuracy, calibration, and commercial lift have not been established by the included code alone. They require actual, source-validated campaign outcomes and out-of-sample evaluation.
- Existing previously saved local-fallback decisions are not deleted or silently rewritten by this frontend change. They should be reviewed/re-analyzed; do not treat their presence as proof of authoritative analysis.
- No real platform API connection is added by this change. Verified ingestion requires a separate trusted integration path or source-file reconciliation.

## Validation
- JavaScript syntax check and ZIP integrity check must pass before release.
- Supabase Edge Function must be deployed for analysis to run; if it is unavailable, analysis now fails closed without creating substitute scores.
