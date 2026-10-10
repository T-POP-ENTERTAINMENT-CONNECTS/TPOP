# Release notes — Chart overlap, detailed PDF and Thai/English UI

## Chart cleanup
- Separated the trend chart legend from the revenue/spend axis captions.
- Increased top plot clearance and moved legend to a dedicated centered row.
- Adjusted edge point labels to stay inside the plot and separated labels when points share the same date.
- Retained the product's ink + soft-cyan chart treatment.

## Complete Report PDF
- Preserved the existing multi-section report and four chart pages (outcome trend, creator performance, revenue contribution, evidence mix).
- Added an outcome interpretation page distinguishing recorded metrics from unavailable evidence.
- Added evidence-volume, creator-decision, confidence and commercial interpretation notes; no synthetic observations are created.
- PDF remains gated according to the existing trial/export policy.

## Thai / English
- Added a persistent ไทย / EN switch to the public T POP landing page, KOL IDS entry/intro page and workspace shell.
- Added translations for key landing copy, sign-in/product introduction, navigation and common reporting labels.
- Language preference is remembered on the same browser/device.
- English remains the default; the switch changes the page language and translated text without changing campaign data or calculation logic.

## Validation
- `app.js` syntax checked with Node.
- Inline scripts checked in `index.html`, `KOLIDS.html`, and `KOLIDS/index.html`.
- ZIP integrity checked.
