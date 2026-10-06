KOL IDS™ RELEASE NOTES · 2026-10-06 · REPORT VISUAL INTELLIGENCE

Report upgrade
- Added live visual intelligence charts to Step 07 Reports.
- Added observed Revenue vs Spend trend chart.
- Added creator observed outcome score comparison.
- Added recorded revenue contribution by creator.
- Added evidence mix donut visualization.
- Charts use only recorded campaign evidence; insufficient evidence renders as "Not enough evidence to visualize".
- Added "Download Full PDF" to the Step 07 Reports action panel.
- Existing CSV exports and campaign completion flow remain intact.
- No tracking/attribution data is invented or inferred from missing fields.


## Chart correction v2 — 2026-10-06
- Rebuilt the Reports visual charts for enterprise readability and the original KOL IDS CI palette (maroon, soft cyan, warm neutral).
- Corrected the financial trend chart to use one shared THB axis for Revenue and Spend; both metrics use the same unit and must not be visually normalized to different scales.
- Corrected Evidence Mix so it no longer mixes THB amounts with conversion counts. It now shows observed record composition by channel type (Digital, E-commerce, Event / offline, Other).
- Reworked Revenue Contribution so recorded revenue and share of observed total occupy a dedicated right-hand value column and cannot overlap the bar/share label.
- Reduced oversized chart whitespace, strengthened typography, and improved responsive behavior.
