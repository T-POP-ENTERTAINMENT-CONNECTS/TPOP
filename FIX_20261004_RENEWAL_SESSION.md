# Renewal flow fix — 2026-10-04

Fixed the existing-account paid renewal flow so a signed-in customer can continue a paid plan without logging out.

Changes:
- Renewal order is created/resumed before changing the password, so a fresh sign-in session is not invalidated before the renewal request.
- If the renewal request encounters a stale access token, the frontend refreshes the Supabase session once and retries the same renewal request.
- The 8+ character password field remains on the renewal form.
- If the customer enters the same existing password, the harmless Supabase "same password" response is ignored.
- If the customer enters a new 8+ character password (including upgrading a legacy 7-character password), the new password is saved for future sign-in.
- After password update, the latest session is refreshed before payment-proof upload/payment submission.
- Cache-busting version updated from v2 to v3 for the workspace script.

No new database migration is required for this frontend/session fix. The existing `20261004_existing_account_paid_upgrade.sql` remains included.
