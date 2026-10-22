# KOL IDS Trial Signup Email Notifications

Scope: only the Supabase `client-sign-up` Edge Function was changed. Existing pages, signup logic, plan catalogue, workspace UI, and other functions are unchanged.

For a successful `TRIAL_7` signup, the function now sends:
- An internal notification to the recipients in `KOL_IDS_PAYMENT_ADMIN_EMAILS`, including customer name, email, organization, plan, duration, and account ID.
- A confirmation email to the customer, including trial duration and a link to sign in.

Both messages use the existing Resend configuration:
- `RESEND_API_KEY`
- `KOL_IDS_EMAIL_FROM`
- `KOL_IDS_PAYMENT_ADMIN_EMAILS` (comma-, semicolon-, or newline-separated email addresses)

Deploy the updated `supabase/functions/client-sign-up/index.ts` to Supabase under the existing function name `client-sign-up`. No database migration is required. Confirm the secrets are configured in Supabase Edge Function Secrets and that the sender domain/address is verified in Resend.

Email delivery is logged separately for the admin and customer. A delivery failure does not undo a successfully created trial account; check the `client-sign-up` Edge Function logs if either message is not received.
