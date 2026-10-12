# Engine Coherence Pass · 2026-10-12

## Changed

- Standardized the Step 1 primary Goal as the key used by decision analysis, performance entry, outcome scoring, calibration, backtesting, and portfolio metadata. Step 1 secondary objectives remain context for text-fit scoring.
- Added a supported primary-goal contract. The UI no longer offers `Other` or `Community Growth` as a primary KPI Goal where the current outcome schema has no validated outcome formula. Existing campaigns with unsupported primary goals fail closed and must select a supported goal.
- Added channel-aware traffic outcome scoring for digital, e-commerce, and offline observations. Campaign goals outside the implemented metric formulas do not silently fall back to an awareness outcome.
- Changed fit overlap from creator-token coverage alone to a bounded precision/recall F1 text index. Component weights are re-normalized over signal categories that contain usable data, avoiding missing subcategories being silently counted as zero.
- Normalized creator-intelligence fields so malformed scalar/string values cannot be treated as arrays of characters.
- Changed avoid-list matching to exact token matches and put matched terms into the evidence explanation. The output remains a text screen and does not certify content or reputation safety.
- Made commercial evidence explicit. THB creator fee versus THB campaign budget is reported as a budget-burden index, not market pricing or ROI. Non-THB campaigns and missing fee/budget evidence cannot receive a recommendation or portfolio placement without FX/fee-currency support.
- Made portfolio optimization fail closed: only current `RECOMMENDED`/`CONSIDER` decisions with complete fit, performance, risk, and commercial evidence qualify; candidates rank by the decision score, then fee and risk. Database errors are no longer silently treated as an empty decision set; portfolio-item write failure marks the run failed.
- Updated the app model marker and workspace cache key to V5. Old V4 decision rows are hidden from current-model decision views until a new analysis is run.

## Evidence and limits

- Audience, content, and brand fit remain lexical text-overlap indices. They are not semantic understanding, compatibility probabilities, or validated causal forecasts. A human must review meaning and content.
- Performance labels such as `VERIFIED` and `API` remain user-supplied labels at this endpoint; they are not independent proof. The engine does not claim predictive accuracy without sufficient out-of-sample evidence.
- FX conversion, creator-fee currency capture, and objective-specific outcomes for unsupported goals are not implemented. The engine blocks commercial recommendations/portfolio use when currency cannot be compared.
- Existing observations retain their stored goal. The V5 model uses the canonical primary Goal going forward; historical rows tagged to a different goal are not reinterpreted automatically.

## Validation and deployment

- `node --check app.js` — passed.
- `node --experimental-strip-types --check supabase/functions/intelligence-engine/index.ts` — passed (syntax parse only; Deno/Supabase type-check and live database execution were unavailable).
- No live Supabase deployment was performed.
- Deploy the `intelligence-engine` Edge Function and publish the updated workspace files together. After deployment, rerun analysis for campaigns so the decision UI/report uses V5 evidence.
## Additional integrity fixes

- Creator-to-cohort similarity now reads the actual PascalCase Creator Intelligence fields written by the workspace and ignores missing similarity dimensions instead of treating absent values as mismatches. This restores comparable-cohort evidence where stored tags use the active schema.
- Performance-to-prediction-ledger synchronization now selects the prediction `goal` and `predicted_score` fields it uses to link observed outcomes. Previously the query omitted them, so the linker could not match an outcome to its prediction correctly.
- Campaign selection in the workspace and the Edge Function now choose the same newest audience record for a campaign.
