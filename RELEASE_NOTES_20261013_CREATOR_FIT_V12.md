# Creator fit and evidence gate V12 — 2026-10-13

- Uses Step 1 campaign objective and Step 2 audience context with the creator bio and structured intelligence. Score fractions measure coverage of target cues, so unused extra creator tags do not reduce campaign or brand fit by themselves.
- Audience topic/motivation is labeled as a profile proxy when verified follower analytics are absent. It cannot satisfy the verified-audience gate for recommendation.
- Removed the false low-risk inference from “no token overlap.” Risk now remains unassessed until a human content review is recorded with a note. The review is bound to the current campaign and its avoid-list text, so it cannot silently carry over to a different brand/campaign. A flagged review yields a high risk rating; a clear review remains explicitly self-reported.
- Historical model confidence is distinct from profile completeness. Missing history is omitted from the evidence-weighted screening score and blocks predictive recommendation.
- Model version: `KOL_IDS_LEARNING_ENGINE_V12_CAMPAIGN_SCOPED_SAFETY`; V8–V11 decisions are recalculated and not mixed with the new scoring contract.
- The implementation is offline and uses existing JSON payload fields. No database migration or external AI/translation provider is required.

## Validation and deployment

- Syntax checks passed: `node --check app.js` and `node --experimental-strip-types --check supabase/functions/intelligence-engine/index.ts`.
- No production deployment or live Supabase calculation was performed. Deploy the frontend and `intelligence-engine` Edge Function together. No schema migration is required.
