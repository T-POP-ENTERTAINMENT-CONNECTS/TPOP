# KOL IDS V30.1 — Input Friction Reduction

## Goal
Reduce customer data-entry burden without removing the underlying intelligence model, stored evidence, derived metrics, or reporting fields.

## Changes
- Step 02 Audience: introduced a Quick Audience Brief and moved deep audience fields into an optional Advanced section.
- Step 02: when advanced fields are blank, the system derives structured context from the supplied brief and marks the evidence level as `QUICK_BRIEF_DERIVED`.
- Step 03 Creator: added a single Creator bio / content description input as the primary intelligence intake.
- Step 03: intelligence signals can be inferred from the creator description; manual signal chips remain available under Advanced Creator Intelligence.
- Step 03: creator photo is now optional for intake; creator identity and analysis no longer require a photo upload at the UI layer.
- Step 05 Digital Performance: core outcome inputs remain visible; detailed metrics are grouped under optional Advanced Performance Metrics.
- Step 05 Event Performance: core outcome inputs remain visible; detailed funnel metrics are grouped under optional Advanced Event Metrics.
- Existing metric IDs and save payload mappings are preserved so existing calculations, Business Impact and Reports continue to receive the same fields when users provide them.
- `Observed at` remains date-only (`YYYY-MM-DD`).

## Design principle
Minimum customer input → maximum structured intelligence. Advanced evidence remains available whenever the customer has it.
