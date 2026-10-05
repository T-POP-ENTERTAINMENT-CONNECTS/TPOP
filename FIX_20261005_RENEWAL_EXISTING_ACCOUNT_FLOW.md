# KOL IDS Renewal Existing-Account Flow Fix - 2026-10-05

## What changed
- When a customer reaches the expired-subscription screen while authenticated, choosing 3/6/12 months now opens the paid order form as an **EXISTING ACCOUNT** flow.
- The renewal form reuses the current Supabase session and account email instead of sending the customer through the new-account / duplicate-email path.
- The renewal page refreshes the Supabase session before opening the plan selector.
- If the session is genuinely gone, the customer is returned to the normal sign-in page rather than being shown a misleading Create Account flow.
- No database schema or migration changes are required.
