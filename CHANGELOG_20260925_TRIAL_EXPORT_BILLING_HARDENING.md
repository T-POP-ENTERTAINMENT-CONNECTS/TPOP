# KOL IDS — Trial Export + Paid Signup Billing Hardening

## Changes

- Locked JSON report export for Trial accounts behind a paid-plan popup.
- Added CSV report export for paid accounts.
- Added paid-plan billing/document collection during signup.
- Added individual / juristic billing entity selection.
- Persisted billing data atomically to `customer_orders.payload.billing`.
- Added protected payment-order details action for admin billing preview.
- Added billing details to payment-review admin email.
- Added active-subscription enforcement inside the Intelligence Edge Function.
- Added billing migration and PostgREST schema reload.
