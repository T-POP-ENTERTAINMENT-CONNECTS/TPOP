# Pricing update: 1 / 6 / 12 months — 2026-10-12

- Replaced the public 3-month package with a 1-month plan at THB 9,500.
- Updated the 6-month package to THB 53,500 and the 12-month package to THB 103,000.
- Added `PLAN_1M` with a 30-day term and one seat; existing 6/12-month seat counts remain two/three.
- New signups accept `PLAN_1M`, `PLAN_6M`, and `PLAN_12M`; new signups cannot select legacy `PLAN_3M`.
- The forward migration marks `PLAN_3M` inactive while retaining the row and allowing access/payment settlement for existing subscriptions/orders.
- Updated the public pricing cards, account/order form, export-upgrade prompt, and current schema baseline.

Apply `supabase/migrations/20261012_replace_3m_with_1m.sql` to an existing Supabase project before publishing the updated frontend. The migration has not been applied to a live project from this workspace.
