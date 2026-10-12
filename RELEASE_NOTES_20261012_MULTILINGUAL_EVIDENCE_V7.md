# Release notes — creator multilingual evidence V7 (2026-10-12)

- Creator profiles now record the bio/profile language and creator-fee currency.
- Tokenization uses Unicode-aware word segmentation without hard-coding Thai, supporting scripts such as Thai, Latin, Chinese, Japanese, Korean, Arabic, and Vietnamese for token-level text checks.
- Creator fee vs campaign budget comparison is available only when both values are in the same currency. No implicit foreign-exchange conversion is applied. Campaign currency validation includes the supported display currencies.
- The decision engine calculates a partial screening index from dimensions with usable evidence and renormalizes their configured weights. The result includes `scoreCoveragePercent` and an interpretation. With zero usable dimensions, score remains null.
- Missing core fit, history, risk, or commercial evidence continues to block RECOMMENDED/CONSIDER decisions. A partial score is not decision eligibility.
- This is multilingual tokenization, not cross-language translation or semantic understanding. Thai bio and English brief, for example, still need a shared-language brief or consistently selected standardized signals for meaningful text matching.
- Model version bumped to `KOL_IDS_LEARNING_ENGINE_V7_MULTILINGUAL_PARTIAL_EVIDENCE` to prevent mixing calibration with prior scoring contract.

## Verification and limitations

- `node --check app.js` passed.
- `node --experimental-strip-types --check supabase/functions/intelligence-engine/index.ts` passed (syntax parse only).
- No live Supabase/Deno typecheck, browser integration, FX provider, translation provider, or external creator API was exercised. Scores remain rule-based screening indices and are not validated success probabilities.
