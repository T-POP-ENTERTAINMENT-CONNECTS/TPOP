KOL IDS™ · INVESTMENT DECISION INTELLIGENCE · 2026-10-06

Implemented from the approved product direction:
- Added Evidence Confidence to digital, e-commerce and event performance capture.
- Added optional Content / Post ID for digital evidence.
- Preserved Source separately from Evidence Confidence.
- Stored the new evidence fields inside existing performance metadata; no database migration required.
- Added NEXT INVESTMENT DECISION to Step 06 with recommendation, confidence, strongest observed signal, success threshold and suggested experiment.
- Saved the next-investment decision with campaign learning for reuse and export.
- Added Next Investment Decision fields to Campaign Intelligence CSV.
- Added Evidence Confidence and Content / Post ID to performance reporting context.
- Strengthened mobile responsiveness for Gen Code / Attribution and performance entry cards.
- Converted creator-specific Gen Code commercial terms to a mobile card layout so the table no longer forces horizontal overflow.
- Bumped app.js cache version to 20261006-investment-decision-v1.

No Supabase migration is required for these changes because the additional evidence fields are stored in the existing JSON metadata payload.
