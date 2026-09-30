# KOL IDS Contact Email — deployment

This update changes the public Contact form from `mailto:` to the Supabase Edge Function `contact-message`.

## Existing secrets — do not recreate
- `RESEND_API_KEY`
- `KOL_IDS_EMAIL_FROM`
- `KOL_IDS_CONTACT_TO` (comma/semicolon/newline separated recipients are supported)

## Deploy
Deploy `supabase/functions/contact-message/index.ts` as the existing function named `contact-message`.
The function is public (`verify_jwt = false`) because the website contact form is public.

## Important
The landing page `index.html` must also be updated because the previous live code used `mailto:` and only opened the visitor's mail client. This package includes that frontend change.
