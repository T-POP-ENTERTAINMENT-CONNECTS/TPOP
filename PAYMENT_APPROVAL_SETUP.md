# KOL IDS™ — Google Form + Email Payment Approval

This release adds the missing one-click approval flow without putting a Supabase service-role key in the browser or Google Form.

## Customer flow

1. Customer creates a paid KOL IDS account.
2. Account/order is created in Supabase with `pending` subscription.
3. Customer clicks **Submit Payment Proof** and submits the Google Form.
4. Google Apps Script sends the admin an email with **APPROVE PAYMENT** / **REJECT** buttons.
5. Admin clicks APPROVE.
6. Apps Script validates the short-lived signed link and calls the `payment-approval` Supabase Edge Function.
7. Edge Function activates the existing subscription for the same organization/order.
8. Customer receives confirmation email and can sign in immediately.
9. Existing campaign/workspace data stays attached to the same organization; approval does not create a new workspace.

## One-time setup

### A. Supabase
Deploy the new function:

```bash
supabase functions deploy payment-approval
```

Set this Edge Function secret:

```text
KOL_IDS_PAYMENT_APPROVAL_SECRET=<same random secret used by Apps Script>
```

The function also requires the existing service-role/secret key already used by the backend.

### B. Google Apps Script
Create a small Apps Script project and paste:

`legacy-appscript/KOL_IDS_PAYMENT_APPROVAL.gs`

Set Script Properties:

```text
KOL_IDS_SUPABASE_URL=https://xdmtuoyeiyhkwiwozaut.supabase.co
KOL_IDS_PAYMENT_APPROVAL_SECRET=<same value as Supabase Edge Function secret>
KOL_IDS_PAYMENT_ADMIN_EMAILS=tpopentconex@gmail.com,tpopconnectsbiz@gmail.com
```

Run:

```text
KOL_IDS_PAYMENT_SETUP()
```

Then deploy the project as a Web App:

- Execute as: Me
- Who has access: Anyone

After deployment, run `KOL_IDS_PAYMENT_SETUP()` once more so the deployed Web App URL is stored.

The function creates the payment-proof Google Form and its form-submit trigger automatically. Both configured admin emails receive the payment-review email with the same APPROVE / REJECT links. Either admin can act independently; the second admin does not need to approve.

### C. Frontend
Copy the generated Google Form published URL into:

- `config.js` → `PAYMENT_FORM_URL`
- `KOLIDS.html` → `window.KOL_IDS_CONFIG.PAYMENT_FORM_URL`

Then redeploy the site.

## Security notes

- No Supabase service-role key is stored in HTML or Google Form.
- Approval links are HMAC-signed and expire after 24 hours.
- The Edge Function independently validates the shared approval secret.
- Re-approving an already-approved order is idempotent.
- Rejected/cancelled orders cannot be activated through the same approval link.
