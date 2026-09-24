# KOL IDS™ Production Backend v2

## Commercial lifecycle

1. Customer chooses Trial / 3M / 6M / 12M.
2. `client-sign-up` creates the Supabase Auth account server-side and provisions the organization.
3. Trial becomes `active` immediately for 7 days / 1 seat.
4. Paid plans create `customer_orders` + `subscriptions(status=pending)`.
5. Payment confirmation activates the subscription through either:
   - signed `payment-webhook`, or
   - authenticated platform-admin `admin-provision` action `activate_order`.
6. `bootstrap_workspace()` is the canonical access contract for the frontend.
7. Product tables are writable only when the organization has an active, non-expired subscription.
8. Seat limits are derived from the active plan, never from the browser.

## Required Supabase secrets

- `SUPABASE_SERVICE_ROLE_KEY` (legacy) OR `SUPABASE_SECRET_KEYS` (current secret-key map)
- `KOL_IDS_PAYMENT_WEBHOOK_SECRET` for the generic signed payment webhook

## First platform admin

After creating the operator's Supabase Auth account, run once in SQL Editor:

```sql
insert into public.platform_admins(user_id)
select id from auth.users where lower(email)=lower('YOUR-ADMIN-EMAIL');
```

Do not put service-role/secret keys in GitHub Pages or browser JavaScript.
