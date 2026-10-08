# KOL IDS — 2026-10-08 Paid Upgrade Hardening

- Fixed the expired-trial → paid-plan continuation path for existing Auth accounts.
- Added a production migration that refreshes the paid-plan catalog and the 6-argument provisioning RPC.
- Corrected the pending-order compatibility query to use allowed payment_status values (`unpaid`, `pending`).
- Added a safe Edge Function fallback when PostgREST has not refreshed the provisioning RPC yet.
- Paid plans remain payment-gated; workspace access is granted only after payment approval.
