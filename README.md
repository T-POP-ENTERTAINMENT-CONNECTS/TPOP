# client-sign-up

Creates a KOL IDS customer Auth account and atomically provisions the application-side organization/order/subscription state through `provision_customer_account`.

- `TRIAL_7`: activates immediately for 7 days, one seat, one redemption per email.
- Paid plans: creates the account, organization, pending order and pending subscription. Access is not granted until payment is approved by `admin-provision` or a signed `payment-webhook` event.
- Requires Supabase service/secret key in the Edge Function environment. Never put that key in GitHub or browser code.
