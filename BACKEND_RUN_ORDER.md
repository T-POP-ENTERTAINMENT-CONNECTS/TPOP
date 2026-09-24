# KOL IDS™ Backend Production Run Order

## 1. Supabase SQL Editor — run once

Run `supabase/schema.sql` in the KOL IDS Supabase project.

It creates/updates:
- plans
- organizations + memberships
- profiles
- customer_orders
- subscriptions
- subscription_events
- trial_redemptions
- platform_admins
- KOL IDS product tables
- hardened RLS
- bootstrap/access RPC
- account provisioning RPC
- admin activation RPC

## 2. Supabase Edge Functions

Deploy:

- `supabase/functions/client-sign-up`
- `supabase/functions/admin-provision`
- `supabase/functions/bootstrap-workspace`
- `supabase/functions/payment-webhook`

The browser only uses the publishable/anon key. Service/secret keys stay inside Edge Functions. Supabase recommends this separation and RLS for browser-accessed data.

## 3. Edge Function secrets

Set:

- `SUPABASE_SERVICE_ROLE_KEY` OR the current `SUPABASE_SECRET_KEYS` map
- `KOL_IDS_PAYMENT_WEBHOOK_SECRET` for payment-webhook

Never commit these secrets to GitHub.

## 4. Create the first platform administrator

Create/sign in the operator's Supabase Auth account, then run:

```sql
insert into public.platform_admins(user_id)
select id from auth.users where lower(email)=lower('YOUR-ADMIN-EMAIL')
on conflict (user_id) do update set active=true;
```

## 5. Frontend behavior after this patch

`KOLIDS.html` now calls `client-sign-up` for Trial / 3M / 6M / 12M.

- Trial: account + organization + active 7-day subscription → automatic sign-in → `KOLIDS.html`.
- Paid: account + organization + pending order + pending subscription → automatic sign-in, but analysis stays locked until payment is confirmed.
- After payment confirmation: refresh/login → `bootstrap_workspace()` returns `access_granted=true` → workspace opens.

## 6. Payment activation

Two supported production paths:

### A. Manual operator approval

Use `admin-provision` with:

```json
{
  "action": "activate_order",
  "order_id": "ORDER-UUID",
  "provider": "manual",
  "provider_reference": "receipt-or-invoice-reference"
}
```

### B. Payment provider webhook

Send a signed POST to:

`/functions/v1/payment-webhook`

with JSON such as:

```json
{
  "event_id": "provider-event-id",
  "order_id": "ORDER-UUID",
  "provider": "your-provider",
  "provider_reference": "payment-reference",
  "payment_status": "paid"
}
```

Signature header:

`x-kol-ids-signature: HMAC_SHA256_HEX(KOL_IDS_PAYMENT_WEBHOOK_SECRET, raw_body)`

The webhook is intentionally provider-neutral until the actual payment provider is selected.
