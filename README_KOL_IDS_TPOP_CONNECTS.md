# KOL IDS — T POP Connects GitHub build

## Routing
- T POP homepage `index.html` now sends every KOL IDS CTA to `./KOLIDS.html` on the same origin.
- `KOLIDS` is the same-origin public KOL IDS entry point; successful Sign in opens `/KOLIDSworkspace`.
- No external KOL IDS domain is used.

## Workspace
- Email + Password / Supabase Auth.
- Organization workspace bootstrapped through `bootstrap_workspace`.
- Campaign, Audience, Creator, Decision, Review & Run, Impact and Reports screens.
- Data is saved to the Supabase tables defined in `supabase/schema.sql`.
- Creator analysis stores decision records in `creator_decisions`.
- Owner/Admin seat invitation calls the existing `invite_member` RPC.

## Important
The legacy Apps Script folder is retained as reference/backend logic. The GitHub cloud UI is not a direct execution environment for Apps Script `.gs` files. The cloud runtime uses Supabase tables/RPCs instead.


## System Admin Notification / Approval Policy
- `tpopentconex@gmail.com` and `tpopconnectsbiz@gmail.com` are the configured backend notification/approval accounts for payment review.
- Both receive the same payment-review notification.
- Either admin can approve or reject independently.
- Approval is single-action: both admins do not need to approve the same order.
- If one admin approves first, a later approval click is safely treated as already processed.
