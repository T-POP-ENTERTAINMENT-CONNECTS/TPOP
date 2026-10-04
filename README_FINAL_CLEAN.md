# KOL IDS — Final Completion + Premium Tech UI Release

This release is the final completion pass for the current KOL IDS workflow: evidence-state integrity, report consistency, blank-vs-zero handling, and a premium technology / investment-intelligence visual layer.

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

## Subscription expiry reminders — 2026-10-04
- `TRIAL_7` sends one customer email in the 2–3 day window before expiry (intended as the 3-day reminder).
- Every paid plan sends one customer email in the 29–30 day window before expiry (intended as the 1-month reminder).
- Reminder emails use the live subscription expiry timestamp and the original order amount for paid subscriptions; Trial is always FREE / THB 0.
- Duplicate reminders are prevented by `subscription_expiry_notifications`.
- Deploy `supabase/functions/subscription-expiry-reminders` and set `KOL_IDS_EXPIRY_REMINDER_SECRET`.
- Schedule the Edge Function once per day using Supabase Cron / scheduled functions. Send header `x-kol-ids-expiry-secret: <KOL_IDS_EXPIRY_REMINDER_SECRET>`.
- Do not hard-code the service-role key into SQL or frontend files.


## Existing-account paid upgrade
If a customer previously used or expired a 7-day trial, they can select a paid plan with the same email. The signup flow signs into the existing Auth account and provisions the paid order under the existing organization. No second Auth account or organization is created. A pending order for the same plan is reused.
