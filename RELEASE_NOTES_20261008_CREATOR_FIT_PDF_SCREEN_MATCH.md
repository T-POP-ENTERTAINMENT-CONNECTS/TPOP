# KOL IDS — Creator Fit PDF Screen Match Fix — 2026-10-08

- Fixed the Creator Fit & Decision Readiness **Save PDF** action.
- The button previously routed to the full Campaign Intelligence PDF, which caused the exported document to contain the wrong report content.
- It now routes to the dedicated `downloadCreatorFitPDF()` export.
- The dedicated export is A4 landscape and places **2 creator decision panels per page**.
- Each creator panel contains the calculated Fit, Evidence, Confidence, six decision dimensions, decision status, Why, If selected, Campaign move, and deployment guidance from the current Creator Fit calculation.
- No creator or performance values are fabricated; missing evidence remains unavailable/blank.
