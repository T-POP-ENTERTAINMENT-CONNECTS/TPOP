KOL IDS — REPORT / STEP 06 CONSISTENCY FIX (2026-10-15)

Scope: calculation logic in app.js only. No layout, styles, auth, billing or database changes.

1. Revenue contribution chart (Step 07) no longer triple-counts.
   Previously revenue_thb was summed across DIGITAL + ECOMMERCE + OFFLINE records per creator (total 425,981 vs headline 186,441).
   Now one revenue basis per creator is used, same hierarchy as aggregateCampaignMetrics: e-commerce net sales > GMV > digital > offline.
   The Outcome trend (Revenue vs Spend) uses the same basis, and identical repeated creator spend is counted once per creator/date.
2. Step 06 "Impact score" now derives the outcome score from performance records (calculatedPerformanceOutcomeScore), matching Step 07.
   Previously it read raw rows and showed "Not scored" while Step 07 showed a score. Next-investment-decision "best signal" uses the same derived scores.
3. Friction text now lists creators whose own ROAS is below the success threshold (overall ROAS x 0.86) instead of reporting "no threshold breach".
4. Recommendation: when evidence confidence is Low (no verified records) and ROAS >= 3, the card shows "VALIDATE BEFORE SCALING" instead of "SCALE WITH CONTROL",
   so it no longer contradicts "Continue collecting verified outcomes before making a scaling decision".

5. New "Revenue · ROI transparency" card in Step 06 and Step 07 (headline numbers are NOT changed). Layout: Item | Not included (current) | If included | Difference | What it means, for Commission, Offline revenue and Both.
   - Table of Headline / + Offline revenue / + Commission as a cost / both, with Revenue, Cost, ROAS, ROI and delta ROAS.
   - Commission uses recorded commissionAmount, else record commissionRate x net sales, else Gen Code rate x net sales (labelled as estimated).
   - Short notes explain what is and is not counted; Orders vs Paid orders check shows records-with-data counts, the difference and which creator needs fixing.
   - Not added to PDF/CSV exports.

Validation: node --check app.js passed; buildReportVisuals tested on the 12 sample records (chart total 186,441; trend 186,441 / 50,000).
Runtime behaviour still needs confirmation on the deployed site.
