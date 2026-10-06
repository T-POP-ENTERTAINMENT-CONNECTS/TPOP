# KOL IDS — Reports Charts V3

## Visual direction
- Enterprise luxury / data-insight presentation.
- Exact KOL IDS CI cyan: `#aeefff`.
- Maroon `#3d131b` retained as primary editorial text/accent.
- Larger chart typography for desktop readability.
- Responsive typography retained for tablet/mobile.

## Chart logic corrections
- Outcome Trend now uses one shared THB scale for Revenue and Spend because both are monetary values in the same unit.
- Evidence Mix now compares observed record types (Digital / E-commerce / Event / Offline), avoiding the previous invalid comparison of THB and conversion counts in one donut.
- Revenue Contribution remains creator revenue share with explicit THB values and percentage share.

## Deployment
Replace the previous build with this ZIP and hard refresh after deployment.

## Report chart palette alignment — 2026-10-06
- Updated report charts to a light, clean cyan + success-green palette matching the supplied UI reference.
- Cyan is used for primary trend/score visuals; soft green is used as the secondary series and revenue contribution accent.
- Kept chart data, calculations, report structure, and responsive behavior unchanged.
