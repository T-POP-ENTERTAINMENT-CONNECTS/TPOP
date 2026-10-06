# KOL IDS · Investment Decision Intelligence · Learning Memory

## Purpose
Strengthen KOL IDS from a campaign report into a reusable decision system.

## Added
- Brand Learning Memory on Step 06 Business Impact & Learning.
- Completed campaign count, historical average ROAS and ROI.
- Reusable prior campaign learning signals surfaced without treating them as forecasts.
- Historical ROAS benchmark is now considered when generating the next investment decision.
- Decision can surface `REVIEW AGAINST HISTORY` when current ROAS materially underperforms the workspace historical benchmark.
- Historical benchmark and campaign count are included in the Next Investment Decision export.
- Mobile-safe styling for the new learning-memory block.

## Product principle
Campaign evidence is preserved as institutional memory:
Campaign → Evidence → Outcome → Learning → Next Decision → Actual Result.

No new Supabase migration is required. The feature uses existing campaign payload data and completed campaign records.
