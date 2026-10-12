# Creator fit evidence correction V9 — 2026-10-13

- Replaced free-text token-overlap scoring for core fit dimensions with typed evidence comparisons. Missing comparable evidence is reported as unavailable instead of as a zero score.
- Campaign fit uses an auditable primary-goal to creator-content-function rule table. Brand fit compares structured brand personality cues with creator personality signals.
- Audience fit now compares creator-audience insights (age range, location and recognized beauty-category interests) with matching target-audience fields. New optional creator profile fields capture these values and are saved with the creator record. Enter only figures observed in platform analytics.
- The overall screening index renormalizes over evidenced dimensions and is no longer pulled toward 50 because performance history confidence is low. Missing core fit dimensions still block recommendation.
- The UI labels the 0–100 confidence value as history confidence and shows evidence coverage. A score is a rule-based screening index, not a calibrated probability of success.
- Model version changed to `KOL_IDS_LEARNING_ENGINE_V9_TYPED_EVIDENCE_FIT`; prior V8 decisions are automatically recalculated when the Creator Fit view opens.
- No external LLM, translator, or network service was added. Cross-language matches remain limited to the bundled glossary; market names require a comparable written value and are not automatically translated.

## Validation and deployment

- JavaScript syntax check passed (`node --check app.js`). Edge Function compilation could not be run because Deno/TypeScript tooling is not installed in this workspace. No live Supabase deployment was performed.
- Deploy the updated `app.js` frontend and the `intelligence-engine` Edge Function together. The function does not require a schema migration; creator audience profile values are stored in the existing JSON payload.
