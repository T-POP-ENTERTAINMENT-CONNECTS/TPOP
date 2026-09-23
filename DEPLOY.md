# KOL IDS™ Cloud Deploy

## 1. Supabase

Run `supabase/schema.sql` once in the Supabase SQL Editor. Then enable Email/Password authentication.

## 2. Client configuration

Edit `config.js`:

```js
window.KOL_IDS_CONFIG = {
  SUPABASE_URL: 'https://YOUR_PROJECT.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR_ANON_OR_PUBLISHABLE_KEY',
  PAYMENT_URL_3M: '',
  PAYMENT_URL_6M: '',
  PAYMENT_URL_12M: ''
};
```

The payment URLs are optional. Leave them blank until a real payment/order endpoint exists.

## 3. Static hosting

Upload the repository to GitHub and connect the repository to your static host. No Apps Script deployment is required for the application UI/data layer.

## 4. Smoke test

- Sign up
- Confirm email if Supabase requires it
- Sign in
- Confirm a workspace and TRIAL license appear
- Add a Brand
- Add a Campaign
- Add a KOL with all evidence fields
- Open KOL Intelligence and click Run analysis
- Verify Decision rows are created
- Add Performance and Outcome
- Open Executive Report
- Refresh and sign in again; records should persist

## 5. Security

Do not put service-role credentials in browser files. RLS is the security boundary. The schema allows users to read their license even after expiry so the UI can identify the expired state, while application data operations require an active license.
