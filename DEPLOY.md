# KOL IDS Cloud App — exact deployment steps

## A. Supabase

1. Create a Supabase project.
2. Open **SQL Editor**.
3. Open `supabase/schema.sql` from this package.
4. Paste all SQL and Run.
5. Open **Authentication → Providers** and ensure Email is enabled.
6. For the first test, keep email confirmation enabled if you want normal production verification. If enabled, sign-up will show a confirmation message before the first login.
7. Copy the Project URL and the browser-safe anon/publishable key from Supabase API settings.

## B. Configure the app

1. Copy `config.example.js` to `config.js`.
2. Put the Project URL in `SUPABASE_URL`.
3. Put the anon/publishable key in `SUPABASE_ANON_KEY`.
4. Do **not** use the service-role key in this file.

## C. Deploy

### Easiest route: Netlify

1. Create a Netlify account.
2. Add a new site using the project folder.
3. Deploy the folder containing `index.html`, `app.js`, `styles.css`, and `config.js`.
4. Open the generated site URL.

### Vercel / Cloudflare Pages

Upload the same static folder. No build command is required.

## D. Custom domain

Recommended:

`app.tpopconnects.com` → cloud app

`tpopconnects.com` → Squarespace landing/marketing site

Then the Squarespace KOL IDS CTA points to `https://app.tpopconnects.com/`.

## E. Smoke test

1. Sign up with a test email.
2. Confirm email if required.
3. Sign in.
4. Confirm a workspace is created.
5. Add one brand.
6. Add one campaign tied to that brand.
7. Add one KOL.
8. Refresh the browser. Data must remain.
9. Sign out and sign in again.
10. Test a second account/organization and verify it cannot see the first organization's records.

## F. Production cutover

Do not turn off the existing Apps Script system yet. Migrate data, run parity tests, and only then switch the Squarespace CTA to the cloud app for customers.
