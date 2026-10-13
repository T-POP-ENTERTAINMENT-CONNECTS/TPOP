# Pricing refresh — 2026-10-13 (revision 2)

- 1 month (1 user): THB 9,800.
- 6 months (2 users): THB 54,000.
- 12 months (3 users): THB 103,000.
- Updated both public pricing pages, the upgrade/export prompt, and the fresh-install Supabase plan catalogue.
- Existing customer orders retain their recorded amount. New orders use the updated `public.plans.price_thb` values after migration.

## Deployment

1. Deploy the updated static application files.
2. Apply `supabase/migrations/20261013_update_plan_prices_9800_54000_103000.sql` to the existing Supabase project.
3. Do not rerun prior historical pricing migrations; they contain previous prices by design.
