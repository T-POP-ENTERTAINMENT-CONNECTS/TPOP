# KOL IDS plan entitlement update — 2026-10-15

- 1 Month: THB 9,800, 1 user.
- 6 Months: THB 54,000, 2 users.
- 12 Months: THB 103,000, 2 users (reduced from 3).
- Updated both public plan-page copies, the final plan catalogue repair migration, and the fresh-install schema catalogue.
- Added `supabase/migrations/20261015_plan_12m_two_users.sql` for existing Supabase projects. It changes only the `PLAN_12M` seat entitlement; price and duration are asserted unchanged.
- Historical pricing migrations were intentionally retained as historical records. Apply the new migration to the existing Supabase project and deploy the updated static files.
