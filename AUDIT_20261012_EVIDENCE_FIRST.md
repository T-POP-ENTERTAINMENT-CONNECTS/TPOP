# KOL IDS — Evidence-first audit

## Changes implemented in this package
1. **Fail-closed analysis:** remote Intelligence Engine failure now returns an unavailable error. No browser-generated substitute Fit score is rendered or written to `creator_decisions`.
2. **Legacy fallback re-analysis:** automatic fit refresh no longer treats old records explicitly marked `Local provisional fallback only` as authoritative; it attempts the remote engine again.
3. **No default inferred traits:** keyword inference emits only traits with explicit matching cues in the supplied bio. No unsupported fallback traits are inserted when the profile has no matching evidence.
4. **Evidence gate:** decisions are marked `INSUFFICIENT FIT EVIDENCE` if any core audience, content/objective, or brand evidence is missing.
5. **Source-label governance:** records submitted through the user-facing performance endpoint do not receive a quality bonus merely because their source label says `VERIFIED` or `API`. Those labels trigger an independent-validation warning.
6. **Public demo:** removed hard-coded illustrative creator scores from the landing-page demo and replaced them with a workflow illustration that explicitly says it is not live analysis or proof of accuracy.

## Important limitations still present
- Audience/content/brand matching remains a lexical overlap heuristic. It is deterministic and inspectable, but not yet validated as a semantic model of creator-audience fit.
- Performance outcome scores use fixed normalization caps and weights. These are rule-based scoring assumptions, not empirically learned industry benchmarks.
- Predictive accuracy, calibration, and uplift in campaign results cannot be asserted without representative real campaign data and out-of-sample evaluation.
- Existing historical fallback decisions are not deleted. Automatic refresh can identify the explicit legacy fallback method and attempt authoritative re-analysis, but existing records must be reviewed and not treated as verified outcomes.
- No official platform API, analytics-provider, ecommerce, or event-system ingestion is created by this patch. Independent verification requires a trusted integration/reconciliation process.

## Validation performed
- `node --check` passed for `app.js`.
- Inline JavaScript blocks in `KOLIDS/index.html` passed `node --check`.
- TypeScript parser reported zero syntax diagnostics for `supabase/functions/intelligence-engine/index.ts`.
- ZIP integrity check performed on the output archive.

## Deployment caution
Deploy the frontend and Supabase Edge Function together. If the Edge Function is unavailable, Creator Fit intentionally fails closed; it will not display or persist a made-up local score. Verify Supabase function logs and run a test campaign before relying on production decisions.
