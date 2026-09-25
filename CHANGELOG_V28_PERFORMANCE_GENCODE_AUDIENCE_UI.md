# KOL IDS V28 — Performance Gen Code + Audience Input + Campaign Personality UI

## Changes
- Step 05 Performance now includes campaign Gen Code & attribution configuration.
- Gen Code configuration follows the existing architecture: prefix, discount type/value, commission rate, validity mode, expiry, max uses, attribution window and notes.
- Codes are generated per approved creator, persisted in the campaign payload, shown in Performance, and written into performance observation metadata.
- Digital and Offline performance forms automatically attach the selected creator's campaign Gen Code.
- Step 01 Brand Personality now uses the same full-width objective card layout as Objectives.
- Step 02 explicitly identifies Audience as a **brand target-audience input**, adds Audience Type, and keeps the deep persona fields used by creator-fit analysis.
- Campaign saves now preserve downstream state (selected creators, business impact, learning and Gen Code data) instead of replacing the whole campaign payload.
