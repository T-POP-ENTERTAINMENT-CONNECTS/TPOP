# Complete Report PDF — readability and deep analysis update

## Visual and table improvements
- Standardized the shared PDF table renderer to use pale blue headers with dark readable text; removed dark/black header-band styling from the shared renderer.
- Increased header height, body font size, line spacing and cell padding for easier reading.
- Added subtle alternating row backgrounds and clearer cell borders for dense evidence tables.
- Improved wrapping capacity for long values while retaining normalized column widths within the A4 content area.

## Campaign analysis and evidence governance
- Complete report includes derived metrics only when required source values are available: revenue less recorded spend, budget utilization, click-to-conversion rate, cost per conversion, cost per qualified lead, and attendee-to-qualified-lead yield.
- Adds interpretation notes for missing reach, self-reported/pending evidence, attribution consistency, and the difference between ROAS and profit.
- Shows evidence-source counts and clarifies that a source label alone is not independent verification.
- Missing values remain unavailable; the report does not fabricate or overwrite source campaign records.

## Validation
- `node --check app.js` passed.
- ZIP archive integrity checked.
- A fresh PDF must still be generated after deployment to visually verify the output against live campaign data.
