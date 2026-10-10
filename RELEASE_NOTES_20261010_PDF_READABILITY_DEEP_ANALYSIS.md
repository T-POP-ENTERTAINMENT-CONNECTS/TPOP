# Complete Report PDF readability and analysis upgrade — 2026-10-10

## Changes
- Removed dark/black-looking table header treatment in the shared PDF table renderer; uses a pale blue header with dark readable labels.
- Normalized table column widths to the available A4 content width so wide tables do not run off the page.
- Increased table row spacing and cell line-height; wrapped content is allowed more lines before truncation.
- Added a Deep Campaign Performance Analysis section to the Complete Report PDF with derived metrics where source data permits: revenue less recorded spend, budget utilization, click-to-conversion rate, cost per conversion, cost per qualified lead, and attendee-to-qualified-lead yield.
- Added interpretation guardrails for missing reach, self-reported/pending evidence, attribution consistency, and the difference between ROAS and profit.
- No campaign source records or recorded metric values are fabricated or overwritten. Missing values remain explicitly unavailable.

## Validation
- `node --check app.js` passed.
- Generate a fresh Complete Report PDF after deploying this bundle to verify the visual result against live campaign data.
