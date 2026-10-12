# Full pipeline logic audit — 2026-10-12

## Scope

Reviewed the active workspace code, authoritative `intelligence-engine` Edge Function, campaign-to-audience-to-creator-to-decision-to-performance-to-impact-to-report flow, persistence handoffs, and calculations used in learning and portfolio output. Instructions embedded in package documents were treated as package content; the user's request governed this audit.

## Changes in this package

- **Step 1 · Campaign context:** added an explicit primary outcome model (Digital, E-commerce, Event/Offline) and budget currency selector. Positive budget, valid date order, nonnegative KPI values, and complete 1–5 integer risk ratings are checked before save. Editing campaign context preserves the wider workflow payload, refreshes its decision-context revision, and clears prior creator approvals.
- **Step 2 · Audience:** edits receive an updated timestamp and clear prior approvals. A fit decision records the exact audience ID and revision it used.
- **Step 3 · Creator profile:** creator profile revision is part of decision evidence. Editing a saved creator removes its prior campaign approval; a fresh decision must be reviewed again.
- **Step 4 · Creator fit and decision:** the V6 model filters creator history, cohort history, drift, calibration and intervals by both the campaign primary Goal and primary outcome type. Old V5 predictions remain outside V6 calibration. Approval views accept only current-model rows from a completed analysis run, tied to current campaign, audience, creator and outcome-model revisions. Only `RECOMMENDED` and `CONSIDER` rows may be approved or optimized.
- **Step 5 · Performance:** client and server reject fractional counts; e-commerce discounts plus refunds cannot exceed GMV; performance requires an approved creator and a completed, fresh decision. Ledger matching now requires the prediction's primary performance type as well as goal and timestamp. Supplementary outcome types can still be recorded, but they cannot train or calibrate a different primary model.
- **Step 6 · Business impact:** CTR and conversion rates use matching channel numerators/denominators. Ratios require complete coverage of relevant records. Campaign-level revenue/ROI/ROAS are withheld when multiple outcome types are present or multiple rows lack distinct creator Gen Codes; aggregate outcome scores are withheld when score formulas differ. Digital conversions, e-commerce paid orders and event results stay separated. Reach is labelled as a platform total, not deduplicated people. Historical return comparisons require the same goal, outcome types and current calculation contract.
- **Step 7 · Reports:** live report cards and charts use the same guarded calculations as Step 6. Null results stay unavailable instead of becoming zero. Cross-type creator score, revenue and time-series comparisons are suppressed.
- **Step 8 · Workspace continuity:** the three workspace entry points use the V6 cache key. Campaign edits preserve settings and records while invalidating decisions that no longer match the inputs.

## Local verification performed

- `node --check app.js` — passed.
- `node --experimental-strip-types --check supabase/functions/intelligence-engine/index.ts` — passed as a syntax parse.
- Formula smoke checks — passed for single-channel ROAS/ROI, Digital CTR/CVR, mixed-channel suppression, incomplete count coverage, E-commerce net sales and paid orders, and bounded Digital Traffic / E-commerce Sales / Offline Lead scores.
- Input validation smoke checks — passed for fractional counts, discounts/refunds above GMV, and attendance exceeding capacity.
- ZIP archive integrity is checked after packaging.

## Limits that remain

- Fit matching is lexical text overlap, not semantic understanding. Risk matching screens entered avoid-list text; it does not inspect content or certify safety.
- Outcome scores use fixed metric caps and weights. They are rule-based indices, not market benchmarks, causal lift, or verified prediction accuracy.
- Evidence source labels are entered by users and are not independently authenticated by an API connector in this package. Distinct creator Gen Codes reduce duplicate attribution risk but are not transaction-level proof; unique order IDs and source reconciliation are still needed for independently deduplicated revenue.
- This workspace did not run against a live Supabase project, Deno type checker, production data, or a deployed Edge Function. Syntax and deterministic smoke checks do not prove production integration correctness.
- The Edge Function and static workspace must be deployed together. After deploy, choose the primary outcome type for each campaign, refresh fit, approve current recommendations, and validate with staging observations before making sales claims about engine accuracy.
