# KOL IDS — Final Evidence State Release

This release is the final evidence-state completion pass for the current KOL IDS workflow.

## Core rule
KOL IDS distinguishes:
- **0** = explicitly recorded zero
- **Not recorded** = no numeric evidence was recorded
- **Pending** = observation exists but outcome score is not completed
- **Not calculable** = required inputs for a formula are missing
- **Not yet scored** = evidence is insufficient for a defensible outcome score
- **Verified / Estimated / Self-reported** = evidence source state

## Final fixes
- Top 3 Performance ranks only completed actual outcome scores.
- Business Impact does not turn missing outcome scores into a zero.
- Conversion rate requires recorded click and conversion evidence.
- Learning recommendations do not diagnose conversion friction from missing conversion data.
- ROI / ROAS remain non-calculable until their required inputs exist.
- Report and PDF exports preserve evidence-state wording.
- User approval and engine decision signal remain separate by design.

## Deployment
Use the existing Supabase database and migrations. This release adds no required database migration.
Upload the package contents to the same deployment root and keep the existing Supabase configuration.
